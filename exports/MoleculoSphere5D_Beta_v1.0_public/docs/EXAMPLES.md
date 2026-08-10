5H-EAF and private nanotoxicity analyses are excluded from this public package.

# MoleculoSphere5D continuum — Worked examples

**Disclaimer:** Classical continuum electrostatics only. Educational / hypothesis-generation tool.  
No biological pore-block or receptor-antagonism claim without independent validation.

## Example 1 — Furin peptide charge contrast (legacy validity)

**Goal:** Confirm KSRRRAR (+5) produces higher |U| than PRARR (+3) at fixed geometry.

```bash
python3 scripts/run_furin_peptide_baseline_validity.py
# → exports/furin_peptide_baseline_validity_parity_*/
```

**Read-outs:** `U_pep–His` totals · ranking CSV · dual events on pH-ramp.

---

## Example 2 — Programme 1: Pb²⁺ across domains

**Hypothesis (continuum):** Pb²⁺ continuum interaction varies by domain and pH.

```bash
python3 scripts/run_public_continuum.py --programme P1 --reps 10
```

**Live UI:** Programme pack → P1 → e.g. `P1 · Pb²⁺ ×20 · Acidic pore · pH 6.2`

**Read-outs:** `U_Pb–ROI` mean±sd by receptor × pH.

---

## Example 3 — Programme MULTI: pore competition ranking

**Hypothesis (continuum):** Exclusive baselines rank attractants at a generic acidic constriction.

```bash
python3 scripts/run_public_continuum.py --programme MULTI --n-unit 15 --reps 10
```

**Publication-style rank (U_L–ROI, exclusive, pH 5.0 order):**

| Rank | Ligand | pH 5.0 | pH 7.4 |
|------|--------|--------|--------|
| 1 | L2 (KSRRRAR) | ~−21 | ~−19 |
| 2 | L4 ([private 5H-EAF — excluded from public package]) | ~−18 | ~−0.6 |
| 3 | L1 (Pb²⁺) | ~−4 | ~−6 |
| 4 | L3 (ACh) | ~−2 | ~−2 |

**Interpretation:** L4 is strongly pH-gated (HH θ); L2 remains strongest; L3 weakest exclusive attractant under this locked Yukawa model. **Not** biological pore block.

**Live UI:** Programme pack → MULTI → select baseline or combination (e.g. `1+2+3+4`).

---

## Example 4 — Combination competition (ACh + competitors)

**MULTI presets:** `1+3`, `2+3`, `3+4`, `2+3+4`, `1+2+3+4`

```bash
# Full MULTI includes all presets × pH
python3 scripts/run_public_continuum.py --programme MULTI --frames 800 --reps 10
```

Compare `U_ACh_ROI` exclusive (`L3_baseline`) vs combined conditions in summary CSV.

---

## Example 5 — Kernel smoke test

```bash
python3 scripts/run_public_continuum.py --kernel-dump --programme P1 --frames 50 --reps 1 --no-ramp
# or rebuild package:
python3 scripts/build_validation_package.py
```

Expect pair q=+1:  
- r=1.0 nm → U ≈ 0.3295 kT  
- r=3.1 nm → U ≈ 0.0077 kT  
- r=3.3 nm → U = 0, |F| = 0  

---

## Example 6 — Live demo walkthrough

1. `bash scripts/serve_wsl.sh` → http://localhost:8765/  
2. Receptor **B · Acidic pore**  
3. Ligands: enable only **L2 KSRRRAR ×20** (others off)  
4. pH 5.0 vs 7.4 — watch HUD U_L2 and sparse display  
5. Switch MULTI pack → `L4 · [private 5H-EAF — excluded from public package] alone` — note θ-driven energy swing  
6. Export CSV — confirm disclaimer header line  

---

## Example 7 — Validation package rebuild

```bash
python3 scripts/build_validation_package.py
python3 - <<'PY'
import json, pathlib, csv, io, math
root = pathlib.Path("exports/validation_package_MoleculoSphere5D")
d = json.loads((root/"LOCKED_VALIDITY_PARAMS.json").read_text())
assert d["coulombK"] == 1.15 and d["debyeNm"] == 0.8
for name in ("P1_summary_mean_sd.csv","P2_summary_mean_sd.csv"):
    lines = [ln for ln in (root/name).read_text().splitlines() if not ln.startswith("#")]
    rows = list(csv.DictReader(io.StringIO("\n".join(lines)+"\n")))
    for r in rows:
        for k in ("U_primary_mean_kT","U_primary_sd_kT"):
            assert math.isfinite(float(r[k])), (name, r, k)
print("validation package numeric OK")
PY
```
