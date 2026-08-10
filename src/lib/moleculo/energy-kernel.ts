/** Shared Yukawa kernels — no imports from proteins/engine (cycle-free). */

/**
 * Scene units → nanometres.
 * Default 4.0 for legacy reduced coordinates.
 * When positions are stored as absolute nm (SCALED_nm file), set to 1.0
 * via setCoordScaleToNm(1) so no extra scale is applied.
 */
export let SCENE_TO_NM = 4.0;

/** Set coordinate→nm scale (1 = positions already in nm). */
export function setCoordScaleToNm(scale: number): void {
  SCENE_TO_NM = scale > 0 ? scale : 1;
}

export function getCoordScaleToNm(): number {
  return SCENE_TO_NM;
}

export function sceneToNm(rScene: number): number {
  return rScene * SCENE_TO_NM;
}

export function nmToScene(nm: number): number {
  return nm / SCENE_TO_NM;
}

/** Short-range window for mild metal–His preferential continuum scale. */
export const METAL_HIS_NEAR_NM = 1.2;

/**
 * Screened Coulomb / Yukawa energy in continuum kT units.
 * U = coulombK · (qi qj / r_nm) · exp(−r_nm / λ_D)
 */
export function yukawaEnergy(
  qi: number,
  qj: number,
  rScene: number,
  k: number,
  lambdaNm: number,
): number {
  const rNm = Math.max(sceneToNm(rScene), 1e-9);
  const lam = Math.max(lambdaNm, 1e-9);
  return (k * qi * qj * Math.exp(-rNm / lam)) / rNm;
}

/**
 * |F| magnitude for Yukawa (scene-unit length).
 * F_nm = k |qi qj| exp(−r/λ) (1/r² + 1/(λ r)); F_scene = F_nm · SCENE_TO_NM.
 */
export function yukawaForceMag(
  qi: number,
  qj: number,
  rScene: number,
  k: number,
  lambdaNm: number,
): number {
  const rNm = Math.max(sceneToNm(rScene), 1e-9);
  const lam = Math.max(lambdaNm, 1e-9);
  const screening = Math.exp(-rNm / lam);
  const fNm =
    k *
    Math.abs(qi * qj) *
    screening *
    (1 / (rNm * rNm) + 1 / (lam * rNm));
  return fNm * SCENE_TO_NM;
}

/**
 * Phenomenological short-range attractive well for divalent metal near
 * deprotonated His. Optional educational term — OFF under validity lock.
 *
 * @param protonation  His θ (0 = deprotonated → well strongest)
 * @param rScene       pairwise distance in scene units
 * @param enabled      master switch
 */
export function shortRangeWellEnergy(
  protonation: number,
  rScene: number,
  depthKt: number,
  sigmaNm: number,
  cutoffNm: number,
  enabled = true,
): number {
  if (!enabled || depthKt <= 0) return 0;
  const deprot = 1 - Math.min(1, Math.max(0, protonation));
  if (deprot < 0.02) return 0;
  const rNm = sceneToNm(rScene);
  if (rNm <= 0 || rNm > cutoffNm) return 0;
  const sig = Math.max(sigmaNm, 1e-9);
  const x = rNm / sig;
  return -depthKt * deprot * Math.exp(-x * x);
}

export function shortRangeWellForceMag(
  protonation: number,
  rScene: number,
  depthKt: number,
  sigmaNm: number,
  cutoffNm: number,
  enabled = true,
): number {
  if (!enabled || depthKt <= 0) return 0;
  const deprot = 1 - Math.min(1, Math.max(0, protonation));
  if (deprot < 0.02) return 0;
  const rNm = sceneToNm(rScene);
  if (rNm <= 0 || rNm > cutoffNm) return 0;
  const sig = Math.max(sigmaNm, 1e-9);
  const x = rNm / sig;
  // |dU/dr_nm| · SCENE_TO_NM → scene force magnitude (attractive)
  const dU_drNm =
    depthKt * deprot * ((2 * rNm) / (sig * sig)) * Math.exp(-x * x);
  return Math.abs(dU_drNm) * SCENE_TO_NM;
}

/**
 * Mild preferential continuum scale for metal–His when pref is enabled.
 * Stronger near ROI and when His is more deprotonated.
 */
export function metalHisPrefScale(
  protonation: number,
  rScene: number,
  factor: number,
  prefOn: boolean,
  nearNm = METAL_HIS_NEAR_NM,
): number {
  if (!prefOn || factor <= 0) return 1;
  const rNm = sceneToNm(rScene);
  if (rNm > nearNm) return 1;
  const t = 1 - rNm / nearNm;
  const deprot = 1 - Math.min(1, Math.max(0, protonation));
  return 1 + (factor - 1) * t * t * (0.35 + 0.65 * deprot);
}

/**
 * Effective His charge seen by metal under optional preferential continuum.
 * Returns formal HH charge when pref is off.
 */
export function metalHisEffectiveCharge(
  protonation: number,
  prefOn: boolean,
): number {
  const q = Math.min(1, Math.max(0, protonation));
  if (!prefOn) return q;
  // Slight continuum softening of like-charge repulsion when partially deprot.
  return q;
}

export function isMetalKind(kind: string): boolean {
  return (
    kind === "pb" || kind === "cu" || kind === "co" || kind === "metal"
  );
}
