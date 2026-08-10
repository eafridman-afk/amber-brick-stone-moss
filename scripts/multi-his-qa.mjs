import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8080/";
const out = process.argv[3] || "/workspace/screenshots/moleculo-multi-his-focus.png";

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

// Focus His-switch ROI
const focusBtn = page.getByRole("button", { name: /Focus His-switch ROI/i });
if (await focusBtn.count()) {
  await focusBtn.click();
  await page.waitForTimeout(1200);
}

// Apply pathological scenario for multi-His ON
const pathBtn = page.getByRole("button", { name: /Pathological/i }).first();
if (await pathBtn.count()) {
  await pathBtn.click();
  await page.waitForTimeout(2000);
}

// Metal mode Co only
const coBtn = page.getByRole("button", { name: /^Co²⁺$/i });
if (await coBtn.count()) await coBtn.click();
await page.waitForTimeout(800);

// Mixture
const mixBtn = page.getByRole("button", { name: /Mixture/i });
if (await mixBtn.count()) await mixBtn.click();
await page.waitForTimeout(800);

// Spawn metal + His5
const spawnMetal = page.getByRole("button", { name: /Spawn metal/i });
if (await spawnMetal.count()) await spawnMetal.click();
const spawnHis5 = page.getByRole("button", { name: /Spawn His/i });
if (await spawnHis5.count()) await spawnHis5.click();
await page.waitForTimeout(1500);

// Check page has multi-his educational content and per-site HUD
const body = await page.locator("body").innerText();
const checks = {
  hasMultiHis: /Multi-His|five Histidine|5H/i.test(body),
  hasPbCo: /Pb²\+|Co²\+|pentahistidine|His₅/i.test(body),
  hasSiteHud: /Per-His site|H1|sites ON/i.test(body),
  hasCanvas: (await page.locator("canvas").count()) > 0,
};

await page.screenshot({ path: out, fullPage: false });

// Mobile viewport
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(800);
await page.screenshot({ path: "/workspace/screenshots/moleculo-multi-his-mobile.png", fullPage: false });

console.log(JSON.stringify({ checks, errors, bodySample: body.slice(0, 400) }, null, 2));
await browser.close();
