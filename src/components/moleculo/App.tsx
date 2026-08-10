import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ControlPanel } from "./ControlPanel";
import { MoleculoCanvas } from "./Scene";
import { EventTape } from "./EventTape";
import { useSimStore } from "@/stores/sim-store";
import {
  APP_SUBTITLE,
  APP_VERSION_BANNER,
  PUBLICATION_DISCLAIMER,
  RECEPTOR_GEOMETRIES,
  timeAccelerationFactor,
} from "@/lib/moleculo/types";
import { REGIME_META } from "@/lib/moleculo/physics";

export default function MoleculoApp() {
  const [panelOpen, setPanelOpen] = useState(true);
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
  const regimeMeta = REGIME_META[regime as keyof typeof REGIME_META];

  return (
    <div
      className="relative flex h-[calc(100dvh-var(--grok-banner-h,0px))] w-full flex-col overflow-hidden bg-bg md:flex-row"
      style={{ minHeight: "calc(100dvh - var(--grok-banner-h, 0px))" }}
    >
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative min-h-0 flex-1">
          <MoleculoCanvas />

          <div className="pointer-events-none absolute top-3 left-3 z-10 flex max-w-[min(100%-5rem,28rem)] flex-col gap-1.5">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] font-medium text-fg backdrop-blur-sm">
                {APP_VERSION_BANNER}
              </span>
              <span className="rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] text-muted backdrop-blur-sm">
                Orbit · zoom · click ROI
              </span>
              <span className="rounded-md border border-teal-500/35 bg-teal-950/55 px-2.5 py-1 text-[11px] text-teal-100 backdrop-blur-sm">
                {recMeta?.shortLabel ?? "Receptor"} · {recMeta?.roiLabel ?? "ROI"}
              </span>
              <span className="rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] tabular text-fg backdrop-blur-sm">
                pH {pH.toFixed(2)} · {regimeMeta?.short ?? regime}
              </span>
              <span className="rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[11px] tabular text-fg backdrop-blur-sm">
                θ {hisProtonation.toFixed(2)} · q {hisCharge.toFixed(2)} ·{" "}
                {switchDisplayOn ? "ON" : "OFF"}
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-950/50 px-2.5 py-1 text-[11px] tabular text-cyan-100 backdrop-blur-sm">
                t′ ×{tPrime.toFixed(2)} · {displayDurationSec.toFixed(0)} s
              </span>
            </div>
            <span className="max-w-md rounded-md border border-border bg-panel/85 px-2.5 py-1 text-[10px] leading-snug text-muted backdrop-blur-sm">
              {APP_SUBTITLE}
            </span>
          </div>

          <button
            type="button"
            className="absolute top-3 right-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-panel/95 text-fg shadow-lg backdrop-blur-sm md:hidden"
            onClick={() => setPanelOpen((o) => !o)}
            aria-label={panelOpen ? "Close controls" : "Open controls"}
          >
            {panelOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Always-visible publication disclaimer */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 border-t border-amber-500/25 bg-amber-950/80 px-3 py-1.5 backdrop-blur-sm"
            role="note"
            aria-label="Publication disclaimer"
          >
            <p className="text-center text-[9px] leading-snug text-amber-50/95 sm:text-[10px]">
              {PUBLICATION_DISCLAIMER}
            </p>
          </div>
        </div>
        <EventTape />
      </div>

      <div
        className={[
          "z-30 border-border bg-bg/40 p-3 md:static md:block md:h-full md:w-auto md:shrink-0 md:overflow-hidden md:border-l md:p-4",
          panelOpen
            ? "absolute inset-x-0 bottom-0 max-h-[72dvh] border-t md:relative md:max-h-none"
            : "hidden md:block",
        ].join(" ")}
      >
        <ControlPanel />
      </div>
    </div>
  );
}
