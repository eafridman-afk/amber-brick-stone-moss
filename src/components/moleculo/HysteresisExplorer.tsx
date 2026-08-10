import { useMemo } from "react";
import { Activity, Play, Square, Trash2 } from "lucide-react";
import { useSimStore } from "@/stores/sim-store";
import {
  HIS_SWITCH_OFF_THRESHOLD,
  HIS_SWITCH_ON_THRESHOLD,
} from "@/lib/moleculo/types";
import {
  HYST_META,
  hysteresisGap,
  pureHHCurve,
} from "@/lib/moleculo/hysteresis";

type StateDot = { x: number; y: number; on: boolean; dir: "up" | "down" | "unknown" };
type CrossMark = { x: number; y: number; kind: "on" | "off" };

/**
 * Didactic hysteresis explorer for the pH-gated His switch.
 * Dual thresholds, path-colored trail, pure-HH reference, auto pH sweep, ΔpH gap.
 */
export function HysteresisExplorer() {
  const pH = useSimStore((s) => s.pH);
  const continuousScore = useSimStore((s) => s.continuousScore);
  const switchDisplayOn = useSimStore((s) => s.switchDisplayOn);
  const switchOverride = useSimStore((s) => s.switchOverride);
  const hystHistory = useSimStore((s) => s.hystHistory);
  const lastPhDirection = useSimStore((s) => s.lastPhDirection);
  const lastCrossing = useSimStore((s) => s.lastCrossing);
  const crossings = useSimStore((s) => s.crossings);
  const sweepActive = useSimStore((s) => s.sweepActive);
  const bandRegion = useSimStore((s) => s.hystBandRegion);
  const startSweep = useSimStore((s) => s.startHysteresisSweep);
  const stopSweep = useSimStore((s) => s.stopHysteresisSweep);
  const clearHist = useSimStore((s) => s.clearHysteresisHistory);

  const onT = HIS_SWITCH_ON_THRESHOLD;
  const offT = HIS_SWITCH_OFF_THRESHOLD;

  const gap = useMemo(() => hysteresisGap(crossings), [crossings]);

  const pathSvg = useMemo(() => {
    const w = 280;
    const h = 112;
    const pad = 10;
    const minPh = 1.5;
    const maxPh = 10.5;
    const xOf = (ph: number) => pad + ((ph - minPh) / (maxPh - minPh)) * (w - 2 * pad);
    const yOf = (s: number) => h - pad - Math.min(1, Math.max(0, s)) * (h - 2 * pad);

    const hh = pureHHCurve(minPh, maxPh, 40);
    const hhLine = hh
      .map((s, i) => `${i === 0 ? "M" : "L"}${xOf(s.pH).toFixed(1)},${yOf(s.score).toFixed(1)}`)
      .join(" ");

    const hist = hystHistory.length > 2 ? hystHistory : [];
    if (hist.length < 2) {
      return {
        w,
        h,
        downLine: "",
        upLine: "",
        hhLine,
        stateDots: [] as StateDot[],
        crossMarks: [] as CrossMark[],
        empty: true,
        xOf,
        yOf,
      };
    }

    // Build separate polylines for acidifying (down) vs alkalizing (up) legs
    const downSegs: string[] = [];
    const upSegs: string[] = [];
    let downOpen = false;
    let upOpen = false;
    for (let i = 0; i < hist.length; i++) {
      const s = hist[i]!;
      const pt = `${xOf(s.pH).toFixed(1)},${yOf(s.score).toFixed(1)}`;
      if (s.direction === "up") {
        upSegs.push(upOpen ? `L${pt}` : `M${pt}`);
        upOpen = true;
        downOpen = false;
      } else {
        downSegs.push(downOpen ? `L${pt}` : `M${pt}`);
        downOpen = true;
        upOpen = false;
      }
    }

    const stateDots: StateDot[] = [];
    const step = Math.max(1, Math.floor(hist.length / 48));
    for (let i = 0; i < hist.length; i += step) {
      const s = hist[i]!;
      stateDots.push({
        x: xOf(s.pH),
        y: yOf(s.score),
        on: s.switchOn,
        dir: s.direction,
      });
    }

    const crossMarks: CrossMark[] = crossings.map((c) => ({
      x: xOf(c.pH),
      y: yOf(c.score),
      kind: c.kind,
    }));

    return {
      w,
      h,
      downLine: downSegs.join(" "),
      upLine: upSegs.join(" "),
      hhLine,
      stateDots,
      crossMarks,
      empty: false,
      xOf,
      yOf,
    };
  }, [hystHistory, crossings]);

  const scorePct = Math.min(100, Math.max(0, continuousScore * 100));
  const onPct = onT * 100;
  const offPct = offT * 100;

  return (
    <section className="space-y-2 rounded-lg border border-border bg-elevated/60 p-3">
      <div className="flex items-center gap-2">
        <Activity className="size-4 text-muted" aria-hidden />
        <span className="text-sm font-medium">Hysteresis explorer</span>
      </div>
      <p className="text-[11px] leading-relaxed text-muted">
        Path-dependent His gate:{" "}
        <span className="text-fg">OFF→ON at score ≥ {onT.toFixed(2)}</span>,{" "}
        <span className="text-fg">ON→OFF at score ≤ {offT.toFixed(2)}</span>. Same pH
        can yield different states depending on history (~
        {HYST_META.approxPhGap.toFixed(2)} pH units of pure-HH lag).
      </p>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-subtle">
          <span>Score 0</span>
          <span className="text-fg font-medium tabular">{continuousScore.toFixed(2)}</span>
          <span>1</span>
        </div>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-900">
          <div
            className="absolute inset-y-0 bg-amber-500/25"
            style={{ left: `${offPct}%`, width: `${onPct - offPct}%` }}
            title="Bistable band"
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-zinc-400"
            style={{ left: `${offPct}%` }}
            title={`OFF threshold ${offT}`}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-lime-400"
            style={{ left: `${onPct}%` }}
            title={`ON threshold ${onT}`}
          />
          <div
            className={[
              "absolute top-0.5 bottom-0.5 w-1.5 rounded-sm transition-[left] duration-150",
              switchDisplayOn ? "bg-lime-400" : "bg-zinc-500",
            ].join(" ")}
            style={{ left: `calc(${scorePct}% - 3px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-400">↓ OFF @ {offT.toFixed(2)}</span>
          <span
            className={[
              "font-medium",
              bandRegion === "band"
                ? "text-amber-300"
                : bandRegion === "above"
                  ? "text-lime-300"
                  : "text-zinc-400",
            ].join(" ")}
          >
            {bandRegion === "band"
              ? "In bistable band — history decides"
              : bandRegion === "above"
                ? "Above ON — must be ON"
                : "Below OFF — must be OFF"}
          </span>
          <span className="text-lime-400">↑ ON @ {onT.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={[
            "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
            switchDisplayOn
              ? "bg-lime-500/25 text-lime-300 ring-1 ring-lime-400/50"
              : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-600/50",
          ].join(" ")}
        >
          {switchDisplayOn ? "ON" : "OFF"}
        </span>
        <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-muted">
          pH {pH.toFixed(2)} ·{" "}
          {lastPhDirection === "up"
            ? "↑ alkalizing"
            : lastPhDirection === "down"
              ? "↓ acidifying"
              : "idle"}
        </span>
        {switchOverride != null && (
          <span className="rounded-full bg-amber-950/70 px-2 py-0.5 text-[10px] text-amber-200">
            override
          </span>
        )}
        {sweepActive && (
          <span className="rounded-full bg-sky-950/70 px-2 py-0.5 text-[10px] text-sky-200 animate-pulse">
            auto-sweep running
          </span>
        )}
      </div>

      <div className="rounded-md border border-border bg-surface/80 p-2">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-1">
          <p className="text-[10px] font-medium text-fg">
            Trace: score vs pH (path-colored)
          </p>
          <div className="flex flex-wrap gap-2 text-[9px] text-subtle">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block size-1.5 rounded-full bg-sky-400" /> ↓ acidify
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block size-1.5 rounded-full bg-orange-400" /> ↑ alkalize
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-px w-2.5 bg-zinc-500" /> pure HH
            </span>
          </div>
        </div>
        <svg
          viewBox={`0 0 ${pathSvg.w} ${pathSvg.h}`}
          className="h-28 w-full"
          role="img"
          aria-label="Hysteresis score versus pH path with dual legs"
        >
          {/* bistable band in score space */}
          <rect
            x={0}
            y={pathSvg.h - 10 - onT * (pathSvg.h - 20)}
            width={pathSvg.w}
            height={(onT - offT) * (pathSvg.h - 20)}
            fill="rgba(245,158,11,0.12)"
          />
          <line
            x1={0}
            x2={pathSvg.w}
            y1={pathSvg.h - 10 - onT * (pathSvg.h - 20)}
            y2={pathSvg.h - 10 - onT * (pathSvg.h - 20)}
            stroke="#a3e635"
            strokeWidth={1}
            strokeDasharray="3 2"
            opacity={0.7}
          />
          <line
            x1={0}
            x2={pathSvg.w}
            y1={pathSvg.h - 10 - offT * (pathSvg.h - 20)}
            y2={pathSvg.h - 10 - offT * (pathSvg.h - 20)}
            stroke="#a1a1aa"
            strokeWidth={1}
            strokeDasharray="3 2"
            opacity={0.7}
          />
          {/* pure HH reference (memoryless) */}
          <path
            d={pathSvg.hhLine}
            fill="none"
            stroke="#71717a"
            strokeWidth={1}
            strokeDasharray="2 3"
            opacity={0.85}
          />
          {!pathSvg.empty && pathSvg.downLine && (
            <path
              d={pathSvg.downLine}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          )}
          {!pathSvg.empty && pathSvg.upLine && (
            <path
              d={pathSvg.upLine}
              fill="none"
              stroke="#fb923c"
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
          )}
          {!pathSvg.empty &&
            pathSvg.stateDots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={1.6}
                fill={d.on ? "#a3e635" : "#71717a"}
              />
            ))}
          {!pathSvg.empty &&
            pathSvg.crossMarks.map((m, i) => (
              <g key={`c${i}`}>
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={4}
                  fill="none"
                  stroke={m.kind === "on" ? "#a3e635" : "#e4e4e7"}
                  strokeWidth={1.5}
                />
                <text
                  x={m.x + 5}
                  y={m.y - 4}
                  fill={m.kind === "on" ? "#a3e635" : "#d4d4d8"}
                  fontSize={8}
                >
                  {m.kind === "on" ? "ON" : "OFF"}
                </text>
              </g>
            ))}
          {pathSvg.empty && (
            <text
              x={pathSvg.w / 2}
              y={pathSvg.h / 2}
              textAnchor="middle"
              fill="#71717a"
              fontSize={10}
            >
              Drag pH or run demo sweep
            </text>
          )}
          <text x={8} y={pathSvg.h - 2} fill="#71717a" fontSize={8}>
            pH 1.5
          </text>
          <text x={pathSvg.w / 2 - 8} y={pathSvg.h - 2} fill="#71717a" fontSize={8}>
            6
          </text>
          <text x={pathSvg.w - 36} y={pathSvg.h - 2} fill="#71717a" fontSize={8}>
            pH 10.5
          </text>
        </svg>
      </div>

      {/* Gap / crossing summary — the core teaching point */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        <div className="rounded-md border border-border bg-surface/70 px-2 py-1.5">
          <p className="text-subtle">OFF→ON (acidifying)</p>
          <p className="font-medium tabular text-lime-300">
            {gap.lastOn
              ? `pH ${gap.lastOn.pH.toFixed(2)} · score ${gap.lastOn.score.toFixed(2)}`
              : "— not yet"}
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface/70 px-2 py-1.5">
          <p className="text-subtle">ON→OFF (alkalizing)</p>
          <p className="font-medium tabular text-zinc-300">
            {gap.lastOff
              ? `pH ${gap.lastOff.pH.toFixed(2)} · score ${gap.lastOff.score.toFixed(2)}`
              : "— not yet"}
          </p>
        </div>
      </div>

      {gap.deltaPh != null && (
        <p className="rounded-md border border-amber-500/30 bg-amber-950/40 px-2 py-1.5 text-[11px] text-amber-100">
          <span className="font-semibold text-amber-200">ΔpH hysteresis gap</span>
          {" = "}
          <span className="font-mono font-semibold tabular">{gap.deltaPh.toFixed(2)}</span>
          {" units — transitions at different pH on the way down vs up. Pure-HH ideal ≈ "}
          {HYST_META.approxPhGap.toFixed(2)}
          {" (ON≈"}
          {HYST_META.purePhOn.toFixed(1)}
          {", OFF≈"}
          {HYST_META.purePhOff.toFixed(1)}
          {")."}
        </p>
      )}

      {lastCrossing && gap.deltaPh == null && (
        <p className="text-[11px] text-muted">
          Last click:{" "}
          <span className={lastCrossing.kind === "on" ? "text-lime-300" : "text-zinc-300"}>
            → {lastCrossing.kind.toUpperCase()}
          </span>{" "}
          at pH {lastCrossing.pH.toFixed(2)}, score {lastCrossing.score.toFixed(2)}
          {crossings.length > 0 && (
            <span className="text-subtle"> · {crossings.length} crossing(s) logged</span>
          )}
        </p>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {!sweepActive ? (
          <button
            type="button"
            onClick={startSweep}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-2 text-[11px] font-medium text-sky-200 hover:bg-elevated"
          >
            <Play className="size-3.5" />
            Demo pH sweep
          </button>
        ) : (
          <button
            type="button"
            onClick={stopSweep}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-2 text-[11px] font-medium text-fg hover:bg-elevated"
          >
            <Square className="size-3.5" />
            Stop sweep
          </button>
        )}
        <button
          type="button"
          onClick={clearHist}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-2 text-[11px] font-medium text-muted hover:bg-elevated"
        >
          <Trash2 className="size-3.5" />
          Clear trace
        </button>
      </div>
      <p className="text-[10px] leading-relaxed text-subtle">
        Demo: pH 8.8 → 3.5 (acidify, OFF→ON) then 3.5 → 8.8 (alkalize, ON→OFF). Note the
        two transitions occur at different pH — that gap is hysteresis. Real His-gated
        receptors and hemoglobin’s Bohr effect show related path-dependent behavior;
        this model is a classical continuum didactic projection only.
      </p>
    </section>
  );
}
