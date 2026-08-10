# MoleculoSphere5D continuum — User manual

**Model:** `MoleculoSphere5D_continuum_v1`  
**Package root:** `5H_EAF_Furin_Continuum_OpenTool_v1`

## Disclaimer

Classical continuum electrostatics only.

**5H-EAF and private nanotoxicity analyses are excluded from this public package.** Educational / hypothesis-generation tool.  
No biological pore-block or receptor-antagonism claim without independent validation.

MoleculoSphere 5D supplies classical continuum electrostatic observables (Yukawa energies, pH-dependent titration, multi-ligand competition, event counts). It does not replace MD, experiment or biological validation.

## What this tool is

| Layer | Role |
|-------|------|
| **Live UI** | Interactive continuum scene (http://localhost:8765/) |
| **Public batch runner** | Reproducible PUB_MATRIX / P1 / P2 / MULTI under locked params |
| **Validation package** | `exports/validation_package_MoleculoSphere5D/` |

## Installation / environment

```bash
cd /mnt/c/Users/13478/5H_EAF_Furin_Continuum_OpenTool_v1
# Python 3.10+ with numpy
python3 -c "import numpy; print(numpy.__version__)"
```

**Public assets only:**

- `LOCKED_VALIDITY_PARAMS.json`
- `diagnostics/diag_Build_initial_coords_SCALED_nm.json`

**Never load:** `nanotoxicity/` (private isolation).

## Live UI

```bash
bash scripts/serve_wsl.sh
# Open http://localhost:8765/ in Chrome or Edge
```

### Controls

1. **Programme pack** — Manual · P1 · P2 · P3 · MULTI · **PUB_MATRIX** · PEP3  
2. **Receptor** — A Furin · B Acidic pore · C α7 allosteric · D α7 orthosteric · **E ATP7A WT platform** · **F ATP7A Menkes platform**  
3. **Public ligands** (hard exclusion)  
   - L_HM Pb²⁺ | Cu²⁺ independent toggles (q=+2 each)  
   - L2 peptide selector: **KSRRRAR | PRARR | SLLRST** only  
   - Optional educational ACh (not in PUB_MATRIX)  
   - **5H-EAF absent from public UI** (private: `?private=1`)  
4. **Hard exclusion** — off or count=0 removes all particles/forces/energy for that class  
5. **Display density** Sparse|Dense · **Force arrows** (visual only)  
6. **pH / ramp** · **Respawn on binding** (default OFF for energy studies)

### Public MULTI exclusive baselines

| Public ID | Species | q (nominal) |
|-----------|---------|-------------|
| L_HM_Pb | Pb²⁺ | +2 |
| L_HM_Cu | Cu²⁺ | +2 |
| L_PB5 | KSRRRAR | +5 |
| L_PB3 | PRARR | +3 |
| L_MB1 | SLLRST | +1 |

**5H-EAF and private nanotoxicity analyses are excluded from this public package.**

### Receptors E & F (genetic-disorder continuum proxies)

| ID | Name | ROI label | Continuum character |
|----|------|-----------|---------------------|
| E | ATP7A_WT_platform | ATP7A WT platform | Fixed negative (ATOX1 docking ESP proxy, Fig01 WT) |
| F | ATP7A_Menkes_platform | ATP7A Menkes platform | Weaker / partially neutralized negative (Fig01 Mut) |

Educational continuum proxies only — no disease-treatment claim.

### PUB_MATRIX

```text
receptors = [A,B,C,D,E,F]
ligands   = [Pb2+, KSRRRAR, PRARR, SLLRST]  # exclusive each
pH        = [7.4, 6.2, 5.0]
locked params; n_rep ≥ 5; respawn OFF
```

```bash
python3 scripts/run_public_continuum.py --programme PUB_MATRIX --reps 5
```

## Batch runner (WSL)

```bash
# Preferred entry
bash scripts/run_public_continuum_wsl.sh --programme P1
python3 scripts/run_public_continuum.py --programme MULTI --n-unit 15
python3 scripts/run_public_continuum.py --programme all --no-ramp --frames 400

# Rebuild validation package
python3 scripts/build_validation_package.py
```

### Locked technical rules

| Parameter | Value |
|-----------|-------|
| λ_D | 0.80 nm |
| coulombK | 1.15 |
| cutoff | 3.2 nm |
| friction | 1.917 |
| fCap | 16.2 |
| dt | 0.012 |
| seed | 20260805 |
| proximity | d < 1.0 nm, hold ≥ 3 |
| HH-binary | θ ≥ 0.5, hold ≥ 3 (titratable only) |

## Validation package

Path: `exports/validation_package_MoleculoSphere5D/`

| File | Content |
|------|---------|
| `LOCKED_VALIDITY_PARAMS.json` | Flat + nested locked params (`debyeNm`, `coulombK`, `seed`, …) |
| `KERNEL_VALIDATION.json` | Pair test r = 1.0, 3.1, 3.3 nm |
| `P1_summary_mean_sd.csv` | Pb exclusive across receptors |
| `P2_summary_mean_sd.csv` | Pore exclusives (numeric primary U only) |
| `VALIDITY_REPORT.md` | Master report |
| `DISCLAIMER.txt` | Export header text |

**Rule:** exclusive-block primary metrics are always numeric mean±sd (no None).

## Live pairing contract

1. Load `exports/validation_package_MoleculoSphere5D/LOCKED_VALIDITY_PARAMS.json` (or root `LOCKED_VALIDITY_PARAMS.json` — same physics).  
2. SCALED_nm coordinates only.  
3. Dual events + exclusive modes + disclaimer on every export.  
4. Browser interactive UI and `http://localhost:8765/` share the same kernel definition.

## Quick parity check

```bash
python3 - <<'PY'
import json, pathlib
p = pathlib.Path("exports/validation_package_MoleculoSphere5D/LOCKED_VALIDITY_PARAMS.json")
assert p.exists(), "missing locked params"
d = json.loads(p.read_text())
print("λ_D", d.get("debyeNm") or d.get("lambda_D"))
print("coulombK", d.get("coulombK"))
print("seed", d.get("seed"))
print("OK — locked file present")
PY
```

## Export / snapshot

UI: **Save scientific snapshot** · **Export energy + event CSV**  
Every CSV starts with the continuum disclaimer comment line.

## Contact

BioChem Defense Technology · eafridman@biochemdefensetech.com
