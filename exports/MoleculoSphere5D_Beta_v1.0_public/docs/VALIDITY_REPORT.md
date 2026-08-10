# MoleculoSphere5D continuum — Validation package report

**Package:** `exports/validation_package_MoleculoSphere5D`  
**Model:** `MoleculoSphere5D_continuum_v1`  
**Generated:** 2026-08-06T20:02:02.245313+00:00

## Disclaimer

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological pore-block or receptor-antagonism claim without independent validation.

MoleculoSphere 5D supplies classical continuum electrostatic observables (Yukawa energies, pH-dependent titration, multi-ligand competition, event counts). It is an educational and hypothesis-generation tool. It does not replace MD, experiment or biological validation. No claim of pore block, receptor antagonism or therapeutic effect is made without independent biological support.

## Locked parameters (Build ≡ WSL public runner)

| Parameter | Value |
|-----------|-------|
| λ_D / debyeNm | 0.8 nm |
| coulombK | 1.15 |
| force cutoff | 3.2 nm |
| friction | 1.917 |
| fCap | 16.2 |
| dt | 0.012 |
| seed | 20260805 |
| proximity | d < 1.0 nm, hold ≥ 3 |
| package n_rep / n_frames | 10 / 800 |

**Coordinates:** `diagnostics/diag_Build_initial_coords_SCALED_nm.json` only  
**Forbidden:** `nanotoxicity/` (never read)

## Kernel validation (pair q=+1, static)

| r (nm) | U (kT) | |F| (kT/nm) |
|--------|--------|------------|
| 1.0 | 0.329481 | 0.741331 |
| 3.1 | 0.007699 | 0.012108 |
| 3.3 | 0.000000 | 0.000000 |

See `KERNEL_VALIDATION.json`.

## Programme 1 (Pb²⁺ exclusive, all receptors)

See `P1_summary_mean_sd.csv` and `P1_REPORT.md`.  
Primary metric `U_Pb_ROI_kT` is **always numeric** mean±sd.

## Programme 2 / pore exclusives (L2 peptide, L3 ACh, L4 5H, L1 Pb)

See `P2_summary_mean_sd.csv`, `P2_exclusive_ranking_pH5_vs_pH7.csv`, `P2_REPORT.md`.  
Primary metric for each exclusive block is **always numeric** mean±sd (no None for L2/L3/ACh/5H).

## Programme MULTI · multi-ligand competition at pore constriction

**Included in this validation package.**  
MULTI ligand IDs: **L1 = Pb²⁺ · L2 = KSRRRAR · L3 = ACh · L4 = 5H-EAF**.  
Receptor B only. Energy export never gated on L1/Pb (`U_primary`, class U, `U_tot` numeric for active classes).

### Exclusive baseline ranking — **FROZEN paper table (Fig. 2)**

Canonical: `MULTI_exclusive_ranking_publication.csv` · provenance: `FROZEN_MULTI_PAPER_TABLE.json`  
Source export: `public_MULTI_pore_competition_20260806_1849`  
**seed = 20260805 · n_unit = 12 · n_rep = 3 · n_frames = 120**

Rank by most negative at pH 5.0:

| Rank | Ligand | pH 5.0 | pH 7.4 |
|------|--------|--------|--------|
| 1 | L2 (KSRRRAR) | −21.3 | −18.9 |
| 2 | L4 (5H-EAF) | −18.3 | −0.6 |
| 3 | L1 (Pb²⁺) | −4.1 | −6.1 |
| 4 | L3 (ACh) | −2.2 | −1.9 |

Exact means: L2 (−21.334, −18.880); L4 (−18.330, −0.551); L1 (−4.089, −6.066); L3 (−2.215, −1.933).  
*Absolute U scales with n_unit / n_frames; rank order is robust under the locked kernel.*

LaTeX draft: `paper/main.tex` (Abstract + Methods + Results; five tables, four figures).  
See also `paper_figures/Fig2_MULTI_ranking.*` and `paper_tables/tab_MULTI_exclusive_ranking.csv`.

## Live pairing

- UI / local server (`bash scripts/serve_wsl.sh` → http://localhost:8765/)  
- Batch: `python3 scripts/run_public_continuum.py --programme P1|P2|P3|MULTI`  
- Both must use the same locked physics as `LOCKED_VALIDITY_PARAMS.json` in this package.

## Files

- `LOCKED_VALIDITY_PARAMS.json` — flat + nested locked params for parity scripts
- `KERNEL_VALIDATION.json`
- `P1_summary_mean_sd.csv` · `P1_REPORT.md`
- `P2_summary_mean_sd.csv` · `P2_exclusive_ranking_pH5_vs_pH7.csv` · `P2_REPORT.md`
- `MULTI_summary_mean_sd.csv` · `MULTI_exclusive_ranking_publication.csv` · `MULTI_REPORT.md` · `MULTI_LIGAND_PRESETS.json`
- `DISCLAIMER.txt` · `VALIDITY_REPORT.md` · `PACKAGE_MANIFEST.json`
