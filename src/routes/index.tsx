import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/components/moleculo/App").then((mod) => {
      if (!cancelled) setApp(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!App) {
    return (
      <main
        className="flex items-center justify-center bg-bg text-muted"
        style={{ minHeight: "calc(100dvh - var(--grok-banner-h, 0px))" }}
      >
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-fg">
            Loading MoleculoSphere 5D · Beta v1.1…
          </p>
          <p className="text-xs text-subtle">
            Classical continuum electrostatics · Educational / hypothesis tool
          </p>
        </div>
      </main>
    );
  }

  return <App />;
}
