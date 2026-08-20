import { useEffect, useRef } from "react";

// Gentle snowfall for the hero, drawn on a canvas sized to its parent.
// Decorative only: pointer-events none, aria-hidden, skipped entirely for
// prefers-reduced-motion, and paused while the tab is hidden so it never
// burns battery in a background tab. Flake count scales with width.
export default function Snow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Flake = { x: number; y: number; r: number; vy: number; vx: number; phase: number; o: number };
    let flakes: Flake[] = [];
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const spawn = (yRandom: boolean): Flake => ({
      x: Math.random() * w,
      y: yRandom ? Math.random() * h : -8,
      r: 1 + Math.random() * 3,
      vy: 0.5 + Math.random() * 1.1,
      vx: -0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      o: 0.35 + Math.random() * 0.5,
    });

    const size = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(260, Math.max(80, w / 6)));
      flakes = Array.from({ length: count }, () => spawn(true));
    };

    let t = 0;
    const tick = () => {
      if (!running) return;
      t += 0.008;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx + Math.sin(t * 2 + f.phase) * 0.22;
        if (f.y > h + 6) Object.assign(f, spawn(false));
        if (f.x < -6) f.x = w + 6;
        if (f.x > w + 6) f.x = -6;
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    size();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(size);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
