# MoleculoSphere5D continuum · publication experimental framework (BCDT)

**Model:** `MoleculoSphere5D_continuum_v1`  
**Kernel:** nm-unit Yukawa · `coulombK = 1.15` · friction `1.917` · `fCap = 16.2` · dual events · optional respawn · exclusive ligands · red–white–blue field  

## Scientific framing (mandatory)

> **5H-EAF and private nanotoxicity analyses are excluded from this public package.**

> MoleculoSphere 5D supplies classical continuum electrostatic observables (Yukawa energies, pH-dependent titration, multi-ligand competition, event counts). It is an educational and hypothesis-generation tool. It does not replace MD, experiment or biological validation. No claim of pore block, receptor antagonism or therapeutic effect is made without independent biological support.

## Receptor presets (A–D)

| | Preset | Notes |
|---|--------|-------|
| **A** | Furin catalytic triad | ROI His194 (titratable pKa 6.2), Asp153 = −1, Ser368 = 0 |
| **B** | Acidic pore constriction | Generic negative ring; ROI = most negative site; *not a specific toxin pore* |
| **C** | α7-nAChR allosteric continuum proxy | Mild allosteric-surface electrostatics; classical only |
| **D** | α7-like orthosteric continuum proxy | Aromatic-cage-like locus; classical only |

Receptors **A–F** share the identical locked continuum kernel (Yukawa unchanged). E/F are educational genetic-disorder continuum proxies (ATP7A WT vs Menkes platforms). No private anthrax-pore coordinates in the public package.

**5H-EAF and private nanotoxicity analyses are excluded from this public package.**

## Ligands L1–L4

| ID | Species | Charge / notes |
|----|---------|----------------|
| **L1** | Pb²⁺ | q = +2 · metallic spheres · count |
| **L2** | Polybasic peptide | KSRRRAR (+5) / PRARR (+3) / off · count + charge-scale |
| **L3 (private)** | 5H-EAF | **Private / nanotoxicity only** — not in public presets or exports |
| **L4** | Acetylcholine (ACh) | Single-bead continuum proxy · q = +1 · green/cyan |

Hard exclusion: inactive classes contribute **no** residual particles, forces or energy terms.

## Experimental programmes

| Pack | Focus | Primary receptor(s) |
|------|-------|---------------------|
| **P1** | Heavy-metal electrostatic binding (Pb²⁺ across domains) | A–D |
| **P2** | Polycationic peptide pore dynamics + 5H-EAF alteration | B |
| **P3** | Allosteric / orthosteric competition with ACh | C (optional D) |

Select a programme pack in the live UI, then a scenario preset. Status text and canvas legend match the live particle set.

**Language note (P2/P3):** “block / repel / competition” means continuum-electrostatic observables only. Biological pore block or receptor antagonism requires separate validation.

## Locked physics

See `LOCKED_VALIDITY_PARAMS.json` and programme export `LOCKED_PROGRAMME1_PARAMS.json`:

| Parameter | Value |
|-----------|-------|
| λ_D | 0.80 nm |
| coulombK | 1.15 |
| Force cutoff | 3.2 nm (4 × λ_D) |
| friction | 1.917 |
| fCap | 16.2 |
| dt | 0.012 |
| Master seed | 20260805 |
| Proximity | d &lt; 1.0 nm, hold ≥ 3 |
| HH-binary | θ ≥ 0.5, hold ≥ 3 (titratable sites) |
| Respawn on binding | default OFF (energy); ON for event statistics |

## Validation package + docs (public)

```bash
python3 scripts/build_validation_package.py
python3 scripts/check_locked_parity.py
```

| Path | Content |
|------|---------|
| `exports/validation_package_MoleculoSphere5D/` | LOCKED params, KERNEL_VALIDATION, P1/P2 mean±sd, VALIDITY_REPORT, DISCLAIMER |
| `exports/docs_MoleculoSphere5D/` | MANUAL.md · EXAMPLES.md · PREPRINT_SKELETON.md |
| `nanotoxicity/` | **Private isolation only** — never read by public runners |

Quick parity:

```bash
python3 - <<'PY'
import json, pathlib
p = pathlib.Path("exports/validation_package_MoleculoSphere5D/LOCKED_VALIDITY_PARAMS.json")
assert p.exists()
d = json.loads(p.read_text())
print("λ_D", d.get("debyeNm") or d.get("lambda_D"))
print("coulombK", d.get("coulombK"))
print("seed", d.get("seed"))
print("OK — locked file present")
PY
```

## WSL public continuum runner (Build parity)

**Entry point (preferred):**

```bash
cd /mnt/c/Users/13478/5H_EAF_Furin_Continuum_OpenTool_v1
bash scripts/run_public_continuum_wsl.sh --programme P1
# or: python3 scripts/run_public_continuum.py --programme all
```

| Flag | Meaning |
|------|---------|
| `--programme P1\|P2\|P3\|all` | Experimental programme |
| `--reps N` | Replicates (default 10 from locked params) |
| `--frames N` / `--ramp-frames N` | Trajectory length |
| `--seed N` | Master seed (default 20260805) |
| `--no-ramp` | Skip pH-ramp arm |
| `--include-orthosteric` | P3 also runs receptor D |
| `--kernel-dump` | Write `diagnostics/public_continuum_kernel_dump.json` |

**Public assets only (never `nanotoxicity/`):**

- `LOCKED_VALIDITY_PARAMS.json`
- `diagnostics/diag_Build_initial_coords_SCALED_nm.json`

**Outputs:**

- Results → `exports/public_P{1,2,3}_*/` (mean ± sd CSV, raw replicates, `LOCKED_*_PARAMS.json`, report)
- Kernel dumps → `diagnostics/`
- Every CSV starts with the continuum disclaimer header line

### Programme 1 (first publication candidate)

```bash
python3 scripts/run_public_continuum.py --programme P1
# Legacy alias still available:
python3 scripts/run_programme1_pb_across_receptors.py
```

### Programmes 2 & 3

```bash
python3 scripts/run_public_continuum.py --programme P2
python3 scripts/run_public_continuum.py --programme P3 --include-orthosteric
```

## Furin peptide baseline (legacy exclusive validity)

```bash
python3 scripts/run_furin_peptide_baseline_validity.py
# exports/furin_peptide_baseline_validity_parity_*/
```

## Live open tool

```bash
bash scripts/serve_wsl.sh
# http://localhost:8765/
```

- Programme pack → scenario preset  
- Receptor A–D  
- Ligands L1–L4 with hard exclusion  
- Optional pH-ramp 7.4→5.0  
- Snapshot JSON + energy/event CSV (includes scientific framing)

## Hard-drive I/O

| Control | Behavior |
|---------|----------|
| **Save scientific snapshot to folder** | Chromium File System Access API · fallback download |
| **Load scientific snapshot from folder** | Pick JSON |
| **Export energy + event CSV** | Dual metrics + energy series (includes U_ACh) |

## Contact

BioChem Defense Technology · eafridman@biochemdefensetech.com
