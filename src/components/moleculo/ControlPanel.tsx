import { useEffect, useState } from "react";
import {
  Beaker,
  Download,
  Focus,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useSimStore } from "@/stores/sim-store";
import { REGIME_META } from "@/lib/moleculo/physics";
import {
  PROGRAMMES,
  visibleProgrammeOrder,
} from "@/lib/moleculo/programmes";
import { SCENARIOS, SCENARIO_ORDER } from "@/lib/moleculo/scenarios";
import { exportPaperAssetTables } from "@/lib/moleculo/paper-assets";
import {
  APP_SUBTITLE,
  APP_VERSION_BANNER,
  CLAMP_ZOOM_LABELS,
  CLAMP_ZOOM_LEVELS,
  DISPLAY_DURATION_MAX,
  DISPLAY_DURATION_MIN,
  DISPLAY_DURATION_PRESETS,
  EVENT_RECORD_CAP,
  FRAME_NS,
  HEAVY_METAL_UI_ORDER,
  PUBLIC_LIGANDS,
  PUBLICATION_DISCLAIMER,
  RECEPTOR_GEOMETRIES,
  RECEPTOR_GEOMETRY_ORDER,
  VALIDATION_PACKAGE_PATH,
  heavyMetalLabel,
  resolveHeavyMetal,
  timeAccelerationFactor,
} from "@/lib/moleculo/types";
import type {
  ClampZoomLevel,
  LigandBaselineMode,
  MetalMode,
  ProgrammeId,
  ReceptorGeometryId,
} from "@/lib/moleculo/types";
import { pHToT, colorCss } from "@/lib/moleculo/colormap";

function fmtE(v: number | undefined | null): string {
  if (v == null || !Number.isFinite(v)) return "—";
  return v.toFixed(3);
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-[10px] text-muted">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 accent-cyan-500"
      />
    </label>
  );
}

export function ControlPanel() {
  const pH = useSimStore((s) => s.pH);
  const setPH = useSimStore((s) => s.setPH);
  const playing = useSimStore((s) => s.playing);
  const togglePlay = useSimStore((s) => s.togglePlay);
  const reset = useSimStore((s) => s.reset);
  const focusHisRoi = useSimStore((s) => s.focusHisRoi);
  const moleculeCount = useSimStore((s) => s.moleculeCount);
  const setMoleculeCount = useSimStore((s) => s.setMoleculeCount);
  const metalMode = useSimStore((s) => s.metalMode);
  const setMetalMode = useSimStore((s) => s.setMetalMode);
  const displayDurationSec = useSimStore((s) => s.displayDurationSec);
  const setDisplayDurationSec = useSimStore((s) => s.setDisplayDurationSec);
  const demoSpeed = useSimStore((s) => s.demoSpeed);
  const setDemoSpeed = useSimStore((s) => s.setDemoSpeed);
  const regime = useSimStore((s) => s.regime);
  const roiEnergy = useSimStore((s) => s.roiEnergy);
  const hisPka = useSimStore((s) => s.hisPka);
  const setHisPka = useSimStore((s) => s.setHisPka);
  const hisTheta = useSimStore((s) => s.hisTheta);
  const debyeNm = useSimStore((s) => s.debyeNm);
  const setDebyeNm = useSimStore((s) => s.setDebyeNm);
  const clearDebyeOverride = useSimStore((s) => s.clearDebyeOverride);
  const debyeOverrideNm = useSimStore((s) => s.debyeOverrideNm);
  const proximityEvents = useSimStore((s) => s.proximityEvents);
  const hhBinaryEvents = useSimStore((s) => s.hhBinaryEvents);
  const meanTriggerDistNm = useSimStore((s) => s.meanTriggerDistNm);
  const resetBehaviorCounters = useSimStore((s) => s.resetBehaviorCounters);
  const exportScientificSnapshot = useSimStore((s) => s.exportScientificSnapshot);
  const exportScientificCsv = useSimStore((s) => s.exportScientificCsv);
  const saveScientificToFolder = useSimStore((s) => s.saveScientificToFolder);
  const runValiditySuite = useSimStore((s) => s.runValiditySuite);
  const applyScenario = useSimStore((s) => s.applyScenario);
  const scenarioBanner = useSimStore((s) => s.scenarioBanner);
  const activeProgramme = useSimStore((s) => s.activeProgramme);
  const applyProgrammeSetup = useSimStore((s) => s.applyProgrammeSetup);
  const runProgrammeSuite = useSimStore((s) => s.runProgrammeSuite);
  const lastProgrammeSummary = useSimStore((s) => s.lastProgrammeSummary);
  const receptorGeometry = useSimStore((s) => s.receptorGeometry);
  const setReceptorGeometry = useSimStore((s) => s.setReceptorGeometry);
  const showL2 = useSimStore((s) => s.showL2);
  const setShowL2 = useSimStore((s) => s.setShowL2);
  const ligandBaseline = useSimStore((s) => s.ligandBaseline);
  const setLigandBaseline = useSimStore((s) => s.setLigandBaseline);
  const peptideVariant = useSimStore((s) => s.peptideVariant);
  const setPeptideVariant = useSimStore((s) => s.setPeptideVariant);
  const ligand2Count = useSimStore((s) => s.ligand2Count);
  const setLigand2Count = useSimStore((s) => s.setLigand2Count);
  const ligand2ChargeScale = useSimStore((s) => s.ligand2ChargeScale);
  const setLigand2ChargeScale = useSimStore((s) => s.setLigand2ChargeScale);
  const setLigand4Enabled = useSimStore((s) => s.setLigand4Enabled);
  const setLigand3Enabled = useSimStore((s) => s.setLigand3Enabled);
  const respawnOnBinding = useSimStore((s) => s.respawnOnBinding);
  const setRespawnOnBinding = useSimStore((s) => s.setRespawnOnBinding);
  const shortRangeWellEnabled = useSimStore((s) => s.shortRangeWellEnabled);
  const setShortRangeWellEnabled = useSimStore((s) => s.setShortRangeWellEnabled);
  const shortRangeWellDepthKt = useSimStore((s) => s.shortRangeWellDepthKt);
  const setShortRangeWellDepthKt = useSimStore((s) => s.setShortRangeWellDepthKt);
  const showProteins = useSimStore((s) => s.showProteins);
  const setShowProteins = useSimStore((s) => s.setShowProteins);
  const showForceArrows = useSimStore((s) => s.showForceArrows);
  const setShowForceArrows = useSimStore((s) => s.setShowForceArrows);
  const showField = useSimStore((s) => s.showField);
  const setShowField = useSimStore((s) => s.setShowField);
  const fieldOpacity = useSimStore((s) => s.fieldOpacity);
  const setFieldOpacity = useSimStore((s) => s.setFieldOpacity);
  const spawnNearRoi = useSimStore((s) => s.spawnNearRoi);
  const eventLogLen = useSimStore((s) => s.eventLogLen);
  const eventRecording = useSimStore((s) => s.eventRecording);
  const eventPlayback = useSimStore((s) => s.eventPlayback);
  const eventTargetFrames = useSimStore((s) => s.eventTargetFrames);
  const startRecordEvent = useSimStore((s) => s.startRecordEvent);
  const stopRecordEvent = useSimStore((s) => s.stopRecordEvent);
  const clearEventLog = useSimStore((s) => s.clearEventLog);
  const toggleEventPlayback = useSimStore((s) => s.toggleEventPlayback);
  const setEventScrub = useSimStore((s) => s.setEventScrub);
  const clampStart = useSimStore((s) => s.clampStart);
  const clampEnd = useSimStore((s) => s.clampEnd);
  const setClampStart = useSimStore((s) => s.setClampStart);
  const setClampEnd = useSimStore((s) => s.setClampEnd);
  const clearClamp = useSimStore((s) => s.clearClamp);
  const clampLoop = useSimStore((s) => s.clampLoop);
  const setClampLoop = useSimStore((s) => s.setClampLoop);
  const fitClampToTape = useSimStore((s) => s.fitClampToTape);
  const tapeZoomLevel = useSimStore((s) => s.tapeZoomLevel);
  const setTapeZoomLevel = useSimStore((s) => s.setTapeZoomLevel);
  const exportClampCsv = useSimStore((s) => s.exportClampCsv);
  const exportClampJson = useSimStore((s) => s.exportClampJson);
  const exportEventLogCsv = useSimStore((s) => s.exportEventLogCsv);
  const switchDisplayOn = useSimStore((s) => s.switchDisplayOn);
  const fps = useSimStore((s) => s.fps);
  const lastRespawnFlash = useSimStore((s) => s.lastRespawnFlash);
  const runPubMatrix = useSimStore((s) => s.runPubMatrix);
  const runPubMatrixCuEF = useSimStore((s) => s.runPubMatrixCuEF);
  const runPubCombo = useSimStore((s) => s.runPubCombo);

  const [ioMsg, setIoMsg] = useState<string | null>(null);
  const [validityMsg, setValidityMsg] = useState<string | null>(null);
  const pHColor = colorCss(pHToT(pH));
  const tPrime = timeAccelerationFactor(displayDurationSec);
  const recMeta = RECEPTOR_GEOMETRIES[receptorGeometry];

  // Public Beta v1.0: hard-off non-public species (no UI, no HUD rows).
  useEffect(() => {
    setLigand4Enabled(false);
    setLigand3Enabled(false);
  }, [setLigand4Enabled, setLigand3Enabled]);

  const hm = resolveHeavyMetal(metalMode);
  const pbActive = ligandBaseline !== "ligand2" && hm !== "off";
  const pepActive = ligandBaseline !== "ligand1" && peptideVariant !== "off";
  const pepLabel =
    peptideVariant === "prarr"
      ? "PRARR"
      : peptideVariant === "sllrst"
        ? "SLLRST"
        : "KSRRRAR";
  const hmLabel = heavyMetalLabel(metalMode);
  const comboActive = pbActive && pepActive;
  const statusLine = [
    `${hmLabel} ${pbActive ? `×${moleculeCount}` : "absent"}`,
    pepActive
      ? ligandBaseline === "ligand2"
        ? `L2 ${pepLabel} ×${ligand2Count} exclusive`
        : comboActive
          ? `L2 ${pepLabel} ×${ligand2Count} · combo`
          : `L2 ${pepLabel} ×${ligand2Count}`
      : "peptide absent",
  ].join(" · ");

  const uHmPep = Number(roiEnergy?.energyL1L2) || 0;
  const comboBadge =
    !comboActive
      ? null
      : uHmPep > 0.05
        ? "Competitive"
        : uHmPep < -0.05
          ? "Cooperative"
          : "Neutral";

  /** Public HUD total = active public continuum terms only (no private channels). */
  const publicUTot = (() => {
    let tot = 0;
    if (pbActive) tot += Number(roiEnergy?.energyL1His) || 0;
    if (pepActive) tot += Number(roiEnergy?.energyL2His) || 0;
    if (comboActive) tot += uHmPep;
    return tot;
  })();

  const downloadValidationManifest = () => {
    const body = [
      APP_VERSION_BANNER,
      PUBLICATION_DISCLAIMER,
      "",
      "Frozen public validation package:",
      VALIDATION_PACKAGE_PATH + "/",
      "",
      "Key public CSVs:",
      "  PUB_COMBO_mean_sd.csv",
      "  PUB_COMBO_vs_exclusive.csv",
      "  PUB_MATRIX_mean_sd.csv",
      "  PUB_MATRIX_ranking_per_receptor.csv",
      "  PUB_MATRIX_E_vs_F_Menkes.csv",
      "  PUB_MATRIX_Cu_E_F_mean_sd.csv",
      "  PUB_MATRIX_Cu_E_vs_F_contrast.csv",
      "  PUB_MATRIX_ranking_E_F_with_Cu.csv",
      "  ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv",
      "  peptide3_furin_baselines_mean_sd.csv",
      "  paper_tables/",
      "  paper_figures/",
      "",
      "Primary metric: U_L–ROI = mean continuum Yukawa energy of exclusive ligand L at the receptor ROI (kT).",
      "Combo: U_HM–pep = pairwise HM–peptide continuum term near ROI; Competitive if >0, Cooperative if <0.",
      "Charges are formal / HH (chargeSource: formal). DFT may refine offline — no live quantum solver.",
      "Private analyses are excluded from this public package.",
      "Not MD, docking, coordination chemistry, or a biological claim.",
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
    a.download = "MoleculoSphere5D_Beta_v1.1_public_validation_paths.txt";
    a.click();
    setIoMsg("Validation package path list downloaded");
  };

  return (
    <aside
      className="panel-scroll flex max-h-full w-full flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-panel/95 p-3.5 shadow-xl backdrop-blur-sm md:w-[340px] lg:w-[360px]"
      aria-label="Simulation controls"
    >
      <header className="space-y-1">
        <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
          Hierarchical 5D electrostatics
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-fg">
          {APP_VERSION_BANNER}
        </h1>
        <p className="text-[10px] text-muted">{APP_SUBTITLE}</p>
        <p className="text-[9px] leading-snug text-subtle">{PUBLICATION_DISCLAIMER}</p>
      </header>

      <section className="space-y-1.5 rounded-lg border border-cyan-500/25 bg-cyan-950/20 p-3">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-cyan-300" aria-hidden />
          <span className="text-sm font-medium">Quick start</span>
        </div>
        <ol className="list-decimal space-y-1 pl-4 text-[9px] leading-relaxed text-subtle">
          <li>
            Pick receptor A–F. Exclusive ligand or combo: Both = one HM + one peptide.
          </li>
          <li>
            Set pH; Play — U_L–ROI (and U_HM–pep in combo) are continuum Yukawa energies
            (kT).
          </li>
          <li>Event tape records proximity + HH-binary frames (demo speed OK).</li>
          <li>
            Export · public writes only public ligands/columns. Frozen CSVs live under{" "}
            <span className="text-fg">{VALIDATION_PACKAGE_PATH}</span>.
          </li>
        </ol>
        <p className="text-[9px] text-muted">
          Public ligands: {PUBLIC_LIGANDS.join(" · ")}. Not MD / docking / clinical.
        </p>
        <button
          type="button"
          onClick={downloadValidationManifest}
          className="w-full rounded-md border border-cyan-400/40 bg-cyan-950/30 px-2 py-1.5 text-[10px] text-cyan-100"
        >
          Download public validation path list
        </button>
      </section>

      <section className="space-y-2 rounded-lg border border-border bg-surface/70 p-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-cyan-300" aria-hidden />
          <span className="text-sm font-medium">Transport</span>
          <span className="ml-auto text-[10px] tabular text-muted">{fps} fps</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-1 rounded-md border border-cyan-400/40 bg-cyan-950/30 px-2 py-1.5 text-[11px] text-cyan-100"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-[11px] text-fg"
          >
            <RotateCcw className="size-3.5" /> Reset scene
          </button>
          <button
            type="button"
            onClick={() => focusHisRoi()}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-[11px] text-fg"
          >
            <Focus className="size-3.5" /> Focus ROI
          </button>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="text-muted">pH</span>
            <span className="tabular text-fg" style={{ color: pHColor }}>
              {pH.toFixed(2)} ·{" "}
              {REGIME_META[regime as keyof typeof REGIME_META]?.label ?? regime}
            </span>
          </div>
          <Slider
            min={1.5}
            max={10.5}
            step={0.05}
            value={[pH]}
            onValueChange={(v) => setPH(v[0] ?? 7.4)}
            aria-label="pH"
          />
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="text-muted">Display duration (s)</span>
            <span className="tabular text-fg">
              {displayDurationSec.toFixed(0)} · t′ ×{tPrime.toFixed(2)}
            </span>
          </div>
          <Slider
            min={DISPLAY_DURATION_MIN}
            max={DISPLAY_DURATION_MAX}
            step={1}
            value={[displayDurationSec]}
            onValueChange={(v) => setDisplayDurationSec(v[0] ?? 10)}
            aria-label="Display duration"
          />
          <div className="mt-1 flex flex-wrap gap-1">
            {DISPLAY_DURATION_PRESETS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setDisplayDurationSec(s)}
                className={[
                  "rounded border px-1.5 py-0.5 text-[9px]",
                  displayDurationSec === s
                    ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100"
                    : "border-border bg-surface text-muted",
                ].join(" ")}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="text-muted">Demo speed</span>
            <span className="tabular text-fg">×{demoSpeed}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {[0.25, 0.5, 1].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDemoSpeed(m)}
                className={[
                  "rounded border px-2 py-1 text-[10px]",
                  demoSpeed === m
                    ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100"
                    : "border-border bg-surface text-muted",
                ].join(" ")}
              >
                ×{m}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[9px] text-subtle">
            Scales live integrator presentation only — locked batch/export dt unchanged.
          </p>
        </div>
      </section>

      {/* Energy HUD — public ligands only; hard exclusion when toggled off */}
      <section className="space-y-1.5 rounded-lg border border-border bg-surface/70 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-fg">Energy HUD (kT)</p>
          {comboBadge && (
            <span
              className={[
                "rounded border px-1.5 py-0.5 text-[9px] font-medium",
                comboBadge === "Competitive"
                  ? "border-amber-400/50 bg-amber-950/40 text-amber-100"
                  : comboBadge === "Cooperative"
                    ? "border-emerald-400/50 bg-emerald-950/40 text-emerald-100"
                    : "border-border bg-surface text-muted",
              ].join(" ")}
              title="Educational continuum label from sign of U_HM–pep only — not a biological claim"
            >
              {comboBadge}
            </span>
          )}
        </div>
        <div className="space-y-0.5 font-mono text-[10px]">
          {pbActive && (
            <div className="flex justify-between">
              <span className="text-muted">U_HM–ROI</span>
              <span className="tabular text-fg">{fmtE(roiEnergy?.energyL1His)}</span>
            </div>
          )}
          {pepActive && (
            <div className="flex justify-between">
              <span className="text-muted">U_pep–ROI</span>
              <span className="tabular text-fg">{fmtE(roiEnergy?.energyL2His)}</span>
            </div>
          )}
          {comboActive && (
            <div className="flex justify-between">
              <span className="text-muted">U_HM–pep</span>
              <span className="tabular text-fg">{fmtE(uHmPep)}</span>
            </div>
          )}
          {(pbActive || pepActive) && (
            <div className="flex justify-between border-t border-border/60 pt-0.5">
              <span className="text-muted">U_tot</span>
              <span className="tabular text-fg">{fmtE(publicUTot)}</span>
            </div>
          )}
          <div className="flex justify-between text-subtle">
            <span>His θ / switch</span>
            <span className="tabular">
              {hisTheta.toFixed(2)} · {switchDisplayOn ? "ON" : "OFF"}
            </span>
          </div>
        </div>
        {comboActive && (
          <p className="text-[8px] leading-snug text-subtle">
            Combo mode: Competitive if U_HM–pep positive · Cooperative if negative
            (continuum only).
          </p>
        )}
        {!pbActive && !pepActive && (
          <p className="text-[9px] text-subtle">
            No public ligand active — enable Pb²⁺/Cu²⁺ or a peptide (or Both) to see U_L–ROI
            rows.
          </p>
        )}
      </section>

      <section className="space-y-2 rounded-lg border border-emerald-500/25 bg-emerald-950/15 p-3">
        <div className="flex items-center gap-2">
          <Download className="size-4 text-emerald-300" aria-hidden />
          <span className="text-sm font-medium">Scientific data</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="rounded border border-border bg-surface/50 px-1.5 py-1">
            Prox events: <span className="tabular text-fg">{proximityEvents}</span>
          </div>
          <div className="rounded border border-border bg-surface/50 px-1.5 py-1">
            HH events: <span className="tabular text-fg">{hhBinaryEvents}</span>
          </div>
          <div className="col-span-2 rounded border border-border bg-surface/50 px-1.5 py-1">
            Mean trigger d:{" "}
            <span className="tabular text-fg">
              {meanTriggerDistNm != null && meanTriggerDistNm > 0
                ? `${meanTriggerDistNm.toFixed(2)} nm`
                : "—"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => {
              resetBehaviorCounters();
              setIoMsg("Counters reset");
            }}
            className="rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted"
          >
            Reset counters
          </button>
          <button
            type="button"
            onClick={() => {
              exportScientificSnapshot();
              setIoMsg("Scientific snapshot exported");
            }}
            className="rounded border border-emerald-400/40 bg-emerald-950/30 px-2 py-1 text-[10px] text-emerald-100"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              const csv = exportScientificCsv();
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
              a.download = "scientific_snapshot_public.csv";
              a.click();
              setIoMsg("Scientific CSV exported");
            }}
            className="rounded border border-emerald-400/40 bg-emerald-950/30 px-2 py-1 text-[10px] text-emerald-100"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const msg = await saveScientificToFolder();
                setIoMsg(msg);
              } catch (e) {
                setIoMsg(String(e));
              }
            }}
            className="inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted"
          >
            <Download className="size-3" /> Save folder
          </button>
          <button
            type="button"
            onClick={() => {
              const msg = exportPaperAssetTables();
              setIoMsg(msg);
            }}
            className="rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted"
          >
            Paper tables · public
          </button>
        </div>
        {ioMsg && <p className="text-[9px] text-subtle">{ioMsg}</p>}

        <p className="text-[9px] text-subtle">
          Suite exports write public columns only. Private analyses are excluded from this
          public package. Frozen package:{" "}
          <span className="text-fg">{VALIDATION_PACKAGE_PATH}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setValidityMsg("Running kernel validity suite…");
            try {
              const summary = runValiditySuite();
              setValidityMsg(summary);
            } catch (e) {
              setValidityMsg(String(e));
            }
          }}
          className="w-full rounded-md border border-border bg-elevated px-2 py-1.5 text-[10px] text-fg"
        >
          Run kernel validity suite
        </button>
        <button
          type="button"
          onClick={() => {
            setValidityMsg("Running P5 peptide baselines…");
            try {
              const r = (
                window as unknown as {
                  __simEngine: {
                    runPeptide3FurinBaselines: (o?: object) => {
                      summary: string;
                      csv: string;
                      rankingCsv: string;
                      json: string;
                    };
                  };
                }
              ).__simEngine.runPeptide3FurinBaselines({
                nMolecules: 20,
                frames: 200,
                replicates: 5,
              });
              const dl = (name: string, body: string, mime: string) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([body], { type: mime }));
                a.download = name;
                a.click();
              };
              dl("peptide3_furin_baselines_mean_sd.csv", r.csv, "text/csv");
              dl("ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv", r.rankingCsv, "text/csv");
              dl("peptide3_furin_baselines.json", r.json, "application/json");
              setValidityMsg(r.summary);
            } catch (e) {
              setValidityMsg(String(e));
            }
          }}
          className="w-full rounded-md border border-violet-400/40 bg-violet-950/30 px-2 py-1.5 text-[10px] text-violet-100"
        >
          Run suite + export · public (P5 peptides)
        </button>
        <button
          type="button"
          onClick={() => {
            setValidityMsg("Running public PUB_MATRIX (A–F × Pb + peptides × 3 pH)…");
            try {
              const summary = runPubMatrix({
                nMolecules: 20,
                frames: 150,
                replicates: 5,
              });
              setValidityMsg(summary);
            } catch (e) {
              setValidityMsg(String(e));
            }
          }}
          className="w-full rounded-md border border-emerald-400/40 bg-emerald-950/30 px-2 py-1.5 text-[10px] text-emerald-100"
        >
          Run suite + export · public (A–F)
        </button>
        <button
          type="button"
          onClick={() => {
            setValidityMsg("Running Cu²⁺ Menkes E/F suite…");
            try {
              const summary = runPubMatrixCuEF({
                nMolecules: 20,
                frames: 150,
                replicates: 5,
              });
              setValidityMsg(summary);
            } catch (e) {
              setValidityMsg(String(e));
            }
          }}
          className="w-full rounded-md border border-amber-400/40 bg-amber-950/30 px-2 py-1.5 text-[10px] text-amber-100"
        >
          Run suite + export · public (Cu · E/F)
        </button>
        <button
          type="button"
          onClick={() => {
            setValidityMsg("Running PUB_COMBO v1.1 (B/E/F × HM+peptide × 3 pH)…");
            try {
              const summary = runPubCombo({
                nMolecules: 12,
                frames: 120,
                replicates: 5,
              });
              setValidityMsg(summary);
            } catch (e) {
              setValidityMsg(String(e));
            }
          }}
          className="w-full rounded-md border border-fuchsia-400/40 bg-fuchsia-950/30 px-2 py-1.5 text-[10px] text-fuchsia-100"
        >
          Run suite + export · public (COMBO L1+L2)
        </button>
        {validityMsg && (
          <p className="whitespace-pre-wrap text-[9px] text-muted">{validityMsg}</p>
        )}
        {lastProgrammeSummary && (
          <p className="whitespace-pre-wrap text-[9px] text-subtle">{lastProgrammeSummary}</p>
        )}
      </section>

      <section className="space-y-2 rounded-lg border border-border bg-surface/70 p-3">
        <span className="text-sm font-medium">Scenario presets</span>
        <p className="text-[9px] text-subtle">
          Sets pH (and His θ) only — ligands, receptor, respawn, and camera stay as-is.
        </p>
        <div className="flex flex-wrap gap-1">
          {SCENARIO_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              title={SCENARIOS[id].blurb}
              onClick={() => applyScenario(id)}
              className="rounded-md border border-border bg-elevated px-2 py-1.5 text-[10px] text-fg hover:bg-panel"
            >
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        {scenarioBanner && (
          <p className="text-[9px] text-subtle">
            {scenarioBanner.label} · pH {scenarioBanner.pH.toFixed(2)} (pH only)
          </p>
        )}
      </section>

      <section className="space-y-2 rounded-lg border border-fuchsia-500/25 bg-fuchsia-950/15 p-3">
        <div className="flex items-center gap-2">
          <Beaker className="size-4 text-fuchsia-300" aria-hidden />
          <span className="text-sm font-medium">Experimental programmes</span>
        </div>
        <p className="text-[9px] leading-relaxed text-subtle">
          Public continuum programmes only (λ_D 0.8 nm, coulombK 1.15). Exports mean±sd ·
          public columns only. Private analyses are excluded from this public package.
        </p>
        <div className="space-y-1.5">
          {visibleProgrammeOrder().map((id) => {
            const prog = PROGRAMMES[id];
            const sets = prog.ligandSets.slice(0, 4);
            return (
              <div
                key={id}
                className={[
                  "rounded-md border p-2",
                  activeProgramme === id
                    ? "border-fuchsia-400/40 bg-fuchsia-950/30"
                    : "border-border bg-surface/40",
                ].join(" ")}
              >
                <p className="text-[10px] font-medium text-fg">{prog.shortLabel}</p>
                <p className="mb-1 text-[8px] leading-snug text-subtle">{prog.note}</p>
                <div className="flex flex-wrap gap-1">
                  {sets.map((set) => (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() =>
                        applyProgrammeSetup(id as ProgrammeId, set.id, prog.receptors[0])
                      }
                      className="rounded border border-border bg-elevated px-1.5 py-0.5 text-[9px] text-muted hover:text-fg"
                    >
                      Load {set.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={async () => {
                      setValidityMsg(`Running ${prog.shortLabel}…`);
                      try {
                        const summary = await runProgrammeSuite(id as ProgrammeId);
                        setValidityMsg(summary);
                      } catch (e) {
                        setValidityMsg(String(e));
                      }
                    }}
                    className="rounded border border-fuchsia-400/40 bg-fuchsia-950/30 px-1.5 py-0.5 text-[9px] text-fuchsia-100"
                  >
                    Run suite
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-border bg-surface/70 p-3">
        <span className="text-sm font-medium">Receptor</span>
        <div className="flex flex-wrap gap-1">
          {RECEPTOR_GEOMETRY_ORDER.map((id) => {
            const m = RECEPTOR_GEOMETRIES[id as ReceptorGeometryId];
            return (
              <button
                key={id}
                type="button"
                title={m.label}
                onClick={() => setReceptorGeometry(id as ReceptorGeometryId)}
                className={[
                  "rounded border px-1.5 py-1 text-[9px]",
                  receptorGeometry === id
                    ? "border-teal-400/50 bg-teal-950/40 text-teal-100"
                    : "border-border bg-surface text-muted",
                ].join(" ")}
              >
                {m.shortLabel}
              </button>
            );
          })}
        </div>
        <p className="text-[9px] text-subtle">
          {recMeta?.label} · ROI {recMeta?.roiLabel}
        </p>
      </section>

      <section className="space-y-2 rounded-lg border border-border bg-surface/70 p-3">
        <span className="text-sm font-medium">Ligands · public (exclusive or combo)</span>
        <div className="flex flex-wrap gap-1">
          {(
            [
              ["both", "Both"],
              ["ligand1", "L1 only"],
              ["ligand2", "L2 only"],
            ] as const
          ).map(([mode, lab]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLigandBaseline(mode as LigandBaselineMode)}
              className={[
                "rounded border px-1.5 py-1 text-[9px]",
                ligandBaseline === mode
                  ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100"
                  : "border-border bg-surface text-muted",
              ].join(" ")}
            >
              {lab}
            </button>
          ))}
        </div>

        <div className="space-y-1 rounded border border-border bg-elevated/40 p-2">
          <p className="text-[11px] font-medium text-fg">L1 · Heavy metal (+2)</p>
          <div className="flex flex-wrap gap-1">
            {HEAVY_METAL_UI_ORDER.map((mode) => {
              const lab =
                mode === "pb" ? "Pb²⁺" : mode === "cu" ? "Cu²⁺" : "Off";
              const active = hm === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  disabled={ligandBaseline === "ligand2" && mode !== "off"}
                  onClick={() => setMetalMode(mode as MetalMode)}
                  className={[
                    "rounded border px-1.5 py-1 text-[9px]",
                    active
                      ? "border-amber-400/50 bg-amber-950/40 text-amber-100"
                      : "border-border bg-surface text-muted",
                  ].join(" ")}
                >
                  {lab}
                </button>
              );
            })}
          </div>
          <p className="text-[9px] leading-snug text-subtle">
            Hard exclusive L1 identity — Pb²⁺ or Cu²⁺ (q = +2). Cu Menkes analysis uses
            receptors E/F only.
          </p>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted">Count</span>
            <span className="tabular">{pbActive ? moleculeCount : 0}</span>
          </div>
          <Slider
            min={0}
            max={50}
            step={1}
            value={[pbActive ? moleculeCount : 0]}
            onValueChange={(v) => setMoleculeCount(v[0] ?? 0)}
            disabled={!pbActive}
            aria-label="Heavy metal count"
          />
        </div>

        <div className="space-y-1 rounded border border-border bg-elevated/40 p-2">
          <p className="text-[11px] font-medium text-fg">L2 · Peptide</p>
          <div className="flex flex-wrap gap-1">
            {(
              [
                ["ksrrrar", "KSRRRAR (+5)", "Polybasic FCS-like continuum proxy"],
                ["prarr", "PRARR (+3)", "Intermediate polybasic peptide"],
                [
                  "sllrst",
                  "SLLRST (+1, single-Arg)",
                  "Continuum single-Arg educational contrast — not a viral infectivity claim.",
                ],
                ["off", "Off", "No L2 peptide"],
              ] as const
            ).map(([v, lab, tip]) => (
              <button
                key={v}
                type="button"
                title={tip}
                disabled={ligandBaseline === "ligand1" && v !== "off"}
                onClick={() => setPeptideVariant(v)}
                className={[
                  "rounded border px-1.5 py-1 text-[9px]",
                  peptideVariant === v
                    ? "border-violet-400/50 bg-violet-950/40 text-violet-100"
                    : "border-border bg-surface text-muted",
                ].join(" ")}
              >
                {lab}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-muted">Count</span>
            <span className="tabular">{pepActive ? ligand2Count : 0}</span>
          </div>
          <Slider
            min={0}
            max={50}
            step={1}
            value={[pepActive ? ligand2Count : 0]}
            onValueChange={(v) => setLigand2Count(v[0] ?? 0)}
            disabled={!pepActive}
            aria-label="Peptide count"
          />
          <div className="flex justify-between text-[10px]">
            <span className="text-muted">Charge scale</span>
            <span className="tabular">{ligand2ChargeScale.toFixed(2)}</span>
          </div>
          <Slider
            min={0.5}
            max={1.5}
            step={0.05}
            value={[ligand2ChargeScale]}
            onValueChange={(v) => setLigand2ChargeScale(v[0] ?? 1)}
            disabled={!pepActive}
            aria-label="Peptide charge scale"
          />
          <ToggleRow label="Show L2 beads" checked={showL2} onChange={setShowL2} />
        </div>

        <ToggleRow
          label="Respawn on proximity"
          checked={respawnOnBinding}
          onChange={setRespawnOnBinding}
        />
        <p className="text-[9px] leading-snug text-subtle">
          When ON: after a proximity event (d ≤ 1.0 nm, hold ≥3), that ligand is removed
          and respawned in the outer shell. Default OFF for pure energy ranking.
        </p>
        <p className="rounded border border-border bg-elevated/50 px-2 py-1.5 text-[9px] text-muted">
          Active: <span className="text-fg">{statusLine}</span>
          {" · "}prox events:{" "}
          <span className="tabular text-fg">{proximityEvents}</span>
        </p>
        {lastRespawnFlash && lastRespawnFlash.ticksLeft > 0 && (
          <p className="rounded border border-cyan-400/40 bg-cyan-950/40 px-2 py-1 text-[10px] text-cyan-100">
            respawned {lastRespawnFlash.ligandClass} ·{" "}
            {lastRespawnFlash.oldDistNm.toFixed(2)}→
            {lastRespawnFlash.newDistNm.toFixed(2)} nm
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => spawnNearRoi("ligand1")}
            disabled={!pbActive}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted hover:text-fg disabled:opacity-40"
          >
            Spawn {hmLabel === "off" ? "HM" : hmLabel} near ROI
          </button>
          <button
            type="button"
            onClick={() => spawnNearRoi("ligand2")}
            disabled={!pepActive}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted hover:text-fg disabled:opacity-40"
          >
            Spawn peptide near ROI
          </button>
        </div>
      </section>

      <section className="space-y-2 rounded-lg border border-border bg-surface/70 p-3">
        <span className="text-sm font-medium">Display & continuum knobs</span>
        <ToggleRow label="Show proteins" checked={showProteins} onChange={setShowProteins} />
        <ToggleRow
          label="Force arrows"
          checked={showForceArrows}
          onChange={setShowForceArrows}
        />
        <ToggleRow label="Field slice" checked={showField} onChange={setShowField} />
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">Field opacity</span>
          <span className="tabular">{fieldOpacity.toFixed(2)}</span>
        </div>
        <Slider
          min={0.05}
          max={1}
          step={0.05}
          value={[fieldOpacity]}
          onValueChange={(v) => setFieldOpacity(v[0] ?? 0.5)}
          disabled={!showField}
          aria-label="Field opacity"
        />
        <ToggleRow
          label="Short-range well (off under validity lock)"
          checked={shortRangeWellEnabled}
          onChange={setShortRangeWellEnabled}
        />
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">Well depth kT</span>
          <span className="tabular">{shortRangeWellDepthKt.toFixed(1)}</span>
        </div>
        <Slider
          min={0}
          max={8}
          step={0.1}
          value={[shortRangeWellDepthKt]}
          onValueChange={(v) => setShortRangeWellDepthKt(v[0] ?? 3)}
          disabled={!shortRangeWellEnabled}
          aria-label="Short range well depth"
        />
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">
            λ_D (nm){debyeOverrideNm != null ? " · override" : " · auto"}
          </span>
          <span className="tabular">{debyeNm.toFixed(2)}</span>
        </div>
        <Slider
          min={0.3}
          max={2.5}
          step={0.05}
          value={[debyeNm]}
          onValueChange={(v) => setDebyeNm(v[0] ?? 0.8)}
          aria-label="Debye length"
        />
        {debyeOverrideNm != null && (
          <button
            type="button"
            onClick={clearDebyeOverride}
            className="text-[9px] text-muted underline"
          >
            Clear λ_D override
          </button>
        )}
        <div className="flex justify-between text-[10px]">
          <span className="text-muted">His pKa</span>
          <span className="tabular">{hisPka.toFixed(2)}</span>
        </div>
        <Slider
          min={4}
          max={8}
          step={0.05}
          value={[hisPka]}
          onValueChange={(v) => setHisPka(v[0] ?? 6.2)}
          aria-label="His pKa"
        />
      </section>

      <section className="space-y-2 rounded-lg border border-cyan-500/25 bg-cyan-950/15 p-3">
        <span className="text-sm font-medium">Event capture</span>
        <p className="text-[9px] text-subtle">
          Record continuum frames (cap {EVENT_RECORD_CAP}). Clamp rulers on tape; zoom crops
          viewport only. Surgical control changes do not full-reseed.
        </p>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => (eventRecording ? stopRecordEvent() : startRecordEvent())}
            className={[
              "rounded border px-2 py-1 text-[10px]",
              eventRecording
                ? "border-rose-400/50 bg-rose-950/40 text-rose-100"
                : "border-cyan-400/40 bg-cyan-950/30 text-cyan-100",
            ].join(" ")}
          >
            {eventRecording ? "Stop record" : "Record"}
          </button>
          <button
            type="button"
            onClick={clearEventLog}
            className="rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={toggleEventPlayback}
            disabled={!eventLogLen}
            className="rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted disabled:opacity-40"
          >
            {eventPlayback ? "Pause tape" : "Play tape"}
          </button>
          <button
            type="button"
            onClick={() => {
              const csv = exportEventLogCsv();
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
              a.download = "event_log_public.csv";
              a.click();
            }}
            disabled={!eventLogLen}
            className="rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted disabled:opacity-40"
          >
            Export tape CSV
          </button>
        </div>
        <p className="text-[9px] text-muted">
          Frames {eventLogLen}
          {eventTargetFrames ? ` / ${eventTargetFrames}` : ""} · {FRAME_NS} ns/frame
        </p>
        {eventLogLen > 0 && (
          <div>
            <div className="mb-1 flex justify-between text-[10px]">
              <span className="text-muted">Scrub</span>
            </div>
            <Slider
              min={0}
              max={Math.max(0, eventLogLen - 1)}
              step={1}
              value={[0]}
              onValueChange={(v) => setEventScrub(v[0] ?? 0)}
              aria-label="Event scrub"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setClampStart(0)}
            disabled={!eventLogLen}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted disabled:opacity-40"
          >
            Clamp start
          </button>
          <button
            type="button"
            onClick={() => setClampEnd(Math.max(0, eventLogLen - 1))}
            disabled={!eventLogLen}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted disabled:opacity-40"
          >
            Clamp end
          </button>
          <button
            type="button"
            onClick={fitClampToTape}
            disabled={!eventLogLen}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted disabled:opacity-40"
          >
            Fit clamp
          </button>
          <button
            type="button"
            onClick={clearClamp}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted"
          >
            Clear clamp
          </button>
          <ToggleRow label="Loop clamp" checked={clampLoop} onChange={setClampLoop} />
        </div>
        {(clampStart != null || clampEnd != null) && (
          <p className="text-[9px] text-subtle">
            Clamp [{clampStart ?? "—"}, {clampEnd ?? "—"}]
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => {
              const csv = exportClampCsv();
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
              a.download = "clamp_window_public.csv";
              a.click();
            }}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted"
          >
            Export clamp CSV
          </button>
          <button
            type="button"
            onClick={() => {
              const json = exportClampJson();
              const a = document.createElement("a");
              a.href = URL.createObjectURL(
                new Blob([json], { type: "application/json" }),
              );
              a.download = "clamp_window_public.json";
              a.click();
            }}
            className="rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted"
          >
            Export clamp JSON
          </button>
        </div>
        <div>
          <p className="mb-1 text-[10px] text-muted">Tape zoom</p>
          <div className="flex flex-wrap gap-1">
            {CLAMP_ZOOM_LEVELS.map((z) => (
              <button
                key={z}
                type="button"
                disabled={!eventLogLen}
                onClick={() => setTapeZoomLevel(z as ClampZoomLevel)}
                className={[
                  "rounded border px-1.5 py-0.5 text-[9px] disabled:opacity-40",
                  tapeZoomLevel === z
                    ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100"
                    : "border-border bg-surface text-muted",
                ].join(" ")}
              >
                {CLAMP_ZOOM_LABELS[z]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <p className="text-[9px] leading-relaxed text-subtle">{PUBLICATION_DISCLAIMER}</p>
      <p className="text-[8px] text-muted">{APP_VERSION_BANNER}</p>
    </aside>
  );
}
