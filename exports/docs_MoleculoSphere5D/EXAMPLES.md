# MoleculoSphere 5D — Worked Examples (Public Package)

Classical continuum electrostatics only. Educational / hypothesis tool.  
Not MD, docking, coordination chemistry, or biological validation.

**Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.**

Numbers below come from the public validation package  
`exports/validation_package_MoleculoSphere5D/` (seed 20260805 unless noted).

---

## Example 1 — Pb²⁺ across domains (Programme 1 / PUB_MATRIX L_HM)

**Goal:** Rank continuum accessibility of Pb²⁺ at public receptor proxies under locked pH.

**Setup**
1. Programme → **P1 · Heavy metal** → load **Pb²⁺ exclusive**, or run **PUB_MATRIX**.
2. Cycle receptors **A–F** (Furin · Acidic pore · α7 allo · α7 ortho · ATP7A WT · ATP7A Menkes).
3. Compare pH 7.4 / 6.2 / 5.0.

**What to read**
- Energy HUD: **U_Pb–ROI** (primary).
- At Furin, U_Pb becomes more **positive** as pH falls (His194 protonation → like-charge repulsion with Pb²⁺).
- Acidic pore (fixed negative ROI) typically dominates |U| attraction among A–D.
- **E (ATP7A WT)** should show stronger cationic |U| than **F (Menkes)** at the same pH.

---

## Example 2 — Peptide charge ladder at Furin (P5 / PEP3)

**Goal:** Confirm charge ranking KSRRRAR > PRARR > SLLRST under locked continuum parameters.

**Setup**
1. Receptor: **Furin catalytic triad**.
2. Peptide selector: **KSRRRAR** only (Pb off, ACh off). Public L2 options are KSRRRAR | PRARR | SLLRST only.
3. Fix pH = 6.2; record mean U_pep–His.
4. Switch to **PRARR**, then **SLLRST**; or **Run P5 · 3-peptide furin baselines**.

**Expected qualitative ranking (by |U|)**  
**KSRRRAR (+5) > PRARR (+3) > SLLRST (+1)** at each pH.  
SLLRST is a continuum single-Arg educational proxy — **not** a viral infectivity claim.

See `ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv` and `peptide3_furin_baselines_mean_sd.csv`.

---

## Example 3 — PUB_MATRIX full public validation

**Goal:** Locked exclusive matrix for publication-facing tables.

**Setup**
1. Click **Run PUB_MATRIX A–F + export (public)**.
2. Wait for mean±sd over n_rep ≥ 5, frames ≥ 150, respawn OFF.
3. Downloads:
   - `PUB_MATRIX_mean_sd.csv`
   - `PUB_MATRIX_ranking_per_receptor.csv`
   - `PUB_MATRIX_E_vs_F_Menkes.csv`
   - `PUB_MATRIX.json`

**What to cite**
- Kernel validation + PUB_MATRIX + PEP3 charge ladder + E vs F contrast only.
- Public package only: Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

## Example 4 — E vs F ATP7A Menkes continuum contrast

**Goal:** Educational contrast of reduced platform electronegativity.

**Setup**
1. Receptor **E · ATP7A WT**, ligand exclusive KSRRRAR (or Pb²⁺), pH 7.4.
2. Record U_L–ROI.
3. Switch to **F · ATP7A Menkes** (same ligand, pH, counts).
4. Compare |U|: expect **E > F** (WT more electronegative → more favorable cationic continuum U).

**Caution:** Continuum proxy only — **not** a diagnostic or treatment model of Menkes disease.

---

## Example 5 — ACh sketch at α7 allosteric (optional)

**Goal:** Establish exclusive ACh baseline at α7-like proxies (educational).

**Setup**
1. Receptor: **α7-nAChR allosteric**.
2. Programme → **P3 · ACh competition** → load **ACh exclusive**.
3. Record U_ACh–ROI under locked pH.

**Caution:** Continuum ranking only — **not** a pharmacological antagonism claim.  
Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

*End of examples.*


## Example 6 — Cu²⁺ vs Pb²⁺ at ATP7A platforms (E / F)

**Goal:** Compare two exclusive divalent cations (same continuum charge +2) at the electronegative WT platform (E) vs Menkes reduced-electronegativity proxy (F).

**Setup**
1. Receptor: **E · ATP7A WT**, then **F · ATP7A Menkes**.
2. L1 selector: **Cu²⁺** exclusive (L2 off, ACh off); count ~20; respawn OFF.
3. Record mean **U_HM–ROI** at pH 7.4 / 6.2 / 5.0.
4. Switch L1 to **Pb²⁺** and repeat.
5. Or run **Cu/Pb × E/F matrix + export**.

**Expected**
- Both cations: **|U|_E ≫ |U|_F** at all three pH values (Menkes platform is weaker continuum attractor).
- Cu vs Pb differences are small (same q = +2; only species friction/radius differ).

See `PUB_MATRIX_Cu_Pb_E_F_mean_sd.csv`. Classical continuum only — not a copper-transport or disease claim.

