import type { SphereNode } from "./types";
import { DOMAIN_RADIUS } from "./types";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fibonacciDirections(n: number): Array<[number, number, number]> {
  const out: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    out.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return out;
}

/**
 * Hierarchical sphere-tree LOD.
 * L0: 10 µm conceptual domain
 * L1: intermediate packing proxies
 * L2: 10 nm-radius conceptual spheres (active subset only)
 *
 * Full packing at this scale is still ~10⁹ elements — never instantiated.
 * Active interactive packing is a practical 100–500 nm ROI neighborhood.
 */
export function buildSphereTree(maxLevel2Parents = 16): {
  nodes: SphereNode[];
  level1Ids: number[];
  level2ByParent: Map<number, number[]>;
  level2Ids: number[];
} {
  const nodes: SphereNode[] = [];
  const byId = new Map<number, SphereNode>();
  let nextId = 0;

  const push = (node: SphereNode) => {
    nodes.push(node);
    byId.set(node.id, node);
  };

  const root: SphereNode = {
    id: nextId++,
    parentId: null,
    level: 0,
    x: 0,
    y: 0,
    z: 0,
    radius: DOMAIN_RADIUS,
    scaleLabel: "~10 µm domain (conceptual)",
    seed: 1,
    inspectable: false,
  };
  push(root);

  const n1 = 88;
  const r1 = 0.55;
  const shell = DOMAIN_RADIUS - r1 * 1.15;
  const dirs = fibonacciDirections(n1);
  const level1Ids: number[] = [];
  const randL1 = mulberry32(42);

  for (let i = 0; i < n1; i++) {
    const radial = shell * (0.4 + 0.58 * Math.pow(randL1(), 0.62));
    const [dx, dy, dz] = dirs[i]!;
    const candidate: SphereNode = {
      id: nextId,
      parentId: root.id,
      level: 1,
      x: dx * radial,
      y: dy * radial,
      z: dz * radial,
      radius: r1 * (0.88 + 0.22 * randL1()),
      scaleLabel: "LOD L1 (µm proxy)",
      seed: 1000 + i,
      inspectable: true,
    };

    let ok = true;
    for (const id of level1Ids) {
      const o = byId.get(id);
      if (!o) continue;
      const ddx = candidate.x - o.x;
      const ddy = candidate.y - o.y;
      const ddz = candidate.z - o.z;
      const minD = (candidate.radius + o.radius) * 0.9;
      if (ddx * ddx + ddy * ddy + ddz * ddz < minD * minD) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    nextId++;
    level1Ids.push(candidate.id);
    push(candidate);
  }

  const level2ByParent = new Map<number, number[]>();
  const level2Ids: number[] = [];
  const parents = level1Ids.slice(0, Math.min(maxLevel2Parents, level1Ids.length));

  for (const pid of parents) {
    const parent = byId.get(pid);
    if (!parent) continue;
    const childIds: number[] = [];
    const n2 = 12 + (parent.seed % 8);
    const r2 = parent.radius * 0.2; // visual proxy for 10 nm radius
    const childDirs = fibonacciDirections(n2);
    const rand = mulberry32(parent.seed);

    for (let i = 0; i < n2; i++) {
      const radial = parent.radius * (0.32 + 0.48 * rand());
      const [dx, dy, dz] = childDirs[i]!;
      const child: SphereNode = {
        id: nextId++,
        parentId: pid,
        level: 2,
        x: parent.x + dx * radial,
        y: parent.y + dy * radial,
        z: parent.z + dz * radial,
        radius: r2 * (0.88 + 0.28 * rand()),
        scaleLabel: "10 nm radius (LOD L2)",
        seed: parent.seed * 17 + i,
        inspectable: true,
      };
      childIds.push(child.id);
      level2Ids.push(child.id);
      push(child);
    }
    level2ByParent.set(pid, childIds);
  }

  return { nodes, level1Ids, level2ByParent, level2Ids };
}

export function getActiveSpheres(
  nodes: SphereNode[],
  level1Ids: number[],
  level2ByParent: Map<number, number[]>,
  expandedParentIds: Set<number>,
  selectedId: number | null,
): SphereNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const active: SphereNode[] = [];

  for (const id of level1Ids) {
    const n = byId.get(id);
    if (n) active.push(n);
  }

  const expand = new Set(expandedParentIds);
  if (selectedId != null) {
    const sel = byId.get(selectedId);
    if (sel?.level === 1) expand.add(sel.id);
    if (sel?.level === 2 && sel.parentId != null) expand.add(sel.parentId);
  }
  for (const pid of expand) {
    const kids = level2ByParent.get(pid);
    if (!kids) continue;
    for (const kid of kids) {
      const n = byId.get(kid);
      if (n) active.push(n);
    }
  }
  return active;
}
