# Locked 50-peptide validity series (Build, nm-native parity)

Exported: 2026-08-06T12:05:42.483Z
Schema: `moleculosphere5d.validity_suite.v2_NMnative`

## Locked parameters
- Coordinates: `diag_Build_initial_coords_SCALED_nm.json` (absolute nm)
- λ_D = 0.80 nm · coulombK = 1.15 · cutoff = 3.2 nm · well OFF
- frictionScale = 1.35 · KSRRRAR friction = 1.917 · fCap = 16.2
- frames: 2500 fixed-pH / 1500 ramp · n = 10 · seed base 20260805
- Events: proximity d<1 nm ≥3 fr; HH θ≥0.5 ≥3 fr

## Results (mean ± sd)

| Baseline | Protocol | Prox events | Prox dist (nm) | HH events | U_pep–His | U_tot | θ | q_His |
|---|---|---|---|---|---|---|---|---|
| Baseline_KSRRRAR_50 | pH 7.4 | 1.00±0.00 | 0.400±0.012 | 0.00±0.00 | 0.518±0.023 | -344.48±23.64 | 0.059 | 0.059 |
| Baseline_KSRRRAR_50 | pH 6.2 | 1.00±0.00 | 0.405±0.012 | 0.00±0.00 | 4.333±0.194 | -338.96±23.74 | 0.500 | 0.500 |
| Baseline_KSRRRAR_50 | pH 5 | 1.00±0.00 | 0.406±0.012 | 1.00±0.00 | 7.817±0.355 | -316.14±22.10 | 0.941 | 0.941 |
| Baseline_KSRRRAR_50 | ramp 7.4→5 | 1.00±0.00 | 0.400±0.012 | 0.00±0.00 | 4.296±0.198 | -337.63±23.54 | 0.941 | 0.941 |
| Baseline_PRARR_50 | pH 7.4 | 1.00±0.00 | 0.411±0.012 | 0.00±0.00 | 0.368±0.010 | -234.88±7.87 | 0.059 | 0.059 |
| Baseline_PRARR_50 | pH 6.2 | 1.00±0.00 | 0.419±0.011 | 0.00±0.00 | 3.024±0.096 | -223.08±10.83 | 0.500 | 0.500 |
| Baseline_PRARR_50 | pH 5 | 1.00±0.00 | 0.424±0.012 | 1.00±0.00 | 5.605±0.153 | -217.72±8.23 | 0.941 | 0.941 |
| Baseline_PRARR_50 | ramp 7.4→5 | 1.00±0.00 | 0.411±0.012 | 0.00±0.00 | 3.050±0.097 | -226.28±9.78 | 0.941 | 0.941 |

## Primary validation: |U_pep–His| ranking (KSRRRAR > PRARR?)

- **fixed-pH_7.4**: K=0.518 vs P=0.368 → **CONFIRMED**
- **fixed-pH_6.2**: K=4.333 vs P=3.024 → **CONFIRMED**
- **fixed-pH_5**: K=7.817 vs P=5.605 → **CONFIRMED**
- **pH-ramp_7.4_to_5**: K=4.296 vs P=3.050 → **CONFIRMED**

## Secondary: proximity-event ranking

- **fixed-pH_7.4**: K=1.00 vs P=1.00 → REFUTED / TIE
- **fixed-pH_6.2**: K=1.00 vs P=1.00 → REFUTED / TIE
- **fixed-pH_5**: K=1.00 vs P=1.00 → REFUTED / TIE
- **pH-ramp_7.4_to_5**: K=1.00 vs P=1.00 → REFUTED / TIE

## Expectation
KSRRRAR (nominal +5) should produce more proximity events and higher |U_pep–His| than PRARR (nominal +3) under the same locked pH and λ_D=0.80 nm (cutoff 3.2 nm).

Runtime: 23.7s · errors: 0