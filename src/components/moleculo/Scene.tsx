import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { simEngine } from "@/lib/moleculo/engine";
import { useSimStore } from "@/stores/sim-store";
import { SPECIES } from "@/lib/moleculo/physics";
import { chargeToT, divergingRedWhiteBlue } from "@/lib/moleculo/colormap";
import {
  beadWorldPos,
  hisRoiColor,
  proteinBodyColor,
  roiWorldPos,
} from "@/lib/moleculo/proteins";
import { writePotentialTexture } from "@/lib/moleculo/field-viz";
import {
  DOMAIN_RADIUS,
  RECEPTOR_GEOMETRIES,
  targetStepsPerSecond,
} from "@/lib/moleculo/types";
import type { Particle } from "@/lib/moleculo/types";

function DomainShell() {
  return (
    <mesh>
      <sphereGeometry args={[DOMAIN_RADIUS, 48, 36]} />
      <meshBasicMaterial
        color="#0c1018"
        transparent
        opacity={0.35}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function DomainWire() {
  return (
    <mesh>
      <sphereGeometry args={[DOMAIN_RADIUS * 0.998, 32, 24]} />
      <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.18} />
    </mesh>
  );
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

  const activeIds = useMemo(() => {
    const ids = [...level1Ids];
    if (showL2) {
      for (const pid of expanded) {
        const kids = level2ByParent.get(pid);
        if (kids) ids.push(...kids);
      }
    }
    return ids;
  }, [level1Ids, level2ByParent, expanded, showL2]);

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <group>
      {activeIds.map((id) => {
        const n = nodeById.get(id);
        if (!n) return null;
        const sel = selectedId === id;
        return (
          <mesh
            key={id}
            position={[n.x, n.y, n.z]}
            scale={n.radius}
            onClick={(e) => {
              e.stopPropagation();
              selectSphere(id);
            }}
          >
            <sphereGeometry args={[1, 20, 16]} />
            <meshStandardMaterial
              color={sel ? "#64748b" : "#1e293b"}
              transparent
              opacity={sel ? 0.35 : 0.14}
              roughness={0.7}
              metalness={0.05}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {showConnectors &&
        connectors.map((c, i) => (
          <lineSegments key={`c-${i}`}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[c.positions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#334155" transparent opacity={0.35} />
          </lineSegments>
        ))}
      {showTriangulation && surface && (
        <mesh>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[surface.positions, 3]} />
            <bufferAttribute attach="index" args={[surface.indices, 1]} />
          </bufferGeometry>
          <meshStandardMaterial
            color="#475569"
            transparent
            opacity={0.22}
            wireframe
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

function particleColor(p: Particle): [number, number, number] {
  const sp = SPECIES.find((s) => s.id === p.speciesId);
  if (sp?.accentRgb) return sp.accentRgb;
  if (p.ligandClass === "ligand1" || p.kind === "pb" || p.kind === "cu" || p.kind === "metal") {
    if (p.speciesId === "cu-ion" || p.kind === "cu") return [0.72, 0.45, 0.2];
    return [0.22, 0.22, 0.26];
  }

  if (p.ligandClass === "ligand4" || p.kind === "ach") {
    return [0.13, 0.83, 0.93];
  }
  const [r, g, b] = divergingRedWhiteBlue(chargeToT(p.q, 5));
  return [r, g, b];
}

function ParticlesView() {
  const eventFrame = useSimStore((s) => s.eventFrame);
  const eventScrub = useSimStore((s) => s.eventScrub);
  const eventPlayback = useSimStore((s) => s.eventPlayback);
  const [tick, setTick] = useState(0);
  useFrame(() => setTick((t) => (t + 1) % 1e6));
  void tick;

  // When scrubbing / playing the log, render the buffered frame particles fully
  const scrubbing =
    (eventScrub != null || eventPlayback) &&
    eventFrame != null &&
    eventFrame.particles.length > 0;
  const particles: Particle[] = scrubbing
    ? (eventFrame!.particles as unknown as Particle[])
    : simEngine.particles;

  return (
    <group>
      {particles.map((p) => {
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
        const [cr, cg, cb] = particleColor({ ...p, q });
        const r = sp?.radius ?? 0.05;

        if (beads <= 1) {
          return (
            <mesh key={p.id} position={[x, y, z]} scale={r}>
              <sphereGeometry args={[1, 14, 12]} />
              <meshStandardMaterial
                color={new THREE.Color(cr, cg, cb)}
                roughness={p.ligandClass === "ligand1" ? 0.25 : 0.45}
                metalness={p.ligandClass === "ligand1" ? 0.85 : 0.15}
              />
            </mesh>
          );
        }

        const chain: ReactNode[] = [];
        const len = (beads - 1) * spacing;
        const hx = ox || 1;
        const hy = oy || 0;
        const hz = oz || 0;
        const hn = Math.hypot(hx, hy, hz) || 1;
        const ux = hx / hn;
        const uy = hy / hn;
        const uz = hz / hn;
        for (let i = 0; i < beads; i++) {
          const t = i * spacing - len * 0.5;
          chain.push(
            <mesh
              key={`${p.id}-${i}`}
              position={[x + ux * t, y + uy * t, z + uz * t]}
              scale={r * (i === 0 || i === beads - 1 ? 1.05 : 0.92)}
            >
              <sphereGeometry args={[1, 10, 8]} />
              <meshStandardMaterial
                color={new THREE.Color(cr, cg, cb)}
                roughness={0.45}
                metalness={0.15}
              />
            </mesh>,
          );
        }
        return <group key={p.id}>{chain}</group>;
      })}
    </group>
  );
}

function ProteinProxies() {
  const show = useSimStore((s) => s.showProteins);
  const roiFocused = useSimStore((s) => s.roiFocused);
  const eventFrame = useSimStore((s) => s.eventFrame);
  const toggleHisSwitch = useSimStore((s) => s.toggleHisSwitch);
  const sparse = !useSimStore((s) => s.showL2);
  const [tick, setTick] = useState(0);
  useFrame(() => setTick((t) => (t + 1) % 100000));
  if (!show) return null;
  void tick;
  const proteins = simEngine.proteins;
  const focused = simEngine.focusedProteinIndex;

  return (
    <group>
      {proteins.map((prot, pi) => {
        const useEvent = Boolean(pi === focused && eventFrame);
        const hisCharge = useEvent && eventFrame ? eventFrame.hisCharge : prot.hisCharge;
        const hisOn =
          useEvent && eventFrame ? eventFrame.switchDisplayOn : prot.switchDisplayOn;
        const body = proteinBodyColor(
          prot.stressTint,
          hisCharge,
          hisOn,
          prot.clickPulse,
        );
        return (
          <group key={prot.id}>
            {prot.beads.map((bead, bi) => {
              if (sparse) {
                const keep =
                  bead.isHisRoi ||
                  bead.morph === "his" ||
                  bead.morph === "asp" ||
                  bead.morph === "ser" ||
                  bead.morph === "canyon" ||
                  bead.morph === "jawA" ||
                  bead.morph === "jawB";
                if (!keep) return null;
                if (
                  bead.morph === "canyon" &&
                  prot.geometryId !== "furin" &&
                  bi % 2 === 1
                ) {
                  return null;
                }
              }
              const w = beadWorldPos(prot, bead);
              if (bead.isHisRoi && bead.hisIndex >= 0) {
                const site = prot.hisSites[bead.hisIndex];
                const on =
                  useEvent && eventFrame
                    ? eventFrame.switchDisplayOn
                    : (site?.switchDisplayOn ?? false);
                const role = site?.role ?? bead.hisRole ?? "generic";
                const col = hisRoiColor(
                  useEvent && eventFrame
                    ? eventFrame.hisProtonation
                    : (site?.protonation ?? prot.hisProtonation),
                  prot.response,
                  on,
                  site?.clickPulse ?? 0,
                  role,
                );
                return (
                  <mesh
                    key={bi}
                    position={[w.x, w.y, w.z]}
                    scale={w.radius}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHisSwitch(pi);
                    }}
                  >
                    <sphereGeometry args={[1, 16, 14]} />
                    <meshStandardMaterial
                      color={new THREE.Color(col[0], col[1], col[2])}
                      emissive={new THREE.Color(col[0], col[1], col[2])}
                      emissiveIntensity={on ? 0.35 : 0.08}
                      roughness={0.35}
                      metalness={0.25}
                    />
                  </mesh>
                );
              }
              let br = body[0],
                bg = body[1],
                bb = body[2];
              if (bead.morph === "asp") {
                const [cr, cg, cb] = divergingRedWhiteBlue(chargeToT(-1, 1));
                br = cr;
                bg = cg;
                bb = cb;
              } else if (bead.morph === "ser") {
                br = 0.92;
                bg = 0.92;
                bb = 0.94;
              } else if (
                bead.fixedCharge != null &&
                Math.abs(bead.fixedCharge) > 0.05
              ) {
                const [cr, cg, cb] = divergingRedWhiteBlue(
                  chargeToT(bead.fixedCharge, 1.5),
                );
                br = br * 0.55 + cr * 0.45;
                bg = bg * 0.55 + cg * 0.45;
                bb = bb * 0.55 + cb * 0.45;
              }
              return (
                <mesh key={bi} position={[w.x, w.y, w.z]} scale={w.radius}>
                  <sphereGeometry args={[1, 12, 10]} />
                  <meshStandardMaterial
                    color={new THREE.Color(br, bg, bb)}
                    roughness={0.55}
                    metalness={0.12}
                    transparent
                    opacity={0.88}
                  />
                </mesh>
              );
            })}
            {roiFocused && pi === focused && <RoiLabels proteinIndex={pi} />}
          </group>
        );
      })}
    </group>
  );
}

function cleanRoiLabel(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const s = raw.replace(/\s*ROI\s*$/i, "").trim();
  return s || raw;
}

function RoiLabels({ proteinIndex }: { proteinIndex: number }) {
  const prot = simEngine.proteins[proteinIndex];
  if (!prot) return null;
  const geometryId = prot.geometryId ?? "furin";
  const meta = RECEPTOR_GEOMETRIES[geometryId];
  const isFurin = geometryId === "furin";

  const roiBead =
    prot.beads.find((b) => b.isHisRoi) ??
    prot.beads.find((b) => b.morph === "his") ??
    null;
  if (!roiBead) return null;

  type Item = {
    key: string;
    x: number;
    y: number;
    z: number;
    text: string;
    isRoi: boolean;
    bg: string;
    fg: string;
  };
  const items: Item[] = [];
  const roiPos = beadWorldPos(prot, roiBead);
  const site = prot.hisSites[0];
  const on = site?.switchDisplayOn ?? prot.switchDisplayOn;
  const lift = isFurin ? 0.16 : 0.24;
  const roiText =
    meta?.roiLabel ?? cleanRoiLabel(roiBead.residueLabel) ?? "site";
  const roiSuffix =
    isFurin || prot.titratableHis === true ? (on ? " · ON" : " · OFF") : "";
  items.push({
    key: "roi",
    x: roiPos.x,
    y: roiPos.y + lift,
    z: roiPos.z,
    text: `${roiText}${roiSuffix}`,
    isRoi: true,
    bg: on ? "rgba(37,99,235,0.48)" : "rgba(15,23,42,0.78)",
    fg: on ? "#dbeafe" : "#e4e4e7",
  });

  if (isFurin) {
    for (const bead of prot.beads) {
      if (bead.morph === "asp" || bead.morph === "ser") {
        const pos = beadWorldPos(prot, bead);
        const lab =
          bead.residueLabel ?? (bead.morph === "asp" ? "Asp153" : "Ser368");
        items.push({
          key: lab,
          x: pos.x,
          y: pos.y + 0.12,
          z: pos.z,
          text: lab,
          isRoi: false,
          bg:
            bead.morph === "asp"
              ? "rgba(239,68,68,0.35)"
              : "rgba(255,255,255,0.16)",
          fg: bead.morph === "asp" ? "#fecaca" : "#e4e4e7",
        });
      }
    }
  }

  return (
    <group>
      {items.map((it) => (
        <Html
          key={it.key}
          position={[it.x, it.y, it.z]}
          center
          distanceFactor={2.6}
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              fontSize: it.isRoi ? 11 : 10,
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              background: it.bg,
              color: it.fg,
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              letterSpacing: "0.01em",
            }}
          >
            {it.text}
          </span>
        </Html>
      ))}
    </group>
  );
}

function FieldDistribution() {
  const show = useSimStore((s) => s.showField);
  const opacity = useSimStore((s) => s.fieldOpacity);
  const [tick, setTick] = useState(0);
  useFrame(() => setTick((t) => (t + 1) % 100000));
  void tick;
  const data = simEngine.fieldSlice;
  const meshRef = useRef<THREE.Mesh>(null);
  const texRef = useRef<THREE.DataTexture | null>(null);

  useEffect(() => {
    if (!data) return;
    const res = data.res;
    const buf = new Uint8ClampedArray(res * res * 4);
    writePotentialTexture(data, buf, opacity);
    if (!texRef.current || texRef.current.image.width !== res) {
      texRef.current?.dispose();
      const tex = new THREE.DataTexture(buf, res, res, THREE.RGBAFormat);
      tex.needsUpdate = true;
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      texRef.current = tex;
    } else {
      (texRef.current.image as { data: Uint8ClampedArray }).data = buf;
      texRef.current.needsUpdate = true;
    }
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.map = texRef.current;
      mat.opacity = opacity;
      mat.needsUpdate = true;
    }
  }, [data, opacity, tick]);

  if (!show || !data) return null;
  const [ox, oy, oz] = data.origin;
  const size = data.half * 2;
  return (
    <group>
      <mesh ref={meshRef} position={[ox, oy, oz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          transparent
          opacity={opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {data.contours.map((poly, i) =>
        poly.length >= 2 ? (
          <Line
            key={i}
            points={poly.map((p) => new THREE.Vector3(p[0], p[1], p[2]))}
            color="#94a3b8"
            lineWidth={1}
            transparent
            opacity={opacity * 0.85}
          />
        ) : null,
      )}
      {data.forces.map((f, i) => {
        const mag = Math.hypot(f.ex, f.ey, f.ez) + 1e-9;
        const s = 0.12 / mag;
        return (
          <Line
            key={`f-${i}`}
            points={[
              new THREE.Vector3(f.x, f.y, f.z),
              new THREE.Vector3(f.x + f.ex * s, f.y + f.ey * s, f.z + f.ez * s),
            ]}
            color="#64748b"
            lineWidth={1}
            transparent
            opacity={opacity * 0.7}
          />
        );
      })}
    </group>
  );
}

function ForceArrows() {
  const show = useSimStore((s) => s.showForceArrows);
  const [tick, setTick] = useState(0);
  useFrame(() => setTick((t) => (t + 1) % 100000));
  void tick;
  if (!show || !simEngine.roiEnergy?.arrows?.length) return null;
  return (
    <group>
      {simEngine.roiEnergy.arrows.map((a, i) => (
        <Line
          key={i}
          points={[
            new THREE.Vector3(a.ax, a.ay, a.az),
            new THREE.Vector3(a.bx, a.by, a.bz),
          ]}
          color={a.kind === "L1L2" ? "#a78bfa" : "#38bdf8"}
          lineWidth={1.5}
          transparent
          opacity={0.85}
        />
      ))}
    </group>
  );
}

function CameraRig() {
  const { camera, controls } = useThree() as {
    camera: THREE.PerspectiveCamera;
    controls: { target: THREE.Vector3; update?: () => void } | null;
  };
  const focusRequest = useSimStore((s) => s.focusRequest);
  const clampFocusRequest = useSimStore((s) => s.clampFocusRequest);
  const clampZoomLevel = useSimStore((s) => s.clampZoomLevel);
  const lastFocus = useRef(0);
  const lastClamp = useRef(0);

  useFrame(() => {
    const prot =
      simEngine.proteins[simEngine.focusedProteinIndex] ?? simEngine.proteins[0];
    if (!prot) return;
    const roi = roiWorldPos(prot);

    if (focusRequest !== lastFocus.current) {
      lastFocus.current = focusRequest;
      const dist = 1.55;
      camera.position.set(roi.x + dist * 0.85, roi.y + dist * 0.55, roi.z + dist);
      camera.lookAt(roi.x, roi.y, roi.z);
      if (controls?.target) {
        controls.target.set(roi.x, roi.y, roi.z);
        controls.update?.();
      }
    }

    if (simEngine.clampCapturing || (simEngine.isClampEvent && simEngine.eventPlayback)) {
      const mult =
        clampZoomLevel === "100"
          ? 1
          : clampZoomLevel === "75"
            ? 1 / 0.75
            : clampZoomLevel === "50"
              ? 2
              : 4;
      const base = 1.35 * mult;
      if (!simEngine.clampCamLock) {
        simEngine.clampCamLock = {
          x: roi.x + base * 0.7,
          y: roi.y + base * 0.45,
          z: roi.z + base * 0.85,
        };
      }
      const lock = simEngine.clampCamLock;
      camera.position.set(lock.x, lock.y, lock.z);
      camera.lookAt(roi.x, roi.y, roi.z);
      if (controls?.target) {
        controls.target.set(roi.x, roi.y, roi.z);
        controls.update?.();
      }
    } else if (clampFocusRequest !== lastClamp.current) {
      lastClamp.current = clampFocusRequest;
    }
  });

  return null;
}

function SimLoop() {
  const setFps = useSimStore((s) => s.setFps);
  const syncFromEngine = useSimStore((s) => s.syncFromEngine);
  const displayDurationSec = useSimStore((s) => s.displayDurationSec);
  const demoSpeed = useSimStore((s) => s.demoSpeed);
  const last = useRef(performance.now());
  const acc = useRef(0);
  const frames = useRef(0);
  const stepAcc = useRef(0);

  useFrame(() => {
    const now = performance.now();
    const dt = (now - last.current) / 1000;
    last.current = now;
    frames.current += 1;
    acc.current += dt;
    if (acc.current >= 0.5) {
      setFps(Math.round(frames.current / acc.current));
      frames.current = 0;
      acc.current = 0;
    }
    // Live UI only: demoSpeed scales stepping. Batch/export use engine.step() directly.
    const speed = demoSpeed > 0 ? demoSpeed : 0.5;
    const target = targetStepsPerSecond(displayDurationSec) * speed;
    stepAcc.current += (target / 60) * Math.min(dt * 60, 2);
    let steps = Math.floor(stepAcc.current);
    stepAcc.current -= steps;
    steps = Math.min(speed >= 1 ? 3 : 2, Math.max(0, steps));
    if (
      simEngine.playing &&
      useSimStore.getState().scrubIndex == null &&
      !simEngine.eventPlayback
    ) {
      for (let i = 0; i < steps; i++) simEngine.step();
    } else if (simEngine.eventPlayback) {
      for (let i = 0; i < Math.max(1, Math.min(2, steps || 1)); i++)
        simEngine.step();
    }
    syncFromEngine();
  });
  return null;
}

export function MoleculoCanvas() {
  return (
    <Canvas
      camera={{ position: [2.2, 1.4, 2.8], fov: 42, near: 0.01, far: 80 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "#070a10" }}
    >
      <color attach="background" args={["#070a10"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={0.85} />
      <directionalLight position={[-3, -2, -4]} intensity={0.25} />
      <DomainShell />
      <DomainWire />
      <HierarchySpheres />
      <ProteinProxies />
      <ParticlesView />
      <FieldDistribution />
      <ForceArrows />
      <CameraRig />
      <SimLoop />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={0.35}
        maxDistance={18}
      />
    </Canvas>
  );
}
