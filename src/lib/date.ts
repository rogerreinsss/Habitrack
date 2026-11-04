import type { Frequency } from "./types";

export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  ).slice(0, 32);
}

export function isValidDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return false;
  if (y < 1970 || y > 2100) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

export function freqLabel(freq: Frequency): string {
  return (
    { daily: "Diario", weekdays: "Lun–Vie", weekend: "Fin de semana" }[freq] ??
    "Diario"
  );
}

export function freqShort(freq: Frequency): string {
  return { daily: "Diario", weekdays: "L–V", weekend: "Finde" }[freq] ?? "Diario";
}

export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function formatLongDate(date: Date): string {
  const value = date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatMonthYear(date: Date): string {
  const value = date.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
