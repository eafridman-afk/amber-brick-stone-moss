import { create } from "zustand";
import { buildSphereTree } from "@/lib/moleculo/sphere-tree";
import {
  buildNeighborConnectors,
  buildSurfaceTriangulation,
} from "@/lib/moleculo/mesh";
import { simEngine } from "@/lib/moleculo/engine";
import { REGIME_META, SPECIES } from "@/lib/moleculo/physics";
import type { RoiEnergySnapshot } from "@/lib/moleculo/energy";
import type { HysteresisSample, CrossingEvent } from "@/lib/moleculo/hysteresis";
import type { ScenarioBanner, ScenarioId } from "@/lib/moleculo/scenarios";
import type { RoiAgentSnapshot } from "@/lib/moleculo/snapshot";
import type { ScientificSnapshot } from "@/lib/moleculo/scientific-stats";
import { mean, median } from "@/lib/moleculo/scientific-stats";
import {
  loadJsonFromPicker,
  parseScientificSnapshot,
  saveScientificBundle,
  stampBaseName,
} from "@/lib/moleculo/scientific-io";
import type {
  ClampZoomLevel,
  ConnectorMesh,
  EventLogFrame,
  LigandBaselineMode,
  LigandClass,
  MetalMode,
  MoleculeKind,
  PeptideVariant,
  ProgrammeId,
  ReceptorGeometryId,
  SphereNode,
  SurfaceMesh,
} from "@/lib/moleculo/types";
import {
  DISPLAY_DURATION_DEFAULT,
  DISPLAY_DURATION_MAX,
  DISPLAY_DURATION_MIN,
} from "@/lib/moleculo/types";

const tree = buildSphereTree(16);

function fieldFn(x: number, y: number, z: number) {
  return simEngine.potentialAt(x, y, z);
}

function buildSurfaceFor(id: number | null, nodes: SphereNode[]): SurfaceMesh | null {
  if (id == null) return null;
  const node = nodes.find((n) => n.id === id);
  if (!node) return null;
  return buildSurfaceTriangulation(node, true, fieldFn);
}

function buildConnectors(
  nodes: SphereNode[],
  level1Ids: number[],
  level2ByParent: Map<number, number[]>,
  expanded: number[],
  showL2: boolean,
): ConnectorMesh[] {
  const ids = [...level1Ids];
  if (showL2) {
    for (const pid of expanded) {
      const kids = level2ByParent.get(pid);
      if (kids) ids.push(...kids);
    }
  }
  return buildNeighborConnectors(nodes, ids);
}

function switchFromEngine() {
  const e = simEngine.roiEnergy;
  const prot =
    simEngine.proteins[simEngine.focusedProteinIndex] ?? simEngine.proteins[0];
  return {
    switchDisplayOn: e?.switchDisplayOn ?? prot?.switchDisplayOn ?? false,
    switchOverride: e?.switchOverride ?? prot?.switchOverride ?? null,
    continuousScore: e?.continuousScore ?? prot?.continuousScore ?? 0,
    hisProtonationDisplay: prot?.hisProtonation ?? simEngine.hisTheta,
    hystHistory: [...simEngine.hystHistory],
    lastPhDirection: simEngine.lastPhDirection,
    lastCrossing: simEngine.lastCrossing,
    crossings: [...simEngine.crossings],
    sweepActive: simEngine.sweepActive,
    hystBandRegion: simEngine.hystBandRegion(),
    activeScenario: simEngine.activeScenario,
    scenarioBanner: simEngine.scenarioBanner
      ? { ...simEngine.scenarioBanner }
      : null,
  };
}

function statsFromEngine() {
  const s = simEngine.behaviorStats;
  return {
    switchEvents: s.switchEvents,
    clampEvents: s.clampEvents,
    proximityEvents: s.proximityEvents,
    hhBinaryEvents: s.hhBinaryEvents,
    meanTriggerDistNm:
      s.triggerDistancesNm.length > 0 ? mean(s.triggerDistancesNm) : null,
    medianTriggerDistNm:
      s.triggerDistancesNm.length > 0 ? median(s.triggerDistancesNm) : null,
    meanResponseTimeNs:
      s.responseTimesNs?.length > 0 ? mean(s.responseTimesNs) : null,
    medianResponseTimeNs:
      s.responseTimesNs?.length > 0 ? median(s.responseTimesNs) : null,
  };
}

const defaultSelected = tree.level2Ids[2] ?? tree.level1Ids[3] ?? null;
const expanded0 = tree.level1Ids.slice(0, 5);

type UiState = {
  pH: number;
  playing: boolean;
  timeNs: number;
  moleculeCount: number;
  showTriangulation: boolean;
  showConnectors: boolean;
  showField: boolean;
  fieldOpacity: number;
  showL2: boolean;
  showProteins: boolean;
  showForceArrows: boolean;
  selectedSphereId: number | null;
  expandedParents: number[];
  nodes: SphereNode[];
  level1Ids: number[];
  level2ByParent: Map<number, number[]>;
  surface: SurfaceMesh | null;
  connectors: ConnectorMesh[];
  trajectoryLen: number;
  scrubIndex: number | null;
  fps: number;
  speciesList: typeof SPECIES;
  debyeLength: number;
  debyeNm: number;
  regime: import("@/lib/moleculo/types").PhRegime;
  metalMode: MetalMode;
  enabledKinds: Record<"metal" | "peptide" | "generic", boolean>;
  ligand2Enabled: boolean;
  ligand2Count: number;
  ligand2ChargeScale: number;
  ligandBaseline: LigandBaselineMode;
  peptideVariant: PeptideVariant;
  ligand3Enabled: boolean;
  ligand3Count: number;
  ligand4Enabled: boolean;
  ligand4Count: number;
  activeProgramme: string | null;
  lastProgrammeSummary: string | null;
  respawnOnBinding: boolean;
  metalHisPrefFactor: number;
  metalHisPrefEnabled: boolean;
  shortRangeWellEnabled: boolean;
  shortRangeWellDepthKt: number;
  displayDurationSec: number;
  demoSpeed: number;
  receptorGeometry: ReceptorGeometryId;
  lastSnapshotJson: string;
  lastSnapshotAt: string | null;
  meanCharge: number;
  meanProteinResponse: number;
  focusRequest: number;
  hisProtonationDisplay: number;
  roiFocused: boolean;
  roiEnergy: RoiEnergySnapshot | null;
  switchDisplayOn: boolean;
  switchOverride: boolean | null;
  continuousScore: number;
  hystHistory: HysteresisSample[];
  lastPhDirection: "up" | "down" | "unknown";
  lastCrossing: CrossingEvent | null;
  crossings: CrossingEvent[];
  sweepActive: boolean;
  hystBandRegion: "below" | "band" | "above";
  activeScenario: ScenarioId | null;
  scenarioBanner: ScenarioBanner | null;
  eventLogLen: number;
  eventRecording: boolean;
  eventPlayback: boolean;
  eventScrub: number | null;
  eventLabel: string;
  eventTargetFrames: number;
  eventCap: number;
  eventFrame: EventLogFrame | null;
  clampStart: number | null;
  clampEnd: number | null;
  clampLoop: boolean;
  tapeZoomLevel: ClampZoomLevel;
  tapePanOffset: number;
  eventSeries: {
    tNs: number;
    eL1: number;
    eL2: number;
    eL12: number;
    eTot: number;
    on: boolean;
  }[];
  clampCapturing: boolean;
  clampArmed: boolean;
  clampAutoTrigger: boolean;
  isClampEvent: boolean;
  clampFocusRequest: number;
  clampZoomLevel: ClampZoomLevel;
  hisPka: number;
  hisTheta: number;
  debyeOverrideNm: number | null;
  switchEvents: number;
  clampEvents: number;
  proximityEvents: number;
  hhBinaryEvents: number;
  meanTriggerDistNm: number | null;
  medianTriggerDistNm: number | null;
  meanResponseTimeNs: number | null;
  medianResponseTimeNs: number | null;
  lastScientificJson: string;
  lastValiditySummary: string | null;
  validityProgress: string | null;
  lastRespawnFlash: {
    particleId: number;
    ligandClass: string;
    oldDistNm: number;
    newDistNm: number;
    ticksLeft: number;
  } | null;

  setPH: (pH: number) => void;
  togglePlay: () => void;
  setMoleculeCount: (n: number) => void;
  setShowTriangulation: (v: boolean) => void;
  setShowConnectors: (v: boolean) => void;
  setShowField: (v: boolean) => void;
  setFieldOpacity: (a: number) => void;
  setShowL2: (v: boolean) => void;
  setShowProteins: (v: boolean) => void;
  setShowForceArrows: (v: boolean) => void;
  setMetalMode: (mode: MetalMode) => void;
  setKindEnabled: (kind: "metal" | "peptide" | "generic", enabled: boolean) => void;
  setLigand2Enabled: (v: boolean) => void;
  setLigand2Count: (n: number) => void;
  setLigand2ChargeScale: (n: number) => void;
  setLigandBaseline: (mode: LigandBaselineMode) => void;
  setPeptideVariant: (v: PeptideVariant) => void;
  setLigand3Enabled: (v: boolean) => void;
  setLigand3Count: (n: number) => void;
  setLigand4Enabled: (v: boolean) => void;
  setLigand4Count: (n: number) => void;
  applyProgrammeSetup: (
    programmeId: ProgrammeId,
    ligandSetId: string,
    receptorId?: ReceptorGeometryId,
    pH?: number,
  ) => void;
  runProgrammeSuite: (programmeId: ProgrammeId) => Promise<string>;
  setRespawnOnBinding: (v: boolean) => void;
  setMetalHisPrefFactor: (n: number) => void;
  setMetalHisPrefEnabled: (v: boolean) => void;
  setShortRangeWellEnabled: (v: boolean) => void;
  setShortRangeWellDepthKt: (n: number) => void;
  setDisplayDurationSec: (sec: number) => void;
  setDemoSpeed: (mult: number) => void;
  showPrivateNanotoxicity: boolean;
  setShowPrivateNanotoxicity: (v: boolean) => void;
  runPubMatrix: (opts?: { nMolecules?: number; frames?: number; replicates?: number }) => string;
  runPubMatrixCuEF: (opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
  }) => string;
  /** @deprecated use runPubMatrixCuEF */
  runPubMatrixCuPbEF: (opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
    includeAD?: boolean;
  }) => string;


  setReceptorGeometry: (id: ReceptorGeometryId) => void;
  exportRoiSnapshot: () => RoiAgentSnapshot | null;
  selectSphere: (id: number | null) => void;
  reset: () => void;
  setScrubIndex: (i: number | null) => void;
  setFps: (n: number) => void;
  syncFromEngine: () => void;
  refreshSurfaceScalars: () => void;
  focusHisRoi: (index?: number) => void;
  spawnNearRoi: (cls: LigandClass) => void;
  toggleHisSwitch: (index?: number) => void;
  toggleHisSite: (proteinIndex: number, siteIndex: number) => void;
  clearHisSwitchOverride: () => void;
  startHysteresisSweep: () => void;
  stopHysteresisSweep: () => void;
  clearHysteresisHistory: () => void;
  applyScenario: (id: ScenarioId) => void;
  startRecordEvent: () => void;
  stopRecordEvent: () => void;
  clearEventLog: () => void;
  setEventScrub: (i: number | null) => void;
  toggleEventPlayback: () => void;
  startClampCapture: (opts?: { spawn?: boolean }) => void;
  setClampAutoTrigger: (v: boolean) => void;
  setClampZoomLevel: (level: ClampZoomLevel) => void;
  setClampWindow: (i0?: number, i1?: number) => void;
  setClampStart: (i: number) => void;
  setClampEnd: (i: number) => void;
  clearClamp: () => void;
  setClampLoop: (v: boolean) => void;
  fitClampToTape: () => void;
  setTapeZoomLevel: (level: ClampZoomLevel) => void;
  panTapeBy: (frames: number) => void;
  exportClampCsv: () => string;
  exportClampJson: () => string;
  exportEventLogCsv: () => string;
  setDebyeNm: (nm: number) => void;
  clearDebyeOverride: () => void;
  setHisPka: (pKa: number) => void;
  resetBehaviorCounters: () => void;
  exportScientificSnapshot: () => ScientificSnapshot | null;
  exportScientificCsv: () => string;
  saveScientificToFolder: () => Promise<string>;
  loadScientificFromFolder: () => Promise<string>;
  runValiditySuite: (opts?: { includeRamp?: boolean }) => string;
  regimeLabel: () => string;
};

function engineSlice() {
  return {
    pH: simEngine.pH,
    playing: simEngine.playing,
    timeNs: simEngine.timeNs,
    moleculeCount: simEngine.moleculeCount,
    debyeLength: simEngine.params.debyeLength,
    debyeNm: simEngine.params.debyeNm,
    regime: simEngine.params.regime,
    metalMode: simEngine.metalMode,
    ligand2Enabled: simEngine.ligand2Enabled,
    ligand2Count: simEngine.ligand2Count,
    ligand2ChargeScale: simEngine.ligand2ChargeScale,
    ligandBaseline: simEngine.ligandBaseline,
    peptideVariant: simEngine.peptideVariant,
    ligand3Enabled: simEngine.ligand3Enabled,
    ligand3Count: simEngine.ligand3Count,
    ligand4Enabled: simEngine.ligand4Enabled,
    ligand4Count: simEngine.ligand4Count,
    activeProgramme: simEngine.activeProgramme,
    respawnOnBinding: simEngine.respawnOnBinding,
    metalHisPrefFactor: simEngine.metalHisPrefFactor,
    metalHisPrefEnabled: simEngine.metalHisPrefEnabled,
    shortRangeWellEnabled: simEngine.shortRangeWellEnabled,
    shortRangeWellDepthKt: simEngine.shortRangeWellDepthKt,
    displayDurationSec: simEngine.displayDurationSec,
    receptorGeometry: simEngine.receptorGeometry,
    meanCharge: simEngine.meanCharge(),
    meanProteinResponse: simEngine.meanProteinResponse(),
    focusRequest: simEngine.focusRequest,
    roiFocused: simEngine.roiFocused,
    roiEnergy: simEngine.roiEnergy,
    trajectoryLen: simEngine.trajectory.length,
    scrubIndex: simEngine.scrubIndex,
    eventLogLen: simEngine.eventLog.length,
    eventRecording: simEngine.eventRecording,
    eventPlayback: simEngine.eventPlayback,
    eventScrub: simEngine.eventScrub,
    eventLabel: simEngine.eventLabel,
    eventTargetFrames: simEngine.eventTargetFrames,
    eventCap: simEngine.eventCap,
    eventFrame: simEngine.activeEventFrame,
    clampStart: simEngine.clampStart,
    clampEnd: simEngine.clampEnd,
    clampLoop: simEngine.clampLoop,
    tapeZoomLevel: simEngine.tapeZoomLevel,
    tapePanOffset: simEngine.tapePanOffset,
    clampCapturing: simEngine.clampCapturing,
    clampArmed: simEngine.clampArmed,
    clampAutoTrigger: simEngine.clampAutoTrigger,
    isClampEvent: simEngine.isClampEvent,
    clampFocusRequest: simEngine.clampFocusRequest,
    clampZoomLevel: simEngine.clampZoomLevel,
    hisPka: simEngine.hisPka,
    hisTheta: simEngine.hisTheta,
    debyeOverrideNm: simEngine.debyeOverrideNm,
    lastScientificJson: simEngine.lastScientificJson,
    lastRespawnFlash: simEngine.lastRespawnFlash
      ? { ...simEngine.lastRespawnFlash }
      : null,
    lastSnapshotJson: simEngine.lastSnapshotJson,
    showField: simEngine.showField,
    fieldOpacity: simEngine.fieldOpacity,
    showForceArrows: simEngine.showForceArrows,
    ...switchFromEngine(),
    ...statsFromEngine(),
  };
}

export const useSimStore = create<UiState>((set, get) => ({
  ...engineSlice(),
  showTriangulation: true,
  showConnectors: true,
  showL2: true,
  showProteins: true,
  selectedSphereId: defaultSelected,
  expandedParents: expanded0,
  nodes: tree.nodes,
  level1Ids: tree.level1Ids,
  level2ByParent: tree.level2ByParent,
  surface: buildSurfaceFor(defaultSelected, tree.nodes),
  connectors: buildConnectors(
    tree.nodes,
    tree.level1Ids,
    tree.level2ByParent,
    expanded0,
    true,
  ),
  fps: 0,
  speciesList: SPECIES,
  enabledKinds: { metal: true, peptide: true, generic: true },
  demoSpeed: 0.5,
  showPrivateNanotoxicity: false,
  lastProgrammeSummary: null,
  lastSnapshotAt: null,
  eventSeries: [],
  lastValiditySummary: null,
  validityProgress: null,

  setPH: (pH) => {
    simEngine.setPH(pH);
    set({ ...engineSlice() });
  },
  togglePlay: () => {
    simEngine.togglePlay();
    set({ playing: simEngine.playing });
  },
  setMoleculeCount: (n) => {
    simEngine.setMoleculeCount(n);
    set({ ...engineSlice() });
  },
  setShowTriangulation: (v) => set({ showTriangulation: v }),
  setShowConnectors: (v) => set({ showConnectors: v }),
  setShowField: (v) => {
    simEngine.setShowField(v);
    set({ showField: v });
  },
  setFieldOpacity: (a) => {
    simEngine.setFieldOpacity(a);
    set({ fieldOpacity: simEngine.fieldOpacity });
  },
  setShowL2: (v) => {
    set({ showL2: v });
    const s = get();
    set({
      connectors: buildConnectors(
        s.nodes,
        s.level1Ids,
        s.level2ByParent,
        s.expandedParents,
        v,
      ),
    });
  },
  setShowProteins: (v) => set({ showProteins: v }),
  setShowForceArrows: (v) => {
    simEngine.setShowForceArrows(v);
    set({ showForceArrows: v });
  },
  setMetalMode: (mode) => {
    simEngine.setMetalMode(mode);
    set({ ...engineSlice() });
  },
  setKindEnabled: (kind, enabled) => {
    simEngine.setKindEnabled(String(kind), enabled);
    set({
      enabledKinds: { ...get().enabledKinds, [kind]: enabled },
      ...engineSlice(),
    });
  },
  setLigand2Enabled: (v) => {
    simEngine.setLigand2Enabled(v);
    set({ ...engineSlice() });
  },
  setLigand2Count: (n) => {
    simEngine.setLigand2Count(n);
    set({ ...engineSlice() });
  },
  setLigand2ChargeScale: (n) => {
    simEngine.setLigand2ChargeScale(n);
    set({ ...engineSlice() });
  },
  setLigandBaseline: (mode) => {
    simEngine.setLigandBaseline(mode);
    set({ ...engineSlice() });
  },
  setPeptideVariant: (v) => {
    simEngine.setPeptideVariant(v);
    set({ ...engineSlice() });
  },
  setLigand3Enabled: (v) => {
    simEngine.setLigand3Enabled(v);
    set({ ...engineSlice() });
  },
  setLigand3Count: (n) => {
    simEngine.setLigand3Count(n);
    set({ ...engineSlice() });
  },
  setLigand4Enabled: (v) => {
    simEngine.setLigand4Enabled(v);
    set({ ...engineSlice() });
  },
  setLigand4Count: (n) => {
    simEngine.setLigand4Count(n);
    set({ ...engineSlice() });
  },
  applyProgrammeSetup: (programmeId, ligandSetId, receptorId, pH) => {
    simEngine.applyProgrammeSetup(programmeId, ligandSetId, receptorId, pH);
    set({ ...engineSlice(), activeProgramme: programmeId });
  },
  runProgrammeSuite: async (programmeId) => {
    const result = simEngine.runProgrammeSuite(programmeId, {
      frames: 200,
      replicates: 5,
      seed: 20260805,
      includeRamp: false,
    });
    // auto-download
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(
        new Blob([result.json], { type: "application/json" }),
      );
      a.download = `programme_${programmeId}_${Date.now()}.json`;
      a.click();
      const a2 = document.createElement("a");
      a2.href = URL.createObjectURL(new Blob([result.csv], { type: "text/csv" }));
      a2.download = `programme_${programmeId}_${Date.now()}.csv`;
      a2.click();
    } catch {
      /* ignore */
    }
    set({ lastProgrammeSummary: result.summary, ...engineSlice() });
    return result.summary;
  },
  setRespawnOnBinding: (v) => {
    simEngine.setRespawnOnBinding(v);
    set({ respawnOnBinding: v });
  },
  setMetalHisPrefFactor: (n) => {
    simEngine.setMetalHisPrefFactor(n);
    set({ metalHisPrefFactor: n });
  },
  setMetalHisPrefEnabled: (v) => {
    simEngine.setMetalHisPrefEnabled(v);
    set({ metalHisPrefEnabled: v });
  },
  setShortRangeWellEnabled: (v) => {
    simEngine.setShortRangeWellEnabled(v);
    set({ ...engineSlice() });
  },
  setShortRangeWellDepthKt: (n) => {
    simEngine.setShortRangeWellDepthKt(n);
    set({ ...engineSlice() });
  },
  setDisplayDurationSec: (sec) => {
    const clamped = Math.max(
      DISPLAY_DURATION_MIN,
      Math.min(DISPLAY_DURATION_MAX, sec),
    );
    simEngine.setDisplayDurationSec(clamped);
    set({ displayDurationSec: clamped });
  },
  setDemoSpeed: (mult) => {
    const allowed = [0.25, 0.5, 1];
    const v = allowed.reduce((best, x) =>
      Math.abs(x - mult) < Math.abs(best - mult) ? x : best, 0.5);
    set({ demoSpeed: v });
  },
  setShowPrivateNanotoxicity: (v) => {
    if (!v) {
      // hard-off L3 when leaving private mode
      simEngine.setLigand3Enabled(false);
    }
    set({ showPrivateNanotoxicity: v, ...engineSlice() });
  },
  runPubMatrix: (opts) => {
    const r = simEngine.runPubMatrix(opts);
    try {
      const dl = (name: string, body: string, mime: string) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([body], { type: mime }));
        a.download = name;
        a.click();
      };
      dl("PUB_MATRIX_mean_sd.csv", r.csv, "text/csv");
      dl("PUB_MATRIX_ranking_per_receptor.csv", r.rankingCsv, "text/csv");
      dl("PUB_MATRIX_E_vs_F_Menkes.csv", r.eVsFCsv, "text/csv");
      dl("PUB_MATRIX.json", r.json, "application/json");
    } catch {
      /* ignore */
    }
    set({ lastProgrammeSummary: r.summary, ...engineSlice(), lastScientificJson: r.json });
    return r.summary;
  },
  runPubMatrixCuEF: (opts) => {
    const r = simEngine.runPubMatrixCuEF(opts);
    try {
      const dl = (name: string, body: string, mime: string) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([body], { type: mime }));
        a.download = name;
        a.click();
      };
      dl("PUB_MATRIX_Cu_E_F_mean_sd.csv", r.meanSdCsv, "text/csv");
      dl("PUB_MATRIX_Cu_E_vs_F_contrast.csv", r.contrastCsv, "text/csv");
      dl("PUB_MATRIX_ranking_E_F_with_Cu.csv", r.rankingEFCsv, "text/csv");
      dl("PUB_MATRIX_Cu_E_F.json", r.json, "application/json");
    } catch {
      /* ignore */
    }
    set({ lastProgrammeSummary: r.summary, ...engineSlice(), lastScientificJson: r.json });
    return r.summary;
  },
  runPubMatrixCuPbEF: (opts) => {
    return get().runPubMatrixCuEF(opts);
  },
  setReceptorGeometry: (id) => {


    simEngine.setReceptorGeometry(id);
    set({ ...engineSlice() });
  },
  exportRoiSnapshot: () => {
    const snap = simEngine.exportRoiSnapshot();
    if (snap) {
      set({
        lastSnapshotJson: simEngine.lastSnapshotJson,
        lastSnapshotAt: new Date().toISOString(),
      });
    }
    return snap;
  },
  selectSphere: (id) => {
    const s = get();
    const node = id != null ? s.nodes.find((n) => n.id === id) : null;
    const expandedParents = new Set(s.expandedParents);
    if (node?.level === 1) expandedParents.add(node.id);
    if (node?.level === 2 && node.parentId != null)
      expandedParents.add(node.parentId);
    const exp = [...expandedParents];
    set({
      selectedSphereId: id,
      expandedParents: exp,
      surface: buildSurfaceFor(id, s.nodes),
      connectors: buildConnectors(
        s.nodes,
        s.level1Ids,
        s.level2ByParent,
        exp,
        s.showL2,
      ),
    });
  },
  reset: () => {
    simEngine.reset();
    set({ ...engineSlice() });
  },
  setScrubIndex: (i) => {
    simEngine.setScrubIndex(i);
    set({ scrubIndex: i });
  },
  setFps: (n) => set({ fps: n }),
  syncFromEngine: () => {
    set({ ...engineSlice() });
  },
  refreshSurfaceScalars: () => {
    const s = get();
    if (s.selectedSphereId != null) {
      set({ surface: buildSurfaceFor(s.selectedSphereId, s.nodes) });
    }
  },
  focusHisRoi: (index = 0) => {
    simEngine.focusHisRoi(index);
    set({ ...engineSlice() });
  },
  spawnNearRoi: (cls) => {
    simEngine.spawnNearRoi(cls);
    set({ ...engineSlice() });
  },
  toggleHisSwitch: (index = 0) => {
    simEngine.toggleHisSwitch(index);
    set({ ...engineSlice() });
  },
  toggleHisSite: (proteinIndex, siteIndex) => {
    simEngine.toggleHisSite(proteinIndex, siteIndex);
    set({ ...engineSlice() });
  },
  clearHisSwitchOverride: () => {
    simEngine.clearHisSwitchOverride();
    set({ ...engineSlice() });
  },
  startHysteresisSweep: () => {
    simEngine.startHysteresisSweep();
    set({ ...engineSlice() });
  },
  stopHysteresisSweep: () => {
    simEngine.stopHysteresisSweep();
    set({ ...engineSlice() });
  },
  clearHysteresisHistory: () => {
    simEngine.clearHysteresisHistory();
    set({ ...engineSlice() });
  },
  applyScenario: (id) => {
    simEngine.applyScenario(id);
    set({ ...engineSlice() });
  },
  startRecordEvent: () => {
    simEngine.startRecordEvent();
    set({ ...engineSlice() });
  },
  stopRecordEvent: () => {
    simEngine.stopRecordEvent();
    set({ ...engineSlice() });
  },
  clearEventLog: () => {
    simEngine.clearEventLog();
    set({ ...engineSlice() });
  },
  setEventScrub: (i) => {
    simEngine.setEventScrub(i);
    set({ ...engineSlice() });
  },
  toggleEventPlayback: () => {
    simEngine.toggleEventPlayback();
    set({ ...engineSlice() });
  },
  startClampCapture: (opts) => {
    simEngine.startClampCapture(opts);
    set({ ...engineSlice() });
  },
  setClampAutoTrigger: (v) => {
    simEngine.setClampAutoTrigger(v);
    set({ clampAutoTrigger: v });
  },
  setClampZoomLevel: (level) => {
    simEngine.setClampZoomLevel(level);
    set({ ...engineSlice() });
  },
  setClampWindow: (i0, i1) => {
    simEngine.setClampWindow(i0, i1);
    set({ ...engineSlice() });
  },
  setClampStart: (i) => {
    simEngine.setClampStart(i);
    set({ ...engineSlice() });
  },
  setClampEnd: (i) => {
    simEngine.setClampEnd(i);
    set({ ...engineSlice() });
  },
  clearClamp: () => {
    simEngine.clearClamp();
    set({ ...engineSlice() });
  },
  setClampLoop: (v) => {
    simEngine.setClampLoop(v);
    set({ ...engineSlice() });
  },
  fitClampToTape: () => {
    simEngine.fitClampToTape();
    set({ ...engineSlice() });
  },
  setTapeZoomLevel: (level) => {
    simEngine.setTapeZoomLevel(level);
    set({ ...engineSlice() });
  },
  panTapeBy: (frames) => {
    simEngine.panTapeBy(frames);
    set({ ...engineSlice() });
  },
  exportClampCsv: () => simEngine.exportClampCsv(),
  exportClampJson: () => simEngine.exportClampJson(),
  exportEventLogCsv: () => simEngine.exportEventLogCsv(),
  setDebyeNm: (nm) => {
    simEngine.setDebyeNm(nm);
    set({ ...engineSlice() });
  },
  clearDebyeOverride: () => {
    simEngine.clearDebyeOverride();
    set({ ...engineSlice() });
  },
  setHisPka: (pKa) => {
    simEngine.setHisPka(pKa);
    set({ ...engineSlice() });
  },
  resetBehaviorCounters: () => {
    simEngine.resetBehaviorCounters();
    set({ ...statsFromEngine() });
  },
  exportScientificSnapshot: () => {
    const snap = simEngine.exportScientificSnapshot();
    set({ lastScientificJson: simEngine.lastScientificJson });
    return snap;
  },
  exportScientificCsv: () => simEngine.exportScientificCsv(),
  saveScientificToFolder: async () => {
    const snap = simEngine.exportScientificSnapshot();
    if (!snap) return "No snapshot";
    const result = await saveScientificBundle({
      baseName: stampBaseName("scientific"),
      snapshotJson: JSON.stringify(snap, null, 2),
      snapshotCsv: simEngine.exportScientificCsv(),
      energySeriesCsv: simEngine.exportEnergySeriesCsv(),
      eventLogCsv: simEngine.exportBehaviorSamplesCsv(),
    });
    if (result.ok) return `${result.method}: ${result.detail}`;
    return `Failed: ${"error" in result ? result.error : "unknown"}`;
  },
  loadScientificFromFolder: async () => {
    try {
      const loaded = await loadJsonFromPicker();
      if (!loaded.ok) return loaded.error;
      const snap = parseScientificSnapshot(loaded.text);
      if (!snap) return "Invalid snapshot JSON";
      simEngine.applyScientificSnapshot(snap);
      set({ ...engineSlice() });
      return "Snapshot loaded";
    } catch (e) {
      return String(e);
    }
  },
  runValiditySuite: (opts) => {
    try {
      set({ validityProgress: "Running…" });
      const suite = simEngine.runValiditySuite(opts);
      const lines = suite.aggregates.map((a) => {
        const prot =
          a.protocol.kind === "fixed-pH" ? `pH ${a.protocol.pH}` : "ramp";
        return `${a.baselineId} | ${prot} | prox ${a.proximityEvents.mean.toFixed(1)}±${a.proximityEvents.sd.toFixed(1)} | |U| ${Math.abs(a.meanUPepHis.mean).toFixed(2)}`;
      });
      const summary = lines.join("\n") || "Validity suite complete";
      set({
        ...engineSlice(),
        lastValiditySummary: summary,
        validityProgress: null,
      });
      return summary;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      set({ validityProgress: null, lastValiditySummary: msg });
      return msg;
    }
  },
  regimeLabel: () => REGIME_META[get().regime as keyof typeof REGIME_META]?.label ?? String(get().regime),
}));

export type { UiState };
