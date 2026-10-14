import { useEffect, useState } from "react";
import { bootLines } from "../data/content";

type BootScreenProps = {
  onDone: () => void;
};

export function BootScreen({ onDone }: BootScreenProps) {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }

    if (visibleCount < bootLines.length) {
      const id = window.setTimeout(() => setVisibleCount((n) => n + 1), 280);
      return () => window.clearTimeout(id);
    }

    const done = window.setTimeout(onDone, 700);
    return () => window.clearTimeout(done);
  }, [visibleCount, onDone]);

  return (
    <div className="boot" role="status" aria-live="polite">
      {bootLines.map((line, index) => (
        <div key={line} className={`boot-line${index < visibleCount ? " on" : ""}`}>
          {line}
        </div>
      ))}
      <button type="button" className="btn boot-skip" onClick={onDone}>
        SKIP
      </button>
    </div>
  );
}
