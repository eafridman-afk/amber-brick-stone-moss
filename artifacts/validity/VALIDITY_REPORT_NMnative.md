# Validity suite — nm-native locked (Build)

Coordinates: absolute nm (`diag_Build_initial_coords_SCALED_nm.json` / equivalent shell).
Yukawa: r in nm permanently. PRNG: dynamics seed locked per replicate.

| Baseline | Protocol | Prox events | HH events | |U_pep–His| | θ |
|---|---|---|---|---|---|
| Baseline_KSRRRAR_50 | pH 7.4 | 1.1±0.3 | 0.0±0.0 | 0.48±0.07 | 0.059 |
| Baseline_KSRRRAR_50 | pH 6.2 | 1.0±0.0 | 0.0±0.0 | 3.87±0.71 | 0.500 |
| Baseline_KSRRRAR_50 | pH 5 | 1.0±0.0 | 0.1±0.3 | 6.75±1.52 | 0.941 |
| Baseline_KSRRRAR_50 | ramp 7.4→5.0 | 1.1±0.3 | 0.0±0.0 | 3.96±0.62 | 0.941 |
| Baseline_PRARR_50 | pH 7.4 | 1.0±0.0 | 0.0±0.0 | 0.36±0.02 | 0.059 |
| Baseline_PRARR_50 | pH 6.2 | 1.0±0.0 | 0.0±0.0 | 2.98±0.15 | 0.500 |
| Baseline_PRARR_50 | pH 5 | 1.0±0.0 | 1.0±0.0 | 5.55±0.35 | 0.941 |
| Baseline_PRARR_50 | ramp 7.4→5.0 | 1.0±0.0 | 0.0±0.0 | 2.95±0.15 | 0.941 |

## Ranking (KSRRRAR > PRARR?)
- **fixed-pH_7.4** proximityEvents: K=1.10 vs P=1.00 → CONFIRMED (pH 7.4)
- **fixed-pH_7.4** absUPepHis: K=0.48 vs P=0.36 → CONFIRMED (pH 7.4 · |U_pep–His|)
- **fixed-pH_6.2** proximityEvents: K=1.00 vs P=1.00 → REFUTED (pH 6.2)
- **fixed-pH_6.2** absUPepHis: K=3.87 vs P=2.98 → CONFIRMED (pH 6.2 · |U_pep–His|)
- **fixed-pH_5** proximityEvents: K=1.00 vs P=1.00 → REFUTED (pH 5)
- **fixed-pH_5** absUPepHis: K=6.75 vs P=5.55 → CONFIRMED (pH 5 · |U_pep–His|)
- **pH-ramp_7.4_to_5** proximityEvents: K=1.10 vs P=1.00 → CONFIRMED (pH ramp 7.4→5.0)
- **pH-ramp_7.4_to_5** absUPepHis: K=3.96 vs P=2.95 → CONFIRMED (pH ramp 7.4→5.0 · |U_pep–His|)