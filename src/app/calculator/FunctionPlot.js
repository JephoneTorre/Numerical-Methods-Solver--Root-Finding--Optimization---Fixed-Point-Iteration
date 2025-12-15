"use client";

import { useEffect, useRef } from "react";
import { evaluate } from "mathjs";

// Added 'mode' prop
export default function FunctionPlot({ func, a, b, highlightX = null, mode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!func || isNaN(a) || isNaN(b)) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const W = 650;
    const H = 380;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const pad = 50;
    const N = 500;

    const xs = [];
    const ys = [];
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0; i <= N; i++) {
      const x = a + (i / N) * (b - a);
      try {
        const y = evaluate(func, { x });
        if (!isFinite(y)) continue;
        xs.push(x);
        ys.push(y);
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      } catch {}
    }

    if (!ys.length) return;

    const mapX = (x) => pad + ((x - a) / (b - a)) * (W - 2 * pad);
    const mapY = (y) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - 2 * pad);

    // ---------- AXES ----------
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(pad, H - pad);
    ctx.lineTo(W - pad, H - pad);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, H - pad);
    ctx.stroke();

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#000";

    // ---------- X TICKS ----------
    const xTicks = Math.min(10, Math.floor(W / 60));
    for (let i = 0; i <= xTicks; i++) {
      const xVal = a + (i / xTicks) * (b - a);
      const px = mapX(xVal);
      ctx.beginPath();
      ctx.moveTo(px, H - pad);
      ctx.lineTo(px, H - pad + 5);
      ctx.stroke();
      ctx.fillText(xVal.toFixed(2), px - 12, H - pad + 18);
    }

    // ---------- Y TICKS ----------
    const yTicks = Math.min(8, Math.floor(H / 40));
    for (let i = 0; i <= yTicks; i++) {
      const yVal = yMin + (i / yTicks) * (yMax - yMin);
      const py = mapY(yVal);
      ctx.beginPath();
      ctx.moveTo(pad - 5, py);
      ctx.lineTo(pad, py);
      ctx.stroke();
      ctx.fillText(yVal.toFixed(2), 5, py + 4);
    }

    // ---------- LABELS ----------
    ctx.fillText(`x ∈ [${a}, ${b}]`, W / 2 - 40, H - 10);
    ctx.fillText("f(x)", 10, 15);

    // ---------- FUNCTION CURVE ----------
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    xs.forEach((x, i) => {
      const px = mapX(x);
      const py = mapY(ys[i]);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // ---------- HIGHLIGHT ROOT/MINIMIZER ----------
    if (highlightX !== null && isFinite(highlightX)) {
      try {
        const y = evaluate(func, { x: highlightX });
        const px = mapX(highlightX);
        const py = mapY(y);
        
        // Determine the correct label based on mode
        const highlightLabel = (mode === 'optimal' || mode === 'gss') ? 'Minimizer' : 'Root';

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Use the conditional label
        ctx.fillText(`${highlightLabel}: (${highlightX.toFixed(4)}, ${y.toFixed(4)})`, px + 6, py - 6);
      } catch {}
    }
  }, [func, a, b, highlightX, mode]); // Added 'mode' to dependency array

  return (
    <canvas
      ref={canvasRef}
      width={650}
      height={380}
      className="border rounded mt-6 bg-white"
    />
  );
}