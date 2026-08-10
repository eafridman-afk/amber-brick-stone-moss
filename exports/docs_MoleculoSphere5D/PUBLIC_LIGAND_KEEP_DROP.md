# Public ligand keep / drop policy

**Disclaimer:** Classical continuum electrostatics only. Educational / hypothesis-generation tool.  
No biological pore-block or receptor-antagonism claim without independent validation.

This policy applies to **public paper tables and publicized panels**.  
The open tool may still implement full L1–L4 (and internal MULTI) for development; default **public** set is narrower.

| Keep | Drop |
|------|------|
| **KSRRRAR (L2)** | **5H-EAF (L4)** |
| **Pb²⁺ (L1)** | — |
| **PRARR / SLLRST** if in that export | — |
| **Cu²⁺** only if the panel is E/F | **ACh (L3)** — optional; omit unless you explicitly publicize it |

## Notes

1. **L2 sequences:** KSRRRAR always; PRARR and SLLRST when that export includes them (PEP3).  
2. **L4 5H-EAF:** drop from public paper figures/tables by default (frozen MULTI archive may still list historical ranks for internal validation).  
3. **L3 ACh:** do not publicize unless intentionally highlighted.  
4. **Cu²⁺:** not part of receptor A–D default pack; only if panel E/F is defined and enabled.  
5. Physics (λ_D, coulombK, cutoff, friction, fCap, dt, seed) **unchanged**.

## Machine-readable

- `paper_tables/tab_ligand_keep_drop.csv`  
- `paper_tables/tab_ligand_keep_drop.json`  
- `paper_tables/tab_ligands.csv` (`public_action` column)
