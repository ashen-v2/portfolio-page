import { useState } from "react";

type Op = "+" | "-" | "×" | "÷";

function format(value: number) {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Math.round(value * 1e10) / 1e10;
  const text = String(rounded);
  return text.length > 12 ? value.toExponential(6) : text;
}

function apply(left: number, right: number, op: Op) {
  if (op === "+") return left + right;
  if (op === "-") return left - right;
  if (op === "×") return left * right;
  return right === 0 ? Number.NaN : left / right;
}

const KEYS = [
  { label: "C", kind: "clear" as const, span: 3 },
  { label: "÷", kind: "op" as const, op: "÷" as const },
  { label: "7", kind: "digit" as const },
  { label: "8", kind: "digit" as const },
  { label: "9", kind: "digit" as const },
  { label: "×", kind: "op" as const, op: "×" as const },
  { label: "4", kind: "digit" as const },
  { label: "5", kind: "digit" as const },
  { label: "6", kind: "digit" as const },
  { label: "−", kind: "op" as const, op: "-" as const },
  { label: "1", kind: "digit" as const },
  { label: "2", kind: "digit" as const },
  { label: "3", kind: "digit" as const },
  { label: "+", kind: "op" as const, op: "+" as const },
  { label: "0", kind: "digit" as const, span: 2 },
  { label: ".", kind: "digit" as const },
  { label: "=", kind: "eq" as const },
];

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);

  function inputDigit(digit: string) {
    setDisplay((current) => {
      if (fresh || current === "Error" || (current === "0" && digit !== ".")) {
        return digit === "." ? "0." : digit;
      }
      if (digit === "." && current.includes(".")) return current;
      if (current.replace("-", "").replace(".", "").length >= 12) return current;
      return current + digit;
    });
    setFresh(false);
  }

  function chooseOp(next: Op) {
    if (display === "Error") {
      setDisplay("0");
      setStored(null);
      setOp(next);
      setFresh(true);
      return;
    }
    const value = Number(display);
    if (stored !== null && op && !fresh) {
      const result = apply(stored, value, op);
      setStored(Number.isFinite(result) ? result : null);
      setDisplay(format(result));
      setOp(Number.isFinite(result) ? next : null);
    } else {
      setStored(value);
      setOp(next);
    }
    setFresh(true);
  }

  function equals() {
    if (stored === null || !op || display === "Error") return;
    const result = apply(stored, Number(display), op);
    setDisplay(format(result));
    setStored(null);
    setOp(null);
    setFresh(true);
  }

  function clear() {
    setDisplay("0");
    setStored(null);
    setOp(null);
    setFresh(true);
  }

  function press(key: (typeof KEYS)[number]) {
    if (key.kind === "clear") clear();
    else if (key.kind === "digit") inputDigit(key.label);
    else if (key.kind === "eq") equals();
    else if (key.kind === "op") chooseOp(key.op);
  }

  return (
    <div className="tool-panel calc-tool" id="calculator">
      <div className="calc">
        <p className="calc-display" aria-live="polite" aria-label="Calculator display">
          {display}
        </p>
        <div className="calc-keys">
          {KEYS.map((key) => (
            <button
              key={key.label}
              type="button"
              className={`calc-key calc-key-${key.kind}`}
              style={key.span ? { gridColumn: `span ${key.span}` } : undefined}
              onClick={() => press(key)}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
