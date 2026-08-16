# Public access · MoleculoSphere 5D

`https://MoleculoSphere5D` is not a valid hostname (no public suffix). Branded access uses:

| Role | URL |
| --- | --- |
| **Source (done)** | https://github.com/eafridman-afk/MoleculoSphere5D |
| **Live today** | https://amber-brick-stone-moss.vercel.app/ |
| **Branded Vercel (one click)** | https://moleculosphere5d.vercel.app/ |
| **Optional custom domain** | `https://moleculosphere5d.biochemdefensetech.com` (DNS on the BCDT domain) |

## One-click Vercel rename (makes the branded URL live)

This cannot be done from GitHub. In the Vercel account that owns the project:

1. Open the project that is currently named `amber-brick-stone-moss`.
2. **Settings → General → Project Name** → set to `MoleculoSphere5D` → Save.
3. Wait ~30 s. Confirm https://moleculosphere5d.vercel.app/ loads the same v1.1 public Beta.
4. The old slug usually keeps working as a redirect. Do **not** create a second Vercel project (that would fork deploys).

Then update the GitHub repo homepage to `https://moleculosphere5d.vercel.app/`.

## What did not change

- Public Beta lock (no 5H-EAF, classical continuum only).
- Production deployment / kernel / exports.
- Private `nanotoxicity/` track.
