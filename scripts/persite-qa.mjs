import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const out = process.argv[3] || "/workspace/screenshots/moleculo-persite-focus.png";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

await page.getByRole("button", { name: /Focus His-switch ROI/i }).click();
await page.waitForTimeout(1000);

const body = await page.locator("body").innerText();
const checks = {
  perSite: /Per-His site/i.test(body),
  h1: /\bH1\b/.test(body),
  h5: /\bH5\b/.test(body),
  occupancy: /Occupancy/i.test(body),
  uPb: /U Pb/i.test(body),
  uCo: /U Co/i.test(body),
  uHis5: /U His/i.test(body),
  baseline: /Baseline ligand mode/i.test(body),
  metalPref: /Metal–His preference|Metal-His preference/i.test(body),
  l1Only: /L1 only/i.test(body),
  l2Only: /L2 only/i.test(body),
  both: /\bBoth\b/.test(body),
  forceMag: /\|F\| metal/i.test(body) || /\|F\|/i.test(body),
};

await page.getByRole("button", { name: "L1 only" }).click();
await page.waitForTimeout(600);
const afterL1 = await page.locator("body").innerText();
checks.l1Active = /Metals only/i.test(afterL1);

await page.getByRole("button", { name: "L2 only" }).click();
await page.waitForTimeout(600);
const afterL2 = await page.locator("body").innerText();
checks.l2Active = /His₅ peptide only|His5 peptide only/i.test(afterL2);

await page.getByRole("button", { name: "Both", exact: true }).click();
await page.waitForTimeout(400);

const prefSwitch = page.getByRole("switch", { name: /Enable metal-His preferential/i });
if (await prefSwitch.count()) {
  await prefSwitch.click();
  await page.waitForTimeout(200);
  await prefSwitch.click();
}

await page.screenshot({ path: out, fullPage: false });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/moleculo-persite-mobile.png" });

const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ checks, failed, errors, screenshot: out }, null, 2));
await browser.close();
process.exit(errors.length || failed.length ? 1 : 0);
