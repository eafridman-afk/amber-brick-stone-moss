/**
 * Sparse ROI-centered field sampling for equipotential-style visualization.
 * Limited neighborhood only — never a full volumetric grid.
 */

import type { FieldSample, Particle, ProteinProxyState, SimParams } from "./types";
import { fieldAt } from "./physics";
import { roiWorldPos } from "./proteins";

export const FIELD_SLICE_RES = 26;
export const FIELD_SLICE_HALF = 0.92;
export const FIELD_FORCE_GRID = 5;

export type FieldSliceData = {
  origin: [number, number, number];
  /** Plane normal is world +Y; plane spans XZ centered on ROI. */
  half: number;
  res: number;
  /** row-major potential values, length res*res */
  potential: Float32Array;
  /** vmin / vmax for scaling (symmetric around 0 when possible) */
  vAbsMax: number;
  /** Contour polylines in world space (closed-ish chains of points) */
  contours: [number, number, number][][];
  /** Sparse force samples on the slice */
  forces: FieldSample[];
};

function potentialOnSlice(
  i: number,
  j: number,
  res: number,
  half: number,
  ox: number,
  oy: number,
  oz: number,
  particles: Particle[],
  params: SimParams,
  proteins: ProteinProxyState[],
): { pot: number; x: number; y: number; z: number; ex: number; ey: number; ez: number } {
  const u = res <= 1 ? 0 : i / (res - 1);
  const v = res <= 1 ? 0 : j / (res - 1);
  const x = ox + (u - 0.5) * 2 * half;
  const z = oz + (v - 0.5) * 2 * half;
  const y = oy;
  const f = fieldAt(x, y, z, particles, params, proteins);
  return { pot: f.potential, x, y, z, ex: f.ex, ey: f.ey, ez: f.ez };
}

/**
 * Lightweight marching-squares segments for a few iso-levels.
 */
function extractContours(
  pot: Float32Array,
  res: number,
  half: number,
  ox: number,
  oy: number,
  oz: number,
  levels: number[],
): [number, number, number][][] {
  const chains: [number, number, number][][] = [];
  const cell = (2 * half) / Math.max(res - 1, 1);

  const at = (i: number, j: number) => pot[j * res + i] ?? 0;

  for (const level of levels) {
    const segs: [number, number, number][][] = [];
    for (let j = 0; j < res - 1; j++) {
      for (let i = 0; i < res - 1; i++) {
        const v00 = at(i, j);
        const v10 = at(i + 1, j);
        const v01 = at(i, j + 1);
        const v11 = at(i + 1, j + 1);
        const x0 = ox + (i / (res - 1) - 0.5) * 2 * half;
        const z0 = oz + (j / (res - 1) - 0.5) * 2 * half;
        const x1 = x0 + cell;
        const z1 = z0 + cell;

        const corners: [number, number, number][] = [
          [x0, oy, z0],
          [x1, oy, z0],
          [x1, oy, z1],
          [x0, oy, z1],
        ];
        const vals = [v00, v10, v11, v01];
        const pts: [number, number, number][] = [];
        for (let e = 0; e < 4; e++) {
          const a = e;
          const b = (e + 1) % 4;
          const va = vals[a]!;
          const vb = vals[b]!;
          if ((va - level) * (vb - level) > 0) continue;
          if (Math.abs(vb - va) < 1e-12) continue;
          const t = (level - va) / (vb - va);
          const pa = corners[a]!;
          const pb = corners[b]!;
          pts.push([
            pa[0] + (pb[0] - pa[0]) * t,
            oy,
            pa[2] + (pb[2] - pa[2]) * t,
          ]);
        }
        if (pts.length >= 2) {
          segs.push([pts[0]!, pts[1]!]);
          if (pts.length >= 4) segs.push([pts[2]!, pts[3]!]);
        }
      }
    }
    // Flatten short segments into chains for Line drawing
    for (const s of segs) chains.push(s);
  }
  return chains;
}

/** Build sparse slice + force samples centered on His194 ROI. */
export function buildFieldSlice(
  particles: Particle[],
  proteins: ProteinProxyState[],
  params: SimParams,
  res = FIELD_SLICE_RES,
  half = FIELD_SLICE_HALF,
): FieldSliceData {
  const prot = proteins[0];
  const origin: [number, number, number] = prot
    ? (() => {
        const r = roiWorldPos(prot);
        return [r.x, r.y, r.z];
      })()
    : [0, 0.1, 0];
  const [ox, oy, oz] = origin;
  const potential = new Float32Array(res * res);
  let maxAbs = 1e-6;

  for (let j = 0; j < res; j++) {
    for (let i = 0; i < res; i++) {
      const s = potentialOnSlice(i, j, res, half, ox, oy, oz, particles, params, proteins);
      potential[j * res + i] = s.pot;
      maxAbs = Math.max(maxAbs, Math.abs(s.pot));
    }
  }

  // Symmetric iso-levels for equipotential-style contours
  const levels = [-0.75, -0.4, -0.15, 0.15, 0.4, 0.75].map((f) => f * maxAbs);
  const contours = extractContours(potential, res, half, ox, oy, oz, levels);

  // Sparse force arrows on slice (and a slightly offset parallel plane)
  const forces: FieldSample[] = [];
  const g = FIELD_FORCE_GRID;
  for (let j = 0; j < g; j++) {
    for (let i = 0; i < g; i++) {
      const u = g <= 1 ? 0.5 : i / (g - 1);
      const v = g <= 1 ? 0.5 : j / (g - 1);
      const x = ox + (u - 0.5) * 2 * half * 0.9;
      const z = oz + (v - 0.5) * 2 * half * 0.9;
      const y = oy + 0.02;
      const f = fieldAt(x, y, z, particles, params, proteins);
      forces.push({ x, y, z, ...f });
    }
  }

  return {
    origin,
    half,
    res,
    potential,
    vAbsMax: maxAbs,
    contours,
    forces,
  };
}

/** Write potential grid into RGBA canvas buffer (red–white–blue + alpha). */
export function writePotentialTexture(
  data: FieldSliceData,
  out: Uint8ClampedArray,
  alpha = 0.55,
): void {
  const { potential, res, vAbsMax } = data;
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  for (let k = 0; k < res * res; k++) {
    const phi = potential[k] ?? 0;
    const t = 0.5 + 0.5 * Math.tanh(phi / Math.max(vAbsMax * 0.65, 0.15));
    // Inline RWB to avoid circular import weight
    let r: number;
    let g: number;
    let b: number;
    if (t < 0.5) {
      const u = t / 0.5;
      r = 0.94 + 0.06 * u;
      g = 0.27 + 0.73 * u;
      b = 0.27 + 0.73 * u;
    } else {
      const u = (t - 0.5) / 0.5;
      r = 1 - 0.85 * u;
      g = 1 - 0.61 * u;
      b = 1 - 0.08 * u;
    }
    // Soften edges of the square
    const i = k % res;
    const j = (k / res) | 0;
    const nx = (i / Math.max(res - 1, 1)) * 2 - 1;
    const ny = (j / Math.max(res - 1, 1)) * 2 - 1;
    const edge = Math.max(Math.abs(nx), Math.abs(ny));
    const edgeFade = edge > 0.85 ? Math.max(0, 1 - (edge - 0.85) / 0.15) : 1;
    const o = k * 4;
    out[o] = Math.round(r * 255);
    out[o + 1] = Math.round(g * 255);
    out[o + 2] = Math.round(b * 255);
    out[o + 3] = Math.round(a * edgeFade);
  }
}
