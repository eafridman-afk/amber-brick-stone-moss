# PUB_MATRIX_Cu_EF · Public matrix slice: ATP7A E/F × Cu2+ exclusive × 3 pH

**Model:** `MoleculoSphere5D_continuum_v1`  
**Export:** `PUB_MATRIX_Cu`  

## Disclaimer

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological pore-block or receptor-antagonism claim without independent validation.

## Scientific framing

MoleculoSphere 5D supplies classical continuum electrostatic observables (Yukawa energies, pH-dependent titration, multi-ligand competition, event counts). It is an educational and hypothesis-generation tool. It does not replace MD, experiment or biological validation. No claim of pore block, receptor antagonism or therapeutic effect is made without independent biological support. 5H-EAF and private nanotoxicity analyses are excluded from this public package.

## Hypothesis (continuum only)

Across selected public receptors, exclusive public ligands yield reproducible mean±sd U_L–ROI under locked Yukawa params; E vs F isolates the Menkes continuum electronegativity contrast.

## Note

n_rep>=10 · respawn OFF · 5H-EAF and private nanotoxicity analyses are excluded from this public package. · receptors=['atp7a_wt', 'atp7a_menkes'] · ligands=['L_HM_Cu'] · pH=[7.4, 6.2, 5.0]

## Locked physics

- λ_D = 0.8 nm · coulombK = 1.15 · cutoff = 3.2 nm
- friction = 1.917 · fCap = 16.2 · dt = 0.012 · kT = 1.0
- seed master = 20260805 · proximity d < 1.0 nm hold ≥ 3

## Fixed-pH summary (mean ± sd)

| condition | receptor | pH | U_primary ± sd (kT) | n |
|-----------|----------|----|---------------------|---|
| PUB_E_L_HM_Cu_pathological_pH5.0 | atp7a_wt | 5.0 | -6.0587 ± 1.5877 | 10 |
| PUB_E_L_HM_Cu_physiological_pH7.4 | atp7a_wt | 7.4 | -5.7602 ± 0.8901 | 10 |
| PUB_E_L_HM_Cu_stress_pH6.2 | atp7a_wt | 6.2 | -6.0170 ± 0.9349 | 10 |
| PUB_F_L_HM_Cu_pathological_pH5.0 | atp7a_menkes | 5.0 | -1.8695 ± 0.2831 | 10 |
| PUB_F_L_HM_Cu_physiological_pH7.4 | atp7a_menkes | 7.4 | -1.8599 ± 0.2583 | 10 |
| PUB_F_L_HM_Cu_stress_pH6.2 | atp7a_menkes | 6.2 | -1.8085 ± 0.3115 | 10 |

Full tables: `summary_fixed_pH_mean_sd.csv`, raw replicates CSV.
