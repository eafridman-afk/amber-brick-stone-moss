import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);

const results = {};
for (const name of ["Physiological", "Stress / Acidosis", "Pathological"]) {
  const btn = page.getByRole("button", { name: new RegExp(name, "i") }).first();
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForTimeout(800);
  const body = await page.locator("body").innerText();
  results[name] = {
    banner: body.includes(name) || body.includes("His switch"),
    on: body.includes("His switch · ON"),
    off: body.includes("His switch · OFF"),
    competitive: /competitive|U_L1/i.test(body),
    ph: (body.match(/pH\s+([\d.]+)/) || [])[1],
  };
  console.log(name, results[name]);
}

await page.getByText("Scenario presets").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: "/workspace/screenshots/moleculo-scenarios.png" });

// pathological should show ON
const path = results["Pathological"];
const phys = results["Physiological"];
const ok = path.on && phys.off && errors.length === 0;
console.log(ok ? "SCENARIO_QA_OK" : "SCENARIO_QA_FAIL");
console.log("errors", errors.slice(0, 5));
await browser.close();
process.exit(ok ? 0 : 2);
