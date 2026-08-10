/**
 * Quantitative behavior counters + scientific snapshot helpers.
 * Classical continuum only (Yukawa / Debye–Hückel / Henderson–Hasselbalch).
 * Receptor: furin catalytic triad · His194 ROI.
 */

import type { RoiEnergySnapshot } from "./energy";
import { sceneToNm } from "./energy-kernel";
import type { LigandBaselineMode, SimParams } from "./types";
import { PUBLICATION_DISCLAIMER } from "./types";
import { FRAME_NS } from "./types";

/** Proximity event threshold (nm). */
export const PROXIMITY_EVENT_NM = 1.0;
/** Frames of hold required to accept either event class. */
export const EVENT_CONFIRM_FRAMES = 3;

const MAX_SAMPLES = 256;

export type BehaviorStats = {
  /** HH-binary events: θ ≥ 0.5 held ≥ 3 frames (noise-filtered edge). */
  switchEvents: number;
  /** Alias / primary HH-binary counter */
  hhBinaryEvents: number;
  /** Proximity events: min peptide–His194 < 1.0 nm held ≥ 3 frames */
  proximityEvents: number;
  clampEvents: number;
  /** Min peptide–His194 distance (nm) at proximity-event confirmation */
  triggerDistancesNm: number[];
  /** Min peptide–His194 distance (nm) at accepted HH-binary confirmation */
  hhTriggerDistancesNm: number[];
  /** Kept empty — response time is threshold-limited and not reported. */
  responseTimesNs: number[];
};

export type PendingApproach = {
  distNm: number;
  tNs: number;
  ligandKind: "pb" | "peptide" | "unknown";
};

/** HH-binary candidate: θ ≥ 0.5 held for N frames. */
export type PendingSwitchEvent = {
  toOn: boolean;
  distNm: number;
  tNs: number;
  stableFrames: number;
};

/** Proximity candidate: dist < 1 nm held for N frames. */
export type PendingProximityEvent = {
  distNm: number;
  tNs: number;
  stableFrames: number;
  counted: boolean;
  /** Particle id nearest while pending (for optional respawn). */
  particleId: number | null;
};

export type ScientificSnapshot = {
  schema:
    | "moleculosphere5d.scientific_snapshot.v1"
    | "moleculosphere5d.scientific_snapshot.v1.1";
  exportedAt: string;
  workflow?: {
    label: string;
    note: string;
    bcdt: boolean;
  };
  receptor: {
    label: string;
    triad: "Asp153–His194–Ser368";
    site: "His194";
    roi: "His194";
  };
  behavior: {
    switchEvents: number;
    hhBinaryEvents: number;
    proximityEvents: number;
    clampEvents: number;
    meanTriggerDistanceNm: number | null;
    medianTriggerDistanceNm: number | null;
    meanResponseTimeNs: null;
    medianResponseTimeNs: null;
    meanResponseTimeFrames: null;
    nTriggerSamples: number;
    nResponseSamples: number;
    triggerDistancesNm?: number[];
    responseTimesNs?: number[];
    eventRules?: string;
  };
  electrostatics: {
    debyeNm: number;
    debyeScene: number;
    debyeOverride: boolean;
    coulombK: number;
    pH: number;
    regime: string;
    charges: {
      pb: number;
      peptideNominal: number;
      asp153: number;
      his194: number;
      his194Protonation: number;
    };
    metalHisPrefEnabled: boolean;
    metalHisPrefFactor: number;
    shortRangeWellEnabled: boolean;
    shortRangeWellDepthKt: number;
    energies: {
      U_L1_His: number;
      U_L2_His: number;
      U_L1_L2: number;
      U_tot: number;
      forceMagL1His: number;
      forceMagL2His: number;
      forceMagL1L2: number;
    } | null;
  };
  hendersonHasselbalch: {
    pKa: number;
    pH: number;
    theta: number;
    qHis: number;
    binaryOn: boolean;
    note: string;
  };
  scenario: {
    activeScenario: string | null;
    ligandBaseline: LigandBaselineMode;
    metalMode?: string;
    ligand2Enabled?: boolean;
    ligand2Count?: number;
    ligand2ChargeScale?: number;
    moleculeCount: number;
    displayDurationSec?: number;
    respawnOnBinding?: boolean;
  };
  /** Alias used by older applyScientificSnapshot callers */
  conditions?: ScientificSnapshot["scenario"];
  trajectorySummary?: {
    eventLogLen: number;
    timeNs: number;
  } | null;
  eventSeries?: {
    tNs: number;
    eL1: number;
    eL2: number;
    eL12: number;
    eTot: number;
    on: boolean;
  }[];
};

export function emptyBehaviorStats(): BehaviorStats {
  return {
    switchEvents: 0,
    hhBinaryEvents: 0,
    proximityEvents: 0,
    clampEvents: 0,
    triggerDistancesNm: [],
    hhTriggerDistancesNm: [],
    responseTimesNs: [],
  };
}

export function mean(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

export function pushSample(arr: number[], v: number) {
  arr.push(v);
  if (arr.length > MAX_SAMPLES) arr.shift();
}

/**
 * Dual independent event definitions (His194):
 *
 * 1) Proximity — min ligand–His194 distance < PROXIMITY_EVENT_NM (1.0 nm)
 *    held ≥ EVENT_CONFIRM_FRAMES (3). Edge-triggered once per visit.
 *
 * 2) HH-binary — θ ≥ 0.5 held ≥ 3 frames after a polarity edge.
 *
 * No response-time metric (threshold-limited).
 */
export function updateBehaviorTracking(args: {
  stats: BehaviorStats;
  pending: PendingApproach | null;
  pendingSwitch: PendingSwitchEvent | null;
  pendingProximity: PendingProximityEvent | null;
  prevSwitchOn: boolean | null;
  switchOn: boolean;
  theta: number;
  nearestL1Nm: number;
  nearestL2Nm: number;
  /** Id of currently nearest peptide (any present class); -1 if none. */
  nearestParticleId?: number;
  timeNs: number;
  justClamped: boolean;
}): {
  pending: PendingApproach | null;
  pendingSwitch: PendingSwitchEvent | null;
  pendingProximity: PendingProximityEvent | null;
  prevSwitchOn: boolean;
  justAcceptedProximity: boolean;
  acceptedProximityParticleId: number | null;
  acceptedProximityDistNm: number | null;
} {
  const { stats, nearestL1Nm, nearestL2Nm, timeNs, switchOn, justClamped } =
    args;
  const nearestParticleId =
    args.nearestParticleId != null && args.nearestParticleId >= 0
      ? args.nearestParticleId
      : null;
  let pending = args.pending;
  let pendingSwitch = args.pendingSwitch;
  let pendingProximity = args.pendingProximity;
  let prevSwitchOn = args.prevSwitchOn;
  let justAcceptedProximity = false;
  let acceptedProximityParticleId: number | null = null;
  let acceptedProximityDistNm: number | null = null;

  const nL1 =
    Number.isFinite(nearestL1Nm) && nearestL1Nm > 0 ? nearestL1Nm : Infinity;
  const nL2 =
    Number.isFinite(nearestL2Nm) && nearestL2Nm > 0 ? nearestL2Nm : Infinity;
  const nearest = Math.min(nL1, nL2);

  // —— 1) Proximity event: dist < 1.0 nm hold ≥ 3 frames ——
  // Edge-triggered per visit. A visit is keyed by particleId: if the nearest
  // ligand changes (e.g. after respawn), start a fresh confirmation window.
  if (nearest < PROXIMITY_EVENT_NM) {
    const sameParticle =
      pendingProximity != null &&
      nearestParticleId != null &&
      pendingProximity.particleId === nearestParticleId;
    if (!pendingProximity || !sameParticle) {
      pendingProximity = {
        distNm: nearest,
        tNs: timeNs,
        stableFrames: 1,
        counted: false,
        particleId: nearestParticleId,
      };
    } else {
      pendingProximity = {
        ...pendingProximity,
        stableFrames: pendingProximity.stableFrames + 1,
        distNm: Math.min(pendingProximity.distNm, nearest),
        particleId: nearestParticleId ?? pendingProximity.particleId ?? null,
      };
      if (
        !pendingProximity.counted &&
        pendingProximity.stableFrames >= EVENT_CONFIRM_FRAMES
      ) {
        stats.proximityEvents += 1;
        if (Number.isFinite(pendingProximity.distNm)) {
          pushSample(stats.triggerDistancesNm, pendingProximity.distNm);
        }
        justAcceptedProximity = true;
        acceptedProximityParticleId = pendingProximity.particleId;
        acceptedProximityDistNm = pendingProximity.distNm;
        pendingProximity = { ...pendingProximity, counted: true };
      }
    }
  } else {
    pendingProximity = null;
  }

  // —— 2) HH-binary: state change with ≥ 3-frame confirmation ——
  if (prevSwitchOn != null && prevSwitchOn !== switchOn) {
    pendingSwitch = {
      toOn: switchOn,
      distNm: Number.isFinite(nearest) ? nearest : Infinity,
      tNs: timeNs,
      stableFrames: 1,
    };
  } else if (pendingSwitch) {
    if (switchOn === pendingSwitch.toOn) {
      pendingSwitch = {
        ...pendingSwitch,
        stableFrames: pendingSwitch.stableFrames + 1,
      };
      if (pendingSwitch.stableFrames >= EVENT_CONFIRM_FRAMES) {
        stats.switchEvents += 1;
        stats.hhBinaryEvents += 1;
        if (
          Number.isFinite(pendingSwitch.distNm) &&
          pendingSwitch.distNm > 0 &&
          pendingSwitch.distNm < 1e6
        ) {
          pushSample(stats.hhTriggerDistancesNm, pendingSwitch.distNm);
        }
        pendingSwitch = null;
      }
    } else {
      pendingSwitch = null;
    }
  }

  prevSwitchOn = switchOn;
  void justClamped;
  void args.theta;

  return {
    pending,
    pendingSwitch,
    pendingProximity,
    prevSwitchOn: prevSwitchOn ?? switchOn,
    justAcceptedProximity,
    acceptedProximityParticleId,
    acceptedProximityDistNm,
  };
}


export function buildScientificSnapshot(args: {
  stats: BehaviorStats;
  params: SimParams;
  debyeOverride: boolean;
  hisPka: number;
  pH: number;
  theta: number;
  hisCharge: number;
  binaryOn: boolean;
  pbCharge: number;
  peptideCharge: number;
  roi: RoiEnergySnapshot | null;
  ligandBaseline: LigandBaselineMode;
  timeNs: number;
  scenarioId: string | null;
  ligand2Enabled?: boolean;
  ligand2Count?: number;
  ligand2ChargeScale?: number;
  moleculeCount: number;
  displayDurationSec?: number;
  respawnOnBinding?: boolean;
  metalHisPrefEnabled?: boolean;
  metalHisPrefFactor?: number;
  shortRangeWellEnabled?: boolean;
  shortRangeWellDepthKt?: number;
  trajectorySummary?: {
    frameCount: number;
    tStartNs: number | null;
    tEndNs: number | null;
    particleCount: number;
  };
  eventSeries?: {
    tNs: number;
    eL1: number;
    eL2: number;
    eL12: number;
    eTot: number;
    on: boolean;
  }[];
}): ScientificSnapshot & {
  eventSeries?: {
    tNs: number;
    eL1: number;
    eL2: number;
    eL12: number;
    eTot: number;
    on: boolean;
  }[];
} {
  const behavior = args.stats;
  const params = args.params;
  const trig = behavior.triggerDistancesNm;
  const snap: ScientificSnapshot & {
    eventSeries?: typeof args.eventSeries;
  } = {
    schema: "moleculosphere5d.scientific_snapshot.v1.1",
    exportedAt: new Date().toISOString(),
    workflow: {
      label: "BCDT open-tool scientific snapshot",
      note: PUBLICATION_DISCLAIMER,
      bcdt: true,
    },
    receptor: {
      label: "Furin catalytic triad continuum proxy",
      triad: "Asp153–His194–Ser368",
      site: "His194",
      roi: "His194",
    },
    behavior: {
      switchEvents: behavior.switchEvents,
      hhBinaryEvents: behavior.hhBinaryEvents ?? behavior.switchEvents,
      proximityEvents: behavior.proximityEvents,
      clampEvents: behavior.clampEvents,
      meanTriggerDistanceNm: trig.length ? mean(trig) : null,
      medianTriggerDistanceNm: trig.length ? median(trig) : null,
      meanResponseTimeNs: null,
      medianResponseTimeNs: null,
      meanResponseTimeFrames: null,
      nTriggerSamples: trig.length,
      nResponseSamples: 0,
      triggerDistancesNm: [...trig],
      responseTimesNs: [],
      eventRules:
        "Proximity: min d < 1.0 nm hold ≥ 3 frames. HH-binary: θ≥0.5 edge hold ≥ 3 frames. No response-time metric.",
    },
    electrostatics: {
      debyeNm: params.debyeNm,
      debyeScene: params.debyeLength,
      debyeOverride: args.debyeOverride,
      coulombK: params.coulombK,
      pH: args.pH,
      regime: params.regime,
      charges: {
        pb: args.pbCharge,
        peptideNominal: args.peptideCharge,
        asp153: -1,
        his194: args.hisCharge,
        his194Protonation: args.theta,
      },
      metalHisPrefEnabled: args.metalHisPrefEnabled ?? params.metalHisPrefEnabled,
      metalHisPrefFactor: args.metalHisPrefFactor ?? params.metalHisPrefFactor,
      shortRangeWellEnabled:
        args.shortRangeWellEnabled ?? params.shortRangeWellEnabled,
      shortRangeWellDepthKt:
        args.shortRangeWellDepthKt ?? params.shortRangeWellDepthKt,
      energies: args.roi
        ? {
            U_L1_His: args.roi.energyL1His,
            U_L2_His: args.roi.energyL2His,
            U_L1_L2: args.roi.energyL1L2,
            U_tot: args.roi.energyTotal,
            forceMagL1His: args.roi.forceMagL1His,
            forceMagL2His: args.roi.forceMagL2His,
            forceMagL1L2: args.roi.forceMagL1L2,
          }
        : null,
    },
    hendersonHasselbalch: {
      pKa: args.hisPka,
      pH: args.pH,
      theta: args.theta,
      qHis: args.hisCharge,
      binaryOn: args.binaryOn,
      note: "Henderson–Hasselbalch describes the continuum protonation equilibrium of the catalytic histidine; no quantum-chemical orbital calculation is performed.",
    },
    scenario: {
      activeScenario: args.scenarioId,
      ligandBaseline: args.ligandBaseline,
      ligand2Enabled: args.ligand2Enabled,
      ligand2Count: args.ligand2Count,
      ligand2ChargeScale: args.ligand2ChargeScale,
      moleculeCount: args.moleculeCount,
      displayDurationSec: args.displayDurationSec,
      respawnOnBinding: args.respawnOnBinding ?? false,
    },
    trajectorySummary: args.trajectorySummary
      ? {
          eventLogLen: args.trajectorySummary.frameCount,
          timeNs: args.timeNs,
        }
      : { eventLogLen: 0, timeNs: args.timeNs },
    eventSeries: args.eventSeries,
  };
  snap.conditions = snap.scenario;
  return snap;
}

export function scientificSnapshotToCsv(snap: ScientificSnapshot): string {
  const rows: string[] = [
    "key,value",
    `exportedAt,${snap.exportedAt}`,
    `proximityEvents,${snap.behavior.proximityEvents}`,
    `hhBinaryEvents,${snap.behavior.hhBinaryEvents}`,
    `meanTriggerDistanceNm,${snap.behavior.meanTriggerDistanceNm ?? ""}`,
    `pH,${snap.electrostatics.pH}`,
    `debyeNm,${snap.electrostatics.debyeNm}`,
    `coulombK,${snap.electrostatics.coulombK}`,
    `theta,${snap.hendersonHasselbalch.theta}`,
    `qHis,${snap.hendersonHasselbalch.qHis}`,
    `binaryOn,${snap.hendersonHasselbalch.binaryOn}`,
    `ligandBaseline,${snap.scenario.ligandBaseline}`,
    `respawnOnBinding,${snap.scenario.respawnOnBinding ?? false}`,
    `U_L1_His,${snap.electrostatics.energies?.U_L1_His ?? ""}`,
    `U_L2_His,${snap.electrostatics.energies?.U_L2_His ?? ""}`,
    `U_tot,${snap.electrostatics.energies?.U_tot ?? ""}`,
  ];
  return rows.join("\n");
}

export function eventSeriesToCsv(
  frames: {
    tNs: number;
    eL1?: number;
    eL2?: number;
    eL12?: number;
    eTot?: number;
    on?: boolean;
    U?: number;
    theta?: number;
  }[],
): string {
  const h = "tNs,U_Pb_His,U_pep_His,U_L1_L2,U_tot,His194_ON";
  const body = frames.map((f) =>
    [
      f.tNs,
      f.eL1 ?? "",
      f.eL2 ?? "",
      f.eL12 ?? "",
      f.eTot ?? f.U ?? "",
      f.on === undefined ? "" : f.on ? 1 : 0,
    ].join(","),
  );
  return [h, ...body].join("\n");
}

export function behaviorSamplesToCsv(stats: BehaviorStats): string {
  const lines = ["kind,value"];
  for (const d of stats.triggerDistancesNm) lines.push(`proximityDistNm,${d}`);
  for (const d of stats.hhTriggerDistancesNm) lines.push(`hhDistNm,${d}`);
  return lines.join("\n");
}

export { sceneToNm, FRAME_NS };
