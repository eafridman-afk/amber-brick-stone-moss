# PUB_MATRIX · Public validation matrix A–F × public ligands × 3 pH

**Model:** `MoleculoSphere5D_continuum_v1`  
**Export:** `PUB_MATRIX_Pb_Cu_EF`  

## Disclaimer

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological pore-block or receptor-antagonism claim without independent validation.

## Scientific framing

MoleculoSphere 5D supplies classical continuum electrostatic observables (Yukawa energies, pH-dependent titration, multi-ligand competition, event counts). It is an educational and hypothesis-generation tool. It does not replace MD, experiment or biological validation. No claim of pore block, receptor antagonism or therapeutic effect is made without independent biological support. 5H-EAF and private nanotoxicity analyses are excluded from this public package.

## Hypothesis (continuum only)

Across selected public receptors, exclusive public ligands yield reproducible mean±sd U_L–ROI under locked Yukawa params; E vs F isolates the Menkes continuum electronegativity contrast.

## Note

n_rep>=10 · respawn OFF · 5H-EAF and private nanotoxicity analyses are excluded from this public package. · receptors=['atp7a_wt', 'atp7a_menkes'] · ligands=['L_HM_Pb', 'L_HM_Cu'] · pH=[7.4, 6.2, 5.0]

## Locked physics

- λ_D = 0.8 nm · coulombK = 1.15 · cutoff = 3.2 nm
- friction = 1.917 · fCap = 16.2 · dt = 0.012 · kT = 1.0
- seed master = 20260805 · proximity d < 1.0 nm hold ≥ 3

## Fixed-pH summary (mean ± sd)

| condition | receptor | pH | U_primary ± sd (kT) | n |
|-----------|----------|----|---------------------|---|
| PUB_E_L_HM_Cu_pathological_pH5.0 | atp7a_wt | 5.0 | -6.9160 ± 1.3103 | 10 |
| PUB_E_L_HM_Cu_physiological_pH7.4 | atp7a_wt | 7.4 | -6.5858 ± 1.2663 | 10 |
| PUB_E_L_HM_Cu_stress_pH6.2 | atp7a_wt | 6.2 | -5.9036 ± 0.9051 | 10 |
| PUB_E_L_HM_Pb_pathological_pH5.0 | atp7a_wt | 5.0 | -6.8518 ± 1.0143 | 10 |
| PUB_E_L_HM_Pb_physiological_pH7.4 | atp7a_wt | 7.4 | -6.1811 ± 1.4466 | 10 |
| PUB_E_L_HM_Pb_stress_pH6.2 | atp7a_wt | 6.2 | -6.4713 ± 1.5624 | 10 |
| PUB_F_L_HM_Cu_pathological_pH5.0 | atp7a_menkes | 5.0 | -1.6841 ± 0.3237 | 10 |
| PUB_F_L_HM_Cu_physiological_pH7.4 | atp7a_menkes | 7.4 | -1.6042 ± 0.2233 | 10 |
| PUB_F_L_HM_Cu_stress_pH6.2 | atp7a_menkes | 6.2 | -1.8565 ± 0.2773 | 10 |
| PUB_F_L_HM_Pb_pathological_pH5.0 | atp7a_menkes | 5.0 | -1.6762 ± 0.4059 | 10 |
| PUB_F_L_HM_Pb_physiological_pH7.4 | atp7a_menkes | 7.4 | -1.8292 ± 0.2791 | 10 |
| PUB_F_L_HM_Pb_stress_pH6.2 | atp7a_menkes | 6.2 | -1.5639 ± 0.3502 | 10 |

Full tables: `summary_fixed_pH_mean_sd.csv`, raw replicates CSV.
