import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);
await page.getByRole("button", { name: /Focus His-switch ROI/i }).click();
await page.waitForTimeout(800);
// Scroll panel to energy HUD
const panel = page.locator("aside[aria-label='Simulation controls']");
await panel.evaluate((el) => {
  const nodes = el.querySelectorAll("section");
  for (const n of nodes) {
    if (n.textContent?.includes("Per-His site")) {
      n.scrollIntoView({ block: "start" });
      break;
    }
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/moleculo-persite-hud.png" });
console.log("ok");
await browser.close();
