# Private nanotoxicity / biodefense analyses

**Not part of the public MoleculoSphere 5D package.**

This directory holds private continuum suites that must never appear in:

- Export paper assets
- `exports/validation_package_MoleculoSphere5D/`
- Public PUB_MATRIX exports
- Manual / preprint examples that ship with the public build

## Contents (logical)

| Suite | Description |
|---|---|
| 5H-EAF exclusive / combination runs | Engine L3 (`his5-eaf`) baselines and multi-ligand sets |
| Programme 2 · Pore (with 5H-EAF) | Private continuum pore accessibility ± 5H-EAF |
| Programme 4 · MULTI (with 5H-EAF) | Multi-ligand competition including 5H-EAF |
| FCS / pore-block hypothesis notes | Continuum-only language — **not** biological validation |

## Files moved from public validation package

See `private_exports/` for historical P2 / P4 / MULTI ranking tables and Fig2 MULTI ranking figures.

## UI gate

Default public UI sets `showPrivateNanotoxicity = false`:

- No 5H-EAF control / no U_5H HUD row
- Programmes P2 / MULTI hidden
- Paper export omits any 5H-EAF ranking tables
- Public L2 selector = KSRRRAR | PRARR | SLLRST only
- Public receptors A–F (including ATP7A WT / Menkes platforms)

Enable **Advanced · private nanotoxicity** only in private builds.

## Disclosure (copy into private reports)

> 5H-EAF and private nanotoxicity analyses are excluded from the public package.
> Classical continuum electrostatics only — not MD, docking, or biological validation.
> No claim of pore block, receptor antagonism, or therapeutic effect.

## Locked kernel (unchanged)

λ_D = 0.8 nm · coulombK = 1.15 · cutoff = 3.2 nm · seed = 20260805

Do **not** retune physics when adding private suites.
