/**
 * Run public PUB_MATRIX via browser engine and write CSVs to validation package.
 * Physics unchanged — calls simEngine.runPubMatrix only.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = process.argv[2] || "http://127.0.0.1:8080/";
const OUT = process.argv[3] || "/workspace/exports/validation_package_MoleculoSphere5D";
const nMol = Number(process.argv[4] || 20);
const frames = Number(process.argv[5] || 150);
const replicates = Number(process.argv[6] || 5);

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
page.setDefaultTimeout(600_000);

console.log(`[pub-matrix] loading ${URL}`);
await page.goto(URL, { waitUntil: "networkidle", timeout: 120_000 });

// Wait for engine
await page.waitForFunction(
  () => typeof window.__simEngine?.runPubMatrix === "function",
  null,
  { timeout: 60_000 },
);

console.log(
  `[pub-matrix] running nMol=${nMol} frames=${frames} nRep=${replicates} …`,
);
const t0 = Date.now();
const result = await page.evaluate(
  ({ nMol, frames, replicates }) => {
    const eng = window.__simEngine;
    return eng.runPubMatrix({ nMolecules: nMol, frames, replicates });
  },
  { nMol, frames, replicates },
);
console.log(`[pub-matrix] done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`[pub-matrix] summary: ${result.summary}`);

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "PUB_MATRIX_mean_sd.csv"), result.csv);
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_ranking_per_receptor.csv"),
  result.rankingCsv,
);
fs.writeFileSync(path.join(OUT, "PUB_MATRIX_E_vs_F_Menkes.csv"), result.eVsFCsv);
fs.writeFileSync(path.join(OUT, "PUB_MATRIX.json"), result.json);
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_summary.txt"),
  result.summary + "\n",
);

// Light public UI checks
const ui = await page.evaluate(() => {
  const text = document.body?.innerText || "";
  return {
    hasE: /ATP7A WT|E · ATP7A/i.test(text),
    hasF: /Menkes|F · ATP7A/i.test(text),
    hasSllrst: /SLLRST/i.test(text),
    hasPubMatrix: /PUB_MATRIX/i.test(text),
    has5HPublic: /L4 · 5H-EAF/i.test(text) && !/private nanotoxicity/i.test(text),
    has5HControlVisible: !!document.querySelector('[aria-label="Enable 5H-EAF"]'),
    disclosure: /5H-EAF and private nanotoxicity analyses are excluded/i.test(text),
  };
});
console.log("[pub-matrix] UI public checks:", JSON.stringify(ui, null, 2));
fs.writeFileSync(
  path.join(OUT, "PUB_MATRIX_ui_checks.json"),
  JSON.stringify(ui, null, 2) + "\n",
);

await browser.close();
if (!ui.hasE || !ui.hasF || !ui.hasSllrst || ui.has5HControlVisible) {
  console.error("[pub-matrix] UI public gate checks FAILED");
  process.exit(2);
}
console.log("[pub-matrix] exports written to", OUT);
