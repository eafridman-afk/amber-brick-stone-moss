/**
 * Browser filesystem I/O for scientific snapshots.
 * Prefers File System Access API (Chromium) so users can write to any
 * folder the browser can see — including WSL mounts (/mnt/c/, \\wsl$\…).
 * Falls back to download / file-input when the API is unavailable.
 */

import type { ScientificSnapshot } from "./scientific-stats";

export type IoResult =
  | { ok: true; method: "fs-access" | "download" | "upload"; detail: string }
  | { ok: false; error: string };

export type SaveBundle = {
  snapshotJson: string;
  snapshotCsv: string;
  energySeriesCsv?: string;
  eventLogCsv?: string;
  baseName: string;
};

/** Minimal typings for File System Access API (not always in TS lib). */
type DirHandle = {
  name: string;
  getFileHandle(
    name: string,
    opts?: { create?: boolean },
  ): Promise<{
    createWritable(): Promise<{
      write(data: string | Blob): Promise<void>;
      close(): Promise<void>;
    }>;
  }>;
};

declare global {
  interface Window {
    showDirectoryPicker?: (opts?: {
      id?: string;
      mode?: "read" | "readwrite";
      startIn?: string;
    }) => Promise<DirHandle>;
    showOpenFilePicker?: (opts?: {
      multiple?: boolean;
      types?: { description: string; accept: Record<string, string[]> }[];
    }) => Promise<
      {
        getFile(): Promise<File>;
      }[]
    >;
  }
}

export function supportsDirectoryPicker(): boolean {
  return typeof window !== "undefined" && typeof window.showDirectoryPicker === "function";
}

export function supportsFilePicker(): boolean {
  return typeof window !== "undefined" && typeof window.showOpenFilePicker === "function";
}

export function stampBaseName(prefix = "moleculosphere5d-scientific"): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${prefix}_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function pickSaveDirectory(): Promise<DirHandle | null> {
  if (!supportsDirectoryPicker()) return null;
  try {
    return await window.showDirectoryPicker!({
      id: "moleculosphere-bcdt",
      mode: "readwrite",
    });
  } catch (e) {
    // User cancel
    if (e instanceof DOMException && e.name === "AbortError") return null;
    throw e;
  }
}

export async function writeFilesToDirectory(
  dir: DirHandle,
  files: { name: string; content: string }[],
): Promise<void> {
  for (const f of files) {
    const handle = await dir.getFileHandle(f.name, { create: true });
    const w = await handle.createWritable();
    await w.write(f.content);
    await w.close();
  }
}

export function downloadText(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Save a full scientific bundle to a user-chosen folder (or download fallback).
 */
export async function saveScientificBundle(bundle: SaveBundle): Promise<IoResult> {
  const files = [
    { name: `${bundle.baseName}.json`, content: bundle.snapshotJson },
    { name: `${bundle.baseName}.csv`, content: bundle.snapshotCsv },
  ];
  if (bundle.energySeriesCsv) {
    files.push({
      name: `${bundle.baseName}_energy_series.csv`,
      content: bundle.energySeriesCsv,
    });
  }
  if (bundle.eventLogCsv) {
    files.push({
      name: `${bundle.baseName}_event_log.csv`,
      content: bundle.eventLogCsv,
    });
  }

  if (supportsDirectoryPicker()) {
    try {
      const dir = await pickSaveDirectory();
      if (!dir) return { ok: false, error: "Folder selection cancelled" };
      await writeFilesToDirectory(dir, files);
      return {
        ok: true,
        method: "fs-access",
        detail: `Saved ${files.length} files to “${dir.name}” (WSL / local drive OK)`,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Fall through to download
      for (const f of files) {
        const mime = f.name.endsWith(".csv") ? "text/csv" : "application/json";
        downloadText(f.name, f.content, mime);
      }
      return {
        ok: true,
        method: "download",
        detail: `FS Access failed (${msg}); downloaded ${files.length} files instead`,
      };
    }
  }

  for (const f of files) {
    const mime = f.name.endsWith(".csv") ? "text/csv" : "application/json";
    downloadText(f.name, f.content, mime);
  }
  return {
    ok: true,
    method: "download",
    detail: `Downloaded ${files.length} files (File System Access API unavailable)`,
  };
}

export async function loadJsonFromPicker(): Promise<
  { ok: true; text: string; name: string; method: "fs-access" | "upload" } | { ok: false; error: string }
> {
  if (supportsFilePicker()) {
    try {
      const handles = await window.showOpenFilePicker!({
        multiple: false,
        types: [
          {
            description: "Scientific snapshot JSON",
            accept: { "application/json": [".json"] },
          },
        ],
      });
      const file = await handles[0]!.getFile();
      const text = await file.text();
      return { ok: true, text, name: file.name, method: "fs-access" };
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return { ok: false, error: "File selection cancelled" };
      }
      // fall through to input
    }
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
        resolve({ ok: false, error: "No file selected" });
        return;
      }
      try {
        const text = await file.text();
        resolve({ ok: true, text, name: file.name, method: "upload" });
      } catch (e) {
        resolve({
          ok: false,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    };
    input.oncancel = () => {
      input.remove();
      resolve({ ok: false, error: "File selection cancelled" });
    };
    document.body.appendChild(input);
    input.click();
  });
}

export function parseScientificSnapshot(text: string): ScientificSnapshot {
  const data = JSON.parse(text) as ScientificSnapshot;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid snapshot JSON");
  }
  if (
    data.schema !== "moleculosphere5d.scientific_snapshot.v1" &&
    data.schema !== "moleculosphere5d.scientific_snapshot.v1.1"
  ) {
    // Accept unknown schema if core fields present
    if (!("behavior" in data) || !("hendersonHasselbalch" in data)) {
      throw new Error(`Unrecognized schema: ${String((data as { schema?: string }).schema)}`);
    }
  }
  return data;
}
