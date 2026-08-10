# P1 — Pb²⁺ electrostatic binding across receptor domains
Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.
Not MD, docking, coordination chemistry, or biological validation.

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

## Protocol
- Ligand sets: L1 (Pb exclusive), L1+L2 (Pb+KSRRRAR), L1+L2 (Pb+KSRRRAR) only in public package
- Receptors: furin, acidicPore, alpha7Allo, alpha7Ortho
- Fixed pH 7.4 / 6.2 / 5.0 · n=10 · frames=200 · seed=20260805
- Locked kernel: λ_D=0.8 nm, coulombK=1.15, cutoff=3.2 nm, friction=1.917, fCap=16.2

## U_Pb–ROI mean ± sd (L1 exclusive, Pb²⁺ only)

| Receptor | pH 7.4 | pH 6.2 | pH 5.0 |
|---|---|---|---|
| furin | 1.4588 ± 0.1318 | 11.2219 ± 1.3190 | 18.3426 ± 1.7052 |
| acidicPore | -15.3918 ± 1.6040 | -15.5244 ± 1.6367 | -15.4618 ± 1.5822 |
| alpha7Allo | -5.0948 ± 2.1235 | -5.0760 ± 2.2279 | -5.2140 ± 2.5774 |
| alpha7Ortho | -2.0491 ± 0.5215 | -2.0369 ± 0.5070 | -2.0190 ± 0.4928 |

## Domain ranking by |U_Pb| (L1 exclusive)
- pH 7.4: acidicPore (|U|=15.3918) > alpha7Allo (|U|=5.0948) > alpha7Ortho (|U|=2.0491) > furin (|U|=1.4588)
- pH 6.2: acidicPore (|U|=15.5244) > furin (|U|=11.2219) > alpha7Allo (|U|=5.0760) > alpha7Ortho (|U|=2.0369)
- pH 5.0: furin (|U|=18.3426) > acidicPore (|U|=15.4618) > alpha7Allo (|U|=5.2140) > alpha7Ortho (|U|=2.0190)

## Notes
- Negative U = continuum attraction to ROI; positive U = repulsion.
- Furin His194 titrates (pKa 6.2): protonated (+1) at acidic pH increases repulsion of Pb²⁺ (+2).
- Acidic pore (fixed negative ROI) is expected to show the strongest |U| attraction for Pb²⁺.
- Full cell table: `P1_Pb_across_receptors_summary.csv` / `.json`
