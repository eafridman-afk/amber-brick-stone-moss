import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CMeCPy30.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [App, setApp] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./App-CBwn-JUU.mjs").then((mod) => {
			if (!cancelled) setApp(() => mod.default);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (!App) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex items-center justify-center bg-bg text-muted",
		style: { minHeight: "calc(100dvh - var(--grok-banner-h, 0px))" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-fg",
				children: "Loading MoleculoSphere 5D · Beta v1.0…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "Classical continuum electrostatics · Educational / hypothesis tool"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
export { Home as component };
