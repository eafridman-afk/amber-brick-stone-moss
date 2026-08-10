/**
 * Machine-readable ROI snapshot for AI-agent training / analysis.
 * Structured per-site electrostatic and occupancy data under controlled
 * orthosteric/allosteric geometries and pH regimes.
 */

import type { RoiEnergySnapshot } from "./energy";
import type {
  LigandBaselineMode,
  MetalMode,
  Particle,
  ProteinProxyState,
  ReceptorGeometryId,
  ReceptorGeometryCharacter,
  SimParams,
} from "./types";
import {
  RECEPTOR_GEOMETRIES,
  timeAccelerationFactor,
  targetStepsPerSecond,
  EVENT_WINDOW_FRAMES,
  FRAME_NS,
} from "./types";
import { sceneToNm } from "./energy-kernel";
import { hisSiteWorldPos, roiWorldPos } from "./proteins";

export type RoiSnapshotSite = {
  index: number;
  label: string;
  role: string;
  pKa: number;
  protonation: number;
  protonationPct: number;
  charge: number;
  continuousScore: number;
  switchOn: boolean;
  switchDisplayOn: boolean;
  switchOverride: boolean | null;
  localEnergy: number;
  energyPb: number;
  energyCo: number;
  energyMetal: number;
  energyHis5: number;
  energyTotal: number;
  nearestMetalNm: number;
  nearestHis5Nm: number;
  nearestLigandKind: string | null;
  nearestLigandLabel: string;
  nearestLigandNm: number;
  occupancyLabel: string;
  position: { x: number; y: number; z: number };
};

export type RoiAgentSnapshot = {
  schema: "moleculosphere5d.roi_snapshot.v1";
  exportedAt: string;
  geometry: {
    id: ReceptorGeometryId;
    label: string;
    character: ReceptorGeometryCharacter;
    blurb: string;
  };
  protein: {
    id: string;
    label: string;
    targetHisIndex: number;
    roiOrigin: { x: number; y: number; z: number };
    aggregateSwitchOn: boolean;
    continuousScore: number;
    hisProtonation: number;
    hisCharge: number;
    response: number;
    localEnergy: number;
  };
  conditions: {
    pH: number;
    debyeNm: number;
    regime: string;
    metalMode: MetalMode;
    ligandBaseline: LigandBaselineMode;
    ligand2Enabled: boolean;
    ligand2Count: number;
    ligand2ChargeScale: number;
    metalHisPrefEnabled: boolean;
    metalHisPrefFactor: number;
    displayDurationSec: number;
    timeAcceleration: number;
    stepsPerSecond: number;
    eventWindowFrames: number;
    frameNs: number;
  };
  ligands: {
    metals: { id: number; kind: string; q: number; x: number; y: number; z: number }[];
    his5: { id: number; kind: string; q: number; x: number; y: number; z: number }[];
    counts: { metals: number; his5: number; total: number };
  };
  energies: {
    energyL1His: number;
    energyL2His: number;
    energyL1L2: number;
    energyTotal: number;
    forceMagL1His: number;
    forceMagL2His: number;
    forceMagL1L2: number;
    regime: string;
    sitesOn: number;
    sitesTotal: number;
  };
  sites: RoiSnapshotSite[];
  notes: string[];
};

export type SnapshotContext = {
  prot: ProteinProxyState;
  particles: Particle[];
  params: SimParams;
  roiEnergy: RoiEnergySnapshot | null;
  metalMode: MetalMode;
  ligandBaseline: LigandBaselineMode;
  ligand2Enabled: boolean;
  ligand2Count: number;
  ligand2ChargeScale: number;
  displayDurationSec: number;
  timeNs: number;
};

export function buildRoiAgentSnapshot(ctx: SnapshotContext): RoiAgentSnapshot {
  const { prot, particles, params, roiEnergy } = ctx;
  const geoId = prot.geometryId ?? "generic";
  const meta = RECEPTOR_GEOMETRIES[geoId];
  const roi = roiWorldPos(prot);
  const metals = particles.filter((p) => p.ligandClass === "ligand1");
  const his5s = particles.filter((p) => p.ligandClass === "ligand2");

  const siteEnergies = roiEnergy?.siteEnergies ?? [];
  const sites: RoiSnapshotSite[] = (prot.hisSites ?? []).map((site) => {
    const se = siteEnergies.find((s) => s.index === site.index);
    const pos = hisSiteWorldPos(prot, site.index);
    return {
      index: site.index,
      label: site.label,
      role: site.role,
      pKa: site.pKa,
      protonation: site.protonation,
      protonationPct: Math.round(site.protonation * 1000) / 10,
      charge: site.charge,
      continuousScore: site.continuousScore,
      switchOn: site.switchOn,
      switchDisplayOn: site.switchDisplayOn,
      switchOverride: site.switchOverride,
      localEnergy: site.localEnergy,
      energyPb: se?.energyPb ?? 0,
      energyCo: se?.energyCo ?? 0,
      energyMetal: se?.energyMetal ?? 0,
      energyHis5: se?.energyHis5 ?? 0,
      energyTotal: se?.energyTotal ?? site.localEnergy,
      nearestMetalNm:
        se?.nearestMetalNm ??
        (site.nearestMetal === Infinity ? -1 : sceneToNm(site.nearestMetal)),
      nearestHis5Nm:
        se?.nearestHis5Nm ??
        (site.nearestHis5 === Infinity ? -1 : sceneToNm(site.nearestHis5)),
      nearestLigandKind: se?.nearestLigandKind ?? null,
      nearestLigandLabel: se?.nearestLigandLabel ?? "—",
      nearestLigandNm: se?.nearestLigandNm ?? -1,
      occupancyLabel: se?.occupancyLabel ?? "empty",
      position: { x: pos.x, y: pos.y, z: pos.z },
    };
  });

  return {
    schema: "moleculosphere5d.roi_snapshot.v1",
    exportedAt: new Date().toISOString(),
    geometry: {
      id: geoId,
      label: meta.label,
      character: meta.character,
      blurb: meta.blurb,
    },
    protein: {
      id: prot.id,
      label: prot.label,
      targetHisIndex: prot.targetHisIndex ?? 0,
      roiOrigin: { x: roi.x, y: roi.y, z: roi.z },
      aggregateSwitchOn: prot.switchDisplayOn,
      continuousScore: prot.continuousScore,
      hisProtonation: prot.hisProtonation,
      hisCharge: prot.hisCharge,
      response: prot.response,
      localEnergy: prot.localEnergy,
    },
    conditions: {
      pH: params.pH,
      debyeNm: params.debyeNm,
      regime: params.regime,
      metalMode: ctx.metalMode,
      ligandBaseline: ctx.ligandBaseline,
      ligand2Enabled: ctx.ligand2Enabled,
      ligand2Count: ctx.ligand2Count,
      ligand2ChargeScale: ctx.ligand2ChargeScale,
      metalHisPrefEnabled: params.metalHisPrefEnabled,
      metalHisPrefFactor: params.metalHisPrefFactor,
      displayDurationSec: ctx.displayDurationSec,
      timeAcceleration: timeAccelerationFactor(ctx.displayDurationSec),
      stepsPerSecond: targetStepsPerSecond(ctx.displayDurationSec),
      eventWindowFrames: EVENT_WINDOW_FRAMES,
      frameNs: FRAME_NS,
    },
    ligands: {
      metals: metals.map((p) => ({
        id: p.id,
        kind: p.kind,
        q: p.q,
        x: p.x,
        y: p.y,
        z: p.z,
      })),
      his5: his5s.map((p) => ({
        id: p.id,
        kind: p.kind,
        q: p.q,
        x: p.x,
        y: p.y,
        z: p.z,
      })),
      counts: {
        metals: metals.length,
        his5: his5s.length,
        total: particles.length,
      },
    },
    energies: {
      energyL1His: roiEnergy?.energyL1His ?? 0,
      energyL2His: roiEnergy?.energyL2His ?? 0,
      energyL1L2: roiEnergy?.energyL1L2 ?? 0,
      energyTotal: roiEnergy?.energyTotal ?? prot.localEnergy,
      forceMagL1His: roiEnergy?.forceMagL1His ?? 0,
      forceMagL2His: roiEnergy?.forceMagL2His ?? 0,
      forceMagL1L2: roiEnergy?.forceMagL1L2 ?? 0,
      regime: roiEnergy?.regime ?? "idle",
      sitesOn: roiEnergy?.sitesOn ?? sites.filter((s) => s.switchDisplayOn).length,
      sitesTotal: roiEnergy?.sitesTotal ?? sites.length,
    },
    sites,
    notes: [
      "Sparse continuum proxy — classical Debye–Hückel / Yukawa electrostatics only.",
      "Binary ON/OFF is a didactic overlay on continuous Henderson–Hasselbalch protonation.",
      "Structured per-site electrostatic and occupancy data under controlled orthosteric/allosteric geometries and pH regimes can serve as observation traces for AI agents studying pH-gated receptor dynamics.",
      `Conceptual time at export: ${ctx.timeNs} ns.`,
    ],
  };
}
