/**
 * Publication-oriented experimental programmes (classical continuum only).
 * Shared locked kernel: VALIDITY_LOCKED nm-unit Yukawa + dual events.
 *
 * Engine ligand classes (unchanged):
 *   L1 = Pb²⁺ · L2 = peptide · L3 = (internal) · L4 = ACh
 *
 * Programme 4 multi-ligand pore nomenclature (user-facing):
 *   L1 = Pb²⁺ · L2 = KSRRRAR · L3 = ACh · L4 = L3-int (internal)
 * Flags in MULTI_LIGAND_PRESETS map onto engine classes via LigandSetSpec.
 */

import type {
  PeptideVariant,
  ProgrammeId,
  ReceptorGeometryId,
} from "./types";
import { PUBLICATION_DISCLAIMER, RECEPTOR_GEOMETRIES } from "./types";
import { VALIDITY_LOCKED } from "./validity-test";

export type LigandSetSpec = {
  id: string;
  label: string;
  /** Engine L1 Pb²⁺ count (0 = absent) */
  pb: number;
  peptide: PeptideVariant;
  peptideCount: number;
  /** Engine L3 internal count (not public) */
  his5: number;
  /** Engine L4 ACh count */
  ach: number;
};

export type ProgrammeDef = {
  id: ProgrammeId;
  shortLabel: string;
  label: string;
  hypothesis: string;
  note?: string;
  receptors: ReceptorGeometryId[];
  ligandSets: LigandSetSpec[];
  pHFixed: number[];
  ramp: boolean;
  respawnDefault: boolean;
  primaryReadouts: string[];
  publicationCandidate: boolean;
  /** If true: private nanotoxicity / biodefense only — never public export. */
  privateNanotoxicity?: boolean;
};

/** Count used when a multi-ligand flag is on (solo / pair / multi). */
const SOLO_N = 18;
const PAIR_N = 12;
const MULTI_N = 8;

/**
 * Programme: Multi-ligand competition at pore constriction.
 * User-facing L numbering: L1=Pb²⁺, L2=KSRRRAR, L3=ACh, L4=(internal).
 * Values 0/1 are presence flags (not absolute molecule counts).
 */
export const MULTI_LIGAND_PRESETS: Record<
  string,
  { Pb: number; peptide: number; ACh: number; L3_int: number; label: string }
> = {
  L1_baseline: {
    Pb: 1,
    peptide: 0,
    ACh: 0,
    "L3_int": 0,
    label: "L1 · Pb²⁺ alone",
  },
  L2_baseline: {
    Pb: 0,
    peptide: 1,
    ACh: 0,
    "L3_int": 0,
    label: "L2 · KSRRRAR alone",
  },
  L3_baseline: {
    Pb: 0,
    peptide: 0,
    ACh: 1,
    "L3_int": 0,
    label: "L3 · ACh alone",
  },
  L4_baseline: {
    Pb: 0,
    peptide: 0,
    ACh: 0,
    "L3_int": 1,
    label: "L4 · L3-int alone",
  },
  "1+3": {
    Pb: 1,
    peptide: 0,
    ACh: 1,
    "L3_int": 0,
    label: "1+3 · Pb²⁺ + ACh",
  },
  "2+3": {
    Pb: 0,
    peptide: 1,
    ACh: 1,
    "L3_int": 0,
    label: "2+3 · KSRRRAR + ACh",
  },
  "1+2+3": {
    Pb: 1,
    peptide: 1,
    ACh: 1,
    "L3_int": 0,
    label: "1+2+3 · Pb²⁺ + KSRRRAR + ACh",
  },
  "3+4": {
    Pb: 0,
    peptide: 0,
    ACh: 1,
    "L3_int": 1,
    label: "3+4 · ACh + L3-int",
  },
  "2+3+4": {
    Pb: 0,
    peptide: 1,
    ACh: 1,
    "L3_int": 1,
    label: "2+3+4 · KSRRRAR + ACh + L3-int",
  },
  "1+2+3+4": {
    Pb: 1,
    peptide: 1,
    ACh: 1,
    "L3_int": 1,
    label: "1+2+3+4 · Full competition",
  },
};

export const MULTI_LIGAND_PRESET_ORDER = [
  "L1_baseline",
  "L2_baseline",
  "L3_baseline",
  "L4_baseline",
  "1+3",
  "2+3",
  "1+2+3",
  "3+4",
  "2+3+4",
  "1+2+3+4",
] as const;

/** Convert presence flags → LigandSetSpec with density scaled by # active species. */
export function multiLigandPresetToSet(id: string): LigandSetSpec {
  const f = MULTI_LIGAND_PRESETS[id];
  if (!f) {
    return {
      id,
      label: id,
      pb: 0,
      peptide: "off",
      peptideCount: 0,
      his5: 0,
      ach: 0,
    };
  }
  const nActive = f.Pb + f.peptide + f.ACh + f["L3_int"];
  const n = nActive <= 1 ? SOLO_N : nActive === 2 ? PAIR_N : MULTI_N;
  return {
    id,
    label: f.label,
    pb: f.Pb ? n : 0,
    peptide: f.peptide ? "ksrrrar" : "off",
    peptideCount: f.peptide ? n : 0,
    // Engine: his5 = L3 (internal), ach = L4 (ACh)
    // Programme-4 user L3=ACh → ach, user L4=(internal) → his5
    his5: f["L3_int"] ? n : 0,
    ach: f.ACh ? n : 0,
  };
}

export function multiLigandSets(): LigandSetSpec[] {
  return MULTI_LIGAND_PRESET_ORDER.map((id) => multiLigandPresetToSet(id));
}

export const PROGRAMMES: Record<ProgrammeId, ProgrammeDef> = {
  prog1_metal: {
    id: "prog1_metal",
    shortLabel: "P1 · Heavy metal",
    label: "Programme 1 – Heavy-metal electrostatic binding across domains",
    hypothesis:
      "Pb²⁺ interacts with continuum electrostatic fields of protein domains; interaction is potentiated under stress pH and further altered under pathological pH.",
    receptors: [
      "furin",
      "acidicPore",
      "alpha7Allo",
      "alpha7Ortho",
      "atp7aWt",
      "atp7aMenkes",
    ],
    ligandSets: [
      {
        id: "L1",
        label: "Pb²⁺ exclusive",
        pb: 20,
        peptide: "off",
        peptideCount: 0,
        his5: 0,
        ach: 0,
      },
      {
        id: "L1L2",
        label: "Pb²⁺ + KSRRRAR",
        pb: 15,
        peptide: "ksrrrar",
        peptideCount: 10,
        his5: 0,
        ach: 0,
      },
    ],
    pHFixed: [7.4, 6.2, 5.0],
    ramp: true,
    respawnDefault: false,
    primaryReadouts: [
      "U_Pb–ROI",
      "proximity events (if respawn ON)",
      "ranking vs pH",
    ],
    publicationCandidate: true,
    privateNanotoxicity: false,
  },
  prog2_pore: {
    id: "prog2_pore",
    shortLabel: "P2 · Pore",
    label:
      "Programme 2 – Pore continuum accessibility (polycationic peptides)",
    hypothesis:
      "Polycationic peptides are electrostatically attracted toward an acidic pore constriction; L3-int alters the pH-dependent electrostatic landscape (exclusion / competition).",
    note: "“Block / repel” language is continuum-electrostatic only; biological pore block requires separate validation.",
    receptors: ["acidicPore"],
    ligandSets: [
      {
        id: "L2",
        label: "KSRRRAR exclusive",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "L2pr",
        label: "PRARR exclusive",
        pb: 0,
        peptide: "prarr",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "L3",
        label: "L3-int exclusive",
        pb: 0,
        peptide: "off",
        peptideCount: 0,
        his5: 20,
        ach: 0,
      },
      {
        id: "L2L3",
        label: "KSRRRAR + L3-int",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 12,
        his5: 12,
        ach: 0,
      },
      {
        id: "L1L2L3",
        label: "Pb + KSRRRAR + L3-int",
        pb: 10,
        peptide: "ksrrrar",
        peptideCount: 10,
        his5: 8,
        ach: 0,
      },
    ],
    pHFixed: [7.4, 6.2, 5.0],
    ramp: true,
    respawnDefault: true,
    primaryReadouts: [
      "U_pep–pore",
      "U_L3–pore",
      "proximity/respawn events",
      "exclusion vs attraction ranking ± L3-int",
    ],
    publicationCandidate: false,
    privateNanotoxicity: true,
  },
  prog3_ach: {
    id: "prog3_ach",
    shortLabel: "P3 · α7 ACh",
    label: "Programme 3 – Allosteric competition with acetylcholine",
    hypothesis:
      "Heavy metals or polycationic peptides alter continuum electrostatics at an α7 allosteric (or orthosteric) site and thereby compete with acetylcholine.",
    note: "Continuum ranking of electrostatic competition against ACh only — not a claim of receptor antagonism without independent biological support.",
    receptors: ["alpha7Allo", "alpha7Ortho"],
    ligandSets: [
      {
        id: "L4",
        label: "ACh exclusive",
        pb: 0,
        peptide: "off",
        peptideCount: 0,
        his5: 0,
        ach: 20,
      },
      {
        id: "L4L1",
        label: "ACh + Pb²⁺",
        pb: 12,
        peptide: "off",
        peptideCount: 0,
        his5: 0,
        ach: 15,
      },
      {
        id: "L4L2",
        label: "ACh + KSRRRAR",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 12,
        his5: 0,
        ach: 15,
      },
    ],
    pHFixed: [7.4, 6.2, 5.0],
    ramp: true,
    respawnDefault: false,
    primaryReadouts: [
      "U_ACh–ROI",
      "U_competitor–ROI",
      "proximity events ACh vs competitor",
      "ACh accessibility change with competitor",
    ],
    publicationCandidate: true,
    privateNanotoxicity: false,
  },
  prog4_multi_pore: {
    id: "prog4_multi_pore",
    shortLabel: "MULTI · Pore multi-ligand",
    label:
      "Programme 4 – Multi-ligand competition at acidic pore constriction",
    hypothesis:
      "Pb²⁺, KSRRRAR, acetylcholine and L3-int compete electrostatically at a generic acidic pore constriction; exclusive baselines rank continuum accessibility, while multi-ligand sets reveal additive/subtractive Yukawa competition.",
    note:
      "User L numbering: L1=Pb²⁺, L2=KSRRRAR, L3=ACh, L4=(internal). Receptor = acidic pore only. Classical continuum only — no biological pore-block claim.",
    receptors: ["acidicPore"],
    ligandSets: multiLigandSets(),
    pHFixed: [7.4, 6.2, 5.0],
    ramp: true,
    respawnDefault: true,
    primaryReadouts: [
      "U_Pb–pore",
      "U_pep–pore",
      "U_ACh–pore",
      "U_L3–pore",
      "U_tot",
      "proximity events per species (if respawn ON)",
      "ranking of exclusive baselines vs multi-ligand sets",
    ],
    publicationCandidate: false,
    privateNanotoxicity: true,
  },
  prog5_peptide3_furin: {
    id: "prog5_peptide3_furin",
    shortLabel: "P5 · Peptide3 furin",
    label: "Programme 5 – Three-peptide exclusive baselines at furin His194",
    hypothesis:
      "Under locked continuum Yukawa, exclusive L2 baselines rank by nominal charge: |U|(KSRRRAR +5) > |U|(PRARR +3) > |U|(SLLRST +1) at fixed pH 7.4 / 6.2 / 5.0. Energy ranking is primary.",
    note:
      "Exclusive L2 only (no heavy metal, no ACh). Respawn OFF. SLLRST is a continuum single-Arg educational contrast — not a viral infectivity claim.",
    receptors: ["furin"],
    ligandSets: [
      {
        id: "L2_ksrrrar",
        label: "KSRRRAR exclusive (+5)",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "L2_prarr",
        label: "PRARR exclusive (+3)",
        pb: 0,
        peptide: "prarr",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "L2_sllrst",
        label: "SLLRST exclusive (+1)",
        pb: 0,
        peptide: "sllrst",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
    ],
    pHFixed: [7.4, 6.2, 5.0],
    ramp: false,
    respawnDefault: false,
    primaryReadouts: [
      "U_pep–His (mean ± sd)",
      "ranking |U| KSRRRAR > PRARR > SLLRST",
    ],
    publicationCandidate: true,
    privateNanotoxicity: false,
  },
  prog_pub_matrix: {
    id: "prog_pub_matrix",
    shortLabel: "PUB · Matrix A–F",
    label:
      "Public validation matrix – exclusive baselines on receptors A–F",
    hypothesis:
      "Under locked continuum Yukawa, exclusive cationic ligands rank by interaction strength at each public receptor (A–F); E (ATP7A WT) is more electronegative than F (Menkes), so |U| for cations is larger on E than F.",
    note:
      "Public exclusive ligands: Pb²⁺, Cu²⁺ (E/F Menkes scope), KSRRRAR, PRARR, SLLRST. Respawn OFF. Continuum observables only.",
    receptors: [
      "furin",
      "acidicPore",
      "alpha7Allo",
      "alpha7Ortho",
      "atp7aWt",
      "atp7aMenkes",
    ],
    ligandSets: [
      {
        id: "L_HM",
        label: "Pb²⁺ exclusive (+2)",
        pb: 20,
        peptide: "off",
        peptideCount: 0,
        his5: 0,
        ach: 0,
      },
      {
        id: "L_PB5",
        label: "KSRRRAR exclusive (+5)",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "L_PB3",
        label: "PRARR exclusive (+3)",
        pb: 0,
        peptide: "prarr",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "L_MB1",
        label: "SLLRST exclusive (+1)",
        pb: 0,
        peptide: "sllrst",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
    ],
    pHFixed: [7.4, 6.2, 5.0],
    ramp: false,
    respawnDefault: false,
    primaryReadouts: [
      "U_L–ROI mean±sd",
      "ranking per receptor",
      "E vs F Menkes continuum contrast",
    ],
    publicationCandidate: true,
    privateNanotoxicity: false,
  },
};

/** Full catalogue (includes private nanotoxicity programmes). */
export const PROGRAMME_ORDER: ProgrammeId[] = [
  "prog_pub_matrix",
  "prog1_metal",
  "prog5_peptide3_furin",
  "prog3_ach",
  "prog2_pore",
  "prog4_multi_pore",
];

/** Public UI order. */
export const PUBLIC_PROGRAMME_ORDER: ProgrammeId[] = [
  "prog_pub_matrix",
  "prog1_metal",
  "prog5_peptide3_furin",
  "prog3_ach",
];

/** Internal-only programme ids (never shown on public surface). */
export const PRIVATE_NANOXICITY_PROGRAMME_ORDER: ProgrammeId[] = [
  "prog2_pore",
  "prog4_multi_pore",
];

export function isPrivateNanotoxicityProgramme(id: ProgrammeId): boolean {
  return PROGRAMMES[id]?.privateNanotoxicity === true;
}

/** Public surface always uses the public programme list. */
export function visibleProgrammeOrder(_showPrivate?: boolean): ProgrammeId[] {
  void _showPrivate;
  return PUBLIC_PROGRAMME_ORDER;
}



export type ProgrammeRunConfig = {
  programmeId: ProgrammeId;
  ligandSetId: string;
  receptorId: ReceptorGeometryId;
  pH: number;
  protocol: "fixed-pH" | "pH-ramp";
  frames: number;
  replicates: number;
  seed: number;
  respawnOnBinding: boolean;
};

export function defaultProgrammeRun(
  programmeId: ProgrammeId,
  ligandSetId?: string,
  receptorId?: ReceptorGeometryId,
): ProgrammeRunConfig {
  const prog = PROGRAMMES[programmeId];
  return {
    programmeId,
    ligandSetId: ligandSetId ?? prog.ligandSets[0]!.id,
    receptorId: receptorId ?? prog.receptors[0]!,
    pH: 7.4,
    protocol: "fixed-pH",
    frames: Math.min(800, VALIDITY_LOCKED.runFrames),
    replicates: VALIDITY_LOCKED.replicates,
    seed: VALIDITY_LOCKED.baseSeed,
    respawnOnBinding: prog.respawnDefault,
  };
}

export function programmeExportMeta(cfg: ProgrammeRunConfig) {
  const prog = PROGRAMMES[cfg.programmeId];
  const set = prog.ligandSets.find((s) => s.id === cfg.ligandSetId);
  const rec = RECEPTOR_GEOMETRIES[cfg.receptorId];
  return {
    disclaimer: PUBLICATION_DISCLAIMER,
    programme: {
      id: prog.id,
      label: prog.label,
      hypothesis: prog.hypothesis,
      note: prog.note ?? null,
    },
    receptor: {
      id: rec.id,
      label: rec.label,
      character: rec.character,
      disclaimer: rec.disclaimer,
    },
    ligandSet: set ?? null,
    multiLigandNomenclature:
      cfg.programmeId === "prog4_multi_pore"
        ? {
            L1: "Pb²⁺",
            L2: "KSRRRAR",
            L3: "ACh",
            L4: "L3_int",
            engineMap: {
              L1: "ligand1 (Pb)",
              L2: "ligand2 (peptide)",
              L3_user_ACh: "ligand4 (ACh)",
              L4_user_internal: "ligand3 (L3-int)",
            },
          }
        : null,
    locked: {
      debyeNm: VALIDITY_LOCKED.debyeNm,
      coulombK: VALIDITY_LOCKED.coulombK,
      forceCutoffNm: VALIDITY_LOCKED.forceCutoffNm,
      frictionScale: VALIDITY_LOCKED.frictionScale,
      baseSeed: VALIDITY_LOCKED.baseSeed,
      coordScaleToNm: VALIDITY_LOCKED.coordScaleToNm,
    },
    protocol: cfg.protocol,
    pH: cfg.pH,
    frames: cfg.frames,
    replicates: cfg.replicates,
    respawnOnBinding: cfg.respawnOnBinding,
  };
}

export function meanSd(xs: number[]): { mean: number; sd: number } {
  if (!xs.length) return { mean: 0, sd: 0 };
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  if (xs.length < 2) return { mean, sd: 0 };
  const v = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
  return { mean, sd: Math.sqrt(v) };
}
