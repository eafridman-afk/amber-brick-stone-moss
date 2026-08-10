import type {
  HisSiteRole,
  HisSiteState,
  ProteinProxyDef,
  ProteinProxyState,
  Particle,
  SimParams,
  ReceptorGeometryId,
} from "./types";
import {
  HIS_APPROACH_FAR,
  HIS_APPROACH_NEAR,
  HIS_APPROACH_FAR_NM,
  HIS_APPROACH_NEAR_NM,
  HIS_SITE_LABELS,
  HIS_SWITCH_OFF_THRESHOLD,
  HIS_SWITCH_ON_THRESHOLD,
  PROTEIN_BASE_RGB,
} from "./types";
import { chargeToT, divergingRedWhiteBlue } from "./colormap";
import {
  yukawaEnergy,
  metalHisPrefScale,
  metalHisEffectiveCharge,
  shortRangeWellForceMag,
  sceneToNm,
  nmToScene,
} from "./energy-kernel";
import { createProteinProxyDefs as createDefsFromGeometry } from "./geometries";

/** Create protein proxies for the selected public receptor geometry. */
export function createProteinProxyDefs(
  geometryId: ReceptorGeometryId = "furin",
): ProteinProxyDef[] {
  return createDefsFromGeometry(geometryId);
}

function makeHis194(pKa: number, pH: number, titratable = true): HisSiteState {
  const protonation = titratable ? hisProtonationHH(pKa, pH) : 0;
  const charge = titratable ? hisFormalCharge(protonation) : 0;
  const switchOn = titratable && protonation >= HIS_SWITCH_ON_THRESHOLD;
  return {
    index: 0,
    label: HIS_SITE_LABELS[0] ?? "His194",
    pKa,
    protonation,
    charge,
    continuousScore: protonation,
    switchOn,
    switchDisplayOn: switchOn,
    switchOverride: null,
    clickPulse: 0,
    localEnergy: 0,
    nearestMetal: Infinity,
    nearestHis5: Infinity,
    role: "target",
  };
}

export function initProteinStates(defs: ProteinProxyDef[], pH: number): ProteinProxyState[] {
  return defs.map((d) => {
    const titratable = d.titratableHis !== false && d.geometryId === "furin";
    const pKa = d.hisSitePkas[0] ?? d.hisPka;
    const hisSites = [makeHis194(pKa, pH, titratable)];
    // Non-titratable ROI may carry fixed charge from the ROI bead
    const roiBead = d.beads.find((b) => b.isHisRoi);
    const hisProtonation = hisSites[0]!.protonation;
    const hisCharge = titratable
      ? hisProtonation
      : (roiBead?.fixedCharge ?? 0);
    if (!titratable && hisSites[0]) {
      hisSites[0].charge = hisCharge;
      hisSites[0].protonation = 0;
      hisSites[0].switchOn = false;
      hisSites[0].switchDisplayOn = false;
      hisSites[0].label = roiBead?.residueLabel ?? "ROI";
      hisSites[0].role = (roiBead?.hisRole as HisSiteRole) ?? "generic";
    }
    const switchOn = hisSites[0]!.switchDisplayOn;
    return {
      id: d.id,
      label: d.label,
      x: d.x,
      y: d.y,
      z: d.z,
      beads: d.beads,
      hisPka: d.hisPka,
      hisSitePkas: [pKa],
      geometryId: d.geometryId,
      geometryCharacter: d.geometryCharacter,
      targetHisIndex: 0,
      titratableHis: titratable,
      hisSites,
      hisProtonation,
      hisCharge,
      response: 0,
      dominantLigand: null,
      nearestL1: Infinity,
      nearestL2: Infinity,
      confScale: switchOn ? 0.08 : 0,
      confAngle: 0,
      stressTint: 0,
      localEnergy: 0,
      continuousScore: hisProtonation,
      switchOn,
      switchOverride: null,
      switchDisplayOn: switchOn,
      clickPulse: 0,
      cleftOpen: switchOn ? 1 : 0,
    };
  });
}

/**
 * Histidine protonation via Henderson–Hasselbalch (basic side chain).
 * pH ≪ pKa → protonated (fraction → 1, charge → +1)
 * pH ≫ pKa → deprotonated (fraction → 0, charge → 0)
 */
export function hisProtonationHH(pKa: number, pH: number): number {
  return 1 / (1 + Math.pow(10, pH - pKa));
}

/** Formal continuum charge of His: +1 when fully protonated, 0 when deprotonated. */
export function hisFormalCharge(protonation: number): number {
  return Math.min(1, Math.max(0, protonation));
}

export function hisSiteWorldPos(
  prot: ProteinProxyState,
  siteIndex: number,
): { x: number; y: number; z: number } {
  const bead =
    prot.beads.find((b) => b.isHisRoi && b.hisIndex === siteIndex) ??
    prot.beads.find((b) => b.morph === "his") ??
    prot.beads.find((b) => b.isHisRoi) ??
    prot.beads[0]!;
  return beadWorldPos(prot, bead);
}

/** ROI origin = His194. */
export function roiWorldPos(p: ProteinProxyState): { x: number; y: number; z: number } {
  return hisSiteWorldPos(p, p.targetHisIndex ?? 0);
}

export function beadWorldPos(
  prot: ProteinProxyState,
  bead: ProteinProxyState["beads"][number],
): { x: number; y: number; z: number; radius: number } {
  const open = prot.cleftOpen;
  const ca = Math.cos(prot.confAngle);
  const sa = Math.sin(prot.confAngle);
  let lx = bead.lx;
  let ly = bead.ly;
  let lz = bead.lz;
  // Mild open-cleft: jaw beads expand with cleftOpen
  if (bead.morph === "jawA") {
    lx += open * 0.06;
    ly += open * 0.03;
  } else if (bead.morph === "jawB") {
    lx -= open * 0.06;
    ly += open * 0.03;
  } else if (bead.morph === "his") {
    ly += open * 0.02;
  }
  // Small rotation about Y for conformational click
  const rx = lx * ca + lz * sa;
  const rz = -lx * sa + lz * ca;
  const scale = 1 + prot.confScale * 0.12;
  return {
    x: prot.x + rx * scale,
    y: prot.y + ly * scale,
    z: prot.z + rz * scale,
    radius: bead.radius * (1 + (bead.isHisRoi ? open * 0.08 : 0)),
  };
}

export function updateHisSwitchBinary(
  prot: ProteinProxyState,
  energyBias = 0,
  _dt = 0,
): void {
  const site = prot.hisSites[0];
  if (!site) return;
  const score = Math.min(
    1.05,
    Math.max(-0.02, site.protonation + energyBias * 0.35),
  );
  site.continuousScore = score;
  prot.continuousScore = score;

  if (site.switchOverride != null) {
    site.switchOn = site.switchOverride;
    site.switchDisplayOn = site.switchOverride;
  } else {
    // Mild hysteresis around 0.5
    if (site.switchOn) {
      if (score < HIS_SWITCH_OFF_THRESHOLD) site.switchOn = false;
    } else {
      if (score >= HIS_SWITCH_ON_THRESHOLD) site.switchOn = true;
    }
    site.switchDisplayOn = site.switchOn;
  }
  prot.switchOn = site.switchOn;
  prot.switchDisplayOn = site.switchDisplayOn;
  prot.hisProtonation = site.protonation;
  prot.hisCharge = site.charge;
  const confTarget = site.switchDisplayOn ? 0.12 : 0;
  prot.confScale += (confTarget - prot.confScale) * 0.28;
  prot.cleftOpen += ((site.switchDisplayOn ? 1 : 0) - prot.cleftOpen) * 0.22;
  prot.clickPulse = Math.max(0, prot.clickPulse - 0.06);
}

function nonPhysStress(pH: number): number {
  if (pH >= 7.0 && pH <= 7.5) return 0;
  if (pH < 7) return Math.min(1, (7 - pH) / 3);
  return Math.min(1, (pH - 7.5) / 3);
}

export function updateProteinResponses(
  proteins: ProteinProxyState[],
  particles: Particle[],
  pH: number,
  params?: SimParams,
): void {
  const stress = nonPhysStress(pH);
  const k = params?.coulombK ?? 4.2;
  const lambda = Math.max(
    params?.debyeNm ?? (params?.debyeLength != null ? params.debyeLength * 4 : 0.8),
    1e-9,
  );
  const shell = nmToScene(HIS_APPROACH_FAR_NM) * 1.8;
  const prefOn = params?.metalHisPrefEnabled ?? true;
  const prefFactor = params?.metalHisPrefFactor ?? 1.8;

  for (const prot of proteins) {
    if (!prot.hisSites?.length) {
      prot.hisSites = [makeHis194(prot.hisPka, pH, prot.titratableHis !== false)];
    }
    if (prot.titratableHis === false) {
      // Fixed continuum ROI charge (allosteric / pore / α7-like) — pH acts via ligands only
      const roi = prot.beads.find((b) => b.isHisRoi);
      const fq = roi?.fixedCharge ?? 0;
      for (const site of prot.hisSites) {
        site.protonation = 0;
        site.charge = fq;
        site.switchOn = false;
        site.switchDisplayOn = false;
      }
      prot.hisProtonation = 0;
      prot.hisCharge = fq;
      prot.switchOn = false;
      prot.switchDisplayOn = false;
    } else {
      for (const site of prot.hisSites) {
        site.protonation = hisProtonationHH(site.pKa, pH);
        site.charge = hisFormalCharge(site.protonation);
      }
      prot.hisProtonation = prot.hisSites[0]!.protonation;
      prot.hisCharge = prot.hisSites[0]!.charge;
    }

    let nearL1 = Infinity;
    let nearL2 = Infinity;
    let occL1 = 0;
    let occL2 = 0;
    let eL1 = 0;
    let eL2 = 0;
    let e12 = 0;

    const metals = particles.filter((p) => p.ligandClass === "ligand1");
    const peptides = particles.filter((p) => p.ligandClass === "ligand2");

    for (const site of prot.hisSites) {
      const pos = hisSiteWorldPos(prot, site.index);
      let eSite = 0;
      let nMetal = Infinity;
      let nPep = Infinity;
      const qMetalEff = metalHisEffectiveCharge(site.protonation, prefOn);
      for (const p of metals) {
        const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
        if (d < nMetal) nMetal = d;
        if (d < shell) {
          const sc = metalHisPrefScale(site.protonation, d, prefFactor, prefOn);
          const u = sc * yukawaEnergy(qMetalEff, p.q, d, k, lambda);
          eSite += u;
          eL1 += u;
        }
        if (d < nmToScene(HIS_APPROACH_FAR_NM)) occL1 += 1;
      }
      for (const p of peptides) {
        const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
        if (d < nPep) nPep = d;
        if (d < shell) {
          const u = yukawaEnergy(site.charge, p.q, d, k, lambda);
          eSite += u;
          eL2 += u;
        }
        if (d < nmToScene(HIS_APPROACH_FAR_NM)) occL2 += 1;
      }
      site.localEnergy = eSite;
      site.nearestMetal = nMetal;
      site.nearestHis5 = nPep;
      if (nMetal < nearL1) nearL1 = nMetal;
      if (nPep < nearL2) nearL2 = nPep;
    }

    for (const bead of prot.beads) {
      const fq = bead.fixedCharge ?? 0;
      if (Math.abs(fq) < 0.01) continue;
      const pos = beadWorldPos(prot, bead);
      for (const p of metals) {
        const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
        if (d < shell * 1.2) eL1 += yukawaEnergy(fq, p.q, d, k, lambda);
      }
      for (const p of peptides) {
        const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
        if (d < shell * 1.2) eL2 += yukawaEnergy(fq, p.q, d, k, lambda);
      }
    }

    // L1–L2 only when both present
    for (const a of metals) {
      for (const b of peptides) {
        const r = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (r < shell * 2) e12 += yukawaEnergy(a.q, b.q, r, k, lambda);
      }
    }

    prot.nearestL1 = nearL1;
    prot.nearestL2 = nearL2;
    prot.localEnergy = eL1 + eL2 + 0.35 * e12;
    const env = Math.abs(eL1) + Math.abs(eL2) + 0.35 * Math.abs(e12);
    const occBoost = (occL1 > 0 ? 1 : 0) + (occL2 > 0 ? 1 : 0);
    prot.response =
      Math.min(1, env * 0.18 + occBoost * 0.35) *
      (0.55 + 0.45 * stress);
    prot.dominantLigand =
      Math.abs(eL1) >= Math.abs(eL2) ? (metals.length ? "ligand1" : null) : "ligand2";
    if (!metals.length && !peptides.length) prot.dominantLigand = null;

    const energyBias =
      (eL1 + eL2) * 0.02 * (prot.hisProtonation > 0.5 ? 1 : 0.4);
    updateHisSwitchBinary(prot, energyBias);
    const confTarget =
      prot.response * 0.35 * (prot.dominantLigand === "ligand2" ? 0.7 : 1) +
      (prot.switchDisplayOn ? 0.08 : 0);
    prot.confScale += (confTarget - prot.confScale) * 0.12;
    const tintTarget = Math.min(1, stress * 0.6 + prot.response * 0.5);
    prot.stressTint += (tintTarget - prot.stressTint) * 0.16;
  }
}

/**
 * Yukawa forces from His194 + continuum surface charges.
 * Distances enter the potential in nanometres (r_nm = r_scene · 4).
 */
export function hisSiteForces(
  particles: Particle[],
  proteins: ProteinProxyState[],
  params: SimParams | {
    coulombK: number;
    debyeLength: number;
    debyeNm?: number;
    metalHisPrefFactor?: number;
    metalHisPrefEnabled?: boolean;
    shortRangeWellEnabled?: boolean;
    shortRangeWellDepthKt?: number;
    shortRangeWellSigmaNm?: number;
    shortRangeWellCutoffNm?: number;
  },
  outFx: Float32Array,
  outFy: Float32Array,
  outFz: Float32Array,
): void {
  const k = params.coulombK;
  const lambdaNm = Math.max(
    (params as SimParams).debyeNm ??
      (params.debyeLength != null ? params.debyeLength * 4 : 0.8),
    1e-9,
  );
  const invL = 1 / lambdaNm;
  const maxRScene = Math.max(nmToScene(HIS_APPROACH_FAR_NM) * 3.5, nmToScene(lambdaNm * 5)); // cutoff in same units as particle coords
  const prefOn = params.metalHisPrefEnabled ?? true;
  const prefFactor = params.metalHisPrefFactor ?? 1.8;
  const wellOn = params.shortRangeWellEnabled ?? false;
  const wellDepth = params.shortRangeWellDepthKt ?? 3;
  const wellSigma = params.shortRangeWellSigmaNm ?? 0.4;
  const wellCut = params.shortRangeWellCutoffNm ?? 0.8;

  for (const prot of proteins) {
    const sites = prot.hisSites?.length
      ? prot.hisSites
      : ([{ charge: prot.hisCharge, index: 0, protonation: prot.hisProtonation }] as HisSiteState[]);
    for (const site of sites) {
      const protonation = site.protonation ?? prot.hisProtonation;
      const pos = hisSiteWorldPos(prot, site.index ?? 0);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        const dx = p.x - pos.x;
        const dy = p.y - pos.y;
        const dz = p.z - pos.z;
        const r2 = dx * dx + dy * dy + dz * dz + 1e-16;
        const r = Math.sqrt(r2);
        if (r > maxRScene) continue;
        const rNm = sceneToNm(r);
        const isMetal = p.ligandClass === "ligand1";
        let qSite = site.charge ?? prot.hisCharge;
        let scale = 1;
        if (isMetal) {
          qSite = metalHisEffectiveCharge(protonation, prefOn);
          scale = metalHisPrefScale(protonation, r, prefFactor, prefOn);
        }
        if (Math.abs(qSite) >= 0.005 || Math.abs(scale - 1) >= 1e-6) {
          const screening = Math.exp(-rNm * invL);
          // |∇_nm U| — nm-consistent with energy (no extra ×4)
          const fMag =
            scale * k * qSite * p.q * screening * (1 / (rNm * rNm) + invL / rNm);
          const invR = 1 / r;
          outFx[i]! += fMag * dx * invR;
          outFy[i]! += fMag * dy * invR;
          outFz[i]! += fMag * dz * invR;
        }

        if (isMetal && wellOn) {
          const fWell = shortRangeWellForceMag(
            protonation,
            r,
            wellDepth,
            wellSigma,
            wellCut,
            true,
          );
          if (fWell > 0) {
            const invR = 1 / r;
            outFx[i]! -= fWell * dx * invR;
            outFy[i]! -= fWell * dy * invR;
            outFz[i]! -= fWell * dz * invR;
          }
        }
      }
    }

    for (const bead of prot.beads) {
      // ROI charge is applied via hisSites; skip fixedCharge on isHisRoi beads
      if (bead.isHisRoi) continue;
      const fq = bead.fixedCharge ?? 0;
      if (Math.abs(fq) < 0.01) continue;
      const pos = beadWorldPos(prot, bead);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        const dx = p.x - pos.x;
        const dy = p.y - pos.y;
        const dz = p.z - pos.z;
        const r2 = dx * dx + dy * dy + dz * dz + 1e-16;
        const r = Math.sqrt(r2);
        if (r > maxRScene) continue;
        const rNm = sceneToNm(r);
        const screening = Math.exp(-rNm * invL);
        const fMag = k * fq * p.q * screening * (1 / (rNm * rNm) + invL / rNm);
        const invR = 1 / r;
        outFx[i]! += fMag * dx * invR;
        outFy[i]! += fMag * dy * invR;
        outFz[i]! += fMag * dz * invR;
      }
    }
  }
}

export function hisRoiColor(
  protonation: number,
  _response: number,
  switchOn: boolean,
  clickPulse: number,
  _role: HisSiteRole = "target",
): [number, number, number] {
  // RWB: protonated (+1) blue, deprotonated (0) white
  const t = chargeToT(protonation, 1);
  let [r, g, b] = divergingRedWhiteBlue(t);
  if (switchOn) {
    r = r * 0.85 + 0.05;
    g = g * 0.85 + 0.15;
    b = Math.min(1, b * 0.7 + 0.45);
  }
  if (clickPulse > 0) {
    const p = Math.min(1, clickPulse);
    r = r * (1 - p) + 1 * p;
    g = g * (1 - p) + 1 * p;
    b = b * (1 - p) + 1 * p;
  }
  return [r, g, b];
}

export function proteinBodyColor(
  stressTint: number,
  hisCharge: number,
  switchOn: boolean,
  clickPulse: number,
): [number, number, number] {
  let [r, g, b] = PROTEIN_BASE_RGB;
  // Mild stress tint toward red (negative map) without yellow/green
  r = r + stressTint * 0.12;
  g = g - stressTint * 0.04;
  b = b - stressTint * 0.02;
  if (switchOn) {
    b = Math.min(1, b + 0.08);
  }
  if (clickPulse > 0.2) {
    const p = Math.min(1, clickPulse);
    r = r * (1 - 0.3 * p) + 0.9 * 0.3 * p;
    g = g * (1 - 0.3 * p) + 0.9 * 0.3 * p;
    b = b * (1 - 0.3 * p) + 0.95 * 0.3 * p;
  }
  void hisCharge;
  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, b)),
  ];
}
