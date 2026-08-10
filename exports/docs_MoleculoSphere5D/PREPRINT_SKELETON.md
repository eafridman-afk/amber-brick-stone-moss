# Preprint skeleton

**Title:** MoleculoSphere 5D: a locked continuum electrostatic platform for pH-dependent ligand competition at receptor nanospace proxies

**Disclaimer (every version):** Classical continuum electrostatics only. Educational / hypothesis-generation tool. Not MD, docking, coordination chemistry, or biological validation. No claim of pore block, receptor antagonism, or therapeutic effect without independent experimental support.

**Public-package disclosure:** Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

## Abstract

*[~150–200 words]*  
MoleculoSphere 5D is a browser-based and batch-reproducible continuum electrostatics platform for exploring pH-dependent multi-ligand competition at sparse receptor nanospace proxies. Forces follow a Debye–Hückel / Yukawa kernel in absolute nanometre units with locked parameters (λ_D = 0.8 nm, coulombK = 1.15, cutoff = 3.2 nm). Histidine titration uses the Henderson–Hasselbalch relation. Six public receptor continua (A–D classical domain proxies plus E/F ATP7A WT vs Menkes platform contrast) and four public exclusive ligands (Pb²⁺, KSRRRAR, PRARR, SLLRST) are supported with hard exclusive presence. We validate the kernel analytically, confirm the peptide charge ladder (KSRRRAR > PRARR > SLLRST on |U|), report PUB_MATRIX rankings across A–F × 3 pH, and document the E vs F continuum electronegativity contrast. The platform exports scientific snapshots and mean±sd tables under a shared parameter lock for Build / WSL parity. Limitations are stated explicitly: continuum educational proxies only.

---

## 1. Introduction

- Multi-scale electrostatics and pH-gated histidine switches in proteins.
- Need for transparent, locked continuum tools for hypothesis generation before MD/experiment.
- Prior continuum approaches (Debye–Hückel, Poisson–Boltzmann) and their educational use.
- Contribution: interactive + batch platform with public receptor presets A–F, multi-ligand hard exclusion, dual event definitions, and parity-oriented export.

---

## 2. Methods

### 2.1 Yukawa / Debye–Hückel kernel
\[
U_{ij} = k \frac{q_i q_j}{r}\,e^{-r/\lambda_D},\quad
|\mathbf{F}_{ij}| = k |q_i q_j|\,e^{-r/\lambda_D}\left(\frac{1}{r^2}+\frac{1}{\lambda_D r}\right)
\]
for \(0 < r \le r_\mathrm{cut}\); zero beyond cutoff. Distances in nm.

### 2.2 Henderson–Hasselbalch titration
\[
\theta = \frac{1}{1+10^{\mathrm{pH}-\mathrm{p}K_a}},\quad q_\mathrm{His} = \theta
\]
(for basic His side chain). Binary ON when θ ≥ 0.5 (didactic overlay).

### 2.3 Overdamped Langevin integrator
Force clipping at fCap; friction = 1.917; dt = 0.012; kT = 1.

### 2.4 Dual events
- Proximity: d < 1.0 nm, hold ≥ 3 frames  
- HH-binary: θ ≥ 0.5, hold ≥ 3 frames  

### 2.5 Receptor and ligand set (public)
- Receptors A–F: furin · acidic pore · α7 allosteric · α7 orthosteric · ATP7A WT platform · ATP7A Menkes platform.
- Ligands: Pb²⁺ (L_HM), KSRRRAR (L_PB5), PRARR (L_PB3), SLLRST (L_MB1).
- Scope: public continuum ligands and receptors only.

### 2.6 Parity protocol
Identical `LOCKED_VALIDITY_PARAMS.json` for interactive UI and WSL batch runner; SCALED_nm coordinates for bit-reproducible diagnostics.

---

## 3. Validation

### 3.1 Kernel self-test
r = 1.0 nm, q = +1,+1 → U ≈ 0.32948, |F| ≈ 0.74133; cutoff behaviour at 3.1 / 3.3 nm.

### 3.2 Peptide charge ladder
KSRRRAR (+5) > PRARR (+3) > SLLRST (+1) at furin His194 (P5 / PEP3 ranking).

### 3.3 PUB_MATRIX domain ranking
A–F × {Pb²⁺, KSRRRAR, PRARR, SLLRST} × pH 7.4/6.2/5.0; locked Yukawa; respawn OFF; n_rep ≥ 5.

### 3.4 E vs F ATP7A Menkes continuum contrast
Fixed-negative platform WT (E) vs reduced electronegativity (F); |U| for cations expected larger on E.

---

## 4. Examples

1. Pb²⁺ across public domains (P1 / PUB_MATRIX L_HM).  
2. Peptide charge ladder at furin (P5).  
3. Full PUB_MATRIX tables.  
4. E vs F Menkes continuum contrast.  
5. Optional ACh exclusive baseline at α7 allosteric (P3) — continuum ranking only.

---

## 5. Limitations

- Continuum Yukawa only; no explicit solvent structure or specific ion effects beyond λ_D.
- Sparse geometric proxies — not crystal or MD structures.
- No coordination chemistry or quantum effects.
- No biological efficacy or disease-treatment claims (including ATP7A / Menkes).
- Proximity statistics sensitive to density and respawn settings.
- Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

## 6. Availability

- Interactive continuum UI: MoleculoSphere 5D live preview / deployed app.  
- Reproducible batch runner: public WSL scripts under the same lock file.  
- Validation package: `exports/validation_package_MoleculoSphere5D/`.  
- Documentation: `exports/docs_MoleculoSphere5D/`.  
- Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.

---

## 7. References

*[to be filled]*
