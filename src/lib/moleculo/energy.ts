import { nmToScene } from "./energy-kernel";
/**
 * ROI energy snapshot — Yukawa terms for exclusive peptide baselines.
 * L1 = KSRRRAR, L2 = PRARR. Classical continuum only.
 */
import type { HisSiteState, Particle, ProteinProxyState, SimParams } from "./types";
import { HIS_APPROACH_FAR_NM } from "./types";
import {
  sceneToNm,
  yukawaEnergy,
  yukawaForceMag,
  shortRangeWellEnergy,
  shortRangeWellForceMag,
} from "./energy-kernel";
import { hisSiteWorldPos, roiWorldPos, beadWorldPos } from "./proteins";

export { yukawaEnergy, yukawaForceMag, sceneToNm };

const OCCUPANCY_R = () => nmToScene(HIS_APPROACH_FAR_NM);

export type OccupantKind = "pb" | "peptide" | null;

export type HisSiteEnergy = {
  index: number;
  label: string;
  role: string;
  protonation: number;
  switchOn: boolean;
  energyPb: number;
  energyCo: number;
  energyMetal: number;
  energyHis5: number;
  energyTotal: number;
  nearestMetalNm: number;
  nearestHis5Nm: number;
  nearestLigandKind: OccupantKind;
  nearestLigandLabel: string;
  nearestLigandNm?: number;
  occupancyLabel?: string;
};

export type ForceArrow = {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  energy: number;
  kind: string;
};

export type RoiEnergySnapshot = {
  energyL1His: number;
  energyL2His: number;
  energyL3His: number;
  energyL4His: number;
  energyL1L2: number;
  energyAsp: number;
  energyCanyon: number;
  energyWell: number;
  energyTotal: number;
  forceMagL1His: number;
  forceMagL2His: number;
  forceMagL1L2: number;
  nearestL1Nm: number;
  nearestL2Nm: number;
  nearestL3Nm: number;
  nearestL4Nm: number;
  nearestL1Id: number | null;
  nearestL2Id: number | null;
  hisCharge: number;
  hisProtonation: number;
  shortRangeWellEnabled: boolean;
  siteEnergies: HisSiteEnergy[];
  arrows: ForceArrow[];
  /** UI / snapshot helpers */
  regime?: string;
  sitesOn?: number;
  sitesTotal?: number;
  occL1?: number;
  occL2?: number;
  switchDisplayOn?: boolean;
  switchOverride?: boolean | null;
  continuousScore?: number;
};

export function computeRoiEnergy(
  prot: ProteinProxyState,
  particles: Particle[],
  params: SimParams,
): RoiEnergySnapshot {
  const k = params.coulombK;
  // Yukawa λ_D in nanometres (r is converted scene→nm inside the kernel)
  const lambda = Math.max(params.debyeNm || sceneToNm(params.debyeLength), 1e-9);
  const wellOn = params.shortRangeWellEnabled;
  const wellDepth = params.shortRangeWellDepthKt;
  const wellSigma = params.shortRangeWellSigmaNm;
  const wellCut = params.shortRangeWellCutoffNm;

  const l1 = particles.filter((p) => p.ligandClass === "ligand1");
  const l2 = particles.filter((p) => p.ligandClass === "ligand2");
  const l3 = particles.filter((p) => p.ligandClass === "ligand3");
  const l4 = particles.filter((p) => p.ligandClass === "ligand4");

  let nearestL1 = Infinity;
  let nearestL2 = Infinity;
  let nearestL3 = Infinity;
  let nearestL4 = Infinity;
  let nearestL1Id: number | null = null;
  let nearestL2Id: number | null = null;
  let energyL1His = 0;
  let energyL2His = 0;
  let energyL3His = 0;
  let energyL4His = 0;
  let forceMagL1His = 0;
  let forceMagL2His = 0;
  let energyAsp = 0;
  let energyCanyon = 0;
  let energyWell = 0;
  let energyL1L2 = 0;
  let forceMagL1L2 = 0;

  const sites: HisSiteState[] = prot.hisSites?.length
    ? prot.hisSites
    : [
        {
          index: 0,
          label: "His194",
          pKa: prot.hisPka,
          protonation: prot.hisProtonation,
          charge: prot.hisCharge,
          continuousScore: prot.continuousScore,
          switchOn: prot.switchOn,
          switchDisplayOn: prot.switchDisplayOn,
          switchOverride: null,
          clickPulse: 0,
          localEnergy: 0,
          nearestMetal: Infinity,
          nearestHis5: Infinity,
          role: "target",
        },
      ];

  const siteEnergies: HisSiteEnergy[] = [];
  const arrows: ForceArrow[] = [];
  const shell = OCCUPANCY_R() * 2.8;

  for (const site of sites) {
    const pos = hisSiteWorldPos(prot, site.index);
    let eL1 = 0;
    let eL2 = 0;
    let nL1 = Infinity;
    let nL2 = Infinity;
    let nearestKind: OccupantKind = null;
    let nearestDist = Infinity;
    let nearestLabel = "—";

    for (const p of l1) {
      const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
      if (r < nL1) {
        nL1 = r;
        if (r < nearestL1) {
          nearestL1 = r;
          nearestL1Id = p.id;
        }
      }
      if (r < nearestDist) {
        nearestDist = r;
        nearestKind = "peptide";
        nearestLabel = "KSRRRAR";
      }
      if (r < shell) {
        const u = yukawaEnergy(site.charge, p.q, r, k, lambda);
        eL1 += u;
        forceMagL1His += yukawaForceMag(site.charge, p.q, r, k, lambda);
        if (wellOn) {
          const uw = shortRangeWellEnergy(site.protonation, r, wellDepth, wellSigma, wellCut, true);
          eL1 += uw;
          energyWell += uw;
          forceMagL1His += shortRangeWellForceMag(
            site.protonation,
            r,
            wellDepth,
            wellSigma,
            wellCut,
            true,
          );
        }
      }
    }

    for (const p of l2) {
      const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
      if (r < nL2) {
        nL2 = r;
        if (r < nearestL2) {
          nearestL2 = r;
          nearestL2Id = p.id;
        }
      }
      if (r < nearestDist) {
        nearestDist = r;
        nearestKind = "peptide";
        nearestLabel = "peptide";
      }
      if (r < shell) {
        eL2 += yukawaEnergy(site.charge, p.q, r, k, lambda);
        forceMagL2His += yukawaForceMag(site.charge, p.q, r, k, lambda);
      }
    }

    let eL3 = 0;
    let eL4 = 0;
    for (const p of l3) {
      const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
      if (r < nearestL3) nearestL3 = r;
      if (r < nL2) nL2 = r;
      if (r < nearestL2) {
        nearestL2 = r;
        nearestL2Id = p.id;
      }
      if (r < nearestDist) {
        nearestDist = r;
        nearestKind = "peptide";
        nearestLabel = "L3";
      }
      if (r < shell) {
        eL3 += yukawaEnergy(site.charge, p.q, r, k, lambda);
      }
    }
    for (const p of l4) {
      const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
      if (r < nearestL4) nearestL4 = r;
      if (r < nL2) nL2 = r;
      if (r < nearestL2) {
        nearestL2 = r;
        nearestL2Id = p.id;
      }
      if (r < nearestDist) {
        nearestDist = r;
        nearestKind = "peptide";
        nearestLabel = "ACh";
      }
      if (r < shell) {
        eL4 += yukawaEnergy(site.charge, p.q, r, k, lambda);
      }
    }

    energyL1His += eL1;
    energyL2His += eL2;
    energyL3His += eL3;
    energyL4His += eL4;

    siteEnergies.push({
      index: site.index,
      label: site.label,
      role: "catalytic His",
      protonation: site.protonation,
      switchOn: site.switchDisplayOn,
      energyPb: eL1,
      energyCo: 0,
      energyMetal: eL1,
      energyHis5: eL2,
      energyTotal: eL1 + eL2 + eL3 + eL4,

      nearestMetalNm: nL1 === Infinity ? -1 : sceneToNm(nL1),
      nearestHis5Nm: nL2 === Infinity ? -1 : sceneToNm(nL2),
      nearestLigandKind: nearestKind,
      nearestLigandLabel: nearestLabel,
      nearestLigandNm: nearestDist === Infinity ? -1 : sceneToNm(nearestDist),
      occupancyLabel:
        nearestDist === Infinity
          ? "empty"
          : `${nearestLabel} @ ${sceneToNm(nearestDist).toFixed(2)} nm`,
    });
  }

  // Asp153 + canyon / pore continuum fixed charges — all active ligand classes
  // (never gated on L1/Pb presence)
  const allLigands = [...l1, ...l2, ...l3, ...l4];
  for (const bead of prot.beads) {
    const fq = bead.fixedCharge ?? 0;
    if (Math.abs(fq) < 0.01) continue;
    const pos = beadWorldPos(prot, bead);
    let e = 0;
    for (const p of allLigands) {
      const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
      if (r < shell * 1.2) e += yukawaEnergy(fq, p.q, r, k, lambda);
    }
    if (bead.morph === "asp") energyAsp += e;
    else energyCanyon += e;
  }

  // Inter-ligand competition near ROI — all class pairs (not gated on L1)
  const roi = roiWorldPos(prot);
  const nearRoi = (p: Particle) =>
    Math.hypot(p.x - roi.x, p.y - roi.y, p.z - roi.z) <= shell * 2;
  const classes: Particle[][] = [l1, l2, l3, l4];
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      for (const a of classes[i]!) {
        if (!nearRoi(a)) continue;
        for (const b of classes[j]!) {
          const r = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (r > shell * 2) continue;
          energyL1L2 += yukawaEnergy(a.q, b.q, r, k, lambda);
          forceMagL1L2 += yukawaForceMag(a.q, b.q, r, k, lambda);
        }
      }
    }
  }

  // Sparse force arrows: nearest L1 and L2 to His
  const hisPos = hisSiteWorldPos(prot, 0);
  if (nearestL1Id != null) {
    const p = l1.find((x) => x.id === nearestL1Id);
    if (p) {
      arrows.push({
        ax: p.x,
        ay: p.y,
        az: p.z,
        bx: hisPos.x,
        by: hisPos.y,
        bz: hisPos.z,
        energy: energyL1His,
        kind: "L1-His",
      });
    }
  }
  if (nearestL2Id != null) {
    const p = l2.find((x) => x.id === nearestL2Id);
    if (p) {
      arrows.push({
        ax: p.x,
        ay: p.y,
        az: p.z,
        bx: hisPos.x,
        by: hisPos.y,
        bz: hisPos.z,
        energy: energyL2His,
        kind: "L2-His",
      });
    }
  }

  const energyTotal = energyL1His + energyL2His + energyL3His + energyL4His + energyL1L2 + energyAsp + energyCanyon + energyWell;

  return {
    energyL1His,
    energyL2His,
    energyL3His,
    energyL4His,
    energyL1L2,
    energyAsp,
    energyCanyon,
    energyWell,
    energyTotal,
    forceMagL1His,
    forceMagL2His,
    forceMagL1L2,
    nearestL1Nm: nearestL1 === Infinity ? -1 : sceneToNm(nearestL1),
    nearestL2Nm: nearestL2 === Infinity ? -1 : sceneToNm(nearestL2),
    nearestL3Nm: nearestL3 === Infinity ? -1 : sceneToNm(nearestL3),
    nearestL4Nm: nearestL4 === Infinity ? -1 : sceneToNm(nearestL4),
    nearestL1Id,
    nearestL2Id,
    hisCharge: prot.hisCharge,
    hisProtonation: prot.hisProtonation,
    shortRangeWellEnabled: wellOn,
    siteEnergies,
    arrows,
    regime: params.regime,
    sitesOn: prot.switchDisplayOn ? 1 : 0,
    sitesTotal: 1,
    occL1: l1.length,
    occL2: l2.length,
    switchDisplayOn: prot.switchDisplayOn,
    switchOverride: prot.switchOverride,
    continuousScore: prot.continuousScore,
  };
}
