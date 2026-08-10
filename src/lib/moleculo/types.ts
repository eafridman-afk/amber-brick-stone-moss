/**
 * MoleculoSphere 5D shared types & constants.
 * Classical continuum electrostatics only. Physics params locked (Beta v1.1 public multi-ligand).
 */

export type MoleculeKind =
  | "pb"
  | "cu"
  | "co"
  | "metal"
  | "peptide"
  | "his5"
  | "ach"
  | "generic";

export type LigandClass = "ligand1" | "ligand2" | "ligand3" | "ligand4";

/**
 * L1 heavy-metal identity (hard exclusive — one species at a time).
 * Legacy: "co" | "both" | "mix" resolve to Pb²⁺.
 */
export type MetalMode = "pb" | "cu" | "off" | "co" | "both" | "mix";

export type LigandBaselineMode = "ligand1" | "ligand2" | "both";

export type PeptideVariant = "ksrrrar" | "prarr" | "sllrst" | "off";

/** Docs/metadata only — live path always uses numeric formal/HH q. No quantum engine. */
export type ChargeSource = "formal" | "HH";
export const DEFAULT_CHARGE_SOURCE: ChargeSource = "formal";

export type ProgrammeId =
  | "prog1_metal"
  | "prog2_pore"
  | "prog3_ach"
  | "prog4_multi_pore"
  | "prog5_peptide3_furin"
  | "prog_pub_matrix"
  | "prog_pub_combo";

export type PhRegime =
  | "physiological"
  | "stress"
  | "pathological"
  | "basic";

export const PUBLICATION_DISCLAIMER =
  "Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.";

/**
 * @deprecated Use PUBLICATION_DISCLAIMER — public surface names no private ligands.
 * Kept as alias so existing imports compile during Beta v1.0 freeze.
 */
export const PUBLIC_PACKAGE_DISCLOSURE = PUBLICATION_DISCLAIMER;

/** Default build is public continuum surface only. */
export const PUBLIC_BUILD_DEFAULT = true as const;

/** In-app / export version tag. */
export const APP_VERSION_BANNER = "MoleculoSphere 5D · Beta v1.1" as const;

/** Subtitle under app title (UI + README). */
export const APP_SUBTITLE =
  "Classical continuum electrostatics · Educational / hypothesis tool" as const;

/** Frozen public validation package root (workspace-relative). */
export const VALIDATION_PACKAGE_PATH =
  "exports/validation_package_MoleculoSphere5D" as const;

/** Public exclusive ligand names (UI + exports). */
export const PUBLIC_LIGANDS = [
  "Pb²⁺",
  "Cu²⁺",
  "KSRRRAR",
  "PRARR",
  "SLLRST",
] as const;

// —— Domain / integrator ——
export const DOMAIN_RADIUS = 3.2;
export const MAX_MOLECULES = 80;
export const MAX_TRAJECTORY_FRAMES = 240;
/** Integration / event time step (ns per frame). Locked with VALIDITY_LOCKED.frameNs. */
export const FRAME_NS = 100;
export const EVENT_WINDOW_FRAMES = 3;
export const EVENT_RECORD_CAP = 500;

export const METAL_HIS_PREF_DEFAULT = 1.8;
export const SHORT_RANGE_WELL_DEPTH_DEFAULT = 3;
export const SHORT_RANGE_WELL_SIGMA_NM = 0.4;
export const SHORT_RANGE_WELL_CUTOFF_NM = 0.8;

export const DISPLAY_DURATION_DEFAULT = 10;
export const DISPLAY_DURATION_MIN = 5;
export const DISPLAY_DURATION_MAX = 120;
export const DISPLAY_DURATION_PRESETS = [5, 10, 30, 60] as const;

/** Wall-clock conceptual acceleration relative to default display window. */
export function timeAccelerationFactor(displayDurationSec: number): number {
  return 10 / Math.max(1, displayDurationSec);
}

/** Live integrator step rate; longer display window → fewer steps/s. */
export function targetStepsPerSecond(displayDurationSec: number): number {
  return 60 * (10 / Math.max(1, displayDurationSec));
}

// —— Clamp / event tape ——
export type ClampZoomLevel = "100" | "75" | "50" | "25";
export const CLAMP_ZOOM_LEVELS: ClampZoomLevel[] = ["100", "75", "50", "25"];
export const CLAMP_ZOOM_LABELS: Record<ClampZoomLevel, string> = {
  "100": "100%",
  "75": "75%",
  "50": "50%",
  "25": "25%",
};
export const CLAMP_MAX_FRAMES = 500;
export const CLAMP_MIN_POST_FRAMES = 30;
export const CLAMP_PLAYBACK_SEC = 4;
export const CLAMP_PREROLL_FRAMES = 15;
export const CLAMP_STABLE_FRAMES = 3;
export const CLAMP_TRIGGER_DIST = 1.0;

// —— His HH switch ——
export const HIS_SWITCH_ON_THRESHOLD = 0.5;
export const HIS_SWITCH_OFF_THRESHOLD = 0.35;
/** @deprecated alias */
export const HIS_SWITCH_ON = HIS_SWITCH_ON_THRESHOLD;
/** @deprecated alias */
export const HIS_SWITCH_OFF = HIS_SWITCH_OFF_THRESHOLD;

export const HIS_APPROACH_NEAR_NM = 1.0;
export const HIS_APPROACH_FAR_NM = 1.4;
/** Scene-unit aliases (nm-native when coord scale = 1). */
export const HIS_APPROACH_NEAR = HIS_APPROACH_NEAR_NM;
export const HIS_APPROACH_FAR = HIS_APPROACH_FAR_NM;

export const HIS_SITE_LABELS = ["His194"] as const;
export const PROTEIN_BASE_RGB: [number, number, number] = [0.52, 0.58, 0.68];

export type ReceptorGeometryId =
  | "furin"
  | "acidicPore"
  | "alpha7Allo"
  | "alpha7Ortho"
  | "atp7aWt"
  | "atp7aMenkes";

export type HisSiteRole =
  | "target"
  | "generic"
  | "constriction"
  | "orthosteric"
  | "allosteric"
  | "platform"
  | string;

export type ReceptorGeometryCharacter =
  | "orthosteric"
  | "allosteric"
  | "constriction"
  | "mixed"
  | "platform";

export type ReceptorGeometryMeta = {
  id: ReceptorGeometryId;
  label: string;
  shortLabel: string;
  character: ReceptorGeometryCharacter;
  blurb: string;
  disclaimer: string;
  titratableHis: boolean;
  roiLabel: string;
};

export type IonizableGroup = {
  name: string;
  pKa: number;
  kind: "base" | "acid";
  magnitude: number;
};

export type MoleculeSpecies = {
  id: string;
  label: string;
  kind: MoleculeKind;
  ligandClass: LigandClass;
  radius: number;
  friction: number;
  fixedCharge: number;
  groups: IonizableGroup[];
  beads: number;
  beadSpacing: number;
  sequence?: string;
  accent?: string;
  accentRgb?: [number, number, number];
};

export type Particle = {
  id: number;
  speciesId: string;
  kind: MoleculeKind | string;
  ligandClass: LigandClass;
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  q: number;
  qDesign: number;
};

export type SimParams = {
  pH: number;
  regime: PhRegime;
  coulombK: number;
  debyeNm: number;
  debyeLength: number;
  forceCutoffNm: number;
  forceCutoffScene: number;
  frictionScale: number;
  noiseScale: number;
  dt: number;
  kT: number;
  metalHisPrefFactor: number;
  metalHisPrefEnabled: boolean;
  shortRangeWellEnabled: boolean;
  shortRangeWellDepthKt: number;
  shortRangeWellSigmaNm: number;
  shortRangeWellCutoffNm: number;
  fCap: number;
};

export type ProteinBeadRest = {
  lx: number;
  ly: number;
  lz: number;
  radius: number;
  isHisRoi: boolean;
  hisIndex: number;
  morph: string;
  fixedCharge?: number;
  residueLabel?: string;
  hisRole?: HisSiteRole;
};

export type HisSiteState = {
  index: number;
  label: string;
  pKa: number;
  protonation: number;
  charge: number;
  continuousScore: number;
  switchOn: boolean;
  switchDisplayOn: boolean;
  switchOverride: boolean | null;
  clickPulse: number;
  localEnergy: number;
  nearestMetal: number;
  nearestHis5: number;
  role: HisSiteRole;
};

export type ProteinProxyDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  hisPka: number;
  hisSitePkas: number[];
  beads: ProteinBeadRest[];
  geometryId: ReceptorGeometryId;
  geometryCharacter: ReceptorGeometryCharacter;
  targetHisIndex: number;
  titratableHis: boolean;
};

export type ProteinProxyState = {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  beads: ProteinBeadRest[];
  hisPka: number;
  hisSitePkas: number[];
  geometryId: ReceptorGeometryId;
  geometryCharacter: ReceptorGeometryCharacter;
  targetHisIndex: number;
  titratableHis: boolean;
  hisSites: HisSiteState[];
  hisProtonation: number;
  hisCharge: number;
  response: number;
  dominantLigand: string | null;
  nearestL1: number;
  nearestL2: number;
  confScale: number;
  confAngle: number;
  stressTint: number;
  localEnergy: number;
  continuousScore: number;
  switchOn: boolean;
  switchOverride: boolean | null;
  switchDisplayOn: boolean;
  clickPulse: number;
  cleftOpen: number;
};

export type EventLogParticle = {
  id: number;
  speciesId: string;
  ligandClass: LigandClass;
  kind: string;
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  q: number;
};

export type EventLogFrame = {
  tNs: number;
  frameIndex: number;
  particles: EventLogParticle[];
  hisProtonation: number;
  hisCharge: number;
  switchOn: boolean;
  switchDisplayOn: boolean;
  continuousScore: number;
  energyL1His: number;
  energyL2His: number;
  energyL1L2: number;
  energyTotal: number;
  energyL3His: number;
  energyL4His: number;
  nearestL1Nm: number;
  nearestL2Nm: number;
  pH: number;
  ligandBaseline: LigandBaselineMode;
  minDistNm: number;
  U_primary: number;
  U_tot: number;
  theta: number;
  q_His: number;
  proxFlag: 0 | 1;
  hhFlag: 0 | 1;
};

export type TrajectoryFrame = {
  tNs: number;
  positions: Float32Array;
  charges?: Float32Array;
  orientations?: Float32Array;
};

export type SphereNode = {
  id: number;
  parentId: number | null;
  level: number;
  x: number;
  y: number;
  z: number;
  radius: number;
  scaleLabel: string;
  seed: number;
  inspectable: boolean;
};

export type SurfaceMesh = {
  sphereId: number;
  positions: Float32Array;
  indices: Uint32Array;
  scalars: Float32Array;
  triangleCount: number;
  detail: number;
};

export type ConnectorMesh = {
  aId: number;
  bId: number;
  positions: Float32Array;
  indices: Uint32Array;
};

export type FieldSample = {
  x: number;
  y: number;
  z: number;
  ex: number;
  ey: number;
  ez: number;
  potential: number;
};

export const RECEPTOR_GEOMETRIES: Record<
  ReceptorGeometryId,
  ReceptorGeometryMeta
> = {
  furin: {
    id: "furin",
    label: "Furin catalytic triad continuum proxy",
    shortLabel: "A · Furin triad",
    character: "orthosteric",
    blurb:
      "Furin catalytic triad continuum proxy. ROI on His194 (titratable pKa 6.2); Asp153 = –1; Ser368 = 0.",
    disclaimer:
      "Classical continuum electrostatics only (Yukawa + Henderson–Hasselbalch). Educational / hypothesis support — not a substitute for MD or experiment.",
    titratableHis: true,
    roiLabel: "His194",
  },
  acidicPore: {
    id: "acidicPore",
    label: "Generic acidic pore constriction",
    shortLabel: "B · Acidic pore",
    character: "constriction",
    blurb:
      "Generic acidic pore constriction – continuum electrostatic proxy only.",
    disclaimer:
      "Classical continuum electrostatics only. “Block / repel” language is continuum-electrostatic only; biological pore block requires separate validation. Not a structural model of any toxin or channel.",
    titratableHis: false,
    roiLabel: "Pore constriction",
  },
  alpha7Allo: {
    id: "alpha7Allo",
    label: "α7-nAChR continuum proxy (allosteric)",
    shortLabel: "C · α7 allosteric",
    character: "allosteric",
    blurb:
      "α7-nAChR continuum proxy (allosteric-site electrostatic environment). Classical only; not structural or pharmacological.",
    disclaimer:
      "Classical continuum electrostatic proxy of an α7-nAChR allosteric environment. Not a structural, orthosteric, or pharmacological model of the receptor. No atomistic MD or experimental binding data are implied.",
    titratableHis: false,
    roiLabel: "Allosteric site",
  },
  alpha7Ortho: {
    id: "alpha7Ortho",
    label: "α7-like orthosteric continuum proxy",
    shortLabel: "D · α7 orthosteric",
    character: "orthosteric",
    blurb: "α7-like orthosteric continuum proxy. Classical electrostatics only.",
    disclaimer:
      "Classical continuum electrostatics only. No atomistic α7 coordinates. Not a structural or pharmacological model of the nicotinic receptor.",
    titratableHis: false,
    roiLabel: "Orthosteric site",
  },
  atp7aWt: {
    id: "atp7aWt",
    label: "ATP7A WT ATOX1-docking platform",
    shortLabel: "E · ATP7A WT",
    character: "platform",
    blurb:
      "Continuum proxy of an electronegative ATOX1-docking surface (WT ESP character). Fixed negative platform — no HH titration.",
    disclaimer:
      "Educational continuum electrostatics only. Not a structural model of ATP7A, not a disease-treatment claim, not MD-validated docking.",
    titratableHis: false,
    roiLabel: "ATP7A WT platform",
  },
  atp7aMenkes: {
    id: "atp7aMenkes",
    label: "ATP7A Menkes platform (reduced electronegativity)",
    shortLabel: "F · ATP7A Menkes",
    character: "platform",
    blurb:
      "Continuum proxy with reduced electronegativity relative to WT (lost negative potential character). Weaker cationic U vs E.",
    disclaimer:
      "Educational continuum electrostatics only. Continuum contrast for Menkes-like reduced electronegativity — not a diagnostic or treatment model.",
    titratableHis: false,
    roiLabel: "ATP7A Menkes platform",
  },
};

export const RECEPTOR_GEOMETRY_ORDER: ReceptorGeometryId[] = [
  "furin",
  "acidicPore",
  "alpha7Allo",
  "alpha7Ortho",
  "atp7aWt",
  "atp7aMenkes",
];

/** Public exclusive ligands only. */
export const PUBLIC_LIGAND_LABELS = {
  L_HM_Pb: "Pb²⁺",
  L_HM_Cu: "Cu²⁺",
  L_PB5: "KSRRRAR",
  L_PB3: "PRARR",
  L_MB1: "SLLRST",
} as const;

export const HEAVY_METAL_UI_ORDER: Array<"pb" | "cu" | "off"> = [
  "pb",
  "cu",
  "off",
];

export function resolveHeavyMetal(mode: MetalMode): "pb" | "cu" | "off" {
  if (mode === "cu") return "cu";
  if (mode === "off") return "off";
  return "pb";
}

export function heavyMetalLabel(mode: MetalMode): string {
  const r = resolveHeavyMetal(mode);
  if (r === "cu") return "Cu²⁺";
  if (r === "off") return "off";
  return "Pb²⁺";
}

export const FURIN_PROXY_LABEL =
  "Furin catalytic triad continuum proxy – His194 ROI";

export const ACIDIC_PORE_LABEL =
  "Generic acidic pore constriction – continuum electrostatic proxy only.";

export const ALPHA7_ORTHO_LABEL =
  "α7-like orthosteric continuum proxy. Classical electrostatics only.";

export const ALPHA7_ALLO_LABEL =
  "α7-nAChR continuum proxy (allosteric-site electrostatic environment). Classical only; not structural or pharmacological.";

export const ATP7A_WT_LABEL =
  "ATP7A WT ATOX1-docking platform continuum proxy – electronegative surface";

export const ATP7A_MENKES_LABEL =
  "ATP7A Menkes platform continuum proxy – reduced electronegativity (educational contrast only)";
