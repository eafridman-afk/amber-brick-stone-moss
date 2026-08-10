/**
 * Public continuum receptor geometries only.
 * No private coordinates, no MD-derived toxin pores, no unpublished α7 data.
 * Sparse low-poly / multi-bead proxies for educational electrostatics.
 */

import type {
  HisSiteRole,
  ProteinBeadRest,
  ProteinProxyDef,
  ReceptorGeometryId,
} from "./types";
import {
  ACIDIC_PORE_LABEL,
  ALPHA7_ALLO_LABEL,
  ALPHA7_ORTHO_LABEL,
  ATP7A_MENKES_LABEL,
  ATP7A_WT_LABEL,
  FURIN_PROXY_LABEL,
  RECEPTOR_GEOMETRIES,
} from "./types";

/** Translate all beads so the target ROI bead is at local origin. */
export function centerBeadsOnRoi(
  beads: ProteinBeadRest[],
  pred?: (b: ProteinBeadRest) => boolean,
): ProteinBeadRest[] {
  const target =
    beads.find(pred ?? ((b) => b.isHisRoi && b.hisIndex === 0)) ??
    beads.find((b) => b.isHisRoi) ??
    beads.find((b) => b.morph === "his") ??
    beads[0];
  if (!target) return beads;
  const tx = target.lx;
  const ty = target.ly;
  const tz = target.lz;
  return beads.map((b) => ({
    ...b,
    lx: b.lx - tx,
    ly: b.ly - ty,
    lz: b.lz - tz,
  }));
}

export const centerBeadsOnHis194 = (beads: ProteinBeadRest[]) =>
  centerBeadsOnRoi(beads, (b) => b.isHisRoi && b.hisIndex === 0);

export const centerBeadsOnHis69 = centerBeadsOnHis194;

/**
 * Furin triad: His between Asp and Ser, electronegative canyon.
 * After centering, His194 sits at (0,0,0).
 */
function buildFurinTriadBeads(): ProteinBeadRest[] {
  const beads: ProteinBeadRest[] = [];

  const coreOffsets: [number, number, number, number][] = [
    [0.05, -0.08, -0.22, 0.2],
    [0.18, 0.06, -0.28, 0.16],
    [-0.14, 0.04, -0.26, 0.15],
    [0.1, -0.16, -0.18, 0.14],
    [-0.08, -0.14, -0.2, 0.13],
    [0.0, 0.12, -0.3, 0.14],
    [0.22, -0.1, -0.32, 0.12],
    [-0.2, -0.06, -0.3, 0.12],
  ];
  for (const [lx, ly, lz, r] of coreOffsets) {
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
    });
  }

  const canyon: [number, number, number, number][] = [
    [0.28, 0.14, 0.12, 0.1],
    [0.32, 0.02, 0.22, 0.09],
    [0.26, -0.12, 0.14, 0.095],
    [-0.26, 0.14, 0.12, 0.1],
    [-0.3, 0.0, 0.22, 0.09],
    [-0.24, -0.12, 0.14, 0.095],
    [0.18, 0.2, 0.28, 0.08],
    [-0.18, 0.2, 0.28, 0.08],
    [0.12, -0.2, 0.26, 0.075],
    [-0.12, -0.2, 0.26, 0.075],
  ];
  for (const [lx, ly, lz, r] of canyon) {
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "canyon",
      fixedCharge: -0.35,
    });
  }

  beads.push({
    lx: 0.3,
    ly: 0.16,
    lz: 0.05,
    radius: 0.11,
    isHisRoi: false,
    hisIndex: -1,
    morph: "jawA",
    fixedCharge: -0.2,
  });
  beads.push({
    lx: -0.28,
    ly: 0.14,
    lz: 0.06,
    radius: 0.1,
    isHisRoi: false,
    hisIndex: -1,
    morph: "jawB",
    fixedCharge: -0.2,
  });

  beads.push({
    lx: -0.14,
    ly: -0.04,
    lz: 0.02,
    radius: 0.095,
    isHisRoi: false,
    hisIndex: -1,
    morph: "asp",
    fixedCharge: -1,
    residueLabel: "Asp153",
  });
  beads.push({
    lx: 0,
    ly: 0.02,
    lz: 0.06,
    radius: 0.12,
    isHisRoi: true,
    hisIndex: 0,
    morph: "his",
    hisRole: "target",
    fixedCharge: 0,
    residueLabel: "His194",
  });
  beads.push({
    lx: 0.15,
    ly: -0.02,
    lz: 0.04,
    radius: 0.085,
    isHisRoi: false,
    hisIndex: -1,
    morph: "ser",
    fixedCharge: 0,
    residueLabel: "Ser368",
  });

  return centerBeadsOnHis194(beads);
}

/**
 * Generic acidic pore constriction — ring of fixed negative continuum sites.
 * ROI = most negative bead (constriction centre). Not a toxin pore.
 */
function buildAcidicPoreBeads(): ProteinBeadRest[] {
  const beads: ProteinBeadRest[] = [];
  const n = 10;
  const R = 0.42;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    beads.push({
      lx: Math.cos(a) * R,
      ly: Math.sin(a) * R * 0.35,
      lz: Math.sin(a) * R,
      radius: 0.09,
      isHisRoi: false,
      hisIndex: -1,
      morph: "canyon",
      fixedCharge: -0.55,
      residueLabel: `Ring-${i + 1}`,
    });
  }
  // Outer scaffold (neutral / mild negative)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    beads.push({
      lx: Math.cos(a) * 0.72,
      ly: Math.sin(a) * 0.15,
      lz: Math.sin(a) * 0.72,
      radius: 0.12,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
      fixedCharge: -0.15,
    });
  }
  // Most negative constriction focus (ROI)
  beads.push({
    lx: 0,
    ly: 0,
    lz: 0,
    radius: 0.1,
    isHisRoi: true,
    hisIndex: 0,
    morph: "his",
    hisRole: "constriction",
    fixedCharge: -1.0,
    residueLabel: "Pore constriction",
  });
  return centerBeadsOnRoi(beads);
}

/**
 * Generic α7-like orthosteric continuum locus — aromatic-cage style ring.
 * Mild negative / aromatic continuum character. Not real α7 residues.
 */
function buildAlpha7OrthoBeads(): ProteinBeadRest[] {
  const beads: ProteinBeadRest[] = [];
  // Aromatic cage ring (mild continuum character)
  const cage: [number, number, number, number, number][] = [
    [0.28, 0.12, 0.05, 0.08, -0.12],
    [0.22, -0.18, 0.1, 0.075, -0.1],
    [-0.05, -0.26, 0.08, 0.08, -0.14],
    [-0.26, -0.1, 0.06, 0.075, -0.1],
    [-0.24, 0.16, 0.04, 0.08, -0.12],
    [0.08, 0.26, 0.07, 0.075, -0.1],
  ];
  for (let i = 0; i < cage.length; i++) {
    const [lx, ly, lz, r, q] = cage[i]!;
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "canyon",
      fixedCharge: q,
      residueLabel: `Cage-${i + 1}`,
    });
  }
  // Supporting scaffold
  for (const [lx, ly, lz, r] of [
    [0.0, 0.0, -0.28, 0.16],
    [0.18, 0.14, -0.2, 0.11],
    [-0.16, 0.12, -0.22, 0.11],
    [0.12, -0.16, -0.18, 0.1],
    [-0.14, -0.14, -0.2, 0.1],
  ] as [number, number, number, number][]) {
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
      fixedCharge: -0.08,
    });
  }
  // Orthosteric ROI centre
  beads.push({
    lx: 0,
    ly: 0.02,
    lz: 0.08,
    radius: 0.11,
    isHisRoi: true,
    hisIndex: 0,
    morph: "his",
    hisRole: "orthosteric",
    fixedCharge: -0.25,
    residueLabel: "Orthosteric site",
  });
  return centerBeadsOnRoi(beads);
}

/**
 * α7-nAChR allosteric-site continuum environment.
 * Sparse surface patch with mild mixed electrostatic character — not orthosteric,
 * not atomistic, no private coordinates.
 */
function buildAlpha7AlloBeads(): ProteinBeadRest[] {
  const beads: ProteinBeadRest[] = [];

  // Peripheral allosteric surface patch (mild negative continuum)
  const patch: [number, number, number, number, number][] = [
    [0.32, 0.18, 0.22, 0.09, -0.22],
    [0.38, 0.02, 0.28, 0.085, -0.18],
    [0.28, -0.16, 0.24, 0.08, -0.2],
    [0.18, 0.22, 0.32, 0.075, -0.15],
    [0.42, 0.1, 0.12, 0.08, -0.16],
    [0.22, -0.08, 0.34, 0.07, -0.14],
  ];
  for (let i = 0; i < patch.length; i++) {
    const [lx, ly, lz, r, q] = patch[i]!;
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "canyon",
      fixedCharge: q,
      residueLabel: `Allo-surf-${i + 1}`,
    });
  }

  // Mild positive / neutral rim (tunable continuum contrast)
  const rim: [number, number, number, number, number][] = [
    [0.48, 0.2, 0.3, 0.07, 0.08],
    [0.46, -0.14, 0.26, 0.065, 0.06],
    [0.12, 0.28, 0.38, 0.07, 0.05],
  ];
  for (let i = 0; i < rim.length; i++) {
    const [lx, ly, lz, r, q] = rim[i]!;
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
      fixedCharge: q,
      residueLabel: `Allo-rim-${i + 1}`,
    });
  }

  // Supporting body (neutral / slight negative scaffold)
  for (const [lx, ly, lz, r] of [
    [0.05, 0.0, -0.12, 0.18],
    [-0.12, 0.1, -0.08, 0.12],
    [-0.08, -0.12, -0.1, 0.11],
    [0.15, 0.14, -0.18, 0.1],
    [0.1, -0.12, -0.16, 0.1],
  ] as [number, number, number, number][]) {
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
      fixedCharge: -0.06,
    });
  }

  // Allosteric ROI origin (mild negative continuum locus)
  beads.push({
    lx: 0.3,
    ly: 0.04,
    lz: 0.26,
    radius: 0.11,
    isHisRoi: true,
    hisIndex: 0,
    morph: "his",
    hisRole: "allosteric",
    fixedCharge: -0.35,
    residueLabel: "Allosteric site",
  });

  return centerBeadsOnRoi(beads);
}


/**
 * E · ATP7A WT platform — electronegative ATOX1-docking continuum surface.
 * Strong fixed negative character (Fig01 WT ESP style). No HH titration.
 */
function buildAtp7aWtBeads(): ProteinBeadRest[] {
  const beads: ProteinBeadRest[] = [];
  // Electronegative docking face
  const face: [number, number, number, number, number][] = [
    [0.22, 0.1, 0.18, 0.09, -0.55],
    [0.08, -0.12, 0.22, 0.085, -0.5],
    [-0.14, 0.08, 0.2, 0.09, -0.55],
    [-0.2, -0.1, 0.16, 0.08, -0.45],
    [0.28, -0.04, 0.1, 0.075, -0.4],
    [-0.26, 0.02, 0.12, 0.075, -0.4],
    [0.12, 0.2, 0.08, 0.07, -0.35],
    [-0.08, 0.18, 0.14, 0.07, -0.38],
  ];
  for (let i = 0; i < face.length; i++) {
    const [lx, ly, lz, r, q] = face[i]!;
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "canyon",
      fixedCharge: q,
      residueLabel: `WT-surf-${i + 1}`,
    });
  }
  // Scaffold (mild negative)
  for (const [lx, ly, lz, r] of [
    [0.0, 0.0, -0.22, 0.16],
    [0.16, 0.12, -0.16, 0.11],
    [-0.14, 0.1, -0.18, 0.11],
    [0.1, -0.14, -0.14, 0.1],
    [-0.12, -0.12, -0.16, 0.1],
  ] as [number, number, number, number][]) {
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
      fixedCharge: -0.12,
    });
  }
  // ROI — strongly electronegative platform centre
  beads.push({
    lx: 0.02,
    ly: 0.02,
    lz: 0.2,
    radius: 0.12,
    isHisRoi: true,
    hisIndex: 0,
    morph: "his",
    hisRole: "platform",
    fixedCharge: -1.4,
    residueLabel: "ATP7A WT platform",
  });
  return centerBeadsOnRoi(beads);
}

/**
 * F · ATP7A Menkes platform — reduced electronegativity vs WT.
 * Partially neutralized continuum surface so cationic U is less favorable.
 * Educational contrast only — not a disease-treatment claim.
 */
function buildAtp7aMenkesBeads(): ProteinBeadRest[] {
  const beads: ProteinBeadRest[] = [];
  // Same topology as WT but attenuated negative charge (Δφ lost potential)
  const face: [number, number, number, number, number][] = [
    [0.22, 0.1, 0.18, 0.09, -0.18],
    [0.08, -0.12, 0.22, 0.085, -0.15],
    [-0.14, 0.08, 0.2, 0.09, -0.16],
    [-0.2, -0.1, 0.16, 0.08, -0.12],
    [0.28, -0.04, 0.1, 0.075, -0.1],
    [-0.26, 0.02, 0.12, 0.075, -0.1],
    [0.12, 0.2, 0.08, 0.07, -0.08],
    [-0.08, 0.18, 0.14, 0.07, -0.1],
  ];
  for (let i = 0; i < face.length; i++) {
    const [lx, ly, lz, r, q] = face[i]!;
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "canyon",
      fixedCharge: q,
      residueLabel: `Menkes-surf-${i + 1}`,
    });
  }
  for (const [lx, ly, lz, r] of [
    [0.0, 0.0, -0.22, 0.16],
    [0.16, 0.12, -0.16, 0.11],
    [-0.14, 0.1, -0.18, 0.11],
    [0.1, -0.14, -0.14, 0.1],
    [-0.12, -0.12, -0.16, 0.1],
  ] as [number, number, number, number][]) {
    beads.push({
      lx,
      ly,
      lz,
      radius: r,
      isHisRoi: false,
      hisIndex: -1,
      morph: "core",
      fixedCharge: -0.04,
    });
  }
  // ROI — weaker / partially neutralized vs WT
  beads.push({
    lx: 0.02,
    ly: 0.02,
    lz: 0.2,
    radius: 0.12,
    isHisRoi: true,
    hisIndex: 0,
    morph: "his",
    hisRole: "platform",
    fixedCharge: -0.4,
    residueLabel: "ATP7A Menkes platform",
  });
  return centerBeadsOnRoi(beads);
}

export function createProteinProxyDefs(
  geometryId: ReceptorGeometryId = "furin",
): ProteinProxyDef[] {
  const meta = RECEPTOR_GEOMETRIES[geometryId] ?? RECEPTOR_GEOMETRIES.furin;
  if (geometryId === "acidicPore") {
    return [
      {
        id: "generic-acidic-pore",
        label: ACIDIC_PORE_LABEL,
        x: 0,
        y: 0.05,
        z: 0,
        hisPka: 6.2,
        hisSitePkas: [6.2],
        beads: buildAcidicPoreBeads(),
        geometryId: "acidicPore",
        geometryCharacter: "constriction",
        targetHisIndex: 0,
        titratableHis: false,
      },
    ];
  }
  if (geometryId === "alpha7Ortho") {
    return [
      {
        id: "generic-alpha7-ortho",
        label: ALPHA7_ORTHO_LABEL,
        x: 0,
        y: 0.08,
        z: 0,
        hisPka: 6.2,
        hisSitePkas: [6.2],
        beads: buildAlpha7OrthoBeads(),
        geometryId: "alpha7Ortho",
        geometryCharacter: "orthosteric",
        targetHisIndex: 0,
        titratableHis: false,
      },
    ];
  }
  if (geometryId === "alpha7Allo") {
    return [
      {
        id: "alpha7-nachr-allosteric",
        label: ALPHA7_ALLO_LABEL,
        x: 0,
        y: 0.06,
        z: 0,
        hisPka: 6.2,
        hisSitePkas: [6.2],
        beads: buildAlpha7AlloBeads(),
        geometryId: "alpha7Allo",
        geometryCharacter: "allosteric",
        targetHisIndex: 0,
        titratableHis: false,
      },
    ];
  }
  if (geometryId === "atp7aWt") {
    return [
      {
        id: "atp7a-wt-platform",
        label: ATP7A_WT_LABEL,
        x: 0,
        y: 0.06,
        z: 0,
        hisPka: 6.2,
        hisSitePkas: [6.2],
        beads: buildAtp7aWtBeads(),
        geometryId: "atp7aWt",
        geometryCharacter: "platform",
        targetHisIndex: 0,
        titratableHis: false,
      },
    ];
  }
  if (geometryId === "atp7aMenkes") {
    return [
      {
        id: "atp7a-menkes-platform",
        label: ATP7A_MENKES_LABEL,
        x: 0,
        y: 0.06,
        z: 0,
        hisPka: 6.2,
        hisSitePkas: [6.2],
        beads: buildAtp7aMenkesBeads(),
        geometryId: "atp7aMenkes",
        geometryCharacter: "platform",
        targetHisIndex: 0,
        titratableHis: false,
      },
    ];
  }
  return [
    {
      id: "furin-cat-triad",
      label: FURIN_PROXY_LABEL,
      x: 0,
      y: 0.1,
      z: 0,
      hisPka: 6.2,
      hisSitePkas: [6.2],
      beads: buildFurinTriadBeads(),
      geometryId: "furin",
      geometryCharacter: "orthosteric",
      targetHisIndex: 0,
      titratableHis: meta.titratableHis,
    },
  ];
}

export function hisRolesForGeometry(
  geometryId: ReceptorGeometryId = "furin",
): HisSiteRole[] {
  if (geometryId === "acidicPore") return ["constriction"];
  if (geometryId === "alpha7Ortho") return ["orthosteric"];
  if (geometryId === "alpha7Allo") return ["allosteric"];
  if (geometryId === "atp7aWt" || geometryId === "atp7aMenkes")
    return ["platform"];
  return ["target"];
}
