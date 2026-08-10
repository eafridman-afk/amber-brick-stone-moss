import type { ConnectorMesh, SphereNode, SurfaceMesh } from "./types";
import { potentialToT } from "./colormap";

/**
 * Build a geodesic icosphere triangulation.
 * detail 0 ≈ 80 tris, 1 ≈ 320, 2 ≈ 1280 (we cap detail for perf).
 */
export function buildIcosphere(
  cx: number,
  cy: number,
  cz: number,
  radius: number,
  detail: number,
): { positions: Float32Array; indices: Uint32Array } {
  const t = (1 + Math.sqrt(5)) / 2;
  const base: Array<[number, number, number]> = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ];

  const verts: Array<[number, number, number]> = base.map((v) => {
    const n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / n, v[1] / n, v[2] / n];
  });

  let faces: Array<[number, number, number]> = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  const midpointCache = new Map<string, number>();
  const mid = (a: number, b: number): number => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    const hit = midpointCache.get(key);
    if (hit !== undefined) return hit;
    const va = verts[a]!;
    const vb = verts[b]!;
    let x = va[0] + vb[0];
    let y = va[1] + vb[1];
    let z = va[2] + vb[2];
    const n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;
    const idx = verts.length;
    verts.push([x, y, z]);
    midpointCache.set(key, idx);
    return idx;
  };

  const levels = Math.max(0, Math.min(2, Math.floor(detail)));
  for (let d = 0; d < levels; d++) {
    const next: Array<[number, number, number]> = [];
    for (const [a, b, c] of faces) {
      const ab = mid(a, b);
      const bc = mid(b, c);
      const ca = mid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
    midpointCache.clear();
  }

  const positions = new Float32Array(verts.length * 3);
  for (let i = 0; i < verts.length; i++) {
    const v = verts[i]!;
    positions[i * 3] = cx + v[0] * radius;
    positions[i * 3 + 1] = cy + v[1] * radius;
    positions[i * 3 + 2] = cz + v[2] * radius;
  }
  const indices = new Uint32Array(faces.length * 3);
  for (let i = 0; i < faces.length; i++) {
    const f = faces[i]!;
    indices[i * 3] = f[0];
    indices[i * 3 + 1] = f[1];
    indices[i * 3 + 2] = f[2];
  }
  return { positions, indices };
}

/**
 * Surface triangulation for a selected 10 nm sphere.
 * detail 0 (unselected LOD): ~80 tris; selected: detail 1 (~320).
 * Vertex scalars from a coarse multipole potential proxy for colormap.
 */
export function buildSurfaceTriangulation(
  sphere: SphereNode,
  selected: boolean,
  fieldFn?: (x: number, y: number, z: number) => number,
): SurfaceMesh {
  const detail = selected ? 1 : 0;
  const { positions, indices } = buildIcosphere(
    sphere.x,
    sphere.y,
    sphere.z,
    sphere.radius * 1.01,
    detail,
  );
  const nVerts = positions.length / 3;
  const scalars = new Float32Array(nVerts);
  for (let i = 0; i < nVerts; i++) {
    const x = positions[i * 3]!;
    const y = positions[i * 3 + 1]!;
    const z = positions[i * 3 + 2]!;
    const phi = fieldFn ? fieldFn(x, y, z) : 0;
    // Mix potential with slight radial bias for visual structure
    scalars[i] = potentialToT(phi + 0.15 * Math.sin(sphere.seed * 0.01 + i * 0.07));
  }
  return {
    sphereId: sphere.id,
    positions,
    indices,
    scalars,
    triangleCount: indices.length / 3,
    detail,
  };
}

/** Thin diamond connector between two neighboring spheres (interstitial interface). */
export function buildConnector(a: SphereNode, b: SphereNode): ConnectorMesh | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-9;
  const gap = dist - a.radius - b.radius;
  // Only connect near-neighbors with residual interstitial space
  if (gap < -0.05 || gap > a.radius * 0.85) return null;

  const ux = dx / dist;
  const uy = dy / dist;
  const uz = dz / dist;
  // orthonormal basis
  let px = 0;
  let py = 1;
  let pz = 0;
  if (Math.abs(uy) > 0.9) {
    px = 1;
    py = 0;
  }
  // cross u × p
  let cx = uy * pz - uz * py;
  let cy = uz * px - ux * pz;
  let cz = ux * py - uy * px;
  let cn = Math.sqrt(cx * cx + cy * cy + cz * cz) + 1e-9;
  cx /= cn;
  cy /= cn;
  cz /= cn;
  // cross u × c → second axis
  let sx = uy * cz - uz * cy;
  let sy = uz * cx - ux * cz;
  let sz = ux * cy - uy * cx;
  const sn = Math.sqrt(sx * sx + sy * sy + sz * sz) + 1e-9;
  sx /= sn;
  sy /= sn;
  sz /= sn;

  const r = Math.min(a.radius, b.radius) * 0.12;
  const t0 = a.radius * 0.92;
  const t1 = dist - b.radius * 0.92;
  const ax = a.x + ux * t0;
  const ay = a.y + uy * t0;
  const az = a.z + uz * t0;
  const bx = a.x + ux * t1;
  const by = a.y + uy * t1;
  const bz = a.z + uz * t1;

  // 4-vertex ribbon
  const positions = new Float32Array([
    ax + cx * r,
    ay + cy * r,
    az + cz * r,
    ax - cx * r,
    ay - cy * r,
    az - cz * r,
    bx + cx * r,
    by + cy * r,
    bz + cz * r,
    bx - cx * r,
    by - cy * r,
    bz - cz * r,
  ]);
  const indices = new Uint32Array([0, 1, 2, 1, 3, 2]);
  return { aId: a.id, bId: b.id, positions, indices };
}

export function buildNeighborConnectors(
  nodes: SphereNode[],
  activeIds: number[],
  maxConnectors = 48,
): ConnectorMesh[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const active = activeIds.map((id) => byId.get(id)).filter(Boolean) as SphereNode[];
  const out: ConnectorMesh[] = [];
  // Greedy nearest pairs among L1/L2 active
  for (let i = 0; i < active.length && out.length < maxConnectors; i++) {
    const a = active[i]!;
    let best: SphereNode | null = null;
    let bestD = Infinity;
    for (let j = i + 1; j < active.length; j++) {
      const b = active[j]!;
      if (a.level !== b.level) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;
      const d = dx * dx + dy * dy + dz * dz;
      const maxD = (a.radius + b.radius) * 1.35;
      if (d < maxD * maxD && d < bestD) {
        bestD = d;
        best = b;
      }
    }
    if (best) {
      const c = buildConnector(a, best);
      if (c) out.push(c);
    }
  }
  return out;
}
