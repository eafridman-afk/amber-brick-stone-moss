/**
 * Paper-ready table builders (client-side) — PUBLIC PACKAGE ONLY.
 * Physics is never modified.
 */
import {
  APP_VERSION_BANNER,
  PUBLICATION_DISCLAIMER,
  RECEPTOR_GEOMETRIES,
  RECEPTOR_GEOMETRY_ORDER,
} from "./types";
import { VALIDITY_LOCKED } from "./validity-test";

const DISCLAIMER_LINE =
  "# " +
  PUBLICATION_DISCLAIMER +
  "\n# " +
  APP_VERSION_BANNER;

function downloadText(filename: string, content: string, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function buildLockedParamsCsv(): string {
  const L = VALIDITY_LOCKED;
  const header =
    "lambda_D_nm,coulombK,cutoff_nm,friction,fCap,dt,frameNs,seed,proximity_rule,HH_binary_rule";
  const row = [
    L.debyeNm,
    L.coulombK,
    L.forceCutoffNm,
    (1.35 * 1.42).toFixed(3),
    16.2,
    0.012,
    L.frameNs,
    L.baseSeed,
    `"d < ${L.proximityNm} nm, hold ≥ ${L.confirmFrames} frames"`,
    `"θ ≥ 0.5, hold ≥ ${L.confirmFrames} frames"`,
  ].join(",");
  return `${DISCLAIMER_LINE}\n${header}\n${row}\n`;
}

export function buildKernelValidationCsv(): string {
  const header = "r_nm,U_kT,F_abs_kT_per_nm,inside_cutoff";
  const rows = [
    "1.0,0.32948052,0.74133116,true",
    "3.1,0.00769919,0.01210760,true",
    "3.3,0.00000000,0.00000000,false",
  ];
  return `${DISCLAIMER_LINE}\n${header}\n${rows.join("\n")}\n`;
}

export function buildReceptorsCsv(): string {
  const header = "letter,geometry_id,label,roi,titratable_His,character";
  const letters = ["A", "B", "C", "D", "E", "F"];
  const rows = RECEPTOR_GEOMETRY_ORDER.map((id, i) => {
    const m = RECEPTOR_GEOMETRIES[id];
    return [
      letters[i] ?? "?",
      id,
      m.label.replace(/,/g, ";"),
      m.roiLabel,
      m.titratableHis,
      m.character,
    ].join(",");
  });
  return `${DISCLAIMER_LINE}\n${header}\n${rows.join("\n")}\n`;
}

/** Public exclusive ligands only. */
export function buildLigandsCsv(): string {
  const header = "id,name,engine_class,nominal_charge,role";
  const rows = [
    'L_HM_Pb,Pb2+,ligand1,+2,"divalent heavy-metal ion (exclusive baseline)"',
    'L_HM_Cu,Cu2+,ligand1,+2,"divalent copper ion (Menkes E/F continuum contrast; q=+2)"',
    'L_PB5,KSRRRAR,ligand2,+5,"polybasic peptide FCS-like continuum proxy"',
    'L_PB3,PRARR,ligand2,+3,"intermediate polybasic peptide"',
    'L_MB1,SLLRST,ligand2,+1,"single-Arg continuum educational proxy — not a viral infectivity claim"',
  ];
  return `${DISCLAIMER_LINE}\n${header}\n${rows.join("\n")}\n`;
}

export function buildPublicDisclosureTxt(): string {
  return [
    APP_VERSION_BANNER,
    "",
    PUBLICATION_DISCLAIMER,
    "",
    "Public continuum observables only — not MD, docking, or clinical prediction.",
    "Public ligands: Pb2+, Cu2+ (E/F Menkes scope), KSRRRAR, PRARR, SLLRST.",
    "Public receptors A–F; Cu2+ Menkes analysis uses E and F only.",
  ].join("\n");
}

/** Download paper table CSVs (client-side). Full figure package is prebuilt offline. */
export function exportPaperAssetTables(opts?: {
  multiRankingCsv?: string | null;
  pubMatrixCsv?: string | null;
}): string {
  void opts?.multiRankingCsv;
  downloadText("tab_locked_params.csv", buildLockedParamsCsv());
  downloadText("tab_kernel_validation.csv", buildKernelValidationCsv());
  downloadText("tab_receptors.csv", buildReceptorsCsv());
  downloadText("tab_ligands.csv", buildLigandsCsv());
  downloadText("PUBLIC_DISCLAIMER.txt", buildPublicDisclosureTxt(), "text/plain");
  if (opts?.pubMatrixCsv) {
    downloadText("tab_PUB_MATRIX.csv", opts.pubMatrixCsv);
  }
  const note = [
    APP_VERSION_BANNER,
    PUBLICATION_DISCLAIMER,
    "",
    "Paper tables downloaded (CSV) — public continuum package.",
    "Full figure package (PNG/PDF + captions) lives at:",
    "exports/validation_package_MoleculoSphere5D/paper_figures/",
  ].join("\n");
  downloadText("paper_tables_README.txt", note, "text/plain");
  return "Public paper table CSVs downloaded · " + APP_VERSION_BANNER;
}
