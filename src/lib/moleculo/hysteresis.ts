import {
  HIS_SWITCH_OFF_THRESHOLD,
  HIS_SWITCH_ON_THRESHOLD,
} from "./types";

/** One sample along the continuous score / binary switch path. */
export type HysteresisSample = {
  pH: number;
  score: number;
  protonation: number;
  switchOn: boolean;
  tNs: number;
  /** pH sweep direction at sample time */
  direction: "up" | "down" | "unknown";
};

export type CrossingEvent = {
  kind: "on" | "off";
  pH: number;
  score: number;
  tNs: number;
};

export const HYST_HISTORY_MAX = 280;

export const HYST_META = {
  onThreshold: HIS_SWITCH_ON_THRESHOLD,
  offThreshold: HIS_SWITCH_OFF_THRESHOLD,
  /** Width of the bistable band in score units */
  bandWidth: HIS_SWITCH_ON_THRESHOLD - HIS_SWITCH_OFF_THRESHOLD,
  pKa: 6.2,
  /** Approximate pH of pure-HH at ON threshold (descending) */
  purePhOn: (() => {
    const pKa = 6.2;
    return pKa - Math.log10(HIS_SWITCH_ON_THRESHOLD / (1 - HIS_SWITCH_ON_THRESHOLD));
  })(),
  /** Approximate pH of pure-HH at OFF threshold (ascending) */
  purePhOff: (() => {
    const pKa = 6.2;
    return pKa - Math.log10(HIS_SWITCH_OFF_THRESHOLD / (1 - HIS_SWITCH_OFF_THRESHOLD));
  })(),
  /** Approximate pH gap for a pure-HH His (pKa 6.2) ignoring PE bias */
  approxPhGap: (() => {
    const pKa = 6.2;
    const pHOn = pKa - Math.log10(HIS_SWITCH_ON_THRESHOLD / (1 - HIS_SWITCH_ON_THRESHOLD));
    const pHOff = pKa - Math.log10(HIS_SWITCH_OFF_THRESHOLD / (1 - HIS_SWITCH_OFF_THRESHOLD));
    return Math.abs(pHOff - pHOn);
  })(),
};

/**
 * Pure Henderson–Hasselbalch protonation (no PE bias) for reference curves.
 */
export function pureHH(pH: number, pKa = 6.2): number {
  return 1 / (1 + Math.pow(10, pH - pKa));
}

/**
 * Idealized binary response with hysteresis for a pure-HH score:
 * ascending pH (deprotonating): stay ON until offThreshold
 * descending pH (protonating): stay OFF until onThreshold
 */
export function idealHysteresisBranch(
  pH: number,
  direction: "up" | "down" | "unknown",
  prevOn: boolean,
  pKa = 6.2,
): { score: number; on: boolean } {
  const score = pureHH(pH, pKa);
  let on = prevOn;
  if (direction === "down" || (!prevOn && direction !== "up")) {
    // acidifying / starting OFF: flip ON when score rises past onThreshold
    if (!prevOn) on = score >= HIS_SWITCH_ON_THRESHOLD;
    else on = score > HIS_SWITCH_OFF_THRESHOLD;
  } else {
    // alkalizing / starting ON: flip OFF when score falls past offThreshold
    if (prevOn) on = score > HIS_SWITCH_OFF_THRESHOLD;
    else on = score >= HIS_SWITCH_ON_THRESHOLD;
  }
  return { score, on };
}

export function pushHistory(
  buf: HysteresisSample[],
  sample: HysteresisSample,
): HysteresisSample[] {
  buf.push(sample);
  if (buf.length > HYST_HISTORY_MAX) buf.shift();
  return buf;
}

/** Classify path relative to hysteresis band. */
export function bandRegion(score: number): "below" | "band" | "above" {
  if (score < HIS_SWITCH_OFF_THRESHOLD) return "below";
  if (score >= HIS_SWITCH_ON_THRESHOLD) return "above";
  return "band";
}

/**
 * From logged crossings, compute the most recent OFF→ON and ON→OFF pair
 * and the ΔpH hysteresis gap (path dependence measure).
 */
export function hysteresisGap(crossings: CrossingEvent[]): {
  lastOn: CrossingEvent | null;
  lastOff: CrossingEvent | null;
  deltaPh: number | null;
} {
  let lastOn: CrossingEvent | null = null;
  let lastOff: CrossingEvent | null = null;
  for (let i = crossings.length - 1; i >= 0; i--) {
    const c = crossings[i]!;
    if (c.kind === "on" && !lastOn) lastOn = c;
    if (c.kind === "off" && !lastOff) lastOff = c;
    if (lastOn && lastOff) break;
  }
  if (!lastOn || !lastOff) return { lastOn, lastOff, deltaPh: null };
  return { lastOn, lastOff, deltaPh: Math.abs(lastOff.pH - lastOn.pH) };
}

/** Sample pure-HH curve for SVG reference overlay. */
export function pureHHCurve(
  minPh: number,
  maxPh: number,
  steps = 48,
  pKa = 6.2,
): { pH: number; score: number }[] {
  const out: { pH: number; score: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const pH = minPh + ((maxPh - minPh) * i) / steps;
    out.push({ pH, score: pureHH(pH, pKa) });
  }
  return out;
}
