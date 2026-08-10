/**
 * Diverging red–white–blue colormap for electrostatic quantities.
 * t ∈ [0,1]:
 *   0   → red   (−1 / negative charge or potential)
 *   0.5 → white (0 / neutral)
 *   1   → blue  (+1 / positive charge or potential)
 */
export function divergingRedWhiteBlue(t: number): [number, number, number] {
  const x = Math.min(1, Math.max(0, t));
  if (x < 0.5) {
    // red → white
    const u = x / 0.5; // 0 at red, 1 at white
    // pure red #ef4444-ish → white
    return [0.94 + 0.06 * u, 0.27 + 0.73 * u, 0.27 + 0.73 * u];
  }
  // white → blue
  const u = (x - 0.5) / 0.5; // 0 at white, 1 at blue
  // white → pure blue #2563eb-ish
  return [1 - 0.85 * u, 1 - 0.61 * u, 1 - 0.08 * u];
}

/** @deprecated Alias — use divergingRedWhiteBlue. Kept so call sites compile. */
export function divergingBlueBlackRed(t: number): [number, number, number] {
  return divergingRedWhiteBlue(t);
}

export function colorCss(t: number): string {
  const [r, g, b] = divergingRedWhiteBlue(t);
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

/** Map charge (e) to colormap t, centered at 0 (white). Negative → red, positive → blue. */
export function chargeToT(q: number, scale = 3): number {
  const n = Math.tanh(q / scale);
  return 0.5 + 0.5 * n;
}

/** Map pH 1.5–10.5 → t with white at ~7.3 physiological. Acidic → red, basic → blue. */
export function pHToT(pH: number): number {
  const mid = 7.3;
  const n = Math.tanh((pH - mid) / 2.8);
  return 0.5 + 0.5 * n;
}

/** Map potential to colormap (white at 0). */
export function potentialToT(phi: number, scale = 2.5): number {
  return 0.5 + 0.5 * Math.tanh(phi / scale);
}
