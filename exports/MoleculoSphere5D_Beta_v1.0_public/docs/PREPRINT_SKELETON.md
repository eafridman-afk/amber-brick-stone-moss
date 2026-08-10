# Preprint skeleton — MoleculoSphere5D continuum electrostatic open tool

> **Status:** Draft skeleton for educational / methods preprint.  
> **Disclaimer:** Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological pore-block or receptor-antagonism claim without independent validation.

---

## Title (working)

**MoleculoSphere5D continuum open tool: locked Yukawa multi-ligand competition across public receptor continuum proxies**

## Authors / affiliation

Esteban A. Fridman MD-PhD and collaborators · BioChem Defense Technology (BCDT)

## Abstract (outline)

- Classical continuum Yukawa model (nm units, coulombK, Debye screening) for multi-ligand electrostatic competition.  
- Public receptor presets: Furin triad; generic acidic pore constriction; α7-like allosteric and orthosteric continuum proxies.  
- Ligands: Pb²⁺, polybasic peptides (KSRRRAR / PRARR), 5H-EAF (HH-titratable), acetylcholine.  
- Dual events (proximity hold; HH-binary when titratable).  
- Validation package with locked parameters, kernel pair tests, and exclusive-baseline mean±sd tables.  
- **Scope:** educational / hypothesis support — not MD, docking, or biological validation.

## 1. Introduction

- Motivation: transparent, reproducible continuum electrostatics for multi-cation competition.  
- Distinction from MD / cryo-EM / pharmacology.  
- Role of stress vs pathological pH in HH-gated polycations (5H-EAF).

## 2. Methods

### 2.1 Continuum kernel

\[
U(r)=\mathrm{coulombK}\,\frac{q_i q_j}{r}\,e^{-r/\lambda_D},\quad r\le 4\lambda_D
\]

Locked defaults: λ_D = 0.80 nm, coulombK = 1.15, cutoff = 3.2 nm, friction = 1.917, fCap = 16.2, dt = 0.012, seed = 20260805.

### 2.2 Integrator

Overdamped continuum Langevin with force clipping; public SCALED_nm coordinate source for Furin peptide parity.

### 2.3 Receptor continuum proxies (public)

| ID | Proxy | Titratable |
|----|-------|------------|
| A | Furin Asp153–His194–Ser368 | His194 pKa 6.2 |
| B | Generic acidic pore ring | No |
| C | α7-like allosteric surface | No |
| D | α7-like orthosteric cage | No |

No private toxin-pore or unpublished α7 coordinates.

### 2.4 Ligands

**Global panel:** L1 Pb²⁺ (+2); L2 peptides; L3 5H-EAF (q≈θ·4.5); L4 ACh (+1). Hard exclusion of inactive classes.

**MULTI programme numbering (pore competition):** L1 = Pb²⁺ · L2 = KSRRRAR · L3 = ACh · L4 = 5H-EAF.

### 2.5 Events

Proximity: min d < 1.0 nm, hold ≥ 3 frames.  
HH-binary: θ ≥ 0.5, hold ≥ 3 (titratable receptors).

### 2.6 Programmes

- **P1** Pb²⁺ across A–D  
- **P2** Pore polycation / 5H landscape  
- **P3** ACh competition at α7 proxies  
- **MULTI** Pore multi-ligand matrix (L1–L4 numbering: Pb / KSRRRAR / ACh / 5H-EAF)

## 3. Results (fill from validation package)

### 3.1 Kernel validation

Pair q = +1: U(1.0 nm) ≈ 0.329 kT; U(3.1) ≈ 0.0077 kT; U(3.3) = 0.

### 3.2 Exclusive pore ranking (MULTI validation package)

**Source:** `exports/validation_package_MoleculoSphere5D/MULTI_exclusive_ranking_publication.csv`  
**Programme:** MULTI · multi-ligand competition at generic acidic pore constriction (receptor B).  
**Metric:** mean U_L–ROI (kT), exclusive single-class baselines (hard exclusion of other ligands).  
**Rank order:** most negative U at **pathological pH 5.0**.  
**Locked params:** λ_D = 0.80 nm · coulombK = 1.15 · seed = 20260805 · public SCALED_nm assets only.

**MULTI ligand IDs:** L1 = Pb²⁺ · L2 = KSRRRAR · L3 = ACh · L4 = 5H-EAF.

| Rank | Ligand | pH 5.0 (kT) | pH 7.4 (kT) |
|------|--------|-------------|-------------|
| 1 | L2 (KSRRRAR) | **−21.3** | **−18.9** |
| 2 | L4 (5H-EAF) | **−18.3** | **−0.6** |
| 3 | L1 (Pb²⁺) | **−4.1** | **−6.1** |
| 4 | L3 (ACh) | **−2.2** | **−1.9** |

Exact means (validated exclusive run):  
L2 (−21.334, −18.880); L4 (−18.330, −0.551); L1 (−4.089, −6.066); L3 (−2.215, −1.933) at (pH 5.0, pH 7.4).  
With sd (same archive): L2 ±5.17 / ±8.56; L4 ±2.48 / ±0.26; L1 ±1.35 / ±0.10; L3 ±0.60 / ±0.82 (approx. from ranking archive).

**Continuum interpretation (not biological pore block):**

1. **L2 (KSRRRAR)** is the strongest exclusive continuum attractant at both pH 5.0 and 7.4.  
2. **L4 (5H-EAF)** is **strongly pH-gated** via Henderson–Hasselbalch θ (pKa 6.2): competitive with L2 under pathological pH, nearly neutral at physiological pH 7.4.  
3. **L1 (Pb²⁺)** is intermediate; at pH 7.4 alone its |U| exceeds L4 (alternate rank: L2 > L1 > L3 > L4).  
4. **L3 (ACh)** is the weakest exclusive attractant to the acidic constriction under this locked Yukawa model.

Supporting tables in the validation package:  
`MULTI_REPORT.md` · `MULTI_exclusive_baselines_mean_sd.csv` · `MULTI_summary_mean_sd.csv` · `MULTI_LIGAND_PRESETS.json`.  
Energy export for exclusives is never gated on L1/Pb presence (`U_primary`, `U_L2`/`U_L3`/`U_L4`, `U_tot` always numeric for active classes).

### 3.3 Programme 1 domain ranking

Insert P1 table (Pb × receptor × pH) from `P1_summary_mean_sd.csv`.

### 3.4 Combination conditions (MULTI)

Combination presets (flags → n_unit particles per present class):  
`1+3`, `2+3`, `1+2+3`, `3+4`, `2+3+4`, `1+2+3+4`  
plus exclusive baselines L1–L4. See `MULTI_LIGAND_PRESETS.json`.  
Optional figure: ΔU_ACh vs L3 exclusive baseline when competitors are present (continuum ranking only).

## 4. Discussion

- Continuum rankings are **electrostatic observables**, not efficacy / block / antagonism.  
- 5H-EAF continuum charge tracks HH θ — expected strong pH dependence.  
- Limitations: bead/centre-of-charge geometry; no explicit solvent MD; no membrane; no structural docking.  
- Intended use: hypothesis generation and teaching; compare later to MD / experiment.

## 5. Data & software availability

- Open tool path: `5H_EAF_Furin_Continuum_OpenTool_v1`  
- **Validation package:** `exports/validation_package_MoleculoSphere5D/`  
  - Locked params · kernel validation · **P1** · **P2** · **MULTI** (pore exclusive ranking + full matrix)  
  - Docs companion: `exports/docs_MoleculoSphere5D/`  
- Private data (if any) isolated under `nanotoxicity/` and **not** required to reproduce public tables.

## 6. Acknowledgments / funding

_TBD_

## 7. References

_TBD — continuum electrostatics, Furin structure public refs, nAChR public literature (no private coordinates)._

## Supplementary checklist

- [x] `LOCKED_VALIDITY_PARAMS.json` archived  
- [x] `KERNEL_VALIDATION.json`  
- [x] P1 / P2 mean±sd with no None for exclusive primaries  
- [x] **MULTI** exclusive ranking + summary included in validation package (§3.2 filled)  
- [x] Disclaimer on all figures/tables  
- [ ] Seed + n_rep stated in every figure legend (final polish)

## Public package disclosure

5H-EAF and private nanotoxicity analyses are excluded from this public package.
