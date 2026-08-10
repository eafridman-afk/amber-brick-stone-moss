# Locked validity suite — Baseline_KSRRRAR_50 vs Baseline_PRARR_50

## Locked parameters
- λ_D = 0.8 nm (scene 0.2)
- Force cutoff = 3.2 nm (scene 0.8)
- pKa His194 = 6.2, short-range well = False
- coulombK = 1.15 (locked for multi-peptide stability)
- n = 50 molecules exclusive · n_rep = 10 · seed base 20260805
- frames: 2500 fixed-pH / 1500 ramp · runtime 18.9 s

## Results (mean ± sd)

| Baseline | Protocol | Prox events | Prox dist (nm) | HH events | HH dist@θ | U_pep–His | U_tot | θ_final | q_His |
|---|---|---|---|---|---|---|---|---|---|
| Baseline_KSRRRAR_50 | pH 7.4 | 4.00±7.41 | 0.540±0.187 | 0.00±0.00 | — | 1.681±0.244 | -273.236±26.241 | 0.059±0.000 | 0.059±0.000 |
| Baseline_KSRRRAR_50 | pH 6.2 | 137.60±26.88 | 0.819±0.024 | 0.00±0.00 | — | 8.986±0.723 | -264.320±17.935 | 0.500±0.000 | 0.500±0.000 |
| Baseline_KSRRRAR_50 | pH 5 | 52.30±10.87 | 0.835±0.023 | 0.00±0.00 | — | 16.110±1.195 | -258.887±19.672 | 0.941±0.000 | 0.941±0.000 |
| Baseline_KSRRRAR_50 | ramp 7.4→5.0 | 27.80±10.26 | 0.820±0.033 | 1.00±0.00 | 0.737±0.188 | 9.013±1.013 | -247.049±20.151 | 0.941±0.000 | 0.941±0.000 |
| Baseline_PRARR_50 | pH 7.4 | 5.70±2.36 | 0.546±0.055 | 0.00±0.00 | — | 1.160±0.047 | -168.090±9.854 | 0.059±0.000 | 0.059±0.000 |
| Baseline_PRARR_50 | pH 6.2 | 128.90±17.43 | 0.809±0.014 | 0.00±0.00 | — | 6.216±0.487 | -164.291±9.750 | 0.500±0.000 | 0.500±0.000 |
| Baseline_PRARR_50 | pH 5 | 35.60±8.76 | 0.810±0.032 | 0.00±0.00 | — | 10.952±0.949 | -155.722±14.271 | 0.941±0.000 | 0.941±0.000 |
| Baseline_PRARR_50 | ramp 7.4→5.0 | 25.20±6.01 | 0.780±0.035 | 1.00±0.00 | 0.757±0.141 | 6.357±0.360 | -156.262±8.814 | 0.941±0.000 | 0.941±0.000 |

## Ranking vs expectation
Expectation: KSRRRAR (+5) > PRARR (+3) for proximity events and |U_pep–His|.

- **fixed_pH_7.4** `proximityEvents`: KSRRRAR=4.000 vs PRARR=5.700 → **REFUTED**
- **fixed_pH_7.4** `absUPepHis`: KSRRRAR=1.681 vs PRARR=1.160 → **CONFIRMED**
- **fixed_pH_6.2** `proximityEvents`: KSRRRAR=137.600 vs PRARR=128.900 → **CONFIRMED**
- **fixed_pH_6.2** `absUPepHis`: KSRRRAR=8.986 vs PRARR=6.216 → **CONFIRMED**
- **fixed_pH_5.0** `proximityEvents`: KSRRRAR=52.300 vs PRARR=35.600 → **CONFIRMED**
- **fixed_pH_5.0** `absUPepHis`: KSRRRAR=16.110 vs PRARR=10.952 → **CONFIRMED**
- **ramp_7.4_to_5** `proximityEvents`: KSRRRAR=27.800 vs PRARR=25.200 → **CONFIRMED**
- **ramp_7.4_to_5** `absUPepHis`: KSRRRAR=9.013 vs PRARR=6.357 → **CONFIRMED**

Score: proximity 3/4 · |U| 4/4

## Notes
- HH-binary events at fixed pH are 0 (θ constant); non-zero only on pH-ramp (hold ≥ 3 frames).
- At pH 7.4 His194 is mostly deprotonated (θ≈0.06); canyon/Asp attraction dominates and proximity ranking can invert.
- At stress/pathological pH and on the ramp, KSRRRAR produces more proximity events and higher |U_pep–His|.