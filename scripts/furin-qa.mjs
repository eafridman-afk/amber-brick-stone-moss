import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1800);

const body0 = await page.locator("body").innerText();
const checks = {
  furinHint: /furin|catalytic His|KSRRRAR/i.test(body0),
  pbOnly: /Pb²⁺ only/i.test(body0),
  ksOnly: /KSRRRAR only/i.test(body0),
  noCo: !/Co²⁺/.test(body0),
  noHis5: !/His₅/.test(body0),
  canvas: (await page.locator("canvas").count()) > 0,
  export: /Export ROI snapshot/i.test(body0),
  geometry: /Receptor geometry/i.test(body0),
  edu: /Furin catalytic domain/i.test(body0),
};

// Expand edu if needed
const eduTitle = page.getByText(/Furin catalytic domain · Pb/i);
if (await eduTitle.count()) {
  // already may be open
}

// Baseline Pb only
await page.getByRole("button", { name: /Pb²\+ only/i }).click();
await page.waitForTimeout(600);
// Inspect particle counts via page evaluate - need engine on window? use store through DOM labels
const countsPb = await page.evaluate(() => {
  // parse species list if visible
  return document.body.innerText;
});
checks.pbActive = /Pb²\+ only \(KSRRRAR fully absent\)/i.test(countsPb);
// Spawn buttons disabled for L2
const spawnL2 = page.getByRole("button", { name: /Spawn KSRRRAR/i });
checks.l2SpawnDisabled = await spawnL2.isDisabled();

// Baseline KSRRRAR only
await page.getByRole("button", { name: /KSRRRAR only/i }).click();
await page.waitForTimeout(600);
const countsPep = await page.locator("body").innerText();
checks.pepActive = /KSRRRAR only \(Pb²\+ fully absent\)/i.test(countsPep);
const spawnPb = page.getByRole("button", { name: /Spawn Pb/i });
checks.l1SpawnDisabled = await spawnPb.isDisabled();

// Both
await page.getByRole("button", { name: /^Both$/i }).click();
await page.waitForTimeout(500);
checks.bothActive = /Pb²\+ \+ KSRRRAR competition/i.test(await page.locator("body").innerText());

// Focus ROI
await page.getByRole("button", { name: /Focus catalytic His ROI/i }).click();
await page.waitForTimeout(500);
const hud = await page.locator("body").innerText();
checks.hudPb = /U Pb²\+/i.test(hud);
checks.hudKs = /U KSRRRAR/i.test(hud);

// Open edu panel fully
await page.getByText("Furin catalytic domain · Pb²⁺ · KSRRRAR").first().click().catch(() => {});
await page.waitForTimeout(300);
const edu = await page.locator("body").innerText();
checks.eduClassical = /classical continuum electrostatics only/i.test(edu);
checks.eduNoCo = !/Co²⁺/.test(edu);
checks.eduNoHis5 = !/His₅|His5 peptide|pentahistidine/i.test(edu);
checks.eduFurin = /Ser-His-Asp|catalytic histidine/i.test(edu);

await page.screenshot({ path: "/workspace/screenshots/moleculo-furin.png" });

const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ checks, failed, errors }, null, 2));
await browser.close();
process.exit(errors.length || failed.length ? 1 : 0);
