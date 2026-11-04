import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

const STORAGE_KEY = "console-canvas";
const WIDTH = 160;
const HEIGHT = 120;
const PAPER = "#fff8e8";

const COLORS = [
  { id: "ink", label: "Ink", value: "#1a2140" },
  { id: "red", label: "Red", value: "#e23b4a" },
  { id: "gold", label: "Gold", value: "#ffe14a" },
  { id: "cyan", label: "Cyan", value: "#7ad0ff" },
  { id: "mint", label: "Mint", value: "#2fbe4a" },
  { id: "white", label: "White", value: "#fff8e8" },
];

export function CanvasPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(COLORS[0].value);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    context.fillStyle = PAPER;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const img = new Image();
      img.onload = () => {
        if (dirty.current) return;
        context.drawImage(img, 0, 0, WIDTH, HEIGHT);
      };
      img.src = saved;
    } catch {
      /* start blank */
    }
  }, []);

  function save() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      localStorage.setItem(STORAGE_KEY, canvas.toDataURL("image/png"));
    } catch {
      /* keep the drawing for this visit */
    }
  }

  function stamp(x: number, y: number) {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const prev = last.current ?? { x, y };
    const dx = x - prev.x;
    const dy = y - prev.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
    context.fillStyle = colorRef.current;
    for (let i = 0; i <= steps; i += 1) {
      const px = Math.floor(prev.x + (dx * i) / steps);
      const py = Math.floor(prev.y + (dy * i) / steps);
      context.fillRect(px - 1, py - 1, 3, 3);
    }
    last.current = { x, y };
  }

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  }

  function onDown(event: PointerEvent<HTMLCanvasElement>) {
    dirty.current = true;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* the stroke still follows the pointer */
    }
    drawing.current = true;
    last.current = null;
    const next = point(event);
    if (next) stamp(next.x, next.y);
  }

  function onMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const next = point(event);
    if (next) stamp(next.x, next.y);
  }

  function onUp() {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    save();
  }

  function clear() {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    context.fillStyle = PAPER;
    context.fillRect(0, 0, WIDTH, HEIGHT);
    save();
  }

  return (
    <div className="tool-panel canvas-tool" id="canvas">
      <div className="canvas-stage">
        <canvas
          ref={canvasRef}
          aria-label="Drawing canvas"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </div>
      <div className="canvas-tools">
        <div className="canvas-swatches" role="radiogroup" aria-label="Ink color">
          {COLORS.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              className="swatch"
              style={{ background: swatch.value }}
              aria-label={swatch.label}
              aria-checked={color === swatch.value}
              role="radio"
              onClick={() => setColor(swatch.value)}
            />
          ))}
        </div>
        <button type="button" className="canvas-clear" onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
