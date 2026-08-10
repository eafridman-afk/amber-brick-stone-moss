# MoleculoSphere 5D — Public Continuum Validity Report

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.
Not MD, docking, coordination chemistry, or biological validation.

**Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.**

**Package:** `exports/validation_package_MoleculoSphere5D/`  
**Seed:** 20260805 · **Kernel:** nm-unit Yukawa  
**Coordinates:** absolute nm (SCALED_nm)

---

## 1. Locked parameters

| Parameter | Value |
|---|---|
| λ_D | 0.80 nm |
| coulombK | 1.15 |
| force cutoff | 3.2 nm (4 × λ_D) |
| friction | 1.917 |
| fCap | 16.2 |
| dt | 0.012 |
| kT | 1.0 |
| frameNs | 100 |
| short-range well | OFF |
| dual events | proximity d < 1.0 nm hold ≥ 3; HH θ ≥ 0.5 hold ≥ 3 |

Full dump: `LOCKED_VALIDITY_PARAMS.json`

---

## 2. Kernel validation

Analytic pair test (qᵢ = qⱼ = +1):

| r (nm) | U | \|F\| | Note |
|---|---|---|---|
| 1.0 | 0.32948 | 0.74133 | primary target |
| 3.1 | 0.00770 | 0.01211 | inside cutoff |
| 3.3 | 0 | 0 | beyond cutoff |

Build and WSL must match these values under the locked kernel (`KERNEL_VALIDATION.json`).

---

## 3. Peptide charge ladder (KSRRRAR > PRARR > SLLRST at Furin)

Exclusive L2 baselines (n=20, 5 replicates) — rank by |U_pep–His|:

| pH | Rank 1 | Rank 2 | Rank 3 |
|---|---|---|---|
| 7.4 | KSRRRAR 10.42 | PRARR 2.92 | SLLRST 1.19 |
| 6.2 | KSRRRAR 83.14 | PRARR 20.59 | SLLRST 8.05 |
| 5.0 | KSRRRAR 90.59 | PRARR 38.81 | SLLRST 13.28 |

**CONFIRMED** at all three pH values.  
Labels: KSRRRAR = polybasic FCS-like proxy; PRARR = intermediate; SLLRST = single-Arg educational proxy (not a viral infectivity claim).

Files: `ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv`, `peptide3_furin_baselines_mean_sd.csv`

---

## 4. Domain ranking for Pb²⁺ (Programme 1, L1 exclusive — A–D)

U_Pb–ROI (mean, n=10):

| Receptor | pH 7.4 | pH 6.2 | pH 5.0 |
|---|---|---|---|
| furin | 1.4588 | 11.2219 | 18.3426 |
| acidicPore | -15.3918 | -15.5244 | -15.4618 |
| alpha7Allo | -5.0948 | -5.0760 | -5.2140 |
| alpha7Ortho | -2.0491 | -2.0369 | -2.0190 |

**Domain ranking by |U_Pb| (L1 exclusive):**
- pH 7.4: acidicPore ≫ alpha7Allo > alpha7Ortho > furin
- Furin becomes more **repulsive** (positive U) as His194 protonates at low pH

Full A–F matrix including E/F ATP7A platforms: see `PUB_MATRIX_mean_sd.csv` (after running PUB_MATRIX).

---

## 5. PUB_MATRIX (public validation matrix)

| Factor | Levels |
|---|---|
| Receptors | A–F (furin, acidicPore, alpha7Allo, alpha7Ortho, atp7aWt, atp7aMenkes) |
| Ligands | Pb²⁺, KSRRRAR, PRARR, SLLRST (exclusive each) |
| pH | 7.4, 6.2, 5.0 |
| Locked | λ_D 0.8, k 1.15, cut 3.2, seed 20260805 |
| Respawn | OFF |
| n_rep | ≥ 5 |

Exports: `PUB_MATRIX_mean_sd.csv`, `PUB_MATRIX_ranking_per_receptor.csv`, `PUB_MATRIX_E_vs_F_Menkes.csv`, `PUB_MATRIX.json`

---

## 6. E vs F ATP7A continuum contrast

| Receptor | Continuum character |
|---|---|
| E · ATP7A WT platform | Strongly electronegative ATOX1-docking proxy (ROI fixedCharge ≈ −1.4) |
| F · ATP7A Menkes platform | Reduced electronegativity (ROI fixedCharge ≈ −0.4) |

**Hypothesis:** for cationic ligands, |U|_E > |U|_F at matched pH (educational continuum only — not a disease-treatment claim).

---

## 7. Limitations (explicit)

1. Continuum Yukawa / Debye–Hückel only — no explicit solvent, ions beyond λ_D, or polarizability.
2. No quantum chemistry, no metal coordination, no orbital interactions.
3. Receptor geometries are **sparse educational proxies**, not crystal structures or MD ensembles.
4. No claim of biological pore block, receptor antagonism, toxicity mechanism, or therapeutic effect.
5. ATP7A E/F contrast is continuum educational only — not diagnostic or treatment modelling.
6. Proximity events depend on density, respawn, and shell placement; energy ranking is more robust.

---

## 8. Disclaimer

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.
Not MD, docking, coordination chemistry, or biological validation.
Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

## 9. Files in this public package

| File | Content |
|---|---|
| `LOCKED_VALIDITY_PARAMS.json` | Full locked parameter block |
| `KERNEL_VALIDATION.json` | Analytic U/F pair + cutoff test |
| `PUBLIC_PACKAGE_DISCLOSURE.txt` | Public-only disclosure |
| `P1_Pb_across_receptors_*` | Pb across receptors × pH |
| `peptide3_furin_baselines_*` | P5 3-peptide furin baselines |
| `ranking_KSRRRAR_vs_PRARR_vs_SLLRST.*` | PEP3 charge ladder |
| `PUB_MATRIX_*` | Full A–F × 4 ligands × 3 pH matrix |
| `paper_tables/` | Public tables (A–F receptors; L_HM/PB5/PB3/MB1) |
| `paper_figures/` | Kernel, Pb domains, workflow (public) |
| `VALIDITY_REPORT.md` | This report |
| `DISCLAIMER.txt` | Continuum-only + public disclosure |

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.


## 6. Cu²⁺ vs Pb²⁺ at ATP7A platforms (E / F)

Exclusive L1 baselines (n=20, 5 replicates, 150 frames). Both ions carry continuum **q = +2**; differences are only hydrodynamic/species identity, not charge.

See `PUB_MATRIX_Cu_Pb_E_F_mean_sd.csv`. At pH 7.4 both cations show **|U|_E ≫ |U|_F** (WT electronegative platform vs Menkes reduced electronegativity).

