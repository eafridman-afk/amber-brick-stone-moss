/**
 * Continuum event tape — 2D strip under the 3D view.
 * X = frame index, Y = minDistNm (+ optional U_primary), markers for prox/HH peaks.
 * Clamp rulers + tape zoom/pan. Physics-agnostic visualization only.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { simEngine } from "@/lib/moleculo/engine";
import { useSimStore } from "@/stores/sim-store";
import { FRAME_NS } from "@/lib/moleculo/types";

const H = 120;
const PAD_L = 36;
const PAD_R = 10;
const PAD_T = 10;
const PAD_B = 22;

export function EventTape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventLogLen = useSimStore((s) => s.eventLogLen);
  const eventScrub = useSimStore((s) => s.eventScrub);
  const eventRecording = useSimStore((s) => s.eventRecording);
  const clampStart = useSimStore((s) => s.clampStart);
  const clampEnd = useSimStore((s) => s.clampEnd);
  const tapeZoomLevel = useSimStore((s) => s.tapeZoomLevel);
  const tapePanOffset = useSimStore((s) => s.tapePanOffset);
  const setEventScrub = useSimStore((s) => s.setEventScrub);
  const setClampStart = useSimStore((s) => s.setClampStart);
  const setClampEnd = useSimStore((s) => s.setClampEnd);
  const panTapeBy = useSimStore((s) => s.panTapeBy);

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);
  const dragRef = useRef<null | "playhead" | "i0" | "i1" | "pan">(null);
  const panOrigin = useRef({ x: 0, pan: 0 });

  const viewport = useMemo(() => {
    void tapeZoomLevel;
    void tapePanOffset;
    void eventLogLen;
    return simEngine.getTapeViewport();
  }, [tapeZoomLevel, tapePanOffset, eventLogLen, eventScrub, clampStart, clampEnd]);

  const frameToX = useCallback(
    (f: number, w: number) => {
      const { start, end } = viewport;
      const span = Math.max(1, end - start);
      return PAD_L + ((f - start) / span) * (w - PAD_L - PAD_R);
    },
    [viewport],
  );

  const xToFrame = useCallback(
    (x: number, w: number) => {
      const { start, end } = viewport;
      const span = Math.max(1, end - start);
      const t = (x - PAD_L) / Math.max(1, w - PAD_L - PAD_R);
      return Math.round(start + t * span);
    },
    [viewport],
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const cssW = parent?.clientWidth ?? 640;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = cssW;
    const h = H;

    // background
    ctx.fillStyle = "#0a0e16";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

    const n = simEngine.eventLog.length;
    if (n === 0) {
      ctx.fillStyle = "rgba(148,163,184,0.65)";
      ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("No recording — press Record to capture continuum frames", PAD_L, h / 2);
      return;
    }

    const { start, end } = viewport;
    const frames = simEngine.eventLog;
    let minY = Infinity;
    let maxY = -Infinity;
    let minU = Infinity;
    let maxU = -Infinity;
    for (let i = start; i <= end; i++) {
      const f = frames[i];
      if (!f) continue;
      if (f.minDistNm > 0) {
        minY = Math.min(minY, f.minDistNm);
        maxY = Math.max(maxY, f.minDistNm);
      }
      minU = Math.min(minU, f.U_primary);
      maxU = Math.max(maxU, f.U_primary);
    }
    if (!Number.isFinite(minY)) {
      minY = 0;
      maxY = 3;
    }
    if (maxY - minY < 1e-6) {
      minY -= 0.2;
      maxY += 0.2;
    }
    if (!Number.isFinite(minU) || maxU - minU < 1e-9) {
      minU = -1;
      maxU = 1;
    }

    const yDist = (d: number) => {
      const t = (d - minY) / (maxY - minY);
      return PAD_T + (1 - t) * (h - PAD_T - PAD_B);
    };
    const yU = (u: number) => {
      const t = (u - minU) / (maxU - minU);
      return PAD_T + (1 - t) * (h - PAD_T - PAD_B);
    };

    // grid
    ctx.strokeStyle = "rgba(51,65,85,0.55)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 4; g++) {
      const yy = PAD_T + ((h - PAD_T - PAD_B) * g) / 3;
      ctx.beginPath();
      ctx.moveTo(PAD_L, yy);
      ctx.lineTo(w - PAD_R, yy);
      ctx.stroke();
    }

    // clamp band
    if (clampStart != null && clampEnd != null) {
      const x0 = frameToX(Math.min(clampStart, clampEnd), w);
      const x1 = frameToX(Math.max(clampStart, clampEnd), w);
      ctx.fillStyle = "rgba(251,191,36,0.12)";
      ctx.fillRect(x0, PAD_T, Math.max(1, x1 - x0), h - PAD_T - PAD_B);
    }

    // U_primary (secondary series)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(167,139,250,0.55)";
    ctx.lineWidth = 1.25;
    let startedU = false;
    for (let i = start; i <= end; i++) {
      const f = frames[i]!;
      const x = frameToX(i, w);
      const y = yU(f.U_primary);
      if (!startedU) {
        ctx.moveTo(x, y);
        startedU = true;
      } else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // minDistNm (primary series)
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.75;
    let started = false;
    for (let i = start; i <= end; i++) {
      const f = frames[i]!;
      const d = f.minDistNm > 0 ? f.minDistNm : minY;
      const x = frameToX(i, w);
      const y = yDist(d);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // event peak markers
    for (let i = start; i <= end; i++) {
      const f = frames[i]!;
      if (!f.proxFlag && !f.hhFlag) continue;
      const x = frameToX(i, w);
      ctx.beginPath();
      ctx.strokeStyle = f.proxFlag ? "#f472b6" : "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.moveTo(x, PAD_T);
      ctx.lineTo(x, h - PAD_B);
      ctx.stroke();
      ctx.fillStyle = f.proxFlag ? "#f472b6" : "#fbbf24";
      ctx.beginPath();
      ctx.arc(x, PAD_T + 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // clamp rulers
    if (clampStart != null) {
      const x = frameToX(clampStart, w);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, PAD_T);
      ctx.lineTo(x, h - PAD_B);
      ctx.stroke();
      ctx.fillStyle = "#fde68a";
      ctx.font = "9px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`i₀=${clampStart}`, x + 3, PAD_T + 10);
    }
    if (clampEnd != null) {
      const x = frameToX(clampEnd, w);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, PAD_T);
      ctx.lineTo(x, h - PAD_B);
      ctx.stroke();
      ctx.fillStyle = "#fde68a";
      ctx.font = "9px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`i₁=${clampEnd}`, x + 3, PAD_T + 20);
    }

    // playhead
    const ph = eventScrub ?? n - 1;
    if (ph >= start && ph <= end) {
      const x = frameToX(ph, w);
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, PAD_T);
      ctx.lineTo(x, h - PAD_B);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.moveTo(x, PAD_T);
      ctx.lineTo(x - 5, PAD_T - 6);
      ctx.lineTo(x + 5, PAD_T - 6);
      ctx.closePath();
      ctx.fill();
    }

    // axes labels
    ctx.fillStyle = "rgba(148,163,184,0.85)";
    ctx.font = "9px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(`${minY.toFixed(2)}`, 2, h - PAD_B);
    ctx.fillText(`${maxY.toFixed(2)}`, 2, PAD_T + 8);
    ctx.fillText(`f ${start}`, PAD_L, h - 6);
    ctx.fillText(`f ${end}`, w - PAD_R - 28, h - 6);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("minDist nm", PAD_L, 9);
    ctx.fillStyle = "rgba(167,139,250,0.85)";
    ctx.fillText("U_primary", PAD_L + 72, 9);
    if (eventRecording) {
      ctx.fillStyle = "#f87171";
      ctx.fillText("● REC", w - 48, 9);
    }
  }, [
    viewport,
    eventScrub,
    clampStart,
    clampEnd,
    eventRecording,
    eventLogLen,
    frameToX,
  ]);

  useEffect(() => {
    draw();
    const id = window.setInterval(draw, eventRecording ? 100 : 250);
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", onResize);
    };
  }, [draw, eventRecording]);

  const onPointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !eventLogLen) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    const f = Math.max(0, Math.min(eventLogLen - 1, xToFrame(x, w)));

    // near clamp rulers?
    const near = (idx: number | null) =>
      idx != null && Math.abs(frameToX(idx, w) - x) < 8;

    if (e.shiftKey && clampStart != null && near(clampStart)) {
      dragRef.current = "i0";
    } else if (e.shiftKey && clampEnd != null && near(clampEnd)) {
      dragRef.current = "i1";
    } else if (e.altKey || e.button === 1) {
      dragRef.current = "pan";
      panOrigin.current = { x: e.clientX, pan: simEngine.tapePanOffset };
    } else if (clampStart != null && near(clampStart)) {
      dragRef.current = "i0";
    } else if (clampEnd != null && near(clampEnd)) {
      dragRef.current = "i1";
    } else {
      dragRef.current = "playhead";
      setEventScrub(f);
    }
    canvas.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !eventLogLen) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = rect.width;
    const f = Math.max(0, Math.min(eventLogLen - 1, xToFrame(x, w)));
    const frame = simEngine.eventLog[f];
    if (frame) {
      const kinds: string[] = [];
      if (frame.proxFlag) kinds.push("prox");
      if (frame.hhFlag) kinds.push("HH");
      setTooltip({
        x: e.clientX - rect.left,
        y: Math.max(8, y - 8),
        text: `f=${f} · d=${frame.minDistNm > 0 ? frame.minDistNm.toFixed(3) : "—"} nm · U=${frame.U_primary.toFixed(2)} · θ=${frame.theta.toFixed(2)}${kinds.length ? ` · ${kinds.join("+")}` : ""} · t≈${f * FRAME_NS} ns`,
      });
    }

    if (!dragRef.current) return;
    if (dragRef.current === "playhead") setEventScrub(f);
    else if (dragRef.current === "i0") setClampStart(f);
    else if (dragRef.current === "i1") setClampEnd(f);
    else if (dragRef.current === "pan") {
      const dx = e.clientX - panOrigin.current.x;
      const { start, end } = viewport;
      const span = Math.max(1, end - start);
      const framesPerPx = span / Math.max(1, w - PAD_L - PAD_R);
      const next = panOrigin.current.pan - Math.round(dx * framesPerPx);
      simEngine.tapePanOffset = next;
      useSimStore.getState().syncFromEngine();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!eventLogLen) return;
    e.preventDefault();
    // fine zoom via pan when zoomed, or change zoom level steps
    if (e.ctrlKey || e.metaKey) {
      const levels = ["100", "75", "50", "25"] as const;
      const cur = levels.indexOf(tapeZoomLevel as (typeof levels)[number]);
      const next = e.deltaY > 0 ? Math.min(3, cur + 1) : Math.max(0, cur - 1);
      useSimStore.getState().setTapeZoomLevel(levels[next]!);
    } else {
      panTapeBy(e.deltaY > 0 ? 4 : -4);
    }
  };

  return (
    <div className="relative w-full border-t border-border bg-[#070a10]">
      <div className="flex items-center justify-between px-2 pt-1">
        <span className="text-[10px] font-medium tracking-wide text-muted uppercase">
          Event tape · continuum recording window
        </span>
        <span className="text-[9px] text-subtle">
          drag scrub · drag rulers · Alt-drag pan · Ctrl-wheel zoom · cyan=minDist · violet=U
        </span>
      </div>
      <div className="relative w-full px-1 pb-1">
        <canvas
          ref={canvasRef}
          className="block w-full cursor-crosshair touch-none rounded-md"
          height={H}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setTooltip(null)}
          onWheel={onWheel}
        />
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 max-w-[min(90%,24rem)] rounded border border-border bg-panel/95 px-2 py-1 text-[9px] text-fg shadow-lg"
            style={{ left: Math.min(tooltip.x + 8, 200), top: tooltip.y }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    </div>
  );
}
