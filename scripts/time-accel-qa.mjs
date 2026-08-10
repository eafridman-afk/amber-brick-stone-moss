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
  timeAccelLabel: /Time acceleration/i.test(body0),
  displayWindow: /Display window/i.test(body0),
  tPrime: /t′|t'/.test(body0),
  btn5: await page.getByRole("button", { name: "5 s", exact: true }).count() > 0,
  btn10: await page.getByRole("button", { name: "10 s", exact: true }).count() > 0,
  btn15: await page.getByRole("button", { name: "15 s", exact: true }).count() > 0,
  canvas: await page.locator("canvas").count() > 0,
  perSiteStill: /Baseline ligand|Metal–His preference|Metal-His preference/i.test(body0),
};

await page.getByRole("button", { name: "5 s", exact: true }).click();
await page.waitForTimeout(500);
const after5 = await page.locator("body").innerText();
checks.after5 = /Display window:\s*5 s/i.test(after5);
checks.tPrimeFast = /t′\s*=\s*×3|t′ ×3/i.test(after5);

await page.getByRole("button", { name: "15 s", exact: true }).click();
await page.waitForTimeout(500);
const after15 = await page.locator("body").innerText();
checks.after15 = /Display window:\s*15 s/i.test(after15);
checks.tPrimeSlow = /t′\s*=\s*×1\.00|t′ ×1\.00|t′\s*=\s*×1\b/i.test(after15);

await page.getByRole("button", { name: "10 s", exact: true }).click();
await page.waitForTimeout(200);
await page.getByRole("button", { name: /Pathological/i }).click();
await page.waitForTimeout(1200);
const afterSc = await page.locator("body").innerText();
checks.scenario = /Pathological|His switch/i.test(afterSc);
checks.displayStill = /Display window:\s*10 s/i.test(afterSc);

// Measure conceptual time advancement
await page.getByRole("button", { name: "5 s", exact: true }).click();
await page.waitForTimeout(400);
const readUs = async () =>
  page.evaluate(() => {
    const el = document.body.innerText;
    const m = el.match(/([\d.]+)\s*μs/);
    return m ? parseFloat(m[1]) : -1;
  });

const t0 = await readUs();
await page.waitForTimeout(2000);
const t1 = await readUs();
const deltaFast = t1 - t0;

await page.getByRole("button", { name: "15 s", exact: true }).click();
await page.waitForTimeout(400);
const t2 = await readUs();
await page.waitForTimeout(2000);
const t3 = await readUs();
const deltaSlow = t3 - t2;

checks.timeAdvances = deltaFast > 0.5 && deltaSlow > 0.2;
checks.fastFasterThanSlow = deltaFast > deltaSlow * 1.2;

await page.screenshot({ path: "/workspace/screenshots/moleculo-time-accel.png" });

const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ checks, failed, errors, deltaFast, deltaSlow, t0, t1, t2, t3 }, null, 2));
await browser.close();
process.exit(errors.length || failed.length ? 1 : 0);
