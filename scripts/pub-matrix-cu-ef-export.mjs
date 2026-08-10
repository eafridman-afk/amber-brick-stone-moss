/**
 * Menkes-scope Cu²⁺ public export (Beta v1.0).
 * Writes PUB_MATRIX_Cu_E_F_mean_sd.csv, PUB_MATRIX_Cu_E_vs_F_contrast.csv,
 * PUB_MATRIX_ranking_E_F_with_Cu.csv + JSON.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = process.argv[2] || "http://127.0.0.1:8080/";
const OUT =
  process.argv[3] ||
  "/workspace/exports/validation_package_MoleculoSphere5D";
const nMol = Number(process.argv[4] || 20);
const frames = Number(process.argv[5] || 150);
const replicates = Number(process.argv[6] || 5);

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
page.setDefaultTimeout(600_000);

console.log(`[cu-ef] loading ${URL}`);
await page.goto(URL, { waitUntil: "networkidle", timeout: 120_000 });
await page.waitForFunction(
  () =>
    typeof window.__simEngine?.runPubMatrixCuEF === "function" ||
    typeof window.__simEngine?.runPubMatrixCuPbEF === "function",
  null,
  { timeout: 60_000 },
);

console.log(
  `[cu-ef] running nMol=${nMol} frames=${frames} nRep=${replicates} …`,
);
const t0 = Date.now();
const result = await page.evaluate(
  ({ nMol, frames, replicates }) => {
    const eng = window.__simEngine;
    const fn = eng.runPubMatrixCuEF || eng.runPubMatrixCuPbEF;
    const r = fn.call(eng, { nMolecules: nMol, frames, replicates });
    // normalize keys (CuEF vs legacy alias)
    return {
      meanSdCsv: r.meanSdCsv || r.csv,
      contrastCsv: r.contrastCsv,
      rankingEFCsv: r.rankingEFCsv,
      json: r.json,
      summary: r.summary,
    };
  },
  { nMol, frames, replicates },
);
console.log(`[cu-ef] done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`[cu-ef] summary: ${result.summary}`);

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(OUT, "paper_tables"), { recursive: true });
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_Cu_E_F_mean_sd.csv"),
  result.meanSdCsv,
);
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_Cu_E_vs_F_contrast.csv"),
  result.contrastCsv || "",
);
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_ranking_E_F_with_Cu.csv"),
  result.rankingEFCsv || "",
);
fs.writeFileSync(path.join(OUT, "PUB_MATRIX_Cu_E_F.json"), result.json);
fs.writeFileSync(
  path.join(OUT, "paper_tables/tab_PUB_MATRIX_Cu_E_F.csv"),
  result.meanSdCsv,
);
// keep legacy aliases pointing at new content for any old refs
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_Cu_Pb_E_F_mean_sd.csv"),
  result.meanSdCsv,
);
fs.writeFileSync(path.join(OUT, "PUB_MATRIX_Cu_Pb_E_F.json"), result.json);

const ui = await page.evaluate(() => {
  const text = document.body?.innerText || "";
  return {
    hasCu: /Cu²\+|Cu2\+/i.test(text),
    hasPb: /Pb²\+|Pb2\+/i.test(text),
    hasBanner: /Beta v1\.0/i.test(text),
    hasDisclaimer: /Classical continuum electrostatics only/i.test(text),
    has5H: /5H-EAF/i.test(text),
    hasPrivatePath: /nanotoxicity\//i.test(text),
    hasCuBtn: /Cu.*E\/F|Menkes/i.test(text),
    bodyLen: text.length,
  };
});
console.log("[cu-ef] UI checks:", JSON.stringify(ui, null, 2));
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_Cu_E_F_ui_checks.json"),
  JSON.stringify({ ui, summary: result.summary }, null, 2) + "\n",
);

await browser.close();

if (ui.has5H || ui.hasPrivatePath) {
  console.error("[cu-ef] PUBLIC SURFACE FAIL: 5H-EAF or private path in UI");
  process.exit(1);
}
if (!ui.hasCu || !ui.hasDisclaimer || !ui.hasBanner) {
  console.error("[cu-ef] PUBLIC SURFACE FAIL: missing Cu / disclaimer / banner");
  process.exit(1);
}
console.log("[cu-ef] wrote", OUT);
