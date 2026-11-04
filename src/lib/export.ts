import type { HabitData, ImportedData } from "./types";
import { dateKey, todayKey } from "./date";
import { normalizeImport } from "./validation";

export function buildExportPayload(data: HabitData) {
  return {
    app: "HabiTrack",
    version: 3,
    exportedAt: new Date().toISOString(),
    habits: data.habits,
    logs: data.logs,
  };
}

export function downloadExport(data: HabitData): string {
  const payload = buildExportPayload(data);
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `habitrack-${dateKey(new Date())}.json`;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);

  return new Date().toISOString();
}

export async function readImportFile(file: File): Promise<ImportedData> {
  if (file.size > 3 * 1024 * 1024) {
    throw new Error("El archivo supera los 3 MB.");
  }

  const text = await file.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("El archivo no es un JSON válido.");
  }

  const normalized = normalizeImport(parsed);
  return { ...normalized, fileName: file.name.slice(0, 120) };
}

export function countRecords(data: HabitData): number {
  return Object.values(data.logs).reduce(
    (acc, day) => acc + Object.keys(day).length,
    0,
  );
}

export function mergeData(current: HabitData, incoming: HabitData): HabitData {
  const habits = current.habits.map((habit) => ({ ...habit }));

  for (const habit of incoming.habits) {
    const index = habits.findIndex((item) => item.id === habit.id);
    if (index >= 0) {
      habits[index] = { ...habit };
    } else {
      habits.push({ ...habit });
    }
  }

  const logs = JSON.parse(JSON.stringify(current.logs)) as HabitData["logs"];
  for (const [key, day] of Object.entries(incoming.logs)) {
    logs[key] = { ...(logs[key] ?? {}), ...day };
  }

  return { habits, logs };
}

export function createBackupName(): string {
  return `habitrack-${todayKey()}.json`;
}
