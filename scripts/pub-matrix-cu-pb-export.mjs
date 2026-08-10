import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const outDir =
  process.argv[3] ||
  "/workspace/exports/validation_package_MoleculoSphere5D";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.setDefaultTimeout(180000);
console.log("[cu-pb] loading", url);
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const result = await page.evaluate(async () => {
  const eng = /** @type {any} */ (window).__simEngine;
  if (!eng?.runPubMatrixCuPbEF) throw new Error("runPubMatrixCuPbEF missing");
  const t0 = performance.now();
  const r = eng.runPubMatrixCuPbEF({
    nMolecules: 20,
    frames: 150,
    replicates: 5,
  });
  const ms = performance.now() - t0;

  // UI checks
  const body = document.body.innerText;
  const checks = {
    hasCu: /Cu²\+|Cu2\+/i.test(body),
    hasPb: /Pb²\+|Pb2\+/i.test(body),
    hasCuPbBtn: /Cu\/Pb|Cu.*Pb.*E\/F/i.test(body),
    no5HDefault: !/L4 · 5H-EAF \(private\)/.test(body),
  };

  // Switch to Cu and confirm particles
  eng.setMetalMode("cu");
  const cuCount = eng.particles.filter(
    (p) => p.ligandClass === "ligand1" && p.speciesId === "cu-ion",
  ).length;
  eng.setMetalMode("pb");
  const pbCount = eng.particles.filter(
    (p) => p.ligandClass === "ligand1" && p.speciesId === "pb-ion",
  ).length;
  eng.setMetalMode("off");
  const offCount = eng.particles.filter((p) => p.ligandClass === "ligand1")
    .length;
  eng.setMetalMode("pb");

  return {
    ms,
    summary: r.summary,
    csv: r.csv,
    json: r.json,
    checks,
    cuCount,
    pbCount,
    offCount,
  };
});

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "PUB_MATRIX_Cu_Pb_E_F_mean_sd.csv"),
  result.csv,
);
fs.writeFileSync(path.join(outDir, "PUB_MATRIX_Cu_Pb_E_F.json"), result.json);
fs.copyFileSync(
  path.join(outDir, "PUB_MATRIX_Cu_Pb_E_F_mean_sd.csv"),
  path.join(outDir, "paper_tables/tab_PUB_MATRIX_Cu_Pb_E_F.csv"),
);

console.log(`[cu-pb] done in ${(result.ms / 1000).toFixed(1)}s`);
console.log("[cu-pb] summary:", result.summary);
console.log("[cu-pb] UI/species:", {
  checks: result.checks,
  cuCount: result.cuCount,
  pbCount: result.pbCount,
  offCount: result.offCount,
});
console.log("[cu-pb] wrote", outDir);

await browser.close();
