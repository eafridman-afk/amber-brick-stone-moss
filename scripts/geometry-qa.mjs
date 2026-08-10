import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

const body0 = await page.locator("body").innerText();
const checks = {
  geometryLabel: /Receptor geometry/i.test(body0),
  generic: /Generic multi-His/i.test(body0),
  orthosteric: /Orthosteric/i.test(body0),
  allosteric: /Allosteric/i.test(body0),
  mixed: /Mixed/i.test(body0),
  exportBtn: await page.getByRole("button", { name: /Export ROI snapshot/i }).count() > 0,
  canvas: await page.locator("canvas").count() > 0,
  timeAccel: /Time acceleration/i.test(body0),
  baseline: /Baseline ligand/i.test(body0),
};

const clickGeo = async (name) => {
  await page.getByRole("button", { name: new RegExp(`^${name}`, "i") }).first().click();
  await page.waitForTimeout(700);
};

await clickGeo("Orthosteric");
let body = await page.locator("body").innerText();
checks.orthoActive = /Orthosteric His-gate/i.test(body);
checks.orthoCharacter = /Character:\s*orthosteric/i.test(body);

await page.getByRole("button", { name: /Focus His-switch ROI/i }).click();
await page.waitForTimeout(500);

await clickGeo("Allosteric");
body = await page.locator("body").innerText();
checks.alloActive = /Allosteric His-switch/i.test(body);

await clickGeo("Mixed");
body = await page.locator("body").innerText();
checks.mixedActive = /Mixed orthosteric/i.test(body);

await page.getByRole("button", { name: /Export ROI snapshot/i }).click();
await page.waitForTimeout(600);
body = await page.locator("body").innerText();
checks.exportFeedback = /Copied JSON|Logged to console|Export failed/i.test(body);
checks.exportOk = /Copied JSON|Logged to console/i.test(body);
checks.perSite = /Per-His site|θ protonation|U Pb/i.test(body);
checks.pref = /Metal–His preference|Metal-His preference/i.test(body);

await page.screenshot({ path: "/workspace/screenshots/moleculo-geometry.png" });

await clickGeo("Orthosteric");
await page.getByRole("button", { name: /Focus His-switch ROI/i }).click();
await page.waitForTimeout(500);
const panel = page.locator("aside[aria-label='Simulation controls']");
await panel.evaluate((el) => {
  for (const n of el.querySelectorAll("section")) {
    if (n.textContent?.includes("Per-His") || n.textContent?.includes("Multi-His energy")) {
      n.scrollIntoView({ block: "start" });
      break;
    }
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/moleculo-geometry-ortho.png" });

const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ checks, failed, errors }, null, 2));
await browser.close();
process.exit(errors.length || failed.length ? 1 : 0);
