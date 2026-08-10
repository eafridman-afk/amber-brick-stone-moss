/**
 * Publication programmes — public continuum surface + private nanotoxicity (gated).
 *
 * Engine ligand classes (internal):
 *   L1 = Pb²⁺ · L2 = peptide · L3 = (internal) · L4 = (internal)
 *
 * User-facing public L numbering (Beta v1.0):
 *   L1 = Pb²⁺ / Cu²⁺ · L2 = KSRRRAR | PRARR | SLLRST
 * Flags in MULTI_LIGAND_PRESETS map onto engine classes via LigandSetSpec.
 *
 * Private programmes (privateNanotoxicity: true) are never shown on the public
 * surface and never appear in public exports.
 */
import type {
  LigandBaselineMode,
  MetalMode,
  PeptideVariant,
  ProgrammeId,
  ReceptorGeometryId,
} from "./types";
import { PUBLICATION_DISCLAIMER, RECEPTOR_GEOMETRIES } from "./types";
import { VALIDITY_LOCKED } from "./validity-test";

export type LigandSetSpec = {
  id: string;
  label: string;
  pb: number;
  peptide: PeptideVariant;
  peptideCount: number;
  /** Engine L3 internal count (private) */
  his5: number;
  /** Engine L4 internal count (not a public Beta v1.0 ligand) */
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

const SOLO_N = 20;
const PAIR_N = 12;
const MULTI_N = 8;

/**
 * Multi-ligand presets (engine internal / private MULTI suite).
 * User-facing L numbering: L1=Pb²⁺, L2=KSRRRAR, L3=(internal), L4=(internal).
 * Not exposed on the public Beta v1.0 surface.
 */
export const MULTI_LIGAND_PRESETS: Record<
  string,
  { Pb: number; peptide: number; L4: number; L3_int: number; label: string }
> = {
  L1: {
    Pb: 1,
    peptide: 0,
    L4: 0,
    L3_int: 0,
    label: "L1 · Pb²⁺ alone",
  },
  L2: {
    Pb: 0,
    peptide: 1,
    L4: 0,
    L3_int: 0,
    label: "L2 · KSRRRAR alone",
  },
  L3: {
    Pb: 0,
    peptide: 0,
    L4: 1,
    L3_int: 0,
    label: "L3 · L4-int alone",
  },
  L4: {
    Pb: 0,
    peptide: 0,
    L4: 0,
    L3_int: 1,
    label: "L4 · L3-int alone",
  },
  "1+3": {
    Pb: 1,
    peptide: 0,
    L4: 1,
    L3_int: 0,
    label: "1+3 · Pb²⁺ + L4-int",
  },
  "2+3": {
    Pb: 0,
    peptide: 1,
    L4: 1,
    L3_int: 0,
    label: "2+3 · KSRRRAR + L4-int",
  },
  "1+2+3": {
    Pb: 1,
    peptide: 1,
    L4: 1,
    L3_int: 0,
    label: "1+2+3 · Pb²⁺ + KSRRRAR + L4-int",
  },
  "3+4": {
    Pb: 0,
    peptide: 0,
    L4: 1,
    L3_int: 1,
    label: "3+4 · L4-int + L3-int",
  },
  "2+3+4": {
    Pb: 0,
    peptide: 1,
    L4: 1,
    L3_int: 1,
    label: "2+3+4 · KSRRRAR + L4-int + L3-int",
  },
  "1+2+3+4": {
    Pb: 1,
    peptide: 1,
    L4: 1,
    L3_int: 1,
    label: "1+2+3+4 · full set",
  },
};

export const MULTI_LIGAND_PRESET_ORDER = [
  "L1",
  "L2",
  "L3",
  "L4",
  "1+3",
  "2+3",
  "1+2+3",
  "3+4",
  "2+3+4",
  "1+2+3+4",
] as const;

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
  const nActive = f.Pb + f.peptide + f.L4 + f["L3_int"];
  const n = nActive <= 1 ? SOLO_N : nActive === 2 ? PAIR_N : MULTI_N;
  return {
    id,
    label: f.label,
    pb: f.Pb ? n : 0,
    peptide: f.peptide ? "ksrrrar" : "off",
    peptideCount: f.peptide ? n : 0,
    // Engine: his5 = L3 (internal), ach = L4 (internal)
    his5: f["L3_int"] ? n : 0,
    ach: f.L4 ? n : 0,
  };
}

export function multiLigandSets(): LigandSetSpec[] {
  return MULTI_LIGAND_PRESET_ORDER.map((id) => multiLigandPresetToSet(id));
}

export const PROGRAMMES: Record<ProgrammeId, ProgrammeDef> = {
  prog1_metal: {
    id: "prog1_metal",
    shortLabel: "P1 · Pb across A–F",
    label: "Programme 1 – Pb²⁺ continuum ranking across public receptors A–F",
    hypothesis:
      "Divalent heavy-metal continuum energy (U_Pb–ROI) ranks across receptor electrostatic environments A–F under locked Debye–Hückel parameters.",
    note: "Public continuum ranking only — not a structural or pharmacological claim.",
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
    shortLabel: "P3 · α7 competition (private)",
    label: "Programme 3 – Allosteric competition baseline (private)",
    hypothesis:
      "Heavy metals or polycationic peptides alter continuum electrostatics at an α7 allosteric (or orthosteric) site.",
    note: "Private analyses are excluded from this public package.",
    receptors: ["alpha7Allo", "alpha7Ortho"],
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
        pb: 12,
        peptide: "ksrrrar",
        peptideCount: 12,
        his5: 0,
        ach: 0,
      },
    ],
    pHFixed: [7.4, 6.2, 5.0],
    ramp: false,
    respawnDefault: false,
    primaryReadouts: ["U_Pb–ROI", "U_pep–ROI", "proximity events"],
    publicationCandidate: false,
    privateNanotoxicity: true,
  },
  prog4_multi_pore: {
    id: "prog4_multi_pore",
    shortLabel: "MULTI · Pore multi-ligand",
    label: "Programme 4 – Multi-ligand pore competition (private)",
    hypothesis:
      "Multiple cationic ligands compete for continuum electrostatic access to an acidic pore ROI.",
    note: "Private analyses are excluded from this public package.",
    receptors: ["acidicPore"],
    ligandSets: multiLigandSets(),
    pHFixed: [7.4, 6.2, 5.0],
    ramp: true,
    respawnDefault: true,
    primaryReadouts: [
      "U_pep–pore",
      "U_tot",
      "proximity/respawn events",
    ],
    publicationCandidate: false,
    privateNanotoxicity: true,
  },
  prog5_peptide3_furin: {
    id: "prog5_peptide3_furin",
    shortLabel: "P5 · Peptide3 furin",
    label:
      "Programme 5 – KSRRRAR / PRARR / SLLRST exclusive baselines at furin triad",
    hypothesis:
      "Charge ladder (+5 / +3 / +1) ranks on |U_pep–His| under locked continuum parameters at the furin triad ROI.",
    note: "Exclusive L2 only (no heavy metal). Respawn OFF. SLLRST is a continuum single-Arg educational contrast — not a viral infectivity claim.",
    receptors: ["furin"],
    ligandSets: [
      {
        id: "KS",
        label: "KSRRRAR exclusive",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "PR",
        label: "PRARR exclusive",
        pb: 0,
        peptide: "prarr",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "SL",
        label: "SLLRST exclusive",
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
      "ranking |U| charge ladder",
    ],
    publicationCandidate: true,
    privateNanotoxicity: false,
  },
  prog_pub_matrix: {
    id: "prog_pub_matrix",
    shortLabel: "PUB · A–F matrix",
    label:
      "Public matrix – A–F × Pb + peptides × pH (locked continuum)",
    hypothesis:
      "Public receptor × public ligand continuum energy matrix under locked Debye–Hückel parameters.",
    note: "Primary public suite. Cu²⁺ Menkes E/F contrast is a separate export.",
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
        id: "Pb",
        label: "Pb²⁺ exclusive",
        pb: 20,
        peptide: "off",
        peptideCount: 0,
        his5: 0,
        ach: 0,
      },
      {
        id: "KS",
        label: "KSRRRAR exclusive",
        pb: 0,
        peptide: "ksrrrar",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "PR",
        label: "PRARR exclusive",
        pb: 0,
        peptide: "prarr",
        peptideCount: 20,
        his5: 0,
        ach: 0,
      },
      {
        id: "SL",
        label: "SLLRST exclusive",
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

/** Public UI order — matrix + Pb + peptide public suites only. */
export const PUBLIC_PROGRAMME_ORDER: ProgrammeId[] = [
  "prog_pub_matrix",
  "prog1_metal",
  "prog5_peptide3_furin",
];

/** Internal-only programme ids (never shown on public surface). */
export const PRIVATE_NANOXICITY_PROGRAMME_ORDER: ProgrammeId[] = [
  "prog2_pore",
  "prog3_ach",
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
    multiLigandNomenclature: null as null,
    publicNote: "Private analyses are excluded from this public package.",
  };
}

/** Convenience: public baseline metal mode from a set. */
export function setToMetalMode(set: LigandSetSpec): MetalMode {
  return set.pb > 0 ? "pb" : "off";
}

/** Convenience: public baseline mode. */
export function setToBaseline(set: LigandSetSpec): LigandBaselineMode {
  if (set.pb > 0 && set.peptide !== "off") return "both";
  if (set.pb > 0) return "ligand1";
  return "ligand2";
}

export function meanSd(xs: number[]): { mean: number; sd: number } {
  if (!xs.length) return { mean: 0, sd: 0 };
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  if (xs.length < 2) return { mean, sd: 0 };
  const v = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
  return { mean, sd: Math.sqrt(v) };
}

