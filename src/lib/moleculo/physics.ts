/**
 * Species catalogue, charges, Debye, overdamped Langevin + Yukawa forces.
 * Locked continuum kernel: coulombK=1.15, λ_D=0.8 nm, cutoff=3.2 nm (when validity-locked).
 */
import type {
  MetalMode,
  MoleculeSpecies,
  Particle,
  PeptideVariant,
  PhRegime,
  ProteinProxyState,
  SimParams,
} from "./types";
import { resolveHeavyMetal } from "./types";

import {
  yukawaForceMag,
  sceneToNm,
  nmToScene,
} from "./energy-kernel";
import { hisSiteForces } from "./proteins";

export const SPECIES: MoleculeSpecies[] = [
  {
    id: "pb-ion",
    label: "Pb²⁺",
    kind: "pb",
    ligandClass: "ligand1",
    radius: 0.055,
    friction: 0.95,
    fixedCharge: 2,
    groups: [],
    beads: 1,
    beadSpacing: 0,
    accent: "#3a3a42",
    accentRgb: [0.22, 0.22, 0.26],
  },
  {
    id: "cu-ion",
    label: "Cu²⁺",
    kind: "cu",
    ligandClass: "ligand1",
    radius: 0.052,
    friction: 0.92,
    fixedCharge: 2,
    groups: [],
    beads: 1,
    beadSpacing: 0,
    // Copper continuum accent (not coordination chemistry)
    accent: "#b87333",
    accentRgb: [0.72, 0.45, 0.2],
  },
  {
    id: "ksrrrar-peptide",
    label: "KSRRRAR",
    kind: "peptide",
    ligandClass: "ligand2",
    radius: 0.068,
    friction: 1.42,
    fixedCharge: 0,
    groups: [
      { name: "Lys-K1", pKa: 10.5, kind: "base", magnitude: 1 },
      { name: "Arg-R3", pKa: 12.5, kind: "base", magnitude: 1 },
      { name: "Arg-R4", pKa: 12.5, kind: "base", magnitude: 1 },
      { name: "Arg-R5", pKa: 12.5, kind: "base", magnitude: 1 },
      { name: "Arg-R7", pKa: 12.5, kind: "base", magnitude: 1 },
    ],
    beads: 7,
    beadSpacing: 0.088,
    sequence: "KSRRRAR",
  },
  {
    id: "prarr-peptide",
    label: "PRARR",
    kind: "peptide",
    ligandClass: "ligand2",
    radius: 0.065,
    friction: 1.25,
    fixedCharge: 0,
    groups: [
      { name: "Arg-R2", pKa: 12.5, kind: "base", magnitude: 1 },
      { name: "Arg-R3", pKa: 12.5, kind: "base", magnitude: 1 },
      { name: "Arg-R4", pKa: 12.5, kind: "base", magnitude: 1 },
    ],
    beads: 5,
    beadSpacing: 0.085,
    sequence: "PRARR",
  },
  {
    id: "sllrst-peptide",
    label: "SLLRST",
    kind: "peptide",
    ligandClass: "ligand2",
    radius: 0.062,
    friction: 1.2,
    fixedCharge: 0,
    groups: [
      // S–L–L–R–S–T: single Arg · continuum CoV-1-analogous non-polybasic stretch proxy
      { name: "Arg-R4", pKa: 12.5, kind: "base", magnitude: 1 },
    ],
    beads: 6,
    beadSpacing: 0.082,
    sequence: "SLLRST",
  },
  {
    id: "his5-eaf",
    label: "L3-polyHis",
    kind: "his5",
    ligandClass: "ligand3",
    radius: 0.062,
    friction: 1.3,
    fixedCharge: 0,
    groups: [
      { name: "His1", pKa: 6.2, kind: "base", magnitude: 1 },
      { name: "His2", pKa: 6.2, kind: "base", magnitude: 1 },
      { name: "His3", pKa: 6.2, kind: "base", magnitude: 1 },
      { name: "His4", pKa: 6.2, kind: "base", magnitude: 1 },
      { name: "His5", pKa: 6.2, kind: "base", magnitude: 1 },
    ],
    beads: 5,
    beadSpacing: 0.08,
    sequence: "HHHHH",
  },
  {
    id: "acetylcholine",
    label: "L4-int",
    kind: "ach",
    ligandClass: "ligand4",
    radius: 0.048,
    friction: 0.85,
    fixedCharge: 1,
    groups: [],
    beads: 1,
    beadSpacing: 0,
    accent: "#22d3ee",
    accentRgb: [0.13, 0.83, 0.93],
  },
];

export function speciesMap(): Map<string, MoleculeSpecies> {
  return new Map(SPECIES.map((s) => [s.id, s]));
}

export function metalPool(mode: MetalMode = "pb"): MoleculeSpecies[] {
  const r = resolveHeavyMetal(mode);
  if (r === "off") return [];
  if (r === "cu") return SPECIES.filter((s) => s.id === "cu-ion");
  return SPECIES.filter((s) => s.id === "pb-ion");
}

export function peptideSpecies(): MoleculeSpecies | undefined {
  return SPECIES.find((s) => s.id === "ksrrrar-peptide");
}

/** L1 heavy-metal species for current mode (undefined when off). */
export function ligand1Species(
  mode: MetalMode = "pb",
): MoleculeSpecies | undefined {
  const r = resolveHeavyMetal(mode);
  if (r === "off") return undefined;
  if (r === "cu") return SPECIES.find((s) => s.id === "cu-ion");
  return SPECIES.find((s) => s.id === "pb-ion");
}

export function ligand2Species(
  variant: "ksrrrar" | "prarr" | "sllrst" = "ksrrrar",
): MoleculeSpecies | undefined {
  const id =
    variant === "prarr"
      ? "prarr-peptide"
      : variant === "sllrst"
        ? "sllrst-peptide"
        : "ksrrrar-peptide";
  return SPECIES.find((s) => s.id === id);
}

export function ligand3Species(): MoleculeSpecies | undefined {
  return SPECIES.find((s) => s.id === "his5-eaf");
}

export function ligand4Species(): MoleculeSpecies | undefined {
  return SPECIES.find((s) => s.id === "acetylcholine");
}

export function peptideByBaseline(baselineId: string): MoleculeSpecies {
  if (baselineId.includes("SLLRST")) {
    return SPECIES.find((s) => s.id === "sllrst-peptide")!;
  }
  if (baselineId.includes("PRARR")) {
    return SPECIES.find((s) => s.id === "prarr-peptide")!;
  }
  return SPECIES.find((s) => s.id === "ksrrrar-peptide")!;
}

export function peptideVariantLabel(v: PeptideVariant): string {
  if (v === "prarr") return "PRARR";
  if (v === "sllrst") return "SLLRST";
  if (v === "ksrrrar") return "KSRRRAR";
  return "off";
}

export function peptideVariantNominalCharge(v: PeptideVariant): number {
  if (v === "ksrrrar") return 5;
  if (v === "prarr") return 3;
  if (v === "sllrst") return 1;
  return 0;
}

export function makeSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Henderson–Hasselbalch charge for ionizable groups on a species. */
export function effectiveCharge(sp: MoleculeSpecies, pH: number): number {
  if (sp.groups.length === 0) return sp.fixedCharge;
  let q = sp.fixedCharge;
  for (const g of sp.groups) {
    if (g.kind === "base") {
      // fraction protonated = 1 / (1 + 10^(pH - pKa))
      const theta = 1 / (1 + Math.pow(10, pH - g.pKa));
      q += g.magnitude * theta;
    } else {
      // acid: deprotonated fraction
      const deprot = 1 / (1 + Math.pow(10, g.pKa - pH));
      q -= g.magnitude * deprot;
    }
  }
  return q;
}

export function debyeFromPH(pH: number): {
  debyeNm: number;
  debyeScene: number;
  regime: PhRegime;
} {
  // Mild pH dependence around physiological λ_D ≈ 0.8 nm (not used under validity lock)
  let debyeNm = 0.8;
  let regime: PhRegime = "physiological";
  if (pH < 6.0) {
    debyeNm = 0.72;
    regime = "pathological";
  } else if (pH < 6.8) {
    debyeNm = 0.76;
    regime = "stress";
  } else if (pH > 8.5) {
    debyeNm = 0.85;
    regime = "basic";
  } else {
    regime = "physiological";
  }
  return { debyeNm, debyeScene: debyeNm, regime };
}

export const REGIME_META: Record<
  PhRegime,
  { label: string; range: string; short: string }
> = {
  physiological: {
    label: "Physiological",
    range: "pH ~7.2–7.6",
    short: "phys",
  },
  stress: { label: "Stress / Acidosis", range: "pH ~6.0–6.8", short: "stress" },
  pathological: {
    label: "Pathological",
    range: "pH ≤ 5.5 or ≥ 9",
    short: "path",
  },
  basic: { label: "Basic", range: "pH > 8.5", short: "basic" },
};

export function buildSimParams(
  pH: number,
  overrides: Partial<SimParams> = {},
): SimParams {
  const d = debyeFromPH(pH);
  const debyeNm = overrides.debyeNm ?? d.debyeNm;
  const base: SimParams = {
    pH,
    regime: overrides.regime ?? d.regime,
    coulombK: overrides.coulombK ?? 1.15,
    debyeNm,
    debyeLength: overrides.debyeLength ?? debyeNm,
    forceCutoffNm: overrides.forceCutoffNm ?? 4 * debyeNm,
    forceCutoffScene: overrides.forceCutoffScene ?? 4 * debyeNm,
    frictionScale: overrides.frictionScale ?? 1.35,
    noiseScale: overrides.noiseScale ?? 0.45,
    dt: overrides.dt ?? 0.012,
    kT: overrides.kT ?? 1.0,
    metalHisPrefFactor: overrides.metalHisPrefFactor ?? 1.8,
    metalHisPrefEnabled: overrides.metalHisPrefEnabled ?? false,
    shortRangeWellEnabled: overrides.shortRangeWellEnabled ?? false,
    shortRangeWellDepthKt: overrides.shortRangeWellDepthKt ?? 3,
    shortRangeWellSigmaNm: overrides.shortRangeWellSigmaNm ?? 0.4,
    shortRangeWellCutoffNm: overrides.shortRangeWellCutoffNm ?? 0.8,
    fCap: overrides.fCap ?? 16.2,
  };
  return { ...base, ...overrides, pH, debyeNm: overrides.debyeNm ?? base.debyeNm };
}

export function wallForce(
  x: number,
  y: number,
  z: number,
  softR = 0.35,
): [number, number, number] {
  // Soft radial confinement toward origin sphere
  const r = Math.hypot(x, y, z);
  const R = 3.2;
  if (r < R - softR) return [0, 0, 0];
  const over = r - (R - softR);
  const s = -0.08 * over;
  const inv = 1 / (r + 1e-9);
  return [s * x * inv, s * y * inv, s * z * inv];
}

export function fieldAt(
  x: number,
  y: number,
  z: number,
  particles: Particle[],
  params: SimParams,
  proteins?: ProteinProxyState[],
): { ex: number; ey: number; ez: number; potential: number } {
  const k = params.coulombK;
  const lambda = Math.max(params.debyeNm || sceneToNm(params.debyeLength), 1e-9);
  const cutoff = params.forceCutoffNm || 4 * lambda;
  let ex = 0,
    ey = 0,
    ez = 0,
    potential = 0;
  for (const p of particles) {
    const dx = x - p.x;
    const dy = y - p.y;
    const dz = z - p.z;
    const r = Math.hypot(dx, dy, dz);
    const rNm = sceneToNm(r);
    if (rNm < 1e-6 || rNm > cutoff) continue;
    const invL = 1 / lambda;
    const screening = Math.exp(-rNm * invL);
    const u = (k * p.q * screening) / rNm;
    potential += u;
    const fMag = k * p.q * screening * (1 / (rNm * rNm) + invL / rNm);
    const invR = 1 / r;
    ex += fMag * dx * invR;
    ey += fMag * dy * invR;
    ez += fMag * dz * invR;
  }
  void proteins;
  return { ex, ey, ez, potential };
}

/** Pairwise particle–particle Yukawa into force buffers. */
export function computeForces(
  particles: Particle[],
  params: SimParams,
  fx: Float32Array,
  fy: Float32Array,
  fz: Float32Array,
): void {
  const n = particles.length;
  const k = params.coulombK;
  const lambda = Math.max(params.debyeNm || sceneToNm(params.debyeLength), 1e-9);
  const cutoffScene = params.forceCutoffScene || nmToScene(params.forceCutoffNm || 3.2);
  const fCap = params.fCap ?? 16.2;
  for (let i = 0; i < n; i++) {
    fx[i] = 0;
    fy[i] = 0;
    fz[i] = 0;
  }
  for (let i = 0; i < n; i++) {
    const a = particles[i]!;
    for (let j = i + 1; j < n; j++) {
      const b = particles[j]!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const r = Math.hypot(dx, dy, dz);
      if (r < 1e-6 || r > cutoffScene) continue;
      const fMag = yukawaForceMag(a.q, b.q, r, k, lambda);
      // same sign → repulsion: force on a along +r_hat from b
      const sign = a.q * b.q >= 0 ? 1 : -1;
      // yukawaForceMag is |F|; direction: F_a = sign * |F| * r_hat where r = a-b
      // For Coulomb, F_a = k qi qj r_hat / r^2 with r_hat from b to a when qi qj > 0 (repel)
      const invR = 1 / r;
      const s = (a.q * b.q >= 0 ? 1 : -1) * fMag * invR;
      // Actually: force magnitude is always positive; direction = sign(qi*qj) * (a-b)
      const coef = Math.sign(a.q * b.q || 1) * fMag * invR;
      fx[i]! += coef * dx;
      fy[i]! += coef * dy;
      fz[i]! += coef * dz;
      fx[j]! -= coef * dx;
      fy[j]! -= coef * dy;
      fz[j]! -= coef * dz;
      void sign;
    }
  }
  // clip
  for (let i = 0; i < n; i++) {
    const m = Math.hypot(fx[i]!, fy[i]!, fz[i]!);
    if (m > fCap) {
      const s = fCap / m;
      fx[i]! *= s;
      fy[i]! *= s;
      fz[i]! *= s;
    }
  }
}

export function stepOverdamped(
  particles: Particle[],
  species: Map<string, MoleculeSpecies>,
  params: SimParams,
  fx: Float32Array,
  fy: Float32Array,
  fz: Float32Array,
  proteins: ProteinProxyState[],
  rng: () => number,
): void {
  const n = particles.length;
  computeForces(particles, params, fx, fy, fz);
  hisSiteForces(particles, proteins, params, fx, fy, fz);

  const fCap = params.fCap ?? 16.2;
  const dt = params.dt ?? 0.012;
  const kT = params.kT ?? 1.0;
  const frictionScale = params.frictionScale ?? 1.35;
  const noiseScale = params.noiseScale ?? 0.45;

  for (let i = 0; i < n; i++) {
    const m = Math.hypot(fx[i]!, fy[i]!, fz[i]!);
    if (m > fCap) {
      const s = fCap / m;
      fx[i]! *= s;
      fy[i]! *= s;
      fz[i]! *= s;
    }
    const p = particles[i]!;
    const sp = species.get(p.speciesId);
    const friction = (sp?.friction ?? 1.0) * frictionScale;
    const invF = 1 / Math.max(friction, 1e-6);
    // Gaussian-ish noise via Box-Muller lite
    const n1 = rng() * 2 - 1;
    const n2 = rng() * 2 - 1;
    const n3 = rng() * 2 - 1;
    const amp = noiseScale * Math.sqrt(2 * kT * invF * dt);
    p.x += fx[i]! * invF * dt + n1 * amp;
    p.y += fy[i]! * invF * dt + n2 * amp;
    p.z += fz[i]! * invF * dt + n3 * amp;
  }
}

export function spawnParticles(
  count: number,
  pH: number,
  metalMode: MetalMode = "pb",
  seed = 1,
  ligand2Count = 0,
  peptideVariant: PeptideVariant = "ksrrrar",
  ligand3Count = 0,
  ligand4Count = 0,
): Particle[] {
  const l1Sp = count > 0 ? ligand1Species(metalMode) : undefined;
  const l2Sp =
    ligand2Count > 0 && peptideVariant !== "off"
      ? ligand2Species(
          peptideVariant === "prarr"
            ? "prarr"
            : peptideVariant === "sllrst"
              ? "sllrst"
              : "ksrrrar",
        )
      : undefined;
  const l3Sp = ligand3Count > 0 ? ligand3Species() : undefined;
  const l4Sp = ligand4Count > 0 ? ligand4Species() : undefined;
  const out: Particle[] = [];
  const rand = makeSeededRng(seed);

  const pushOne = (
    sp: MoleculeSpecies,
    id: number,
    x: number,
    y: number,
    z: number,
  ) => {
    let ox = rand() * 2 - 1;
    let oy = rand() * 2 - 1;
    let oz = rand() * 2 - 1;
    const on = Math.sqrt(ox * ox + oy * oy + oz * oz) + 1e-9;
    const qDesign =
      sp.id === "pb-ion" || sp.id === "cu-ion"
        ? 2
        : sp.id === "acetylcholine"
          ? 1
          : sp.id === "prarr-peptide"
            ? 3
            : sp.id === "sllrst-peptide"
              ? 1
              : sp.id === "his5-eaf"
                ? 5
                : 5;
    out.push({
      id,
      speciesId: sp.id,
      kind: sp.kind,
      ligandClass: sp.ligandClass,
      x,
      y,
      z,
      ox: ox / on,
      oy: oy / on,
      oz: oz / on,
      q: effectiveCharge(sp, pH),
      qDesign,
    });
  };

  let id = 0;
  const place = (
    sp: MoleculeSpecies | undefined,
    n: number,
    r0: number,
    r1: number,
  ) => {
    if (!sp || n <= 0) return;
    for (let i = 0; i < n; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = r0 + rand() * (r1 - r0);
      pushOne(
        sp,
        id++,
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r * 0.55,
        Math.cos(phi) * r,
      );
    }
  };

  // Preserve remainder of spawnParticles from original - need to read rest of original file
  place(l1Sp, count, 0.8, 2.6);
  place(l2Sp, ligand2Count, 0.7, 2.5);
  place(l3Sp, ligand3Count, 0.9, 2.4);
  place(l4Sp, ligand4Count, 0.85, 2.5);
  return out;
}
