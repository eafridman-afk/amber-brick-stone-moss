export type ScenarioId = "physiological" | "stress" | "pathological";

export type ScenarioBanner = {
  id: ScenarioId;
  label: string;
  switchOn: boolean;
  regime: "competitive" | "cooperative" | "idle";
  energyL1L2: number;
  pH: number;
  ticksLeft: number;
};

export type ScenarioDef = {
  id: ScenarioId;
  label: string;
  blurb: string;
  pH: number;
  moleculeCount: number;
  ligand2Enabled: boolean;
  ligand2Count: number;
  ligand2ChargeScale: number;
  spawnNearL1: number;
  spawnNearL2: number;
};

/**
 * Didactic pH presets only. Ligand counts / receptor / display toggles are
 * controlled independently — applying a scenario never reseeds the scene.
 */
export const SCENARIOS: Record<ScenarioId, ScenarioDef> = {
  physiological: {
    id: "physiological",
    label: "Physiological",
    blurb: "pH 7.4 only · His194 mostly OFF (θ low). Ligands unchanged.",
    pH: 7.4,
    moleculeCount: 10,
    ligand2Enabled: true,
    ligand2Count: 3,
    ligand2ChargeScale: 1.0,
    spawnNearL1: 1,
    spawnNearL2: 1,
  },
  stress: {
    id: "stress",
    label: "Stress / Acidosis",
    blurb: "pH 6.3 only · near His pKa gate. Ligands unchanged.",
    pH: 6.3,
    moleculeCount: 14,
    ligand2Enabled: true,
    ligand2Count: 7,
    ligand2ChargeScale: 1.15,
    spawnNearL1: 2,
    spawnNearL2: 2,
  },
  pathological: {
    id: "pathological",
    label: "Pathological",
    blurb: "pH 5.0 only · His194 strongly ON. Ligands unchanged.",
    pH: 5.0,
    moleculeCount: 18,
    ligand2Enabled: true,
    ligand2Count: 10,
    ligand2ChargeScale: 1.45,
    spawnNearL1: 3,
    spawnNearL2: 3,
  },
};

export const SCENARIO_ORDER: ScenarioId[] = [
  "physiological",
  "stress",
  "pathological",
];
