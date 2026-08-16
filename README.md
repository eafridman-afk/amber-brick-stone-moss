# MoleculoSphere 5D · v1.1

**Classical continuum electrostatics · Educational / hypothesis tool**

> Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

Browser-only Debye–Hückel / Yukawa educational app for exclusive ligand–ROI continuum energies across public receptor proxies A–F.

## Access

| | URL |
| --- | --- |
| **Source** | https://github.com/eafridman-afk/MoleculoSphere5D |
| **Live** | https://amber-brick-stone-moss.vercel.app/ |
| **Branded Vercel** | https://moleculosphere5d.vercel.app/ — after one project rename (see `ACCESS.md`) |

`https://MoleculoSphere5D` is not a valid hostname. Use the table above.

## Quick start

```bash
npm install   # if needed (deps are preinstalled in the app workspace)
npm run dev   # serves the live app (preview binds all interfaces)
```

Open the in-browser live preview after the dev server is up. Production check:

```bash
npm run typecheck
npm run build
```

## What you can do

1. Choose receptor **A–F** (Furin triad, acidic pore, α7 allosteric, α7 orthosteric, ATP7A WT, ATP7A Menkes).
2. Select exclusive public ligand (**Pb²⁺**, **Cu²⁺**, **KSRRRAR**, **PRARR**, or **SLLRST**) or **Both** for L1+L2 combo (U_HM–pep + Competitive/Cooperative badge).
3. Set **pH**, press **Play**, read **U_L–ROI** (continuum ligand–ROI energy in kT).
4. Use **Event capture** at demo speed; single control changes do not full-reseed the scene.
5. **Run suite + export · public** downloads public CSV/JSON only.

## What U_L–ROI means

| Symbol | Meaning |
| --- | --- |
| **U_L–ROI** | Mean continuum Yukawa energy of exclusive ligand **L** interacting with the receptor ROI under locked Debye–Hückel parameters (units of kT). |
| **ΔU (E vs F)** | For Menkes-scope metals: U_F − U_E (WT platform E is more electronegative → more negative U for cations). |
| **Proximity / HH events** | Demo dual-event counters (distance hold and His θ switch) — educational, not binding kinetics. |

## What this is **not**

- Not molecular dynamics, docking, or coordination chemistry  
- Not a structural model of any protein, toxin, or receptor  
- Not a diagnostic, therapeutic, or clinical claim  
- No biological claim without independent validation  

## Public ligands & receptors

- **Ligands:** Pb²⁺, Cu²⁺ (Menkes E/F scope), KSRRRAR (+5), PRARR (+3), SLLRST (+1)  
- **Receptors A–F:** Furin · acidic pore · α7 allosteric · α7 orthosteric · ATP7A WT · ATP7A Menkes  
- **Locked kernel:** λ_D = 0.8 nm · coulombK = 1.15 · cutoff = 3.2 nm · seed = 20260805  

## Frozen public validation package

Path: `exports/validation_package_MoleculoSphere5D/`

| File | Content |
| --- | --- |
| `PUB_COMBO_mean_sd.csv` | B/E/F × HM+peptide combo mean±sd (v1.1) |
| `PUB_COMBO_vs_exclusive.csv` | Combo vs exclusive baselines |
| `PUB_MATRIX_mean_sd.csv` | A–F × Pb + peptides × pH mean±sd |
| `PUB_MATRIX_ranking_per_receptor.csv` | Ranking by \|U\| |
| `PUB_MATRIX_E_vs_F_Menkes.csv` | E vs F continuum contrast (Pb + peptides) |
| `PUB_MATRIX_Cu_E_F_mean_sd.csv` | Cu²⁺ exclusive on E/F |
| `PUB_MATRIX_Cu_E_vs_F_contrast.csv` | Cu/Pb ΔU = U_F − U_E |
| `PUB_MATRIX_ranking_E_F_with_Cu.csv` | E/F ranking including Cu |
| `ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv` | Charge ladder |
| `paper_tables/` · `paper_figures/` | Public paper assets |
| `DISCLAIMER.txt` · `LOCKED_VALIDITY_PARAMS.json` | Package meta |

In-app: **Download public validation path list** under Quick start.

## Charges (docs only)

Live path uses **formal / HH** numeric charges only (`chargeSource: formal`). No orbital integrator or live quantum solver. Offline DFT may refine charges outside this app.

## Disclaimer

Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

**MoleculoSphere 5D · v1.1**

## Public ligand keep/drop (v1.1)

| Keep | Drop |
|------|------|
| KSRRRAR (L2), Pb²⁺ (L1), PRARR/SLLRST if in export | 5H-EAF (private) |
| Cu²⁺ only on panels E/F | ACh optional omit |

See `exports/docs_MoleculoSphere5D/PUBLIC_LIGAND_KEEP_DROP.md`.
