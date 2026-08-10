/**
 * MoleculoSphere 5D simulation engine — classical continuum electrostatics.
 * nm-unit Yukawa + HH + dual events + programmes + validity suite.
 */
import type {
  ClampZoomLevel,
  EventLogFrame,
  EventLogParticle,
  LigandBaselineMode,
  LigandClass,
  MetalMode,
  Particle,
  PeptideVariant,
  ProgrammeId,
  ReceptorGeometryId,
  SimParams,
  TrajectoryFrame,
} from "./types";
import {
  CLAMP_MAX_FRAMES,
  CLAMP_MIN_POST_FRAMES,
  CLAMP_PLAYBACK_SEC,
  CLAMP_PREROLL_FRAMES,
  CLAMP_STABLE_FRAMES,
  CLAMP_TRIGGER_DIST,
  CLAMP_ZOOM_LEVELS,
  DOMAIN_RADIUS,
  EVENT_WINDOW_FRAMES,
  EVENT_RECORD_CAP,
  FRAME_NS,
  MAX_MOLECULES,
  MAX_TRAJECTORY_FRAMES,
  METAL_HIS_PREF_DEFAULT,
  PUBLIC_BUILD_DEFAULT,
  PUBLICATION_DISCLAIMER,
  RECEPTOR_GEOMETRIES,
  SHORT_RANGE_WELL_CUTOFF_NM,
  SHORT_RANGE_WELL_DEPTH_DEFAULT,
  SHORT_RANGE_WELL_SIGMA_NM,
  heavyMetalLabel,
  resolveHeavyMetal,
  targetStepsPerSecond,
} from "./types";


import {
  SPECIES,
  speciesMap,
  buildSimParams,
  computeForces,
  debyeFromPH,
  effectiveCharge,
  fieldAt,
  ligand1Species,
  ligand2Species,
  ligand3Species,
  ligand4Species,
  makeSeededRng,
  spawnParticles,
  stepOverdamped,
  wallForce,
} from "./physics";
import { computeRoiEnergy, type RoiEnergySnapshot } from "./energy";
import { setCoordScaleToNm, sceneToNm, nmToScene } from "./energy-kernel";
import {
  createProteinProxyDefs,
  initProteinStates,
  roiWorldPos,
  hisSiteWorldPos,
  updateHisSwitchBinary,
  updateProteinResponses,
  hisSiteForces,
  hisProtonationHH,
  hisFormalCharge,
} from "./proteins";
import {
  emptyBehaviorStats,
  updateBehaviorTracking,
  buildScientificSnapshot,
  scientificSnapshotToCsv,
  eventSeriesToCsv,
  behaviorSamplesToCsv,
  type BehaviorStats,
  type PendingApproach,
  type PendingSwitchEvent,
  type PendingProximityEvent,
  type ScientificSnapshot,
  PROXIMITY_EVENT_NM,
  EVENT_CONFIRM_FRAMES,
} from "./scientific-stats";
import {
  VALIDITY_LOCKED,
  VALIDITY_BASELINES,
  VALIDITY_FIXED_PH,
  VALIDITY_RAMP,
  aggregateReplicates,
  suiteToCsv,
    meanSd as validityMeanSd,
  forceCutoffSceneFromLocked,
  type ValiditySuiteResult,
  type ValidityReplicateResult,
  type ValidityBaselineId,
  type DiagFrameRow,
} from "./validity-test";
import {
  PROGRAMMES,
  defaultProgrammeRun,
  programmeExportMeta,
  meanSd,
  setToMetalMode,
  type LigandSetSpec,
} from "./programmes";
import { SCENARIOS, type ScenarioId, type ScenarioBanner } from "./scenarios";
import {
  HYST_HISTORY_MAX,
  type HysteresisSample,
  type CrossingEvent,
} from "./hysteresis";
import { buildFieldSlice, type FieldSliceData } from "./field-viz";
import {
  buildRoiAgentSnapshot,
  type RoiAgentSnapshot,
} from "./snapshot";

const SPECIES_MAP_LOCAL = speciesMap();

function makeRng(seed: number) {
  return makeSeededRng(seed >>> 0);
}

export class SimEngine {
  pH = 7.4;
  playing = true;
  timeNs = 0;
  moleculeCount = 12;
  metalMode: MetalMode = "pb";
  ligandBaseline: LigandBaselineMode = "both";
  peptideVariant: PeptideVariant = "ksrrrar";
  ligand2Enabled = true;
  ligand2Count = 4;
  ligand2ChargeScale = 1;
  ligand3Enabled = false;
  ligand3Count = 0;
  ligand4Enabled = false;
  ligand4Count = 0;
  respawnOnBinding = false;
  metalHisPrefFactor = METAL_HIS_PREF_DEFAULT;
  metalHisPrefEnabled = false;
  shortRangeWellEnabled = false;
  shortRangeWellDepthKt = SHORT_RANGE_WELL_DEPTH_DEFAULT;
  displayDurationSec = 10;
  receptorGeometry: ReceptorGeometryId = "furin";
  focusedProteinIndex = 0;
  roiFocused = false;
  focusRequest = 0;
  focusTarget: { x: number; y: number; z: number } | null = null;

  params: SimParams = buildSimParams(7.4);
  debyeOverrideNm: number | null = null;
  hisPka = 6.2;
  hisTheta = 0;

  particles: Particle[] = [];
  proteins = initProteinStates(createProteinProxyDefs("furin"), 7.4);
  trajectory: TrajectoryFrame[] = [];
  scrubIndex: number | null = null;
  nextId = 1;
  spawnSeed = 20260805;
  rngSeed = 20260805;
  rng = makeRng(20260805);

  fx = new Float32Array(64);
  fy = new Float32Array(64);
  fz = new Float32Array(64);

  roiEnergy: RoiEnergySnapshot | null = null;
  showField = false;
  showForceArrows = true;
  fieldOpacity = 0.45;
  fieldSlice: FieldSliceData | null = null;
  stepsSinceUi = 0;

  // events / clamp
  eventLog: EventLogFrame[] = [];
  eventRecording = false;
  eventPlayback = false;
  eventScrub: number | null = null;
  eventLabel = "";
  eventTargetFrames = EVENT_RECORD_CAP;
  /** Record buffer cap N (default 500). */
  eventCap = EVENT_RECORD_CAP;
  /** stop = freeze at N; ring = oldest-drop. */
  eventCapMode: "stop" | "ring" = "stop";
  clampCapturing = false;
  clampArmed = false;
  clampAutoTrigger = false;
  isClampEvent = false;
  clampFocusRequest = 0;
  /** Legacy 3D clamp-camera zoom (kept); tape uses tapeZoomLevel. */
  clampZoomLevel: ClampZoomLevel = "100";
  clampLastSwitch: boolean | null = null;
  clampStableCount = 0;
  clampPostFrames = 0;
  clampCamLock: { x: number; y: number; z: number } | null = null;
  /** Clamp rulers on the event tape [i0, i1] inclusive. null = full run. */
  clampStart: number | null = null;
  clampEnd: number | null = null;
  clampLoop = false;
  /** Tape time-window zoom (100/75/50/25%). */
  tapeZoomLevel: ClampZoomLevel = "100";
  /** Fine pan offset (frames) when tape is zoomed. */
  tapePanOffset = 0;
  private _hhEventsAtRecord = 0;
  private _proxEventsAtRecord = 0;

  // behavior
  behaviorStats: BehaviorStats = emptyBehaviorStats();
  pendingApproach: PendingApproach | null = null;
  pendingSwitch: PendingSwitchEvent | null = null;
  pendingProximity: PendingProximityEvent | null = null;
  behaviorPrevSwitch: boolean | null = null;
  /** Short-lived HUD chip after a proximity respawn (demo). */
  lastRespawnFlash: {
    particleId: number;
    ligandClass: LigandClass;
    oldDistNm: number;
    newDistNm: number;
    ticksLeft: number;
  } | null = null;

  // hysteresis
  hystHistory: HysteresisSample[] = [];
  lastCrossing: CrossingEvent | null = null;
  crossings: CrossingEvent[] = [];
  lastPhDirection: "up" | "down" | "unknown" = "unknown";
  lastSwitchOn: boolean | null = null;
  sweepActive = false;
  private _hystBandRegion: "below" | "band" | "above" = "band";
  hystBandRegion(): "below" | "band" | "above" {
    return this._hystBandRegion;
  }

  // scenario / programme
  activeScenario: ScenarioId | null = null;
  scenarioBanner: ScenarioBanner | null = null;
  activeProgramme: ProgrammeId | null = null;
  lastProgrammeJson: string | null = null;

  lastScientificJson = "";
  lastSnapshotJson = "";
  lastValiditySuite: ValiditySuiteResult | null = null;
  validityProgress: string | null = null;

  enabledKinds = new Set<string>(["metal", "peptide", "generic", "pb", "his5", "ach", "peptide"]);

  private uiListeners = new Set<() => void>();
  private stateListeners = new Set<() => void>();

  constructor() {
    setCoordScaleToNm(1);
    this.applyValidityLockedParams(7.4);
    this.bootstrap(this.moleculeCount, this.pH);
  }

  subscribe(fn: () => void) {
    this.stateListeners.add(fn);
    return () => this.stateListeners.delete(fn);
  }
  subscribeUi(fn: () => void) {
    this.uiListeners.add(fn);
    return () => this.uiListeners.delete(fn);
  }
  private emit() {
    for (const fn of this.stateListeners) fn();
  }
  private emitUi() {
    for (const fn of this.uiListeners) fn();
  }

  getSpeciesMap() {
    return SPECIES_MAP_LOCAL;
  }
  getSpeciesList() {
    return SPECIES;
  }

  ensureForceBuffers(n: number) {
    if (this.fx.length < n) {
      const s = Math.max(n * 2, 64);
      this.fx = new Float32Array(s);
      this.fy = new Float32Array(s);
      this.fz = new Float32Array(s);
    }
  }

  applyDebyeToParams() {
    if (this.debyeOverrideNm != null) {
      const nm = this.debyeOverrideNm;
      this.params.debyeNm = nm;
      this.params.debyeLength = nmToScene(nm);
      this.params.forceCutoffNm = 4 * nm;
      this.params.forceCutoffScene = nmToScene(4 * nm);
    } else {
      const d = debyeFromPH(this.pH);
      this.params.debyeNm = d.debyeNm;
      this.params.debyeLength = d.debyeScene;
      this.params.forceCutoffNm = 4 * d.debyeNm;
      this.params.forceCutoffScene = nmToScene(4 * d.debyeNm);
    }
  }

  applyValidityLockedParams(pH: number) {
    setCoordScaleToNm(VALIDITY_LOCKED.coordScaleToNm);
    this.params = buildSimParams(pH, {
      coulombK: VALIDITY_LOCKED.coulombK,
      debyeNm: VALIDITY_LOCKED.debyeNm,
      debyeLength: VALIDITY_LOCKED.debyeScene,
      forceCutoffNm: VALIDITY_LOCKED.forceCutoffNm,
      forceCutoffScene: VALIDITY_LOCKED.forceCutoffScene,
      frictionScale: 1.35,
      noiseScale: 0.45,
      metalHisPrefEnabled: false,
      shortRangeWellEnabled: false,
      shortRangeWellDepthKt: SHORT_RANGE_WELL_DEPTH_DEFAULT,
      shortRangeWellSigmaNm: SHORT_RANGE_WELL_SIGMA_NM,
      shortRangeWellCutoffNm: SHORT_RANGE_WELL_CUTOFF_NM,
    });
    this.metalHisPrefEnabled = false;
    this.shortRangeWellEnabled = false;
    this.hisPka = VALIDITY_LOCKED.hisPka;
    this.applyDebyeToParams();
  }

  private bootstrap(count: number, pH: number) {
    this.pH = pH;
    // preserve metalMode (Pb / Cu / off) — do not force Pb
    this.params = {

      ...this.params,
      ...buildSimParams(pH, {
        coulombK: this.params.coulombK,
        debyeNm: this.params.debyeNm,
        debyeLength: this.params.debyeLength,
        forceCutoffNm: this.params.forceCutoffNm,
        forceCutoffScene: this.params.forceCutoffScene,
        frictionScale: this.params.frictionScale,
        metalHisPrefFactor: this.metalHisPrefFactor,
        metalHisPrefEnabled: this.metalHisPrefEnabled,
        shortRangeWellEnabled: this.shortRangeWellEnabled,
        shortRangeWellDepthKt: this.shortRangeWellDepthKt,
        shortRangeWellSigmaNm: SHORT_RANGE_WELL_SIGMA_NM,
        shortRangeWellCutoffNm: SHORT_RANGE_WELL_CUTOFF_NM,
      }),
    };
    this.applyDebyeToParams();
    this.moleculeCount = Math.min(MAX_MOLECULES, Math.max(0, count));

    let l1 = 0;
    let l2 = 0;
    const hm = resolveHeavyMetal(this.metalMode);
    if (this.ligandBaseline === "ligand1") {
      l1 = hm === "off" ? 0 : this.moleculeCount;
      l2 = 0;
      this.ligand2Enabled = false;
    } else if (this.ligandBaseline === "ligand2") {
      l1 = 0;
      l2 = this.peptideVariant === "off" ? 0 : this.ligand2Count || this.moleculeCount;
      this.ligand2Enabled = this.peptideVariant !== "off";
    } else {
      l1 = hm === "off" ? 0 : this.moleculeCount;
      l2 =
        this.peptideVariant === "off"
          ? 0
          : this.ligand2Enabled
            ? this.ligand2Count
            : 0;
      this.ligand2Enabled = this.peptideVariant !== "off";
    }

    const pepCount =
      this.ligandBaseline === "ligand1"
        ? 0
        : this.peptideVariant === "off"
          ? 0
          : l2;
    const l3 = this.ligand3Enabled ? this.ligand3Count : 0;
    const l4 = this.ligand4Enabled ? this.ligand4Count : 0;
    this.particles = spawnParticles(
      l1,
      pH,
      this.metalMode,
      this.spawnSeed,
      pepCount,
      this.peptideVariant === "off"
        ? "off"
        : this.peptideVariant === "prarr"
          ? "prarr"
          : this.peptideVariant === "sllrst"
            ? "sllrst"
            : "ksrrrar",
      l3,
      l4,
    );
    this.nextId = this.particles.reduce((m, p) => Math.max(m, p.id + 1), 1);
    this.applyLigand2ChargeScale();
    const defs = createProteinProxyDefs(this.receptorGeometry);
    this.proteins = initProteinStates(defs, pH);
    this.syncHisPkaToProteins();
    for (const prot of this.proteins) updateHisSwitchBinary(prot, 0, 0);
    this.timeNs = 0;
    this.trajectory = [this.recordFrame()];
    this.scrubIndex = null;
    this.refreshRoiEnergy();
    this.emit();
  }

  applyLigand2ChargeScale() {
    for (const p of this.particles) {
      if (p.ligandClass !== "ligand2") continue;
      const sp = SPECIES.find((s) => s.id === p.speciesId);
      if (!sp) continue;
      p.q = effectiveCharge(sp, this.pH) * this.ligand2ChargeScale;
    }
  }

  syncHisPkaToProteins() {
    for (const prot of this.proteins) {
      prot.hisPka = this.hisPka;
      for (const s of prot.hisSites) s.pKa = this.hisPka;
      if (prot.titratableHis === false) continue;
      const th = hisProtonationHH(this.hisPka, this.pH);
      prot.hisProtonation = th;
      prot.hisCharge = hisFormalCharge(th);
      for (const s of prot.hisSites) {
        s.protonation = th;
        s.charge = hisFormalCharge(th);
      }
    }
    this.hisTheta = hisProtonationHH(this.hisPka, this.pH);
  }

  applyPH(pH: number) {
    this.pH = pH;
    this.params = {
      ...this.params,
      pH,
      regime: buildSimParams(pH).regime,
    };
    this.applyDebyeToParams();
    for (const p of this.particles) {
      const sp = SPECIES.find((s) => s.id === p.speciesId);
      if (!sp) continue;
      let q = effectiveCharge(sp, pH);
      if (p.ligandClass === "ligand2") q *= this.ligand2ChargeScale;
      p.q = q;
    }
    this.syncHisPkaToProteins();
    for (const prot of this.proteins) {
      updateHisSwitchBinary(
        prot,
        this.roiEnergy?.energyL1His ?? 0,
        this.roiEnergy?.energyL2His ?? 0,
      );
    }
    this.refreshRoiEnergy();
  }

  setPH(pH: number) {
    const prev = this.pH;
    this.applyPH(pH);
    if (pH > prev) this.lastPhDirection = "up";
    else if (pH < prev) this.lastPhDirection = "down";
    this.emit();
    this.emitUi();
  }

  togglePlay() {
    this.playing = !this.playing;
    this.emit();
    this.emitUi();
  }

  setMoleculeCount(n: number) {
    this.moleculeCount = Math.max(0, Math.min(MAX_MOLECULES, Math.round(n)));
    // L1 count only — do not reseed other classes or receptor
    this.adjustClassCount("ligand1");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setMetalMode(mode: MetalMode) {
    const next = resolveHeavyMetal(mode);
    this.metalMode = next;
    if (next === "off") {
      // hard-off L1 particles; keep moleculeCount stored for restore
      this.particles = this.particles.filter((p) => p.ligandClass !== "ligand1");
      this.ensureForceBuffers(this.particles.length);
    } else {
      if (this.moleculeCount < 1 && this.ligandBaseline !== "ligand2") {
        this.moleculeCount = 8;
      }
      this.replaceLigand1Metal();
    }
    this.refreshRoiEnergy();
    this.emit();
    this.emitUi();
  }


  setKindEnabled(kind: string, enabled: boolean) {
    if (enabled) this.enabledKinds.add(kind);
    else this.enabledKinds.delete(kind);
    this.emitUi();
  }

  setLigandBaseline(mode: LigandBaselineMode) {
    this.ligandBaseline = mode;
    if (mode === "ligand1") {
      this.ligand2Enabled = false;
      if (this.moleculeCount < 1) this.moleculeCount = 8;
    } else if (mode === "ligand2") {
      this.ligand2Enabled = this.peptideVariant !== "off";
      if (this.ligand2Count < 1) this.ligand2Count = Math.max(4, this.moleculeCount || 4);
      // keep moleculeCount stored; hard exclusion zeros live L1 particles
    } else {
      this.ligand2Enabled = this.peptideVariant !== "off";
      if (this.ligand2Count < 1) this.ligand2Count = 4;
      if (this.moleculeCount < 1) this.moleculeCount = 8;
    }
    // Surgical: only L1/L2 presence — L3/L4, receptor, camera untouched
    this.adjustClassCount("ligand1");
    this.adjustClassCount("ligand2");
    this.refreshRoiEnergy();
    this.emit();
    this.emitUi();
  }

  enforceExclusiveParticles() {
    this.particles = this.particles.filter((p) => {
      if (p.ligandClass === "ligand1") {
        if (this.ligandBaseline === "ligand2") return false;
        if (resolveHeavyMetal(this.metalMode) === "off") return false;
        return this.moleculeCount > 0;
      }

      if (p.ligandClass === "ligand2") {
        if (this.ligandBaseline === "ligand1") return false;
        return this.peptideVariant !== "off" && this.ligand2Count > 0;
      }
      if (p.ligandClass === "ligand3") return this.ligand3Enabled && this.ligand3Count > 0;
      if (p.ligandClass === "ligand4") return this.ligand4Enabled && this.ligand4Count > 0;
      return false;
    });
    if (this.ligandBaseline === "ligand1") this.ligand2Enabled = false;
    else if (this.ligandBaseline === "ligand2")
      this.ligand2Enabled = this.peptideVariant !== "off";
    this.ensureForceBuffers(this.particles.length);
  }

  /** Target live particle count for one ligand class (hard exclusion → 0). */
  private targetCountForClass(cls: LigandClass): number {
    if (cls === "ligand1") {
      if (this.ligandBaseline === "ligand2") return 0;
      if (resolveHeavyMetal(this.metalMode) === "off") return 0;
      return Math.max(0, this.moleculeCount);
    }

    if (cls === "ligand2") {
      if (this.ligandBaseline === "ligand1") return 0;
      if (this.peptideVariant === "off") return 0;
      if (!this.ligand2Enabled) return 0;
      return Math.max(0, this.ligand2Count);
    }
    if (cls === "ligand3")
      return this.ligand3Enabled ? Math.max(0, this.ligand3Count) : 0;
    if (cls === "ligand4")
      return this.ligand4Enabled ? Math.max(0, this.ligand4Count) : 0;
    return 0;
  }

  private speciesForClass(cls: LigandClass) {
    if (cls === "ligand1") return ligand1Species(this.metalMode);
    if (cls === "ligand2") {
      if (this.peptideVariant === "off") return undefined;
      return ligand2Species(
        this.peptideVariant === "prarr"
          ? "prarr"
          : this.peptideVariant === "sllrst"
            ? "sllrst"
            : "ksrrrar",
      );
    }
    if (cls === "ligand3") return ligand3Species();
    return ligand4Species();
  }

  private qDesignForSpeciesId(id: string): number {
    if (id === "pb-ion" || id === "cu-ion") return 2;
    if (id === "acetylcholine") return 1;
    if (id === "prarr-peptide") return 3;
    if (id === "sllrst-peptide") return 1;
    if (id === "his5-eaf") return 5;
    return 5;
  }


  private shellRangeForClass(cls: LigandClass): [number, number] {
    if (cls === "ligand1") return [0.8, 2.6];
    if (cls === "ligand2") return [0.7, 2.5];
    if (cls === "ligand3") return [0.9, 2.4];
    return [0.85, 2.5];
  }

  /** Spawn `n` new particles of one class on the peripheral shell. */
  private spawnMoreOfClass(cls: LigandClass, n: number) {
    if (n <= 0) return;
    const sp = this.speciesForClass(cls);
    if (!sp) return;
    const [r0, r1] = this.shellRangeForClass(cls);
    const rand = makeSeededRng((this.spawnSeed + this.nextId * 997 + n * 13) >>> 0);
    for (let i = 0; i < n; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = r0 + rand() * (r1 - r0);
      let ox = rand() * 2 - 1;
      let oy = rand() * 2 - 1;
      let oz = rand() * 2 - 1;
      const on = Math.sqrt(ox * ox + oy * oy + oz * oz) + 1e-9;
      let q = effectiveCharge(sp, this.pH);
      if (cls === "ligand2") q *= this.ligand2ChargeScale;
      this.particles.push({
        id: this.nextId++,
        speciesId: sp.id,
        kind: sp.kind,
        ligandClass: cls,
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.sin(phi) * Math.sin(theta) * r * 0.55,
        z: Math.cos(phi) * r,
        ox: ox / on,
        oy: oy / on,
        oz: oz / on,
        q,
        qDesign: this.qDesignForSpeciesId(sp.id),
      });
    }
  }

  /**
   * Surgical count adjust for one class only.
   * Preserves remaining particle positions; adds/removes only the delta.
   * Does not touch receptor, other ligands, camera, or display toggles.
   */
  adjustClassCount(cls: LigandClass, target?: number) {
    const want = target ?? this.targetCountForClass(cls);
    const existing = this.particles.filter((p) => p.ligandClass === cls);
    if (want <= 0) {
      if (existing.length) {
        this.particles = this.particles.filter((p) => p.ligandClass !== cls);
      }
      this.ensureForceBuffers(this.particles.length);
      return;
    }
    if (existing.length > want) {
      const keep = new Set(existing.slice(0, want).map((p) => p.id));
      this.particles = this.particles.filter(
        (p) => p.ligandClass !== cls || keep.has(p.id),
      );
    } else if (existing.length < want) {
      this.spawnMoreOfClass(cls, want - existing.length);
    }
    this.ensureForceBuffers(this.particles.length);
  }

  /**
   * Replace L1 heavy-metal identity only (same count & positions when possible).
   * Off handled by setMetalMode / targetCountForClass.
   */
  private replaceLigand1Metal() {
    const sp = ligand1Species(this.metalMode);
    if (!sp) {
      this.particles = this.particles.filter((p) => p.ligandClass !== "ligand1");
      this.ensureForceBuffers(this.particles.length);
      return;
    }
    const l1 = this.particles.filter((p) => p.ligandClass === "ligand1");
    const want = this.targetCountForClass("ligand1");
    if (l1.length === 0) {
      this.adjustClassCount("ligand1", want);
      return;
    }
    for (const p of l1) {
      p.speciesId = sp.id;
      p.kind = sp.kind;
      p.qDesign = this.qDesignForSpeciesId(sp.id);
      p.q = effectiveCharge(sp, this.pH);
    }
    if (l1.length !== want) this.adjustClassCount("ligand1", want);
  }

  /**
   * Replace L2 sequence identity only (same count & positions when possible).
   * Off → remove L2; off→on → spawn target count.
   */
  private replaceLigand2Sequence(v: PeptideVariant) {

    if (v === "off") {
      this.particles = this.particles.filter((p) => p.ligandClass !== "ligand2");
      this.ligand2Enabled = false;
      this.ensureForceBuffers(this.particles.length);
      return;
    }
    this.ligand2Enabled =
      this.ligandBaseline !== "ligand1" && this.ligand2Count > 0;
    const sp = ligand2Species(
      v === "prarr" ? "prarr" : v === "sllrst" ? "sllrst" : "ksrrrar",
    );
    if (!sp) return;
    const l2 = this.particles.filter((p) => p.ligandClass === "ligand2");
    const want = this.targetCountForClass("ligand2");
    if (l2.length === 0) {
      this.adjustClassCount("ligand2", want);
      return;
    }
    // In-place species swap — keep coordinates & count
    for (const p of l2) {
      p.speciesId = sp.id;
      p.kind = sp.kind;
      p.qDesign = this.qDesignForSpeciesId(sp.id);
      p.q = effectiveCharge(sp, this.pH) * this.ligand2ChargeScale;
    }
    if (l2.length !== want) this.adjustClassCount("ligand2", want);
  }

  /**
   * Reseed positions of existing particles in `classes` (keep species & count).
   * Used when receptor ROI origin moves.
   */
  reseedClassPositions(classes: LigandClass[]) {
    const mask = new Set(classes);
    const rand = makeSeededRng((this.spawnSeed + this.nextId * 31) >>> 0);
    for (const p of this.particles) {
      if (!mask.has(p.ligandClass)) continue;
      const [r0, r1] = this.shellRangeForClass(p.ligandClass);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = r0 + rand() * (r1 - r0);
      p.x = Math.sin(phi) * Math.cos(theta) * r;
      p.y = Math.sin(phi) * Math.sin(theta) * r * 0.55;
      p.z = Math.cos(phi) * r;
    }
    this.refreshRoiEnergy();
  }

  /**
   * Full class reseed (remove + spawn target count). Does not touch receptor,
   * other classes, time, trajectory, or camera.
   */
  reseedClasses(classes: LigandClass[]) {
    const mask = new Set(classes);
    this.particles = this.particles.filter((p) => !mask.has(p.ligandClass));
    for (const cls of classes) {
      this.spawnMoreOfClass(cls, this.targetCountForClass(cls));
    }
    this.ensureForceBuffers(this.particles.length);
    this.refreshRoiEnergy();
  }

  setPeptideVariant(v: PeptideVariant) {
    if (v === this.peptideVariant) {
      this.emitUi();
      return;
    }
    this.peptideVariant = v;
    // Surgical: L2 identity only — receptor / L1 / L3 / L4 / toggles untouched
    this.replaceLigand2Sequence(v);
    this.refreshRoiEnergy();
    this.emit();
    this.emitUi();
  }

  setLigand2Enabled(v: boolean) {
    this.ligand2Enabled = v;
    if (!v) this.ligand2Count = 0;
    else if (this.ligand2Count < 1) this.ligand2Count = 4;
    this.adjustClassCount("ligand2");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setLigand2Count(n: number) {
    this.ligand2Count = Math.max(0, Math.min(40, Math.round(n)));
    this.ligand2Enabled = this.ligand2Count > 0 && this.peptideVariant !== "off";
    this.adjustClassCount("ligand2");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setLigand2ChargeScale(n: number) {
    this.ligand2ChargeScale = Math.max(0.5, Math.min(1.5, n));
    this.applyLigand2ChargeScale();
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setLigand3Enabled(v: boolean) {
    this.ligand3Enabled = v;
    if (!v) this.ligand3Count = 0;
    else if (this.ligand3Count < 1) this.ligand3Count = 2;
    this.adjustClassCount("ligand3");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setLigand3Count(n: number) {
    this.ligand3Count = Math.max(0, Math.min(30, Math.round(n)));
    this.ligand3Enabled = this.ligand3Count > 0;
    this.adjustClassCount("ligand3");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setLigand4Enabled(v: boolean) {
    this.ligand4Enabled = v;
    if (!v) this.ligand4Count = 0;
    else if (this.ligand4Count < 1) this.ligand4Count = 8;
    this.adjustClassCount("ligand4");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setLigand4Count(n: number) {
    this.ligand4Count = Math.max(0, Math.min(30, Math.round(n)));
    this.ligand4Enabled = this.ligand4Count > 0;
    this.adjustClassCount("ligand4");
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setRespawnOnBinding(v: boolean) {
    this.respawnOnBinding = v;
    this.emitUi();
  }

  setMetalHisPrefFactor(n: number) {
    this.metalHisPrefFactor = n;
    this.params.metalHisPrefFactor = n;
    this.emitUi();
  }
  setMetalHisPrefEnabled(v: boolean) {
    this.metalHisPrefEnabled = v;
    this.params.metalHisPrefEnabled = v;
    this.emitUi();
  }
  setShortRangeWellEnabled(v: boolean) {
    this.shortRangeWellEnabled = v;
    this.params.shortRangeWellEnabled = v;
    this.refreshRoiEnergy();
    this.emitUi();
  }
  setShortRangeWellDepthKt(n: number) {
    this.shortRangeWellDepthKt = n;
    this.params.shortRangeWellDepthKt = n;
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setDisplayDurationSec(sec: number) {
    this.displayDurationSec = sec;
    this.emitUi();
  }

  setReceptorGeometry(id: ReceptorGeometryId) {
    const prev = this.receptorGeometry;
    this.receptorGeometry = id;
    const defs = createProteinProxyDefs(id);
    this.proteins = initProteinStates(defs, this.pH);
    this.syncHisPkaToProteins();
    this.focusedProteinIndex = 0;
    // Keep ligand set & counts; only reseed positions when ROI origin changes
    if (prev !== id) {
      const active: LigandClass[] = [];
      if (this.particles.some((p) => p.ligandClass === "ligand1")) active.push("ligand1");
      if (this.particles.some((p) => p.ligandClass === "ligand2")) active.push("ligand2");
      if (this.particles.some((p) => p.ligandClass === "ligand3")) active.push("ligand3");
      if (this.particles.some((p) => p.ligandClass === "ligand4")) active.push("ligand4");
      if (active.length) this.reseedClassPositions(active);
    }
    this.refreshRoiEnergy();
    // Do not auto-focus / wipe camera — user has Focus ROI
    this.emit();
    this.emitUi();
  }

  setShowField(v: boolean) {
    this.showField = v;
    if (v) this.recomputeField();
    this.emitUi();
  }
  setFieldOpacity(a: number) {
    this.fieldOpacity = Math.max(0.05, Math.min(0.95, a));
    this.emitUi();
  }
  setShowForceArrows(v: boolean) {
    this.showForceArrows = v;
    this.emitUi();
  }

  setDebyeNm(nm: number) {
    this.debyeOverrideNm = nm;
    this.applyDebyeToParams();
    this.refreshRoiEnergy();
    this.emitUi();
  }
  clearDebyeOverride() {
    this.debyeOverrideNm = null;
    this.applyDebyeToParams();
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setHisPka(pKa: number) {
    this.hisPka = pKa;
    this.syncHisPkaToProteins();
    this.refreshRoiEnergy();
    this.emitUi();
  }

  setScrubIndex(i: number | null) {
    this.scrubIndex = i;
    this.emitUi();
  }

  /**
   * Explicit full scene reset — the only UI path that reseats everything
   * (all ligands, receptor state refresh, trajectory, counters).
   * Display toggles (demo speed, field, sparse) live in the store and are kept.
   */
  reset() {
    this.spawnSeed = this.rngSeed;
    this.bootstrap(this.moleculeCount, this.pH);
    this.enforceExclusiveParticles();
    this.resetBehaviorCounters();
    this.clearEventLog();
    this.lastRespawnFlash = null;
    this.emit();
    this.emitUi();
  }

  /** Alias for explicit "Reset scene" control. */
  resetScene() {
    this.reset();
  }

  resetBehaviorCounters() {
    this.behaviorStats = emptyBehaviorStats();
    this.pendingApproach = null;
    this.pendingSwitch = null;
    this.pendingProximity = null;
    this.behaviorPrevSwitch = null;
    this.emitUi();
  }

  refreshRoiEnergy() {
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    if (!prot) {
      this.roiEnergy = null;
      return;
    }
    this.roiEnergy = computeRoiEnergy(prot, this.particles, this.params);
  }

  meanCharge() {
    if (!this.particles.length) return 0;
    return this.particles.reduce((s, p) => s + p.q, 0) / this.particles.length;
  }
  meanProteinResponse() {
    if (!this.proteins.length) return 0;
    return this.proteins.reduce((s, p) => s + p.response, 0) / this.proteins.length;
  }

  recordFrame(): TrajectoryFrame {
    const positions = new Float32Array(this.particles.length * 3);
    const charges = new Float32Array(this.particles.length);
    const orientations = new Float32Array(this.particles.length * 3);
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]!;
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      charges[i] = p.q;
      orientations[i * 3] = p.ox;
      orientations[i * 3 + 1] = p.oy;
      orientations[i * 3 + 2] = p.oz;
    }
    return { tNs: this.timeNs, positions, charges, orientations };
  }

  private primaryEnergy(re: {
    energyL1His: number;
    energyL2His: number;
    energyL3His: number;
    energyL4His: number;
  }): number {
    if (this.ligandBaseline === "ligand1") return re.energyL1His;
    if (this.ligandBaseline === "ligand2") return re.energyL2His;
    const cands = [
      re.energyL1His,
      re.energyL2His,
      re.energyL3His,
      re.energyL4His,
    ];
    let best = cands[0]!;
    for (const u of cands) if (Math.abs(u) > Math.abs(best)) best = u;
    return best;
  }

  captureEventFrame(flags?: {
    proxFlag?: 0 | 1;
    hhFlag?: 0 | 1;
    minDistNm?: number;
  }): EventLogFrame {
    const re = this.roiEnergy;
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    const particles: EventLogParticle[] = this.particles.map((p) => ({
      id: p.id,
      speciesId: p.speciesId,
      ligandClass: p.ligandClass,
      kind: p.kind,
      x: p.x,
      y: p.y,
      z: p.z,
      ox: p.ox,
      oy: p.oy,
      oz: p.oz,
      q: p.q,
    }));
    const eL1 = re?.energyL1His ?? 0;
    const eL2 = re?.energyL2His ?? 0;
    const eL3 = re?.energyL3His ?? 0;
    const eL4 = re?.energyL4His ?? 0;
    const eTot = re?.energyTotal ?? 0;
    const uPrimary = this.primaryEnergy({
      energyL1His: eL1,
      energyL2His: eL2,
      energyL3His: eL3,
      energyL4His: eL4,
    });
    const n1 = re?.nearestL1Nm ?? -1;
    const n2 = re?.nearestL2Nm ?? -1;
    const n3 = re?.nearestL3Nm ?? -1;
    const n4 = re?.nearestL4Nm ?? -1;
    const finite = [n1, n2, n3, n4].filter((d) => d > 0 && Number.isFinite(d));
    const minDist =
      flags?.minDistNm != null && Number.isFinite(flags.minDistNm)
        ? flags.minDistNm
        : finite.length
          ? Math.min(...finite)
          : -1;
    const theta = prot?.hisProtonation ?? this.hisTheta;
    const qHis = prot?.hisCharge ?? 0;
    return {
      tNs: this.timeNs,
      frameIndex: this.eventLog.length,
      particles,
      hisProtonation: theta,
      hisCharge: qHis,
      switchOn: prot?.switchOn ?? false,
      switchDisplayOn: prot?.switchDisplayOn ?? false,
      continuousScore: prot?.continuousScore ?? 0,
      energyL1His: eL1,
      energyL2His: eL2,
      energyL1L2: re?.energyL1L2 ?? 0,
      energyTotal: eTot,
      energyL3His: eL3,
      energyL4His: eL4,
      nearestL1Nm: n1,
      nearestL2Nm: n2,
      pH: this.pH,
      ligandBaseline: this.ligandBaseline,
      minDistNm: minDist,
      U_primary: uPrimary,
      U_tot: eTot,
      theta,
      q_His: qHis,
      proxFlag: flags?.proxFlag ?? 0,
      hhFlag: flags?.hhFlag ?? 0,
    };
  }

  get activeEventFrame(): EventLogFrame | null {
    if (this.eventScrub == null || !this.eventLog.length) return null;
    const i = Math.max(0, Math.min(this.eventLog.length - 1, this.eventScrub));
    return this.eventLog[i] ?? null;
  }

  get clampWindow(): { i0: number; i1: number; length: number } | null {
    if (!this.eventLog.length) return null;
    const i0 = this.clampStart ?? 0;
    const i1 = this.clampEnd ?? this.eventLog.length - 1;
    const a = Math.max(0, Math.min(i0, i1));
    const b = Math.min(this.eventLog.length - 1, Math.max(i0, i1));
    return { i0: a, i1: b, length: b - a + 1 };
  }

  /** Visible tape frame range for current zoom + pan. */
  getTapeViewport(): { start: number; end: number } {
    const n = this.eventLog.length;
    if (n <= 1) return { start: 0, end: Math.max(0, n - 1) };
    const frac =
      this.tapeZoomLevel === "100"
        ? 1
        : this.tapeZoomLevel === "75"
          ? 0.75
          : this.tapeZoomLevel === "50"
            ? 0.5
            : 0.25;
    if (frac >= 1) return { start: 0, end: n - 1 };
    const win = Math.max(1, Math.round((n - 1) * frac));
    const clamp = this.clampWindow;
    const center =
      clamp && this.clampStart != null && this.clampEnd != null
        ? Math.round((clamp.i0 + clamp.i1) / 2)
        : (this.eventScrub ?? Math.floor((n - 1) / 2));
    let start = center - Math.floor(win / 2) + this.tapePanOffset;
    start = Math.max(0, Math.min(n - 1 - win, start));
    return { start, end: start + win };
  }

  startRecordEvent() {
    this.eventLog = [];
    this.eventRecording = true;
    this.eventPlayback = false;
    this.eventScrub = null;
    this.eventLabel = `event_${Date.now()}`;
    this.eventTargetFrames = this.eventCap;
    this.clampStart = null;
    this.clampEnd = null;
    this.clampLoop = false;
    this.tapePanOffset = 0;
    this._hhEventsAtRecord = this.behaviorStats.hhBinaryEvents;
    this._proxEventsAtRecord = this.behaviorStats.proximityEvents;
    this.playing = true; // keep continuum stepping while recording
    this.emitUi();
  }
  stopRecordEvent() {
    this.eventRecording = false;
    this.clampCapturing = false;
    // freeze buffer; place scrub at last frame
    if (this.eventLog.length) {
      this.eventScrub = this.eventLog.length - 1;
    }
    this.emitUi();
  }
  clearEventLog() {
    this.eventLog = [];
    this.eventRecording = false;
    this.eventPlayback = false;
    this.eventScrub = null;
    this.isClampEvent = false;
    this.clampCapturing = false;
    this.clampStart = null;
    this.clampEnd = null;
    this.clampLoop = false;
    this.tapePanOffset = 0;
    this.emitUi();
  }
  setEventScrub(i: number | null) {
    if (i == null || !this.eventLog.length) {
      this.eventScrub = null;
    } else {
      this.eventScrub = Math.max(0, Math.min(this.eventLog.length - 1, Math.round(i)));
    }
    this.scrubIndex = null;
    this.eventPlayback = false;
    this.emitUi();
  }
  toggleEventPlayback() {
    if (!this.eventLog.length) return;
    this.eventPlayback = !this.eventPlayback;
    if (this.eventPlayback) {
      this.playing = false;
      this.eventRecording = false;
      const win = this.clampWindow;
      const i0 = win?.i0 ?? 0;
      const i1 = win?.i1 ?? this.eventLog.length - 1;
      if (this.eventScrub == null || this.eventScrub >= i1) this.eventScrub = i0;
    }
    this.emitUi();
  }

  /**
   * Set event window (clamp rulers) on the existing tape.
   * Does not wipe the buffer. Optional seed around playhead.
   */
  setClampWindow(i0?: number, i1?: number) {
    if (!this.eventLog.length) return;
    const n = this.eventLog.length;
    if (i0 == null || i1 == null) {
      // default: ±25 frames around playhead, or full if short
      const mid = this.eventScrub ?? Math.floor((n - 1) / 2);
      const half = Math.min(40, Math.floor(n / 4) || 1);
      this.clampStart = Math.max(0, mid - half);
      this.clampEnd = Math.min(n - 1, mid + half);
    } else {
      const a = Math.max(0, Math.min(n - 1, Math.round(Math.min(i0, i1))));
      const b = Math.max(0, Math.min(n - 1, Math.round(Math.max(i0, i1))));
      this.clampStart = a;
      this.clampEnd = b;
    }
    this.isClampEvent = true;
    this.clampCapturing = false;
    this.emitUi();
  }

  setClampStart(i: number) {
    if (!this.eventLog.length) return;
    const n = this.eventLog.length;
    const v = Math.max(0, Math.min(n - 1, Math.round(i)));
    this.clampStart = v;
    if (this.clampEnd == null || this.clampEnd < v) this.clampEnd = v;
    this.isClampEvent = true;
    this.emitUi();
  }

  setClampEnd(i: number) {
    if (!this.eventLog.length) return;
    const n = this.eventLog.length;
    const v = Math.max(0, Math.min(n - 1, Math.round(i)));
    this.clampEnd = v;
    if (this.clampStart == null || this.clampStart > v) this.clampStart = v;
    this.isClampEvent = true;
    this.emitUi();
  }

  clearClamp() {
    this.clampStart = null;
    this.clampEnd = null;
    this.clampLoop = false;
    this.isClampEvent = false;
    this.clampCapturing = false;
    this.tapePanOffset = 0;
    this.tapeZoomLevel = "100";
    this.emitUi();
  }

  setClampLoop(v: boolean) {
    this.clampLoop = v;
    this.emitUi();
  }

  fitClampToTape() {
    if (this.clampStart == null || this.clampEnd == null || !this.eventLog.length) return;
    // Zoom so clamp fills strip ≈ 100% of viewport → use finest zoom that still fits
    const len = Math.abs(this.clampEnd - this.clampStart) + 1;
    const n = this.eventLog.length;
    const frac = len / Math.max(1, n);
    if (frac > 0.75) this.tapeZoomLevel = "100";
    else if (frac > 0.5) this.tapeZoomLevel = "75";
    else if (frac > 0.25) this.tapeZoomLevel = "50";
    else this.tapeZoomLevel = "25";
    this.tapePanOffset = 0;
    // center pan on clamp midpoint
    const mid = Math.round((this.clampStart + this.clampEnd) / 2);
    const vp = this.getTapeViewport();
    const vpMid = Math.round((vp.start + vp.end) / 2);
    this.tapePanOffset = mid - vpMid;
    // recompute clamp pan into range
    const vp2 = this.getTapeViewport();
    void vp2;
    this.emitUi();
  }

  setTapeZoomLevel(level: ClampZoomLevel) {
    this.tapeZoomLevel = level;
    if (level === "100") this.tapePanOffset = 0;
    // also keep legacy field in sync for any 3D readers
    this.clampZoomLevel = level;
    this.emitUi();
  }

  setTapePanOffset(delta: number) {
    this.tapePanOffset = Math.round(delta);
    this.emitUi();
  }

  panTapeBy(frames: number) {
    this.tapePanOffset += Math.round(frames);
    this.emitUi();
  }

  exportClampCsv(): string {
    const win = this.clampWindow;
    if (!win || !this.eventLog.length) {
      return "frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag\n";
    }
    const lines = [
      "frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag",
    ];
    for (let i = win.i0; i <= win.i1; i++) {
      const f = this.eventLog[i]!;
      lines.push(
        [
          f.frameIndex,
          f.tNs,
          f.minDistNm.toFixed(6),
          f.U_primary.toFixed(6),
          f.U_tot.toFixed(6),
          f.theta.toFixed(6),
          f.q_His.toFixed(6),
          f.proxFlag,
          f.hhFlag,
        ].join(","),
      );
    }
    return lines.join("\n") + "\n";
  }

  exportClampJson(): string {
    const win = this.clampWindow;
    const frames =
      win && this.eventLog.length
        ? this.eventLog.slice(win.i0, win.i1 + 1)
        : [];
    return JSON.stringify(
      {
        schema: "moleculosphere5d.event_clamp.v1",
        disclaimer: PUBLICATION_DISCLAIMER,
        label: this.eventLabel,
        clamp: win,
        frameCount: frames.length,
        frames: frames.map((f) => ({
          frameIndex: f.frameIndex,
          tNs: f.tNs,
          minDistNm: f.minDistNm,
          U_primary: f.U_primary,
          U_tot: f.U_tot,
          theta: f.theta,
          q_His: f.q_His,
          proxFlag: f.proxFlag,
          hhFlag: f.hhFlag,
          energyL1His: f.energyL1His,
          energyL2His: f.energyL2His,
          energyTotal: f.energyTotal,
          particleCount: f.particles.length,
        })),
      },
      null,
      2,
    );
  }

  exportEventLogCsv(): string {
    if (!this.eventLog.length) {
      return "frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag\n";
    }
    const lines = [
      "frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag",
    ];
    for (const f of this.eventLog) {
      lines.push(
        [
          f.frameIndex,
          f.tNs,
          f.minDistNm.toFixed(6),
          f.U_primary.toFixed(6),
          f.U_tot.toFixed(6),
          f.theta.toFixed(6),
          f.q_His.toFixed(6),
          f.proxFlag,
          f.hhFlag,
        ].join(","),
      );
    }
    return lines.join("\n") + "\n";
  }

  /** Legacy entry: set clamp rulers on buffer (or start record if empty). */
  startClampCapture(opts?: { spawn?: boolean }) {
    void opts;
    if (!this.eventLog.length) {
      // begin a short record session then user sets rulers
      this.startRecordEvent();
      this.eventLabel = `clamp_${Date.now()}`;
      this.clampCapturing = true;
      this.isClampEvent = true;
    } else {
      this.setClampWindow();
    }
    this.emitUi();
  }

  setClampAutoTrigger(v: boolean) {
    this.clampAutoTrigger = v;
    this.emitUi();
  }
  setClampZoomLevel(level: ClampZoomLevel) {
    // Wire chips to tape viewport (primary). 3D FOV no longer owned by chips.
    this.setTapeZoomLevel(level);
  }

  getClampViewCenter(): { x: number; y: number; z: number } | null {
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    if (!prot) return null;
    return roiWorldPos(prot);
  }

  placeNearRoi(cls: LigandClass, index: number) {
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    if (!prot) return;
    const roi = roiWorldPos(prot);
    const list = this.particles.filter((p) => p.ligandClass === cls);
    const p = list[index] ?? list[0];
    if (!p) return;
    const ang = this.rng() * Math.PI * 2;
    const r = 0.55 + this.rng() * 0.35;
    p.x = roi.x + Math.cos(ang) * r;
    p.y = roi.y + (this.rng() - 0.5) * 0.2;
    p.z = roi.z + Math.sin(ang) * r;
    this.refreshRoiEnergy();
  }

  spawnNearRoi(cls: LigandClass) {
    this.placeNearRoi(cls, 0);
    // if none, add one of that class only
    if (!this.particles.some((p) => p.ligandClass === cls)) {
      if (cls === "ligand1") {
        this.moleculeCount = Math.max(1, this.moleculeCount);
        if (this.ligandBaseline === "ligand2") this.ligandBaseline = "both";
      } else if (cls === "ligand2") {
        this.ligand2Count = Math.max(1, this.ligand2Count);
        this.ligand2Enabled = true;
        if (this.peptideVariant === "off") this.peptideVariant = "ksrrrar";
        if (this.ligandBaseline === "ligand1") this.ligandBaseline = "both";
      } else if (cls === "ligand3") {
        this.ligand3Enabled = true;
        this.ligand3Count = Math.max(1, this.ligand3Count);
      } else if (cls === "ligand4") {
        this.ligand4Enabled = true;
        this.ligand4Count = Math.max(1, this.ligand4Count);
      }
      this.adjustClassCount(cls);
      this.placeNearRoi(cls, 0);
    }
    this.emit();
    this.emitUi();
  }

  spawnNearRoiPublic(cls: LigandClass) {
    this.spawnNearRoi(cls);
  }

  focusHisRoi(index = 0) {
    this.focusedProteinIndex = index;
    const prot = this.proteins[index] ?? this.proteins[0];
    if (prot) {
      const roi = roiWorldPos(prot);
      this.focusTarget = roi;
      this.roiFocused = true;
      this.focusRequest++;
    }
    this.refreshRoiEnergy();
    this.emitUi();
  }

  toggleHisSwitch(index = 0) {
    const prot = this.proteins[index] ?? this.proteins[0];
    if (!prot) return;
    const override = prot.switchOverride == null ? !prot.switchDisplayOn : null;
    prot.switchOverride = override;
    updateHisSwitchBinary(
      prot,
      this.roiEnergy?.energyL1His ?? 0,
      this.roiEnergy?.energyL2His ?? 0,
    );
    this.refreshRoiEnergy();
    this.emitUi();
  }

  toggleHisSwitchOverride(index = 0) {
    this.toggleHisSwitch(index);
  }

  toggleHisSite(proteinIndex: number, _siteIndex: number) {
    this.toggleHisSwitch(proteinIndex);
  }

  clearHisSwitchOverride() {
    for (const p of this.proteins) p.switchOverride = null;
    this.refreshRoiEnergy();
    this.emitUi();
  }

  startHysteresisSweep() {
    this.sweepActive = true;
    this.hystHistory = [];
    this.emitUi();
  }
  stopHysteresisSweep() {
    this.sweepActive = false;
    this.emitUi();
  }
  clearHysteresisHistory() {
    this.hystHistory = [];
    this.crossings = [];
    this.lastCrossing = null;
    this.emitUi();
  }

  applyScenario(id: ScenarioId) {
    const sc = SCENARIOS[id];
    if (!sc) return;
    this.activeScenario = id;
    // Scenario presets set pH (and HH θ) only — never clear ligands / receptor / toggles
    this.applyPH(sc.pH);
    const re = this.roiEnergy;
    this.scenarioBanner = {
      id,
      label: sc.label,
      switchOn: this.proteins[0]?.switchDisplayOn ?? false,
      regime:
        re && re.energyL1L2 > 0.05
          ? "competitive"
          : re && re.energyL1L2 < -0.05
            ? "cooperative"
            : "idle",
      energyL1L2: re?.energyL1L2 ?? 0,
      pH: sc.pH,
      ticksLeft: 180,
    };
    this.emit();
    this.emitUi();
  }

  applyLigandSetSpec(set: LigandSetSpec) {
    this.moleculeCount = set.pb;
    this.metalMode = setToMetalMode(set);
    this.peptideVariant = set.peptide;
    this.ligand2Count = set.peptideCount;
    this.ligand2Enabled = set.peptide !== "off" && set.peptideCount > 0;
    // Public Beta: never activate non-public ligand channels from programme sets
    if (PUBLIC_BUILD_DEFAULT) {
      this.ligand3Count = 0;
      this.ligand3Enabled = false;
      this.ligand4Count = 0;
      this.ligand4Enabled = false;
    } else {
      this.ligand3Count = set.his5;
      this.ligand3Enabled = set.his5 > 0;
      this.ligand4Count = set.ach;
      this.ligand4Enabled = set.ach > 0;
    }
    if (set.pb > 0 && set.peptide !== "off") {
      this.ligandBaseline = "both";
    } else if (set.pb > 0) {
      this.ligandBaseline = "ligand1";
    } else {
      this.ligandBaseline = "ligand2";
    }
    // Programme ligand set: reseed classes only — no receptor wipe, no camera focus
    this.reseedClasses(["ligand1", "ligand2", "ligand3", "ligand4"]);
  }

  applyProgrammeSetup(
    programmeId: ProgrammeId,
    ligandSetId: string,
    receptorId?: ReceptorGeometryId,
    pH = 7.4,
  ) {
    const prog = PROGRAMMES[programmeId];
    if (!prog) return;
    const set = prog.ligandSets.find((s) => s.id === ligandSetId) ?? prog.ligandSets[0]!;
    const rec = receptorId ?? prog.receptors[0]!;
    this.activeProgramme = programmeId;
    this.setReceptorGeometry(rec);
    this.applyLigandSetSpec(set);
    this.setRespawnOnBinding(prog.respawnDefault);
    this.applyPH(pH);
    this.applyValidityLockedParams(this.pH);
    this.resetBehaviorCounters();
    this.playing = true;
    this.emit();
    this.emitUi();
  }

  /**
   * Run publication programme matrix.
   * Public Beta v1.0 exports write only public ligand columns:
   * U_HM–ROI, U_pep–ROI, U_tot — never private L3/L4 channels.
   */
  runProgrammeSuite(
    programmeId: ProgrammeId,
    opts?: {
      frames?: number;
      replicates?: number;
      seed?: number;
      includeRamp?: boolean;
    },
  ): { json: string; csv: string; summary: string } {
    const prog = PROGRAMMES[programmeId];
    const frames = opts?.frames ?? 600;
    const nRep = opts?.replicates ?? 10;
    const baseSeed = opts?.seed ?? 20260805;
    const includeRamp = opts?.includeRamp ?? prog.ramp;
    const rows: Record<string, unknown>[] = [];

    this.applyValidityLockedParams(this.pH);

    for (const rec of prog.receptors) {
      for (const set of prog.ligandSets) {
        for (const pH of prog.pHFixed) {
          const prox: number[] = [];
          const uPb: number[] = [];
          const uPep: number[] = [];
          const uLl: number[] = [];
          const uTot: number[] = [];
          const dTrig: number[] = [];
          for (let r = 0; r < nRep; r++) {
            this.rngSeed = baseSeed + r * 997 + rec.length * 13 + set.id.charCodeAt(0);
            this.rng = makeRng(this.rngSeed);
            this.spawnSeed = this.rngSeed;
            this.setReceptorGeometry(rec);
            this.applyLigandSetSpec(set);
            this.setRespawnOnBinding(prog.respawnDefault);
            this.applyValidityLockedParams(this.pH);
            this.applyPH(pH);
            this.resetBehaviorCounters();
            this.playing = true;
            this.scrubIndex = null;
            this.eventScrub = null;
            let sumUPb = 0,
              sumUPep = 0,
              sumULl = 0,
              sumUTot = 0,
              nU = 0;
            for (let f = 0; f < frames; f++) {
              this.step();
              this.refreshRoiEnergy();
              const re = this.roiEnergy;
              if (re) {
                const e1 = Number(re.energyL1His) || 0;
                const e2 = Number(re.energyL2His) || 0;
                const e12 = Number(re.energyL1L2) || 0;
                sumUPb += e1;
                sumUPep += e2;
                sumULl += e12;
                sumUTot += e1 + e2 + e12;
                nU += 1;
              }
            }
            prox.push(this.behaviorStats.proximityEvents);
            const inv = nU || 1;
            uPb.push(sumUPb / inv);
            uPep.push(sumUPep / inv);
            uLl.push(sumULl / inv);
            uTot.push(sumUTot / inv);
            const td = this.behaviorStats.triggerDistancesNm;
            if (td.length) dTrig.push(td.reduce((a, b) => a + b, 0) / td.length);
          }
          rows.push({
            programme: programmeId,
            receptor: rec,
            ligandSet: set.id,
            ligandLabel: set.label,
            protocol: "fixed-pH",
            pH,
            frames,
            n: nRep,
            proximityEvents: meanSd(prox),
            meanTriggerDistNm: meanSd(dTrig),
            U_Pb_ROI: meanSd(uPb),
            U_pep_ROI: meanSd(uPep),
            U_HM_pep: meanSd(uLl),
            U_tot: meanSd(uTot),
          });
        }
        if (includeRamp) {
          const prox: number[] = [];
          const uPb: number[] = [];
          const uPep: number[] = [];
          const uLl: number[] = [];
          const uTot: number[] = [];
          for (let r = 0; r < nRep; r++) {
            this.rngSeed = baseSeed + r * 997 + 5000;
            this.rng = makeRng(this.rngSeed);
            this.spawnSeed = this.rngSeed;
            this.setReceptorGeometry(rec);
            this.applyLigandSetSpec(set);
            this.setRespawnOnBinding(prog.respawnDefault);
            this.applyValidityLockedParams(this.pH);
            this.applyPH(7.4);
            this.resetBehaviorCounters();
            this.playing = true;
            const rampFrames = Math.min(400, frames);
            let sumUPb = 0,
              sumUPep = 0,
              sumULl = 0,
              sumUTot = 0,
              nU = 0;
            for (let f = 0; f < rampFrames; f++) {
              const t = f / Math.max(1, rampFrames - 1);
              this.applyPH(7.4 + (5.0 - 7.4) * t);
              this.step();
              this.refreshRoiEnergy();
              const re = this.roiEnergy;
              if (re) {
                const e1 = Number(re.energyL1His) || 0;
                const e2 = Number(re.energyL2His) || 0;
                const e12 = Number(re.energyL1L2) || 0;
                sumUPb += e1;
                sumUPep += e2;
                sumULl += e12;
                sumUTot += e1 + e2 + e12;
                nU += 1;
              }
            }
            const inv = nU || 1;
            prox.push(this.behaviorStats.proximityEvents);
            uPb.push(sumUPb / inv);
            uPep.push(sumUPep / inv);
            uLl.push(sumULl / inv);
            uTot.push(sumUTot / inv);
          }
          rows.push({
            programme: programmeId,
            receptor: rec,
            ligandSet: set.id,
            ligandLabel: set.label,
            protocol: "pH-ramp",
            pH: "7.4→5.0",
            frames: Math.min(400, frames),
            n: nRep,
            proximityEvents: meanSd(prox),
            meanTriggerDistNm: meanSd([]),
            U_Pb_ROI: meanSd(uPb),
            U_pep_ROI: meanSd(uPep),
            U_HM_pep: meanSd(uLl),
            U_tot: meanSd(uTot),
          });
        }
      }
    }

    const payload = {
      disclaimer: PUBLICATION_DISCLAIMER,
      publicNote: "Private analyses are excluded from this public package.",
      programme: {
        id: prog.id,
        label: prog.label,
        hypothesis: prog.hypothesis,
        note: prog.note ?? null,
      },
      results: rows,
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(payload, null, 2);
    this.lastProgrammeJson = json;

    const num = (
      v: { mean: number; sd: number } | undefined | null,
      field: "mean" | "sd",
    ) => {
      const x = v?.[field];
      return Number.isFinite(x as number) ? (x as number).toFixed(4) : "0.0000";
    };
    const numP = (
      v: { mean: number; sd: number } | undefined | null,
      field: "mean" | "sd",
    ) => {
      const x = v?.[field];
      return Number.isFinite(x as number) ? (x as number).toFixed(3) : "0.000";
    };

    const headers = [
      "programme",
      "receptor",
      "ligandSet",
      "ligandLabel",
      "protocol",
      "pH",
      "frames",
      "n",
      "proximity_mean",
      "proximity_sd",
      "U_HM_ROI_mean",
      "U_HM_ROI_sd",
      "U_pep_ROI_mean",
      "U_pep_ROI_sd",
      "U_HM_pep_mean",
      "U_HM_pep_sd",
      "U_tot_mean",
      "U_tot_sd",
    ];
    const csvLines = [
      `# ${PUBLICATION_DISCLAIMER}`,
      `# Private analyses are excluded from this public package.`,
      headers.join(","),
    ];
    for (const row of rows) {
      const pe = row.proximityEvents as { mean: number; sd: number } | undefined;
      const up = row.U_Pb_ROI as { mean: number; sd: number } | undefined;
      const ue = row.U_pep_ROI as { mean: number; sd: number } | undefined;
      const ul = row.U_HM_pep as { mean: number; sd: number } | undefined;
      const ut = row.U_tot as { mean: number; sd: number } | undefined;
      csvLines.push(
        [
          row.programme,
          row.receptor,
          row.ligandSet,
          JSON.stringify(String(row.ligandLabel ?? "")),
          row.protocol,
          row.pH,
          row.frames ?? "",
          row.n ?? "",
          numP(pe, "mean"),
          numP(pe, "sd"),
          num(up, "mean"),
          num(up, "sd"),
          num(ue, "mean"),
          num(ue, "sd"),
          num(ul, "mean"),
          num(ul, "sd"),
          num(ut, "mean"),
          num(ut, "sd"),
        ].join(","),
      );
    }
    const csv = csvLines.join("\n");
    const summary = `${prog.shortLabel}: ${rows.length} cells · n=${nRep} · frames=${frames} · public columns only`;
    this.emitUi();
    return { json, csv, summary };
  }

  getLigandModeStatus(): string {
    const hm = resolveHeavyMetal(this.metalMode);
    const pb =
      this.ligandBaseline === "ligand2" ||
      hm === "off" ||
      this.moleculeCount <= 0
        ? `${hm === "off" ? "HM" : heavyMetalLabel(this.metalMode)} absent`
        : `${heavyMetalLabel(this.metalMode)} ×${this.moleculeCount}`;

    const pep =
      this.ligandBaseline === "ligand1" ||
      this.peptideVariant === "off" ||
      this.ligand2Count <= 0
        ? "peptide absent"
        : `L2 ${
            this.peptideVariant === "prarr"
              ? "PRARR"
              : this.peptideVariant === "sllrst"
                ? "SLLRST"
                : "KSRRRAR"
          } ×${this.ligand2Count}${this.ligandBaseline === "ligand2" ? " exclusive" : ""}`;
    return `${pb} · ${pep}`;
  }

  // —— Validity suite (KSRRRAR vs PRARR exclusive) ——
  runValiditySuite(opts?: {
    includeRamp?: boolean;
  }): ValiditySuiteResult {
    void opts;
    const nRep = Math.min(VALIDITY_LOCKED.replicates, 5);
    const runFrames = Math.min(VALIDITY_LOCKED.runFrames, 300);
    const replicates: ValidityReplicateResult[] = [];
    for (const base of VALIDITY_BASELINES) {
      for (const protocol of VALIDITY_FIXED_PH) {
        const pH = protocol.kind === "fixed-pH" ? protocol.pH : 7.4;
        for (let r = 0; r < nRep; r++) {
          const seed =
            VALIDITY_LOCKED.baseSeed +
            r * 997 +
            (base.id === "Baseline_PRARR_50"
              ? 10000
              : base.id === "Baseline_SLLRST_50"
                ? 20000
                : 0);
          this.rngSeed = seed;
          this.rng = makeRng(seed);
          this.spawnSeed = seed;
          this.setReceptorGeometry("furin");
          this.ligandBaseline = "ligand2";
          this.peptideVariant = base.id.includes("SLLRST")
            ? "sllrst"
            : base.id.includes("PRARR")
              ? "prarr"
              : "ksrrrar";
          this.ligand2Count = VALIDITY_LOCKED.nMolecules;
          this.ligand2Enabled = true;
          this.moleculeCount = 0;
          this.ligand3Enabled = false;
          this.ligand3Count = 0;
          this.ligand4Enabled = false;
          this.ligand4Count = 0;
          this.bootstrap(0, pH);
          this.enforceExclusiveParticles();
          this.applyValidityLockedParams(pH);
          this.applyPH(pH);
          this.resetBehaviorCounters();
          this.playing = true;
          let sumU = 0,
            sumTot = 0,
            nU = 0;
          for (let f = 0; f < runFrames; f++) {
            this.step();
            this.refreshRoiEnergy();
            const re = this.roiEnergy;
            if (re) {
              sumU += re.energyL2His;
              sumTot += re.energyTotal;
              nU++;
            }
          }
          const inv = nU || 1;
          replicates.push({
            replicate: r,
            seed,
            baselineId: base.id as ValidityBaselineId,
            protocol,
            proximityEvents: this.behaviorStats.proximityEvents,
            meanProximityDistNm: this.behaviorStats.triggerDistancesNm.length
              ? this.behaviorStats.triggerDistancesNm.reduce((a, b) => a + b, 0) /
                this.behaviorStats.triggerDistancesNm.length
              : null,
            hhBinaryEvents: this.behaviorStats.hhBinaryEvents,
            meanHhDistNm: this.behaviorStats.hhTriggerDistancesNm.length
              ? this.behaviorStats.hhTriggerDistancesNm.reduce((a, b) => a + b, 0) /
                this.behaviorStats.hhTriggerDistancesNm.length
              : null,
            meanUPepHis: sumU / inv,
            meanUTot: sumTot / inv,
            finalTheta: this.hisTheta,
            finalQHis: this.proteins[0]?.hisCharge ?? 0,
            finalPH: pH,
          });
        }
      }
    }
    const aggList: import("./validity-test").ValidityAggregate[] = [];
    for (const base of VALIDITY_BASELINES) {
      for (const protocol of VALIDITY_FIXED_PH) {
        const subset = replicates.filter(
          (r) => r.baselineId === base.id && r.protocol === protocol,
        );
        if (!subset.length) continue;
        aggList.push(
          aggregateReplicates(base.id as ValidityBaselineId, protocol, subset),
        );
      }
    }
    const suite: ValiditySuiteResult = {
      schema: "moleculosphere5d.validity.v1",
      exportedAt: new Date().toISOString(),
      locked: { ...VALIDITY_LOCKED },
      receptor: {
        label: "Furin catalytic triad",
        triad: "Asp153–His194–Ser368",
        roi: "His194",
      },
      expectation: "KSRRRAR (+5) > PRARR (+3) > SLLRST (+1) on |U_pep–His|",
      ranking: [],
      aggregates: aggList,
    };
    this.lastValiditySuite = suite;
    this.lastScientificJson = JSON.stringify(suite, null, 2);
    this.emitUi();
    return suite;
  }


  /**
   * Exclusive 3-peptide furin contrast (KSRRRAR / PRARR / SLLRST).
   * Locked Yukawa params; respawn OFF; energy ranking primary.
   */
  runPeptide3FurinBaselines(opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
  }): {
    csv: string;
    rankingCsv: string;
    json: string;
    summary: string;
  } {
    const nMol = opts?.nMolecules ?? 20;
    const frames = opts?.frames ?? 200;
    const nRep = opts?.replicates ?? 5;
    const variants: { id: ValidityBaselineId; variant: PeptideVariant; label: string; q: number }[] = [
      { id: "Baseline_KSRRRAR_50", variant: "ksrrrar", label: "KSRRRAR", q: 5 },
      { id: "Baseline_PRARR_50", variant: "prarr", label: "PRARR", q: 3 },
      { id: "Baseline_SLLRST_50", variant: "sllrst", label: "SLLRST", q: 1 },
    ];
    const rows: {
      baselineId: string;
      sequence: string;
      nominalCharge: number;
      pH: number;
      n: number;
      frames: number;
      U_pep_His_mean: number;
      U_pep_His_sd: number;
      U_tot_mean: number;
      U_tot_sd: number;
      proximity_mean: number;
      proximity_sd: number;
      theta_mean: number;
      q_His_mean: number;
    }[] = [];

    const savedRespawn = this.respawnOnBinding;
    this.setRespawnOnBinding(false);

    for (const v of variants) {
      for (const protocol of VALIDITY_FIXED_PH) {
        const pH = protocol.kind === "fixed-pH" ? protocol.pH : 7.4;
        const uSamples: number[] = [];
        const totSamples: number[] = [];
        const proxSamples: number[] = [];
        const thetaSamples: number[] = [];
        const qSamples: number[] = [];
        for (let r = 0; r < nRep; r++) {
          const seed =
            VALIDITY_LOCKED.baseSeed +
            r * 997 +
            (v.variant === "prarr" ? 10000 : v.variant === "sllrst" ? 20000 : 0) +
            Math.round(pH * 100);
          this.rngSeed = seed;
          this.rng = makeRng(seed);
          this.spawnSeed = seed;
          this.setReceptorGeometry("furin");
          this.ligandBaseline = "ligand2";
          this.peptideVariant = v.variant;
          this.ligand2Count = nMol;
          this.ligand2Enabled = true;
          this.moleculeCount = 0;
          this.ligand3Enabled = false;
          this.ligand3Count = 0;
          this.ligand4Enabled = false;
          this.ligand4Count = 0;
          this.bootstrap(0, pH);
          this.enforceExclusiveParticles();
          this.applyValidityLockedParams(pH);
          this.applyPH(pH);
          this.resetBehaviorCounters();
          this.playing = true;
          let sumU = 0,
            sumTot = 0,
            nU = 0;
          for (let f = 0; f < frames; f++) {
            this.step();
            this.refreshRoiEnergy();
            const re = this.roiEnergy;
            if (re) {
              sumU += re.energyL2His;
              sumTot += re.energyTotal;
              nU++;
            }
          }
          const inv = nU || 1;
          uSamples.push(sumU / inv);
          totSamples.push(sumTot / inv);
          proxSamples.push(this.behaviorStats.proximityEvents);
          thetaSamples.push(this.hisTheta);
          qSamples.push(this.proteins[0]?.hisCharge ?? 0);
        }
        const ms = (xs: number[]) => {
          const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
          if (xs.length < 2) return { mean, sd: 0 };
          const varr =
            xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
          return { mean, sd: Math.sqrt(varr) };
        };
        const u = ms(uSamples);
        const tot = ms(totSamples);
        const prox = ms(proxSamples);
        const th = ms(thetaSamples);
        const qh = ms(qSamples);
        rows.push({
          baselineId: `Baseline_${v.label}_${nMol}`,
          sequence: v.label,
          nominalCharge: v.q,
          pH,
          n: nRep,
          frames,
          U_pep_His_mean: u.mean,
          U_pep_His_sd: u.sd,
          U_tot_mean: tot.mean,
          U_tot_sd: tot.sd,
          proximity_mean: prox.mean,
          proximity_sd: prox.sd,
          theta_mean: th.mean,
          q_His_mean: qh.mean,
        });
      }
    }

    this.setRespawnOnBinding(savedRespawn);

    const disclaimer =
      "# Classical continuum electrostatics only. Educational / hypothesis tool. Not MD, docking, or biological validation.";
    const header = [
      "baselineId",
      "sequence",
      "nominalCharge",
      "pH",
      "n",
      "frames",
      "U_pep_His_mean",
      "U_pep_His_sd",
      "U_tot_mean",
      "U_tot_sd",
      "proximity_mean",
      "proximity_sd",
      "theta_mean",
      "q_His_mean",
    ].join(",");
    const csvBody = rows
      .map((r) =>
        [
          r.baselineId,
          r.sequence,
          r.nominalCharge,
          r.pH,
          r.n,
          r.frames,
          r.U_pep_His_mean.toFixed(6),
          r.U_pep_His_sd.toFixed(6),
          r.U_tot_mean.toFixed(6),
          r.U_tot_sd.toFixed(6),
          r.proximity_mean.toFixed(4),
          r.proximity_sd.toFixed(4),
          r.theta_mean.toFixed(6),
          r.q_His_mean.toFixed(6),
        ].join(","),
      )
      .join("\n");
    const csv = `${disclaimer}\n${header}\n${csvBody}\n`;

    // Ranking by |U| descending (strongest continuum interaction first)
    const rankRows: string[] = [
      disclaimer,
      "pH,rank,sequence,nominalCharge,U_pep_His_mean,U_pep_His_sd,absU",
    ];
    for (const pH of [7.4, 6.2, 5.0]) {
      const subset = rows
        .filter((r) => r.pH === pH)
        .sort(
          (a, b) => Math.abs(b.U_pep_His_mean) - Math.abs(a.U_pep_His_mean),
        );
      subset.forEach((r, i) => {
        rankRows.push(
          [
            pH,
            i + 1,
            r.sequence,
            r.nominalCharge,
            r.U_pep_His_mean.toFixed(6),
            r.U_pep_His_sd.toFixed(6),
            Math.abs(r.U_pep_His_mean).toFixed(6),
          ].join(","),
        );
      });
    }
    const rankingCsv = rankRows.join("\n") + "\n";

    // Hypothesis check at each pH
    const notes: string[] = [];
    for (const pH of [7.4, 6.2, 5.0]) {
      const bySeq = Object.fromEntries(
        rows.filter((r) => r.pH === pH).map((r) => [r.sequence, r.U_pep_His_mean]),
      ) as Record<string, number>;
      const k = bySeq["KSRRRAR"] ?? 0;
      const pr = bySeq["PRARR"] ?? 0;
      const sl = bySeq["SLLRST"] ?? 0;
      const ok = Math.abs(k) > Math.abs(pr) && Math.abs(pr) > Math.abs(sl);
      notes.push(
        `pH ${pH}: |U| K=${Math.abs(k).toFixed(2)} PR=${Math.abs(pr).toFixed(2)} SL=${Math.abs(sl).toFixed(2)} → ${ok ? "CONFIRMED" : "REFUTED"}`,
      );
    }
    const summary = notes.join(" · ");
    const payload = {
      schema: "moleculosphere5d.peptide3_furin.v1",
      disclaimer:
        "Classical continuum electrostatics only. SLLRST is a continuum single-Arg educational contrast — not a viral infectivity claim.",
      locked: { ...VALIDITY_LOCKED },
      receptor: "furin",
      roi: "His194",
      respawn: false,
      nMolecules: nMol,
      frames,
      replicates: nRep,
      expectation: "|U|(KSRRRAR) > |U|(PRARR) > |U|(SLLRST)",
      rankingNotes: notes,
      rows,
    };
    const json = JSON.stringify(payload, null, 2);
    this.lastScientificJson = json;
    this.emitUi();
    return { csv, rankingCsv, json, summary };
  }


  /**
   * Public validation matrix PUB_MATRIX:
   * receptors A–F × exclusive {Pb²⁺, KSRRRAR, PRARR, SLLRST} × pH 7.4/6.2/5.0.
   * Locked Yukawa; respawn OFF. Energy ranking primary.
   */
  runPubMatrix(opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
  }): {
    csv: string;
    rankingCsv: string;
    eVsFCsv: string;
    json: string;
    summary: string;
  } {
    const nMol = opts?.nMolecules ?? 20;
    const frames = opts?.frames ?? 200;
    const nRep = opts?.replicates ?? 5;
    const receptors: ReceptorGeometryId[] = [
      "furin",
      "acidicPore",
      "alpha7Allo",
      "alpha7Ortho",
      "atp7aWt",
      "atp7aMenkes",
    ];
    const ligands: {
      id: string;
      label: string;
      pb: number;
      peptide: PeptideVariant;
      peptideCount: number;
      q: number;
      energyKey: "L1" | "L2";
    }[] = [
      {
        id: "L_HM",
        label: "Pb2+",
        pb: nMol,
        peptide: "off",
        peptideCount: 0,
        q: 2,
        energyKey: "L1",
      },
      {
        id: "L_PB5",
        label: "KSRRRAR",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: nMol,
        q: 5,
        energyKey: "L2",
      },
      {
        id: "L_PB3",
        label: "PRARR",
        pb: 0,
        peptide: "prarr",
        peptideCount: nMol,
        q: 3,
        energyKey: "L2",
      },
      {
        id: "L_MB1",
        label: "SLLRST",
        pb: 0,
        peptide: "sllrst",
        peptideCount: nMol,
        q: 1,
        energyKey: "L2",
      },
    ];
    const pHs = [7.4, 6.2, 5.0] as const;

    type Row = {
      receptorId: string;
      receptorLabel: string;
      ligandId: string;
      ligandLabel: string;
      nominalCharge: number;
      pH: number;
      n: number;
      frames: number;
      U_L_ROI_mean: number;
      U_L_ROI_sd: number;
      U_tot_mean: number;
      U_tot_sd: number;
    };
    const rows: Row[] = [];
    const savedRespawn = this.respawnOnBinding;
    this.setRespawnOnBinding(false);

    const ms = (xs: number[]) => {
      const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
      if (xs.length < 2) return { mean, sd: 0 };
      const varr =
        xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
      return { mean, sd: Math.sqrt(varr) };
    };

    let cell = 0;
    for (const rec of receptors) {
      for (const lig of ligands) {
        for (const pH of pHs) {
          const uSamples: number[] = [];
          const totSamples: number[] = [];
          for (let r = 0; r < nRep; r++) {
            const seed =
              VALIDITY_LOCKED.baseSeed +
              r * 997 +
              rec.length * 31 +
              lig.id.charCodeAt(2) * 17 +
              Math.round(pH * 100) +
              cell * 3;
            this.rngSeed = seed;
            this.rng = makeRng(seed);
            this.spawnSeed = seed;
            this.setReceptorGeometry(rec);
            this.ligand3Enabled = false;
            this.ligand3Count = 0;
            this.ligand4Enabled = false;
            this.ligand4Count = 0;
            if (lig.energyKey === "L1") {
              this.ligandBaseline = "ligand1";
              this.metalMode = "pb";
              this.moleculeCount = lig.pb;
              this.peptideVariant = "off";
              this.ligand2Count = 0;
              this.ligand2Enabled = false;
              this.bootstrap(lig.pb, pH);
            } else {

              this.ligandBaseline = "ligand2";
              this.moleculeCount = 0;
              this.peptideVariant = lig.peptide;
              this.ligand2Count = lig.peptideCount;
              this.ligand2Enabled = true;
              this.bootstrap(0, pH);
            }
            this.enforceExclusiveParticles();
            this.applyValidityLockedParams(pH);
            this.applyPH(pH);
            this.resetBehaviorCounters();
            this.playing = true;
            let sumU = 0,
              sumTot = 0,
              nU = 0;
            for (let f = 0; f < frames; f++) {
              this.step();
              this.refreshRoiEnergy();
              const re = this.roiEnergy;
              if (re) {
                sumU +=
                  lig.energyKey === "L1" ? re.energyL1His : re.energyL2His;
                sumTot += re.energyTotal;
                nU++;
              }
            }
            const inv = nU || 1;
            uSamples.push(sumU / inv);
            totSamples.push(sumTot / inv);
          }
          const u = ms(uSamples);
          const tot = ms(totSamples);
          const meta = RECEPTOR_GEOMETRIES[rec];
          rows.push({
            receptorId: rec,
            receptorLabel: meta?.shortLabel ?? rec,
            ligandId: lig.id,
            ligandLabel: lig.label,
            nominalCharge: lig.q,
            pH,
            n: nRep,
            frames,
            U_L_ROI_mean: u.mean,
            U_L_ROI_sd: u.sd,
            U_tot_mean: tot.mean,
            U_tot_sd: tot.sd,
          });
          cell++;
        }
      }
    }
    this.setRespawnOnBinding(savedRespawn);

    const disclaimer =
      "# " +
      PUBLICATION_DISCLAIMER +
      "\n# MoleculoSphere 5D · Beta v1.0 · locked Yukawa · respawn OFF";
    const header = [
      "receptorId",
      "receptorLabel",
      "ligandId",
      "ligandLabel",
      "nominalCharge",
      "pH",
      "n",
      "frames",
      "U_L_ROI_mean",
      "U_L_ROI_sd",
      "U_tot_mean",
      "U_tot_sd",
    ].join(",");
    const csvBody = rows
      .map((r) =>
        [
          r.receptorId,
          r.receptorLabel,
          r.ligandId,
          r.ligandLabel,
          r.nominalCharge,
          r.pH,
          r.n,
          r.frames,
          r.U_L_ROI_mean.toFixed(6),
          r.U_L_ROI_sd.toFixed(6),
          r.U_tot_mean.toFixed(6),
          r.U_tot_sd.toFixed(6),
        ].join(","),
      )
      .join("\n");
    const csv = `${disclaimer}\n${header}\n${csvBody}\n`;

    // Ranking per receptor × pH by |U|
    const rankRows: string[] = [
      disclaimer,
      "receptorId,pH,rank,ligandLabel,nominalCharge,U_L_ROI_mean,U_L_ROI_sd,absU",
    ];
    for (const rec of receptors) {
      for (const pH of pHs) {
        const subset = rows
          .filter((r) => r.receptorId === rec && r.pH === pH)
          .sort(
            (a, b) => Math.abs(b.U_L_ROI_mean) - Math.abs(a.U_L_ROI_mean),
          );
        subset.forEach((r, i) => {
          rankRows.push(
            [
              rec,
              pH,
              i + 1,
              r.ligandLabel,
              r.nominalCharge,
              r.U_L_ROI_mean.toFixed(6),
              r.U_L_ROI_sd.toFixed(6),
              Math.abs(r.U_L_ROI_mean).toFixed(6),
            ].join(","),
          );
        });
      }
    }
    const rankingCsv = rankRows.join("\n") + "\n";

    // E vs F contrast for each cationic ligand × pH
    const efRows: string[] = [
      disclaimer,
      "ligandLabel,nominalCharge,pH,U_E_WT_mean,U_E_WT_sd,U_F_Menkes_mean,U_F_Menkes_sd,delta_absU_E_minus_F,WT_stronger",
    ];
    const notes: string[] = [];
    for (const lig of ligands) {
      for (const pH of pHs) {
        const e = rows.find(
          (r) =>
            r.receptorId === "atp7aWt" &&
            r.ligandLabel === lig.label &&
            r.pH === pH,
        );
        const f = rows.find(
          (r) =>
            r.receptorId === "atp7aMenkes" &&
            r.ligandLabel === lig.label &&
            r.pH === pH,
        );
        if (!e || !f) continue;
        const dAbs = Math.abs(e.U_L_ROI_mean) - Math.abs(f.U_L_ROI_mean);
        const stronger = dAbs > 0;
        efRows.push(
          [
            lig.label,
            lig.q,
            pH,
            e.U_L_ROI_mean.toFixed(6),
            e.U_L_ROI_sd.toFixed(6),
            f.U_L_ROI_mean.toFixed(6),
            f.U_L_ROI_sd.toFixed(6),
            dAbs.toFixed(6),
            stronger ? "yes" : "no",
          ].join(","),
        );
        if (pH === 7.4) {
          notes.push(
            `${lig.label}: |U|_E=${Math.abs(e.U_L_ROI_mean).toFixed(2)} |U|_F=${Math.abs(f.U_L_ROI_mean).toFixed(2)} → E ${stronger ? ">" : "≤"} F`,
          );
        }
      }
    }
    const eVsFCsv = efRows.join("\n") + "\n";
    const summary = `PUB_MATRIX ${rows.length} cells · n=${nRep} · frames=${frames} · E vs F @7.4: ${notes.join(" · ")} · ${PUBLICATION_DISCLAIMER}`;
    const payload = {
      schema: "moleculosphere5d.pub_matrix.v1",
      disclaimer: PUBLICATION_DISCLAIMER,
      locked: { ...VALIDITY_LOCKED },
      receptors,
      ligands: ligands.map((l) => l.label),
      pH: [...pHs],
      respawn: false,
      nMolecules: nMol,
      frames,
      replicates: nRep,
      rows,
      eVsFNotes: notes,
    };
    const json = JSON.stringify(payload, null, 2);
    this.lastScientificJson = json;
    this.emitUi();
    return { csv, rankingCsv, eVsFCsv, json, summary };
  }

  /**
   * Menkes-scope Cu²⁺ analysis (public Beta v1.0):
   * exclusive Cu²⁺ on E (ATP7A WT) and F (ATP7A Menkes) × pH 7.4 / 6.2 / 5.0.
   * Also builds E/F ranking including Cu²⁺ + Pb²⁺ + KSRRRAR + PRARR + SLLRST.
   * Locked Yukawa; respawn OFF. Primary metric: mean±sd U_L–ROI; ΔU = U_F − U_E.
   */
  runPubMatrixCuEF(opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
  }): {
    meanSdCsv: string;
    contrastCsv: string;
    rankingEFCsv: string;
    json: string;
    summary: string;
  } {
    const nMol = opts?.nMolecules ?? 20;
    const frames = opts?.frames ?? 150;
    const nRep = opts?.replicates ?? 5;
    const receptors: ReceptorGeometryId[] = ["atp7aWt", "atp7aMenkes"];
    const pHs = [7.4, 6.2, 5.0] as const;

    type LigSpec = {
      id: string;
      label: string;
      metal: MetalMode;
      peptide: PeptideVariant;
      pb: number;
      peptideCount: number;
      q: number;
      energyKey: "L1" | "L2";
    };
    const allLigands: LigSpec[] = [
      {
        id: "L_HM_Cu",
        label: "Cu2+",
        metal: "cu",
        peptide: "off",
        pb: nMol,
        peptideCount: 0,
        q: 2,
        energyKey: "L1",
      },
      {
        id: "L_HM_Pb",
        label: "Pb2+",
        metal: "pb",
        peptide: "off",
        pb: nMol,
        peptideCount: 0,
        q: 2,
        energyKey: "L1",
      },
      {
        id: "L_PB5",
        label: "KSRRRAR",
        metal: "off",
        peptide: "ksrrrar",
        pb: 0,
        peptideCount: nMol,
        q: 5,
        energyKey: "L2",
      },
      {
        id: "L_PB3",
        label: "PRARR",
        metal: "off",
        peptide: "prarr",
        pb: 0,
        peptideCount: nMol,
        q: 3,
        energyKey: "L2",
      },
      {
        id: "L_MB1",
        label: "SLLRST",
        metal: "off",
        peptide: "sllrst",
        pb: 0,
        peptideCount: nMol,
        q: 1,
        energyKey: "L2",
      },
    ];

    type Row = {
      receptorId: string;
      receptorLabel: string;
      ligandId: string;
      ligandLabel: string;
      nominalCharge: number;
      pH: number;
      n: number;
      frames: number;
      U_L_ROI_mean: number;
      U_L_ROI_sd: number;
      U_tot_mean: number;
      U_tot_sd: number;
    };
    const rows: Row[] = [];
    const savedRespawn = this.respawnOnBinding;
    const savedMode = this.metalMode;
    this.setRespawnOnBinding(false);

    const ms = (xs: number[]) => {
      const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
      if (xs.length < 2) return { mean, sd: 0 };
      const varr =
        xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
      return { mean, sd: Math.sqrt(varr) };
    };

    let cell = 0;
    for (const rec of receptors) {
      for (const lig of allLigands) {
        for (const pH of pHs) {
          const uSamples: number[] = [];
          const totSamples: number[] = [];
          for (let r = 0; r < nRep; r++) {
            const seed =
              VALIDITY_LOCKED.baseSeed +
              r * 997 +
              rec.length * 31 +
              lig.id.charCodeAt(Math.min(4, lig.id.length - 1)) * 19 +
              Math.round(pH * 100) +
              cell * 5;
            this.rngSeed = seed;
            this.rng = makeRng(seed);
            this.spawnSeed = seed;
            this.setReceptorGeometry(rec);
            this.ligand3Enabled = false;
            this.ligand3Count = 0;
            this.ligand4Enabled = false;
            this.ligand4Count = 0;
            if (lig.energyKey === "L1") {
              this.metalMode = lig.metal;
              this.ligandBaseline = "ligand1";
              this.moleculeCount = lig.pb;
              this.peptideVariant = "off";
              this.ligand2Count = 0;
              this.ligand2Enabled = false;
              this.bootstrap(lig.pb, pH);
            } else {
              this.metalMode = "off";
              this.ligandBaseline = "ligand2";
              this.moleculeCount = 0;
              this.peptideVariant = lig.peptide;
              this.ligand2Count = lig.peptideCount;
              this.ligand2Enabled = true;
              this.bootstrap(0, pH);
            }
            this.enforceExclusiveParticles();
            this.applyValidityLockedParams(pH);
            this.applyPH(pH);
            this.resetBehaviorCounters();
            this.playing = true;
            let sumU = 0,
              sumTot = 0,
              nU = 0;
            for (let f = 0; f < frames; f++) {
              this.step();
              this.refreshRoiEnergy();
              const re = this.roiEnergy;
              if (re) {
                sumU +=
                  lig.energyKey === "L1" ? re.energyL1His : re.energyL2His;
                sumTot += re.energyTotal;
                nU++;
              }
            }
            const inv = nU || 1;
            uSamples.push(sumU / inv);
            totSamples.push(sumTot / inv);
          }
          const u = ms(uSamples);
          const tot = ms(totSamples);
          const meta = RECEPTOR_GEOMETRIES[rec];
          rows.push({
            receptorId: rec,
            receptorLabel: meta?.shortLabel ?? rec,
            ligandId: lig.id,
            ligandLabel: lig.label,
            nominalCharge: lig.q,
            pH,
            n: nRep,
            frames,
            U_L_ROI_mean: u.mean,
            U_L_ROI_sd: u.sd,
            U_tot_mean: tot.mean,
            U_tot_sd: tot.sd,
          });
          cell++;
        }
      }
    }
    this.setRespawnOnBinding(savedRespawn);
    this.metalMode = savedMode;

    const disclaimer =
      "# " +
      PUBLICATION_DISCLAIMER +
      "\n# MoleculoSphere 5D · Beta v1.0 · locked Yukawa · respawn OFF";

    // Cu-only mean±sd
    const cuRows = rows.filter((r) => r.ligandId === "L_HM_Cu");
    const meanHeader = [
      "receptorId",
      "receptorLabel",
      "ligandId",
      "ligandLabel",
      "nominalCharge",
      "pH",
      "n",
      "frames",
      "U_Cu_ROI_mean",
      "U_Cu_ROI_sd",
      "U_tot_mean",
      "U_tot_sd",
    ].join(",");
    const meanBody = cuRows
      .map((r) =>
        [
          r.receptorId,
          r.receptorLabel,
          r.ligandId,
          r.ligandLabel,
          r.nominalCharge,
          r.pH,
          r.n,
          r.frames,
          r.U_L_ROI_mean.toFixed(6),
          r.U_L_ROI_sd.toFixed(6),
          r.U_tot_mean.toFixed(6),
          r.U_tot_sd.toFixed(6),
        ].join(","),
      )
      .join("\n");
    const meanSdCsv = `${disclaimer}\n${meanHeader}\n${meanBody}\n`;

    // ΔU = U_F − U_E for Cu (and Pb for E/F contrast table)
    const contrastHeader =
      "ligandLabel,nominalCharge,pH,U_E_WT_mean,U_E_WT_sd,U_F_Menkes_mean,U_F_Menkes_sd,deltaU_F_minus_E,deltaAbsU_E_minus_F,WT_stronger";
    const contrastLines: string[] = [disclaimer, contrastHeader];
    const notes: string[] = [];
    for (const lab of ["Cu2+", "Pb2+"]) {
      for (const pH of pHs) {
        const e = rows.find(
          (r) =>
            r.receptorId === "atp7aWt" &&
            r.ligandLabel === lab &&
            r.pH === pH,
        );
        const f = rows.find(
          (r) =>
            r.receptorId === "atp7aMenkes" &&
            r.ligandLabel === lab &&
            r.pH === pH,
        );
        if (!e || !f) continue;
        const dU = f.U_L_ROI_mean - e.U_L_ROI_mean;
        const dAbs = Math.abs(e.U_L_ROI_mean) - Math.abs(f.U_L_ROI_mean);
        const stronger = dAbs > 0;
        contrastLines.push(
          [
            lab,
            lab === "Cu2+" ? 2 : 2,
            pH,
            e.U_L_ROI_mean.toFixed(6),
            e.U_L_ROI_sd.toFixed(6),
            f.U_L_ROI_mean.toFixed(6),
            f.U_L_ROI_sd.toFixed(6),
            dU.toFixed(6),
            dAbs.toFixed(6),
            stronger ? "yes" : "no",
          ].join(","),
        );
        if (pH === 7.4) {
          notes.push(
            `${lab}: ΔU(F−E)=${dU.toFixed(2)} |U|_E=${Math.abs(e.U_L_ROI_mean).toFixed(2)} |U|_F=${Math.abs(f.U_L_ROI_mean).toFixed(2)}`,
          );
        }
      }
    }
    const contrastCsv = contrastLines.join("\n") + "\n";

    // Ranking E/F by |U| including Cu + Pb + peptides
    const rankLines: string[] = [
      disclaimer,
      "receptorId,pH,rank,ligandLabel,nominalCharge,U_L_ROI_mean,U_L_ROI_sd,absU",
    ];
    for (const rec of receptors) {
      for (const pH of pHs) {
        const subset = rows
          .filter((r) => r.receptorId === rec && r.pH === pH)
          .sort(
            (a, b) => Math.abs(b.U_L_ROI_mean) - Math.abs(a.U_L_ROI_mean),
          );
        subset.forEach((r, i) => {
          rankLines.push(
            [
              rec,
              pH,
              i + 1,
              r.ligandLabel,
              r.nominalCharge,
              r.U_L_ROI_mean.toFixed(6),
              r.U_L_ROI_sd.toFixed(6),
              Math.abs(r.U_L_ROI_mean).toFixed(6),
            ].join(","),
          );
        });
      }
    }
    const rankingEFCsv = rankLines.join("\n") + "\n";

    const summary = `Cu Menkes E/F ${cuRows.length} cells · n=${nRep} · frames=${frames} · @7.4: ${notes.join(" · ")} · ${PUBLICATION_DISCLAIMER}`;
    const payload = {
      schema: "moleculosphere5d.pub_matrix_cu_ef.v1",
      version: "Beta v1.0",
      disclaimer: PUBLICATION_DISCLAIMER,
      locked: { ...VALIDITY_LOCKED },
      receptors,
      ligands: allLigands.map((l) => l.label),
      pH: [...pHs],
      respawn: false,
      nMolecules: nMol,
      frames,
      replicates: nRep,
      cuRows,
      allRows: rows,
      eVsFNotes: notes,
    };
    const json = JSON.stringify(payload, null, 2);
    this.lastScientificJson = json;
    this.emitUi();
    return { meanSdCsv, contrastCsv, rankingEFCsv, json, summary };
  }


  /**
   * PUB_COMBO v1.1 — public multi-ligand HM + peptide pairs.
   * Receptors B (acidic pore), E (ATP7A WT), F (ATP7A Menkes).
   * Pairs: Pb+KSRRRAR, Cu+KSRRRAR, Pb+PRARR × pH 7.4/6.2/5.0.
   * Exports mean±sd U_HM–ROI, U_pep–ROI, U_HM–pep, U_tot + exclusive baselines.
   * Locked Yukawa; respawn OFF. No private ligands.
   */
  runPubCombo(opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
  }): {
    csv: string;
    vsExclusiveCsv: string;
    json: string;
    summary: string;
  } {
    const nMol = opts?.nMolecules ?? 12;
    const frames = opts?.frames ?? 150;
    const nRep = opts?.replicates ?? 5;
    const receptors: ReceptorGeometryId[] = [
      "acidicPore",
      "atp7aWt",
      "atp7aMenkes",
    ];
    const pairs: {
      id: string;
      label: string;
      metal: MetalMode;
      peptide: PeptideVariant;
      pepLabel: string;
    }[] = [
      {
        id: "Pb_KS",
        label: "Pb2+ + KSRRRAR",
        metal: "pb",
        peptide: "ksrrrar",
        pepLabel: "KSRRRAR",
      },
      {
        id: "Cu_KS",
        label: "Cu2+ + KSRRRAR",
        metal: "cu",
        peptide: "ksrrrar",
        pepLabel: "KSRRRAR",
      },
      {
        id: "Pb_PR",
        label: "Pb2+ + PRARR",
        metal: "pb",
        peptide: "prarr",
        pepLabel: "PRARR",
      },
    ];
    const pHs = [7.4, 6.2, 5.0] as const;
    const ms = (xs: number[]) => {
      const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
      if (xs.length < 2) return { mean, sd: 0 };
      const varr =
        xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
      return { mean, sd: Math.sqrt(varr) };
    };

    type ComboRow = {
      receptorId: string;
      receptorLabel: string;
      pairId: string;
      pairLabel: string;
      metal: string;
      peptide: string;
      pH: number;
      n: number;
      frames: number;
      mode: "combo" | "exclusive_HM" | "exclusive_pep";
      U_HM_ROI_mean: number;
      U_HM_ROI_sd: number;
      U_pep_ROI_mean: number;
      U_pep_ROI_sd: number;
      U_HM_pep_mean: number;
      U_HM_pep_sd: number;
      U_tot_mean: number;
      U_tot_sd: number;
      badge: string;
    };
    const rows: ComboRow[] = [];
    const savedRespawn = this.respawnOnBinding;
    this.setRespawnOnBinding(false);

    const runMode = (
      rec: ReceptorGeometryId,
      pair: (typeof pairs)[0],
      pH: number,
      mode: "combo" | "exclusive_HM" | "exclusive_pep",
      cell: number,
    ): ComboRow => {
      const uHm: number[] = [];
      const uPep: number[] = [];
      const uLl: number[] = [];
      const uTot: number[] = [];
      for (let r = 0; r < nRep; r++) {
        const seed =
          VALIDITY_LOCKED.baseSeed +
          r * 997 +
          rec.length * 31 +
          pair.id.charCodeAt(0) * 17 +
          Math.round(pH * 100) +
          cell * 5 +
          (mode === "combo" ? 0 : mode === "exclusive_HM" ? 1 : 2);
        this.rngSeed = seed;
        this.rng = makeRng(seed);
        this.spawnSeed = seed;
        this.setReceptorGeometry(rec);
        this.ligand3Enabled = false;
        this.ligand3Count = 0;
        this.ligand4Enabled = false;
        this.ligand4Count = 0;
        this.metalMode = pair.metal;
        if (mode === "combo") {
          this.ligandBaseline = "both";
          this.moleculeCount = nMol;
          this.peptideVariant = pair.peptide;
          this.ligand2Count = nMol;
          this.ligand2Enabled = true;
          this.bootstrap(nMol, pH);
        } else if (mode === "exclusive_HM") {
          this.ligandBaseline = "ligand1";
          this.moleculeCount = nMol;
          this.peptideVariant = "off";
          this.ligand2Count = 0;
          this.ligand2Enabled = false;
          this.bootstrap(nMol, pH);
        } else {
          this.ligandBaseline = "ligand2";
          this.moleculeCount = 0;
          this.peptideVariant = pair.peptide;
          this.ligand2Count = nMol;
          this.ligand2Enabled = true;
          this.bootstrap(0, pH);
        }
        this.enforceExclusiveParticles();
        this.applyValidityLockedParams(pH);
        this.applyPH(pH);
        this.resetBehaviorCounters();
        this.playing = true;
        let sHm = 0,
          sPep = 0,
          sLl = 0,
          sTot = 0,
          nU = 0;
        for (let f = 0; f < frames; f++) {
          this.step();
          this.refreshRoiEnergy();
          const re = this.roiEnergy;
          if (re) {
            const hm = Number(re.energyL1His) || 0;
            const pep = Number(re.energyL2His) || 0;
            const ll = Number(re.energyL1L2) || 0;
            sHm += hm;
            sPep += pep;
            sLl += ll;
            if (mode === "combo") sTot += hm + pep + ll;
            else if (mode === "exclusive_HM") sTot += hm;
            else sTot += pep;
            nU++;
          }
        }
        const inv = nU || 1;
        uHm.push(sHm / inv);
        uPep.push(sPep / inv);
        uLl.push(sLl / inv);
        uTot.push(sTot / inv);
      }
      const hm = ms(uHm);
      const pep = ms(uPep);
      const ll = ms(uLl);
      const tot = ms(uTot);
      const badge =
        mode !== "combo"
          ? "—"
          : ll.mean > 0.05
            ? "Competitive"
            : ll.mean < -0.05
              ? "Cooperative"
              : "Neutral";
      const meta = RECEPTOR_GEOMETRIES[rec];
      return {
        receptorId: rec,
        receptorLabel: meta?.shortLabel ?? rec,
        pairId: pair.id,
        pairLabel: pair.label,
        metal: pair.metal === "cu" ? "Cu2+" : "Pb2+",
        peptide: pair.pepLabel,
        pH,
        n: nRep,
        frames,
        mode,
        U_HM_ROI_mean: hm.mean,
        U_HM_ROI_sd: hm.sd,
        U_pep_ROI_mean: pep.mean,
        U_pep_ROI_sd: pep.sd,
        U_HM_pep_mean: ll.mean,
        U_HM_pep_sd: ll.sd,
        U_tot_mean: tot.mean,
        U_tot_sd: tot.sd,
        badge,
      };
    };

    let cell = 0;
    for (const rec of receptors) {
      for (const pair of pairs) {
        for (const pH of pHs) {
          rows.push(runMode(rec, pair, pH, "combo", cell));
          rows.push(runMode(rec, pair, pH, "exclusive_HM", cell));
          rows.push(runMode(rec, pair, pH, "exclusive_pep", cell));
          cell++;
        }
      }
    }
    this.setRespawnOnBinding(savedRespawn);

    const disclaimer =
      "# " +
      PUBLICATION_DISCLAIMER +
      "\n# MoleculoSphere 5D · v1.1 · PUB_COMBO · locked Yukawa · respawn OFF";
    const comboRows = rows.filter((r) => r.mode === "combo");
    const header = [
      "receptorId",
      "receptorLabel",
      "pairId",
      "pairLabel",
      "metal",
      "peptide",
      "pH",
      "n",
      "frames",
      "U_HM_ROI_mean",
      "U_HM_ROI_sd",
      "U_pep_ROI_mean",
      "U_pep_ROI_sd",
      "U_HM_pep_mean",
      "U_HM_pep_sd",
      "U_tot_mean",
      "U_tot_sd",
      "badge",
    ].join(",");
    const csvBody = comboRows
      .map((r) =>
        [
          r.receptorId,
          r.receptorLabel,
          r.pairId,
          JSON.stringify(r.pairLabel),
          r.metal,
          r.peptide,
          r.pH,
          r.n,
          r.frames,
          r.U_HM_ROI_mean.toFixed(6),
          r.U_HM_ROI_sd.toFixed(6),
          r.U_pep_ROI_mean.toFixed(6),
          r.U_pep_ROI_sd.toFixed(6),
          r.U_HM_pep_mean.toFixed(6),
          r.U_HM_pep_sd.toFixed(6),
          r.U_tot_mean.toFixed(6),
          r.U_tot_sd.toFixed(6),
          r.badge,
        ].join(","),
      )
      .join("\n");
    const csv = `${disclaimer}\n${header}\n${csvBody}\n`;

    const vsHeader = [
      "receptorId",
      "pairId",
      "pairLabel",
      "pH",
      "U_HM_combo_mean",
      "U_pep_combo_mean",
      "U_HM_pep_mean",
      "U_tot_combo_mean",
      "badge",
      "U_HM_exclusive_mean",
      "U_pep_exclusive_mean",
      "delta_HM_combo_minus_excl",
      "delta_pep_combo_minus_excl",
    ].join(",");
    const vsLines: string[] = [disclaimer, vsHeader];
    for (const rec of receptors) {
      for (const pair of pairs) {
        for (const pH of pHs) {
          const c = rows.find(
            (r) =>
              r.mode === "combo" &&
              r.receptorId === rec &&
              r.pairId === pair.id &&
              r.pH === pH,
          );
          const eh = rows.find(
            (r) =>
              r.mode === "exclusive_HM" &&
              r.receptorId === rec &&
              r.pairId === pair.id &&
              r.pH === pH,
          );
          const ep = rows.find(
            (r) =>
              r.mode === "exclusive_pep" &&
              r.receptorId === rec &&
              r.pairId === pair.id &&
              r.pH === pH,
          );
          if (!c || !eh || !ep) continue;
          vsLines.push(
            [
              rec,
              pair.id,
              JSON.stringify(pair.label),
              pH,
              c.U_HM_ROI_mean.toFixed(6),
              c.U_pep_ROI_mean.toFixed(6),
              c.U_HM_pep_mean.toFixed(6),
              c.U_tot_mean.toFixed(6),
              c.badge,
              eh.U_HM_ROI_mean.toFixed(6),
              ep.U_pep_ROI_mean.toFixed(6),
              (c.U_HM_ROI_mean - eh.U_HM_ROI_mean).toFixed(6),
              (c.U_pep_ROI_mean - ep.U_pep_ROI_mean).toFixed(6),
            ].join(","),
          );
        }
      }
    }
    const vsExclusiveCsv = vsLines.join("\n") + "\n";

    const nCompetitive = comboRows.filter((r) => r.badge === "Competitive").length;
    const nCoop = comboRows.filter((r) => r.badge === "Cooperative").length;
    const summary = `PUB_COMBO v1.1: ${comboRows.length} combo cells · n=${nRep} · frames=${frames} · Competitive ${nCompetitive} · Cooperative ${nCoop} · ${PUBLICATION_DISCLAIMER}`;
    const payload = {
      schema: "moleculosphere5d.pub_combo.v1_1",
      disclaimer: PUBLICATION_DISCLAIMER,
      version: "v1.1",
      locked: { ...VALIDITY_LOCKED },
      chargeSource: "formal" as const,
      receptors,
      pairs: pairs.map((x) => x.label),
      pH: [...pHs],
      respawn: false,
      nMolecules: nMol,
      frames,
      replicates: nRep,
      comboRows,
      allRows: rows,
    };
    const json = JSON.stringify(payload, null, 2);
    this.lastScientificJson = json;
    this.emitUi();
    return { csv, vsExclusiveCsv, json, summary };
  }

  /** @deprecated alias — Beta v1.0 uses runPubMatrixCuEF */
  runPubMatrixCuPbEF(opts?: {
    nMolecules?: number;
    frames?: number;
    replicates?: number;
    includeAD?: boolean;
  }) {
    void opts?.includeAD;
    const r = this.runPubMatrixCuEF(opts);
    return {
      csv: r.meanSdCsv,
      json: r.json,
      summary: r.summary,
      contrastCsv: r.contrastCsv,
      rankingEFCsv: r.rankingEFCsv,
    };
  }

  exportScientificSnapshot(): ScientificSnapshot | null {

    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    const re = this.roiEnergy;
    const snap = buildScientificSnapshot({
      stats: this.behaviorStats,
      params: this.params,
      debyeOverride: this.debyeOverrideNm != null,
      hisPka: this.hisPka,
      pH: this.pH,
      theta: this.hisTheta,
      hisCharge: prot?.hisCharge ?? 0,
      binaryOn: prot?.switchDisplayOn ?? false,
      pbCharge: 2,
      peptideCharge:
        this.peptideVariant === "prarr"
          ? 3
          : this.peptideVariant === "sllrst"
            ? 1
            : this.peptideVariant === "ksrrrar"
              ? 5
              : 0,
      roi: re,
      ligandBaseline: this.ligandBaseline,
      timeNs: this.timeNs,
      scenarioId: this.activeScenario,
      ligand2Enabled: this.ligand2Enabled,
      ligand2Count: this.ligand2Count,
      ligand2ChargeScale: this.ligand2ChargeScale,
      moleculeCount: this.moleculeCount,
      displayDurationSec: this.displayDurationSec,
      respawnOnBinding: this.respawnOnBinding,
      metalHisPrefEnabled: this.metalHisPrefEnabled,
      metalHisPrefFactor: this.metalHisPrefFactor,
      shortRangeWellEnabled: this.shortRangeWellEnabled,
      shortRangeWellDepthKt: this.shortRangeWellDepthKt,
      trajectorySummary: {
        frameCount: this.trajectory.length,
        tStartNs: this.trajectory[0]?.tNs ?? null,
        tEndNs: this.trajectory[this.trajectory.length - 1]?.tNs ?? null,
        particleCount: this.particles.length,
      },
    });
    this.lastScientificJson = JSON.stringify(snap, null, 2);
    return snap;
  }

  exportScientificCsv(): string {
    const snap = this.exportScientificSnapshot();
    if (!snap) return "";
    return scientificSnapshotToCsv(snap);
  }

  exportEnergySeriesCsv(): string {
    if (!this.eventLog.length) {
      return "tNs,U_Pb_His,U_pep_His,U_L1_L2,U_tot,His194_ON\n";
    }
    return eventSeriesToCsv(
      this.eventLog.map((f) => ({
        tNs: f.tNs,
        eL1: f.energyL1His,
        eL2: f.energyL2His,
        eL12: f.energyL1L2,
        eTot: f.energyTotal,
        on: f.switchDisplayOn,
      })),
    );
  }

  exportBehaviorSamplesCsv(): string {
    return behaviorSamplesToCsv(this.behaviorStats);
  }

  exportRoiSnapshot(): RoiAgentSnapshot | null {
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    if (!prot) return null;
    this.refreshRoiEnergy();
    try {
      const snap = buildRoiAgentSnapshot({
        prot,
        particles: this.particles,
        params: this.params,
        roiEnergy: this.roiEnergy,
        ligandBaseline: this.ligandBaseline,
        metalMode: this.metalMode,
        ligand2Enabled: this.ligand2Enabled,
        ligand2Count: this.ligand2Count,
        ligand2ChargeScale: this.ligand2ChargeScale,
        displayDurationSec: this.displayDurationSec,
        timeNs: this.timeNs,
      });
      this.lastSnapshotJson = JSON.stringify(snap, null, 2);
      return snap;
    } catch {
      return null;
    }
  }

  applyScientificSnapshot(snap: ScientificSnapshot) {
    const pH = (snap as { pH?: number }).pH ?? (snap as { conditions?: { pH?: number } }).conditions?.pH;
    if (pH != null) this.applyPH(pH);
    this.emitUi();
  }

  potentialAt(x: number, y: number, z: number): number {
    const particles = this?.particles ?? [];
    const params = this?.params;
    if (!params) return 0;
    const f = fieldAt(x, y, z, particles, params);
    return typeof f === "number" ? f : (f as { potential: number }).potential;
  }

  recomputeField() {
    this.fieldSlice = buildFieldSlice(
      this.particles,
      this.proteins,
      this.params,
    );
  }

  /**
   * True nearest active ligand to the focused ROI (all classes).
   * Distances in nm (positions are nm-native when coord scale = 1).
   */
  private nearestLigandToRoi(prot: (typeof this.proteins)[0]): {
    id: number;
    ligandClass: LigandClass;
    distNm: number;
    particle: Particle;
  } | null {
    const roi = roiWorldPos(prot);
    let best: {
      id: number;
      ligandClass: LigandClass;
      distNm: number;
      particle: Particle;
    } | null = null;
    for (const p of this.particles) {
      const rScene = Math.hypot(p.x - roi.x, p.y - roi.y, p.z - roi.z);
      const distNm = sceneToNm(rScene);
      if (!Number.isFinite(distNm) || distNm <= 0) continue;
      if (!best || distNm < best.distNm) {
        best = {
          id: p.id,
          ligandClass: p.ligandClass,
          distNm,
          particle: p,
        };
      }
    }
    return best;
  }

  /**
   * Demo path: remove the contacting ligand and reinstate one of the same class
   * on the peripheral shell (outside the 1.0 nm contact zone).
   * Does not alter Yukawa parameters.
   */
  private respawnLigandAfterProximity(
    particleId: number | null,
    oldDistNm: number | null,
  ): void {
    if (!this.respawnOnBinding) return;
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    if (!prot) return;

    let victim =
      particleId != null
        ? this.particles.find((x) => x.id === particleId)
        : undefined;
    if (!victim) {
      const near = this.nearestLigandToRoi(prot);
      victim = near?.particle;
      if (near && (oldDistNm == null || !Number.isFinite(oldDistNm))) {
        oldDistNm = near.distNm;
      }
    }
    if (!victim) return;

    const cls = victim.ligandClass;
    const speciesId = victim.speciesId;
    const kind = victim.kind;
    const qDesign = victim.qDesign;
    const oldId = victim.id;
    const oldD =
      oldDistNm != null && Number.isFinite(oldDistNm) ? oldDistNm : NaN;

    // 1) Remove from simulation arrays
    this.particles = this.particles.filter((x) => x.id !== oldId);
    this.ensureForceBuffers(this.particles.length);

    // 2) Peripheral shell — never inside contact zone (d < 1.0 nm)
    const roi = roiWorldPos(prot);
    const contactClear = PROXIMITY_EVENT_NM + 0.25; // 1.25 nm
    const shellMin = Math.max(VALIDITY_LOCKED.shellMinNm, contactClear);
    const shellMax = Math.max(VALIDITY_LOCKED.shellMaxNm, shellMin + 0.6);
    const theta = this.rng() * Math.PI * 2;
    const phi = Math.acos(2 * this.rng() - 1);
    const r = shellMin + this.rng() * (shellMax - shellMin);
    // Full radial placement — distance must stay ≥ contactClear (no squash)
    const ux = Math.sin(phi) * Math.cos(theta);
    const uy = Math.sin(phi) * Math.sin(theta) * 0.55;
    const uz = Math.cos(phi);
    let vx = ux;
    let vy = uy;
    let vz = uz;
    let vn = Math.hypot(vx, vy, vz) || 1;
    vx /= vn;
    vy /= vn;
    vz /= vn;
    const nx = roi.x + vx * r;
    const ny = roi.y + vy * r;
    const nz = roi.z + vz * r;
    // outward orientation (unit radial)
    const on = 1;

    const sp =
      cls === "ligand1"
        ? ligand1Species(this.metalMode)
        : cls === "ligand2"
          ? ligand2Species(
              this.peptideVariant === "prarr"
                ? "prarr"
                : this.peptideVariant === "sllrst"
                  ? "sllrst"
                  : "ksrrrar",
            )
          : cls === "ligand3"
            ? ligand3Species()
            : ligand4Species();
    const q = sp ? effectiveCharge(sp, this.pH) : victim.q;

    const newborn: Particle = {
      id: this.nextId++,
      speciesId: sp?.id ?? speciesId,
      kind: sp?.kind ?? kind,
      ligandClass: cls,
      x: nx,
      y: ny,
      z: nz,
      ox: vx / on,
      oy: vy / on,
      oz: vz / on,
      q,
      qDesign: sp
        ? this.qDesignForSpeciesId(sp.id)
        : qDesign,
    };

    // Apply L2 charge scale if needed
    if (cls === "ligand2" && this.ligand2ChargeScale !== 1) {
      newborn.q *= this.ligand2ChargeScale;
    }
    this.particles.push(newborn);
    this.ensureForceBuffers(this.particles.length);

    const newDistNm = sceneToNm(
      Math.hypot(newborn.x - roi.x, newborn.y - roi.y, newborn.z - roi.z),
    );

    // 3) Re-arm proximity window so the next contact can fire
    this.pendingProximity = null;

    this.lastRespawnFlash = {
      particleId: newborn.id,
      ligandClass: cls,
      oldDistNm: Number.isFinite(oldD) ? oldD : -1,
      newDistNm,
      ticksLeft: 60,
    };

    // Debug line for preview verification
    // eslint-disable-next-line no-console
    console.info(
      `[respawn] id=${oldId}→${newborn.id} class=${cls} oldDist=${
        Number.isFinite(oldD) ? oldD.toFixed(3) : "?"
      } nm newDist=${newDistNm.toFixed(3)} nm prox_events=${this.behaviorStats.proximityEvents}`,
    );
  }

  step() {
    if (this.eventPlayback && this.eventLog.length) {
      const win = this.clampWindow;
      const i0 = win?.i0 ?? 0;
      const i1 = win?.i1 ?? this.eventLog.length - 1;
      let next = (this.eventScrub ?? i0) + 1;
      if (next > i1) {
        if (this.clampLoop) next = i0;
        else {
          this.eventPlayback = false;
          this.eventScrub = i1;
          this.emit();
          return;
        }
      }
      this.eventScrub = next;
      this.emit();
      return;
    }

    if (this.scrubIndex != null) {
      this.emit();
      return;
    }

    this.ensureForceBuffers(this.particles.length);
    // protein his forces into particle forces via hisSiteForces optional
    stepOverdamped(
      this.particles,
      SPECIES_MAP_LOCAL,
      this.params,
      this.fx,
      this.fy,
      this.fz,
      this.proteins,
      this.rng,
    );

    // soft wall
    for (const p of this.particles) {
      const [wx, wy, wz] = wallForce(p.x, p.y, p.z, 0.35);
      p.x += wx * 0.02;
      p.y += wy * 0.02;
      p.z += wz * 0.02;
    }

    this.timeNs += FRAME_NS;
    this.refreshRoiEnergy();

    let stepProxAccepted = false;
    let stepMinDistNm = -1;
    const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
    if (prot) {
      updateHisSwitchBinary(
        prot,
        this.roiEnergy?.energyL1His ?? 0,
        this.roiEnergy?.energyL2His ?? 0,
      );
      updateProteinResponses(
        this.proteins,
        this.particles,
        this.pH,
        this.params,
      );
      this.hisTheta = prot.hisProtonation;

      const re = this.roiEnergy!;
      // True nearest across all active classes (fixes L1-id preference bug)
      const near = this.nearestLigandToRoi(prot);
      const nL1 = re.nearestL1Nm > 0 ? re.nearestL1Nm : Infinity;
      const nL2 = re.nearestL2Nm > 0 ? re.nearestL2Nm : Infinity;
      const nL3 = re.nearestL3Nm > 0 ? re.nearestL3Nm : Infinity;
      const nL4 = re.nearestL4Nm > 0 ? re.nearestL4Nm : Infinity;
      const nearestOverall = near
        ? near.distNm
        : Math.min(nL1, nL2, nL3, nL4);
      stepMinDistNm =
        Number.isFinite(nearestOverall) && nearestOverall < 1e6
          ? nearestOverall
          : -1;
      // Feed both channels so min(L1,L2) equals overall min
      const track = updateBehaviorTracking({
        stats: this.behaviorStats,
        pending: this.pendingApproach,
        pendingSwitch: this.pendingSwitch,
        pendingProximity: this.pendingProximity,
        prevSwitchOn: this.behaviorPrevSwitch,
        switchOn: prot.switchDisplayOn,
        theta: prot.hisProtonation,
        nearestL1Nm: nearestOverall,
        nearestL2Nm: nearestOverall,
        nearestParticleId: near?.id ?? -1,
        timeNs: this.timeNs,
        justClamped: false,
      });
      this.pendingApproach = track.pending;
      this.pendingSwitch = track.pendingSwitch;
      this.pendingProximity = track.pendingProximity;
      this.behaviorPrevSwitch = track.prevSwitchOn;
      stepProxAccepted = track.justAcceptedProximity;

      if (track.justAcceptedProximity && this.respawnOnBinding) {
        this.respawnLigandAfterProximity(
          track.acceptedProximityParticleId,
          track.acceptedProximityDistNm,
        );
      }

      if (this.lastRespawnFlash && this.lastRespawnFlash.ticksLeft > 0) {
        this.lastRespawnFlash = {
          ...this.lastRespawnFlash,
          ticksLeft: this.lastRespawnFlash.ticksLeft - 1,
        };
        if (this.lastRespawnFlash.ticksLeft <= 0) this.lastRespawnFlash = null;
      }

      // hysteresis sample
      if (this.hystHistory.length >= HYST_HISTORY_MAX) this.hystHistory.shift();
      this.hystHistory.push({
        pH: this.pH,
        score: prot.continuousScore,
        protonation: prot.hisProtonation,
        switchOn: prot.switchDisplayOn,
        tNs: this.timeNs,
        direction: this.lastPhDirection,
      });
      if (this.lastSwitchOn != null && this.lastSwitchOn !== prot.switchDisplayOn) {
        const ev: CrossingEvent = {
          kind: prot.switchDisplayOn ? "on" : "off",
          pH: this.pH,
          score: prot.continuousScore,
          tNs: this.timeNs,
        };
        this.lastCrossing = ev;
        this.crossings.push(ev);
      }
      this.lastSwitchOn = prot.switchDisplayOn;
    }

    if (this.eventRecording) {
      const hhNow = this.behaviorStats.hhBinaryEvents;
      const hhFlag: 0 | 1 = hhNow > this._hhEventsAtRecord ? 1 : 0;
      if (hhFlag) this._hhEventsAtRecord = hhNow;
      const pFlag: 0 | 1 = stepProxAccepted ? 1 : 0;
      if (pFlag) this._proxEventsAtRecord = this.behaviorStats.proximityEvents;
      const frame = this.captureEventFrame({
        proxFlag: pFlag,
        hhFlag,
        minDistNm: stepMinDistNm,
      });
      if (this.eventCapMode === "ring" && this.eventLog.length >= this.eventCap) {
        this.eventLog.shift();
        for (let i = 0; i < this.eventLog.length; i++) {
          this.eventLog[i]!.frameIndex = i;
        }
        frame.frameIndex = this.eventLog.length;
      }
      this.eventLog.push(frame);
      this.eventScrub = this.eventLog.length - 1;
      if (
        this.eventCapMode === "stop" &&
        this.eventLog.length >= this.eventCap
      ) {
        this.eventRecording = false;
        this.clampCapturing = false;
      }
    }

    // trajectory ring
    this.trajectory.push(this.recordFrame());
    if (this.trajectory.length > MAX_TRAJECTORY_FRAMES) this.trajectory.shift();

    if (this.scenarioBanner && this.scenarioBanner.ticksLeft > 0) {
      this.scenarioBanner = {
        ...this.scenarioBanner,
        ticksLeft: this.scenarioBanner.ticksLeft - 1,
        switchOn: prot?.switchDisplayOn ?? false,
      };
    }

    this.stepsSinceUi++;
    if (this.showField && this.stepsSinceUi % 8 === 0) this.recomputeField();
    this.emit();
  }
}


export const simEngine = new SimEngine();

// Expose for diagnostics / Playwright
if (typeof window !== "undefined") {
  (window as unknown as { __simEngine: SimEngine }).__simEngine = simEngine;
}
