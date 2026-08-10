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

const demo = page.getByRole("button", { name: /Demo pH sweep/i });
await demo.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await demo.click();
console.log("clicked demo sweep");

let sawGap = false;
let lastBadge = "";
let onDone = false;
let offDone = false;
for (let i = 0; i < 70; i++) {
  await page.waitForTimeout(400);
  const body = await page.locator("body").innerText();
  if (body.includes("ΔpH hysteresis gap") || body.includes("hysteresis gap")) sawGap = true;
  if (body.includes("His switch · ON")) lastBadge = "ON";
  if (body.includes("His switch · OFF")) lastBadge = "OFF";
  // parse the two cards
  const onCard = body.match(/OFF→ON \(acidifying\)\s*\n?\s*(pH [\d.]+|— not yet)/);
  const offCard = body.match(/ON→OFF \(alkalizing\)\s*\n?\s*(pH [\d.]+|— not yet)/);
  onDone = onCard ? !onCard[1].includes("not yet") : false;
  offDone = offCard ? !offCard[1].includes("not yet") : false;
  const sweepRunning = body.includes("auto-sweep running");
  if (i % 5 === 0) {
    console.log(`t=${(i * 0.4).toFixed(1)}s badge=${lastBadge} on=${onCard?.[1]} off=${offCard?.[1]} sweep=${sweepRunning} gap=${sawGap}`);
  }
  if (onDone && offDone && sawGap) {
    console.log("FULL_LOOP_OK");
    break;
  }
  if (!sweepRunning && i > 15) {
    console.log("sweep finished; onDone", onDone, "offDone", offDone);
    break;
  }
}

const finalText = await page.locator("body").innerText();
const gapMatch = finalText.match(/ΔpH hysteresis gap[\s\S]{0,80}?(\d+\.\d+)/);
console.log("gapMatch", gapMatch?.[1] ?? "none");
console.log("has explorer", finalText.includes("Hysteresis explorer"));
console.log("has pure HH legend", finalText.includes("pure HH"));

await page.getByText("Hysteresis explorer").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/moleculo-hysteresis-panel.png" });
await page.screenshot({ path: "/workspace/screenshots/moleculo-hysteresis-loop.png", fullPage: false });

console.log("page errors:", errors.slice(0, 10));
console.log(errors.length ? "HAS_ERRORS" : "CLEAN_CONSOLE");
await browser.close();
process.exit(onDone && offDone ? 0 : 2);
