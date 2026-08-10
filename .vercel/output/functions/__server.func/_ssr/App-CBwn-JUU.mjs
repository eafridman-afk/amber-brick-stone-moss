import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Play, c as Focus, d as Beaker, i as RotateCcw, l as Download, o as Pause, r as SlidersHorizontal, s as Menu, t as X, u as BookOpen } from "../_libs/lucide-react.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { a as useFrame, c as Color, d as RGBAFormat, f as Vector3, i as Canvas, l as DataTexture, n as Line, o as useThree, r as Html, t as OrbitControls, u as LinearFilter } from "../_libs/@react-three/drei+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/App-CBwn-JUU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...parts) {
	return parts.filter(Boolean).join(" ");
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center py-1", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent-dim" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: cn("block size-4 rounded-full border border-border-strong bg-fg shadow-sm", "transition-colors hover:bg-accent focus-visible:outline-none", "focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none") })]
	});
}
var PUBLICATION_DISCLAIMER = "Classical continuum electrostatics only. Educational / hypothesis-generation tool. No biological claim without independent validation.";
/** In-app / export version tag. */
var APP_VERSION_BANNER = "MoleculoSphere 5D · Beta v1.1";
/** Subtitle under app title (UI + README). */
var APP_SUBTITLE = "Classical continuum electrostatics · Educational / hypothesis tool";
/** Frozen public validation package root (workspace-relative). */
var VALIDATION_PACKAGE_PATH = "exports/validation_package_MoleculoSphere5D";
/** Public exclusive ligand names (UI + exports). */
var PUBLIC_LIGANDS = [
	"Pb²⁺",
	"Cu²⁺",
	"KSRRRAR",
	"PRARR",
	"SLLRST"
];
var DOMAIN_RADIUS = 3.2;
var METAL_HIS_PREF_DEFAULT = 1.8;
var SHORT_RANGE_WELL_SIGMA_NM = .4;
var SHORT_RANGE_WELL_CUTOFF_NM = .8;
var DISPLAY_DURATION_PRESETS = [
	5,
	10,
	30,
	60
];
/** Wall-clock conceptual acceleration relative to default display window. */
function timeAccelerationFactor(displayDurationSec) {
	return 10 / Math.max(1, displayDurationSec);
}
/** Live integrator step rate; longer display window → fewer steps/s. */
function targetStepsPerSecond(displayDurationSec) {
	return 60 * (10 / Math.max(1, displayDurationSec));
}
var CLAMP_ZOOM_LEVELS = [
	"100",
	"75",
	"50",
	"25"
];
var CLAMP_ZOOM_LABELS = {
	"100": "100%",
	"75": "75%",
	"50": "50%",
	"25": "25%"
};
var HIS_APPROACH_FAR_NM = 1.4;
var HIS_SITE_LABELS = ["His194"];
var PROTEIN_BASE_RGB = [
	.52,
	.58,
	.68
];
var RECEPTOR_GEOMETRIES = {
	furin: {
		id: "furin",
		label: "Furin catalytic triad continuum proxy",
		shortLabel: "A · Furin triad",
		character: "orthosteric",
		blurb: "Furin catalytic triad continuum proxy. ROI on His194 (titratable pKa 6.2); Asp153 = –1; Ser368 = 0.",
		disclaimer: "Classical continuum electrostatics only (Yukawa + Henderson–Hasselbalch). Educational / hypothesis support — not a substitute for MD or experiment.",
		titratableHis: true,
		roiLabel: "His194"
	},
	acidicPore: {
		id: "acidicPore",
		label: "Generic acidic pore constriction",
		shortLabel: "B · Acidic pore",
		character: "constriction",
		blurb: "Generic acidic pore constriction – continuum electrostatic proxy only.",
		disclaimer: "Classical continuum electrostatics only. “Block / repel” language is continuum-electrostatic only; biological pore block requires separate validation. Not a structural model of any toxin or channel.",
		titratableHis: false,
		roiLabel: "Pore constriction"
	},
	alpha7Allo: {
		id: "alpha7Allo",
		label: "α7-nAChR continuum proxy (allosteric)",
		shortLabel: "C · α7 allosteric",
		character: "allosteric",
		blurb: "α7-nAChR continuum proxy (allosteric-site electrostatic environment). Classical only; not structural or pharmacological.",
		disclaimer: "Classical continuum electrostatic proxy of an α7-nAChR allosteric environment. Not a structural, orthosteric, or pharmacological model of the receptor. No atomistic MD or experimental binding data are implied.",
		titratableHis: false,
		roiLabel: "Allosteric site"
	},
	alpha7Ortho: {
		id: "alpha7Ortho",
		label: "α7-like orthosteric continuum proxy",
		shortLabel: "D · α7 orthosteric",
		character: "orthosteric",
		blurb: "α7-like orthosteric continuum proxy. Classical electrostatics only.",
		disclaimer: "Classical continuum electrostatics only. No atomistic α7 coordinates. Not a structural or pharmacological model of the nicotinic receptor.",
		titratableHis: false,
		roiLabel: "Orthosteric site"
	},
	atp7aWt: {
		id: "atp7aWt",
		label: "ATP7A WT ATOX1-docking platform",
		shortLabel: "E · ATP7A WT",
		character: "platform",
		blurb: "Continuum proxy of an electronegative ATOX1-docking surface (WT ESP character). Fixed negative platform — no HH titration.",
		disclaimer: "Educational continuum electrostatics only. Not a structural model of ATP7A, not a disease-treatment claim, not MD-validated docking.",
		titratableHis: false,
		roiLabel: "ATP7A WT platform"
	},
	atp7aMenkes: {
		id: "atp7aMenkes",
		label: "ATP7A Menkes platform (reduced electronegativity)",
		shortLabel: "F · ATP7A Menkes",
		character: "platform",
		blurb: "Continuum proxy with reduced electronegativity relative to WT (lost negative potential character). Weaker cationic U vs E.",
		disclaimer: "Educational continuum electrostatics only. Continuum contrast for Menkes-like reduced electronegativity — not a diagnostic or treatment model.",
		titratableHis: false,
		roiLabel: "ATP7A Menkes platform"
	}
};
var RECEPTOR_GEOMETRY_ORDER = [
	"furin",
	"acidicPore",
	"alpha7Allo",
	"alpha7Ortho",
	"atp7aWt",
	"atp7aMenkes"
];
var HEAVY_METAL_UI_ORDER = [
	"pb",
	"cu",
	"off"
];
function resolveHeavyMetal(mode) {
	if (mode === "cu") return "cu";
	if (mode === "off") return "off";
	return "pb";
}
function heavyMetalLabel(mode) {
	const r = resolveHeavyMetal(mode);
	if (r === "cu") return "Cu²⁺";
	if (r === "off") return "off";
	return "Pb²⁺";
}
var FURIN_PROXY_LABEL = "Furin catalytic triad continuum proxy – His194 ROI";
var ACIDIC_PORE_LABEL = "Generic acidic pore constriction – continuum electrostatic proxy only.";
var ALPHA7_ORTHO_LABEL = "α7-like orthosteric continuum proxy. Classical electrostatics only.";
var ALPHA7_ALLO_LABEL = "α7-nAChR continuum proxy (allosteric-site electrostatic environment). Classical only; not structural or pharmacological.";
var ATP7A_WT_LABEL = "ATP7A WT ATOX1-docking platform continuum proxy – electronegative surface";
var ATP7A_MENKES_LABEL = "ATP7A Menkes platform continuum proxy – reduced electronegativity (educational contrast only)";
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function fibonacciDirections(n) {
	const out = [];
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let i = 0; i < n; i++) {
		const y = 1 - i / Math.max(n - 1, 1) * 2;
		const r = Math.sqrt(Math.max(0, 1 - y * y));
		const theta = golden * i;
		out.push([
			Math.cos(theta) * r,
			y,
			Math.sin(theta) * r
		]);
	}
	return out;
}
/**
* Hierarchical sphere-tree LOD.
* L0: 10 µm conceptual domain
* L1: intermediate packing proxies
* L2: 10 nm-radius conceptual spheres (active subset only)
*
* Full packing at this scale is still ~10⁹ elements — never instantiated.
* Active interactive packing is a practical 100–500 nm ROI neighborhood.
*/
function buildSphereTree(maxLevel2Parents = 16) {
	const nodes = [];
	const byId = /* @__PURE__ */ new Map();
	let nextId = 0;
	const push = (node) => {
		nodes.push(node);
		byId.set(node.id, node);
	};
	const root = {
		id: nextId++,
		parentId: null,
		level: 0,
		x: 0,
		y: 0,
		z: 0,
		radius: DOMAIN_RADIUS,
		scaleLabel: "~10 µm domain (conceptual)",
		seed: 1,
		inspectable: false
	};
	push(root);
	const n1 = 88;
	const r1 = .55;
	const shell = DOMAIN_RADIUS - r1 * 1.15;
	const dirs = fibonacciDirections(n1);
	const level1Ids = [];
	const randL1 = mulberry32(42);
	for (let i = 0; i < n1; i++) {
		const radial = shell * (.4 + .58 * Math.pow(randL1(), .62));
		const [dx, dy, dz] = dirs[i];
		const candidate = {
			id: nextId,
			parentId: root.id,
			level: 1,
			x: dx * radial,
			y: dy * radial,
			z: dz * radial,
			radius: r1 * (.88 + .22 * randL1()),
			scaleLabel: "LOD L1 (µm proxy)",
			seed: 1e3 + i,
			inspectable: true
		};
		let ok = true;
		for (const id of level1Ids) {
			const o = byId.get(id);
			if (!o) continue;
			const ddx = candidate.x - o.x;
			const ddy = candidate.y - o.y;
			const ddz = candidate.z - o.z;
			const minD = (candidate.radius + o.radius) * .9;
			if (ddx * ddx + ddy * ddy + ddz * ddz < minD * minD) {
				ok = false;
				break;
			}
		}
		if (!ok) continue;
		nextId++;
		level1Ids.push(candidate.id);
		push(candidate);
	}
	const level2ByParent = /* @__PURE__ */ new Map();
	const level2Ids = [];
	const parents = level1Ids.slice(0, Math.min(maxLevel2Parents, level1Ids.length));
	for (const pid of parents) {
		const parent = byId.get(pid);
		if (!parent) continue;
		const childIds = [];
		const n2 = 12 + parent.seed % 8;
		const r2 = parent.radius * .2;
		const childDirs = fibonacciDirections(n2);
		const rand = mulberry32(parent.seed);
		for (let i = 0; i < n2; i++) {
			const radial = parent.radius * (.32 + .48 * rand());
			const [dx, dy, dz] = childDirs[i];
			const child = {
				id: nextId++,
				parentId: pid,
				level: 2,
				x: parent.x + dx * radial,
				y: parent.y + dy * radial,
				z: parent.z + dz * radial,
				radius: r2 * (.88 + .28 * rand()),
				scaleLabel: "10 nm radius (LOD L2)",
				seed: parent.seed * 17 + i,
				inspectable: true
			};
			childIds.push(child.id);
			level2Ids.push(child.id);
			push(child);
		}
		level2ByParent.set(pid, childIds);
	}
	return {
		nodes,
		level1Ids,
		level2ByParent,
		level2Ids
	};
}
/**
* Diverging red–white–blue colormap for electrostatic quantities.
* t ∈ [0,1]:
*   0   → red   (−1 / negative charge or potential)
*   0.5 → white (0 / neutral)
*   1   → blue  (+1 / positive charge or potential)
*/
function divergingRedWhiteBlue(t) {
	const x = Math.min(1, Math.max(0, t));
	if (x < .5) {
		const u = x / .5;
		return [
			.94 + .06 * u,
			.27 + .73 * u,
			.27 + .73 * u
		];
	}
	const u = (x - .5) / .5;
	return [
		1 - .85 * u,
		1 - .61 * u,
		1 - .08 * u
	];
}
function colorCss(t) {
	const [r, g, b] = divergingRedWhiteBlue(t);
	return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}
/** Map charge (e) to colormap t, centered at 0 (white). Negative → red, positive → blue. */
function chargeToT(q, scale = 3) {
	return .5 + .5 * Math.tanh(q / scale);
}
/** Map pH 1.5–10.5 → t with white at ~7.3 physiological. Acidic → red, basic → blue. */
function pHToT(pH) {
	return .5 + .5 * Math.tanh((pH - 7.3) / 2.8);
}
/** Map potential to colormap (white at 0). */
function potentialToT(phi, scale = 2.5) {
	return .5 + .5 * Math.tanh(phi / scale);
}
/**
* Build a geodesic icosphere triangulation.
* detail 0 ≈ 80 tris, 1 ≈ 320, 2 ≈ 1280 (we cap detail for perf).
*/
function buildIcosphere(cx, cy, cz, radius, detail) {
	const t = (1 + Math.sqrt(5)) / 2;
	const verts = [
		[
			-1,
			t,
			0
		],
		[
			1,
			t,
			0
		],
		[
			-1,
			-t,
			0
		],
		[
			1,
			-t,
			0
		],
		[
			0,
			-1,
			t
		],
		[
			0,
			1,
			t
		],
		[
			0,
			-1,
			-t
		],
		[
			0,
			1,
			-t
		],
		[
			t,
			0,
			-1
		],
		[
			t,
			0,
			1
		],
		[
			-t,
			0,
			-1
		],
		[
			-t,
			0,
			1
		]
	].map((v) => {
		const n = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
		return [
			v[0] / n,
			v[1] / n,
			v[2] / n
		];
	});
	let faces = [
		[
			0,
			11,
			5
		],
		[
			0,
			5,
			1
		],
		[
			0,
			1,
			7
		],
		[
			0,
			7,
			10
		],
		[
			0,
			10,
			11
		],
		[
			1,
			5,
			9
		],
		[
			5,
			11,
			4
		],
		[
			11,
			10,
			2
		],
		[
			10,
			7,
			6
		],
		[
			7,
			1,
			8
		],
		[
			3,
			9,
			4
		],
		[
			3,
			4,
			2
		],
		[
			3,
			2,
			6
		],
		[
			3,
			6,
			8
		],
		[
			3,
			8,
			9
		],
		[
			4,
			9,
			5
		],
		[
			2,
			4,
			11
		],
		[
			6,
			2,
			10
		],
		[
			8,
			6,
			7
		],
		[
			9,
			8,
			1
		]
	];
	const midpointCache = /* @__PURE__ */ new Map();
	const mid = (a, b) => {
		const key = a < b ? `${a}_${b}` : `${b}_${a}`;
		const hit = midpointCache.get(key);
		if (hit !== void 0) return hit;
		const va = verts[a];
		const vb = verts[b];
		let x = va[0] + vb[0];
		let y = va[1] + vb[1];
		let z = va[2] + vb[2];
		const n = Math.sqrt(x * x + y * y + z * z);
		x /= n;
		y /= n;
		z /= n;
		const idx = verts.length;
		verts.push([
			x,
			y,
			z
		]);
		midpointCache.set(key, idx);
		return idx;
	};
	const levels = Math.max(0, Math.min(2, Math.floor(detail)));
	for (let d = 0; d < levels; d++) {
		const next = [];
		for (const [a, b, c] of faces) {
			const ab = mid(a, b);
			const bc = mid(b, c);
			const ca = mid(c, a);
			next.push([
				a,
				ab,
				ca
			], [
				b,
				bc,
				ab
			], [
				c,
				ca,
				bc
			], [
				ab,
				bc,
				ca
			]);
		}
		faces = next;
		midpointCache.clear();
	}
	const positions = new Float32Array(verts.length * 3);
	for (let i = 0; i < verts.length; i++) {
		const v = verts[i];
		positions[i * 3] = cx + v[0] * radius;
		positions[i * 3 + 1] = cy + v[1] * radius;
		positions[i * 3 + 2] = cz + v[2] * radius;
	}
	const indices = new Uint32Array(faces.length * 3);
	for (let i = 0; i < faces.length; i++) {
		const f = faces[i];
		indices[i * 3] = f[0];
		indices[i * 3 + 1] = f[1];
		indices[i * 3 + 2] = f[2];
	}
	return {
		positions,
		indices
	};
}
/**
* Surface triangulation for a selected 10 nm sphere.
* detail 0 (unselected LOD): ~80 tris; selected: detail 1 (~320).
* Vertex scalars from a coarse multipole potential proxy for colormap.
*/
function buildSurfaceTriangulation(sphere, selected, fieldFn) {
	const detail = selected ? 1 : 0;
	const { positions, indices } = buildIcosphere(sphere.x, sphere.y, sphere.z, sphere.radius * 1.01, detail);
	const nVerts = positions.length / 3;
	const scalars = new Float32Array(nVerts);
	for (let i = 0; i < nVerts; i++) {
		const x = positions[i * 3];
		const y = positions[i * 3 + 1];
		const z = positions[i * 3 + 2];
		const phi = fieldFn ? fieldFn(x, y, z) : 0;
		scalars[i] = potentialToT(phi + .15 * Math.sin(sphere.seed * .01 + i * .07));
	}
	return {
		sphereId: sphere.id,
		positions,
		indices,
		scalars,
		triangleCount: indices.length / 3,
		detail
	};
}
/** Thin diamond connector between two neighboring spheres (interstitial interface). */
function buildConnector(a, b) {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const dz = b.z - a.z;
	const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-9;
	const gap = dist - a.radius - b.radius;
	if (gap < -.05 || gap > a.radius * .85) return null;
	const ux = dx / dist;
	const uy = dy / dist;
	const uz = dz / dist;
	let px = 0;
	let py = 1;
	let pz = 0;
	if (Math.abs(uy) > .9) {
		px = 1;
		py = 0;
	}
	let cx = uy * pz - uz * py;
	let cy = uz * px - ux * pz;
	let cz = ux * py - uy * px;
	let cn = Math.sqrt(cx * cx + cy * cy + cz * cz) + 1e-9;
	cx /= cn;
	cy /= cn;
	cz /= cn;
	let sx = uy * cz - uz * cy;
	let sy = uz * cx - ux * cz;
	let sz = ux * cy - uy * cx;
	const sn = Math.sqrt(sx * sx + sy * sy + sz * sz) + 1e-9;
	sx /= sn;
	sy /= sn;
	sz /= sn;
	const r = Math.min(a.radius, b.radius) * .12;
	const t0 = a.radius * .92;
	const t1 = dist - b.radius * .92;
	const ax = a.x + ux * t0;
	const ay = a.y + uy * t0;
	const az = a.z + uz * t0;
	const bx = a.x + ux * t1;
	const by = a.y + uy * t1;
	const bz = a.z + uz * t1;
	const positions = new Float32Array([
		ax + cx * r,
		ay + cy * r,
		az + cz * r,
		ax - cx * r,
		ay - cy * r,
		az - cz * r,
		bx + cx * r,
		by + cy * r,
		bz + cz * r,
		bx - cx * r,
		by - cy * r,
		bz - cz * r
	]);
	const indices = new Uint32Array([
		0,
		1,
		2,
		1,
		3,
		2
	]);
	return {
		aId: a.id,
		bId: b.id,
		positions,
		indices
	};
}
function buildNeighborConnectors(nodes, activeIds, maxConnectors = 48) {
	const byId = new Map(nodes.map((n) => [n.id, n]));
	const active = activeIds.map((id) => byId.get(id)).filter(Boolean);
	const out = [];
	for (let i = 0; i < active.length && out.length < maxConnectors; i++) {
		const a = active[i];
		let best = null;
		let bestD = Infinity;
		for (let j = i + 1; j < active.length; j++) {
			const b = active[j];
			if (a.level !== b.level) continue;
			const dx = a.x - b.x;
			const dy = a.y - b.y;
			const dz = a.z - b.z;
			const d = dx * dx + dy * dy + dz * dz;
			const maxD = (a.radius + b.radius) * 1.35;
			if (d < maxD * maxD && d < bestD) {
				bestD = d;
				best = b;
			}
		}
		if (best) {
			const c = buildConnector(a, best);
			if (c) out.push(c);
		}
	}
	return out;
}
/** Shared Yukawa kernels — no imports from proteins/engine (cycle-free). */
/**
* Scene units → nanometres.
* Default 4.0 for legacy reduced coordinates.
* When positions are stored as absolute nm (SCALED_nm file), set to 1.0
* via setCoordScaleToNm(1) so no extra scale is applied.
*/
var SCENE_TO_NM = 4;
/** Set coordinate→nm scale (1 = positions already in nm). */
function setCoordScaleToNm(scale) {
	SCENE_TO_NM = scale > 0 ? scale : 1;
}
function sceneToNm(rScene) {
	return rScene * SCENE_TO_NM;
}
function nmToScene(nm) {
	return nm / SCENE_TO_NM;
}
/** Short-range window for mild metal–His preferential continuum scale. */
var METAL_HIS_NEAR_NM = 1.2;
/**
* Screened Coulomb / Yukawa energy in continuum kT units.
* U = coulombK · (qi qj / r_nm) · exp(−r_nm / λ_D)
*/
function yukawaEnergy(qi, qj, rScene, k, lambdaNm) {
	const rNm = Math.max(sceneToNm(rScene), 1e-9);
	const lam = Math.max(lambdaNm, 1e-9);
	return k * qi * qj * Math.exp(-rNm / lam) / rNm;
}
/**
* |F| magnitude for Yukawa (scene-unit length).
* F_nm = k |qi qj| exp(−r/λ) (1/r² + 1/(λ r)); F_scene = F_nm · SCENE_TO_NM.
*/
function yukawaForceMag(qi, qj, rScene, k, lambdaNm) {
	const rNm = Math.max(sceneToNm(rScene), 1e-9);
	const lam = Math.max(lambdaNm, 1e-9);
	const screening = Math.exp(-rNm / lam);
	return k * Math.abs(qi * qj) * screening * (1 / (rNm * rNm) + 1 / (lam * rNm)) * SCENE_TO_NM;
}
/**
* Phenomenological short-range attractive well for divalent metal near
* deprotonated His. Optional educational term — OFF under validity lock.
*
* @param protonation  His θ (0 = deprotonated → well strongest)
* @param rScene       pairwise distance in scene units
* @param enabled      master switch
*/
function shortRangeWellEnergy(protonation, rScene, depthKt, sigmaNm, cutoffNm, enabled = true) {
	if (!enabled || depthKt <= 0) return 0;
	const deprot = 1 - Math.min(1, Math.max(0, protonation));
	if (deprot < .02) return 0;
	const rNm = sceneToNm(rScene);
	if (rNm <= 0 || rNm > cutoffNm) return 0;
	const x = rNm / Math.max(sigmaNm, 1e-9);
	return -depthKt * deprot * Math.exp(-x * x);
}
function shortRangeWellForceMag(protonation, rScene, depthKt, sigmaNm, cutoffNm, enabled = true) {
	if (!enabled || depthKt <= 0) return 0;
	const deprot = 1 - Math.min(1, Math.max(0, protonation));
	if (deprot < .02) return 0;
	const rNm = sceneToNm(rScene);
	if (rNm <= 0 || rNm > cutoffNm) return 0;
	const sig = Math.max(sigmaNm, 1e-9);
	const x = rNm / sig;
	const dU_drNm = depthKt * deprot * (2 * rNm / (sig * sig)) * Math.exp(-x * x);
	return Math.abs(dU_drNm) * SCENE_TO_NM;
}
/**
* Mild preferential continuum scale for metal–His when pref is enabled.
* Stronger near ROI and when His is more deprotonated.
*/
function metalHisPrefScale(protonation, rScene, factor, prefOn, nearNm = METAL_HIS_NEAR_NM) {
	if (!prefOn || factor <= 0) return 1;
	const rNm = sceneToNm(rScene);
	if (rNm > nearNm) return 1;
	const t = 1 - rNm / nearNm;
	const deprot = 1 - Math.min(1, Math.max(0, protonation));
	return 1 + (factor - 1) * t * t * (.35 + .65 * deprot);
}
/**
* Effective His charge seen by metal under optional preferential continuum.
* Returns formal HH charge when pref is off.
*/
function metalHisEffectiveCharge(protonation, prefOn) {
	const q = Math.min(1, Math.max(0, protonation));
	if (!prefOn) return q;
	return q;
}
/** Translate all beads so the target ROI bead is at local origin. */
function centerBeadsOnRoi(beads, pred) {
	const target = beads.find(pred ?? ((b) => b.isHisRoi && b.hisIndex === 0)) ?? beads.find((b) => b.isHisRoi) ?? beads.find((b) => b.morph === "his") ?? beads[0];
	if (!target) return beads;
	const tx = target.lx;
	const ty = target.ly;
	const tz = target.lz;
	return beads.map((b) => ({
		...b,
		lx: b.lx - tx,
		ly: b.ly - ty,
		lz: b.lz - tz
	}));
}
var centerBeadsOnHis194 = (beads) => centerBeadsOnRoi(beads, (b) => b.isHisRoi && b.hisIndex === 0);
/**
* Furin triad: His between Asp and Ser, electronegative canyon.
* After centering, His194 sits at (0,0,0).
*/
function buildFurinTriadBeads() {
	const beads = [];
	for (const [lx, ly, lz, r] of [
		[
			.05,
			-.08,
			-.22,
			.2
		],
		[
			.18,
			.06,
			-.28,
			.16
		],
		[
			-.14,
			.04,
			-.26,
			.15
		],
		[
			.1,
			-.16,
			-.18,
			.14
		],
		[
			-.08,
			-.14,
			-.2,
			.13
		],
		[
			0,
			.12,
			-.3,
			.14
		],
		[
			.22,
			-.1,
			-.32,
			.12
		],
		[
			-.2,
			-.06,
			-.3,
			.12
		]
	]) beads.push({
		lx,
		ly,
		lz,
		radius: r,
		isHisRoi: false,
		hisIndex: -1,
		morph: "core"
	});
	for (const [lx, ly, lz, r] of [
		[
			.28,
			.14,
			.12,
			.1
		],
		[
			.32,
			.02,
			.22,
			.09
		],
		[
			.26,
			-.12,
			.14,
			.095
		],
		[
			-.26,
			.14,
			.12,
			.1
		],
		[
			-.3,
			0,
			.22,
			.09
		],
		[
			-.24,
			-.12,
			.14,
			.095
		],
		[
			.18,
			.2,
			.28,
			.08
		],
		[
			-.18,
			.2,
			.28,
			.08
		],
		[
			.12,
			-.2,
			.26,
			.075
		],
		[
			-.12,
			-.2,
			.26,
			.075
		]
	]) beads.push({
		lx,
		ly,
		lz,
		radius: r,
		isHisRoi: false,
		hisIndex: -1,
		morph: "canyon",
		fixedCharge: -.35
	});
	beads.push({
		lx: .3,
		ly: .16,
		lz: .05,
		radius: .11,
		isHisRoi: false,
		hisIndex: -1,
		morph: "jawA",
		fixedCharge: -.2
	});
	beads.push({
		lx: -.28,
		ly: .14,
		lz: .06,
		radius: .1,
		isHisRoi: false,
		hisIndex: -1,
		morph: "jawB",
		fixedCharge: -.2
	});
	beads.push({
		lx: -.14,
		ly: -.04,
		lz: .02,
		radius: .095,
		isHisRoi: false,
		hisIndex: -1,
		morph: "asp",
		fixedCharge: -1,
		residueLabel: "Asp153"
	});
	beads.push({
		lx: 0,
		ly: .02,
		lz: .06,
		radius: .12,
		isHisRoi: true,
		hisIndex: 0,
		morph: "his",
		hisRole: "target",
		fixedCharge: 0,
		residueLabel: "His194"
	});
	beads.push({
		lx: .15,
		ly: -.02,
		lz: .04,
		radius: .085,
		isHisRoi: false,
		hisIndex: -1,
		morph: "ser",
		fixedCharge: 0,
		residueLabel: "Ser368"
	});
	return centerBeadsOnHis194(beads);
}
/**
* Generic acidic pore constriction — ring of fixed negative continuum sites.
* ROI = most negative bead (constriction centre). Not a toxin pore.
*/
function buildAcidicPoreBeads() {
	const beads = [];
	const n = 10;
	const R = .42;
	for (let i = 0; i < n; i++) {
		const a = i / n * Math.PI * 2;
		beads.push({
			lx: Math.cos(a) * R,
			ly: Math.sin(a) * R * .35,
			lz: Math.sin(a) * R,
			radius: .09,
			isHisRoi: false,
			hisIndex: -1,
			morph: "canyon",
			fixedCharge: -.55,
			residueLabel: `Ring-${i + 1}`
		});
	}
	for (let i = 0; i < 6; i++) {
		const a = i / 6 * Math.PI * 2 + .3;
		beads.push({
			lx: Math.cos(a) * .72,
			ly: Math.sin(a) * .15,
			lz: Math.sin(a) * .72,
			radius: .12,
			isHisRoi: false,
			hisIndex: -1,
			morph: "core",
			fixedCharge: -.15
		});
	}
	beads.push({
		lx: 0,
		ly: 0,
		lz: 0,
		radius: .1,
		isHisRoi: true,
		hisIndex: 0,
		morph: "his",
		hisRole: "constriction",
		fixedCharge: -1,
		residueLabel: "Pore constriction"
	});
	return centerBeadsOnRoi(beads);
}
/**
* Generic α7-like orthosteric continuum locus — aromatic-cage style ring.
* Mild negative / aromatic continuum character. Not real α7 residues.
*/
function buildAlpha7OrthoBeads() {
	const beads = [];
	const cage = [
		[
			.28,
			.12,
			.05,
			.08,
			-.12
		],
		[
			.22,
			-.18,
			.1,
			.075,
			-.1
		],
		[
			-.05,
			-.26,
			.08,
			.08,
			-.14
		],
		[
			-.26,
			-.1,
			.06,
			.075,
			-.1
		],
		[
			-.24,
			.16,
			.04,
			.08,
			-.12
		],
		[
			.08,
			.26,
			.07,
			.075,
			-.1
		]
	];
	for (let i = 0; i < cage.length; i++) {
		const [lx, ly, lz, r, q] = cage[i];
		beads.push({
			lx,
			ly,
			lz,
			radius: r,
			isHisRoi: false,
			hisIndex: -1,
			morph: "canyon",
			fixedCharge: q,
			residueLabel: `Cage-${i + 1}`
		});
	}
	for (const [lx, ly, lz, r] of [
		[
			0,
			0,
			-.28,
			.16
		],
		[
			.18,
			.14,
			-.2,
			.11
		],
		[
			-.16,
			.12,
			-.22,
			.11
		],
		[
			.12,
			-.16,
			-.18,
			.1
		],
		[
			-.14,
			-.14,
			-.2,
			.1
		]
	]) beads.push({
		lx,
		ly,
		lz,
		radius: r,
		isHisRoi: false,
		hisIndex: -1,
		morph: "core",
		fixedCharge: -.08
	});
	beads.push({
		lx: 0,
		ly: .02,
		lz: .08,
		radius: .11,
		isHisRoi: true,
		hisIndex: 0,
		morph: "his",
		hisRole: "orthosteric",
		fixedCharge: -.25,
		residueLabel: "Orthosteric site"
	});
	return centerBeadsOnRoi(beads);
}
/**
* α7-nAChR allosteric-site continuum environment.
* Sparse surface patch with mild mixed electrostatic character — not orthosteric,
* not atomistic, no private coordinates.
*/
function buildAlpha7AlloBeads() {
	const beads = [];
	const patch = [
		[
			.32,
			.18,
			.22,
			.09,
			-.22
		],
		[
			.38,
			.02,
			.28,
			.085,
			-.18
		],
		[
			.28,
			-.16,
			.24,
			.08,
			-.2
		],
		[
			.18,
			.22,
			.32,
			.075,
			-.15
		],
		[
			.42,
			.1,
			.12,
			.08,
			-.16
		],
		[
			.22,
			-.08,
			.34,
			.07,
			-.14
		]
	];
	for (let i = 0; i < patch.length; i++) {
		const [lx, ly, lz, r, q] = patch[i];
		beads.push({
			lx,
			ly,
			lz,
			radius: r,
			isHisRoi: false,
			hisIndex: -1,
			morph: "canyon",
			fixedCharge: q,
			residueLabel: `Allo-surf-${i + 1}`
		});
	}
	const rim = [
		[
			.48,
			.2,
			.3,
			.07,
			.08
		],
		[
			.46,
			-.14,
			.26,
			.065,
			.06
		],
		[
			.12,
			.28,
			.38,
			.07,
			.05
		]
	];
	for (let i = 0; i < rim.length; i++) {
		const [lx, ly, lz, r, q] = rim[i];
		beads.push({
			lx,
			ly,
			lz,
			radius: r,
			isHisRoi: false,
			hisIndex: -1,
			morph: "core",
			fixedCharge: q,
			residueLabel: `Allo-rim-${i + 1}`
		});
	}
	for (const [lx, ly, lz, r] of [
		[
			.05,
			0,
			-.12,
			.18
		],
		[
			-.12,
			.1,
			-.08,
			.12
		],
		[
			-.08,
			-.12,
			-.1,
			.11
		],
		[
			.15,
			.14,
			-.18,
			.1
		],
		[
			.1,
			-.12,
			-.16,
			.1
		]
	]) beads.push({
		lx,
		ly,
		lz,
		radius: r,
		isHisRoi: false,
		hisIndex: -1,
		morph: "core",
		fixedCharge: -.06
	});
	beads.push({
		lx: .3,
		ly: .04,
		lz: .26,
		radius: .11,
		isHisRoi: true,
		hisIndex: 0,
		morph: "his",
		hisRole: "allosteric",
		fixedCharge: -.35,
		residueLabel: "Allosteric site"
	});
	return centerBeadsOnRoi(beads);
}
/**
* E · ATP7A WT platform — electronegative ATOX1-docking continuum surface.
* Strong fixed negative character (Fig01 WT ESP style). No HH titration.
*/
function buildAtp7aWtBeads() {
	const beads = [];
	const face = [
		[
			.22,
			.1,
			.18,
			.09,
			-.55
		],
		[
			.08,
			-.12,
			.22,
			.085,
			-.5
		],
		[
			-.14,
			.08,
			.2,
			.09,
			-.55
		],
		[
			-.2,
			-.1,
			.16,
			.08,
			-.45
		],
		[
			.28,
			-.04,
			.1,
			.075,
			-.4
		],
		[
			-.26,
			.02,
			.12,
			.075,
			-.4
		],
		[
			.12,
			.2,
			.08,
			.07,
			-.35
		],
		[
			-.08,
			.18,
			.14,
			.07,
			-.38
		]
	];
	for (let i = 0; i < face.length; i++) {
		const [lx, ly, lz, r, q] = face[i];
		beads.push({
			lx,
			ly,
			lz,
			radius: r,
			isHisRoi: false,
			hisIndex: -1,
			morph: "canyon",
			fixedCharge: q,
			residueLabel: `WT-surf-${i + 1}`
		});
	}
	for (const [lx, ly, lz, r] of [
		[
			0,
			0,
			-.22,
			.16
		],
		[
			.16,
			.12,
			-.16,
			.11
		],
		[
			-.14,
			.1,
			-.18,
			.11
		],
		[
			.1,
			-.14,
			-.14,
			.1
		],
		[
			-.12,
			-.12,
			-.16,
			.1
		]
	]) beads.push({
		lx,
		ly,
		lz,
		radius: r,
		isHisRoi: false,
		hisIndex: -1,
		morph: "core",
		fixedCharge: -.12
	});
	beads.push({
		lx: .02,
		ly: .02,
		lz: .2,
		radius: .12,
		isHisRoi: true,
		hisIndex: 0,
		morph: "his",
		hisRole: "platform",
		fixedCharge: -1.4,
		residueLabel: "ATP7A WT platform"
	});
	return centerBeadsOnRoi(beads);
}
/**
* F · ATP7A Menkes platform — reduced electronegativity vs WT.
* Partially neutralized continuum surface so cationic U is less favorable.
* Educational contrast only — not a disease-treatment claim.
*/
function buildAtp7aMenkesBeads() {
	const beads = [];
	const face = [
		[
			.22,
			.1,
			.18,
			.09,
			-.18
		],
		[
			.08,
			-.12,
			.22,
			.085,
			-.15
		],
		[
			-.14,
			.08,
			.2,
			.09,
			-.16
		],
		[
			-.2,
			-.1,
			.16,
			.08,
			-.12
		],
		[
			.28,
			-.04,
			.1,
			.075,
			-.1
		],
		[
			-.26,
			.02,
			.12,
			.075,
			-.1
		],
		[
			.12,
			.2,
			.08,
			.07,
			-.08
		],
		[
			-.08,
			.18,
			.14,
			.07,
			-.1
		]
	];
	for (let i = 0; i < face.length; i++) {
		const [lx, ly, lz, r, q] = face[i];
		beads.push({
			lx,
			ly,
			lz,
			radius: r,
			isHisRoi: false,
			hisIndex: -1,
			morph: "canyon",
			fixedCharge: q,
			residueLabel: `Menkes-surf-${i + 1}`
		});
	}
	for (const [lx, ly, lz, r] of [
		[
			0,
			0,
			-.22,
			.16
		],
		[
			.16,
			.12,
			-.16,
			.11
		],
		[
			-.14,
			.1,
			-.18,
			.11
		],
		[
			.1,
			-.14,
			-.14,
			.1
		],
		[
			-.12,
			-.12,
			-.16,
			.1
		]
	]) beads.push({
		lx,
		ly,
		lz,
		radius: r,
		isHisRoi: false,
		hisIndex: -1,
		morph: "core",
		fixedCharge: -.04
	});
	beads.push({
		lx: .02,
		ly: .02,
		lz: .2,
		radius: .12,
		isHisRoi: true,
		hisIndex: 0,
		morph: "his",
		hisRole: "platform",
		fixedCharge: -.4,
		residueLabel: "ATP7A Menkes platform"
	});
	return centerBeadsOnRoi(beads);
}
function createProteinProxyDefs$1(geometryId = "furin") {
	const meta = RECEPTOR_GEOMETRIES[geometryId] ?? RECEPTOR_GEOMETRIES.furin;
	if (geometryId === "acidicPore") return [{
		id: "generic-acidic-pore",
		label: ACIDIC_PORE_LABEL,
		x: 0,
		y: .05,
		z: 0,
		hisPka: 6.2,
		hisSitePkas: [6.2],
		beads: buildAcidicPoreBeads(),
		geometryId: "acidicPore",
		geometryCharacter: "constriction",
		targetHisIndex: 0,
		titratableHis: false
	}];
	if (geometryId === "alpha7Ortho") return [{
		id: "generic-alpha7-ortho",
		label: ALPHA7_ORTHO_LABEL,
		x: 0,
		y: .08,
		z: 0,
		hisPka: 6.2,
		hisSitePkas: [6.2],
		beads: buildAlpha7OrthoBeads(),
		geometryId: "alpha7Ortho",
		geometryCharacter: "orthosteric",
		targetHisIndex: 0,
		titratableHis: false
	}];
	if (geometryId === "alpha7Allo") return [{
		id: "alpha7-nachr-allosteric",
		label: ALPHA7_ALLO_LABEL,
		x: 0,
		y: .06,
		z: 0,
		hisPka: 6.2,
		hisSitePkas: [6.2],
		beads: buildAlpha7AlloBeads(),
		geometryId: "alpha7Allo",
		geometryCharacter: "allosteric",
		targetHisIndex: 0,
		titratableHis: false
	}];
	if (geometryId === "atp7aWt") return [{
		id: "atp7a-wt-platform",
		label: ATP7A_WT_LABEL,
		x: 0,
		y: .06,
		z: 0,
		hisPka: 6.2,
		hisSitePkas: [6.2],
		beads: buildAtp7aWtBeads(),
		geometryId: "atp7aWt",
		geometryCharacter: "platform",
		targetHisIndex: 0,
		titratableHis: false
	}];
	if (geometryId === "atp7aMenkes") return [{
		id: "atp7a-menkes-platform",
		label: ATP7A_MENKES_LABEL,
		x: 0,
		y: .06,
		z: 0,
		hisPka: 6.2,
		hisSitePkas: [6.2],
		beads: buildAtp7aMenkesBeads(),
		geometryId: "atp7aMenkes",
		geometryCharacter: "platform",
		targetHisIndex: 0,
		titratableHis: false
	}];
	return [{
		id: "furin-cat-triad",
		label: FURIN_PROXY_LABEL,
		x: 0,
		y: .1,
		z: 0,
		hisPka: 6.2,
		hisSitePkas: [6.2],
		beads: buildFurinTriadBeads(),
		geometryId: "furin",
		geometryCharacter: "orthosteric",
		targetHisIndex: 0,
		titratableHis: meta.titratableHis
	}];
}
/** Create protein proxies for the selected public receptor geometry. */
function createProteinProxyDefs(geometryId = "furin") {
	return createProteinProxyDefs$1(geometryId);
}
function makeHis194(pKa, pH, titratable = true) {
	const protonation = titratable ? hisProtonationHH(pKa, pH) : 0;
	const charge = titratable ? hisFormalCharge(protonation) : 0;
	const switchOn = titratable && protonation >= .5;
	return {
		index: 0,
		label: HIS_SITE_LABELS[0] ?? "His194",
		pKa,
		protonation,
		charge,
		continuousScore: protonation,
		switchOn,
		switchDisplayOn: switchOn,
		switchOverride: null,
		clickPulse: 0,
		localEnergy: 0,
		nearestMetal: Infinity,
		nearestHis5: Infinity,
		role: "target"
	};
}
function initProteinStates(defs, pH) {
	return defs.map((d) => {
		const titratable = d.titratableHis !== false && d.geometryId === "furin";
		const pKa = d.hisSitePkas[0] ?? d.hisPka;
		const hisSites = [makeHis194(pKa, pH, titratable)];
		const roiBead = d.beads.find((b) => b.isHisRoi);
		const hisProtonation = hisSites[0].protonation;
		const hisCharge = titratable ? hisProtonation : roiBead?.fixedCharge ?? 0;
		if (!titratable && hisSites[0]) {
			hisSites[0].charge = hisCharge;
			hisSites[0].protonation = 0;
			hisSites[0].switchOn = false;
			hisSites[0].switchDisplayOn = false;
			hisSites[0].label = roiBead?.residueLabel ?? "ROI";
			hisSites[0].role = roiBead?.hisRole ?? "generic";
		}
		const switchOn = hisSites[0].switchDisplayOn;
		return {
			id: d.id,
			label: d.label,
			x: d.x,
			y: d.y,
			z: d.z,
			beads: d.beads,
			hisPka: d.hisPka,
			hisSitePkas: [pKa],
			geometryId: d.geometryId,
			geometryCharacter: d.geometryCharacter,
			targetHisIndex: 0,
			titratableHis: titratable,
			hisSites,
			hisProtonation,
			hisCharge,
			response: 0,
			dominantLigand: null,
			nearestL1: Infinity,
			nearestL2: Infinity,
			confScale: switchOn ? .08 : 0,
			confAngle: 0,
			stressTint: 0,
			localEnergy: 0,
			continuousScore: hisProtonation,
			switchOn,
			switchOverride: null,
			switchDisplayOn: switchOn,
			clickPulse: 0,
			cleftOpen: switchOn ? 1 : 0
		};
	});
}
/**
* Histidine protonation via Henderson–Hasselbalch (basic side chain).
* pH ≪ pKa → protonated (fraction → 1, charge → +1)
* pH ≫ pKa → deprotonated (fraction → 0, charge → 0)
*/
function hisProtonationHH(pKa, pH) {
	return 1 / (1 + Math.pow(10, pH - pKa));
}
/** Formal continuum charge of His: +1 when fully protonated, 0 when deprotonated. */
function hisFormalCharge(protonation) {
	return Math.min(1, Math.max(0, protonation));
}
function hisSiteWorldPos(prot, siteIndex) {
	return beadWorldPos(prot, prot.beads.find((b) => b.isHisRoi && b.hisIndex === siteIndex) ?? prot.beads.find((b) => b.morph === "his") ?? prot.beads.find((b) => b.isHisRoi) ?? prot.beads[0]);
}
/** ROI origin = His194. */
function roiWorldPos(p) {
	return hisSiteWorldPos(p, p.targetHisIndex ?? 0);
}
function beadWorldPos(prot, bead) {
	const open = prot.cleftOpen;
	const ca = Math.cos(prot.confAngle);
	const sa = Math.sin(prot.confAngle);
	let lx = bead.lx;
	let ly = bead.ly;
	let lz = bead.lz;
	if (bead.morph === "jawA") {
		lx += open * .06;
		ly += open * .03;
	} else if (bead.morph === "jawB") {
		lx -= open * .06;
		ly += open * .03;
	} else if (bead.morph === "his") ly += open * .02;
	const rx = lx * ca + lz * sa;
	const rz = -lx * sa + lz * ca;
	const scale = 1 + prot.confScale * .12;
	return {
		x: prot.x + rx * scale,
		y: prot.y + ly * scale,
		z: prot.z + rz * scale,
		radius: bead.radius * (1 + (bead.isHisRoi ? open * .08 : 0))
	};
}
function updateHisSwitchBinary(prot, energyBias = 0, _dt = 0) {
	const site = prot.hisSites[0];
	if (!site) return;
	const score = Math.min(1.05, Math.max(-.02, site.protonation + energyBias * .35));
	site.continuousScore = score;
	prot.continuousScore = score;
	if (site.switchOverride != null) {
		site.switchOn = site.switchOverride;
		site.switchDisplayOn = site.switchOverride;
	} else {
		if (site.switchOn) {
			if (score < .35) site.switchOn = false;
		} else if (score >= .5) site.switchOn = true;
		site.switchDisplayOn = site.switchOn;
	}
	prot.switchOn = site.switchOn;
	prot.switchDisplayOn = site.switchDisplayOn;
	prot.hisProtonation = site.protonation;
	prot.hisCharge = site.charge;
	const confTarget = site.switchDisplayOn ? .12 : 0;
	prot.confScale += (confTarget - prot.confScale) * .28;
	prot.cleftOpen += ((site.switchDisplayOn ? 1 : 0) - prot.cleftOpen) * .22;
	prot.clickPulse = Math.max(0, prot.clickPulse - .06);
}
function nonPhysStress(pH) {
	if (pH >= 7 && pH <= 7.5) return 0;
	if (pH < 7) return Math.min(1, (7 - pH) / 3);
	return Math.min(1, (pH - 7.5) / 3);
}
function updateProteinResponses(proteins, particles, pH, params) {
	const stress = nonPhysStress(pH);
	const k = params?.coulombK ?? 4.2;
	const lambda = Math.max(params?.debyeNm ?? (params?.debyeLength != null ? params.debyeLength * 4 : .8), 1e-9);
	const shell = nmToScene(HIS_APPROACH_FAR_NM) * 1.8;
	const prefOn = params?.metalHisPrefEnabled ?? true;
	const prefFactor = params?.metalHisPrefFactor ?? 1.8;
	for (const prot of proteins) {
		if (!prot.hisSites?.length) prot.hisSites = [makeHis194(prot.hisPka, pH, prot.titratableHis !== false)];
		if (prot.titratableHis === false) {
			const fq = prot.beads.find((b) => b.isHisRoi)?.fixedCharge ?? 0;
			for (const site of prot.hisSites) {
				site.protonation = 0;
				site.charge = fq;
				site.switchOn = false;
				site.switchDisplayOn = false;
			}
			prot.hisProtonation = 0;
			prot.hisCharge = fq;
			prot.switchOn = false;
			prot.switchDisplayOn = false;
		} else {
			for (const site of prot.hisSites) {
				site.protonation = hisProtonationHH(site.pKa, pH);
				site.charge = hisFormalCharge(site.protonation);
			}
			prot.hisProtonation = prot.hisSites[0].protonation;
			prot.hisCharge = prot.hisSites[0].charge;
		}
		let nearL1 = Infinity;
		let nearL2 = Infinity;
		let occL1 = 0;
		let occL2 = 0;
		let eL1 = 0;
		let eL2 = 0;
		let e12 = 0;
		const metals = particles.filter((p) => p.ligandClass === "ligand1");
		const peptides = particles.filter((p) => p.ligandClass === "ligand2");
		for (const site of prot.hisSites) {
			const pos = hisSiteWorldPos(prot, site.index);
			let eSite = 0;
			let nMetal = Infinity;
			let nPep = Infinity;
			const qMetalEff = metalHisEffectiveCharge(site.protonation, prefOn);
			for (const p of metals) {
				const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
				if (d < nMetal) nMetal = d;
				if (d < shell) {
					const u = metalHisPrefScale(site.protonation, d, prefFactor, prefOn) * yukawaEnergy(qMetalEff, p.q, d, k, lambda);
					eSite += u;
					eL1 += u;
				}
				if (d < nmToScene(1.4)) occL1 += 1;
			}
			for (const p of peptides) {
				const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
				if (d < nPep) nPep = d;
				if (d < shell) {
					const u = yukawaEnergy(site.charge, p.q, d, k, lambda);
					eSite += u;
					eL2 += u;
				}
				if (d < nmToScene(1.4)) occL2 += 1;
			}
			site.localEnergy = eSite;
			site.nearestMetal = nMetal;
			site.nearestHis5 = nPep;
			if (nMetal < nearL1) nearL1 = nMetal;
			if (nPep < nearL2) nearL2 = nPep;
		}
		for (const bead of prot.beads) {
			const fq = bead.fixedCharge ?? 0;
			if (Math.abs(fq) < .01) continue;
			const pos = beadWorldPos(prot, bead);
			for (const p of metals) {
				const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
				if (d < shell * 1.2) eL1 += yukawaEnergy(fq, p.q, d, k, lambda);
			}
			for (const p of peptides) {
				const d = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
				if (d < shell * 1.2) eL2 += yukawaEnergy(fq, p.q, d, k, lambda);
			}
		}
		for (const a of metals) for (const b of peptides) {
			const r = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
			if (r < shell * 2) e12 += yukawaEnergy(a.q, b.q, r, k, lambda);
		}
		prot.nearestL1 = nearL1;
		prot.nearestL2 = nearL2;
		prot.localEnergy = eL1 + eL2 + .35 * e12;
		const env = Math.abs(eL1) + Math.abs(eL2) + .35 * Math.abs(e12);
		const occBoost = (occL1 > 0 ? 1 : 0) + (occL2 > 0 ? 1 : 0);
		prot.response = Math.min(1, env * .18 + occBoost * .35) * (.55 + .45 * stress);
		prot.dominantLigand = Math.abs(eL1) >= Math.abs(eL2) ? metals.length ? "ligand1" : null : "ligand2";
		if (!metals.length && !peptides.length) prot.dominantLigand = null;
		updateHisSwitchBinary(prot, (eL1 + eL2) * .02 * (prot.hisProtonation > .5 ? 1 : .4));
		const confTarget = prot.response * .35 * (prot.dominantLigand === "ligand2" ? .7 : 1) + (prot.switchDisplayOn ? .08 : 0);
		prot.confScale += (confTarget - prot.confScale) * .12;
		const tintTarget = Math.min(1, stress * .6 + prot.response * .5);
		prot.stressTint += (tintTarget - prot.stressTint) * .16;
	}
}
/**
* Yukawa forces from His194 + continuum surface charges.
* Distances enter the potential in nanometres (r_nm = r_scene · 4).
*/
function hisSiteForces(particles, proteins, params, outFx, outFy, outFz) {
	const k = params.coulombK;
	const lambdaNm = Math.max(params.debyeNm ?? (params.debyeLength != null ? params.debyeLength * 4 : .8), 1e-9);
	const invL = 1 / lambdaNm;
	const maxRScene = Math.max(nmToScene(HIS_APPROACH_FAR_NM) * 3.5, nmToScene(lambdaNm * 5));
	const prefOn = params.metalHisPrefEnabled ?? true;
	const prefFactor = params.metalHisPrefFactor ?? 1.8;
	const wellOn = params.shortRangeWellEnabled ?? false;
	const wellDepth = params.shortRangeWellDepthKt ?? 3;
	const wellSigma = params.shortRangeWellSigmaNm ?? .4;
	const wellCut = params.shortRangeWellCutoffNm ?? .8;
	for (const prot of proteins) {
		const sites = prot.hisSites?.length ? prot.hisSites : [{
			charge: prot.hisCharge,
			index: 0,
			protonation: prot.hisProtonation
		}];
		for (const site of sites) {
			const protonation = site.protonation ?? prot.hisProtonation;
			const pos = hisSiteWorldPos(prot, site.index ?? 0);
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				const dx = p.x - pos.x;
				const dy = p.y - pos.y;
				const dz = p.z - pos.z;
				const r2 = dx * dx + dy * dy + dz * dz + 1e-16;
				const r = Math.sqrt(r2);
				if (r > maxRScene) continue;
				const rNm = sceneToNm(r);
				const isMetal = p.ligandClass === "ligand1";
				let qSite = site.charge ?? prot.hisCharge;
				let scale = 1;
				if (isMetal) {
					qSite = metalHisEffectiveCharge(protonation, prefOn);
					scale = metalHisPrefScale(protonation, r, prefFactor, prefOn);
				}
				if (Math.abs(qSite) >= .005 || Math.abs(scale - 1) >= 1e-6) {
					const screening = Math.exp(-rNm * invL);
					const fMag = scale * k * qSite * p.q * screening * (1 / (rNm * rNm) + invL / rNm);
					const invR = 1 / r;
					outFx[i] += fMag * dx * invR;
					outFy[i] += fMag * dy * invR;
					outFz[i] += fMag * dz * invR;
				}
				if (isMetal && wellOn) {
					const fWell = shortRangeWellForceMag(protonation, r, wellDepth, wellSigma, wellCut, true);
					if (fWell > 0) {
						const invR = 1 / r;
						outFx[i] -= fWell * dx * invR;
						outFy[i] -= fWell * dy * invR;
						outFz[i] -= fWell * dz * invR;
					}
				}
			}
		}
		for (const bead of prot.beads) {
			if (bead.isHisRoi) continue;
			const fq = bead.fixedCharge ?? 0;
			if (Math.abs(fq) < .01) continue;
			const pos = beadWorldPos(prot, bead);
			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				const dx = p.x - pos.x;
				const dy = p.y - pos.y;
				const dz = p.z - pos.z;
				const r2 = dx * dx + dy * dy + dz * dz + 1e-16;
				const r = Math.sqrt(r2);
				if (r > maxRScene) continue;
				const rNm = sceneToNm(r);
				const screening = Math.exp(-rNm * invL);
				const fMag = k * fq * p.q * screening * (1 / (rNm * rNm) + invL / rNm);
				const invR = 1 / r;
				outFx[i] += fMag * dx * invR;
				outFy[i] += fMag * dy * invR;
				outFz[i] += fMag * dz * invR;
			}
		}
	}
}
function hisRoiColor(protonation, _response, switchOn, clickPulse, _role = "target") {
	let [r, g, b] = divergingRedWhiteBlue(chargeToT(protonation, 1));
	if (switchOn) {
		r = r * .85 + .05;
		g = g * .85 + .15;
		b = Math.min(1, b * .7 + .45);
	}
	if (clickPulse > 0) {
		const p = Math.min(1, clickPulse);
		r = r * (1 - p) + 1 * p;
		g = g * (1 - p) + 1 * p;
		b = b * (1 - p) + 1 * p;
	}
	return [
		r,
		g,
		b
	];
}
function proteinBodyColor(stressTint, hisCharge, switchOn, clickPulse) {
	let [r, g, b] = PROTEIN_BASE_RGB;
	r = r + stressTint * .12;
	g = g - stressTint * .04;
	b = b - stressTint * .02;
	if (switchOn) b = Math.min(1, b + .08);
	if (clickPulse > .2) {
		const p = Math.min(1, clickPulse);
		r = r * (1 - .3 * p) + .27 * p;
		g = g * (1 - .3 * p) + .27 * p;
		b = b * (1 - .3 * p) + .285 * p;
	}
	return [
		Math.min(1, Math.max(0, r)),
		Math.min(1, Math.max(0, g)),
		Math.min(1, Math.max(0, b))
	];
}
var SPECIES = [
	{
		id: "pb-ion",
		label: "Pb²⁺",
		kind: "pb",
		ligandClass: "ligand1",
		radius: .055,
		friction: .95,
		fixedCharge: 2,
		groups: [],
		beads: 1,
		beadSpacing: 0,
		accent: "#3a3a42",
		accentRgb: [
			.22,
			.22,
			.26
		]
	},
	{
		id: "cu-ion",
		label: "Cu²⁺",
		kind: "cu",
		ligandClass: "ligand1",
		radius: .052,
		friction: .92,
		fixedCharge: 2,
		groups: [],
		beads: 1,
		beadSpacing: 0,
		accent: "#b87333",
		accentRgb: [
			.72,
			.45,
			.2
		]
	},
	{
		id: "ksrrrar-peptide",
		label: "KSRRRAR",
		kind: "peptide",
		ligandClass: "ligand2",
		radius: .068,
		friction: 1.42,
		fixedCharge: 0,
		groups: [
			{
				name: "Lys-K1",
				pKa: 10.5,
				kind: "base",
				magnitude: 1
			},
			{
				name: "Arg-R3",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			},
			{
				name: "Arg-R4",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			},
			{
				name: "Arg-R5",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			},
			{
				name: "Arg-R7",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			}
		],
		beads: 7,
		beadSpacing: .088,
		sequence: "KSRRRAR"
	},
	{
		id: "prarr-peptide",
		label: "PRARR",
		kind: "peptide",
		ligandClass: "ligand2",
		radius: .065,
		friction: 1.25,
		fixedCharge: 0,
		groups: [
			{
				name: "Arg-R2",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			},
			{
				name: "Arg-R3",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			},
			{
				name: "Arg-R4",
				pKa: 12.5,
				kind: "base",
				magnitude: 1
			}
		],
		beads: 5,
		beadSpacing: .085,
		sequence: "PRARR"
	},
	{
		id: "sllrst-peptide",
		label: "SLLRST",
		kind: "peptide",
		ligandClass: "ligand2",
		radius: .062,
		friction: 1.2,
		fixedCharge: 0,
		groups: [{
			name: "Arg-R4",
			pKa: 12.5,
			kind: "base",
			magnitude: 1
		}],
		beads: 6,
		beadSpacing: .082,
		sequence: "SLLRST"
	},
	{
		id: "his5-eaf",
		label: "L3-polyHis",
		kind: "his5",
		ligandClass: "ligand3",
		radius: .062,
		friction: 1.3,
		fixedCharge: 0,
		groups: [
			{
				name: "His1",
				pKa: 6.2,
				kind: "base",
				magnitude: 1
			},
			{
				name: "His2",
				pKa: 6.2,
				kind: "base",
				magnitude: 1
			},
			{
				name: "His3",
				pKa: 6.2,
				kind: "base",
				magnitude: 1
			},
			{
				name: "His4",
				pKa: 6.2,
				kind: "base",
				magnitude: 1
			},
			{
				name: "His5",
				pKa: 6.2,
				kind: "base",
				magnitude: 1
			}
		],
		beads: 5,
		beadSpacing: .08,
		sequence: "HHHHH"
	},
	{
		id: "acetylcholine",
		label: "L4-int",
		kind: "ach",
		ligandClass: "ligand4",
		radius: .048,
		friction: .85,
		fixedCharge: 1,
		groups: [],
		beads: 1,
		beadSpacing: 0,
		accent: "#22d3ee",
		accentRgb: [
			.13,
			.83,
			.93
		]
	}
];
function speciesMap() {
	return new Map(SPECIES.map((s) => [s.id, s]));
}
/** L1 heavy-metal species for current mode (undefined when off). */
function ligand1Species(mode = "pb") {
	const r = resolveHeavyMetal(mode);
	if (r === "off") return void 0;
	if (r === "cu") return SPECIES.find((s) => s.id === "cu-ion");
	return SPECIES.find((s) => s.id === "pb-ion");
}
function ligand2Species(variant = "ksrrrar") {
	const id = variant === "prarr" ? "prarr-peptide" : variant === "sllrst" ? "sllrst-peptide" : "ksrrrar-peptide";
	return SPECIES.find((s) => s.id === id);
}
function ligand3Species() {
	return SPECIES.find((s) => s.id === "his5-eaf");
}
function ligand4Species() {
	return SPECIES.find((s) => s.id === "acetylcholine");
}
function makeSeededRng(seed) {
	let s = seed >>> 0;
	return () => {
		s = s + 1831565813 >>> 0;
		let t = s;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
/** Henderson–Hasselbalch charge for ionizable groups on a species. */
function effectiveCharge(sp, pH) {
	if (sp.groups.length === 0) return sp.fixedCharge;
	let q = sp.fixedCharge;
	for (const g of sp.groups) if (g.kind === "base") {
		const theta = 1 / (1 + Math.pow(10, pH - g.pKa));
		q += g.magnitude * theta;
	} else {
		const deprot = 1 / (1 + Math.pow(10, g.pKa - pH));
		q -= g.magnitude * deprot;
	}
	return q;
}
function debyeFromPH(pH) {
	let debyeNm = .8;
	let regime = "physiological";
	if (pH < 6) {
		debyeNm = .72;
		regime = "pathological";
	} else if (pH < 6.8) {
		debyeNm = .76;
		regime = "stress";
	} else if (pH > 8.5) {
		debyeNm = .85;
		regime = "basic";
	} else regime = "physiological";
	return {
		debyeNm,
		debyeScene: debyeNm,
		regime
	};
}
var REGIME_META = {
	physiological: {
		label: "Physiological",
		range: "pH ~7.2–7.6",
		short: "phys"
	},
	stress: {
		label: "Stress / Acidosis",
		range: "pH ~6.0–6.8",
		short: "stress"
	},
	pathological: {
		label: "Pathological",
		range: "pH ≤ 5.5 or ≥ 9",
		short: "path"
	},
	basic: {
		label: "Basic",
		range: "pH > 8.5",
		short: "basic"
	}
};
function buildSimParams(pH, overrides = {}) {
	const d = debyeFromPH(pH);
	const debyeNm = overrides.debyeNm ?? d.debyeNm;
	const base = {
		pH,
		regime: overrides.regime ?? d.regime,
		coulombK: overrides.coulombK ?? 1.15,
		debyeNm,
		debyeLength: overrides.debyeLength ?? debyeNm,
		forceCutoffNm: overrides.forceCutoffNm ?? 4 * debyeNm,
		forceCutoffScene: overrides.forceCutoffScene ?? 4 * debyeNm,
		frictionScale: overrides.frictionScale ?? 1.35,
		noiseScale: overrides.noiseScale ?? .45,
		dt: overrides.dt ?? .012,
		kT: overrides.kT ?? 1,
		metalHisPrefFactor: overrides.metalHisPrefFactor ?? 1.8,
		metalHisPrefEnabled: overrides.metalHisPrefEnabled ?? false,
		shortRangeWellEnabled: overrides.shortRangeWellEnabled ?? false,
		shortRangeWellDepthKt: overrides.shortRangeWellDepthKt ?? 3,
		shortRangeWellSigmaNm: overrides.shortRangeWellSigmaNm ?? .4,
		shortRangeWellCutoffNm: overrides.shortRangeWellCutoffNm ?? .8,
		fCap: overrides.fCap ?? 16.2
	};
	return {
		...base,
		...overrides,
		pH,
		debyeNm: overrides.debyeNm ?? base.debyeNm
	};
}
function wallForce(x, y, z, softR = .35) {
	const r = Math.hypot(x, y, z);
	const R = 3.2;
	if (r < R - softR) return [
		0,
		0,
		0
	];
	const s = -.08 * (r - (R - softR));
	const inv = 1 / (r + 1e-9);
	return [
		s * x * inv,
		s * y * inv,
		s * z * inv
	];
}
function fieldAt(x, y, z, particles, params, proteins) {
	const k = params.coulombK;
	const lambda = Math.max(params.debyeNm || sceneToNm(params.debyeLength), 1e-9);
	const cutoff = params.forceCutoffNm || 4 * lambda;
	let ex = 0, ey = 0, ez = 0, potential = 0;
	for (const p of particles) {
		const dx = x - p.x;
		const dy = y - p.y;
		const dz = z - p.z;
		const r = Math.hypot(dx, dy, dz);
		const rNm = sceneToNm(r);
		if (rNm < 1e-6 || rNm > cutoff) continue;
		const invL = 1 / lambda;
		const screening = Math.exp(-rNm * invL);
		const u = k * p.q * screening / rNm;
		potential += u;
		const fMag = k * p.q * screening * (1 / (rNm * rNm) + invL / rNm);
		const invR = 1 / r;
		ex += fMag * dx * invR;
		ey += fMag * dy * invR;
		ez += fMag * dz * invR;
	}
	return {
		ex,
		ey,
		ez,
		potential
	};
}
/** Pairwise particle–particle Yukawa into force buffers. */
function computeForces(particles, params, fx, fy, fz) {
	const n = particles.length;
	const k = params.coulombK;
	const lambda = Math.max(params.debyeNm || sceneToNm(params.debyeLength), 1e-9);
	const cutoffScene = params.forceCutoffScene || nmToScene(params.forceCutoffNm || 3.2);
	const fCap = params.fCap ?? 16.2;
	for (let i = 0; i < n; i++) {
		fx[i] = 0;
		fy[i] = 0;
		fz[i] = 0;
	}
	for (let i = 0; i < n; i++) {
		const a = particles[i];
		for (let j = i + 1; j < n; j++) {
			const b = particles[j];
			const dx = a.x - b.x;
			const dy = a.y - b.y;
			const dz = a.z - b.z;
			const r = Math.hypot(dx, dy, dz);
			if (r < 1e-6 || r > cutoffScene) continue;
			const fMag = yukawaForceMag(a.q, b.q, r, k, lambda);
			a.q * b.q;
			const invR = 1 / r;
			(a.q * b.q >= 0 ? 1 : -1) * fMag * invR;
			const coef = Math.sign(a.q * b.q || 1) * fMag * invR;
			fx[i] += coef * dx;
			fy[i] += coef * dy;
			fz[i] += coef * dz;
			fx[j] -= coef * dx;
			fy[j] -= coef * dy;
			fz[j] -= coef * dz;
		}
	}
	for (let i = 0; i < n; i++) {
		const m = Math.hypot(fx[i], fy[i], fz[i]);
		if (m > fCap) {
			const s = fCap / m;
			fx[i] *= s;
			fy[i] *= s;
			fz[i] *= s;
		}
	}
}
function stepOverdamped(particles, species, params, fx, fy, fz, proteins, rng) {
	const n = particles.length;
	computeForces(particles, params, fx, fy, fz);
	hisSiteForces(particles, proteins, params, fx, fy, fz);
	const fCap = params.fCap ?? 16.2;
	const dt = params.dt ?? .012;
	const kT = params.kT ?? 1;
	const frictionScale = params.frictionScale ?? 1.35;
	const noiseScale = params.noiseScale ?? .45;
	for (let i = 0; i < n; i++) {
		const m = Math.hypot(fx[i], fy[i], fz[i]);
		if (m > fCap) {
			const s = fCap / m;
			fx[i] *= s;
			fy[i] *= s;
			fz[i] *= s;
		}
		const p = particles[i];
		const friction = (species.get(p.speciesId)?.friction ?? 1) * frictionScale;
		const invF = 1 / Math.max(friction, 1e-6);
		const n1 = rng() * 2 - 1;
		const n2 = rng() * 2 - 1;
		const n3 = rng() * 2 - 1;
		const amp = noiseScale * Math.sqrt(2 * kT * invF * dt);
		p.x += fx[i] * invF * dt + n1 * amp;
		p.y += fy[i] * invF * dt + n2 * amp;
		p.z += fz[i] * invF * dt + n3 * amp;
	}
}
function spawnParticles(count, pH, metalMode = "pb", seed = 1, ligand2Count = 0, peptideVariant = "ksrrrar", ligand3Count = 0, ligand4Count = 0) {
	const l1Sp = count > 0 ? ligand1Species(metalMode) : void 0;
	const l2Sp = ligand2Count > 0 && peptideVariant !== "off" ? ligand2Species(peptideVariant === "prarr" ? "prarr" : peptideVariant === "sllrst" ? "sllrst" : "ksrrrar") : void 0;
	const l3Sp = ligand3Count > 0 ? ligand3Species() : void 0;
	const l4Sp = ligand4Count > 0 ? ligand4Species() : void 0;
	const out = [];
	const rand = makeSeededRng(seed);
	const pushOne = (sp, id, x, y, z) => {
		let ox = rand() * 2 - 1;
		let oy = rand() * 2 - 1;
		let oz = rand() * 2 - 1;
		const on = Math.sqrt(ox * ox + oy * oy + oz * oz) + 1e-9;
		const qDesign = sp.id === "pb-ion" || sp.id === "cu-ion" ? 2 : sp.id === "acetylcholine" ? 1 : sp.id === "prarr-peptide" ? 3 : sp.id === "sllrst-peptide" ? 1 : sp.id === "his5-eaf" ? 5 : 5;
		out.push({
			id,
			speciesId: sp.id,
			kind: sp.kind,
			ligandClass: sp.ligandClass,
			x,
			y,
			z,
			ox: ox / on,
			oy: oy / on,
			oz: oz / on,
			q: effectiveCharge(sp, pH),
			qDesign
		});
	};
	let id = 0;
	const place = (sp, n, r0, r1) => {
		if (!sp || n <= 0) return;
		for (let i = 0; i < n; i++) {
			const theta = rand() * Math.PI * 2;
			const phi = Math.acos(2 * rand() - 1);
			const r = r0 + rand() * (r1 - r0);
			pushOne(sp, id++, Math.sin(phi) * Math.cos(theta) * r, Math.sin(phi) * Math.sin(theta) * r * .55, Math.cos(phi) * r);
		}
	};
	place(l1Sp, count, .8, 2.6);
	place(l2Sp, ligand2Count, .7, 2.5);
	place(l3Sp, ligand3Count, .9, 2.4);
	place(l4Sp, ligand4Count, .85, 2.5);
	return out;
}
var OCCUPANCY_R = () => nmToScene(HIS_APPROACH_FAR_NM);
function computeRoiEnergy(prot, particles, params) {
	const k = params.coulombK;
	const lambda = Math.max(params.debyeNm || sceneToNm(params.debyeLength), 1e-9);
	const wellOn = params.shortRangeWellEnabled;
	const wellDepth = params.shortRangeWellDepthKt;
	const wellSigma = params.shortRangeWellSigmaNm;
	const wellCut = params.shortRangeWellCutoffNm;
	const l1 = particles.filter((p) => p.ligandClass === "ligand1");
	const l2 = particles.filter((p) => p.ligandClass === "ligand2");
	const l3 = particles.filter((p) => p.ligandClass === "ligand3");
	const l4 = particles.filter((p) => p.ligandClass === "ligand4");
	let nearestL1 = Infinity;
	let nearestL2 = Infinity;
	let nearestL3 = Infinity;
	let nearestL4 = Infinity;
	let nearestL1Id = null;
	let nearestL2Id = null;
	let energyL1His = 0;
	let energyL2His = 0;
	let energyL3His = 0;
	let energyL4His = 0;
	let forceMagL1His = 0;
	let forceMagL2His = 0;
	let energyAsp = 0;
	let energyCanyon = 0;
	let energyWell = 0;
	let energyL1L2 = 0;
	let forceMagL1L2 = 0;
	const sites = prot.hisSites?.length ? prot.hisSites : [{
		index: 0,
		label: "His194",
		pKa: prot.hisPka,
		protonation: prot.hisProtonation,
		charge: prot.hisCharge,
		continuousScore: prot.continuousScore,
		switchOn: prot.switchOn,
		switchDisplayOn: prot.switchDisplayOn,
		switchOverride: null,
		clickPulse: 0,
		localEnergy: 0,
		nearestMetal: Infinity,
		nearestHis5: Infinity,
		role: "target"
	}];
	const siteEnergies = [];
	const arrows = [];
	const shell = OCCUPANCY_R() * 2.8;
	for (const site of sites) {
		const pos = hisSiteWorldPos(prot, site.index);
		let eL1 = 0;
		let eL2 = 0;
		let nL1 = Infinity;
		let nL2 = Infinity;
		let nearestKind = null;
		let nearestDist = Infinity;
		let nearestLabel = "—";
		for (const p of l1) {
			const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
			if (r < nL1) {
				nL1 = r;
				if (r < nearestL1) {
					nearestL1 = r;
					nearestL1Id = p.id;
				}
			}
			if (r < nearestDist) {
				nearestDist = r;
				nearestKind = "peptide";
				nearestLabel = "KSRRRAR";
			}
			if (r < shell) {
				const u = yukawaEnergy(site.charge, p.q, r, k, lambda);
				eL1 += u;
				forceMagL1His += yukawaForceMag(site.charge, p.q, r, k, lambda);
				if (wellOn) {
					const uw = shortRangeWellEnergy(site.protonation, r, wellDepth, wellSigma, wellCut, true);
					eL1 += uw;
					energyWell += uw;
					forceMagL1His += shortRangeWellForceMag(site.protonation, r, wellDepth, wellSigma, wellCut, true);
				}
			}
		}
		for (const p of l2) {
			const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
			if (r < nL2) {
				nL2 = r;
				if (r < nearestL2) {
					nearestL2 = r;
					nearestL2Id = p.id;
				}
			}
			if (r < nearestDist) {
				nearestDist = r;
				nearestKind = "peptide";
				nearestLabel = "peptide";
			}
			if (r < shell) {
				eL2 += yukawaEnergy(site.charge, p.q, r, k, lambda);
				forceMagL2His += yukawaForceMag(site.charge, p.q, r, k, lambda);
			}
		}
		let eL3 = 0;
		let eL4 = 0;
		for (const p of l3) {
			const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
			if (r < nearestL3) nearestL3 = r;
			if (r < nL2) nL2 = r;
			if (r < nearestL2) {
				nearestL2 = r;
				nearestL2Id = p.id;
			}
			if (r < nearestDist) {
				nearestDist = r;
				nearestKind = "peptide";
				nearestLabel = "L3";
			}
			if (r < shell) eL3 += yukawaEnergy(site.charge, p.q, r, k, lambda);
		}
		for (const p of l4) {
			const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
			if (r < nearestL4) nearestL4 = r;
			if (r < nL2) nL2 = r;
			if (r < nearestL2) {
				nearestL2 = r;
				nearestL2Id = p.id;
			}
			if (r < nearestDist) {
				nearestDist = r;
				nearestKind = "peptide";
				nearestLabel = "L4";
			}
			if (r < shell) eL4 += yukawaEnergy(site.charge, p.q, r, k, lambda);
		}
		energyL1His += eL1;
		energyL2His += eL2;
		energyL3His += eL3;
		energyL4His += eL4;
		siteEnergies.push({
			index: site.index,
			label: site.label,
			role: "catalytic His",
			protonation: site.protonation,
			switchOn: site.switchDisplayOn,
			energyPb: eL1,
			energyCo: 0,
			energyMetal: eL1,
			energyHis5: eL2,
			energyTotal: eL1 + eL2 + eL3 + eL4,
			nearestMetalNm: nL1 === Infinity ? -1 : sceneToNm(nL1),
			nearestHis5Nm: nL2 === Infinity ? -1 : sceneToNm(nL2),
			nearestLigandKind: nearestKind,
			nearestLigandLabel: nearestLabel,
			nearestLigandNm: nearestDist === Infinity ? -1 : sceneToNm(nearestDist),
			occupancyLabel: nearestDist === Infinity ? "empty" : `${nearestLabel} @ ${sceneToNm(nearestDist).toFixed(2)} nm`
		});
	}
	const allLigands = [
		...l1,
		...l2,
		...l3,
		...l4
	];
	for (const bead of prot.beads) {
		const fq = bead.fixedCharge ?? 0;
		if (Math.abs(fq) < .01) continue;
		const pos = beadWorldPos(prot, bead);
		let e = 0;
		for (const p of allLigands) {
			const r = Math.hypot(p.x - pos.x, p.y - pos.y, p.z - pos.z);
			if (r < shell * 1.2) e += yukawaEnergy(fq, p.q, r, k, lambda);
		}
		if (bead.morph === "asp") energyAsp += e;
		else energyCanyon += e;
	}
	const roi = roiWorldPos(prot);
	const nearRoi = (p) => Math.hypot(p.x - roi.x, p.y - roi.y, p.z - roi.z) <= shell * 2;
	for (const a of l1) {
		if (!nearRoi(a)) continue;
		for (const b of l2) {
			const r = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
			if (r > shell * 2) continue;
			energyL1L2 += yukawaEnergy(a.q, b.q, r, k, lambda);
			forceMagL1L2 += yukawaForceMag(a.q, b.q, r, k, lambda);
		}
	}
	const hisPos = hisSiteWorldPos(prot, 0);
	if (nearestL1Id != null) {
		const p = l1.find((x) => x.id === nearestL1Id);
		if (p) arrows.push({
			ax: p.x,
			ay: p.y,
			az: p.z,
			bx: hisPos.x,
			by: hisPos.y,
			bz: hisPos.z,
			energy: energyL1His,
			kind: "L1-His"
		});
	}
	if (nearestL2Id != null) {
		const p = l2.find((x) => x.id === nearestL2Id);
		if (p) arrows.push({
			ax: p.x,
			ay: p.y,
			az: p.z,
			bx: hisPos.x,
			by: hisPos.y,
			bz: hisPos.z,
			energy: energyL2His,
			kind: "L2-His"
		});
	}
	const energyTotal = energyL1His + energyL2His + energyL3His + energyL4His + energyL1L2 + energyAsp + energyCanyon + energyWell;
	return {
		energyL1His,
		energyL2His,
		energyL3His,
		energyL4His,
		energyL1L2,
		energyAsp,
		energyCanyon,
		energyWell,
		energyTotal,
		forceMagL1His,
		forceMagL2His,
		forceMagL1L2,
		nearestL1Nm: nearestL1 === Infinity ? -1 : sceneToNm(nearestL1),
		nearestL2Nm: nearestL2 === Infinity ? -1 : sceneToNm(nearestL2),
		nearestL3Nm: nearestL3 === Infinity ? -1 : sceneToNm(nearestL3),
		nearestL4Nm: nearestL4 === Infinity ? -1 : sceneToNm(nearestL4),
		nearestL1Id,
		nearestL2Id,
		hisCharge: prot.hisCharge,
		hisProtonation: prot.hisProtonation,
		shortRangeWellEnabled: wellOn,
		siteEnergies,
		arrows,
		regime: params.regime,
		sitesOn: prot.switchDisplayOn ? 1 : 0,
		sitesTotal: 1,
		occL1: l1.length,
		occL2: l2.length,
		switchDisplayOn: prot.switchDisplayOn,
		switchOverride: prot.switchOverride,
		continuousScore: prot.continuousScore
	};
}
var MAX_SAMPLES = 256;
function emptyBehaviorStats() {
	return {
		switchEvents: 0,
		hhBinaryEvents: 0,
		proximityEvents: 0,
		clampEvents: 0,
		triggerDistancesNm: [],
		hhTriggerDistancesNm: [],
		responseTimesNs: []
	};
}
function mean(xs) {
	if (!xs.length) return 0;
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function median(xs) {
	if (!xs.length) return 0;
	const s = [...xs].sort((a, b) => a - b);
	const m = Math.floor(s.length / 2);
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function pushSample(arr, v) {
	arr.push(v);
	if (arr.length > MAX_SAMPLES) arr.shift();
}
/**
* Dual independent event definitions (His194):
*
* 1) Proximity — min ligand–His194 distance < PROXIMITY_EVENT_NM (1.0 nm)
*    held ≥ EVENT_CONFIRM_FRAMES (3). Edge-triggered once per visit.
*
* 2) HH-binary — θ ≥ 0.5 held ≥ 3 frames after a polarity edge.
*
* No response-time metric (threshold-limited).
*/
function updateBehaviorTracking(args) {
	const { stats, nearestL1Nm, nearestL2Nm, timeNs, switchOn, justClamped } = args;
	const nearestParticleId = args.nearestParticleId != null && args.nearestParticleId >= 0 ? args.nearestParticleId : null;
	let pending = args.pending;
	let pendingSwitch = args.pendingSwitch;
	let pendingProximity = args.pendingProximity;
	let prevSwitchOn = args.prevSwitchOn;
	let justAcceptedProximity = false;
	let acceptedProximityParticleId = null;
	let acceptedProximityDistNm = null;
	const nearest = Math.min(Number.isFinite(nearestL1Nm) && nearestL1Nm > 0 ? nearestL1Nm : Infinity, Number.isFinite(nearestL2Nm) && nearestL2Nm > 0 ? nearestL2Nm : Infinity);
	if (nearest < 1) {
		const sameParticle = pendingProximity != null && nearestParticleId != null && pendingProximity.particleId === nearestParticleId;
		if (!pendingProximity || !sameParticle) pendingProximity = {
			distNm: nearest,
			tNs: timeNs,
			stableFrames: 1,
			counted: false,
			particleId: nearestParticleId
		};
		else {
			pendingProximity = {
				...pendingProximity,
				stableFrames: pendingProximity.stableFrames + 1,
				distNm: Math.min(pendingProximity.distNm, nearest),
				particleId: nearestParticleId ?? pendingProximity.particleId ?? null
			};
			if (!pendingProximity.counted && pendingProximity.stableFrames >= 3) {
				stats.proximityEvents += 1;
				if (Number.isFinite(pendingProximity.distNm)) pushSample(stats.triggerDistancesNm, pendingProximity.distNm);
				justAcceptedProximity = true;
				acceptedProximityParticleId = pendingProximity.particleId;
				acceptedProximityDistNm = pendingProximity.distNm;
				pendingProximity = {
					...pendingProximity,
					counted: true
				};
			}
		}
	} else pendingProximity = null;
	if (prevSwitchOn != null && prevSwitchOn !== switchOn) pendingSwitch = {
		toOn: switchOn,
		distNm: Number.isFinite(nearest) ? nearest : Infinity,
		tNs: timeNs,
		stableFrames: 1
	};
	else if (pendingSwitch) if (switchOn === pendingSwitch.toOn) {
		pendingSwitch = {
			...pendingSwitch,
			stableFrames: pendingSwitch.stableFrames + 1
		};
		if (pendingSwitch.stableFrames >= 3) {
			stats.switchEvents += 1;
			stats.hhBinaryEvents += 1;
			if (Number.isFinite(pendingSwitch.distNm) && pendingSwitch.distNm > 0 && pendingSwitch.distNm < 1e6) pushSample(stats.hhTriggerDistancesNm, pendingSwitch.distNm);
			pendingSwitch = null;
		}
	} else pendingSwitch = null;
	prevSwitchOn = switchOn;
	args.theta;
	return {
		pending,
		pendingSwitch,
		pendingProximity,
		prevSwitchOn: prevSwitchOn ?? switchOn,
		justAcceptedProximity,
		acceptedProximityParticleId,
		acceptedProximityDistNm
	};
}
function buildScientificSnapshot(args) {
	const behavior = args.stats;
	const params = args.params;
	const trig = behavior.triggerDistancesNm;
	const snap = {
		schema: "moleculosphere5d.scientific_snapshot.v1.1",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		workflow: {
			label: "BCDT open-tool scientific snapshot",
			note: PUBLICATION_DISCLAIMER,
			bcdt: true
		},
		receptor: {
			label: "Furin catalytic triad continuum proxy",
			triad: "Asp153–His194–Ser368",
			site: "His194",
			roi: "His194"
		},
		behavior: {
			switchEvents: behavior.switchEvents,
			hhBinaryEvents: behavior.hhBinaryEvents ?? behavior.switchEvents,
			proximityEvents: behavior.proximityEvents,
			clampEvents: behavior.clampEvents,
			meanTriggerDistanceNm: trig.length ? mean(trig) : null,
			medianTriggerDistanceNm: trig.length ? median(trig) : null,
			meanResponseTimeNs: null,
			medianResponseTimeNs: null,
			meanResponseTimeFrames: null,
			nTriggerSamples: trig.length,
			nResponseSamples: 0,
			triggerDistancesNm: [...trig],
			responseTimesNs: [],
			eventRules: "Proximity: min d < 1.0 nm hold ≥ 3 frames. HH-binary: θ≥0.5 edge hold ≥ 3 frames. No response-time metric."
		},
		electrostatics: {
			debyeNm: params.debyeNm,
			debyeScene: params.debyeLength,
			debyeOverride: args.debyeOverride,
			coulombK: params.coulombK,
			pH: args.pH,
			regime: params.regime,
			charges: {
				pb: args.pbCharge,
				peptideNominal: args.peptideCharge,
				asp153: -1,
				his194: args.hisCharge,
				his194Protonation: args.theta
			},
			metalHisPrefEnabled: args.metalHisPrefEnabled ?? params.metalHisPrefEnabled,
			metalHisPrefFactor: args.metalHisPrefFactor ?? params.metalHisPrefFactor,
			shortRangeWellEnabled: args.shortRangeWellEnabled ?? params.shortRangeWellEnabled,
			shortRangeWellDepthKt: args.shortRangeWellDepthKt ?? params.shortRangeWellDepthKt,
			energies: args.roi ? {
				U_L1_His: args.roi.energyL1His,
				U_L2_His: args.roi.energyL2His,
				U_L1_L2: args.roi.energyL1L2,
				U_tot: args.roi.energyTotal,
				forceMagL1His: args.roi.forceMagL1His,
				forceMagL2His: args.roi.forceMagL2His,
				forceMagL1L2: args.roi.forceMagL1L2
			} : null
		},
		hendersonHasselbalch: {
			pKa: args.hisPka,
			pH: args.pH,
			theta: args.theta,
			qHis: args.hisCharge,
			binaryOn: args.binaryOn,
			note: "Henderson–Hasselbalch describes the continuum protonation equilibrium of the catalytic histidine; no quantum-chemical orbital calculation is performed."
		},
		scenario: {
			activeScenario: args.scenarioId,
			ligandBaseline: args.ligandBaseline,
			ligand2Enabled: args.ligand2Enabled,
			ligand2Count: args.ligand2Count,
			ligand2ChargeScale: args.ligand2ChargeScale,
			moleculeCount: args.moleculeCount,
			displayDurationSec: args.displayDurationSec,
			respawnOnBinding: args.respawnOnBinding ?? false
		},
		trajectorySummary: args.trajectorySummary ? {
			eventLogLen: args.trajectorySummary.frameCount,
			timeNs: args.timeNs
		} : {
			eventLogLen: 0,
			timeNs: args.timeNs
		},
		eventSeries: args.eventSeries
	};
	snap.conditions = snap.scenario;
	return snap;
}
function scientificSnapshotToCsv(snap) {
	return [
		"key,value",
		`exportedAt,${snap.exportedAt}`,
		`proximityEvents,${snap.behavior.proximityEvents}`,
		`hhBinaryEvents,${snap.behavior.hhBinaryEvents}`,
		`meanTriggerDistanceNm,${snap.behavior.meanTriggerDistanceNm ?? ""}`,
		`pH,${snap.electrostatics.pH}`,
		`debyeNm,${snap.electrostatics.debyeNm}`,
		`coulombK,${snap.electrostatics.coulombK}`,
		`theta,${snap.hendersonHasselbalch.theta}`,
		`qHis,${snap.hendersonHasselbalch.qHis}`,
		`binaryOn,${snap.hendersonHasselbalch.binaryOn}`,
		`ligandBaseline,${snap.scenario.ligandBaseline}`,
		`respawnOnBinding,${snap.scenario.respawnOnBinding ?? false}`,
		`U_L1_His,${snap.electrostatics.energies?.U_L1_His ?? ""}`,
		`U_L2_His,${snap.electrostatics.energies?.U_L2_His ?? ""}`,
		`U_tot,${snap.electrostatics.energies?.U_tot ?? ""}`
	].join("\n");
}
function eventSeriesToCsv(frames) {
	return ["tNs,U_Pb_His,U_pep_His,U_L1_L2,U_tot,His194_ON", ...frames.map((f) => [
		f.tNs,
		f.eL1 ?? "",
		f.eL2 ?? "",
		f.eL12 ?? "",
		f.eTot ?? f.U ?? "",
		f.on === void 0 ? "" : f.on ? 1 : 0
	].join(","))].join("\n");
}
function behaviorSamplesToCsv(stats) {
	const lines = ["kind,value"];
	for (const d of stats.triggerDistancesNm) lines.push(`proximityDistNm,${d}`);
	for (const d of stats.hhTriggerDistancesNm) lines.push(`hhDistNm,${d}`);
	return lines.join("\n");
}
/** Locked physical parameters — must match sandbox and WSL (nm-native). */
var VALIDITY_LOCKED = {
	debyeNm: .8,
	/** Debye in coordinate units (= nm when scale=1). */
	debyeScene: .8,
	hisPka: 6.2,
	forceCutoffLambdaMult: 4,
	forceCutoffNm: 3.2,
	/** Cutoff in coordinate units (= nm when scale=1). */
	forceCutoffScene: 3.2,
	shortRangeWellEnabled: false,
	metalHisPrefEnabled: false,
	temperature: 298,
	kT: 1,
	coulombK: 1.15,
	frictionScale: 1.35,
	frameNs: 100,
	runFrames: 2500,
	rampFrames: 1500,
	replicates: 10,
	/** Master RNG seed; replicate i uses baseSeed + i·997 (+ offset per baseline). */
	baseSeed: 20260805,
	nMolecules: 50,
	proximityNm: 1,
	confirmFrames: 3,
	shellMinNm: .55,
	shellMaxNm: 2.8,
	/** Permanent nm-native coordinate scale (no reduced scene units). */
	coordScaleToNm: 1,
	coordsSource: "diagnostics/diag_Build_initial_coords_SCALED_nm.json"
};
var VALIDITY_BASELINES = [
	{
		id: "Baseline_KSRRRAR_50",
		label: "KSRRRAR ×50",
		sequence: "KSRRRAR",
		nominalCharge: 5,
		ligandBaseline: "ligand1",
		description: "Exclusive Ligand-1 baseline: 50× KSRRRAR (K+1, R+1×4 → +5; S,A neutral)"
	},
	{
		id: "Baseline_PRARR_50",
		label: "PRARR ×50",
		sequence: "PRARR",
		nominalCharge: 3,
		ligandBaseline: "ligand2",
		description: "Exclusive Ligand-2 baseline: 50× PRARR (R+1×3 → +3; P,A neutral)"
	},
	{
		id: "Baseline_SLLRST_50",
		label: "SLLRST ×50",
		sequence: "SLLRST",
		nominalCharge: 1,
		ligandBaseline: "ligand2",
		description: "Exclusive L2 baseline: 50× SLLRST (single Arg → +1; S,L,T neutral). Continuum single-Arg educational proxy."
	}
];
var VALIDITY_FIXED_PH = [
	{
		kind: "fixed-pH",
		pH: 7.4,
		frames: VALIDITY_LOCKED.runFrames
	},
	{
		kind: "fixed-pH",
		pH: 6.2,
		frames: VALIDITY_LOCKED.runFrames
	},
	{
		kind: "fixed-pH",
		pH: 5,
		frames: VALIDITY_LOCKED.runFrames
	}
];
VALIDITY_LOCKED.rampFrames;
function meanSd$1(xs) {
	if (!xs.length) return {
		mean: 0,
		sd: 0
	};
	const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
	if (xs.length < 2) return {
		mean,
		sd: 0
	};
	const v = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
	return {
		mean,
		sd: Math.sqrt(v)
	};
}
function aggregateReplicates(a, b, c) {
	let baselineId;
	let protocol;
	let reps;
	if (Array.isArray(a)) {
		reps = a;
		if (!reps.length) return null;
		baselineId = reps[0].baselineId;
		protocol = reps[0].protocol;
	} else {
		baselineId = a;
		protocol = b;
		reps = c;
	}
	const num = (xs) => meanSd$1(xs.map((x) => x == null || !Number.isFinite(x) ? 0 : x));
	return {
		baselineId,
		protocol,
		n: reps.length,
		proximityEvents: meanSd$1(reps.map((r) => r.proximityEvents)),
		hhBinaryEvents: meanSd$1(reps.map((r) => r.hhBinaryEvents)),
		meanProximityDistNm: num(reps.map((r) => r.meanProximityDistNm)),
		meanHhDistNm: num(reps.map((r) => r.meanHhDistNm)),
		meanUPepHis: meanSd$1(reps.map((r) => r.meanUPepHis)),
		meanUTot: meanSd$1(reps.map((r) => r.meanUTot)),
		finalTheta: meanSd$1(reps.map((r) => r.finalTheta)),
		finalQHis: meanSd$1(reps.map((r) => r.finalQHis)),
		replicates: reps
	};
}
var SOLO_N = 20;
var PAIR_N = 12;
var MULTI_N = 8;
/**
* Multi-ligand presets (engine internal / private MULTI suite).
* User-facing L numbering: L1=Pb²⁺, L2=KSRRRAR, L3=(internal), L4=(internal).
* Not exposed on the public Beta v1.0 surface.
*/
var MULTI_LIGAND_PRESETS = {
	L1: {
		Pb: 1,
		peptide: 0,
		L4: 0,
		L3_int: 0,
		label: "L1 · Pb²⁺ alone"
	},
	L2: {
		Pb: 0,
		peptide: 1,
		L4: 0,
		L3_int: 0,
		label: "L2 · KSRRRAR alone"
	},
	L3: {
		Pb: 0,
		peptide: 0,
		L4: 1,
		L3_int: 0,
		label: "L3 · L4-int alone"
	},
	L4: {
		Pb: 0,
		peptide: 0,
		L4: 0,
		L3_int: 1,
		label: "L4 · L3-int alone"
	},
	"1+3": {
		Pb: 1,
		peptide: 0,
		L4: 1,
		L3_int: 0,
		label: "1+3 · Pb²⁺ + L4-int"
	},
	"2+3": {
		Pb: 0,
		peptide: 1,
		L4: 1,
		L3_int: 0,
		label: "2+3 · KSRRRAR + L4-int"
	},
	"1+2+3": {
		Pb: 1,
		peptide: 1,
		L4: 1,
		L3_int: 0,
		label: "1+2+3 · Pb²⁺ + KSRRRAR + L4-int"
	},
	"3+4": {
		Pb: 0,
		peptide: 0,
		L4: 1,
		L3_int: 1,
		label: "3+4 · L4-int + L3-int"
	},
	"2+3+4": {
		Pb: 0,
		peptide: 1,
		L4: 1,
		L3_int: 1,
		label: "2+3+4 · KSRRRAR + L4-int + L3-int"
	},
	"1+2+3+4": {
		Pb: 1,
		peptide: 1,
		L4: 1,
		L3_int: 1,
		label: "1+2+3+4 · full set"
	}
};
var MULTI_LIGAND_PRESET_ORDER = [
	"L1",
	"L2",
	"L3",
	"L4",
	"1+3",
	"2+3",
	"1+2+3",
	"3+4",
	"2+3+4",
	"1+2+3+4"
];
function multiLigandPresetToSet(id) {
	const f = MULTI_LIGAND_PRESETS[id];
	if (!f) return {
		id,
		label: id,
		pb: 0,
		peptide: "off",
		peptideCount: 0,
		his5: 0,
		ach: 0
	};
	const nActive = f.Pb + f.peptide + f.L4 + f["L3_int"];
	const n = nActive <= 1 ? SOLO_N : nActive === 2 ? PAIR_N : MULTI_N;
	return {
		id,
		label: f.label,
		pb: f.Pb ? n : 0,
		peptide: f.peptide ? "ksrrrar" : "off",
		peptideCount: f.peptide ? n : 0,
		his5: f["L3_int"] ? n : 0,
		ach: f.L4 ? n : 0
	};
}
function multiLigandSets() {
	return MULTI_LIGAND_PRESET_ORDER.map((id) => multiLigandPresetToSet(id));
}
var PROGRAMMES = {
	prog1_metal: {
		id: "prog1_metal",
		shortLabel: "P1 · Pb across A–F",
		label: "Programme 1 – Pb²⁺ continuum ranking across public receptors A–F",
		hypothesis: "Divalent heavy-metal continuum energy (U_Pb–ROI) ranks across receptor electrostatic environments A–F under locked Debye–Hückel parameters.",
		note: "Public continuum ranking only — not a structural or pharmacological claim.",
		receptors: [
			"furin",
			"acidicPore",
			"alpha7Allo",
			"alpha7Ortho",
			"atp7aWt",
			"atp7aMenkes"
		],
		ligandSets: [{
			id: "L1",
			label: "Pb²⁺ exclusive",
			pb: 20,
			peptide: "off",
			peptideCount: 0,
			his5: 0,
			ach: 0
		}, {
			id: "L1L2",
			label: "Pb²⁺ + KSRRRAR",
			pb: 15,
			peptide: "ksrrrar",
			peptideCount: 10,
			his5: 0,
			ach: 0
		}],
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: true,
		respawnDefault: false,
		primaryReadouts: [
			"U_Pb–ROI",
			"proximity events (if respawn ON)",
			"ranking vs pH"
		],
		publicationCandidate: true,
		privateNanotoxicity: false
	},
	prog2_pore: {
		id: "prog2_pore",
		shortLabel: "P2 · Pore",
		label: "Programme 2 – Pore continuum accessibility (polycationic peptides)",
		hypothesis: "Polycationic peptides are electrostatically attracted toward an acidic pore constriction; L3-int alters the pH-dependent electrostatic landscape (exclusion / competition).",
		note: "“Block / repel” language is continuum-electrostatic only; biological pore block requires separate validation.",
		receptors: ["acidicPore"],
		ligandSets: [
			{
				id: "L2",
				label: "KSRRRAR exclusive",
				pb: 0,
				peptide: "ksrrrar",
				peptideCount: 20,
				his5: 0,
				ach: 0
			},
			{
				id: "L2pr",
				label: "PRARR exclusive",
				pb: 0,
				peptide: "prarr",
				peptideCount: 20,
				his5: 0,
				ach: 0
			},
			{
				id: "L3",
				label: "L3-int exclusive",
				pb: 0,
				peptide: "off",
				peptideCount: 0,
				his5: 20,
				ach: 0
			},
			{
				id: "L2L3",
				label: "KSRRRAR + L3-int",
				pb: 0,
				peptide: "ksrrrar",
				peptideCount: 12,
				his5: 12,
				ach: 0
			},
			{
				id: "L1L2L3",
				label: "Pb + KSRRRAR + L3-int",
				pb: 10,
				peptide: "ksrrrar",
				peptideCount: 10,
				his5: 8,
				ach: 0
			}
		],
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: true,
		respawnDefault: true,
		primaryReadouts: [
			"U_pep–pore",
			"U_L3–pore",
			"proximity/respawn events",
			"exclusion vs attraction ranking ± L3-int"
		],
		publicationCandidate: false,
		privateNanotoxicity: true
	},
	prog3_ach: {
		id: "prog3_ach",
		shortLabel: "P3 · α7 competition (private)",
		label: "Programme 3 – Allosteric competition baseline (private)",
		hypothesis: "Heavy metals or polycationic peptides alter continuum electrostatics at an α7 allosteric (or orthosteric) site.",
		note: "Private analyses are excluded from this public package.",
		receptors: ["alpha7Allo", "alpha7Ortho"],
		ligandSets: [{
			id: "L1",
			label: "Pb²⁺ exclusive",
			pb: 20,
			peptide: "off",
			peptideCount: 0,
			his5: 0,
			ach: 0
		}, {
			id: "L1L2",
			label: "Pb²⁺ + KSRRRAR",
			pb: 12,
			peptide: "ksrrrar",
			peptideCount: 12,
			his5: 0,
			ach: 0
		}],
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: false,
		respawnDefault: false,
		primaryReadouts: [
			"U_Pb–ROI",
			"U_pep–ROI",
			"proximity events"
		],
		publicationCandidate: false,
		privateNanotoxicity: true
	},
	prog4_multi_pore: {
		id: "prog4_multi_pore",
		shortLabel: "MULTI · Pore multi-ligand",
		label: "Programme 4 – Multi-ligand pore competition (private)",
		hypothesis: "Multiple cationic ligands compete for continuum electrostatic access to an acidic pore ROI.",
		note: "Private analyses are excluded from this public package.",
		receptors: ["acidicPore"],
		ligandSets: multiLigandSets(),
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: true,
		respawnDefault: true,
		primaryReadouts: [
			"U_pep–pore",
			"U_tot",
			"proximity/respawn events"
		],
		publicationCandidate: false,
		privateNanotoxicity: true
	},
	prog5_peptide3_furin: {
		id: "prog5_peptide3_furin",
		shortLabel: "P5 · Peptide3 furin",
		label: "Programme 5 – KSRRRAR / PRARR / SLLRST exclusive baselines at furin triad",
		hypothesis: "Charge ladder (+5 / +3 / +1) ranks on |U_pep–His| under locked continuum parameters at the furin triad ROI.",
		note: "Exclusive L2 only (no heavy metal). Respawn OFF. SLLRST is a continuum single-Arg educational contrast — not a viral infectivity claim.",
		receptors: ["furin"],
		ligandSets: [
			{
				id: "KS",
				label: "KSRRRAR exclusive",
				pb: 0,
				peptide: "ksrrrar",
				peptideCount: 20,
				his5: 0,
				ach: 0
			},
			{
				id: "PR",
				label: "PRARR exclusive",
				pb: 0,
				peptide: "prarr",
				peptideCount: 20,
				his5: 0,
				ach: 0
			},
			{
				id: "SL",
				label: "SLLRST exclusive",
				pb: 0,
				peptide: "sllrst",
				peptideCount: 20,
				his5: 0,
				ach: 0
			}
		],
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: false,
		respawnDefault: false,
		primaryReadouts: ["U_pep–His (mean ± sd)", "ranking |U| charge ladder"],
		publicationCandidate: true,
		privateNanotoxicity: false
	},
	prog_pub_matrix: {
		id: "prog_pub_matrix",
		shortLabel: "PUB · A–F matrix",
		label: "Public matrix – A–F × Pb + peptides × pH (locked continuum)",
		hypothesis: "Public receptor × public ligand continuum energy matrix under locked Debye–Hückel parameters.",
		note: "Primary public suite. Cu²⁺ Menkes E/F contrast is a separate export.",
		receptors: [
			"furin",
			"acidicPore",
			"alpha7Allo",
			"alpha7Ortho",
			"atp7aWt",
			"atp7aMenkes"
		],
		ligandSets: [
			{
				id: "Pb",
				label: "Pb²⁺ exclusive",
				pb: 20,
				peptide: "off",
				peptideCount: 0,
				his5: 0,
				ach: 0
			},
			{
				id: "KS",
				label: "KSRRRAR exclusive",
				pb: 0,
				peptide: "ksrrrar",
				peptideCount: 20,
				his5: 0,
				ach: 0
			},
			{
				id: "PR",
				label: "PRARR exclusive",
				pb: 0,
				peptide: "prarr",
				peptideCount: 20,
				his5: 0,
				ach: 0
			},
			{
				id: "SL",
				label: "SLLRST exclusive",
				pb: 0,
				peptide: "sllrst",
				peptideCount: 20,
				his5: 0,
				ach: 0
			}
		],
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: false,
		respawnDefault: false,
		primaryReadouts: [
			"U_L–ROI mean±sd",
			"ranking per receptor",
			"E vs F Menkes continuum contrast"
		],
		publicationCandidate: true,
		privateNanotoxicity: false
	},
	prog_pub_combo: {
		id: "prog_pub_combo",
		shortLabel: "COMBO · L1+L2 v1.1",
		label: "Programme PUB_COMBO v1.1 – Public multi-ligand HM + peptide pairs",
		hypothesis: "Simultaneous Pb²⁺/Cu²⁺ and polycationic peptide continuum energies (U_HM–ROI, U_pep–ROI, U_HM–pep) rank competition vs cooperation under locked Debye–Hückel parameters.",
		note: "Public L1+L2 only. Badge: Competitive if U_HM–pep > 0; Cooperative if U_HM–pep < 0 (educational continuum labels). Respawn OFF for energy ranking.",
		receptors: [
			"acidicPore",
			"atp7aWt",
			"atp7aMenkes"
		],
		ligandSets: [
			{
				id: "Pb_KS",
				label: "Pb²⁺ + KSRRRAR",
				pb: 12,
				metal: "pb",
				peptide: "ksrrrar",
				peptideCount: 12,
				his5: 0,
				ach: 0
			},
			{
				id: "Cu_KS",
				label: "Cu²⁺ + KSRRRAR",
				pb: 12,
				metal: "cu",
				peptide: "ksrrrar",
				peptideCount: 12,
				his5: 0,
				ach: 0
			},
			{
				id: "Pb_PR",
				label: "Pb²⁺ + PRARR",
				pb: 12,
				metal: "pb",
				peptide: "prarr",
				peptideCount: 12,
				his5: 0,
				ach: 0
			}
		],
		pHFixed: [
			7.4,
			6.2,
			5
		],
		ramp: false,
		respawnDefault: false,
		primaryReadouts: [
			"U_HM–ROI",
			"U_pep–ROI",
			"U_HM–pep",
			"U_tot",
			"Competitive / Cooperative badge"
		],
		publicationCandidate: true,
		privateNanotoxicity: false
	}
};
/** Public UI order — combo + matrix + Pb + peptide public suites. */
var PUBLIC_PROGRAMME_ORDER = [
	"prog_pub_combo",
	"prog_pub_matrix",
	"prog1_metal",
	"prog5_peptide3_furin"
];
/** Public surface always uses the public programme list. */
function visibleProgrammeOrder(_showPrivate) {
	return PUBLIC_PROGRAMME_ORDER;
}
/** Convenience: public baseline metal mode from a set. */
function setToMetalMode(set) {
	if (set.pb <= 0) return "off";
	const m = set.metal ?? "pb";
	return m === "cu" ? "cu" : m === "off" ? "off" : "pb";
}
function meanSd(xs) {
	if (!xs.length) return {
		mean: 0,
		sd: 0
	};
	const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
	if (xs.length < 2) return {
		mean,
		sd: 0
	};
	const v = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
	return {
		mean,
		sd: Math.sqrt(v)
	};
}
/**
* Didactic pH presets only. Ligand counts / receptor / display toggles are
* controlled independently — applying a scenario never reseeds the scene.
*/
var SCENARIOS = {
	physiological: {
		id: "physiological",
		label: "Physiological",
		blurb: "pH 7.4 only · His194 mostly OFF (θ low). Ligands unchanged.",
		pH: 7.4,
		moleculeCount: 10,
		ligand2Enabled: true,
		ligand2Count: 3,
		ligand2ChargeScale: 1,
		spawnNearL1: 1,
		spawnNearL2: 1
	},
	stress: {
		id: "stress",
		label: "Stress / Acidosis",
		blurb: "pH 6.3 only · near His pKa gate. Ligands unchanged.",
		pH: 6.3,
		moleculeCount: 14,
		ligand2Enabled: true,
		ligand2Count: 7,
		ligand2ChargeScale: 1.15,
		spawnNearL1: 2,
		spawnNearL2: 2
	},
	pathological: {
		id: "pathological",
		label: "Pathological",
		blurb: "pH 5.0 only · His194 strongly ON. Ligands unchanged.",
		pH: 5,
		moleculeCount: 18,
		ligand2Enabled: true,
		ligand2Count: 10,
		ligand2ChargeScale: 1.45,
		spawnNearL1: 3,
		spawnNearL2: 3
	}
};
var SCENARIO_ORDER = [
	"physiological",
	"stress",
	"pathological"
];
var FIELD_SLICE_HALF = .92;
function potentialOnSlice(i, j, res, half, ox, oy, oz, particles, params, proteins) {
	const u = res <= 1 ? 0 : i / (res - 1);
	const v = res <= 1 ? 0 : j / (res - 1);
	const x = ox + (u - .5) * 2 * half;
	const z = oz + (v - .5) * 2 * half;
	const y = oy;
	const f = fieldAt(x, y, z, particles, params, proteins);
	return {
		pot: f.potential,
		x,
		y,
		z,
		ex: f.ex,
		ey: f.ey,
		ez: f.ez
	};
}
/**
* Lightweight marching-squares segments for a few iso-levels.
*/
function extractContours(pot, res, half, ox, oy, oz, levels) {
	const chains = [];
	const cell = 2 * half / Math.max(res - 1, 1);
	const at = (i, j) => pot[j * res + i] ?? 0;
	for (const level of levels) {
		const segs = [];
		for (let j = 0; j < res - 1; j++) for (let i = 0; i < res - 1; i++) {
			const v00 = at(i, j);
			const v10 = at(i + 1, j);
			const v01 = at(i, j + 1);
			const v11 = at(i + 1, j + 1);
			const x0 = ox + (i / (res - 1) - .5) * 2 * half;
			const z0 = oz + (j / (res - 1) - .5) * 2 * half;
			const x1 = x0 + cell;
			const z1 = z0 + cell;
			const corners = [
				[
					x0,
					oy,
					z0
				],
				[
					x1,
					oy,
					z0
				],
				[
					x1,
					oy,
					z1
				],
				[
					x0,
					oy,
					z1
				]
			];
			const vals = [
				v00,
				v10,
				v11,
				v01
			];
			const pts = [];
			for (let e = 0; e < 4; e++) {
				const a = e;
				const b = (e + 1) % 4;
				const va = vals[a];
				const vb = vals[b];
				if ((va - level) * (vb - level) > 0) continue;
				if (Math.abs(vb - va) < 1e-12) continue;
				const t = (level - va) / (vb - va);
				const pa = corners[a];
				const pb = corners[b];
				pts.push([
					pa[0] + (pb[0] - pa[0]) * t,
					oy,
					pa[2] + (pb[2] - pa[2]) * t
				]);
			}
			if (pts.length >= 2) {
				segs.push([pts[0], pts[1]]);
				if (pts.length >= 4) segs.push([pts[2], pts[3]]);
			}
		}
		for (const s of segs) chains.push(s);
	}
	return chains;
}
/** Build sparse slice + force samples centered on His194 ROI. */
function buildFieldSlice(particles, proteins, params, res = 26, half = FIELD_SLICE_HALF) {
	const prot = proteins[0];
	const origin = prot ? (() => {
		const r = roiWorldPos(prot);
		return [
			r.x,
			r.y,
			r.z
		];
	})() : [
		0,
		.1,
		0
	];
	const [ox, oy, oz] = origin;
	const potential = new Float32Array(res * res);
	let maxAbs = 1e-6;
	for (let j = 0; j < res; j++) for (let i = 0; i < res; i++) {
		const s = potentialOnSlice(i, j, res, half, ox, oy, oz, particles, params, proteins);
		potential[j * res + i] = s.pot;
		maxAbs = Math.max(maxAbs, Math.abs(s.pot));
	}
	const contours = extractContours(potential, res, half, ox, oy, oz, [
		-.75,
		-.4,
		-.15,
		.15,
		.4,
		.75
	].map((f) => f * maxAbs));
	const forces = [];
	const g = 5;
	for (let j = 0; j < g; j++) for (let i = 0; i < g; i++) {
		const u = i / 4;
		const v = j / 4;
		const x = ox + (u - .5) * 2 * half * .9;
		const z = oz + (v - .5) * 2 * half * .9;
		const y = oy + .02;
		const f = fieldAt(x, y, z, particles, params, proteins);
		forces.push({
			x,
			y,
			z,
			...f
		});
	}
	return {
		origin,
		half,
		res,
		potential,
		vAbsMax: maxAbs,
		contours,
		forces
	};
}
/** Write potential grid into RGBA canvas buffer (red–white–blue + alpha). */
function writePotentialTexture(data, out, alpha = .55) {
	const { potential, res, vAbsMax } = data;
	const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
	for (let k = 0; k < res * res; k++) {
		const phi = potential[k] ?? 0;
		const t = .5 + .5 * Math.tanh(phi / Math.max(vAbsMax * .65, .15));
		let r;
		let g;
		let b;
		if (t < .5) {
			const u = t / .5;
			r = .94 + .06 * u;
			g = .27 + .73 * u;
			b = .27 + .73 * u;
		} else {
			const u = (t - .5) / .5;
			r = 1 - .85 * u;
			g = 1 - .61 * u;
			b = 1 - .08 * u;
		}
		const i = k % res;
		const j = k / res | 0;
		const nx = i / Math.max(res - 1, 1) * 2 - 1;
		const ny = j / Math.max(res - 1, 1) * 2 - 1;
		const edge = Math.max(Math.abs(nx), Math.abs(ny));
		const edgeFade = edge > .85 ? Math.max(0, 1 - (edge - .85) / .15) : 1;
		const o = k * 4;
		out[o] = Math.round(r * 255);
		out[o + 1] = Math.round(g * 255);
		out[o + 2] = Math.round(b * 255);
		out[o + 3] = Math.round(a * edgeFade);
	}
}
function buildRoiAgentSnapshot(ctx) {
	const { prot, particles, params, roiEnergy } = ctx;
	const geoId = prot.geometryId ?? "generic";
	const meta = RECEPTOR_GEOMETRIES[geoId];
	const roi = roiWorldPos(prot);
	const metals = particles.filter((p) => p.ligandClass === "ligand1");
	const his5s = particles.filter((p) => p.ligandClass === "ligand2");
	const siteEnergies = roiEnergy?.siteEnergies ?? [];
	const sites = (prot.hisSites ?? []).map((site) => {
		const se = siteEnergies.find((s) => s.index === site.index);
		const pos = hisSiteWorldPos(prot, site.index);
		return {
			index: site.index,
			label: site.label,
			role: site.role,
			pKa: site.pKa,
			protonation: site.protonation,
			protonationPct: Math.round(site.protonation * 1e3) / 10,
			charge: site.charge,
			continuousScore: site.continuousScore,
			switchOn: site.switchOn,
			switchDisplayOn: site.switchDisplayOn,
			switchOverride: site.switchOverride,
			localEnergy: site.localEnergy,
			energyPb: se?.energyPb ?? 0,
			energyCo: se?.energyCo ?? 0,
			energyMetal: se?.energyMetal ?? 0,
			energyHis5: se?.energyHis5 ?? 0,
			energyTotal: se?.energyTotal ?? site.localEnergy,
			nearestMetalNm: se?.nearestMetalNm ?? (site.nearestMetal === Infinity ? -1 : sceneToNm(site.nearestMetal)),
			nearestHis5Nm: se?.nearestHis5Nm ?? (site.nearestHis5 === Infinity ? -1 : sceneToNm(site.nearestHis5)),
			nearestLigandKind: se?.nearestLigandKind ?? null,
			nearestLigandLabel: se?.nearestLigandLabel ?? "—",
			nearestLigandNm: se?.nearestLigandNm ?? -1,
			occupancyLabel: se?.occupancyLabel ?? "empty",
			position: {
				x: pos.x,
				y: pos.y,
				z: pos.z
			}
		};
	});
	return {
		schema: "moleculosphere5d.roi_snapshot.v1",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		geometry: {
			id: geoId,
			label: meta.label,
			character: meta.character,
			blurb: meta.blurb
		},
		protein: {
			id: prot.id,
			label: prot.label,
			targetHisIndex: prot.targetHisIndex ?? 0,
			roiOrigin: {
				x: roi.x,
				y: roi.y,
				z: roi.z
			},
			aggregateSwitchOn: prot.switchDisplayOn,
			continuousScore: prot.continuousScore,
			hisProtonation: prot.hisProtonation,
			hisCharge: prot.hisCharge,
			response: prot.response,
			localEnergy: prot.localEnergy
		},
		conditions: {
			pH: params.pH,
			debyeNm: params.debyeNm,
			regime: params.regime,
			metalMode: ctx.metalMode,
			ligandBaseline: ctx.ligandBaseline,
			ligand2Enabled: ctx.ligand2Enabled,
			ligand2Count: ctx.ligand2Count,
			ligand2ChargeScale: ctx.ligand2ChargeScale,
			metalHisPrefEnabled: params.metalHisPrefEnabled,
			metalHisPrefFactor: params.metalHisPrefFactor,
			displayDurationSec: ctx.displayDurationSec,
			timeAcceleration: timeAccelerationFactor(ctx.displayDurationSec),
			stepsPerSecond: targetStepsPerSecond(ctx.displayDurationSec),
			eventWindowFrames: 3,
			frameNs: 100
		},
		ligands: {
			metals: metals.map((p) => ({
				id: p.id,
				kind: p.kind,
				q: p.q,
				x: p.x,
				y: p.y,
				z: p.z
			})),
			his5: his5s.map((p) => ({
				id: p.id,
				kind: p.kind,
				q: p.q,
				x: p.x,
				y: p.y,
				z: p.z
			})),
			counts: {
				metals: metals.length,
				his5: his5s.length,
				total: particles.length
			}
		},
		energies: {
			energyL1His: roiEnergy?.energyL1His ?? 0,
			energyL2His: roiEnergy?.energyL2His ?? 0,
			energyL1L2: roiEnergy?.energyL1L2 ?? 0,
			energyTotal: roiEnergy?.energyTotal ?? prot.localEnergy,
			forceMagL1His: roiEnergy?.forceMagL1His ?? 0,
			forceMagL2His: roiEnergy?.forceMagL2His ?? 0,
			forceMagL1L2: roiEnergy?.forceMagL1L2 ?? 0,
			regime: roiEnergy?.regime ?? "idle",
			sitesOn: roiEnergy?.sitesOn ?? sites.filter((s) => s.switchDisplayOn).length,
			sitesTotal: roiEnergy?.sitesTotal ?? sites.length
		},
		sites,
		notes: [
			"Sparse continuum proxy — classical Debye–Hückel / Yukawa electrostatics only.",
			"Binary ON/OFF is a didactic overlay on continuous Henderson–Hasselbalch protonation.",
			"Structured per-site electrostatic and occupancy data under controlled orthosteric/allosteric geometries and pH regimes can serve as observation traces for AI agents studying pH-gated receptor dynamics.",
			`Conceptual time at export: ${ctx.timeNs} ns.`
		]
	};
}
var SPECIES_MAP_LOCAL = speciesMap();
function makeRng(seed) {
	return makeSeededRng(seed >>> 0);
}
var SimEngine = class {
	pH = 7.4;
	playing = true;
	timeNs = 0;
	moleculeCount = 12;
	metalMode = "pb";
	ligandBaseline = "both";
	peptideVariant = "ksrrrar";
	ligand2Enabled = true;
	ligand2Count = 4;
	ligand2ChargeScale = 1;
	ligand3Enabled = false;
	ligand3Count = 0;
	ligand4Enabled = false;
	ligand4Count = 0;
	respawnOnBinding = false;
	metalHisPrefFactor = METAL_HIS_PREF_DEFAULT;
	metalHisPrefEnabled = false;
	shortRangeWellEnabled = false;
	shortRangeWellDepthKt = 3;
	displayDurationSec = 10;
	receptorGeometry = "furin";
	focusedProteinIndex = 0;
	roiFocused = false;
	focusRequest = 0;
	focusTarget = null;
	params = buildSimParams(7.4);
	debyeOverrideNm = null;
	hisPka = 6.2;
	hisTheta = 0;
	particles = [];
	proteins = initProteinStates(createProteinProxyDefs("furin"), 7.4);
	trajectory = [];
	scrubIndex = null;
	nextId = 1;
	spawnSeed = 20260805;
	rngSeed = 20260805;
	rng = makeRng(20260805);
	fx = /* @__PURE__ */ new Float32Array(64);
	fy = /* @__PURE__ */ new Float32Array(64);
	fz = /* @__PURE__ */ new Float32Array(64);
	roiEnergy = null;
	showField = false;
	showForceArrows = true;
	fieldOpacity = .45;
	fieldSlice = null;
	stepsSinceUi = 0;
	eventLog = [];
	eventRecording = false;
	eventPlayback = false;
	eventScrub = null;
	eventLabel = "";
	eventTargetFrames = 500;
	/** Record buffer cap N (default 500). */
	eventCap = 500;
	/** stop = freeze at N; ring = oldest-drop. */
	eventCapMode = "stop";
	clampCapturing = false;
	clampArmed = false;
	clampAutoTrigger = false;
	isClampEvent = false;
	clampFocusRequest = 0;
	/** Legacy 3D clamp-camera zoom (kept); tape uses tapeZoomLevel. */
	clampZoomLevel = "100";
	clampLastSwitch = null;
	clampStableCount = 0;
	clampPostFrames = 0;
	clampCamLock = null;
	/** Clamp rulers on the event tape [i0, i1] inclusive. null = full run. */
	clampStart = null;
	clampEnd = null;
	clampLoop = false;
	/** Tape time-window zoom (100/75/50/25%). */
	tapeZoomLevel = "100";
	/** Fine pan offset (frames) when tape is zoomed. */
	tapePanOffset = 0;
	_hhEventsAtRecord = 0;
	_proxEventsAtRecord = 0;
	behaviorStats = emptyBehaviorStats();
	pendingApproach = null;
	pendingSwitch = null;
	pendingProximity = null;
	behaviorPrevSwitch = null;
	/** Short-lived HUD chip after a proximity respawn (demo). */
	lastRespawnFlash = null;
	hystHistory = [];
	lastCrossing = null;
	crossings = [];
	lastPhDirection = "unknown";
	lastSwitchOn = null;
	sweepActive = false;
	_hystBandRegion = "band";
	hystBandRegion() {
		return this._hystBandRegion;
	}
	activeScenario = null;
	scenarioBanner = null;
	activeProgramme = null;
	lastProgrammeJson = null;
	lastScientificJson = "";
	lastSnapshotJson = "";
	lastValiditySuite = null;
	validityProgress = null;
	enabledKinds = /* @__PURE__ */ new Set([
		"metal",
		"peptide",
		"generic",
		"pb",
		"his5",
		"ach",
		"peptide"
	]);
	uiListeners = /* @__PURE__ */ new Set();
	stateListeners = /* @__PURE__ */ new Set();
	constructor() {
		setCoordScaleToNm(1);
		this.applyValidityLockedParams(7.4);
		this.bootstrap(this.moleculeCount, this.pH);
	}
	subscribe(fn) {
		this.stateListeners.add(fn);
		return () => this.stateListeners.delete(fn);
	}
	subscribeUi(fn) {
		this.uiListeners.add(fn);
		return () => this.uiListeners.delete(fn);
	}
	emit() {
		for (const fn of this.stateListeners) fn();
	}
	emitUi() {
		for (const fn of this.uiListeners) fn();
	}
	getSpeciesMap() {
		return SPECIES_MAP_LOCAL;
	}
	getSpeciesList() {
		return SPECIES;
	}
	ensureForceBuffers(n) {
		if (this.fx.length < n) {
			const s = Math.max(n * 2, 64);
			this.fx = new Float32Array(s);
			this.fy = new Float32Array(s);
			this.fz = new Float32Array(s);
		}
	}
	applyDebyeToParams() {
		if (this.debyeOverrideNm != null) {
			const nm = this.debyeOverrideNm;
			this.params.debyeNm = nm;
			this.params.debyeLength = nmToScene(nm);
			this.params.forceCutoffNm = 4 * nm;
			this.params.forceCutoffScene = nmToScene(4 * nm);
		} else {
			const d = debyeFromPH(this.pH);
			this.params.debyeNm = d.debyeNm;
			this.params.debyeLength = d.debyeScene;
			this.params.forceCutoffNm = 4 * d.debyeNm;
			this.params.forceCutoffScene = nmToScene(4 * d.debyeNm);
		}
	}
	applyValidityLockedParams(pH) {
		setCoordScaleToNm(VALIDITY_LOCKED.coordScaleToNm);
		this.params = buildSimParams(pH, {
			coulombK: VALIDITY_LOCKED.coulombK,
			debyeNm: VALIDITY_LOCKED.debyeNm,
			debyeLength: VALIDITY_LOCKED.debyeScene,
			forceCutoffNm: VALIDITY_LOCKED.forceCutoffNm,
			forceCutoffScene: VALIDITY_LOCKED.forceCutoffScene,
			frictionScale: 1.35,
			noiseScale: .45,
			metalHisPrefEnabled: false,
			shortRangeWellEnabled: false,
			shortRangeWellDepthKt: 3,
			shortRangeWellSigmaNm: SHORT_RANGE_WELL_SIGMA_NM,
			shortRangeWellCutoffNm: SHORT_RANGE_WELL_CUTOFF_NM
		});
		this.metalHisPrefEnabled = false;
		this.shortRangeWellEnabled = false;
		this.hisPka = VALIDITY_LOCKED.hisPka;
		this.applyDebyeToParams();
	}
	bootstrap(count, pH) {
		this.pH = pH;
		this.params = {
			...this.params,
			...buildSimParams(pH, {
				coulombK: this.params.coulombK,
				debyeNm: this.params.debyeNm,
				debyeLength: this.params.debyeLength,
				forceCutoffNm: this.params.forceCutoffNm,
				forceCutoffScene: this.params.forceCutoffScene,
				frictionScale: this.params.frictionScale,
				metalHisPrefFactor: this.metalHisPrefFactor,
				metalHisPrefEnabled: this.metalHisPrefEnabled,
				shortRangeWellEnabled: this.shortRangeWellEnabled,
				shortRangeWellDepthKt: this.shortRangeWellDepthKt,
				shortRangeWellSigmaNm: SHORT_RANGE_WELL_SIGMA_NM,
				shortRangeWellCutoffNm: SHORT_RANGE_WELL_CUTOFF_NM
			})
		};
		this.applyDebyeToParams();
		this.moleculeCount = Math.min(80, Math.max(0, count));
		let l1 = 0;
		let l2 = 0;
		const hm = resolveHeavyMetal(this.metalMode);
		if (this.ligandBaseline === "ligand1") {
			l1 = hm === "off" ? 0 : this.moleculeCount;
			l2 = 0;
			this.ligand2Enabled = false;
		} else if (this.ligandBaseline === "ligand2") {
			l1 = 0;
			l2 = this.peptideVariant === "off" ? 0 : this.ligand2Count || this.moleculeCount;
			this.ligand2Enabled = this.peptideVariant !== "off";
		} else {
			l1 = hm === "off" ? 0 : this.moleculeCount;
			l2 = this.peptideVariant === "off" ? 0 : this.ligand2Enabled ? this.ligand2Count : 0;
			this.ligand2Enabled = this.peptideVariant !== "off";
		}
		const pepCount = this.ligandBaseline === "ligand1" ? 0 : this.peptideVariant === "off" ? 0 : l2;
		const l3 = this.ligand3Enabled ? this.ligand3Count : 0;
		const l4 = this.ligand4Enabled ? this.ligand4Count : 0;
		this.particles = spawnParticles(l1, pH, this.metalMode, this.spawnSeed, pepCount, this.peptideVariant === "off" ? "off" : this.peptideVariant === "prarr" ? "prarr" : this.peptideVariant === "sllrst" ? "sllrst" : "ksrrrar", l3, l4);
		this.nextId = this.particles.reduce((m, p) => Math.max(m, p.id + 1), 1);
		this.applyLigand2ChargeScale();
		const defs = createProteinProxyDefs(this.receptorGeometry);
		this.proteins = initProteinStates(defs, pH);
		this.syncHisPkaToProteins();
		for (const prot of this.proteins) updateHisSwitchBinary(prot, 0, 0);
		this.timeNs = 0;
		this.trajectory = [this.recordFrame()];
		this.scrubIndex = null;
		this.refreshRoiEnergy();
		this.emit();
	}
	applyLigand2ChargeScale() {
		for (const p of this.particles) {
			if (p.ligandClass !== "ligand2") continue;
			const sp = SPECIES.find((s) => s.id === p.speciesId);
			if (!sp) continue;
			p.q = effectiveCharge(sp, this.pH) * this.ligand2ChargeScale;
		}
	}
	syncHisPkaToProteins() {
		for (const prot of this.proteins) {
			prot.hisPka = this.hisPka;
			for (const s of prot.hisSites) s.pKa = this.hisPka;
			if (prot.titratableHis === false) continue;
			const th = hisProtonationHH(this.hisPka, this.pH);
			prot.hisProtonation = th;
			prot.hisCharge = hisFormalCharge(th);
			for (const s of prot.hisSites) {
				s.protonation = th;
				s.charge = hisFormalCharge(th);
			}
		}
		this.hisTheta = hisProtonationHH(this.hisPka, this.pH);
	}
	applyPH(pH) {
		this.pH = pH;
		this.params = {
			...this.params,
			pH,
			regime: buildSimParams(pH).regime
		};
		this.applyDebyeToParams();
		for (const p of this.particles) {
			const sp = SPECIES.find((s) => s.id === p.speciesId);
			if (!sp) continue;
			let q = effectiveCharge(sp, pH);
			if (p.ligandClass === "ligand2") q *= this.ligand2ChargeScale;
			p.q = q;
		}
		this.syncHisPkaToProteins();
		for (const prot of this.proteins) updateHisSwitchBinary(prot, this.roiEnergy?.energyL1His ?? 0, this.roiEnergy?.energyL2His ?? 0);
		this.refreshRoiEnergy();
	}
	setPH(pH) {
		const prev = this.pH;
		this.applyPH(pH);
		if (pH > prev) this.lastPhDirection = "up";
		else if (pH < prev) this.lastPhDirection = "down";
		this.emit();
		this.emitUi();
	}
	togglePlay() {
		this.playing = !this.playing;
		this.emit();
		this.emitUi();
	}
	setMoleculeCount(n) {
		this.moleculeCount = Math.max(0, Math.min(80, Math.round(n)));
		this.adjustClassCount("ligand1");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setMetalMode(mode) {
		const next = resolveHeavyMetal(mode);
		this.metalMode = next;
		if (next === "off") {
			this.particles = this.particles.filter((p) => p.ligandClass !== "ligand1");
			this.ensureForceBuffers(this.particles.length);
		} else {
			if (this.moleculeCount < 1 && this.ligandBaseline !== "ligand2") this.moleculeCount = 8;
			this.replaceLigand1Metal();
		}
		this.refreshRoiEnergy();
		this.emit();
		this.emitUi();
	}
	setKindEnabled(kind, enabled) {
		if (enabled) this.enabledKinds.add(kind);
		else this.enabledKinds.delete(kind);
		this.emitUi();
	}
	setLigandBaseline(mode) {
		this.ligandBaseline = mode;
		if (mode === "ligand1") {
			this.ligand2Enabled = false;
			if (this.moleculeCount < 1) this.moleculeCount = 8;
		} else if (mode === "ligand2") {
			this.ligand2Enabled = this.peptideVariant !== "off";
			if (this.ligand2Count < 1) this.ligand2Count = Math.max(4, this.moleculeCount || 4);
		} else {
			this.ligand2Enabled = this.peptideVariant !== "off";
			if (this.ligand2Count < 1) this.ligand2Count = 4;
			if (this.moleculeCount < 1) this.moleculeCount = 8;
		}
		this.adjustClassCount("ligand1");
		this.adjustClassCount("ligand2");
		this.refreshRoiEnergy();
		this.emit();
		this.emitUi();
	}
	enforceExclusiveParticles() {
		this.particles = this.particles.filter((p) => {
			if (p.ligandClass === "ligand1") {
				if (this.ligandBaseline === "ligand2") return false;
				if (resolveHeavyMetal(this.metalMode) === "off") return false;
				return this.moleculeCount > 0;
			}
			if (p.ligandClass === "ligand2") {
				if (this.ligandBaseline === "ligand1") return false;
				return this.peptideVariant !== "off" && this.ligand2Count > 0;
			}
			if (p.ligandClass === "ligand3") return this.ligand3Enabled && this.ligand3Count > 0;
			if (p.ligandClass === "ligand4") return this.ligand4Enabled && this.ligand4Count > 0;
			return false;
		});
		if (this.ligandBaseline === "ligand1") this.ligand2Enabled = false;
		else if (this.ligandBaseline === "ligand2") this.ligand2Enabled = this.peptideVariant !== "off";
		this.ensureForceBuffers(this.particles.length);
	}
	/** Target live particle count for one ligand class (hard exclusion → 0). */
	targetCountForClass(cls) {
		if (cls === "ligand1") {
			if (this.ligandBaseline === "ligand2") return 0;
			if (resolveHeavyMetal(this.metalMode) === "off") return 0;
			return Math.max(0, this.moleculeCount);
		}
		if (cls === "ligand2") {
			if (this.ligandBaseline === "ligand1") return 0;
			if (this.peptideVariant === "off") return 0;
			if (!this.ligand2Enabled) return 0;
			return Math.max(0, this.ligand2Count);
		}
		if (cls === "ligand3") return this.ligand3Enabled ? Math.max(0, this.ligand3Count) : 0;
		if (cls === "ligand4") return this.ligand4Enabled ? Math.max(0, this.ligand4Count) : 0;
		return 0;
	}
	speciesForClass(cls) {
		if (cls === "ligand1") return ligand1Species(this.metalMode);
		if (cls === "ligand2") {
			if (this.peptideVariant === "off") return void 0;
			return ligand2Species(this.peptideVariant === "prarr" ? "prarr" : this.peptideVariant === "sllrst" ? "sllrst" : "ksrrrar");
		}
		if (cls === "ligand3") return ligand3Species();
		return ligand4Species();
	}
	qDesignForSpeciesId(id) {
		if (id === "pb-ion" || id === "cu-ion") return 2;
		if (id === "acetylcholine") return 1;
		if (id === "prarr-peptide") return 3;
		if (id === "sllrst-peptide") return 1;
		if (id === "his5-eaf") return 5;
		return 5;
	}
	shellRangeForClass(cls) {
		if (cls === "ligand1") return [.8, 2.6];
		if (cls === "ligand2") return [.7, 2.5];
		if (cls === "ligand3") return [.9, 2.4];
		return [.85, 2.5];
	}
	/** Spawn `n` new particles of one class on the peripheral shell. */
	spawnMoreOfClass(cls, n) {
		if (n <= 0) return;
		const sp = this.speciesForClass(cls);
		if (!sp) return;
		const [r0, r1] = this.shellRangeForClass(cls);
		const rand = makeSeededRng(this.spawnSeed + this.nextId * 997 + n * 13 >>> 0);
		for (let i = 0; i < n; i++) {
			const theta = rand() * Math.PI * 2;
			const phi = Math.acos(2 * rand() - 1);
			const r = r0 + rand() * (r1 - r0);
			let ox = rand() * 2 - 1;
			let oy = rand() * 2 - 1;
			let oz = rand() * 2 - 1;
			const on = Math.sqrt(ox * ox + oy * oy + oz * oz) + 1e-9;
			let q = effectiveCharge(sp, this.pH);
			if (cls === "ligand2") q *= this.ligand2ChargeScale;
			this.particles.push({
				id: this.nextId++,
				speciesId: sp.id,
				kind: sp.kind,
				ligandClass: cls,
				x: Math.sin(phi) * Math.cos(theta) * r,
				y: Math.sin(phi) * Math.sin(theta) * r * .55,
				z: Math.cos(phi) * r,
				ox: ox / on,
				oy: oy / on,
				oz: oz / on,
				q,
				qDesign: this.qDesignForSpeciesId(sp.id)
			});
		}
	}
	/**
	* Surgical count adjust for one class only.
	* Preserves remaining particle positions; adds/removes only the delta.
	* Does not touch receptor, other ligands, camera, or display toggles.
	*/
	adjustClassCount(cls, target) {
		const want = target ?? this.targetCountForClass(cls);
		const existing = this.particles.filter((p) => p.ligandClass === cls);
		if (want <= 0) {
			if (existing.length) this.particles = this.particles.filter((p) => p.ligandClass !== cls);
			this.ensureForceBuffers(this.particles.length);
			return;
		}
		if (existing.length > want) {
			const keep = new Set(existing.slice(0, want).map((p) => p.id));
			this.particles = this.particles.filter((p) => p.ligandClass !== cls || keep.has(p.id));
		} else if (existing.length < want) this.spawnMoreOfClass(cls, want - existing.length);
		this.ensureForceBuffers(this.particles.length);
	}
	/**
	* Replace L1 heavy-metal identity only (same count & positions when possible).
	* Off handled by setMetalMode / targetCountForClass.
	*/
	replaceLigand1Metal() {
		const sp = ligand1Species(this.metalMode);
		if (!sp) {
			this.particles = this.particles.filter((p) => p.ligandClass !== "ligand1");
			this.ensureForceBuffers(this.particles.length);
			return;
		}
		const l1 = this.particles.filter((p) => p.ligandClass === "ligand1");
		const want = this.targetCountForClass("ligand1");
		if (l1.length === 0) {
			this.adjustClassCount("ligand1", want);
			return;
		}
		for (const p of l1) {
			p.speciesId = sp.id;
			p.kind = sp.kind;
			p.qDesign = this.qDesignForSpeciesId(sp.id);
			p.q = effectiveCharge(sp, this.pH);
		}
		if (l1.length !== want) this.adjustClassCount("ligand1", want);
	}
	/**
	* Replace L2 sequence identity only (same count & positions when possible).
	* Off → remove L2; off→on → spawn target count.
	*/
	replaceLigand2Sequence(v) {
		if (v === "off") {
			this.particles = this.particles.filter((p) => p.ligandClass !== "ligand2");
			this.ligand2Enabled = false;
			this.ensureForceBuffers(this.particles.length);
			return;
		}
		this.ligand2Enabled = this.ligandBaseline !== "ligand1" && this.ligand2Count > 0;
		const sp = ligand2Species(v === "prarr" ? "prarr" : v === "sllrst" ? "sllrst" : "ksrrrar");
		if (!sp) return;
		const l2 = this.particles.filter((p) => p.ligandClass === "ligand2");
		const want = this.targetCountForClass("ligand2");
		if (l2.length === 0) {
			this.adjustClassCount("ligand2", want);
			return;
		}
		for (const p of l2) {
			p.speciesId = sp.id;
			p.kind = sp.kind;
			p.qDesign = this.qDesignForSpeciesId(sp.id);
			p.q = effectiveCharge(sp, this.pH) * this.ligand2ChargeScale;
		}
		if (l2.length !== want) this.adjustClassCount("ligand2", want);
	}
	/**
	* Reseed positions of existing particles in `classes` (keep species & count).
	* Used when receptor ROI origin moves.
	*/
	reseedClassPositions(classes) {
		const mask = new Set(classes);
		const rand = makeSeededRng(this.spawnSeed + this.nextId * 31 >>> 0);
		for (const p of this.particles) {
			if (!mask.has(p.ligandClass)) continue;
			const [r0, r1] = this.shellRangeForClass(p.ligandClass);
			const theta = rand() * Math.PI * 2;
			const phi = Math.acos(2 * rand() - 1);
			const r = r0 + rand() * (r1 - r0);
			p.x = Math.sin(phi) * Math.cos(theta) * r;
			p.y = Math.sin(phi) * Math.sin(theta) * r * .55;
			p.z = Math.cos(phi) * r;
		}
		this.refreshRoiEnergy();
	}
	/**
	* Full class reseed (remove + spawn target count). Does not touch receptor,
	* other classes, time, trajectory, or camera.
	*/
	reseedClasses(classes) {
		const mask = new Set(classes);
		this.particles = this.particles.filter((p) => !mask.has(p.ligandClass));
		for (const cls of classes) this.spawnMoreOfClass(cls, this.targetCountForClass(cls));
		this.ensureForceBuffers(this.particles.length);
		this.refreshRoiEnergy();
	}
	setPeptideVariant(v) {
		if (v === this.peptideVariant) {
			this.emitUi();
			return;
		}
		this.peptideVariant = v;
		this.replaceLigand2Sequence(v);
		this.refreshRoiEnergy();
		this.emit();
		this.emitUi();
	}
	setLigand2Enabled(v) {
		this.ligand2Enabled = v;
		if (!v) this.ligand2Count = 0;
		else if (this.ligand2Count < 1) this.ligand2Count = 4;
		this.adjustClassCount("ligand2");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setLigand2Count(n) {
		this.ligand2Count = Math.max(0, Math.min(40, Math.round(n)));
		this.ligand2Enabled = this.ligand2Count > 0 && this.peptideVariant !== "off";
		this.adjustClassCount("ligand2");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setLigand2ChargeScale(n) {
		this.ligand2ChargeScale = Math.max(.5, Math.min(1.5, n));
		this.applyLigand2ChargeScale();
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setLigand3Enabled(v) {
		this.ligand3Enabled = v;
		if (!v) this.ligand3Count = 0;
		else if (this.ligand3Count < 1) this.ligand3Count = 2;
		this.adjustClassCount("ligand3");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setLigand3Count(n) {
		this.ligand3Count = Math.max(0, Math.min(30, Math.round(n)));
		this.ligand3Enabled = this.ligand3Count > 0;
		this.adjustClassCount("ligand3");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setLigand4Enabled(v) {
		this.ligand4Enabled = v;
		if (!v) this.ligand4Count = 0;
		else if (this.ligand4Count < 1) this.ligand4Count = 8;
		this.adjustClassCount("ligand4");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setLigand4Count(n) {
		this.ligand4Count = Math.max(0, Math.min(30, Math.round(n)));
		this.ligand4Enabled = this.ligand4Count > 0;
		this.adjustClassCount("ligand4");
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setRespawnOnBinding(v) {
		this.respawnOnBinding = v;
		this.emitUi();
	}
	setMetalHisPrefFactor(n) {
		this.metalHisPrefFactor = n;
		this.params.metalHisPrefFactor = n;
		this.emitUi();
	}
	setMetalHisPrefEnabled(v) {
		this.metalHisPrefEnabled = v;
		this.params.metalHisPrefEnabled = v;
		this.emitUi();
	}
	setShortRangeWellEnabled(v) {
		this.shortRangeWellEnabled = v;
		this.params.shortRangeWellEnabled = v;
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setShortRangeWellDepthKt(n) {
		this.shortRangeWellDepthKt = n;
		this.params.shortRangeWellDepthKt = n;
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setDisplayDurationSec(sec) {
		this.displayDurationSec = sec;
		this.emitUi();
	}
	setReceptorGeometry(id) {
		const prev = this.receptorGeometry;
		this.receptorGeometry = id;
		const defs = createProteinProxyDefs(id);
		this.proteins = initProteinStates(defs, this.pH);
		this.syncHisPkaToProteins();
		this.focusedProteinIndex = 0;
		if (prev !== id) {
			const active = [];
			if (this.particles.some((p) => p.ligandClass === "ligand1")) active.push("ligand1");
			if (this.particles.some((p) => p.ligandClass === "ligand2")) active.push("ligand2");
			if (this.particles.some((p) => p.ligandClass === "ligand3")) active.push("ligand3");
			if (this.particles.some((p) => p.ligandClass === "ligand4")) active.push("ligand4");
			if (active.length) this.reseedClassPositions(active);
		}
		this.refreshRoiEnergy();
		this.emit();
		this.emitUi();
	}
	setShowField(v) {
		this.showField = v;
		if (v) this.recomputeField();
		this.emitUi();
	}
	setFieldOpacity(a) {
		this.fieldOpacity = Math.max(.05, Math.min(.95, a));
		this.emitUi();
	}
	setShowForceArrows(v) {
		this.showForceArrows = v;
		this.emitUi();
	}
	setDebyeNm(nm) {
		this.debyeOverrideNm = nm;
		this.applyDebyeToParams();
		this.refreshRoiEnergy();
		this.emitUi();
	}
	clearDebyeOverride() {
		this.debyeOverrideNm = null;
		this.applyDebyeToParams();
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setHisPka(pKa) {
		this.hisPka = pKa;
		this.syncHisPkaToProteins();
		this.refreshRoiEnergy();
		this.emitUi();
	}
	setScrubIndex(i) {
		this.scrubIndex = i;
		this.emitUi();
	}
	/**
	* Explicit full scene reset — the only UI path that reseats everything
	* (all ligands, receptor state refresh, trajectory, counters).
	* Display toggles (demo speed, field, sparse) live in the store and are kept.
	*/
	reset() {
		this.spawnSeed = this.rngSeed;
		this.bootstrap(this.moleculeCount, this.pH);
		this.enforceExclusiveParticles();
		this.resetBehaviorCounters();
		this.clearEventLog();
		this.lastRespawnFlash = null;
		this.emit();
		this.emitUi();
	}
	/** Alias for explicit "Reset scene" control. */
	resetScene() {
		this.reset();
	}
	resetBehaviorCounters() {
		this.behaviorStats = emptyBehaviorStats();
		this.pendingApproach = null;
		this.pendingSwitch = null;
		this.pendingProximity = null;
		this.behaviorPrevSwitch = null;
		this.emitUi();
	}
	refreshRoiEnergy() {
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		if (!prot) {
			this.roiEnergy = null;
			return;
		}
		this.roiEnergy = computeRoiEnergy(prot, this.particles, this.params);
	}
	meanCharge() {
		if (!this.particles.length) return 0;
		return this.particles.reduce((s, p) => s + p.q, 0) / this.particles.length;
	}
	meanProteinResponse() {
		if (!this.proteins.length) return 0;
		return this.proteins.reduce((s, p) => s + p.response, 0) / this.proteins.length;
	}
	recordFrame() {
		const positions = new Float32Array(this.particles.length * 3);
		const charges = new Float32Array(this.particles.length);
		const orientations = new Float32Array(this.particles.length * 3);
		for (let i = 0; i < this.particles.length; i++) {
			const p = this.particles[i];
			positions[i * 3] = p.x;
			positions[i * 3 + 1] = p.y;
			positions[i * 3 + 2] = p.z;
			charges[i] = p.q;
			orientations[i * 3] = p.ox;
			orientations[i * 3 + 1] = p.oy;
			orientations[i * 3 + 2] = p.oz;
		}
		return {
			tNs: this.timeNs,
			positions,
			charges,
			orientations
		};
	}
	primaryEnergy(re) {
		if (this.ligandBaseline === "ligand1") return re.energyL1His;
		if (this.ligandBaseline === "ligand2") return re.energyL2His;
		const cands = [
			re.energyL1His,
			re.energyL2His,
			re.energyL3His,
			re.energyL4His
		];
		let best = cands[0];
		for (const u of cands) if (Math.abs(u) > Math.abs(best)) best = u;
		return best;
	}
	captureEventFrame(flags) {
		const re = this.roiEnergy;
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		const particles = this.particles.map((p) => ({
			id: p.id,
			speciesId: p.speciesId,
			ligandClass: p.ligandClass,
			kind: p.kind,
			x: p.x,
			y: p.y,
			z: p.z,
			ox: p.ox,
			oy: p.oy,
			oz: p.oz,
			q: p.q
		}));
		const eL1 = re?.energyL1His ?? 0;
		const eL2 = re?.energyL2His ?? 0;
		const eL3 = re?.energyL3His ?? 0;
		const eL4 = re?.energyL4His ?? 0;
		const eTot = re?.energyTotal ?? 0;
		const uPrimary = this.primaryEnergy({
			energyL1His: eL1,
			energyL2His: eL2,
			energyL3His: eL3,
			energyL4His: eL4
		});
		const n1 = re?.nearestL1Nm ?? -1;
		const n2 = re?.nearestL2Nm ?? -1;
		const finite = [
			n1,
			n2,
			re?.nearestL3Nm ?? -1,
			re?.nearestL4Nm ?? -1
		].filter((d) => d > 0 && Number.isFinite(d));
		const minDist = flags?.minDistNm != null && Number.isFinite(flags.minDistNm) ? flags.minDistNm : finite.length ? Math.min(...finite) : -1;
		const theta = prot?.hisProtonation ?? this.hisTheta;
		const qHis = prot?.hisCharge ?? 0;
		return {
			tNs: this.timeNs,
			frameIndex: this.eventLog.length,
			particles,
			hisProtonation: theta,
			hisCharge: qHis,
			switchOn: prot?.switchOn ?? false,
			switchDisplayOn: prot?.switchDisplayOn ?? false,
			continuousScore: prot?.continuousScore ?? 0,
			energyL1His: eL1,
			energyL2His: eL2,
			energyL1L2: re?.energyL1L2 ?? 0,
			energyTotal: eTot,
			energyL3His: eL3,
			energyL4His: eL4,
			nearestL1Nm: n1,
			nearestL2Nm: n2,
			pH: this.pH,
			ligandBaseline: this.ligandBaseline,
			minDistNm: minDist,
			U_primary: uPrimary,
			U_tot: eTot,
			theta,
			q_His: qHis,
			proxFlag: flags?.proxFlag ?? 0,
			hhFlag: flags?.hhFlag ?? 0
		};
	}
	get activeEventFrame() {
		if (this.eventScrub == null || !this.eventLog.length) return null;
		const i = Math.max(0, Math.min(this.eventLog.length - 1, this.eventScrub));
		return this.eventLog[i] ?? null;
	}
	get clampWindow() {
		if (!this.eventLog.length) return null;
		const i0 = this.clampStart ?? 0;
		const i1 = this.clampEnd ?? this.eventLog.length - 1;
		const a = Math.max(0, Math.min(i0, i1));
		const b = Math.min(this.eventLog.length - 1, Math.max(i0, i1));
		return {
			i0: a,
			i1: b,
			length: b - a + 1
		};
	}
	/** Visible tape frame range for current zoom + pan. */
	getTapeViewport() {
		const n = this.eventLog.length;
		if (n <= 1) return {
			start: 0,
			end: Math.max(0, n - 1)
		};
		const frac = this.tapeZoomLevel === "100" ? 1 : this.tapeZoomLevel === "75" ? .75 : this.tapeZoomLevel === "50" ? .5 : .25;
		if (frac >= 1) return {
			start: 0,
			end: n - 1
		};
		const win = Math.max(1, Math.round((n - 1) * frac));
		const clamp = this.clampWindow;
		let start = (clamp && this.clampStart != null && this.clampEnd != null ? Math.round((clamp.i0 + clamp.i1) / 2) : this.eventScrub ?? Math.floor((n - 1) / 2)) - Math.floor(win / 2) + this.tapePanOffset;
		start = Math.max(0, Math.min(n - 1 - win, start));
		return {
			start,
			end: start + win
		};
	}
	startRecordEvent() {
		this.eventLog = [];
		this.eventRecording = true;
		this.eventPlayback = false;
		this.eventScrub = null;
		this.eventLabel = `event_${Date.now()}`;
		this.eventTargetFrames = this.eventCap;
		this.clampStart = null;
		this.clampEnd = null;
		this.clampLoop = false;
		this.tapePanOffset = 0;
		this._hhEventsAtRecord = this.behaviorStats.hhBinaryEvents;
		this._proxEventsAtRecord = this.behaviorStats.proximityEvents;
		this.playing = true;
		this.emitUi();
	}
	stopRecordEvent() {
		this.eventRecording = false;
		this.clampCapturing = false;
		if (this.eventLog.length) this.eventScrub = this.eventLog.length - 1;
		this.emitUi();
	}
	clearEventLog() {
		this.eventLog = [];
		this.eventRecording = false;
		this.eventPlayback = false;
		this.eventScrub = null;
		this.isClampEvent = false;
		this.clampCapturing = false;
		this.clampStart = null;
		this.clampEnd = null;
		this.clampLoop = false;
		this.tapePanOffset = 0;
		this.emitUi();
	}
	setEventScrub(i) {
		if (i == null || !this.eventLog.length) this.eventScrub = null;
		else this.eventScrub = Math.max(0, Math.min(this.eventLog.length - 1, Math.round(i)));
		this.scrubIndex = null;
		this.eventPlayback = false;
		this.emitUi();
	}
	toggleEventPlayback() {
		if (!this.eventLog.length) return;
		this.eventPlayback = !this.eventPlayback;
		if (this.eventPlayback) {
			this.playing = false;
			this.eventRecording = false;
			const win = this.clampWindow;
			const i0 = win?.i0 ?? 0;
			const i1 = win?.i1 ?? this.eventLog.length - 1;
			if (this.eventScrub == null || this.eventScrub >= i1) this.eventScrub = i0;
		}
		this.emitUi();
	}
	/**
	* Set event window (clamp rulers) on the existing tape.
	* Does not wipe the buffer. Optional seed around playhead.
	*/
	setClampWindow(i0, i1) {
		if (!this.eventLog.length) return;
		const n = this.eventLog.length;
		if (i0 == null || i1 == null) {
			const mid = this.eventScrub ?? Math.floor((n - 1) / 2);
			const half = Math.min(40, Math.floor(n / 4) || 1);
			this.clampStart = Math.max(0, mid - half);
			this.clampEnd = Math.min(n - 1, mid + half);
		} else {
			const a = Math.max(0, Math.min(n - 1, Math.round(Math.min(i0, i1))));
			const b = Math.max(0, Math.min(n - 1, Math.round(Math.max(i0, i1))));
			this.clampStart = a;
			this.clampEnd = b;
		}
		this.isClampEvent = true;
		this.clampCapturing = false;
		this.emitUi();
	}
	setClampStart(i) {
		if (!this.eventLog.length) return;
		const n = this.eventLog.length;
		const v = Math.max(0, Math.min(n - 1, Math.round(i)));
		this.clampStart = v;
		if (this.clampEnd == null || this.clampEnd < v) this.clampEnd = v;
		this.isClampEvent = true;
		this.emitUi();
	}
	setClampEnd(i) {
		if (!this.eventLog.length) return;
		const n = this.eventLog.length;
		const v = Math.max(0, Math.min(n - 1, Math.round(i)));
		this.clampEnd = v;
		if (this.clampStart == null || this.clampStart > v) this.clampStart = v;
		this.isClampEvent = true;
		this.emitUi();
	}
	clearClamp() {
		this.clampStart = null;
		this.clampEnd = null;
		this.clampLoop = false;
		this.isClampEvent = false;
		this.clampCapturing = false;
		this.tapePanOffset = 0;
		this.tapeZoomLevel = "100";
		this.emitUi();
	}
	setClampLoop(v) {
		this.clampLoop = v;
		this.emitUi();
	}
	fitClampToTape() {
		if (this.clampStart == null || this.clampEnd == null || !this.eventLog.length) return;
		const len = Math.abs(this.clampEnd - this.clampStart) + 1;
		const n = this.eventLog.length;
		const frac = len / Math.max(1, n);
		if (frac > .75) this.tapeZoomLevel = "100";
		else if (frac > .5) this.tapeZoomLevel = "75";
		else if (frac > .25) this.tapeZoomLevel = "50";
		else this.tapeZoomLevel = "25";
		this.tapePanOffset = 0;
		const mid = Math.round((this.clampStart + this.clampEnd) / 2);
		const vp = this.getTapeViewport();
		const vpMid = Math.round((vp.start + vp.end) / 2);
		this.tapePanOffset = mid - vpMid;
		this.getTapeViewport();
		this.emitUi();
	}
	setTapeZoomLevel(level) {
		this.tapeZoomLevel = level;
		if (level === "100") this.tapePanOffset = 0;
		this.clampZoomLevel = level;
		this.emitUi();
	}
	setTapePanOffset(delta) {
		this.tapePanOffset = Math.round(delta);
		this.emitUi();
	}
	panTapeBy(frames) {
		this.tapePanOffset += Math.round(frames);
		this.emitUi();
	}
	exportClampCsv() {
		const win = this.clampWindow;
		if (!win || !this.eventLog.length) return "frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag\n";
		const lines = ["frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag"];
		for (let i = win.i0; i <= win.i1; i++) {
			const f = this.eventLog[i];
			lines.push([
				f.frameIndex,
				f.tNs,
				f.minDistNm.toFixed(6),
				f.U_primary.toFixed(6),
				f.U_tot.toFixed(6),
				f.theta.toFixed(6),
				f.q_His.toFixed(6),
				f.proxFlag,
				f.hhFlag
			].join(","));
		}
		return lines.join("\n") + "\n";
	}
	exportClampJson() {
		const win = this.clampWindow;
		const frames = win && this.eventLog.length ? this.eventLog.slice(win.i0, win.i1 + 1) : [];
		return JSON.stringify({
			schema: "moleculosphere5d.event_clamp.v1",
			disclaimer: PUBLICATION_DISCLAIMER,
			label: this.eventLabel,
			clamp: win,
			frameCount: frames.length,
			frames: frames.map((f) => ({
				frameIndex: f.frameIndex,
				tNs: f.tNs,
				minDistNm: f.minDistNm,
				U_primary: f.U_primary,
				U_tot: f.U_tot,
				theta: f.theta,
				q_His: f.q_His,
				proxFlag: f.proxFlag,
				hhFlag: f.hhFlag,
				energyL1His: f.energyL1His,
				energyL2His: f.energyL2His,
				energyTotal: f.energyTotal,
				particleCount: f.particles.length
			}))
		}, null, 2);
	}
	exportEventLogCsv() {
		if (!this.eventLog.length) return "frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag\n";
		const lines = ["frameIndex,tNs,minDistNm,U_primary,U_tot,theta,q_His,proxFlag,hhFlag"];
		for (const f of this.eventLog) lines.push([
			f.frameIndex,
			f.tNs,
			f.minDistNm.toFixed(6),
			f.U_primary.toFixed(6),
			f.U_tot.toFixed(6),
			f.theta.toFixed(6),
			f.q_His.toFixed(6),
			f.proxFlag,
			f.hhFlag
		].join(","));
		return lines.join("\n") + "\n";
	}
	/** Legacy entry: set clamp rulers on buffer (or start record if empty). */
	startClampCapture(opts) {
		if (!this.eventLog.length) {
			this.startRecordEvent();
			this.eventLabel = `clamp_${Date.now()}`;
			this.clampCapturing = true;
			this.isClampEvent = true;
		} else this.setClampWindow();
		this.emitUi();
	}
	setClampAutoTrigger(v) {
		this.clampAutoTrigger = v;
		this.emitUi();
	}
	setClampZoomLevel(level) {
		this.setTapeZoomLevel(level);
	}
	getClampViewCenter() {
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		if (!prot) return null;
		return roiWorldPos(prot);
	}
	placeNearRoi(cls, index) {
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		if (!prot) return;
		const roi = roiWorldPos(prot);
		const list = this.particles.filter((p) => p.ligandClass === cls);
		const p = list[index] ?? list[0];
		if (!p) return;
		const ang = this.rng() * Math.PI * 2;
		const r = .55 + this.rng() * .35;
		p.x = roi.x + Math.cos(ang) * r;
		p.y = roi.y + (this.rng() - .5) * .2;
		p.z = roi.z + Math.sin(ang) * r;
		this.refreshRoiEnergy();
	}
	spawnNearRoi(cls) {
		this.placeNearRoi(cls, 0);
		if (!this.particles.some((p) => p.ligandClass === cls)) {
			if (cls === "ligand1") {
				this.moleculeCount = Math.max(1, this.moleculeCount);
				if (this.ligandBaseline === "ligand2") this.ligandBaseline = "both";
			} else if (cls === "ligand2") {
				this.ligand2Count = Math.max(1, this.ligand2Count);
				this.ligand2Enabled = true;
				if (this.peptideVariant === "off") this.peptideVariant = "ksrrrar";
				if (this.ligandBaseline === "ligand1") this.ligandBaseline = "both";
			} else if (cls === "ligand3") {
				this.ligand3Enabled = true;
				this.ligand3Count = Math.max(1, this.ligand3Count);
			} else if (cls === "ligand4") {
				this.ligand4Enabled = true;
				this.ligand4Count = Math.max(1, this.ligand4Count);
			}
			this.adjustClassCount(cls);
			this.placeNearRoi(cls, 0);
		}
		this.emit();
		this.emitUi();
	}
	spawnNearRoiPublic(cls) {
		this.spawnNearRoi(cls);
	}
	focusHisRoi(index = 0) {
		this.focusedProteinIndex = index;
		const prot = this.proteins[index] ?? this.proteins[0];
		if (prot) {
			const roi = roiWorldPos(prot);
			this.focusTarget = roi;
			this.roiFocused = true;
			this.focusRequest++;
		}
		this.refreshRoiEnergy();
		this.emitUi();
	}
	toggleHisSwitch(index = 0) {
		const prot = this.proteins[index] ?? this.proteins[0];
		if (!prot) return;
		prot.switchOverride = prot.switchOverride == null ? !prot.switchDisplayOn : null;
		updateHisSwitchBinary(prot, this.roiEnergy?.energyL1His ?? 0, this.roiEnergy?.energyL2His ?? 0);
		this.refreshRoiEnergy();
		this.emitUi();
	}
	toggleHisSwitchOverride(index = 0) {
		this.toggleHisSwitch(index);
	}
	toggleHisSite(proteinIndex, _siteIndex) {
		this.toggleHisSwitch(proteinIndex);
	}
	clearHisSwitchOverride() {
		for (const p of this.proteins) p.switchOverride = null;
		this.refreshRoiEnergy();
		this.emitUi();
	}
	startHysteresisSweep() {
		this.sweepActive = true;
		this.hystHistory = [];
		this.emitUi();
	}
	stopHysteresisSweep() {
		this.sweepActive = false;
		this.emitUi();
	}
	clearHysteresisHistory() {
		this.hystHistory = [];
		this.crossings = [];
		this.lastCrossing = null;
		this.emitUi();
	}
	applyScenario(id) {
		const sc = SCENARIOS[id];
		if (!sc) return;
		this.activeScenario = id;
		this.applyPH(sc.pH);
		const re = this.roiEnergy;
		this.scenarioBanner = {
			id,
			label: sc.label,
			switchOn: this.proteins[0]?.switchDisplayOn ?? false,
			regime: re && re.energyL1L2 > .05 ? "competitive" : re && re.energyL1L2 < -.05 ? "cooperative" : "idle",
			energyL1L2: re?.energyL1L2 ?? 0,
			pH: sc.pH,
			ticksLeft: 180
		};
		this.emit();
		this.emitUi();
	}
	applyLigandSetSpec(set) {
		this.moleculeCount = set.pb;
		this.metalMode = setToMetalMode(set);
		this.peptideVariant = set.peptide;
		this.ligand2Count = set.peptideCount;
		this.ligand2Enabled = set.peptide !== "off" && set.peptideCount > 0;
		this.ligand3Count = 0;
		this.ligand3Enabled = false;
		this.ligand4Count = 0;
		this.ligand4Enabled = false;
		if (set.pb > 0 && set.peptide !== "off") this.ligandBaseline = "both";
		else if (set.pb > 0) this.ligandBaseline = "ligand1";
		else this.ligandBaseline = "ligand2";
		this.reseedClasses([
			"ligand1",
			"ligand2",
			"ligand3",
			"ligand4"
		]);
	}
	applyProgrammeSetup(programmeId, ligandSetId, receptorId, pH = 7.4) {
		const prog = PROGRAMMES[programmeId];
		if (!prog) return;
		const set = prog.ligandSets.find((s) => s.id === ligandSetId) ?? prog.ligandSets[0];
		const rec = receptorId ?? prog.receptors[0];
		this.activeProgramme = programmeId;
		this.setReceptorGeometry(rec);
		this.applyLigandSetSpec(set);
		this.setRespawnOnBinding(prog.respawnDefault);
		this.applyPH(pH);
		this.applyValidityLockedParams(this.pH);
		this.resetBehaviorCounters();
		this.playing = true;
		this.emit();
		this.emitUi();
	}
	/**
	* Run publication programme matrix.
	* Public Beta v1.0 exports write only public ligand columns:
	* U_HM–ROI, U_pep–ROI, U_tot — never private L3/L4 channels.
	*/
	runProgrammeSuite(programmeId, opts) {
		const prog = PROGRAMMES[programmeId];
		const frames = opts?.frames ?? 600;
		const nRep = opts?.replicates ?? 10;
		const baseSeed = opts?.seed ?? 20260805;
		const includeRamp = opts?.includeRamp ?? prog.ramp;
		const rows = [];
		this.applyValidityLockedParams(this.pH);
		for (const rec of prog.receptors) for (const set of prog.ligandSets) {
			for (const pH of prog.pHFixed) {
				const prox = [];
				const uPb = [];
				const uPep = [];
				const uLl = [];
				const uTot = [];
				const dTrig = [];
				for (let r = 0; r < nRep; r++) {
					this.rngSeed = baseSeed + r * 997 + rec.length * 13 + set.id.charCodeAt(0);
					this.rng = makeRng(this.rngSeed);
					this.spawnSeed = this.rngSeed;
					this.setReceptorGeometry(rec);
					this.applyLigandSetSpec(set);
					this.setRespawnOnBinding(prog.respawnDefault);
					this.applyValidityLockedParams(this.pH);
					this.applyPH(pH);
					this.resetBehaviorCounters();
					this.playing = true;
					this.scrubIndex = null;
					this.eventScrub = null;
					let sumUPb = 0, sumUPep = 0, sumULl = 0, sumUTot = 0, nU = 0;
					for (let f = 0; f < frames; f++) {
						this.step();
						this.refreshRoiEnergy();
						const re = this.roiEnergy;
						if (re) {
							const e1 = Number(re.energyL1His) || 0;
							const e2 = Number(re.energyL2His) || 0;
							const e12 = Number(re.energyL1L2) || 0;
							sumUPb += e1;
							sumUPep += e2;
							sumULl += e12;
							sumUTot += e1 + e2 + e12;
							nU += 1;
						}
					}
					prox.push(this.behaviorStats.proximityEvents);
					const inv = nU || 1;
					uPb.push(sumUPb / inv);
					uPep.push(sumUPep / inv);
					uLl.push(sumULl / inv);
					uTot.push(sumUTot / inv);
					const td = this.behaviorStats.triggerDistancesNm;
					if (td.length) dTrig.push(td.reduce((a, b) => a + b, 0) / td.length);
				}
				rows.push({
					programme: programmeId,
					receptor: rec,
					ligandSet: set.id,
					ligandLabel: set.label,
					protocol: "fixed-pH",
					pH,
					frames,
					n: nRep,
					proximityEvents: meanSd(prox),
					meanTriggerDistNm: meanSd(dTrig),
					U_Pb_ROI: meanSd(uPb),
					U_pep_ROI: meanSd(uPep),
					U_HM_pep: meanSd(uLl),
					U_tot: meanSd(uTot)
				});
			}
			if (includeRamp) {
				const prox = [];
				const uPb = [];
				const uPep = [];
				const uLl = [];
				const uTot = [];
				for (let r = 0; r < nRep; r++) {
					this.rngSeed = baseSeed + r * 997 + 5e3;
					this.rng = makeRng(this.rngSeed);
					this.spawnSeed = this.rngSeed;
					this.setReceptorGeometry(rec);
					this.applyLigandSetSpec(set);
					this.setRespawnOnBinding(prog.respawnDefault);
					this.applyValidityLockedParams(this.pH);
					this.applyPH(7.4);
					this.resetBehaviorCounters();
					this.playing = true;
					const rampFrames = Math.min(400, frames);
					let sumUPb = 0, sumUPep = 0, sumULl = 0, sumUTot = 0, nU = 0;
					for (let f = 0; f < rampFrames; f++) {
						const t = f / Math.max(1, rampFrames - 1);
						this.applyPH(7.4 + (5 - 7.4) * t);
						this.step();
						this.refreshRoiEnergy();
						const re = this.roiEnergy;
						if (re) {
							const e1 = Number(re.energyL1His) || 0;
							const e2 = Number(re.energyL2His) || 0;
							const e12 = Number(re.energyL1L2) || 0;
							sumUPb += e1;
							sumUPep += e2;
							sumULl += e12;
							sumUTot += e1 + e2 + e12;
							nU += 1;
						}
					}
					const inv = nU || 1;
					prox.push(this.behaviorStats.proximityEvents);
					uPb.push(sumUPb / inv);
					uPep.push(sumUPep / inv);
					uLl.push(sumULl / inv);
					uTot.push(sumUTot / inv);
				}
				rows.push({
					programme: programmeId,
					receptor: rec,
					ligandSet: set.id,
					ligandLabel: set.label,
					protocol: "pH-ramp",
					pH: "7.4→5.0",
					frames: Math.min(400, frames),
					n: nRep,
					proximityEvents: meanSd(prox),
					meanTriggerDistNm: meanSd([]),
					U_Pb_ROI: meanSd(uPb),
					U_pep_ROI: meanSd(uPep),
					U_HM_pep: meanSd(uLl),
					U_tot: meanSd(uTot)
				});
			}
		}
		const payload = {
			disclaimer: PUBLICATION_DISCLAIMER,
			publicNote: "Private analyses are excluded from this public package.",
			programme: {
				id: prog.id,
				label: prog.label,
				hypothesis: prog.hypothesis,
				note: prog.note ?? null
			},
			results: rows,
			exportedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const json = JSON.stringify(payload, null, 2);
		this.lastProgrammeJson = json;
		const num = (v, field) => {
			const x = v?.[field];
			return Number.isFinite(x) ? x.toFixed(4) : "0.0000";
		};
		const numP = (v, field) => {
			const x = v?.[field];
			return Number.isFinite(x) ? x.toFixed(3) : "0.000";
		};
		const csvLines = [
			`# ${PUBLICATION_DISCLAIMER}`,
			`# Private analyses are excluded from this public package.`,
			[
				"programme",
				"receptor",
				"ligandSet",
				"ligandLabel",
				"protocol",
				"pH",
				"frames",
				"n",
				"proximity_mean",
				"proximity_sd",
				"U_HM_ROI_mean",
				"U_HM_ROI_sd",
				"U_pep_ROI_mean",
				"U_pep_ROI_sd",
				"U_HM_pep_mean",
				"U_HM_pep_sd",
				"U_tot_mean",
				"U_tot_sd"
			].join(",")
		];
		for (const row of rows) {
			const pe = row.proximityEvents;
			const up = row.U_Pb_ROI;
			const ue = row.U_pep_ROI;
			const ul = row.U_HM_pep;
			const ut = row.U_tot;
			csvLines.push([
				row.programme,
				row.receptor,
				row.ligandSet,
				JSON.stringify(String(row.ligandLabel ?? "")),
				row.protocol,
				row.pH,
				row.frames ?? "",
				row.n ?? "",
				numP(pe, "mean"),
				numP(pe, "sd"),
				num(up, "mean"),
				num(up, "sd"),
				num(ue, "mean"),
				num(ue, "sd"),
				num(ul, "mean"),
				num(ul, "sd"),
				num(ut, "mean"),
				num(ut, "sd")
			].join(","));
		}
		const csv = csvLines.join("\n");
		const summary = `${prog.shortLabel}: ${rows.length} cells · n=${nRep} · frames=${frames} · public columns only`;
		this.emitUi();
		return {
			json,
			csv,
			summary
		};
	}
	getLigandModeStatus() {
		const hm = resolveHeavyMetal(this.metalMode);
		return `${this.ligandBaseline === "ligand2" || hm === "off" || this.moleculeCount <= 0 ? `${hm === "off" ? "HM" : heavyMetalLabel(this.metalMode)} absent` : `${heavyMetalLabel(this.metalMode)} ×${this.moleculeCount}`} · ${this.ligandBaseline === "ligand1" || this.peptideVariant === "off" || this.ligand2Count <= 0 ? "peptide absent" : `L2 ${this.peptideVariant === "prarr" ? "PRARR" : this.peptideVariant === "sllrst" ? "SLLRST" : "KSRRRAR"} ×${this.ligand2Count}${this.ligandBaseline === "ligand2" ? " exclusive" : ""}`}`;
	}
	runValiditySuite(opts) {
		const nRep = Math.min(VALIDITY_LOCKED.replicates, 5);
		const runFrames = Math.min(VALIDITY_LOCKED.runFrames, 300);
		const replicates = [];
		for (const base of VALIDITY_BASELINES) for (const protocol of VALIDITY_FIXED_PH) {
			const pH = protocol.kind === "fixed-pH" ? protocol.pH : 7.4;
			for (let r = 0; r < nRep; r++) {
				const seed = VALIDITY_LOCKED.baseSeed + r * 997 + (base.id === "Baseline_PRARR_50" ? 1e4 : base.id === "Baseline_SLLRST_50" ? 2e4 : 0);
				this.rngSeed = seed;
				this.rng = makeRng(seed);
				this.spawnSeed = seed;
				this.setReceptorGeometry("furin");
				this.ligandBaseline = "ligand2";
				this.peptideVariant = base.id.includes("SLLRST") ? "sllrst" : base.id.includes("PRARR") ? "prarr" : "ksrrrar";
				this.ligand2Count = VALIDITY_LOCKED.nMolecules;
				this.ligand2Enabled = true;
				this.moleculeCount = 0;
				this.ligand3Enabled = false;
				this.ligand3Count = 0;
				this.ligand4Enabled = false;
				this.ligand4Count = 0;
				this.bootstrap(0, pH);
				this.enforceExclusiveParticles();
				this.applyValidityLockedParams(pH);
				this.applyPH(pH);
				this.resetBehaviorCounters();
				this.playing = true;
				let sumU = 0, sumTot = 0, nU = 0;
				for (let f = 0; f < runFrames; f++) {
					this.step();
					this.refreshRoiEnergy();
					const re = this.roiEnergy;
					if (re) {
						sumU += re.energyL2His;
						sumTot += re.energyTotal;
						nU++;
					}
				}
				const inv = nU || 1;
				replicates.push({
					replicate: r,
					seed,
					baselineId: base.id,
					protocol,
					proximityEvents: this.behaviorStats.proximityEvents,
					meanProximityDistNm: this.behaviorStats.triggerDistancesNm.length ? this.behaviorStats.triggerDistancesNm.reduce((a, b) => a + b, 0) / this.behaviorStats.triggerDistancesNm.length : null,
					hhBinaryEvents: this.behaviorStats.hhBinaryEvents,
					meanHhDistNm: this.behaviorStats.hhTriggerDistancesNm.length ? this.behaviorStats.hhTriggerDistancesNm.reduce((a, b) => a + b, 0) / this.behaviorStats.hhTriggerDistancesNm.length : null,
					meanUPepHis: sumU / inv,
					meanUTot: sumTot / inv,
					finalTheta: this.hisTheta,
					finalQHis: this.proteins[0]?.hisCharge ?? 0,
					finalPH: pH
				});
			}
		}
		const aggList = [];
		for (const base of VALIDITY_BASELINES) for (const protocol of VALIDITY_FIXED_PH) {
			const subset = replicates.filter((r) => r.baselineId === base.id && r.protocol === protocol);
			if (!subset.length) continue;
			aggList.push(aggregateReplicates(base.id, protocol, subset));
		}
		const suite = {
			schema: "moleculosphere5d.validity.v1",
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			locked: { ...VALIDITY_LOCKED },
			receptor: {
				label: "Furin catalytic triad",
				triad: "Asp153–His194–Ser368",
				roi: "His194"
			},
			expectation: "KSRRRAR (+5) > PRARR (+3) > SLLRST (+1) on |U_pep–His|",
			ranking: [],
			aggregates: aggList
		};
		this.lastValiditySuite = suite;
		this.lastScientificJson = JSON.stringify(suite, null, 2);
		this.emitUi();
		return suite;
	}
	/**
	* Exclusive 3-peptide furin contrast (KSRRRAR / PRARR / SLLRST).
	* Locked Yukawa params; respawn OFF; energy ranking primary.
	*/
	runPeptide3FurinBaselines(opts) {
		const nMol = opts?.nMolecules ?? 20;
		const frames = opts?.frames ?? 200;
		const nRep = opts?.replicates ?? 5;
		const variants = [
			{
				id: "Baseline_KSRRRAR_50",
				variant: "ksrrrar",
				label: "KSRRRAR",
				q: 5
			},
			{
				id: "Baseline_PRARR_50",
				variant: "prarr",
				label: "PRARR",
				q: 3
			},
			{
				id: "Baseline_SLLRST_50",
				variant: "sllrst",
				label: "SLLRST",
				q: 1
			}
		];
		const rows = [];
		const savedRespawn = this.respawnOnBinding;
		this.setRespawnOnBinding(false);
		for (const v of variants) for (const protocol of VALIDITY_FIXED_PH) {
			const pH = protocol.kind === "fixed-pH" ? protocol.pH : 7.4;
			const uSamples = [];
			const totSamples = [];
			const proxSamples = [];
			const thetaSamples = [];
			const qSamples = [];
			for (let r = 0; r < nRep; r++) {
				const seed = VALIDITY_LOCKED.baseSeed + r * 997 + (v.variant === "prarr" ? 1e4 : v.variant === "sllrst" ? 2e4 : 0) + Math.round(pH * 100);
				this.rngSeed = seed;
				this.rng = makeRng(seed);
				this.spawnSeed = seed;
				this.setReceptorGeometry("furin");
				this.ligandBaseline = "ligand2";
				this.peptideVariant = v.variant;
				this.ligand2Count = nMol;
				this.ligand2Enabled = true;
				this.moleculeCount = 0;
				this.ligand3Enabled = false;
				this.ligand3Count = 0;
				this.ligand4Enabled = false;
				this.ligand4Count = 0;
				this.bootstrap(0, pH);
				this.enforceExclusiveParticles();
				this.applyValidityLockedParams(pH);
				this.applyPH(pH);
				this.resetBehaviorCounters();
				this.playing = true;
				let sumU = 0, sumTot = 0, nU = 0;
				for (let f = 0; f < frames; f++) {
					this.step();
					this.refreshRoiEnergy();
					const re = this.roiEnergy;
					if (re) {
						sumU += re.energyL2His;
						sumTot += re.energyTotal;
						nU++;
					}
				}
				const inv = nU || 1;
				uSamples.push(sumU / inv);
				totSamples.push(sumTot / inv);
				proxSamples.push(this.behaviorStats.proximityEvents);
				thetaSamples.push(this.hisTheta);
				qSamples.push(this.proteins[0]?.hisCharge ?? 0);
			}
			const ms = (xs) => {
				const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
				if (xs.length < 2) return {
					mean,
					sd: 0
				};
				const varr = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
				return {
					mean,
					sd: Math.sqrt(varr)
				};
			};
			const u = ms(uSamples);
			const tot = ms(totSamples);
			const prox = ms(proxSamples);
			const th = ms(thetaSamples);
			const qh = ms(qSamples);
			rows.push({
				baselineId: `Baseline_${v.label}_${nMol}`,
				sequence: v.label,
				nominalCharge: v.q,
				pH,
				n: nRep,
				frames,
				U_pep_His_mean: u.mean,
				U_pep_His_sd: u.sd,
				U_tot_mean: tot.mean,
				U_tot_sd: tot.sd,
				proximity_mean: prox.mean,
				proximity_sd: prox.sd,
				theta_mean: th.mean,
				q_His_mean: qh.mean
			});
		}
		this.setRespawnOnBinding(savedRespawn);
		const disclaimer = "# Classical continuum electrostatics only. Educational / hypothesis tool. Not MD, docking, or biological validation.";
		const csv = `${disclaimer}\n${[
			"baselineId",
			"sequence",
			"nominalCharge",
			"pH",
			"n",
			"frames",
			"U_pep_His_mean",
			"U_pep_His_sd",
			"U_tot_mean",
			"U_tot_sd",
			"proximity_mean",
			"proximity_sd",
			"theta_mean",
			"q_His_mean"
		].join(",")}\n${rows.map((r) => [
			r.baselineId,
			r.sequence,
			r.nominalCharge,
			r.pH,
			r.n,
			r.frames,
			r.U_pep_His_mean.toFixed(6),
			r.U_pep_His_sd.toFixed(6),
			r.U_tot_mean.toFixed(6),
			r.U_tot_sd.toFixed(6),
			r.proximity_mean.toFixed(4),
			r.proximity_sd.toFixed(4),
			r.theta_mean.toFixed(6),
			r.q_His_mean.toFixed(6)
		].join(",")).join("\n")}\n`;
		const rankRows = [disclaimer, "pH,rank,sequence,nominalCharge,U_pep_His_mean,U_pep_His_sd,absU"];
		for (const pH of [
			7.4,
			6.2,
			5
		]) rows.filter((r) => r.pH === pH).sort((a, b) => Math.abs(b.U_pep_His_mean) - Math.abs(a.U_pep_His_mean)).forEach((r, i) => {
			rankRows.push([
				pH,
				i + 1,
				r.sequence,
				r.nominalCharge,
				r.U_pep_His_mean.toFixed(6),
				r.U_pep_His_sd.toFixed(6),
				Math.abs(r.U_pep_His_mean).toFixed(6)
			].join(","));
		});
		const rankingCsv = rankRows.join("\n") + "\n";
		const notes = [];
		for (const pH of [
			7.4,
			6.2,
			5
		]) {
			const bySeq = Object.fromEntries(rows.filter((r) => r.pH === pH).map((r) => [r.sequence, r.U_pep_His_mean]));
			const k = bySeq["KSRRRAR"] ?? 0;
			const pr = bySeq["PRARR"] ?? 0;
			const sl = bySeq["SLLRST"] ?? 0;
			const ok = Math.abs(k) > Math.abs(pr) && Math.abs(pr) > Math.abs(sl);
			notes.push(`pH ${pH}: |U| K=${Math.abs(k).toFixed(2)} PR=${Math.abs(pr).toFixed(2)} SL=${Math.abs(sl).toFixed(2)} → ${ok ? "CONFIRMED" : "REFUTED"}`);
		}
		const summary = notes.join(" · ");
		const payload = {
			schema: "moleculosphere5d.peptide3_furin.v1",
			disclaimer: "Classical continuum electrostatics only. SLLRST is a continuum single-Arg educational contrast — not a viral infectivity claim.",
			locked: { ...VALIDITY_LOCKED },
			receptor: "furin",
			roi: "His194",
			respawn: false,
			nMolecules: nMol,
			frames,
			replicates: nRep,
			expectation: "|U|(KSRRRAR) > |U|(PRARR) > |U|(SLLRST)",
			rankingNotes: notes,
			rows
		};
		const json = JSON.stringify(payload, null, 2);
		this.lastScientificJson = json;
		this.emitUi();
		return {
			csv,
			rankingCsv,
			json,
			summary
		};
	}
	/**
	* Public validation matrix PUB_MATRIX:
	* receptors A–F × exclusive {Pb²⁺, KSRRRAR, PRARR, SLLRST} × pH 7.4/6.2/5.0.
	* Locked Yukawa; respawn OFF. Energy ranking primary.
	*/
	runPubMatrix(opts) {
		const nMol = opts?.nMolecules ?? 20;
		const frames = opts?.frames ?? 200;
		const nRep = opts?.replicates ?? 5;
		const receptors = [
			"furin",
			"acidicPore",
			"alpha7Allo",
			"alpha7Ortho",
			"atp7aWt",
			"atp7aMenkes"
		];
		const ligands = [
			{
				id: "L_HM",
				label: "Pb2+",
				pb: nMol,
				peptide: "off",
				peptideCount: 0,
				q: 2,
				energyKey: "L1"
			},
			{
				id: "L_PB5",
				label: "KSRRRAR",
				pb: 0,
				peptide: "ksrrrar",
				peptideCount: nMol,
				q: 5,
				energyKey: "L2"
			},
			{
				id: "L_PB3",
				label: "PRARR",
				pb: 0,
				peptide: "prarr",
				peptideCount: nMol,
				q: 3,
				energyKey: "L2"
			},
			{
				id: "L_MB1",
				label: "SLLRST",
				pb: 0,
				peptide: "sllrst",
				peptideCount: nMol,
				q: 1,
				energyKey: "L2"
			}
		];
		const pHs = [
			7.4,
			6.2,
			5
		];
		const rows = [];
		const savedRespawn = this.respawnOnBinding;
		this.setRespawnOnBinding(false);
		const ms = (xs) => {
			const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
			if (xs.length < 2) return {
				mean,
				sd: 0
			};
			const varr = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
			return {
				mean,
				sd: Math.sqrt(varr)
			};
		};
		let cell = 0;
		for (const rec of receptors) for (const lig of ligands) for (const pH of pHs) {
			const uSamples = [];
			const totSamples = [];
			for (let r = 0; r < nRep; r++) {
				const seed = VALIDITY_LOCKED.baseSeed + r * 997 + rec.length * 31 + lig.id.charCodeAt(2) * 17 + Math.round(pH * 100) + cell * 3;
				this.rngSeed = seed;
				this.rng = makeRng(seed);
				this.spawnSeed = seed;
				this.setReceptorGeometry(rec);
				this.ligand3Enabled = false;
				this.ligand3Count = 0;
				this.ligand4Enabled = false;
				this.ligand4Count = 0;
				if (lig.energyKey === "L1") {
					this.ligandBaseline = "ligand1";
					this.metalMode = "pb";
					this.moleculeCount = lig.pb;
					this.peptideVariant = "off";
					this.ligand2Count = 0;
					this.ligand2Enabled = false;
					this.bootstrap(lig.pb, pH);
				} else {
					this.ligandBaseline = "ligand2";
					this.moleculeCount = 0;
					this.peptideVariant = lig.peptide;
					this.ligand2Count = lig.peptideCount;
					this.ligand2Enabled = true;
					this.bootstrap(0, pH);
				}
				this.enforceExclusiveParticles();
				this.applyValidityLockedParams(pH);
				this.applyPH(pH);
				this.resetBehaviorCounters();
				this.playing = true;
				let sumU = 0, sumTot = 0, nU = 0;
				for (let f = 0; f < frames; f++) {
					this.step();
					this.refreshRoiEnergy();
					const re = this.roiEnergy;
					if (re) {
						sumU += lig.energyKey === "L1" ? re.energyL1His : re.energyL2His;
						sumTot += re.energyTotal;
						nU++;
					}
				}
				const inv = nU || 1;
				uSamples.push(sumU / inv);
				totSamples.push(sumTot / inv);
			}
			const u = ms(uSamples);
			const tot = ms(totSamples);
			const meta = RECEPTOR_GEOMETRIES[rec];
			rows.push({
				receptorId: rec,
				receptorLabel: meta?.shortLabel ?? rec,
				ligandId: lig.id,
				ligandLabel: lig.label,
				nominalCharge: lig.q,
				pH,
				n: nRep,
				frames,
				U_L_ROI_mean: u.mean,
				U_L_ROI_sd: u.sd,
				U_tot_mean: tot.mean,
				U_tot_sd: tot.sd
			});
			cell++;
		}
		this.setRespawnOnBinding(savedRespawn);
		const disclaimer = "# " + PUBLICATION_DISCLAIMER + "\n# MoleculoSphere 5D · Beta v1.0 · locked Yukawa · respawn OFF";
		const csv = `${disclaimer}\n${[
			"receptorId",
			"receptorLabel",
			"ligandId",
			"ligandLabel",
			"nominalCharge",
			"pH",
			"n",
			"frames",
			"U_L_ROI_mean",
			"U_L_ROI_sd",
			"U_tot_mean",
			"U_tot_sd"
		].join(",")}\n${rows.map((r) => [
			r.receptorId,
			r.receptorLabel,
			r.ligandId,
			r.ligandLabel,
			r.nominalCharge,
			r.pH,
			r.n,
			r.frames,
			r.U_L_ROI_mean.toFixed(6),
			r.U_L_ROI_sd.toFixed(6),
			r.U_tot_mean.toFixed(6),
			r.U_tot_sd.toFixed(6)
		].join(",")).join("\n")}\n`;
		const rankRows = [disclaimer, "receptorId,pH,rank,ligandLabel,nominalCharge,U_L_ROI_mean,U_L_ROI_sd,absU"];
		for (const rec of receptors) for (const pH of pHs) rows.filter((r) => r.receptorId === rec && r.pH === pH).sort((a, b) => Math.abs(b.U_L_ROI_mean) - Math.abs(a.U_L_ROI_mean)).forEach((r, i) => {
			rankRows.push([
				rec,
				pH,
				i + 1,
				r.ligandLabel,
				r.nominalCharge,
				r.U_L_ROI_mean.toFixed(6),
				r.U_L_ROI_sd.toFixed(6),
				Math.abs(r.U_L_ROI_mean).toFixed(6)
			].join(","));
		});
		const rankingCsv = rankRows.join("\n") + "\n";
		const efRows = [disclaimer, "ligandLabel,nominalCharge,pH,U_E_WT_mean,U_E_WT_sd,U_F_Menkes_mean,U_F_Menkes_sd,delta_absU_E_minus_F,WT_stronger"];
		const notes = [];
		for (const lig of ligands) for (const pH of pHs) {
			const e = rows.find((r) => r.receptorId === "atp7aWt" && r.ligandLabel === lig.label && r.pH === pH);
			const f = rows.find((r) => r.receptorId === "atp7aMenkes" && r.ligandLabel === lig.label && r.pH === pH);
			if (!e || !f) continue;
			const dAbs = Math.abs(e.U_L_ROI_mean) - Math.abs(f.U_L_ROI_mean);
			const stronger = dAbs > 0;
			efRows.push([
				lig.label,
				lig.q,
				pH,
				e.U_L_ROI_mean.toFixed(6),
				e.U_L_ROI_sd.toFixed(6),
				f.U_L_ROI_mean.toFixed(6),
				f.U_L_ROI_sd.toFixed(6),
				dAbs.toFixed(6),
				stronger ? "yes" : "no"
			].join(","));
			if (pH === 7.4) notes.push(`${lig.label}: |U|_E=${Math.abs(e.U_L_ROI_mean).toFixed(2)} |U|_F=${Math.abs(f.U_L_ROI_mean).toFixed(2)} → E ${stronger ? ">" : "≤"} F`);
		}
		const eVsFCsv = efRows.join("\n") + "\n";
		const summary = `PUB_MATRIX ${rows.length} cells · n=${nRep} · frames=${frames} · E vs F @7.4: ${notes.join(" · ")} · ${PUBLICATION_DISCLAIMER}`;
		const payload = {
			schema: "moleculosphere5d.pub_matrix.v1",
			disclaimer: PUBLICATION_DISCLAIMER,
			locked: { ...VALIDITY_LOCKED },
			receptors,
			ligands: ligands.map((l) => l.label),
			pH: [...pHs],
			respawn: false,
			nMolecules: nMol,
			frames,
			replicates: nRep,
			rows,
			eVsFNotes: notes
		};
		const json = JSON.stringify(payload, null, 2);
		this.lastScientificJson = json;
		this.emitUi();
		return {
			csv,
			rankingCsv,
			eVsFCsv,
			json,
			summary
		};
	}
	/**
	* Menkes-scope Cu²⁺ analysis (public Beta v1.0):
	* exclusive Cu²⁺ on E (ATP7A WT) and F (ATP7A Menkes) × pH 7.4 / 6.2 / 5.0.
	* Also builds E/F ranking including Cu²⁺ + Pb²⁺ + KSRRRAR + PRARR + SLLRST.
	* Locked Yukawa; respawn OFF. Primary metric: mean±sd U_L–ROI; ΔU = U_F − U_E.
	*/
	runPubMatrixCuEF(opts) {
		const nMol = opts?.nMolecules ?? 20;
		const frames = opts?.frames ?? 150;
		const nRep = opts?.replicates ?? 5;
		const receptors = ["atp7aWt", "atp7aMenkes"];
		const pHs = [
			7.4,
			6.2,
			5
		];
		const allLigands = [
			{
				id: "L_HM_Cu",
				label: "Cu2+",
				metal: "cu",
				peptide: "off",
				pb: nMol,
				peptideCount: 0,
				q: 2,
				energyKey: "L1"
			},
			{
				id: "L_HM_Pb",
				label: "Pb2+",
				metal: "pb",
				peptide: "off",
				pb: nMol,
				peptideCount: 0,
				q: 2,
				energyKey: "L1"
			},
			{
				id: "L_PB5",
				label: "KSRRRAR",
				metal: "off",
				peptide: "ksrrrar",
				pb: 0,
				peptideCount: nMol,
				q: 5,
				energyKey: "L2"
			},
			{
				id: "L_PB3",
				label: "PRARR",
				metal: "off",
				peptide: "prarr",
				pb: 0,
				peptideCount: nMol,
				q: 3,
				energyKey: "L2"
			},
			{
				id: "L_MB1",
				label: "SLLRST",
				metal: "off",
				peptide: "sllrst",
				pb: 0,
				peptideCount: nMol,
				q: 1,
				energyKey: "L2"
			}
		];
		const rows = [];
		const savedRespawn = this.respawnOnBinding;
		const savedMode = this.metalMode;
		this.setRespawnOnBinding(false);
		const ms = (xs) => {
			const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
			if (xs.length < 2) return {
				mean,
				sd: 0
			};
			const varr = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
			return {
				mean,
				sd: Math.sqrt(varr)
			};
		};
		let cell = 0;
		for (const rec of receptors) for (const lig of allLigands) for (const pH of pHs) {
			const uSamples = [];
			const totSamples = [];
			for (let r = 0; r < nRep; r++) {
				const seed = VALIDITY_LOCKED.baseSeed + r * 997 + rec.length * 31 + lig.id.charCodeAt(Math.min(4, lig.id.length - 1)) * 19 + Math.round(pH * 100) + cell * 5;
				this.rngSeed = seed;
				this.rng = makeRng(seed);
				this.spawnSeed = seed;
				this.setReceptorGeometry(rec);
				this.ligand3Enabled = false;
				this.ligand3Count = 0;
				this.ligand4Enabled = false;
				this.ligand4Count = 0;
				if (lig.energyKey === "L1") {
					this.metalMode = lig.metal;
					this.ligandBaseline = "ligand1";
					this.moleculeCount = lig.pb;
					this.peptideVariant = "off";
					this.ligand2Count = 0;
					this.ligand2Enabled = false;
					this.bootstrap(lig.pb, pH);
				} else {
					this.metalMode = "off";
					this.ligandBaseline = "ligand2";
					this.moleculeCount = 0;
					this.peptideVariant = lig.peptide;
					this.ligand2Count = lig.peptideCount;
					this.ligand2Enabled = true;
					this.bootstrap(0, pH);
				}
				this.enforceExclusiveParticles();
				this.applyValidityLockedParams(pH);
				this.applyPH(pH);
				this.resetBehaviorCounters();
				this.playing = true;
				let sumU = 0, sumTot = 0, nU = 0;
				for (let f = 0; f < frames; f++) {
					this.step();
					this.refreshRoiEnergy();
					const re = this.roiEnergy;
					if (re) {
						sumU += lig.energyKey === "L1" ? re.energyL1His : re.energyL2His;
						sumTot += re.energyTotal;
						nU++;
					}
				}
				const inv = nU || 1;
				uSamples.push(sumU / inv);
				totSamples.push(sumTot / inv);
			}
			const u = ms(uSamples);
			const tot = ms(totSamples);
			const meta = RECEPTOR_GEOMETRIES[rec];
			rows.push({
				receptorId: rec,
				receptorLabel: meta?.shortLabel ?? rec,
				ligandId: lig.id,
				ligandLabel: lig.label,
				nominalCharge: lig.q,
				pH,
				n: nRep,
				frames,
				U_L_ROI_mean: u.mean,
				U_L_ROI_sd: u.sd,
				U_tot_mean: tot.mean,
				U_tot_sd: tot.sd
			});
			cell++;
		}
		this.setRespawnOnBinding(savedRespawn);
		this.metalMode = savedMode;
		const disclaimer = "# " + PUBLICATION_DISCLAIMER + "\n# MoleculoSphere 5D · Beta v1.0 · locked Yukawa · respawn OFF";
		const cuRows = rows.filter((r) => r.ligandId === "L_HM_Cu");
		const meanSdCsv = `${disclaimer}\n${[
			"receptorId",
			"receptorLabel",
			"ligandId",
			"ligandLabel",
			"nominalCharge",
			"pH",
			"n",
			"frames",
			"U_Cu_ROI_mean",
			"U_Cu_ROI_sd",
			"U_tot_mean",
			"U_tot_sd"
		].join(",")}\n${cuRows.map((r) => [
			r.receptorId,
			r.receptorLabel,
			r.ligandId,
			r.ligandLabel,
			r.nominalCharge,
			r.pH,
			r.n,
			r.frames,
			r.U_L_ROI_mean.toFixed(6),
			r.U_L_ROI_sd.toFixed(6),
			r.U_tot_mean.toFixed(6),
			r.U_tot_sd.toFixed(6)
		].join(",")).join("\n")}\n`;
		const contrastLines = [disclaimer, "ligandLabel,nominalCharge,pH,U_E_WT_mean,U_E_WT_sd,U_F_Menkes_mean,U_F_Menkes_sd,deltaU_F_minus_E,deltaAbsU_E_minus_F,WT_stronger"];
		const notes = [];
		for (const lab of ["Cu2+", "Pb2+"]) for (const pH of pHs) {
			const e = rows.find((r) => r.receptorId === "atp7aWt" && r.ligandLabel === lab && r.pH === pH);
			const f = rows.find((r) => r.receptorId === "atp7aMenkes" && r.ligandLabel === lab && r.pH === pH);
			if (!e || !f) continue;
			const dU = f.U_L_ROI_mean - e.U_L_ROI_mean;
			const dAbs = Math.abs(e.U_L_ROI_mean) - Math.abs(f.U_L_ROI_mean);
			const stronger = dAbs > 0;
			contrastLines.push([
				lab,
				lab === "Cu2+" ? 2 : 2,
				pH,
				e.U_L_ROI_mean.toFixed(6),
				e.U_L_ROI_sd.toFixed(6),
				f.U_L_ROI_mean.toFixed(6),
				f.U_L_ROI_sd.toFixed(6),
				dU.toFixed(6),
				dAbs.toFixed(6),
				stronger ? "yes" : "no"
			].join(","));
			if (pH === 7.4) notes.push(`${lab}: ΔU(F−E)=${dU.toFixed(2)} |U|_E=${Math.abs(e.U_L_ROI_mean).toFixed(2)} |U|_F=${Math.abs(f.U_L_ROI_mean).toFixed(2)}`);
		}
		const contrastCsv = contrastLines.join("\n") + "\n";
		const rankLines = [disclaimer, "receptorId,pH,rank,ligandLabel,nominalCharge,U_L_ROI_mean,U_L_ROI_sd,absU"];
		for (const rec of receptors) for (const pH of pHs) rows.filter((r) => r.receptorId === rec && r.pH === pH).sort((a, b) => Math.abs(b.U_L_ROI_mean) - Math.abs(a.U_L_ROI_mean)).forEach((r, i) => {
			rankLines.push([
				rec,
				pH,
				i + 1,
				r.ligandLabel,
				r.nominalCharge,
				r.U_L_ROI_mean.toFixed(6),
				r.U_L_ROI_sd.toFixed(6),
				Math.abs(r.U_L_ROI_mean).toFixed(6)
			].join(","));
		});
		const rankingEFCsv = rankLines.join("\n") + "\n";
		const summary = `Cu Menkes E/F ${cuRows.length} cells · n=${nRep} · frames=${frames} · @7.4: ${notes.join(" · ")} · ${PUBLICATION_DISCLAIMER}`;
		const payload = {
			schema: "moleculosphere5d.pub_matrix_cu_ef.v1",
			version: "Beta v1.0",
			disclaimer: PUBLICATION_DISCLAIMER,
			locked: { ...VALIDITY_LOCKED },
			receptors,
			ligands: allLigands.map((l) => l.label),
			pH: [...pHs],
			respawn: false,
			nMolecules: nMol,
			frames,
			replicates: nRep,
			cuRows,
			allRows: rows,
			eVsFNotes: notes
		};
		const json = JSON.stringify(payload, null, 2);
		this.lastScientificJson = json;
		this.emitUi();
		return {
			meanSdCsv,
			contrastCsv,
			rankingEFCsv,
			json,
			summary
		};
	}
	/**
	* PUB_COMBO v1.1 — public multi-ligand HM + peptide pairs.
	* Receptors B (acidic pore), E (ATP7A WT), F (ATP7A Menkes).
	* Pairs: Pb+KSRRRAR, Cu+KSRRRAR, Pb+PRARR × pH 7.4/6.2/5.0.
	* Exports mean±sd U_HM–ROI, U_pep–ROI, U_HM–pep, U_tot + exclusive baselines.
	* Locked Yukawa; respawn OFF. No private ligands.
	*/
	runPubCombo(opts) {
		const nMol = opts?.nMolecules ?? 12;
		const frames = opts?.frames ?? 150;
		const nRep = opts?.replicates ?? 5;
		const receptors = [
			"acidicPore",
			"atp7aWt",
			"atp7aMenkes"
		];
		const pairs = [
			{
				id: "Pb_KS",
				label: "Pb2+ + KSRRRAR",
				metal: "pb",
				peptide: "ksrrrar",
				pepLabel: "KSRRRAR"
			},
			{
				id: "Cu_KS",
				label: "Cu2+ + KSRRRAR",
				metal: "cu",
				peptide: "ksrrrar",
				pepLabel: "KSRRRAR"
			},
			{
				id: "Pb_PR",
				label: "Pb2+ + PRARR",
				metal: "pb",
				peptide: "prarr",
				pepLabel: "PRARR"
			}
		];
		const pHs = [
			7.4,
			6.2,
			5
		];
		const ms = (xs) => {
			const mean = xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
			if (xs.length < 2) return {
				mean,
				sd: 0
			};
			const varr = xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1);
			return {
				mean,
				sd: Math.sqrt(varr)
			};
		};
		const rows = [];
		const savedRespawn = this.respawnOnBinding;
		this.setRespawnOnBinding(false);
		const runMode = (rec, pair, pH, mode, cell) => {
			const uHm = [];
			const uPep = [];
			const uLl = [];
			const uTot = [];
			for (let r = 0; r < nRep; r++) {
				const seed = VALIDITY_LOCKED.baseSeed + r * 997 + rec.length * 31 + pair.id.charCodeAt(0) * 17 + Math.round(pH * 100) + cell * 5 + (mode === "combo" ? 0 : mode === "exclusive_HM" ? 1 : 2);
				this.rngSeed = seed;
				this.rng = makeRng(seed);
				this.spawnSeed = seed;
				this.setReceptorGeometry(rec);
				this.ligand3Enabled = false;
				this.ligand3Count = 0;
				this.ligand4Enabled = false;
				this.ligand4Count = 0;
				this.metalMode = pair.metal;
				if (mode === "combo") {
					this.ligandBaseline = "both";
					this.moleculeCount = nMol;
					this.peptideVariant = pair.peptide;
					this.ligand2Count = nMol;
					this.ligand2Enabled = true;
					this.bootstrap(nMol, pH);
				} else if (mode === "exclusive_HM") {
					this.ligandBaseline = "ligand1";
					this.moleculeCount = nMol;
					this.peptideVariant = "off";
					this.ligand2Count = 0;
					this.ligand2Enabled = false;
					this.bootstrap(nMol, pH);
				} else {
					this.ligandBaseline = "ligand2";
					this.moleculeCount = 0;
					this.peptideVariant = pair.peptide;
					this.ligand2Count = nMol;
					this.ligand2Enabled = true;
					this.bootstrap(0, pH);
				}
				this.enforceExclusiveParticles();
				this.applyValidityLockedParams(pH);
				this.applyPH(pH);
				this.resetBehaviorCounters();
				this.playing = true;
				let sHm = 0, sPep = 0, sLl = 0, sTot = 0, nU = 0;
				for (let f = 0; f < frames; f++) {
					this.step();
					this.refreshRoiEnergy();
					const re = this.roiEnergy;
					if (re) {
						const hm = Number(re.energyL1His) || 0;
						const pep = Number(re.energyL2His) || 0;
						const ll = Number(re.energyL1L2) || 0;
						sHm += hm;
						sPep += pep;
						sLl += ll;
						if (mode === "combo") sTot += hm + pep + ll;
						else if (mode === "exclusive_HM") sTot += hm;
						else sTot += pep;
						nU++;
					}
				}
				const inv = nU || 1;
				uHm.push(sHm / inv);
				uPep.push(sPep / inv);
				uLl.push(sLl / inv);
				uTot.push(sTot / inv);
			}
			const hm = ms(uHm);
			const pep = ms(uPep);
			const ll = ms(uLl);
			const tot = ms(uTot);
			const badge = mode !== "combo" ? "—" : ll.mean > .05 ? "Competitive" : ll.mean < -.05 ? "Cooperative" : "Neutral";
			return {
				receptorId: rec,
				receptorLabel: RECEPTOR_GEOMETRIES[rec]?.shortLabel ?? rec,
				pairId: pair.id,
				pairLabel: pair.label,
				metal: pair.metal === "cu" ? "Cu2+" : "Pb2+",
				peptide: pair.pepLabel,
				pH,
				n: nRep,
				frames,
				mode,
				U_HM_ROI_mean: hm.mean,
				U_HM_ROI_sd: hm.sd,
				U_pep_ROI_mean: pep.mean,
				U_pep_ROI_sd: pep.sd,
				U_HM_pep_mean: ll.mean,
				U_HM_pep_sd: ll.sd,
				U_tot_mean: tot.mean,
				U_tot_sd: tot.sd,
				badge
			};
		};
		let cell = 0;
		for (const rec of receptors) for (const pair of pairs) for (const pH of pHs) {
			rows.push(runMode(rec, pair, pH, "combo", cell));
			rows.push(runMode(rec, pair, pH, "exclusive_HM", cell));
			rows.push(runMode(rec, pair, pH, "exclusive_pep", cell));
			cell++;
		}
		this.setRespawnOnBinding(savedRespawn);
		const disclaimer = "# " + PUBLICATION_DISCLAIMER + "\n# MoleculoSphere 5D · Beta v1.1 · PUB_COMBO · locked Yukawa · respawn OFF";
		const comboRows = rows.filter((r) => r.mode === "combo");
		const csv = `${disclaimer}\n${[
			"receptorId",
			"receptorLabel",
			"pairId",
			"pairLabel",
			"metal",
			"peptide",
			"pH",
			"n",
			"frames",
			"U_HM_ROI_mean",
			"U_HM_ROI_sd",
			"U_pep_ROI_mean",
			"U_pep_ROI_sd",
			"U_HM_pep_mean",
			"U_HM_pep_sd",
			"U_tot_mean",
			"U_tot_sd",
			"badge"
		].join(",")}\n${comboRows.map((r) => [
			r.receptorId,
			r.receptorLabel,
			r.pairId,
			JSON.stringify(r.pairLabel),
			r.metal,
			r.peptide,
			r.pH,
			r.n,
			r.frames,
			r.U_HM_ROI_mean.toFixed(6),
			r.U_HM_ROI_sd.toFixed(6),
			r.U_pep_ROI_mean.toFixed(6),
			r.U_pep_ROI_sd.toFixed(6),
			r.U_HM_pep_mean.toFixed(6),
			r.U_HM_pep_sd.toFixed(6),
			r.U_tot_mean.toFixed(6),
			r.U_tot_sd.toFixed(6),
			r.badge
		].join(",")).join("\n")}\n`;
		const vsLines = [disclaimer, [
			"receptorId",
			"pairId",
			"pairLabel",
			"pH",
			"U_HM_combo_mean",
			"U_pep_combo_mean",
			"U_HM_pep_mean",
			"U_tot_combo_mean",
			"badge",
			"U_HM_exclusive_mean",
			"U_pep_exclusive_mean",
			"delta_HM_combo_minus_excl",
			"delta_pep_combo_minus_excl"
		].join(",")];
		for (const rec of receptors) for (const pair of pairs) for (const pH of pHs) {
			const c = rows.find((r) => r.mode === "combo" && r.receptorId === rec && r.pairId === pair.id && r.pH === pH);
			const eh = rows.find((r) => r.mode === "exclusive_HM" && r.receptorId === rec && r.pairId === pair.id && r.pH === pH);
			const ep = rows.find((r) => r.mode === "exclusive_pep" && r.receptorId === rec && r.pairId === pair.id && r.pH === pH);
			if (!c || !eh || !ep) continue;
			vsLines.push([
				rec,
				pair.id,
				JSON.stringify(pair.label),
				pH,
				c.U_HM_ROI_mean.toFixed(6),
				c.U_pep_ROI_mean.toFixed(6),
				c.U_HM_pep_mean.toFixed(6),
				c.U_tot_mean.toFixed(6),
				c.badge,
				eh.U_HM_ROI_mean.toFixed(6),
				ep.U_pep_ROI_mean.toFixed(6),
				(c.U_HM_ROI_mean - eh.U_HM_ROI_mean).toFixed(6),
				(c.U_pep_ROI_mean - ep.U_pep_ROI_mean).toFixed(6)
			].join(","));
		}
		const vsExclusiveCsv = vsLines.join("\n") + "\n";
		const nCompetitive = comboRows.filter((r) => r.badge === "Competitive").length;
		const nCoop = comboRows.filter((r) => r.badge === "Cooperative").length;
		const summary = `PUB_COMBO v1.1: ${comboRows.length} combo cells · n=${nRep} · frames=${frames} · Competitive ${nCompetitive} · Cooperative ${nCoop} · ${PUBLICATION_DISCLAIMER}`;
		const payload = {
			schema: "moleculosphere5d.pub_combo.v1_1",
			disclaimer: PUBLICATION_DISCLAIMER,
			version: "Beta v1.1",
			locked: { ...VALIDITY_LOCKED },
			chargeSource: "formal",
			receptors,
			pairs: pairs.map((x) => x.label),
			pH: [...pHs],
			respawn: false,
			nMolecules: nMol,
			frames,
			replicates: nRep,
			comboRows,
			allRows: rows
		};
		const json = JSON.stringify(payload, null, 2);
		this.lastScientificJson = json;
		this.emitUi();
		return {
			csv,
			vsExclusiveCsv,
			json,
			summary
		};
	}
	/** @deprecated alias — Beta v1.0 uses runPubMatrixCuEF */
	runPubMatrixCuPbEF(opts) {
		opts?.includeAD;
		const r = this.runPubMatrixCuEF(opts);
		return {
			csv: r.meanSdCsv,
			json: r.json,
			summary: r.summary,
			contrastCsv: r.contrastCsv,
			rankingEFCsv: r.rankingEFCsv
		};
	}
	exportScientificSnapshot() {
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		const re = this.roiEnergy;
		const snap = buildScientificSnapshot({
			stats: this.behaviorStats,
			params: this.params,
			debyeOverride: this.debyeOverrideNm != null,
			hisPka: this.hisPka,
			pH: this.pH,
			theta: this.hisTheta,
			hisCharge: prot?.hisCharge ?? 0,
			binaryOn: prot?.switchDisplayOn ?? false,
			pbCharge: 2,
			peptideCharge: this.peptideVariant === "prarr" ? 3 : this.peptideVariant === "sllrst" ? 1 : this.peptideVariant === "ksrrrar" ? 5 : 0,
			roi: re,
			ligandBaseline: this.ligandBaseline,
			timeNs: this.timeNs,
			scenarioId: this.activeScenario,
			ligand2Enabled: this.ligand2Enabled,
			ligand2Count: this.ligand2Count,
			ligand2ChargeScale: this.ligand2ChargeScale,
			moleculeCount: this.moleculeCount,
			displayDurationSec: this.displayDurationSec,
			respawnOnBinding: this.respawnOnBinding,
			metalHisPrefEnabled: this.metalHisPrefEnabled,
			metalHisPrefFactor: this.metalHisPrefFactor,
			shortRangeWellEnabled: this.shortRangeWellEnabled,
			shortRangeWellDepthKt: this.shortRangeWellDepthKt,
			trajectorySummary: {
				frameCount: this.trajectory.length,
				tStartNs: this.trajectory[0]?.tNs ?? null,
				tEndNs: this.trajectory[this.trajectory.length - 1]?.tNs ?? null,
				particleCount: this.particles.length
			}
		});
		this.lastScientificJson = JSON.stringify(snap, null, 2);
		return snap;
	}
	exportScientificCsv() {
		const snap = this.exportScientificSnapshot();
		if (!snap) return "";
		return scientificSnapshotToCsv(snap);
	}
	exportEnergySeriesCsv() {
		if (!this.eventLog.length) return "tNs,U_Pb_His,U_pep_His,U_L1_L2,U_tot,His194_ON\n";
		return eventSeriesToCsv(this.eventLog.map((f) => ({
			tNs: f.tNs,
			eL1: f.energyL1His,
			eL2: f.energyL2His,
			eL12: f.energyL1L2,
			eTot: f.energyTotal,
			on: f.switchDisplayOn
		})));
	}
	exportBehaviorSamplesCsv() {
		return behaviorSamplesToCsv(this.behaviorStats);
	}
	exportRoiSnapshot() {
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		if (!prot) return null;
		this.refreshRoiEnergy();
		try {
			const snap = buildRoiAgentSnapshot({
				prot,
				particles: this.particles,
				params: this.params,
				roiEnergy: this.roiEnergy,
				ligandBaseline: this.ligandBaseline,
				metalMode: this.metalMode,
				ligand2Enabled: this.ligand2Enabled,
				ligand2Count: this.ligand2Count,
				ligand2ChargeScale: this.ligand2ChargeScale,
				displayDurationSec: this.displayDurationSec,
				timeNs: this.timeNs
			});
			this.lastSnapshotJson = JSON.stringify(snap, null, 2);
			return snap;
		} catch {
			return null;
		}
	}
	applyScientificSnapshot(snap) {
		const pH = snap.pH ?? snap.conditions?.pH;
		if (pH != null) this.applyPH(pH);
		this.emitUi();
	}
	potentialAt(x, y, z) {
		const particles = this?.particles ?? [];
		const params = this?.params;
		if (!params) return 0;
		const f = fieldAt(x, y, z, particles, params);
		return typeof f === "number" ? f : f.potential;
	}
	recomputeField() {
		this.fieldSlice = buildFieldSlice(this.particles, this.proteins, this.params);
	}
	/**
	* True nearest active ligand to the focused ROI (all classes).
	* Distances in nm (positions are nm-native when coord scale = 1).
	*/
	nearestLigandToRoi(prot) {
		const roi = roiWorldPos(prot);
		let best = null;
		for (const p of this.particles) {
			const distNm = sceneToNm(Math.hypot(p.x - roi.x, p.y - roi.y, p.z - roi.z));
			if (!Number.isFinite(distNm) || distNm <= 0) continue;
			if (!best || distNm < best.distNm) best = {
				id: p.id,
				ligandClass: p.ligandClass,
				distNm,
				particle: p
			};
		}
		return best;
	}
	/**
	* Demo path: remove the contacting ligand and reinstate one of the same class
	* on the peripheral shell (outside the 1.0 nm contact zone).
	* Does not alter Yukawa parameters.
	*/
	respawnLigandAfterProximity(particleId, oldDistNm) {
		if (!this.respawnOnBinding) return;
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		if (!prot) return;
		let victim = particleId != null ? this.particles.find((x) => x.id === particleId) : void 0;
		if (!victim) {
			const near = this.nearestLigandToRoi(prot);
			victim = near?.particle;
			if (near && (oldDistNm == null || !Number.isFinite(oldDistNm))) oldDistNm = near.distNm;
		}
		if (!victim) return;
		const cls = victim.ligandClass;
		const speciesId = victim.speciesId;
		const kind = victim.kind;
		const qDesign = victim.qDesign;
		const oldId = victim.id;
		const oldD = oldDistNm != null && Number.isFinite(oldDistNm) ? oldDistNm : NaN;
		this.particles = this.particles.filter((x) => x.id !== oldId);
		this.ensureForceBuffers(this.particles.length);
		const roi = roiWorldPos(prot);
		const shellMin = Math.max(VALIDITY_LOCKED.shellMinNm, 1.25);
		const shellMax = Math.max(VALIDITY_LOCKED.shellMaxNm, shellMin + .6);
		const theta = this.rng() * Math.PI * 2;
		const phi = Math.acos(2 * this.rng() - 1);
		const r = shellMin + this.rng() * (shellMax - shellMin);
		const ux = Math.sin(phi) * Math.cos(theta);
		const uy = Math.sin(phi) * Math.sin(theta) * .55;
		const uz = Math.cos(phi);
		let vx = ux;
		let vy = uy;
		let vz = uz;
		let vn = Math.hypot(vx, vy, vz) || 1;
		vx /= vn;
		vy /= vn;
		vz /= vn;
		const nx = roi.x + vx * r;
		const ny = roi.y + vy * r;
		const nz = roi.z + vz * r;
		const on = 1;
		const sp = cls === "ligand1" ? ligand1Species(this.metalMode) : cls === "ligand2" ? ligand2Species(this.peptideVariant === "prarr" ? "prarr" : this.peptideVariant === "sllrst" ? "sllrst" : "ksrrrar") : cls === "ligand3" ? ligand3Species() : ligand4Species();
		const q = sp ? effectiveCharge(sp, this.pH) : victim.q;
		const newborn = {
			id: this.nextId++,
			speciesId: sp?.id ?? speciesId,
			kind: sp?.kind ?? kind,
			ligandClass: cls,
			x: nx,
			y: ny,
			z: nz,
			ox: vx / on,
			oy: vy / on,
			oz: vz / on,
			q,
			qDesign: sp ? this.qDesignForSpeciesId(sp.id) : qDesign
		};
		if (cls === "ligand2" && this.ligand2ChargeScale !== 1) newborn.q *= this.ligand2ChargeScale;
		this.particles.push(newborn);
		this.ensureForceBuffers(this.particles.length);
		const newDistNm = sceneToNm(Math.hypot(newborn.x - roi.x, newborn.y - roi.y, newborn.z - roi.z));
		this.pendingProximity = null;
		this.lastRespawnFlash = {
			particleId: newborn.id,
			ligandClass: cls,
			oldDistNm: Number.isFinite(oldD) ? oldD : -1,
			newDistNm,
			ticksLeft: 60
		};
		console.info(`[respawn] id=${oldId}→${newborn.id} class=${cls} oldDist=${Number.isFinite(oldD) ? oldD.toFixed(3) : "?"} nm newDist=${newDistNm.toFixed(3)} nm prox_events=${this.behaviorStats.proximityEvents}`);
	}
	step() {
		if (this.eventPlayback && this.eventLog.length) {
			const win = this.clampWindow;
			const i0 = win?.i0 ?? 0;
			const i1 = win?.i1 ?? this.eventLog.length - 1;
			let next = (this.eventScrub ?? i0) + 1;
			if (next > i1) if (this.clampLoop) next = i0;
			else {
				this.eventPlayback = false;
				this.eventScrub = i1;
				this.emit();
				return;
			}
			this.eventScrub = next;
			this.emit();
			return;
		}
		if (this.scrubIndex != null) {
			this.emit();
			return;
		}
		this.ensureForceBuffers(this.particles.length);
		stepOverdamped(this.particles, SPECIES_MAP_LOCAL, this.params, this.fx, this.fy, this.fz, this.proteins, this.rng);
		for (const p of this.particles) {
			const [wx, wy, wz] = wallForce(p.x, p.y, p.z, .35);
			p.x += wx * .02;
			p.y += wy * .02;
			p.z += wz * .02;
		}
		this.timeNs += 100;
		this.refreshRoiEnergy();
		let stepProxAccepted = false;
		let stepMinDistNm = -1;
		const prot = this.proteins[this.focusedProteinIndex] ?? this.proteins[0];
		if (prot) {
			updateHisSwitchBinary(prot, this.roiEnergy?.energyL1His ?? 0, this.roiEnergy?.energyL2His ?? 0);
			updateProteinResponses(this.proteins, this.particles, this.pH, this.params);
			this.hisTheta = prot.hisProtonation;
			const re = this.roiEnergy;
			const near = this.nearestLigandToRoi(prot);
			const nL1 = re.nearestL1Nm > 0 ? re.nearestL1Nm : Infinity;
			const nL2 = re.nearestL2Nm > 0 ? re.nearestL2Nm : Infinity;
			const nL3 = re.nearestL3Nm > 0 ? re.nearestL3Nm : Infinity;
			const nL4 = re.nearestL4Nm > 0 ? re.nearestL4Nm : Infinity;
			const nearestOverall = near ? near.distNm : Math.min(nL1, nL2, nL3, nL4);
			stepMinDistNm = Number.isFinite(nearestOverall) && nearestOverall < 1e6 ? nearestOverall : -1;
			const track = updateBehaviorTracking({
				stats: this.behaviorStats,
				pending: this.pendingApproach,
				pendingSwitch: this.pendingSwitch,
				pendingProximity: this.pendingProximity,
				prevSwitchOn: this.behaviorPrevSwitch,
				switchOn: prot.switchDisplayOn,
				theta: prot.hisProtonation,
				nearestL1Nm: nearestOverall,
				nearestL2Nm: nearestOverall,
				nearestParticleId: near?.id ?? -1,
				timeNs: this.timeNs,
				justClamped: false
			});
			this.pendingApproach = track.pending;
			this.pendingSwitch = track.pendingSwitch;
			this.pendingProximity = track.pendingProximity;
			this.behaviorPrevSwitch = track.prevSwitchOn;
			stepProxAccepted = track.justAcceptedProximity;
			if (track.justAcceptedProximity && this.respawnOnBinding) this.respawnLigandAfterProximity(track.acceptedProximityParticleId, track.acceptedProximityDistNm);
			if (this.lastRespawnFlash && this.lastRespawnFlash.ticksLeft > 0) {
				this.lastRespawnFlash = {
					...this.lastRespawnFlash,
					ticksLeft: this.lastRespawnFlash.ticksLeft - 1
				};
				if (this.lastRespawnFlash.ticksLeft <= 0) this.lastRespawnFlash = null;
			}
			if (this.hystHistory.length >= 280) this.hystHistory.shift();
			this.hystHistory.push({
				pH: this.pH,
				score: prot.continuousScore,
				protonation: prot.hisProtonation,
				switchOn: prot.switchDisplayOn,
				tNs: this.timeNs,
				direction: this.lastPhDirection
			});
			if (this.lastSwitchOn != null && this.lastSwitchOn !== prot.switchDisplayOn) {
				const ev = {
					kind: prot.switchDisplayOn ? "on" : "off",
					pH: this.pH,
					score: prot.continuousScore,
					tNs: this.timeNs
				};
				this.lastCrossing = ev;
				this.crossings.push(ev);
			}
			this.lastSwitchOn = prot.switchDisplayOn;
		}
		if (this.eventRecording) {
			const hhNow = this.behaviorStats.hhBinaryEvents;
			const hhFlag = hhNow > this._hhEventsAtRecord ? 1 : 0;
			if (hhFlag) this._hhEventsAtRecord = hhNow;
			const pFlag = stepProxAccepted ? 1 : 0;
			if (pFlag) this._proxEventsAtRecord = this.behaviorStats.proximityEvents;
			const frame = this.captureEventFrame({
				proxFlag: pFlag,
				hhFlag,
				minDistNm: stepMinDistNm
			});
			if (this.eventCapMode === "ring" && this.eventLog.length >= this.eventCap) {
				this.eventLog.shift();
				for (let i = 0; i < this.eventLog.length; i++) this.eventLog[i].frameIndex = i;
				frame.frameIndex = this.eventLog.length;
			}
			this.eventLog.push(frame);
			this.eventScrub = this.eventLog.length - 1;
			if (this.eventCapMode === "stop" && this.eventLog.length >= this.eventCap) {
				this.eventRecording = false;
				this.clampCapturing = false;
			}
		}
		this.trajectory.push(this.recordFrame());
		if (this.trajectory.length > 240) this.trajectory.shift();
		if (this.scenarioBanner && this.scenarioBanner.ticksLeft > 0) this.scenarioBanner = {
			...this.scenarioBanner,
			ticksLeft: this.scenarioBanner.ticksLeft - 1,
			switchOn: prot?.switchDisplayOn ?? false
		};
		this.stepsSinceUi++;
		if (this.showField && this.stepsSinceUi % 8 === 0) this.recomputeField();
		this.emit();
	}
};
var simEngine = new SimEngine();
if (typeof window !== "undefined") window.__simEngine = simEngine;
function supportsDirectoryPicker() {
	return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
}
function supportsFilePicker() {
	return typeof window !== "undefined" && typeof window.showOpenFilePicker === "function";
}
function stampBaseName(prefix = "moleculosphere5d-scientific") {
	const d = /* @__PURE__ */ new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${prefix}_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
async function pickSaveDirectory() {
	if (!supportsDirectoryPicker()) return null;
	try {
		return await window.showDirectoryPicker({
			id: "moleculosphere-bcdt",
			mode: "readwrite"
		});
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return null;
		throw e;
	}
}
async function writeFilesToDirectory(dir, files) {
	for (const f of files) {
		const w = await (await dir.getFileHandle(f.name, { create: true })).createWritable();
		await w.write(f.content);
		await w.close();
	}
}
function downloadText$1(filename, content, mime = "application/json") {
	const blob = new Blob([content], { type: `${mime};charset=utf-8` });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 2e3);
}
/**
* Save a full scientific bundle to a user-chosen folder (or download fallback).
*/
async function saveScientificBundle(bundle) {
	const files = [{
		name: `${bundle.baseName}.json`,
		content: bundle.snapshotJson
	}, {
		name: `${bundle.baseName}.csv`,
		content: bundle.snapshotCsv
	}];
	if (bundle.energySeriesCsv) files.push({
		name: `${bundle.baseName}_energy_series.csv`,
		content: bundle.energySeriesCsv
	});
	if (bundle.eventLogCsv) files.push({
		name: `${bundle.baseName}_event_log.csv`,
		content: bundle.eventLogCsv
	});
	if (supportsDirectoryPicker()) try {
		const dir = await pickSaveDirectory();
		if (!dir) return {
			ok: false,
			error: "Folder selection cancelled"
		};
		await writeFilesToDirectory(dir, files);
		return {
			ok: true,
			method: "fs-access",
			detail: `Saved ${files.length} files to “${dir.name}” (WSL / local drive OK)`
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		for (const f of files) {
			const mime = f.name.endsWith(".csv") ? "text/csv" : "application/json";
			downloadText$1(f.name, f.content, mime);
		}
		return {
			ok: true,
			method: "download",
			detail: `FS Access failed (${msg}); downloaded ${files.length} files instead`
		};
	}
	for (const f of files) {
		const mime = f.name.endsWith(".csv") ? "text/csv" : "application/json";
		downloadText$1(f.name, f.content, mime);
	}
	return {
		ok: true,
		method: "download",
		detail: `Downloaded ${files.length} files (File System Access API unavailable)`
	};
}
async function loadJsonFromPicker() {
	if (supportsFilePicker()) try {
		const file = await (await window.showOpenFilePicker({
			multiple: false,
			types: [{
				description: "Scientific snapshot JSON",
				accept: { "application/json": [".json"] }
			}]
		}))[0].getFile();
		return {
			ok: true,
			text: await file.text(),
			name: file.name,
			method: "fs-access"
		};
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return {
			ok: false,
			error: "File selection cancelled"
		};
	}
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json,application/json";
		input.style.display = "none";
		input.onchange = async () => {
			const file = input.files?.[0];
			input.remove();
			if (!file) {
				resolve({
					ok: false,
					error: "No file selected"
				});
				return;
			}
			try {
				resolve({
					ok: true,
					text: await file.text(),
					name: file.name,
					method: "upload"
				});
			} catch (e) {
				resolve({
					ok: false,
					error: e instanceof Error ? e.message : String(e)
				});
			}
		};
		input.oncancel = () => {
			input.remove();
			resolve({
				ok: false,
				error: "File selection cancelled"
			});
		};
		document.body.appendChild(input);
		input.click();
	});
}
function parseScientificSnapshot(text) {
	const data = JSON.parse(text);
	if (!data || typeof data !== "object") throw new Error("Invalid snapshot JSON");
	if (data.schema !== "moleculosphere5d.scientific_snapshot.v1" && data.schema !== "moleculosphere5d.scientific_snapshot.v1.1") {
		if (!("behavior" in data) || !("hendersonHasselbalch" in data)) throw new Error(`Unrecognized schema: ${String(data.schema)}`);
	}
	return data;
}
var tree = buildSphereTree(16);
function fieldFn(x, y, z) {
	return simEngine.potentialAt(x, y, z);
}
function buildSurfaceFor(id, nodes) {
	if (id == null) return null;
	const node = nodes.find((n) => n.id === id);
	if (!node) return null;
	return buildSurfaceTriangulation(node, true, fieldFn);
}
function buildConnectors(nodes, level1Ids, level2ByParent, expanded, showL2) {
	const ids = [...level1Ids];
	if (showL2) for (const pid of expanded) {
		const kids = level2ByParent.get(pid);
		if (kids) ids.push(...kids);
	}
	return buildNeighborConnectors(nodes, ids);
}
function switchFromEngine() {
	const e = simEngine.roiEnergy;
	const prot = simEngine.proteins[simEngine.focusedProteinIndex] ?? simEngine.proteins[0];
	return {
		switchDisplayOn: e?.switchDisplayOn ?? prot?.switchDisplayOn ?? false,
		switchOverride: e?.switchOverride ?? prot?.switchOverride ?? null,
		continuousScore: e?.continuousScore ?? prot?.continuousScore ?? 0,
		hisProtonationDisplay: prot?.hisProtonation ?? simEngine.hisTheta,
		hystHistory: [...simEngine.hystHistory],
		lastPhDirection: simEngine.lastPhDirection,
		lastCrossing: simEngine.lastCrossing,
		crossings: [...simEngine.crossings],
		sweepActive: simEngine.sweepActive,
		hystBandRegion: simEngine.hystBandRegion(),
		activeScenario: simEngine.activeScenario,
		scenarioBanner: simEngine.scenarioBanner ? { ...simEngine.scenarioBanner } : null
	};
}
function statsFromEngine() {
	const s = simEngine.behaviorStats;
	return {
		switchEvents: s.switchEvents,
		clampEvents: s.clampEvents,
		proximityEvents: s.proximityEvents,
		hhBinaryEvents: s.hhBinaryEvents,
		meanTriggerDistNm: s.triggerDistancesNm.length > 0 ? mean(s.triggerDistancesNm) : null,
		medianTriggerDistNm: s.triggerDistancesNm.length > 0 ? median(s.triggerDistancesNm) : null,
		meanResponseTimeNs: s.responseTimesNs?.length > 0 ? mean(s.responseTimesNs) : null,
		medianResponseTimeNs: s.responseTimesNs?.length > 0 ? median(s.responseTimesNs) : null
	};
}
var defaultSelected = tree.level2Ids[2] ?? tree.level1Ids[3] ?? null;
var expanded0 = tree.level1Ids.slice(0, 5);
function engineSlice() {
	return {
		pH: simEngine.pH,
		playing: simEngine.playing,
		timeNs: simEngine.timeNs,
		moleculeCount: simEngine.moleculeCount,
		debyeLength: simEngine.params.debyeLength,
		debyeNm: simEngine.params.debyeNm,
		regime: simEngine.params.regime,
		metalMode: simEngine.metalMode,
		ligand2Enabled: simEngine.ligand2Enabled,
		ligand2Count: simEngine.ligand2Count,
		ligand2ChargeScale: simEngine.ligand2ChargeScale,
		ligandBaseline: simEngine.ligandBaseline,
		peptideVariant: simEngine.peptideVariant,
		ligand3Enabled: simEngine.ligand3Enabled,
		ligand3Count: simEngine.ligand3Count,
		ligand4Enabled: simEngine.ligand4Enabled,
		ligand4Count: simEngine.ligand4Count,
		activeProgramme: simEngine.activeProgramme,
		respawnOnBinding: simEngine.respawnOnBinding,
		metalHisPrefFactor: simEngine.metalHisPrefFactor,
		metalHisPrefEnabled: simEngine.metalHisPrefEnabled,
		shortRangeWellEnabled: simEngine.shortRangeWellEnabled,
		shortRangeWellDepthKt: simEngine.shortRangeWellDepthKt,
		displayDurationSec: simEngine.displayDurationSec,
		receptorGeometry: simEngine.receptorGeometry,
		meanCharge: simEngine.meanCharge(),
		meanProteinResponse: simEngine.meanProteinResponse(),
		focusRequest: simEngine.focusRequest,
		roiFocused: simEngine.roiFocused,
		roiEnergy: simEngine.roiEnergy,
		trajectoryLen: simEngine.trajectory.length,
		scrubIndex: simEngine.scrubIndex,
		eventLogLen: simEngine.eventLog.length,
		eventRecording: simEngine.eventRecording,
		eventPlayback: simEngine.eventPlayback,
		eventScrub: simEngine.eventScrub,
		eventLabel: simEngine.eventLabel,
		eventTargetFrames: simEngine.eventTargetFrames,
		eventCap: simEngine.eventCap,
		eventFrame: simEngine.activeEventFrame,
		clampStart: simEngine.clampStart,
		clampEnd: simEngine.clampEnd,
		clampLoop: simEngine.clampLoop,
		tapeZoomLevel: simEngine.tapeZoomLevel,
		tapePanOffset: simEngine.tapePanOffset,
		clampCapturing: simEngine.clampCapturing,
		clampArmed: simEngine.clampArmed,
		clampAutoTrigger: simEngine.clampAutoTrigger,
		isClampEvent: simEngine.isClampEvent,
		clampFocusRequest: simEngine.clampFocusRequest,
		clampZoomLevel: simEngine.clampZoomLevel,
		hisPka: simEngine.hisPka,
		hisTheta: simEngine.hisTheta,
		debyeOverrideNm: simEngine.debyeOverrideNm,
		lastScientificJson: simEngine.lastScientificJson,
		lastRespawnFlash: simEngine.lastRespawnFlash ? { ...simEngine.lastRespawnFlash } : null,
		lastSnapshotJson: simEngine.lastSnapshotJson,
		showField: simEngine.showField,
		fieldOpacity: simEngine.fieldOpacity,
		showForceArrows: simEngine.showForceArrows,
		...switchFromEngine(),
		...statsFromEngine()
	};
}
var useSimStore = create((set, get) => ({
	...engineSlice(),
	showTriangulation: true,
	showConnectors: true,
	showL2: true,
	showProteins: true,
	selectedSphereId: defaultSelected,
	expandedParents: expanded0,
	nodes: tree.nodes,
	level1Ids: tree.level1Ids,
	level2ByParent: tree.level2ByParent,
	surface: buildSurfaceFor(defaultSelected, tree.nodes),
	connectors: buildConnectors(tree.nodes, tree.level1Ids, tree.level2ByParent, expanded0, true),
	fps: 0,
	speciesList: SPECIES,
	enabledKinds: {
		metal: true,
		peptide: true,
		generic: true
	},
	demoSpeed: .5,
	showPrivateNanotoxicity: false,
	lastProgrammeSummary: null,
	lastSnapshotAt: null,
	eventSeries: [],
	lastValiditySummary: null,
	validityProgress: null,
	setPH: (pH) => {
		simEngine.setPH(pH);
		set({ ...engineSlice() });
	},
	togglePlay: () => {
		simEngine.togglePlay();
		set({ playing: simEngine.playing });
	},
	setMoleculeCount: (n) => {
		simEngine.setMoleculeCount(n);
		set({ ...engineSlice() });
	},
	setShowTriangulation: (v) => set({ showTriangulation: v }),
	setShowConnectors: (v) => set({ showConnectors: v }),
	setShowField: (v) => {
		simEngine.setShowField(v);
		set({ showField: v });
	},
	setFieldOpacity: (a) => {
		simEngine.setFieldOpacity(a);
		set({ fieldOpacity: simEngine.fieldOpacity });
	},
	setShowL2: (v) => {
		set({ showL2: v });
		const s = get();
		set({ connectors: buildConnectors(s.nodes, s.level1Ids, s.level2ByParent, s.expandedParents, v) });
	},
	setShowProteins: (v) => set({ showProteins: v }),
	setShowForceArrows: (v) => {
		simEngine.setShowForceArrows(v);
		set({ showForceArrows: v });
	},
	setMetalMode: (mode) => {
		simEngine.setMetalMode(mode);
		set({ ...engineSlice() });
	},
	setKindEnabled: (kind, enabled) => {
		simEngine.setKindEnabled(String(kind), enabled);
		set({
			enabledKinds: {
				...get().enabledKinds,
				[kind]: enabled
			},
			...engineSlice()
		});
	},
	setLigand2Enabled: (v) => {
		simEngine.setLigand2Enabled(v);
		set({ ...engineSlice() });
	},
	setLigand2Count: (n) => {
		simEngine.setLigand2Count(n);
		set({ ...engineSlice() });
	},
	setLigand2ChargeScale: (n) => {
		simEngine.setLigand2ChargeScale(n);
		set({ ...engineSlice() });
	},
	setLigandBaseline: (mode) => {
		simEngine.setLigandBaseline(mode);
		set({ ...engineSlice() });
	},
	setPeptideVariant: (v) => {
		simEngine.setPeptideVariant(v);
		set({ ...engineSlice() });
	},
	setLigand3Enabled: (v) => {
		simEngine.setLigand3Enabled(v);
		set({ ...engineSlice() });
	},
	setLigand3Count: (n) => {
		simEngine.setLigand3Count(n);
		set({ ...engineSlice() });
	},
	setLigand4Enabled: (v) => {
		simEngine.setLigand4Enabled(v);
		set({ ...engineSlice() });
	},
	setLigand4Count: (n) => {
		simEngine.setLigand4Count(n);
		set({ ...engineSlice() });
	},
	applyProgrammeSetup: (programmeId, ligandSetId, receptorId, pH) => {
		simEngine.applyProgrammeSetup(programmeId, ligandSetId, receptorId, pH);
		set({
			...engineSlice(),
			activeProgramme: programmeId
		});
	},
	runProgrammeSuite: async (programmeId) => {
		const result = simEngine.runProgrammeSuite(programmeId, {
			frames: 200,
			replicates: 5,
			seed: 20260805,
			includeRamp: false
		});
		try {
			const a = document.createElement("a");
			a.href = URL.createObjectURL(new Blob([result.json], { type: "application/json" }));
			a.download = `programme_${programmeId}_${Date.now()}.json`;
			a.click();
			const a2 = document.createElement("a");
			a2.href = URL.createObjectURL(new Blob([result.csv], { type: "text/csv" }));
			a2.download = `programme_${programmeId}_${Date.now()}.csv`;
			a2.click();
		} catch {}
		set({
			lastProgrammeSummary: result.summary,
			...engineSlice()
		});
		return result.summary;
	},
	setRespawnOnBinding: (v) => {
		simEngine.setRespawnOnBinding(v);
		set({ respawnOnBinding: v });
	},
	setMetalHisPrefFactor: (n) => {
		simEngine.setMetalHisPrefFactor(n);
		set({ metalHisPrefFactor: n });
	},
	setMetalHisPrefEnabled: (v) => {
		simEngine.setMetalHisPrefEnabled(v);
		set({ metalHisPrefEnabled: v });
	},
	setShortRangeWellEnabled: (v) => {
		simEngine.setShortRangeWellEnabled(v);
		set({ ...engineSlice() });
	},
	setShortRangeWellDepthKt: (n) => {
		simEngine.setShortRangeWellDepthKt(n);
		set({ ...engineSlice() });
	},
	setDisplayDurationSec: (sec) => {
		const clamped = Math.max(5, Math.min(120, sec));
		simEngine.setDisplayDurationSec(clamped);
		set({ displayDurationSec: clamped });
	},
	setDemoSpeed: (mult) => {
		set({ demoSpeed: [
			.25,
			.5,
			1
		].reduce((best, x) => Math.abs(x - mult) < Math.abs(best - mult) ? x : best, .5) });
	},
	setShowPrivateNanotoxicity: (v) => {
		if (!v) simEngine.setLigand3Enabled(false);
		set({
			showPrivateNanotoxicity: v,
			...engineSlice()
		});
	},
	runPubMatrix: (opts) => {
		const r = simEngine.runPubMatrix(opts);
		try {
			const dl = (name, body, mime) => {
				const a = document.createElement("a");
				a.href = URL.createObjectURL(new Blob([body], { type: mime }));
				a.download = name;
				a.click();
			};
			dl("PUB_MATRIX_mean_sd.csv", r.csv, "text/csv");
			dl("PUB_MATRIX_ranking_per_receptor.csv", r.rankingCsv, "text/csv");
			dl("PUB_MATRIX_E_vs_F_Menkes.csv", r.eVsFCsv, "text/csv");
			dl("PUB_MATRIX.json", r.json, "application/json");
		} catch {}
		set({
			lastProgrammeSummary: r.summary,
			...engineSlice(),
			lastScientificJson: r.json
		});
		return r.summary;
	},
	runPubMatrixCuEF: (opts) => {
		const r = simEngine.runPubMatrixCuEF(opts);
		try {
			const dl = (name, body, mime) => {
				const a = document.createElement("a");
				a.href = URL.createObjectURL(new Blob([body], { type: mime }));
				a.download = name;
				a.click();
			};
			dl("PUB_MATRIX_Cu_E_F_mean_sd.csv", r.meanSdCsv, "text/csv");
			dl("PUB_MATRIX_Cu_E_vs_F_contrast.csv", r.contrastCsv, "text/csv");
			dl("PUB_MATRIX_ranking_E_F_with_Cu.csv", r.rankingEFCsv, "text/csv");
			dl("PUB_MATRIX_Cu_E_F.json", r.json, "application/json");
		} catch {}
		set({
			lastProgrammeSummary: r.summary,
			...engineSlice(),
			lastScientificJson: r.json
		});
		return r.summary;
	},
	runPubCombo: (opts) => {
		const r = simEngine.runPubCombo(opts);
		try {
			const dl = (name, body, mime) => {
				const a = document.createElement("a");
				a.href = URL.createObjectURL(new Blob([body], { type: mime }));
				a.download = name;
				a.click();
			};
			dl("PUB_COMBO_mean_sd.csv", r.csv, "text/csv");
			dl("PUB_COMBO_vs_exclusive.csv", r.vsExclusiveCsv, "text/csv");
			dl("PUB_COMBO.json", r.json, "application/json");
		} catch {}
		set({
			lastProgrammeSummary: r.summary,
			...engineSlice(),
			lastScientificJson: r.json
		});
		return r.summary;
	},
	runPubMatrixCuPbEF: (opts) => {
		return get().runPubMatrixCuEF(opts);
	},
	setReceptorGeometry: (id) => {
		simEngine.setReceptorGeometry(id);
		set({ ...engineSlice() });
	},
	exportRoiSnapshot: () => {
		const snap = simEngine.exportRoiSnapshot();
		if (snap) set({
			lastSnapshotJson: simEngine.lastSnapshotJson,
			lastSnapshotAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		return snap;
	},
	selectSphere: (id) => {
		const s = get();
		const node = id != null ? s.nodes.find((n) => n.id === id) : null;
		const expandedParents = new Set(s.expandedParents);
		if (node?.level === 1) expandedParents.add(node.id);
		if (node?.level === 2 && node.parentId != null) expandedParents.add(node.parentId);
		const exp = [...expandedParents];
		set({
			selectedSphereId: id,
			expandedParents: exp,
			surface: buildSurfaceFor(id, s.nodes),
			connectors: buildConnectors(s.nodes, s.level1Ids, s.level2ByParent, exp, s.showL2)
		});
	},
	reset: () => {
		simEngine.reset();
		set({ ...engineSlice() });
	},
	setScrubIndex: (i) => {
		simEngine.setScrubIndex(i);
		set({ scrubIndex: i });
	},
	setFps: (n) => set({ fps: n }),
	syncFromEngine: () => {
		set({ ...engineSlice() });
	},
	refreshSurfaceScalars: () => {
		const s = get();
		if (s.selectedSphereId != null) set({ surface: buildSurfaceFor(s.selectedSphereId, s.nodes) });
	},
	focusHisRoi: (index = 0) => {
		simEngine.focusHisRoi(index);
		set({ ...engineSlice() });
	},
	spawnNearRoi: (cls) => {
		simEngine.spawnNearRoi(cls);
		set({ ...engineSlice() });
	},
	toggleHisSwitch: (index = 0) => {
		simEngine.toggleHisSwitch(index);
		set({ ...engineSlice() });
	},
	toggleHisSite: (proteinIndex, siteIndex) => {
		simEngine.toggleHisSite(proteinIndex, siteIndex);
		set({ ...engineSlice() });
	},
	clearHisSwitchOverride: () => {
		simEngine.clearHisSwitchOverride();
		set({ ...engineSlice() });
	},
	startHysteresisSweep: () => {
		simEngine.startHysteresisSweep();
		set({ ...engineSlice() });
	},
	stopHysteresisSweep: () => {
		simEngine.stopHysteresisSweep();
		set({ ...engineSlice() });
	},
	clearHysteresisHistory: () => {
		simEngine.clearHysteresisHistory();
		set({ ...engineSlice() });
	},
	applyScenario: (id) => {
		simEngine.applyScenario(id);
		set({ ...engineSlice() });
	},
	startRecordEvent: () => {
		simEngine.startRecordEvent();
		set({ ...engineSlice() });
	},
	stopRecordEvent: () => {
		simEngine.stopRecordEvent();
		set({ ...engineSlice() });
	},
	clearEventLog: () => {
		simEngine.clearEventLog();
		set({ ...engineSlice() });
	},
	setEventScrub: (i) => {
		simEngine.setEventScrub(i);
		set({ ...engineSlice() });
	},
	toggleEventPlayback: () => {
		simEngine.toggleEventPlayback();
		set({ ...engineSlice() });
	},
	startClampCapture: (opts) => {
		simEngine.startClampCapture(opts);
		set({ ...engineSlice() });
	},
	setClampAutoTrigger: (v) => {
		simEngine.setClampAutoTrigger(v);
		set({ clampAutoTrigger: v });
	},
	setClampZoomLevel: (level) => {
		simEngine.setClampZoomLevel(level);
		set({ ...engineSlice() });
	},
	setClampWindow: (i0, i1) => {
		simEngine.setClampWindow(i0, i1);
		set({ ...engineSlice() });
	},
	setClampStart: (i) => {
		simEngine.setClampStart(i);
		set({ ...engineSlice() });
	},
	setClampEnd: (i) => {
		simEngine.setClampEnd(i);
		set({ ...engineSlice() });
	},
	clearClamp: () => {
		simEngine.clearClamp();
		set({ ...engineSlice() });
	},
	setClampLoop: (v) => {
		simEngine.setClampLoop(v);
		set({ ...engineSlice() });
	},
	fitClampToTape: () => {
		simEngine.fitClampToTape();
		set({ ...engineSlice() });
	},
	setTapeZoomLevel: (level) => {
		simEngine.setTapeZoomLevel(level);
		set({ ...engineSlice() });
	},
	panTapeBy: (frames) => {
		simEngine.panTapeBy(frames);
		set({ ...engineSlice() });
	},
	exportClampCsv: () => simEngine.exportClampCsv(),
	exportClampJson: () => simEngine.exportClampJson(),
	exportEventLogCsv: () => simEngine.exportEventLogCsv(),
	setDebyeNm: (nm) => {
		simEngine.setDebyeNm(nm);
		set({ ...engineSlice() });
	},
	clearDebyeOverride: () => {
		simEngine.clearDebyeOverride();
		set({ ...engineSlice() });
	},
	setHisPka: (pKa) => {
		simEngine.setHisPka(pKa);
		set({ ...engineSlice() });
	},
	resetBehaviorCounters: () => {
		simEngine.resetBehaviorCounters();
		set({ ...statsFromEngine() });
	},
	exportScientificSnapshot: () => {
		const snap = simEngine.exportScientificSnapshot();
		set({ lastScientificJson: simEngine.lastScientificJson });
		return snap;
	},
	exportScientificCsv: () => simEngine.exportScientificCsv(),
	saveScientificToFolder: async () => {
		const snap = simEngine.exportScientificSnapshot();
		if (!snap) return "No snapshot";
		const result = await saveScientificBundle({
			baseName: stampBaseName("scientific"),
			snapshotJson: JSON.stringify(snap, null, 2),
			snapshotCsv: simEngine.exportScientificCsv(),
			energySeriesCsv: simEngine.exportEnergySeriesCsv(),
			eventLogCsv: simEngine.exportBehaviorSamplesCsv()
		});
		if (result.ok) return `${result.method}: ${result.detail}`;
		return `Failed: ${"error" in result ? result.error : "unknown"}`;
	},
	loadScientificFromFolder: async () => {
		try {
			const loaded = await loadJsonFromPicker();
			if (!loaded.ok) return loaded.error;
			const snap = parseScientificSnapshot(loaded.text);
			if (!snap) return "Invalid snapshot JSON";
			simEngine.applyScientificSnapshot(snap);
			set({ ...engineSlice() });
			return "Snapshot loaded";
		} catch (e) {
			return String(e);
		}
	},
	runValiditySuite: (opts) => {
		try {
			set({ validityProgress: "Running…" });
			const summary = simEngine.runValiditySuite(opts).aggregates.map((a) => {
				const prot = a.protocol.kind === "fixed-pH" ? `pH ${a.protocol.pH}` : "ramp";
				return `${a.baselineId} | ${prot} | prox ${a.proximityEvents.mean.toFixed(1)}±${a.proximityEvents.sd.toFixed(1)} | |U| ${Math.abs(a.meanUPepHis.mean).toFixed(2)}`;
			}).join("\n") || "Validity suite complete";
			set({
				...engineSlice(),
				lastValiditySummary: summary,
				validityProgress: null
			});
			return summary;
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			set({
				validityProgress: null,
				lastValiditySummary: msg
			});
			return msg;
		}
	},
	regimeLabel: () => REGIME_META[get().regime]?.label ?? String(get().regime)
}));
/**
* Paper-ready table builders (client-side) — PUBLIC PACKAGE ONLY.
* Physics is never modified.
*/
var DISCLAIMER_LINE = "# " + PUBLICATION_DISCLAIMER + "\n# " + APP_VERSION_BANNER;
function downloadText(filename, content, mime = "text/csv") {
	const blob = new Blob([content], { type: mime });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	a.click();
	URL.revokeObjectURL(a.href);
}
function buildLockedParamsCsv() {
	const L = VALIDITY_LOCKED;
	return `${DISCLAIMER_LINE}\nlambda_D_nm,coulombK,cutoff_nm,friction,fCap,dt,frameNs,seed,proximity_rule,HH_binary_rule\n${[
		L.debyeNm,
		L.coulombK,
		L.forceCutoffNm,
		1.917.toFixed(3),
		16.2,
		.012,
		L.frameNs,
		L.baseSeed,
		`"d < ${L.proximityNm} nm, hold ≥ ${L.confirmFrames} frames"`,
		`"θ ≥ 0.5, hold ≥ ${L.confirmFrames} frames"`
	].join(",")}\n`;
}
function buildKernelValidationCsv() {
	return `${DISCLAIMER_LINE}\nr_nm,U_kT,F_abs_kT_per_nm,inside_cutoff\n${[
		"1.0,0.32948052,0.74133116,true",
		"3.1,0.00769919,0.01210760,true",
		"3.3,0.00000000,0.00000000,false"
	].join("\n")}\n`;
}
function buildReceptorsCsv() {
	const header = "letter,geometry_id,label,roi,titratable_His,character";
	const letters = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F"
	];
	return `${DISCLAIMER_LINE}\n${header}\n${RECEPTOR_GEOMETRY_ORDER.map((id, i) => {
		const m = RECEPTOR_GEOMETRIES[id];
		return [
			letters[i] ?? "?",
			id,
			m.label.replace(/,/g, ";"),
			m.roiLabel,
			m.titratableHis,
			m.character
		].join(",");
	}).join("\n")}\n`;
}
/** Public exclusive ligands only. */
function buildLigandsCsv() {
	return `${DISCLAIMER_LINE}\nid,name,engine_class,nominal_charge,role\n${[
		"L_HM_Pb,Pb2+,ligand1,+2,\"divalent heavy-metal ion (exclusive baseline)\"",
		"L_HM_Cu,Cu2+,ligand1,+2,\"divalent copper ion (Menkes E/F continuum contrast; q=+2)\"",
		"L_PB5,KSRRRAR,ligand2,+5,\"polybasic peptide FCS-like continuum proxy\"",
		"L_PB3,PRARR,ligand2,+3,\"intermediate polybasic peptide\"",
		"L_MB1,SLLRST,ligand2,+1,\"single-Arg continuum educational proxy — not a viral infectivity claim\""
	].join("\n")}\n`;
}
function buildPublicDisclosureTxt() {
	return [
		APP_VERSION_BANNER,
		"",
		PUBLICATION_DISCLAIMER,
		"",
		"Public continuum observables only — not MD, docking, or clinical prediction.",
		"Public ligands: Pb2+, Cu2+ (E/F Menkes scope), KSRRRAR, PRARR, SLLRST.",
		"Public receptors A–F; Cu2+ Menkes analysis uses E and F only.",
		"Private analyses are excluded from this public package."
	].join("\n");
}
/** Download paper table CSVs (client-side). Full figure package is prebuilt offline. */
function exportPaperAssetTables(opts) {
	opts?.multiRankingCsv;
	downloadText("tab_locked_params.csv", buildLockedParamsCsv());
	downloadText("tab_kernel_validation.csv", buildKernelValidationCsv());
	downloadText("tab_receptors.csv", buildReceptorsCsv());
	downloadText("tab_ligands.csv", buildLigandsCsv());
	downloadText("PUBLIC_DISCLAIMER.txt", buildPublicDisclosureTxt(), "text/plain");
	if (opts?.pubMatrixCsv) downloadText("tab_PUB_MATRIX.csv", opts.pubMatrixCsv);
	downloadText("paper_tables_README.txt", [
		APP_VERSION_BANNER,
		PUBLICATION_DISCLAIMER,
		"",
		"Paper tables downloaded (CSV) — public continuum package.",
		"Full figure package (PNG/PDF + captions) lives at:",
		"exports/validation_package_MoleculoSphere5D/paper_figures/"
	].join("\n"), "text/plain");
	return "Public paper table CSVs downloaded · " + APP_VERSION_BANNER;
}
function fmtE(v) {
	if (v == null || !Number.isFinite(v)) return "—";
	return v.toFixed(3);
}
function ToggleRow({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center justify-between gap-2 text-[10px] text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked),
			className: "size-3.5 accent-cyan-500"
		})]
	});
}
function ControlPanel() {
	const pH = useSimStore((s) => s.pH);
	const setPH = useSimStore((s) => s.setPH);
	const playing = useSimStore((s) => s.playing);
	const togglePlay = useSimStore((s) => s.togglePlay);
	const reset = useSimStore((s) => s.reset);
	const focusHisRoi = useSimStore((s) => s.focusHisRoi);
	const moleculeCount = useSimStore((s) => s.moleculeCount);
	const setMoleculeCount = useSimStore((s) => s.setMoleculeCount);
	const metalMode = useSimStore((s) => s.metalMode);
	const setMetalMode = useSimStore((s) => s.setMetalMode);
	const displayDurationSec = useSimStore((s) => s.displayDurationSec);
	const setDisplayDurationSec = useSimStore((s) => s.setDisplayDurationSec);
	const demoSpeed = useSimStore((s) => s.demoSpeed);
	const setDemoSpeed = useSimStore((s) => s.setDemoSpeed);
	const regime = useSimStore((s) => s.regime);
	const roiEnergy = useSimStore((s) => s.roiEnergy);
	const hisPka = useSimStore((s) => s.hisPka);
	const setHisPka = useSimStore((s) => s.setHisPka);
	const hisTheta = useSimStore((s) => s.hisTheta);
	const debyeNm = useSimStore((s) => s.debyeNm);
	const setDebyeNm = useSimStore((s) => s.setDebyeNm);
	const clearDebyeOverride = useSimStore((s) => s.clearDebyeOverride);
	const debyeOverrideNm = useSimStore((s) => s.debyeOverrideNm);
	const proximityEvents = useSimStore((s) => s.proximityEvents);
	const hhBinaryEvents = useSimStore((s) => s.hhBinaryEvents);
	const meanTriggerDistNm = useSimStore((s) => s.meanTriggerDistNm);
	const resetBehaviorCounters = useSimStore((s) => s.resetBehaviorCounters);
	const exportScientificSnapshot = useSimStore((s) => s.exportScientificSnapshot);
	const exportScientificCsv = useSimStore((s) => s.exportScientificCsv);
	const saveScientificToFolder = useSimStore((s) => s.saveScientificToFolder);
	const runValiditySuite = useSimStore((s) => s.runValiditySuite);
	const applyScenario = useSimStore((s) => s.applyScenario);
	const scenarioBanner = useSimStore((s) => s.scenarioBanner);
	const activeProgramme = useSimStore((s) => s.activeProgramme);
	const applyProgrammeSetup = useSimStore((s) => s.applyProgrammeSetup);
	const runProgrammeSuite = useSimStore((s) => s.runProgrammeSuite);
	const lastProgrammeSummary = useSimStore((s) => s.lastProgrammeSummary);
	const receptorGeometry = useSimStore((s) => s.receptorGeometry);
	const setReceptorGeometry = useSimStore((s) => s.setReceptorGeometry);
	const showL2 = useSimStore((s) => s.showL2);
	const setShowL2 = useSimStore((s) => s.setShowL2);
	const ligandBaseline = useSimStore((s) => s.ligandBaseline);
	const setLigandBaseline = useSimStore((s) => s.setLigandBaseline);
	const peptideVariant = useSimStore((s) => s.peptideVariant);
	const setPeptideVariant = useSimStore((s) => s.setPeptideVariant);
	const ligand2Count = useSimStore((s) => s.ligand2Count);
	const setLigand2Count = useSimStore((s) => s.setLigand2Count);
	const ligand2ChargeScale = useSimStore((s) => s.ligand2ChargeScale);
	const setLigand2ChargeScale = useSimStore((s) => s.setLigand2ChargeScale);
	const setLigand4Enabled = useSimStore((s) => s.setLigand4Enabled);
	const setLigand3Enabled = useSimStore((s) => s.setLigand3Enabled);
	const respawnOnBinding = useSimStore((s) => s.respawnOnBinding);
	const setRespawnOnBinding = useSimStore((s) => s.setRespawnOnBinding);
	const shortRangeWellEnabled = useSimStore((s) => s.shortRangeWellEnabled);
	const setShortRangeWellEnabled = useSimStore((s) => s.setShortRangeWellEnabled);
	const shortRangeWellDepthKt = useSimStore((s) => s.shortRangeWellDepthKt);
	const setShortRangeWellDepthKt = useSimStore((s) => s.setShortRangeWellDepthKt);
	const showProteins = useSimStore((s) => s.showProteins);
	const setShowProteins = useSimStore((s) => s.setShowProteins);
	const showForceArrows = useSimStore((s) => s.showForceArrows);
	const setShowForceArrows = useSimStore((s) => s.setShowForceArrows);
	const showField = useSimStore((s) => s.showField);
	const setShowField = useSimStore((s) => s.setShowField);
	const fieldOpacity = useSimStore((s) => s.fieldOpacity);
	const setFieldOpacity = useSimStore((s) => s.setFieldOpacity);
	const spawnNearRoi = useSimStore((s) => s.spawnNearRoi);
	const eventLogLen = useSimStore((s) => s.eventLogLen);
	const eventRecording = useSimStore((s) => s.eventRecording);
	const eventPlayback = useSimStore((s) => s.eventPlayback);
	const eventTargetFrames = useSimStore((s) => s.eventTargetFrames);
	const startRecordEvent = useSimStore((s) => s.startRecordEvent);
	const stopRecordEvent = useSimStore((s) => s.stopRecordEvent);
	const clearEventLog = useSimStore((s) => s.clearEventLog);
	const toggleEventPlayback = useSimStore((s) => s.toggleEventPlayback);
	const setEventScrub = useSimStore((s) => s.setEventScrub);
	const clampStart = useSimStore((s) => s.clampStart);
	const clampEnd = useSimStore((s) => s.clampEnd);
	const setClampStart = useSimStore((s) => s.setClampStart);
	const setClampEnd = useSimStore((s) => s.setClampEnd);
	const clearClamp = useSimStore((s) => s.clearClamp);
	const clampLoop = useSimStore((s) => s.clampLoop);
	const setClampLoop = useSimStore((s) => s.setClampLoop);
	const fitClampToTape = useSimStore((s) => s.fitClampToTape);
	const tapeZoomLevel = useSimStore((s) => s.tapeZoomLevel);
	const setTapeZoomLevel = useSimStore((s) => s.setTapeZoomLevel);
	const exportClampCsv = useSimStore((s) => s.exportClampCsv);
	const exportClampJson = useSimStore((s) => s.exportClampJson);
	const exportEventLogCsv = useSimStore((s) => s.exportEventLogCsv);
	const switchDisplayOn = useSimStore((s) => s.switchDisplayOn);
	const fps = useSimStore((s) => s.fps);
	const lastRespawnFlash = useSimStore((s) => s.lastRespawnFlash);
	const runPubMatrix = useSimStore((s) => s.runPubMatrix);
	const runPubMatrixCuEF = useSimStore((s) => s.runPubMatrixCuEF);
	const runPubCombo = useSimStore((s) => s.runPubCombo);
	const [ioMsg, setIoMsg] = (0, import_react.useState)(null);
	const [validityMsg, setValidityMsg] = (0, import_react.useState)(null);
	const pHColor = colorCss(pHToT(pH));
	const tPrime = timeAccelerationFactor(displayDurationSec);
	const recMeta = RECEPTOR_GEOMETRIES[receptorGeometry];
	(0, import_react.useEffect)(() => {
		setLigand4Enabled(false);
		setLigand3Enabled(false);
	}, [setLigand4Enabled, setLigand3Enabled]);
	const hm = resolveHeavyMetal(metalMode);
	const pbActive = ligandBaseline !== "ligand2" && hm !== "off";
	const pepActive = ligandBaseline !== "ligand1" && peptideVariant !== "off";
	const pepLabel = peptideVariant === "prarr" ? "PRARR" : peptideVariant === "sllrst" ? "SLLRST" : "KSRRRAR";
	const hmLabel = heavyMetalLabel(metalMode);
	const comboActive = pbActive && pepActive;
	const statusLine = [`${hmLabel} ${pbActive ? `×${moleculeCount}` : "absent"}`, pepActive ? ligandBaseline === "ligand2" ? `L2 ${pepLabel} ×${ligand2Count} exclusive` : comboActive ? `L2 ${pepLabel} ×${ligand2Count} · combo` : `L2 ${pepLabel} ×${ligand2Count}` : "peptide absent"].join(" · ");
	const uHmPep = Number(roiEnergy?.energyL1L2) || 0;
	const comboBadge = !comboActive ? null : uHmPep > .05 ? "Competitive" : uHmPep < -.05 ? "Cooperative" : "Neutral";
	/** Public HUD total = active public continuum terms only (no private channels). */
	const publicUTot = (() => {
		let tot = 0;
		if (pbActive) tot += Number(roiEnergy?.energyL1His) || 0;
		if (pepActive) tot += Number(roiEnergy?.energyL2His) || 0;
		if (comboActive) tot += uHmPep;
		return tot;
	})();
	const downloadValidationManifest = () => {
		const body = [
			APP_VERSION_BANNER,
			PUBLICATION_DISCLAIMER,
			"",
			"Frozen public validation package:",
			VALIDATION_PACKAGE_PATH + "/",
			"",
			"Key public CSVs:",
			"  PUB_COMBO_mean_sd.csv",
			"  PUB_COMBO_vs_exclusive.csv",
			"  PUB_MATRIX_mean_sd.csv",
			"  PUB_MATRIX_ranking_per_receptor.csv",
			"  PUB_MATRIX_E_vs_F_Menkes.csv",
			"  PUB_MATRIX_Cu_E_F_mean_sd.csv",
			"  PUB_MATRIX_Cu_E_vs_F_contrast.csv",
			"  PUB_MATRIX_ranking_E_F_with_Cu.csv",
			"  ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv",
			"  peptide3_furin_baselines_mean_sd.csv",
			"  paper_tables/",
			"  paper_figures/",
			"",
			"Primary metric: U_L–ROI = mean continuum Yukawa energy of exclusive ligand L at the receptor ROI (kT).",
			"Combo: U_HM–pep = pairwise HM–peptide continuum term near ROI; Competitive if >0, Cooperative if <0.",
			"Charges are formal / HH (chargeSource: formal). DFT may refine offline — no live quantum solver.",
			"Private analyses are excluded from this public package.",
			"Not MD, docking, coordination chemistry, or a biological claim."
		].join("\n");
		const a = document.createElement("a");
		a.href = URL.createObjectURL(new Blob([body], { type: "text/plain" }));
		a.download = "MoleculoSphere5D_Beta_v1.1_public_validation_paths.txt";
		a.click();
		setIoMsg("Validation package path list downloaded");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "panel-scroll flex max-h-full w-full flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-panel/95 p-3.5 shadow-xl backdrop-blur-sm md:w-[340px] lg:w-[360px]",
		"aria-label": "Simulation controls",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-wide text-muted uppercase",
						children: "Hierarchical 5D electrostatics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-semibold tracking-tight text-fg",
						children: APP_VERSION_BANNER
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted",
						children: APP_SUBTITLE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] leading-snug text-subtle",
						children: PUBLICATION_DISCLAIMER
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-1.5 rounded-lg border border-cyan-500/25 bg-cyan-950/20 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
							className: "size-4 text-cyan-300",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Quick start"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal space-y-1 pl-4 text-[9px] leading-relaxed text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Pick receptor A–F. Exclusive ligand or combo: Both = one HM + one peptide." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Set pH; Play — U_L–ROI (and U_HM–pep in combo) are continuum Yukawa energies (kT)." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Event tape records proximity + HH-binary frames (demo speed OK)." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Export · public writes only public ligands/columns. Frozen CSVs live under",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: VALIDATION_PACKAGE_PATH
								}),
								"."
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-muted",
						children: [
							"Public ligands: ",
							PUBLIC_LIGANDS.join(" · "),
							". Not MD / docking / clinical."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: downloadValidationManifest,
						className: "w-full rounded-md border border-cyan-400/40 bg-cyan-950/30 px-2 py-1.5 text-[10px] text-cyan-100",
						children: "Download public validation path list"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-border bg-surface/70 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
								className: "size-4 text-cyan-300",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: "Transport"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-[10px] tabular text-muted",
								children: [fps, " fps"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: togglePlay,
								className: "inline-flex items-center gap-1 rounded-md border border-cyan-400/40 bg-cyan-950/30 px-2 py-1.5 text-[11px] text-cyan-100",
								children: [playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }), playing ? "Pause" : "Play"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: reset,
								className: "inline-flex items-center gap-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-[11px] text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Reset scene"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => focusHisRoi(),
								className: "inline-flex items-center gap-1 rounded-md border border-border bg-elevated px-2 py-1.5 text-[11px] text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Focus, { className: "size-3.5" }), " Focus ROI"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "pH"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-fg",
							style: { color: pHColor },
							children: [
								pH.toFixed(2),
								" ·",
								" ",
								REGIME_META[regime]?.label ?? regime
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 1.5,
						max: 10.5,
						step: .05,
						value: [pH],
						onValueChange: (v) => setPH(v[0] ?? 7.4),
						"aria-label": "pH"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Display duration (s)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-fg",
								children: [
									displayDurationSec.toFixed(0),
									" · t′ ×",
									tPrime.toFixed(2)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 5,
							max: 120,
							step: 1,
							value: [displayDurationSec],
							onValueChange: (v) => setDisplayDurationSec(v[0] ?? 10),
							"aria-label": "Display duration"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 flex flex-wrap gap-1",
							children: DISPLAY_DURATION_PRESETS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDisplayDurationSec(s),
								className: ["rounded border px-1.5 py-0.5 text-[9px]", displayDurationSec === s ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100" : "border-border bg-surface text-muted"].join(" "),
								children: [s, "s"]
							}, s))
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Demo speed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular text-fg",
								children: ["×", demoSpeed]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								.25,
								.5,
								1
							].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setDemoSpeed(m),
								className: ["rounded border px-2 py-1 text-[10px]", demoSpeed === m ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100" : "border-border bg-surface text-muted"].join(" "),
								children: ["×", m]
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[9px] text-subtle",
							children: "Scales live integrator presentation only — locked batch/export dt unchanged."
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-1.5 rounded-lg border border-border bg-surface/70 p-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium text-fg",
							children: "Energy HUD (kT)"
						}), comboBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: ["rounded border px-1.5 py-0.5 text-[9px] font-medium", comboBadge === "Competitive" ? "border-amber-400/50 bg-amber-950/40 text-amber-100" : comboBadge === "Cooperative" ? "border-emerald-400/50 bg-emerald-950/40 text-emerald-100" : "border-border bg-surface text-muted"].join(" "),
							title: "Educational continuum label from sign of U_HM–pep only — not a biological claim",
							children: comboBadge
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5 font-mono text-[10px]",
						children: [
							pbActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "U_HM–ROI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: fmtE(roiEnergy?.energyL1His)
								})]
							}),
							pepActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "U_pep–ROI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: fmtE(roiEnergy?.energyL2His)
								})]
							}),
							comboActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "U_HM–pep"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: fmtE(uHmPep)
								})]
							}),
							(pbActive || pepActive) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-t border-border/60 pt-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "U_tot"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: fmtE(publicUTot)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-subtle",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "His θ / switch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular",
									children: [
										hisTheta.toFixed(2),
										" · ",
										switchDisplayOn ? "ON" : "OFF"
									]
								})]
							})
						]
					}),
					comboActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[8px] leading-snug text-subtle",
						children: "Combo mode: Competitive if U_HM–pep positive · Cooperative if negative (continuum only)."
					}),
					!pbActive && !pepActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-subtle",
						children: "No public ligand active — enable Pb²⁺/Cu²⁺ or a peptide (or Both) to see U_L–ROI rows."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-emerald-500/25 bg-emerald-950/15 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4 text-emerald-300",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Scientific data"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-1 text-[10px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-border bg-surface/50 px-1.5 py-1",
								children: ["Prox events: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: proximityEvents
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-border bg-surface/50 px-1.5 py-1",
								children: ["HH events: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-fg",
									children: hhBinaryEvents
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 rounded border border-border bg-surface/50 px-1.5 py-1",
								children: [
									"Mean trigger d:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular text-fg",
										children: meanTriggerDistNm != null && meanTriggerDistNm > 0 ? `${meanTriggerDistNm.toFixed(2)} nm` : "—"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									resetBehaviorCounters();
									setIoMsg("Counters reset");
								},
								className: "rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted",
								children: "Reset counters"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									exportScientificSnapshot();
									setIoMsg("Scientific snapshot exported");
								},
								className: "rounded border border-emerald-400/40 bg-emerald-950/30 px-2 py-1 text-[10px] text-emerald-100",
								children: "Export JSON"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const csv = exportScientificCsv();
									const a = document.createElement("a");
									a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
									a.download = "scientific_snapshot_public.csv";
									a.click();
									setIoMsg("Scientific CSV exported");
								},
								className: "rounded border border-emerald-400/40 bg-emerald-950/30 px-2 py-1 text-[10px] text-emerald-100",
								children: "Export CSV"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: async () => {
									try {
										const msg = await saveScientificToFolder();
										setIoMsg(msg);
									} catch (e) {
										setIoMsg(String(e));
									}
								},
								className: "inline-flex items-center gap-1 rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " Save folder"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const msg = exportPaperAssetTables();
									setIoMsg(msg);
								},
								className: "rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted",
								children: "Paper tables · public"
							})
						]
					}),
					ioMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-subtle",
						children: ioMsg
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-subtle",
						children: [
							"Suite exports write public columns only. Private analyses are excluded from this public package. Frozen package:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: VALIDATION_PACKAGE_PATH
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setValidityMsg("Running kernel validity suite…");
							try {
								const summary = runValiditySuite();
								setValidityMsg(summary);
							} catch (e) {
								setValidityMsg(String(e));
							}
						},
						className: "w-full rounded-md border border-border bg-elevated px-2 py-1.5 text-[10px] text-fg",
						children: "Run kernel validity suite"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setValidityMsg("Running P5 peptide baselines…");
							try {
								const r = window.__simEngine.runPeptide3FurinBaselines({
									nMolecules: 20,
									frames: 200,
									replicates: 5
								});
								const dl = (name, body, mime) => {
									const a = document.createElement("a");
									a.href = URL.createObjectURL(new Blob([body], { type: mime }));
									a.download = name;
									a.click();
								};
								dl("peptide3_furin_baselines_mean_sd.csv", r.csv, "text/csv");
								dl("ranking_KSRRRAR_vs_PRARR_vs_SLLRST.csv", r.rankingCsv, "text/csv");
								dl("peptide3_furin_baselines.json", r.json, "application/json");
								setValidityMsg(r.summary);
							} catch (e) {
								setValidityMsg(String(e));
							}
						},
						className: "w-full rounded-md border border-violet-400/40 bg-violet-950/30 px-2 py-1.5 text-[10px] text-violet-100",
						children: "Run suite + export · public (P5 peptides)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setValidityMsg("Running public PUB_MATRIX (A–F × Pb + peptides × 3 pH)…");
							try {
								const summary = runPubMatrix({
									nMolecules: 20,
									frames: 150,
									replicates: 5
								});
								setValidityMsg(summary);
							} catch (e) {
								setValidityMsg(String(e));
							}
						},
						className: "w-full rounded-md border border-emerald-400/40 bg-emerald-950/30 px-2 py-1.5 text-[10px] text-emerald-100",
						children: "Run suite + export · public (A–F)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setValidityMsg("Running Cu²⁺ Menkes E/F suite…");
							try {
								const summary = runPubMatrixCuEF({
									nMolecules: 20,
									frames: 150,
									replicates: 5
								});
								setValidityMsg(summary);
							} catch (e) {
								setValidityMsg(String(e));
							}
						},
						className: "w-full rounded-md border border-amber-400/40 bg-amber-950/30 px-2 py-1.5 text-[10px] text-amber-100",
						children: "Run suite + export · public (Cu · E/F)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setValidityMsg("Running PUB_COMBO v1.1 (B/E/F × HM+peptide × 3 pH)…");
							try {
								const summary = runPubCombo({
									nMolecules: 12,
									frames: 120,
									replicates: 5
								});
								setValidityMsg(summary);
							} catch (e) {
								setValidityMsg(String(e));
							}
						},
						className: "w-full rounded-md border border-fuchsia-400/40 bg-fuchsia-950/30 px-2 py-1.5 text-[10px] text-fuchsia-100",
						children: "Run suite + export · public (COMBO L1+L2)"
					}),
					validityMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-[9px] text-muted",
						children: validityMsg
					}),
					lastProgrammeSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-[9px] text-subtle",
						children: lastProgrammeSummary
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-border bg-surface/70 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Scenario presets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-subtle",
						children: "Sets pH (and His θ) only — ligands, receptor, respawn, and camera stay as-is."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: SCENARIO_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: SCENARIOS[id].blurb,
							onClick: () => applyScenario(id),
							className: "rounded-md border border-border bg-elevated px-2 py-1.5 text-[10px] text-fg hover:bg-panel",
							children: SCENARIOS[id].label
						}, id))
					}),
					scenarioBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-subtle",
						children: [
							scenarioBanner.label,
							" · pH ",
							scenarioBanner.pH.toFixed(2),
							" (pH only)"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-fuchsia-500/25 bg-fuchsia-950/15 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Beaker, {
							className: "size-4 text-fuchsia-300",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Experimental programmes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] leading-relaxed text-subtle",
						children: "Public continuum programmes only (λ_D 0.8 nm, coulombK 1.15). Exports mean±sd · public columns only. Private analyses are excluded from this public package."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: visibleProgrammeOrder().map((id) => {
							const prog = PROGRAMMES[id];
							const sets = prog.ligandSets.slice(0, 4);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: ["rounded-md border p-2", activeProgramme === id ? "border-fuchsia-400/40 bg-fuchsia-950/30" : "border-border bg-surface/40"].join(" "),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-medium text-fg",
										children: prog.shortLabel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-1 text-[8px] leading-snug text-subtle",
										children: prog.note
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1",
										children: [sets.map((set) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => applyProgrammeSetup(id, set.id, prog.receptors[0]),
											className: "rounded border border-border bg-elevated px-1.5 py-0.5 text-[9px] text-muted hover:text-fg",
											children: ["Load ", set.label]
										}, set.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: async () => {
												setValidityMsg(`Running ${prog.shortLabel}…`);
												try {
													const summary = await runProgrammeSuite(id);
													setValidityMsg(summary);
												} catch (e) {
													setValidityMsg(String(e));
												}
											},
											className: "rounded border border-fuchsia-400/40 bg-fuchsia-950/30 px-1.5 py-0.5 text-[9px] text-fuchsia-100",
											children: "Run suite"
										})]
									})
								]
							}, id);
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-border bg-surface/70 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Receptor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: RECEPTOR_GEOMETRY_ORDER.map((id) => {
							const m = RECEPTOR_GEOMETRIES[id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: m.label,
								onClick: () => setReceptorGeometry(id),
								className: ["rounded border px-1.5 py-1 text-[9px]", receptorGeometry === id ? "border-teal-400/50 bg-teal-950/40 text-teal-100" : "border-border bg-surface text-muted"].join(" "),
								children: m.shortLabel
							}, id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-subtle",
						children: [
							recMeta?.label,
							" · ROI ",
							recMeta?.roiLabel
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-border bg-surface/70 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Ligands · public (exclusive or combo)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: [
							["both", "Both"],
							["ligand1", "L1 only"],
							["ligand2", "L2 only"]
						].map(([mode, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLigandBaseline(mode),
							className: ["rounded border px-1.5 py-1 text-[9px]", ligandBaseline === mode ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100" : "border-border bg-surface text-muted"].join(" "),
							children: lab
						}, mode))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 rounded border border-border bg-elevated/40 p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-fg",
								children: "L1 · Heavy metal (+2)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: HEAVY_METAL_UI_ORDER.map((mode) => {
									const lab = mode === "pb" ? "Pb²⁺" : mode === "cu" ? "Cu²⁺" : "Off";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: ligandBaseline === "ligand2" && mode !== "off",
										onClick: () => setMetalMode(mode),
										className: ["rounded border px-1.5 py-1 text-[9px]", hm === mode ? "border-amber-400/50 bg-amber-950/40 text-amber-100" : "border-border bg-surface text-muted"].join(" "),
										children: lab
									}, mode);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] leading-snug text-subtle",
								children: "Hard exclusive L1 identity — Pb²⁺ or Cu²⁺ (q = +2). Cu Menkes analysis uses receptors E/F only."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Count"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: pbActive ? moleculeCount : 0
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 0,
								max: 50,
								step: 1,
								value: [pbActive ? moleculeCount : 0],
								onValueChange: (v) => setMoleculeCount(v[0] ?? 0),
								disabled: !pbActive,
								"aria-label": "Heavy metal count"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 rounded border border-border bg-elevated/40 p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium text-fg",
								children: "L2 · Peptide"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: [
									[
										"ksrrrar",
										"KSRRRAR (+5)",
										"Polybasic FCS-like continuum proxy"
									],
									[
										"prarr",
										"PRARR (+3)",
										"Intermediate polybasic peptide"
									],
									[
										"sllrst",
										"SLLRST (+1, single-Arg)",
										"Continuum single-Arg educational contrast — not a viral infectivity claim."
									],
									[
										"off",
										"Off",
										"No L2 peptide"
									]
								].map(([v, lab, tip]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									title: tip,
									disabled: ligandBaseline === "ligand1" && v !== "off",
									onClick: () => setPeptideVariant(v),
									className: ["rounded border px-1.5 py-1 text-[9px]", peptideVariant === v ? "border-violet-400/50 bg-violet-950/40 text-violet-100" : "border-border bg-surface text-muted"].join(" "),
									children: lab
								}, v))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Count"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: pepActive ? ligand2Count : 0
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: 0,
								max: 50,
								step: 1,
								value: [pepActive ? ligand2Count : 0],
								onValueChange: (v) => setLigand2Count(v[0] ?? 0),
								disabled: !pepActive,
								"aria-label": "Peptide count"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Charge scale"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular",
									children: ligand2ChargeScale.toFixed(2)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								min: .5,
								max: 1.5,
								step: .05,
								value: [ligand2ChargeScale],
								onValueChange: (v) => setLigand2ChargeScale(v[0] ?? 1),
								disabled: !pepActive,
								"aria-label": "Peptide charge scale"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Show L2 beads",
								checked: showL2,
								onChange: setShowL2
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Respawn on proximity",
						checked: respawnOnBinding,
						onChange: setRespawnOnBinding
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] leading-snug text-subtle",
						children: "When ON: after a proximity event (d ≤ 1.0 nm, hold ≥3), that ligand is removed and respawned in the outer shell. Default OFF for pure energy ranking."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded border border-border bg-elevated/50 px-2 py-1.5 text-[9px] text-muted",
						children: [
							"Active: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: statusLine
							}),
							" · ",
							"prox events:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular text-fg",
								children: proximityEvents
							})
						]
					}),
					lastRespawnFlash && lastRespawnFlash.ticksLeft > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "rounded border border-cyan-400/40 bg-cyan-950/40 px-2 py-1 text-[10px] text-cyan-100",
						children: [
							"respawned ",
							lastRespawnFlash.ligandClass,
							" ·",
							" ",
							lastRespawnFlash.oldDistNm.toFixed(2),
							"→",
							lastRespawnFlash.newDistNm.toFixed(2),
							" nm"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => spawnNearRoi("ligand1"),
							disabled: !pbActive,
							className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted hover:text-fg disabled:opacity-40",
							children: [
								"Spawn ",
								hmLabel === "off" ? "HM" : hmLabel,
								" near ROI"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => spawnNearRoi("ligand2"),
							disabled: !pepActive,
							className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted hover:text-fg disabled:opacity-40",
							children: "Spawn peptide near ROI"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-border bg-surface/70 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Display & continuum knobs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Show proteins",
						checked: showProteins,
						onChange: setShowProteins
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Force arrows",
						checked: showForceArrows,
						onChange: setShowForceArrows
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Field slice",
						checked: showField,
						onChange: setShowField
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Field opacity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular",
							children: fieldOpacity.toFixed(2)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: .05,
						max: 1,
						step: .05,
						value: [fieldOpacity],
						onValueChange: (v) => setFieldOpacity(v[0] ?? .5),
						disabled: !showField,
						"aria-label": "Field opacity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
						label: "Short-range well (off under validity lock)",
						checked: shortRangeWellEnabled,
						onChange: setShortRangeWellEnabled
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Well depth kT"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular",
							children: shortRangeWellDepthKt.toFixed(1)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 0,
						max: 8,
						step: .1,
						value: [shortRangeWellDepthKt],
						onValueChange: (v) => setShortRangeWellDepthKt(v[0] ?? 3),
						disabled: !shortRangeWellEnabled,
						"aria-label": "Short range well depth"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: ["λ_D (nm)", debyeOverrideNm != null ? " · override" : " · auto"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular",
							children: debyeNm.toFixed(2)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: .3,
						max: 2.5,
						step: .05,
						value: [debyeNm],
						onValueChange: (v) => setDebyeNm(v[0] ?? .8),
						"aria-label": "Debye length"
					}),
					debyeOverrideNm != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: clearDebyeOverride,
						className: "text-[9px] text-muted underline",
						children: "Clear λ_D override"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-[10px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "His pKa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular",
							children: hisPka.toFixed(2)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 4,
						max: 8,
						step: .05,
						value: [hisPka],
						onValueChange: (v) => setHisPka(v[0] ?? 6.2),
						"aria-label": "His pKa"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-lg border border-cyan-500/25 bg-cyan-950/15 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: "Event capture"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-subtle",
						children: [
							"Record continuum frames (cap ",
							500,
							"). Clamp rulers on tape; zoom crops viewport only. Surgical control changes do not full-reseed."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => eventRecording ? stopRecordEvent() : startRecordEvent(),
								className: ["rounded border px-2 py-1 text-[10px]", eventRecording ? "border-rose-400/50 bg-rose-950/40 text-rose-100" : "border-cyan-400/40 bg-cyan-950/30 text-cyan-100"].join(" "),
								children: eventRecording ? "Stop record" : "Record"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: clearEventLog,
								className: "rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted",
								children: "Clear"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: toggleEventPlayback,
								disabled: !eventLogLen,
								className: "rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted disabled:opacity-40",
								children: eventPlayback ? "Pause tape" : "Play tape"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const csv = exportEventLogCsv();
									const a = document.createElement("a");
									a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
									a.download = "event_log_public.csv";
									a.click();
								},
								disabled: !eventLogLen,
								className: "rounded border border-border bg-surface px-2 py-1 text-[10px] text-muted disabled:opacity-40",
								children: "Export tape CSV"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-muted",
						children: [
							"Frames ",
							eventLogLen,
							eventTargetFrames ? ` / ${eventTargetFrames}` : "",
							" · ",
							100,
							" ns/frame"
						]
					}),
					eventLogLen > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 flex justify-between text-[10px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Scrub"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: 0,
						max: Math.max(0, eventLogLen - 1),
						step: 1,
						value: [0],
						onValueChange: (v) => setEventScrub(v[0] ?? 0),
						"aria-label": "Event scrub"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setClampStart(0),
								disabled: !eventLogLen,
								className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted disabled:opacity-40",
								children: "Clamp start"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setClampEnd(Math.max(0, eventLogLen - 1)),
								disabled: !eventLogLen,
								className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted disabled:opacity-40",
								children: "Clamp end"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: fitClampToTape,
								disabled: !eventLogLen,
								className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted disabled:opacity-40",
								children: "Fit clamp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: clearClamp,
								className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted",
								children: "Clear clamp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Loop clamp",
								checked: clampLoop,
								onChange: setClampLoop
							})
						]
					}),
					(clampStart != null || clampEnd != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-subtle",
						children: [
							"Clamp [",
							clampStart ?? "—",
							", ",
							clampEnd ?? "—",
							"]"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const csv = exportClampCsv();
								const a = document.createElement("a");
								a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
								a.download = "clamp_window_public.csv";
								a.click();
							},
							className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted",
							children: "Export clamp CSV"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const json = exportClampJson();
								const a = document.createElement("a");
								a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
								a.download = "clamp_window_public.json";
								a.click();
							},
							className: "rounded border border-border bg-surface px-1.5 py-1 text-[9px] text-muted",
							children: "Export clamp JSON"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-[10px] text-muted",
						children: "Tape zoom"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: CLAMP_ZOOM_LEVELS.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !eventLogLen,
							onClick: () => setTapeZoomLevel(z),
							className: ["rounded border px-1.5 py-0.5 text-[9px] disabled:opacity-40", tapeZoomLevel === z ? "border-cyan-400/50 bg-cyan-950/40 text-cyan-100" : "border-border bg-surface text-muted"].join(" "),
							children: CLAMP_ZOOM_LABELS[z]
						}, z))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[9px] leading-relaxed text-subtle",
				children: PUBLICATION_DISCLAIMER
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[8px] text-muted",
				children: APP_VERSION_BANNER
			})
		]
	});
}
function DomainShell() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
		DOMAIN_RADIUS,
		48,
		36
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		color: "#0c1018",
		transparent: true,
		opacity: .35,
		side: 1,
		depthWrite: false
	})] });
}
function DomainWire() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
		DOMAIN_RADIUS * .998,
		32,
		24
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		color: "#1e293b",
		wireframe: true,
		transparent: true,
		opacity: .18
	})] });
}
function HierarchySpheres() {
	const nodes = useSimStore((s) => s.nodes);
	const level1Ids = useSimStore((s) => s.level1Ids);
	const level2ByParent = useSimStore((s) => s.level2ByParent);
	const expanded = useSimStore((s) => s.expandedParents);
	const showL2 = useSimStore((s) => s.showL2);
	const selectSphere = useSimStore((s) => s.selectSphere);
	const selectedId = useSimStore((s) => s.selectedSphereId);
	const showTriangulation = useSimStore((s) => s.showTriangulation);
	const surface = useSimStore((s) => s.surface);
	const showConnectors = useSimStore((s) => s.showConnectors);
	const connectors = useSimStore((s) => s.connectors);
	const activeIds = (0, import_react.useMemo)(() => {
		const ids = [...level1Ids];
		if (showL2) for (const pid of expanded) {
			const kids = level2ByParent.get(pid);
			if (kids) ids.push(...kids);
		}
		return ids;
	}, [
		level1Ids,
		level2ByParent,
		expanded,
		showL2
	]);
	const nodeById = (0, import_react.useMemo)(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		activeIds.map((id) => {
			const n = nodeById.get(id);
			if (!n) return null;
			const sel = selectedId === id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					n.x,
					n.y,
					n.z
				],
				scale: n.radius,
				onClick: (e) => {
					e.stopPropagation();
					selectSphere(id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1,
					20,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: sel ? "#64748b" : "#1e293b",
					transparent: true,
					opacity: sel ? .35 : .14,
					roughness: .7,
					metalness: .05,
					depthWrite: false
				})]
			}, id);
		}),
		showConnectors && connectors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("lineSegments", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferGeometry", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferAttribute", {
			attach: "attributes-position",
			args: [c.positions, 3]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
			color: "#334155",
			transparent: true,
			opacity: .35
		})] }, `c-${i}`)),
		showTriangulation && surface && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("bufferGeometry", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferAttribute", {
			attach: "attributes-position",
			args: [surface.positions, 3]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("bufferAttribute", {
			attach: "index",
			args: [surface.indices, 1]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#475569",
			transparent: true,
			opacity: .22,
			wireframe: true,
			side: 2
		})] })
	] });
}
function particleColor(p) {
	const sp = SPECIES.find((s) => s.id === p.speciesId);
	if (sp?.accentRgb) return sp.accentRgb;
	if (p.ligandClass === "ligand1" || p.kind === "pb" || p.kind === "cu" || p.kind === "metal") {
		if (p.speciesId === "cu-ion" || p.kind === "cu") return [
			.72,
			.45,
			.2
		];
		return [
			.22,
			.22,
			.26
		];
	}
	if (p.ligandClass === "ligand4" || p.kind === "ach") return [
		.13,
		.83,
		.93
	];
	const [r, g, b] = divergingRedWhiteBlue(chargeToT(p.q, 5));
	return [
		r,
		g,
		b
	];
}
function ParticlesView() {
	const eventFrame = useSimStore((s) => s.eventFrame);
	const eventScrub = useSimStore((s) => s.eventScrub);
	const eventPlayback = useSimStore((s) => s.eventPlayback);
	const [tick, setTick] = (0, import_react.useState)(0);
	useFrame(() => setTick((t) => (t + 1) % 1e6));
	const particles = (eventScrub != null || eventPlayback) && eventFrame != null && eventFrame.particles.length > 0 ? eventFrame.particles : simEngine.particles;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: particles.map((p) => {
		const x = p.x;
		const y = p.y;
		const z = p.z;
		const ox = p.ox;
		const oy = p.oy;
		const oz = p.oz;
		const q = p.q;
		const sp = SPECIES.find((s) => s.id === p.speciesId);
		const beads = sp?.beads ?? 1;
		const spacing = sp?.beadSpacing ?? 0;
		const [cr, cg, cb] = particleColor({
			...p,
			q
		});
		const r = sp?.radius ?? .05;
		if (beads <= 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				y,
				z
			],
			scale: r,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				1,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: new Color(cr, cg, cb),
				roughness: p.ligandClass === "ligand1" ? .25 : .45,
				metalness: p.ligandClass === "ligand1" ? .85 : .15
			})]
		}, p.id);
		const chain = [];
		const len = (beads - 1) * spacing;
		const hx = ox || 1;
		const hy = oy || 0;
		const hz = oz || 0;
		const hn = Math.hypot(hx, hy, hz) || 1;
		const ux = hx / hn;
		const uy = hy / hn;
		const uz = hz / hn;
		for (let i = 0; i < beads; i++) {
			const t = i * spacing - len * .5;
			chain.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					x + ux * t,
					y + uy * t,
					z + uz * t
				],
				scale: r * (i === 0 || i === beads - 1 ? 1.05 : .92),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1,
					10,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: new Color(cr, cg, cb),
					roughness: .45,
					metalness: .15
				})]
			}, `${p.id}-${i}`));
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: chain }, p.id);
	}) });
}
function ProteinProxies() {
	const show = useSimStore((s) => s.showProteins);
	const roiFocused = useSimStore((s) => s.roiFocused);
	const eventFrame = useSimStore((s) => s.eventFrame);
	const toggleHisSwitch = useSimStore((s) => s.toggleHisSwitch);
	const sparse = !useSimStore((s) => s.showL2);
	const [tick, setTick] = (0, import_react.useState)(0);
	useFrame(() => setTick((t) => (t + 1) % 1e5));
	if (!show) return null;
	const proteins = simEngine.proteins;
	const focused = simEngine.focusedProteinIndex;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: proteins.map((prot, pi) => {
		const useEvent = Boolean(pi === focused && eventFrame);
		const hisCharge = useEvent && eventFrame ? eventFrame.hisCharge : prot.hisCharge;
		const hisOn = useEvent && eventFrame ? eventFrame.switchDisplayOn : prot.switchDisplayOn;
		const body = proteinBodyColor(prot.stressTint, hisCharge, hisOn, prot.clickPulse);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [prot.beads.map((bead, bi) => {
			if (sparse) {
				if (!(bead.isHisRoi || bead.morph === "his" || bead.morph === "asp" || bead.morph === "ser" || bead.morph === "canyon" || bead.morph === "jawA" || bead.morph === "jawB")) return null;
				if (bead.morph === "canyon" && prot.geometryId !== "furin" && bi % 2 === 1) return null;
			}
			const w = beadWorldPos(prot, bead);
			if (bead.isHisRoi && bead.hisIndex >= 0) {
				const site = prot.hisSites[bead.hisIndex];
				const on = useEvent && eventFrame ? eventFrame.switchDisplayOn : site?.switchDisplayOn ?? false;
				const role = site?.role ?? bead.hisRole ?? "generic";
				const col = hisRoiColor(useEvent && eventFrame ? eventFrame.hisProtonation : site?.protonation ?? prot.hisProtonation, prot.response, on, site?.clickPulse ?? 0, role);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						w.x,
						w.y,
						w.z
					],
					scale: w.radius,
					onClick: (e) => {
						e.stopPropagation();
						toggleHisSwitch(pi);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						1,
						16,
						14
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: new Color(col[0], col[1], col[2]),
						emissive: new Color(col[0], col[1], col[2]),
						emissiveIntensity: on ? .35 : .08,
						roughness: .35,
						metalness: .25
					})]
				}, bi);
			}
			let br = body[0], bg = body[1], bb = body[2];
			if (bead.morph === "asp") {
				const [cr, cg, cb] = divergingRedWhiteBlue(chargeToT(-1, 1));
				br = cr;
				bg = cg;
				bb = cb;
			} else if (bead.morph === "ser") {
				br = .92;
				bg = .92;
				bb = .94;
			} else if (bead.fixedCharge != null && Math.abs(bead.fixedCharge) > .05) {
				const [cr, cg, cb] = divergingRedWhiteBlue(chargeToT(bead.fixedCharge, 1.5));
				br = br * .55 + cr * .45;
				bg = bg * .55 + cg * .45;
				bb = bb * .55 + cb * .45;
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					w.x,
					w.y,
					w.z
				],
				scale: w.radius,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					1,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: new Color(br, bg, bb),
					roughness: .55,
					metalness: .12,
					transparent: true,
					opacity: .88
				})]
			}, bi);
		}), roiFocused && pi === focused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoiLabels, { proteinIndex: pi })] }, prot.id);
	}) });
}
function cleanRoiLabel(raw) {
	if (!raw) return null;
	return raw.replace(/\s*ROI\s*$/i, "").trim() || raw;
}
function RoiLabels({ proteinIndex }) {
	const prot = simEngine.proteins[proteinIndex];
	if (!prot) return null;
	const geometryId = prot.geometryId ?? "furin";
	const meta = RECEPTOR_GEOMETRIES[geometryId];
	const isFurin = geometryId === "furin";
	const roiBead = prot.beads.find((b) => b.isHisRoi) ?? prot.beads.find((b) => b.morph === "his") ?? null;
	if (!roiBead) return null;
	const items = [];
	const roiPos = beadWorldPos(prot, roiBead);
	const on = prot.hisSites[0]?.switchDisplayOn ?? prot.switchDisplayOn;
	const lift = isFurin ? .16 : .24;
	const roiText = meta?.roiLabel ?? cleanRoiLabel(roiBead.residueLabel) ?? "site";
	const roiSuffix = isFurin || prot.titratableHis === true ? on ? " · ON" : " · OFF" : "";
	items.push({
		key: "roi",
		x: roiPos.x,
		y: roiPos.y + lift,
		z: roiPos.z,
		text: `${roiText}${roiSuffix}`,
		isRoi: true,
		bg: on ? "rgba(37,99,235,0.48)" : "rgba(15,23,42,0.78)",
		fg: on ? "#dbeafe" : "#e4e4e7"
	});
	if (isFurin) {
		for (const bead of prot.beads) if (bead.morph === "asp" || bead.morph === "ser") {
			const pos = beadWorldPos(prot, bead);
			const lab = bead.residueLabel ?? (bead.morph === "asp" ? "Asp153" : "Ser368");
			items.push({
				key: lab,
				x: pos.x,
				y: pos.y + .12,
				z: pos.z,
				text: lab,
				isRoi: false,
				bg: bead.morph === "asp" ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.16)",
				fg: bead.morph === "asp" ? "#fecaca" : "#e4e4e7"
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
		position: [
			it.x,
			it.y,
			it.z
		],
		center: true,
		distanceFactor: 2.6,
		style: { pointerEvents: "none" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: {
				fontSize: it.isRoi ? 11 : 10,
				fontWeight: 600,
				padding: "2px 6px",
				borderRadius: 4,
				whiteSpace: "nowrap",
				background: it.bg,
				color: it.fg,
				border: "1px solid rgba(255,255,255,0.15)",
				boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
				letterSpacing: "0.01em"
			},
			children: it.text
		})
	}, it.key)) });
}
function FieldDistribution() {
	const show = useSimStore((s) => s.showField);
	const opacity = useSimStore((s) => s.fieldOpacity);
	const [tick, setTick] = (0, import_react.useState)(0);
	useFrame(() => setTick((t) => (t + 1) % 1e5));
	const data = simEngine.fieldSlice;
	const meshRef = (0, import_react.useRef)(null);
	const texRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!data) return;
		const res = data.res;
		const buf = new Uint8ClampedArray(res * res * 4);
		writePotentialTexture(data, buf, opacity);
		if (!texRef.current || texRef.current.image.width !== res) {
			texRef.current?.dispose();
			const tex = new DataTexture(buf, res, res, RGBAFormat);
			tex.needsUpdate = true;
			tex.magFilter = LinearFilter;
			tex.minFilter = LinearFilter;
			texRef.current = tex;
		} else {
			texRef.current.image.data = buf;
			texRef.current.needsUpdate = true;
		}
		if (meshRef.current) {
			const mat = meshRef.current.material;
			mat.map = texRef.current;
			mat.opacity = opacity;
			mat.needsUpdate = true;
		}
	}, [
		data,
		opacity,
		tick
	]);
	if (!show || !data) return null;
	const [ox, oy, oz] = data.origin;
	const size = data.half * 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: meshRef,
			position: [
				ox,
				oy,
				oz
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [size, size] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				transparent: true,
				opacity,
				depthWrite: false,
				side: 2
			})]
		}),
		data.contours.map((poly, i) => poly.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
			points: poly.map((p) => new Vector3(p[0], p[1], p[2])),
			color: "#94a3b8",
			lineWidth: 1,
			transparent: true,
			opacity: opacity * .85
		}, i) : null),
		data.forces.map((f, i) => {
			const s = .12 / (Math.hypot(f.ex, f.ey, f.ez) + 1e-9);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
				points: [new Vector3(f.x, f.y, f.z), new Vector3(f.x + f.ex * s, f.y + f.ey * s, f.z + f.ez * s)],
				color: "#64748b",
				lineWidth: 1,
				transparent: true,
				opacity: opacity * .7
			}, `f-${i}`);
		})
	] });
}
function ForceArrows() {
	const show = useSimStore((s) => s.showForceArrows);
	const [tick, setTick] = (0, import_react.useState)(0);
	useFrame(() => setTick((t) => (t + 1) % 1e5));
	if (!show || !simEngine.roiEnergy?.arrows?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: simEngine.roiEnergy.arrows.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
		points: [new Vector3(a.ax, a.ay, a.az), new Vector3(a.bx, a.by, a.bz)],
		color: a.kind === "L1L2" ? "#a78bfa" : "#38bdf8",
		lineWidth: 1.5,
		transparent: true,
		opacity: .85
	}, i)) });
}
function CameraRig() {
	const { camera, controls } = useThree();
	const focusRequest = useSimStore((s) => s.focusRequest);
	const clampFocusRequest = useSimStore((s) => s.clampFocusRequest);
	const clampZoomLevel = useSimStore((s) => s.clampZoomLevel);
	const lastFocus = (0, import_react.useRef)(0);
	const lastClamp = (0, import_react.useRef)(0);
	useFrame(() => {
		const prot = simEngine.proteins[simEngine.focusedProteinIndex] ?? simEngine.proteins[0];
		if (!prot) return;
		const roi = roiWorldPos(prot);
		if (focusRequest !== lastFocus.current) {
			lastFocus.current = focusRequest;
			const dist = 1.55;
			camera.position.set(roi.x + dist * .85, roi.y + dist * .55, roi.z + dist);
			camera.lookAt(roi.x, roi.y, roi.z);
			if (controls?.target) {
				controls.target.set(roi.x, roi.y, roi.z);
				controls.update?.();
			}
		}
		if (simEngine.clampCapturing || simEngine.isClampEvent && simEngine.eventPlayback) {
			const base = 1.35 * (clampZoomLevel === "100" ? 1 : clampZoomLevel === "75" ? 1 / .75 : clampZoomLevel === "50" ? 2 : 4);
			if (!simEngine.clampCamLock) simEngine.clampCamLock = {
				x: roi.x + base * .7,
				y: roi.y + base * .45,
				z: roi.z + base * .85
			};
			const lock = simEngine.clampCamLock;
			camera.position.set(lock.x, lock.y, lock.z);
			camera.lookAt(roi.x, roi.y, roi.z);
			if (controls?.target) {
				controls.target.set(roi.x, roi.y, roi.z);
				controls.update?.();
			}
		} else if (clampFocusRequest !== lastClamp.current) lastClamp.current = clampFocusRequest;
	});
	return null;
}
function SimLoop() {
	const setFps = useSimStore((s) => s.setFps);
	const syncFromEngine = useSimStore((s) => s.syncFromEngine);
	const displayDurationSec = useSimStore((s) => s.displayDurationSec);
	const demoSpeed = useSimStore((s) => s.demoSpeed);
	const last = (0, import_react.useRef)(performance.now());
	const acc = (0, import_react.useRef)(0);
	const frames = (0, import_react.useRef)(0);
	const stepAcc = (0, import_react.useRef)(0);
	useFrame(() => {
		const now = performance.now();
		const dt = (now - last.current) / 1e3;
		last.current = now;
		frames.current += 1;
		acc.current += dt;
		if (acc.current >= .5) {
			setFps(Math.round(frames.current / acc.current));
			frames.current = 0;
			acc.current = 0;
		}
		const speed = demoSpeed > 0 ? demoSpeed : .5;
		const target = targetStepsPerSecond(displayDurationSec) * speed;
		stepAcc.current += target / 60 * Math.min(dt * 60, 2);
		let steps = Math.floor(stepAcc.current);
		stepAcc.current -= steps;
		steps = Math.min(speed >= 1 ? 3 : 2, Math.max(0, steps));
		if (simEngine.playing && useSimStore.getState().scrubIndex == null && !simEngine.eventPlayback) for (let i = 0; i < steps; i++) simEngine.step();
		else if (simEngine.eventPlayback) for (let i = 0; i < Math.max(1, Math.min(2, steps || 1)); i++) simEngine.step();
		syncFromEngine();
	});
	return null;
}
function MoleculoCanvas() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		camera: {
			position: [
				2.2,
				1.4,
				2.8
			],
			fov: 42,
			near: .01,
			far: 80
		},
		dpr: [1, 1.75],
		gl: {
			antialias: true,
			alpha: true
		},
		style: {
			width: "100%",
			height: "100%",
			background: "#070a10"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#070a10"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .55 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					4,
					6,
					3
				],
				intensity: .85
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-3,
					-2,
					-4
				],
				intensity: .25
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainShell, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DomainWire, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HierarchySpheres, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProteinProxies, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParticlesView, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldDistribution, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForceArrows, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimLoop, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
				makeDefault: true,
				enableDamping: true,
				dampingFactor: .08,
				minDistance: .35,
				maxDistance: 18
			})
		]
	});
}
/**
* Continuum event tape — 2D strip under the 3D view.
* X = frame index, Y = minDistNm (+ optional U_primary), markers for prox/HH peaks.
* Clamp rulers + tape zoom/pan. Physics-agnostic visualization only.
*/
var H = 120;
var PAD_L = 36;
var PAD_R = 10;
var PAD_T = 10;
function EventTape() {
	const canvasRef = (0, import_react.useRef)(null);
	const eventLogLen = useSimStore((s) => s.eventLogLen);
	const eventScrub = useSimStore((s) => s.eventScrub);
	const eventRecording = useSimStore((s) => s.eventRecording);
	const clampStart = useSimStore((s) => s.clampStart);
	const clampEnd = useSimStore((s) => s.clampEnd);
	const tapeZoomLevel = useSimStore((s) => s.tapeZoomLevel);
	const tapePanOffset = useSimStore((s) => s.tapePanOffset);
	const setEventScrub = useSimStore((s) => s.setEventScrub);
	const setClampStart = useSimStore((s) => s.setClampStart);
	const setClampEnd = useSimStore((s) => s.setClampEnd);
	const panTapeBy = useSimStore((s) => s.panTapeBy);
	const [tooltip, setTooltip] = (0, import_react.useState)(null);
	const dragRef = (0, import_react.useRef)(null);
	const panOrigin = (0, import_react.useRef)({
		x: 0,
		pan: 0
	});
	const viewport = (0, import_react.useMemo)(() => {
		return simEngine.getTapeViewport();
	}, [
		tapeZoomLevel,
		tapePanOffset,
		eventLogLen,
		eventScrub,
		clampStart,
		clampEnd
	]);
	const frameToX = (0, import_react.useCallback)((f, w) => {
		const { start, end } = viewport;
		const span = Math.max(1, end - start);
		return PAD_L + (f - start) / span * (w - PAD_L - PAD_R);
	}, [viewport]);
	const xToFrame = (0, import_react.useCallback)((x, w) => {
		const { start, end } = viewport;
		const span = Math.max(1, end - start);
		const t = (x - PAD_L) / Math.max(1, w - PAD_L - PAD_R);
		return Math.round(start + t * span);
	}, [viewport]);
	const draw = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const cssW = canvas.parentElement?.clientWidth ?? 640;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.floor(cssW * dpr);
		canvas.height = Math.floor(H * dpr);
		canvas.style.width = `${cssW}px`;
		canvas.style.height = `${H}px`;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const w = cssW;
		const h = H;
		ctx.fillStyle = "#0a0e16";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "rgba(148,163,184,0.25)";
		ctx.strokeRect(.5, .5, w - 1, 119);
		const n = simEngine.eventLog.length;
		if (n === 0) {
			ctx.fillStyle = "rgba(148,163,184,0.65)";
			ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
			ctx.fillText("No recording — press Record to capture continuum frames", PAD_L, h / 2);
			return;
		}
		const { start, end } = viewport;
		const frames = simEngine.eventLog;
		let minY = Infinity;
		let maxY = -Infinity;
		let minU = Infinity;
		let maxU = -Infinity;
		for (let i = start; i <= end; i++) {
			const f = frames[i];
			if (!f) continue;
			if (f.minDistNm > 0) {
				minY = Math.min(minY, f.minDistNm);
				maxY = Math.max(maxY, f.minDistNm);
			}
			minU = Math.min(minU, f.U_primary);
			maxU = Math.max(maxU, f.U_primary);
		}
		if (!Number.isFinite(minY)) {
			minY = 0;
			maxY = 3;
		}
		if (maxY - minY < 1e-6) {
			minY -= .2;
			maxY += .2;
		}
		if (!Number.isFinite(minU) || maxU - minU < 1e-9) {
			minU = -1;
			maxU = 1;
		}
		const yDist = (d) => {
			return PAD_T + (1 - (d - minY) / (maxY - minY)) * 88;
		};
		const yU = (u) => {
			return PAD_T + (1 - (u - minU) / (maxU - minU)) * 88;
		};
		ctx.strokeStyle = "rgba(51,65,85,0.55)";
		ctx.lineWidth = 1;
		for (let g = 0; g < 4; g++) {
			const yy = PAD_T + 88 * g / 3;
			ctx.beginPath();
			ctx.moveTo(PAD_L, yy);
			ctx.lineTo(w - PAD_R, yy);
			ctx.stroke();
		}
		if (clampStart != null && clampEnd != null) {
			const x0 = frameToX(Math.min(clampStart, clampEnd), w);
			const x1 = frameToX(Math.max(clampStart, clampEnd), w);
			ctx.fillStyle = "rgba(251,191,36,0.12)";
			ctx.fillRect(x0, PAD_T, Math.max(1, x1 - x0), 88);
		}
		ctx.beginPath();
		ctx.strokeStyle = "rgba(167,139,250,0.55)";
		ctx.lineWidth = 1.25;
		let startedU = false;
		for (let i = start; i <= end; i++) {
			const f = frames[i];
			const x = frameToX(i, w);
			const y = yU(f.U_primary);
			if (!startedU) {
				ctx.moveTo(x, y);
				startedU = true;
			} else ctx.lineTo(x, y);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle = "#38bdf8";
		ctx.lineWidth = 1.75;
		let started = false;
		for (let i = start; i <= end; i++) {
			const f = frames[i];
			const d = f.minDistNm > 0 ? f.minDistNm : minY;
			const x = frameToX(i, w);
			const y = yDist(d);
			if (!started) {
				ctx.moveTo(x, y);
				started = true;
			} else ctx.lineTo(x, y);
		}
		ctx.stroke();
		for (let i = start; i <= end; i++) {
			const f = frames[i];
			if (!f.proxFlag && !f.hhFlag) continue;
			const x = frameToX(i, w);
			ctx.beginPath();
			ctx.strokeStyle = f.proxFlag ? "#f472b6" : "#fbbf24";
			ctx.lineWidth = 1.5;
			ctx.moveTo(x, PAD_T);
			ctx.lineTo(x, 98);
			ctx.stroke();
			ctx.fillStyle = f.proxFlag ? "#f472b6" : "#fbbf24";
			ctx.beginPath();
			ctx.arc(x, 14, 3, 0, Math.PI * 2);
			ctx.fill();
		}
		if (clampStart != null) {
			const x = frameToX(clampStart, w);
			ctx.strokeStyle = "#fbbf24";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x, PAD_T);
			ctx.lineTo(x, 98);
			ctx.stroke();
			ctx.fillStyle = "#fde68a";
			ctx.font = "9px ui-sans-serif, system-ui, sans-serif";
			ctx.fillText(`i₀=${clampStart}`, x + 3, 20);
		}
		if (clampEnd != null) {
			const x = frameToX(clampEnd, w);
			ctx.strokeStyle = "#f59e0b";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x, PAD_T);
			ctx.lineTo(x, 98);
			ctx.stroke();
			ctx.fillStyle = "#fde68a";
			ctx.font = "9px ui-sans-serif, system-ui, sans-serif";
			ctx.fillText(`i₁=${clampEnd}`, x + 3, 30);
		}
		const ph = eventScrub ?? n - 1;
		if (ph >= start && ph <= end) {
			const x = frameToX(ph, w);
			ctx.strokeStyle = "#f8fafc";
			ctx.lineWidth = 1.5;
			ctx.setLineDash([3, 3]);
			ctx.beginPath();
			ctx.moveTo(x, PAD_T);
			ctx.lineTo(x, 98);
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.fillStyle = "#f8fafc";
			ctx.beginPath();
			ctx.moveTo(x, PAD_T);
			ctx.lineTo(x - 5, 4);
			ctx.lineTo(x + 5, 4);
			ctx.closePath();
			ctx.fill();
		}
		ctx.fillStyle = "rgba(148,163,184,0.85)";
		ctx.font = "9px ui-sans-serif, system-ui, sans-serif";
		ctx.fillText(`${minY.toFixed(2)}`, 2, 98);
		ctx.fillText(`${maxY.toFixed(2)}`, 2, 18);
		ctx.fillText(`f ${start}`, PAD_L, 114);
		ctx.fillText(`f ${end}`, w - PAD_R - 28, 114);
		ctx.fillStyle = "#38bdf8";
		ctx.fillText("minDist nm", PAD_L, 9);
		ctx.fillStyle = "rgba(167,139,250,0.85)";
		ctx.fillText("U_primary", 108, 9);
		if (eventRecording) {
			ctx.fillStyle = "#f87171";
			ctx.fillText("● REC", w - 48, 9);
		}
	}, [
		viewport,
		eventScrub,
		clampStart,
		clampEnd,
		eventRecording,
		eventLogLen,
		frameToX
	]);
	(0, import_react.useEffect)(() => {
		draw();
		const id = window.setInterval(draw, eventRecording ? 100 : 250);
		const onResize = () => draw();
		window.addEventListener("resize", onResize);
		return () => {
			window.clearInterval(id);
			window.removeEventListener("resize", onResize);
		};
	}, [draw, eventRecording]);
	const onPointerDown = (e) => {
		const canvas = canvasRef.current;
		if (!canvas || !eventLogLen) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const w = rect.width;
		const f = Math.max(0, Math.min(eventLogLen - 1, xToFrame(x, w)));
		const near = (idx) => idx != null && Math.abs(frameToX(idx, w) - x) < 8;
		if (e.shiftKey && clampStart != null && near(clampStart)) dragRef.current = "i0";
		else if (e.shiftKey && clampEnd != null && near(clampEnd)) dragRef.current = "i1";
		else if (e.altKey || e.button === 1) {
			dragRef.current = "pan";
			panOrigin.current = {
				x: e.clientX,
				pan: simEngine.tapePanOffset
			};
		} else if (clampStart != null && near(clampStart)) dragRef.current = "i0";
		else if (clampEnd != null && near(clampEnd)) dragRef.current = "i1";
		else {
			dragRef.current = "playhead";
			setEventScrub(f);
		}
		canvas.setPointerCapture(e.pointerId);
	};
	const onPointerMove = (e) => {
		const canvas = canvasRef.current;
		if (!canvas || !eventLogLen) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const w = rect.width;
		const f = Math.max(0, Math.min(eventLogLen - 1, xToFrame(x, w)));
		const frame = simEngine.eventLog[f];
		if (frame) {
			const kinds = [];
			if (frame.proxFlag) kinds.push("prox");
			if (frame.hhFlag) kinds.push("HH");
			setTooltip({
				x: e.clientX - rect.left,
				y: Math.max(8, y - 8),
				text: `f=${f} · d=${frame.minDistNm > 0 ? frame.minDistNm.toFixed(3) : "—"} nm · U=${frame.U_primary.toFixed(2)} · θ=${frame.theta.toFixed(2)}${kinds.length ? ` · ${kinds.join("+")}` : ""} · t≈${f * 100} ns`
			});
		}
		if (!dragRef.current) return;
		if (dragRef.current === "playhead") setEventScrub(f);
		else if (dragRef.current === "i0") setClampStart(f);
		else if (dragRef.current === "i1") setClampEnd(f);
		else if (dragRef.current === "pan") {
			const dx = e.clientX - panOrigin.current.x;
			const { start, end } = viewport;
			const framesPerPx = Math.max(1, end - start) / Math.max(1, w - PAD_L - PAD_R);
			simEngine.tapePanOffset = panOrigin.current.pan - Math.round(dx * framesPerPx);
			useSimStore.getState().syncFromEngine();
		}
	};
	const onPointerUp = (e) => {
		dragRef.current = null;
		try {
			canvasRef.current?.releasePointerCapture(e.pointerId);
		} catch {}
	};
	const onWheel = (e) => {
		if (!eventLogLen) return;
		e.preventDefault();
		if (e.ctrlKey || e.metaKey) {
			const levels = [
				"100",
				"75",
				"50",
				"25"
			];
			const cur = levels.indexOf(tapeZoomLevel);
			const next = e.deltaY > 0 ? Math.min(3, cur + 1) : Math.max(0, cur - 1);
			useSimStore.getState().setTapeZoomLevel(levels[next]);
		} else panTapeBy(e.deltaY > 0 ? 4 : -4);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full border-t border-border bg-[#070a10]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-2 pt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-medium tracking-wide text-muted uppercase",
				children: "Event tape · continuum recording window"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[9px] text-subtle",
				children: "drag scrub · drag rulers · Alt-drag pan · Ctrl-wheel zoom · cyan=minDist · violet=U"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full px-1 pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "block w-full cursor-crosshair touch-none rounded-md",
				height: H,
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerLeave: () => setTooltip(null),
				onWheel
			}), tooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute z-10 max-w-[min(90%,24rem)] rounded border border-border bg-panel/95 px-2 py-1 text-[9px] text-fg shadow-lg",
				style: {
					left: Math.min(tooltip.x + 8, 200),
					top: tooltip.y
				},
				children: tooltip.text
			})]
		})]
	});
}
function MoleculoApp() {
	const [panelOpen, setPanelOpen] = (0, import_react.useState)(true);
	const displayDurationSec = useSimStore((s) => s.displayDurationSec);
	const tPrime = timeAccelerationFactor(displayDurationSec);
	const pH = useSimStore((s) => s.pH);
	const regime = useSimStore((s) => s.regime);
	const receptorGeometry = useSimStore((s) => s.receptorGeometry);
	const hisProtonation = useSimStore((s) => s.hisProtonationDisplay);
	const roiEnergy = useSimStore((s) => s.roiEnergy);
	const switchDisplayOn = useSimStore((s) => s.switchDisplayOn);
	const hisCharge = roiEnergy?.hisCharge ?? hisProtonation;
	const recMeta = RECEPTOR_GEOMETRIES[receptorGeometry];
	const regimeMeta = REGIME_META[regime];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-[calc(100dvh-var(--grok-banner-h,0px))] w-full flex-col overflow-hidden bg-bg md:flex-row",
		style: { minHeight: "calc(100dvh - var(--grok-banner-h, 0px))" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex min-h-0 min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoleculoCanvas, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute top-3 left-3 z-10 flex max-w-[min(100%-5rem,28rem)] flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] font-medium text-fg backdrop-blur-sm",
									children: APP_VERSION_BANNER
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] text-muted backdrop-blur-sm",
									children: "Orbit · zoom · click ROI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md border border-teal-500/35 bg-teal-950/55 px-2.5 py-1 text-[11px] text-teal-100 backdrop-blur-sm",
									children: [
										recMeta?.shortLabel ?? "Receptor",
										" · ",
										recMeta?.roiLabel ?? "ROI"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] tabular text-fg backdrop-blur-sm",
									children: [
										"pH ",
										pH.toFixed(2),
										" · ",
										regimeMeta?.short ?? regime
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] tabular text-fg backdrop-blur-sm",
									children: [
										"θ ",
										hisProtonation.toFixed(2),
										" · q ",
										hisCharge.toFixed(2),
										" ·",
										" ",
										switchDisplayOn ? "ON" : "OFF"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md border border-cyan-500/30 bg-cyan-950/50 px-2.5 py-1 text-[11px] tabular text-cyan-100 backdrop-blur-sm",
									children: [
										"t′ ×",
										tPrime.toFixed(2),
										" · ",
										displayDurationSec.toFixed(0),
										" s"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-md rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[10px] leading-snug text-muted backdrop-blur-sm",
							children: APP_SUBTITLE
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute top-3 right-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-panel/95 text-fg shadow-lg backdrop-blur-sm md:hidden",
						onClick: () => setPanelOpen((o) => !o),
						"aria-label": panelOpen ? "Close controls" : "Open controls",
						children: panelOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-amber-500/25 bg-amber-950/80 px-3 py-1.5 backdrop-blur-sm",
						role: "note",
						"aria-label": "Publication disclaimer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[9px] leading-snug text-amber-50/95 sm:text-[10px]",
							children: PUBLICATION_DISCLAIMER
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventTape, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: ["z-30 border-border bg-bg/40 p-3 md:static md:block md:h-full md:w-auto md:shrink-0 md:overflow-hidden md:border-l md:p-4", panelOpen ? "absolute inset-x-0 bottom-0 max-h-[72dvh] border-t md:relative md:max-h-none" : "hidden md:block"].join(" "),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlPanel, {})
		})]
	});
}
//#endregion
export { MoleculoApp as default };
