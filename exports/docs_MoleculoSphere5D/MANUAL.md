# MoleculoSphere 5D — User Manual (Public Continuum)

Classical continuum electrostatics only. Educational / hypothesis tool.  
Not MD, docking, coordination chemistry, or biological validation.

**Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.**

---

## 1. What it is / what it is not

### What it is
- An interactive **continuum electrostatics** platform for pH-dependent multi-ligand competition at sparse receptor nanospace proxies.
- Uses **Yukawa / Debye–Hückel** screened Coulomb forces + **Henderson–Hasselbalch** titration.
- Provides locked, reproducible observables: energies U, forces F, dual event counts, scientific JSON/CSV export.
- **Six public receptor presets (A–F)** and **four public exclusive ligands** (Pb²⁺, KSRRRAR, PRARR, SLLRST).

### What it is not
- Not molecular dynamics, docking, QM/MM, or coordination chemistry.
- Not a structural or pharmacological model of furin, toxin pores, nicotinic receptors, or ATP7A disease treatment.
- Not a claim of pore block, antagonism, toxicity mechanism, or therapeutic effect.

---

## 2. Locked parameters

| Parameter | Value | Notes |
|---|---|---|
| λ_D | 0.80 nm | Debye screening length |
| coulombK | 1.15 | Continuum prefactor |
| force cutoff | 3.2 nm | 4 × λ_D |
| friction | 1.917 | 1.35 × 1.42 (peptide species) |
| fCap | 16.2 | Force magnitude clip |
| dt | 0.012 | Overdamped step |
| kT | 1.0 | Reduced unit |
| frameNs | 100 | Conceptual frame length |
| master seed | 20260805 | Overridable |
| short-range well | OFF | Optional Pb–His term stays off in locked runs |
| coordinates | absolute nm | SCALED_nm source |

Authoritative file: `exports/validation_package_MoleculoSphere5D/LOCKED_VALIDITY_PARAMS.json`

---

## 3. Public receptors A–F + public ligands

### Receptors (public)
| ID | Label | ROI | Titratable His |
|---|---|---|---|
| A | Furin catalytic triad | His194 | Yes (pKa 6.2) |
| B | Generic acidic pore constriction | Constriction ROI | No (fixed negative) |
| C | α7-nAChR allosteric continuum | Allosteric ROI | No |
| D | α7-like orthosteric continuum | Orthosteric ROI | No |
| E | ATP7A WT ATOX1-docking platform | ATP7A WT platform | No (fixed negative) |
| F | ATP7A Menkes platform | ATP7A Menkes platform | No (weaker negative) |

E vs F is an educational continuum contrast of electronegativity only — **not** a disease-treatment claim.

### Public exclusive ligands
| ID | Species | Nominal charge | Role |
|---|---|---|---|
| L_HM | Pb²⁺ | +2 | Heavy-metal ion baseline |
| L_PB5 | KSRRRAR | ~+5 | Polybasic FCS-like continuum proxy |
| L_PB3 | PRARR | ~+3 | Intermediate polybasic peptide |
| L_MB1 | SLLRST | ~+1 | Single-Arg educational proxy (not a viral infectivity claim) |


---

## 4. Exclusive modes + hard exclusion

- Baseline shortcuts: **Pb only**, **peptide only**, **Both**.
- Public L2 peptide selector: **KSRRRAR | PRARR | SLLRST** only.
- **Hard exclusion:** inactive classes are completely removed — no residual beads, forces, occupancy, or energy terms.
- Status text must match the active particle set.

---

## 5. Dual events + optional respawn

| Event | Definition |
|---|---|
| Proximity | min ligand–ROI distance < 1.0 nm, hold ≥ 3 frames |
| HH-binary | θ ≥ 0.5, hold ≥ 3 frames (titratable receptors only) |

**Respawn on binding** (default OFF for pure energy studies; ON for continuous event stats):
- On accepted proximity event: count +1, remove particle, reinstate in outer shell.
- HH-binary events are independent of respawn.
- **PUB_MATRIX** runs with respawn **OFF**.

---

## 6. How to run a locked experiment and export

### In the interactive UI
1. Select receptor geometry (A–F).
2. Set ligands (or load a public programme: P1, P3, P5, **PUB_MATRIX**).
3. Set pH (or scenario: Physiological / Stress / Pathological — pH only, no full reseed).
4. Ensure short-range well is OFF for locked runs.
5. Play dynamics; watch Energy HUD and event counters.
6. Use **Export scientific snapshot** or **Run PUB_MATRIX A–F + export**.
7. **Export paper assets** downloads public continuum tables only.

### PUB_MATRIX (public validation)
- Receptors A–F × exclusive {Pb²⁺, KSRRRAR, PRARR, SLLRST} × pH 7.4 / 6.2 / 5.0
- Locked Yukawa; n_rep ≥ 5; respawn OFF
- Exports: mean±sd U_L–ROI, ranking per receptor, E vs F Menkes contrast

---

## 7. Interpreting U vs proximity counts

| Observable | Meaning | Robustness |
|---|---|---|
| U_X–ROI | Pairwise Yukawa energy between species X and ROI | Primary continuum validation |
| U_tot | Sum of tracked energy terms | Overall landscape |
| Proximity events | Count of confirmed d < 1 nm holds | Density / respawn dependent |
| θ, q_His | HH protonation and formal charge | Exact for locked pKa/pH |

**Rule of thumb:** use energy ranking for continuum charge/domain validation; treat proximity counts as secondary accessibility statistics.

---

## 8. Parameter-lock checklist (Build ↔ WSL)

- [ ] λ_D = 0.8 nm  
- [ ] coulombK = 1.15  
- [ ] cutoff = 3.2 nm  
- [ ] friction = 1.917, fCap = 16.2, dt = 0.012, kT = 1.0  
- [ ] short-range well OFF  
- [ ] seed = 20260805 (or reported)  
- [ ] absolute nm coordinates (no extra scale)  
- [ ] dual event definitions identical  
- [ ] same ligand counts and exclusive presence  
- [ ] export header includes continuum disclaimer + public-package disclosure  

Kernel self-test: `KERNEL_VALIDATION.json` — at r=1.0 nm, U≈0.32948, |F|≈0.74133.

---

## 9. Public programmes

| ID | Focus |
|---|---|
| P1 | Pb²⁺ across receptors A–F |
| P3 | ACh competition at α7 proxies (optional educational) |
| P5 | 3-peptide furin baselines (KSRRRAR / PRARR / SLLRST) |
| PUB_MATRIX | Full public matrix A–F × 4 ligands × 3 pH |

Public programmes only on the Beta v1.0 surface. Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

*End of manual.*
