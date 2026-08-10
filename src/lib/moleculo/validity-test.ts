/**
 * Locked-parameter validity test: exclusive peptide baselines at fixed pH / pH-ramp.
 * Identical settings for Build sandbox and local WSL — comparable scientific tables.
 *
 * Coordinate system: absolute nanometres only (coord scale = 1).
 * Master geometry source: diagnostics/diag_Build_initial_coords_SCALED_nm.json
 * (or equivalent seeded shell placement in nm for other replicates).
 *
 * Receptor: furin catalytic triad continuum proxy (His194 ROI).
 * Baselines (exclusive — never co-present):
 *   Baseline_KSRRRAR_50  · ligand1 · n=50 · nominal +5
 *   Baseline_PRARR_50    · ligand2 · n=50 · nominal +3
 */

import type { LigandBaselineMode } from "./types";

/** Locked physical parameters — must match sandbox and WSL (nm-native). */
export const VALIDITY_LOCKED = {
  debyeNm: 0.8,
  /** Debye in coordinate units (= nm when scale=1). */
  debyeScene: 0.8,
  hisPka: 6.2,
  forceCutoffLambdaMult: 4,
  forceCutoffNm: 3.2,
  /** Cutoff in coordinate units (= nm when scale=1). */
  forceCutoffScene: 3.2,
  shortRangeWellEnabled: false,
  metalHisPrefEnabled: false,
  temperature: 298,
  kT: 1.0,
  coulombK: 1.15,
  frictionScale: 1.35,
  frameNs: 100,
  runFrames: 2500,
  rampFrames: 1500,
  replicates: 10,
  /** Master RNG seed; replicate i uses baseSeed + i·997 (+ offset per baseline). */
  baseSeed: 20260805,
  nMolecules: 50,
  proximityNm: 1.0,
  confirmFrames: 3,
  shellMinNm: 0.55,
  shellMaxNm: 2.8,
  /** Permanent nm-native coordinate scale (no reduced scene units). */
  coordScaleToNm: 1 as const,
  coordsSource: "diagnostics/diag_Build_initial_coords_SCALED_nm.json",
} as const;

export type ValidityBaselineId =
  | "Baseline_KSRRRAR_50"
  | "Baseline_PRARR_50"
  | "Baseline_SLLRST_50";

export type ValidityProtocol =
  | { kind: "fixed-pH"; pH: 7.4 | 6.2 | 5.0; frames: number }
  | { kind: "pH-ramp"; pHStart: 7.4; pHEnd: 5.0; frames: number };

export const VALIDITY_BASELINES: {
  id: ValidityBaselineId;
  label: string;
  sequence: string;
  nominalCharge: number;
  ligandBaseline: LigandBaselineMode;
  description: string;
}[] = [
  {
    id: "Baseline_KSRRRAR_50",
    label: "KSRRRAR ×50",
    sequence: "KSRRRAR",
    nominalCharge: 5,
    ligandBaseline: "ligand1",
    description:
      "Exclusive Ligand-1 baseline: 50× KSRRRAR (K+1, R+1×4 → +5; S,A neutral)",
  },
  {
    id: "Baseline_PRARR_50",
    label: "PRARR ×50",
    sequence: "PRARR",
    nominalCharge: 3,
    ligandBaseline: "ligand2",
    description:
      "Exclusive Ligand-2 baseline: 50× PRARR (R+1×3 → +3; P,A neutral)",
  },
  {
    id: "Baseline_SLLRST_50",
    label: "SLLRST ×50",
    sequence: "SLLRST",
    nominalCharge: 1,
    ligandBaseline: "ligand2",
    description:
      "Exclusive L2 baseline: 50× SLLRST (single Arg → +1; S,L,T neutral). Continuum single-Arg educational proxy.",
  },
];

export const VALIDITY_FIXED_PH: ValidityProtocol[] = [
  { kind: "fixed-pH", pH: 7.4, frames: VALIDITY_LOCKED.runFrames },
  { kind: "fixed-pH", pH: 6.2, frames: VALIDITY_LOCKED.runFrames },
  { kind: "fixed-pH", pH: 5.0, frames: VALIDITY_LOCKED.runFrames },
];

export const VALIDITY_RAMP: ValidityProtocol = {
  kind: "pH-ramp",
  pHStart: 7.4,
  pHEnd: 5.0,
  frames: VALIDITY_LOCKED.rampFrames,
};

export type ValidityReplicateResult = {
  replicate: number;
  seed: number;
  baselineId: ValidityBaselineId;
  protocol: ValidityProtocol;
  proximityEvents: number;
  hhBinaryEvents: number;
  meanProximityDistNm: number | null;
  meanHhDistNm: number | null;
  meanUPepHis: number;
  meanUTot: number;
  finalTheta: number;
  finalQHis: number;
  finalPH?: number;
};

export type ValidityAggregate = {
  baselineId: ValidityBaselineId;
  protocol: ValidityProtocol;
  n: number;
  proximityEvents: { mean: number; sd: number };
  hhBinaryEvents: { mean: number; sd: number };
  meanProximityDistNm: { mean: number; sd: number };
  meanHhDistNm: { mean: number; sd: number };
  meanUPepHis: { mean: number; sd: number };
  meanUTot: { mean: number; sd: number };
  finalTheta: { mean: number; sd: number };
  finalQHis: { mean: number; sd: number };
  replicates: ValidityReplicateResult[];
};

export type ValiditySuiteResult = {
  schema: string;
  exportedAt: string;
  locked: Record<string, unknown>;
  receptor: { label: string; triad: string; roi: string };
  expectation: string;
  ranking: {
    metric: string;
    protocol: string;
    ksrrrarMean: number;
    prarrMean: number;
    confirmed: boolean | null;
    note: string;
  }[];
  aggregates: ValidityAggregate[];
};

export function forceCutoffSceneFromLocked(): number {
  return VALIDITY_LOCKED.forceCutoffScene;
}

export function protocolLabel(protocol: ValidityProtocol): string {
  if (protocol.kind === "fixed-pH") return `fixed-pH_${protocol.pH}`;
  return `pH-ramp_${protocol.pHStart}_to_${protocol.pHEnd}`;
}

export function meanSd(xs: number[]): { mean: number; sd: number } {
  if (!xs.length) return { mean: 0, sd: 0 };
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  if (xs.length < 2) return { mean, sd: 0 };
  const v = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
  return { mean, sd: Math.sqrt(v) };
}

export function aggregateReplicates(
  baselineId: ValidityBaselineId,
  protocol: ValidityProtocol,
  reps: ValidityReplicateResult[],
): ValidityAggregate;
export function aggregateReplicates(
  reps: ValidityReplicateResult[],
): ValidityAggregate | null;
export function aggregateReplicates(
  a: ValidityBaselineId | ValidityReplicateResult[],
  b?: ValidityProtocol,
  c?: ValidityReplicateResult[],
): ValidityAggregate | null {
  let baselineId: ValidityBaselineId;
  let protocol: ValidityProtocol;
  let reps: ValidityReplicateResult[];
  if (Array.isArray(a)) {
    reps = a;
    if (!reps.length) return null;
    baselineId = reps[0]!.baselineId;
    protocol = reps[0]!.protocol;
  } else {
    baselineId = a;
    protocol = b!;
    reps = c!;
  }
  const num = (xs: (number | null | undefined)[]) =>
    meanSd(xs.map((x) => (x == null || !Number.isFinite(x) ? 0 : x)));
  return {
    baselineId,
    protocol,
    n: reps.length,
    proximityEvents: meanSd(reps.map((r) => r.proximityEvents)),
    hhBinaryEvents: meanSd(reps.map((r) => r.hhBinaryEvents)),
    meanProximityDistNm: num(reps.map((r) => r.meanProximityDistNm)),
    meanHhDistNm: num(reps.map((r) => r.meanHhDistNm)),
    meanUPepHis: meanSd(reps.map((r) => r.meanUPepHis)),
    meanUTot: meanSd(reps.map((r) => r.meanUTot)),
    finalTheta: meanSd(reps.map((r) => r.finalTheta)),
    finalQHis: meanSd(reps.map((r) => r.finalQHis)),
    replicates: reps,
  };
}

export function suiteToCsv(suite: ValiditySuiteResult): string {
  const header = [
    "baselineId",
    "protocol",
    "n",
    "proximityEvents_mean",
    "proximityEvents_sd",
    "proximityDistNm_mean",
    "proximityDistNm_sd",
    "hhEvents_mean",
    "hhEvents_sd",
    "hhDistNm_mean",
    "hhDistNm_sd",
    "U_pep_His_mean",
    "U_pep_His_sd",
    "U_tot_mean",
    "U_tot_sd",
    "theta_mean",
    "q_His_mean",
  ].join(",");
  const rows = suite.aggregates.map((a) =>
    [
      a.baselineId,
      protocolLabel(a.protocol),
      a.n,
      a.proximityEvents.mean.toFixed(4),
      a.proximityEvents.sd.toFixed(4),
      a.meanProximityDistNm.mean.toFixed(6),
      a.meanProximityDistNm.sd.toFixed(6),
      a.hhBinaryEvents.mean.toFixed(4),
      a.hhBinaryEvents.sd.toFixed(4),
      a.meanHhDistNm.mean.toFixed(6),
      a.meanHhDistNm.sd.toFixed(6),
      a.meanUPepHis.mean.toFixed(6),
      a.meanUPepHis.sd.toFixed(6),
      a.meanUTot.mean.toFixed(6),
      a.meanUTot.sd.toFixed(6),
      a.finalTheta.mean.toFixed(6),
      a.finalQHis.mean.toFixed(6),
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export function suiteRankingNote(suite: ValiditySuiteResult): string {
  const notes: string[] = [];
  for (const r of suite.ranking) {
    notes.push(
      `${r.protocol} ${r.metric}: KSRRRAR=${r.ksrrrarMean.toFixed(2)} vs PRARR=${r.prarrMean.toFixed(2)} → ${
        r.confirmed == null ? "n/a" : r.confirmed ? "CONFIRMED" : "REFUTED"
      } (${r.note})`,
    );
  }
  return notes.join("; ");
}

/** Short environment-parity diagnostic trajectory (Build ↔ WSL). */
export const DIAG_PARITY = {
  label: "diag_Build",
  baselineId: "Baseline_KSRRRAR_50" as ValidityBaselineId,
  pH: 6.2,
  seed: 20260805,
  frames: 200,
  proximityNm: 1.0,
  csvName: "diag_Build_minDist_seed20260805_pH6.2_200frames.csv",
  coordsName: "diag_Build_initial_coords_SCALED_nm.json",
} as const;

export type DiagFrameRow = {
  frame: number;
  tNs: number;
  minDistNm: number;
  nInside1nm: number;
  U_pep_His: number;
  U_tot: number;
  theta: number;
  q_His: number;
};

export type DiagInitialCoords = {
  schema: "moleculosphere5d.diag_initial_coords.v1";
  environment: "Build" | "WSL";
  seed: number;
  pH: number;
  baselineId: ValidityBaselineId;
  nMolecules: number;
  locked: {
    debyeNm: number;
    forceCutoffNm: number;
    hisPka: number;
    shortRangeWellEnabled: boolean;
    coulombK: number;
    frictionScale: number;
    kT: number;
    frameNs: number;
    shellMinNm: number;
    shellMaxNm: number;
  };
  receptor: {
    label: string;
    roi: "His194";
    hisWorld: { x: number; y: number; z: number };
  };
  placementRule: string;
  particles: {
    id: number;
    speciesId: string;
    ligandClass: string;
    sequence: string;
    q: number;
    x: number;
    y: number;
    z: number;
    ox: number;
    oy: number;
    oz: number;
    distHisNm: number;
  }[];
};

export function diagFramesToCsv(rows: DiagFrameRow[]): string {
  const header =
    "frame,tNs,minDistNm,nInside1nm,U_pep_His,U_tot,theta,q_His";
  const body = rows.map((r) =>
    [
      r.frame,
      r.tNs,
      r.minDistNm.toFixed(8),
      r.nInside1nm,
      r.U_pep_His.toFixed(8),
      r.U_tot.toFixed(8),
      r.theta.toFixed(8),
      r.q_His.toFixed(8),
    ].join(","),
  );
  return [header, ...body].join("\n");
}
