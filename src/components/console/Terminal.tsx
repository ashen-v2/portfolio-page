import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import type { SiteContent } from "../../data/content";
import { runCommand } from "./commands";
import type { ServiceState } from "./services";
import type { ToolId } from "./modules";

type Line = { id: number; kind: "boot" | "banner" | "cmd" | "trace" | "out" | "mark"; text: string };

type Beat = { kind: "trace" | "out"; text: string; pause: number };

function shellUser(content: SiteContent) {
  const handle = content.profile.handle.trim().toLowerCase();
  return handle || "ashen";
}

function promptFor(user: string) {
  return `${user}@portfolio:~$`;
}

function beat(kind: Beat["kind"], text: string, pause: number): Beat {
  return { kind, text, pause };
}

function provisionScript(user: string): Beat[] {
  const trace = (text: string, pause = 170) => beat("trace", `+ ${text}`, pause);
  const out = (text: string, pause = 90) => beat("out", text, pause);
  return [
    out("# set -euxo pipefail", 140),
    trace("apt-get install -y curl git nginx openssh-server", 220),
    out("installed: curl git nginx openssh-server", 110),
    trace("ufw default deny incoming", 180),
    trace("ufw allow 22,80,443/tcp", 150),
    trace("ufw --force enable", 160),
    out("Firewall is active and enabled on system startup", 120),
    trace("nmap -sT -p 22,80,443 127.0.0.1", 220),
    out("22/tcp open ssh", 80),
    out("80/tcp open http", 70),
    out("443/tcp closed https", 110),
    trace("groupadd --system ops", 180),
    out("%ops ALL=(ALL) NOPASSWD: systemctl, journalctl, nginx", 100),
    trace("visudo -cf /etc/sudoers.d/ops", 170),
    out("/etc/sudoers.d/ops: parsed OK", 90),
    trace(`useradd -m -s /bin/bash -G ops ${user}`, 200),
    out(`uid=1000(${user}) groups=1000(${user}),997(ops)`, 100),
    trace(`exec su - ${user}`, 180),
    out(promptFor(user), 280),
  ];
}

const HELLO = ["█  █", "█  █", "████", "█  █", "█  █"];
const E = ["████", "█   ", "███ ", "█   ", "████"];
const L = ["█   ", "█   ", "█   ", "█   ", "████"];
const O = [" ██ ", "█  █", "█  █", "█  █", " ██ "];

const BANNER = HELLO.map((_, row) => [HELLO, E, L, L, O].map((glyph) => glyph[row]).join(" "));

function openingLines(content: SiteContent): Line[] {
  const user = shellUser(content);
  const rows: Omit<Line, "id">[] = [
    ...BANNER.map((text) => ({ kind: "banner" as const, text })),
    { kind: "out", text: content.profile.name },
    { kind: "boot", text: `${promptFor(user)} type help` },
  ];
  return rows.map((row, index) => ({ id: index + 1, ...row }));
}

function lineClass(kind: Line["kind"]) {
  if (kind === "banner") return "terminal-banner";
  if (kind === "trace") return "terminal-trace";
  if (kind === "mark") return "terminal-mark";
  if (kind === "out") return "terminal-out";
  return "terminal-cmd";
}

type TerminalProps = {
  content: SiteContent;
  services: ServiceState;
  onOpenArticle: (id: string) => void;
  onOpenTool: (id: ToolId) => void;
  onInstall: (id: keyof ServiceState, installed: boolean) => void;
  onPower: (id: keyof ServiceState, enabled: boolean) => void;
  skipBoot: boolean;
  onBooted: () => void;
};

export function Terminal({
  content,
  services,
  onOpenArticle,
  onOpenTool,
  onInstall,
  onPower,
  skipBoot,
  onBooted,
}: TerminalProps) {
  const inputId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(2);
  const [lines, setLines] = useState<Line[]>([
    { id: 1, kind: "trace", text: "root@portfolio:~# bash provision.sh" },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [booting, setBooting] = useState(true);

  const stickToTop = useRef(true);
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (stickToTop.current) {
      stickToTop.current = false;
      log.scrollTo(0, 0);
      return;
    }
    log.scrollTo(0, log.scrollHeight);
  }, [lines]);

  const onBootedRef = useRef(onBooted);
  onBootedRef.current = onBooted;

  useEffect(() => {
    const welcome = openingLines(content);
    if (skipBoot) {
      nextId.current = welcome.length + 1;
      stickToTop.current = true;
      setLines(welcome);
      setBooting(false);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nextId.current = welcome.length + 1;
      stickToTop.current = true;
      setLines(welcome);
      setBooting(false);
      onBootedRef.current();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    let elapsed = 180;
    for (const step of provisionScript(shellUser(content))) {
      elapsed += step.pause;
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        setLines((current) => [
          ...current,
          { id: nextId.current++, kind: step.kind, text: step.text },
        ]);
      }, elapsed);
      timers.push(timer);
    }
    timers.push(
      window.setTimeout(() => {
        if (cancelled) return;
        nextId.current = welcome.length + 1;
        stickToTop.current = true;
        setLines(welcome);
        setBooting(false);
        onBootedRef.current();
      }, elapsed + 400),
    );
    return () => {
      cancelled = true;
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [content, skipBoot]);

  useEffect(() => {
    if (!booting) inputRef.current?.focus();
  }, [booting]);

  function push(extra: Line[]) {
    setLines((current) => [...current, ...extra]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (booting) return;
    const raw = value;
    const trimmed = raw.trim();
    setValue("");
    setCursor(null);
    if (!trimmed) return;

    setHistory((current) => [...current, trimmed]);
    const effect = runCommand(trimmed, content, services);
    const commandLine: Line = {
      id: nextId.current++,
      kind: "cmd",
      text: `${promptFor(shellUser(content))} ${trimmed}`,
    };
    if (effect.kind === "clear") {
      setLines([]);
      return;
    }
    if (effect.kind === "open") {
      onOpenArticle(effect.id);
      return;
    }
    if (effect.kind === "tool") {
      push([commandLine]);
      onOpenTool(effect.id);
      return;
    }
    if (effect.kind === "install") onInstall(effect.id, effect.installed);
    if (effect.kind === "power") onPower(effect.id, effect.enabled);
    const printed = effect.kind === "print" || effect.kind === "install" || effect.kind === "power" ? effect.lines : [];
    push([
      commandLine,
      ...printed.map((text) => ({
        id: nextId.current++,
        kind: (text === "apt list     extra packages" ? "mark" : "out") as "mark" | "out",
        text,
      })),
    ]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!history.length) return;
    if (event.key === "ArrowUp") {
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next] ?? "");
      return;
    }
    if (cursor === null) return;
    const next = cursor + 1;
    if (next >= history.length) {
      setCursor(null);
      setValue("");
      return;
    }
    setCursor(next);
    setValue(history[next] ?? "");
  }

  return (
    <div className="terminal" id="terminal" aria-busy={booting}>
      <div className="terminal-log" ref={logRef} role="log" aria-live={booting ? "off" : "polite"}>
        {lines.map((line) => (
          <p
            key={line.id}
            className={lineClass(line.kind)}
            aria-hidden={line.kind === "banner" ? true : undefined}
          >
            {line.text || "\u00a0"}
          </p>
        ))}
      </div>
      <form className="terminal-form" onSubmit={submit}>
        <label className="terminal-prompt" htmlFor={inputId}>
          $
        </label>
        <input
          id={inputId}
          ref={inputRef}
          value={value}
          disabled={booting}
          aria-label="Terminal command"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="off"
          enterKeyHint="go"
          onChange={(event) => {
            setCursor(null);
            setValue(event.target.value);
          }}
          onKeyDown={onKeyDown}
        />
      </form>
    </div>
  );
}
