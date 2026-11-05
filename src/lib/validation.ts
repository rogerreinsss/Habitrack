import {
  CATEGORIES,
  FREQUENCIES,
  type Category,
  type Frequency,
  type Habit,
  type HabitData,
  type Logs,
} from "./types";
import { isValidDateKey, todayKey, uid } from "./date";

export const MAX_HABITS = 500;
export const MAX_LOG_DAYS = 4000;
export const MAX_LOGS_PER_DAY = 500;
export const MAX_IMPORT_BYTES = 3 * 1024 * 1024;

const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function safeId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80);
  return id.length >= 1 ? id : null;
}

function safeCategory(value: unknown): Category {
  return CATEGORIES.includes(value as Category)
    ? (value as Category)
    : "Otro";
}

function safeFrequency(value: unknown): Frequency {
  return FREQUENCIES.includes(value as Frequency)
    ? (value as Frequency)
    : "daily";
}

function safeEmoji(value: unknown): string {
  if (typeof value !== "string") return "🌟";
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f<>"'&]/g, "")
    .trim()
    .slice(0, 8);
  return cleaned || "🌟";
}

function safeCreated(value: unknown): string {
  return isValidDateKey(value) ? value : todayKey();
}

/**
 * Rebuilds a habit object from untrusted input. Unknown properties are dropped,
 * ids are normalized and every string is length-limited.
 */
export function sanitizeHabit(
  input: unknown,
  forcedId?: string,
): Habit | null {
  const raw = asRecord(input);
  if (!raw) return null;

  const name = cleanText(raw.name, 60);
  if (!name) return null;

  const id = forcedId ?? safeId(raw.id) ?? uid();

  return {
    id,
    name,
    desc: cleanText(raw.desc, 200),
    cat: safeCategory(raw.cat),
    freq: safeFrequency(raw.freq),
    tag: cleanText(raw.tag, 30),
    emoji: safeEmoji(raw.emoji),
    created: safeCreated(raw.created),
    archived: raw.archived === true,
  };
}

function sanitizeLogs(input: unknown, habitIds: Set<string>): Logs {
  const raw = asRecord(input);
  if (!raw) return {};

  const logs: Logs = {};
  let dayCount = 0;

  for (const [key, value] of Object.entries(raw)) {
    if (dayCount >= MAX_LOG_DAYS) break;
    if (DANGEROUS_KEYS.has(key) || !isValidDateKey(key)) continue;

    const day = asRecord(value);
    if (!day) continue;

    const entries: [string, true][] = [];
    for (const [habitId, done] of Object.entries(day)) {
      if (entries.length >= MAX_LOGS_PER_DAY) break;
      if (done !== true) continue;
      if (DANGEROUS_KEYS.has(habitId)) continue;
      if (!habitIds.has(habitId)) continue;
      entries.push([habitId, true]);
    }

    if (entries.length > 0) {
      logs[key] = Object.fromEntries(entries) as Record<string, true>;
      dayCount += 1;
    }
  }

  return logs;
}

/**
 * Normalizes local data or imported data. Returns a fresh object that shares no
 * references with the input, so it is safe to store in React state.
 */
export function sanitizeData(input: unknown): HabitData {
  const raw = asRecord(input);
  if (!raw) return { habits: [], logs: {} };

  const rawHabits = Array.isArray(raw.habits)
    ? raw.habits.slice(0, MAX_HABITS)
    : [];
  const usedIds = new Set<string>();
  const habits: Habit[] = [];

  for (const entry of rawHabits) {
    const base = sanitizeHabit(entry);
    if (!base) continue;
    let id = base.id;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${base.id.slice(0, 72)}-${suffix++}`;
    }
    usedIds.add(id);
    habits.push(id === base.id ? base : { ...base, id });
  }

  return {
    habits,
    logs: sanitizeLogs(raw.logs, usedIds),
  };
}

export function normalizeImport(raw: unknown): HabitData {
  const outer = asRecord(raw);
  if (!outer) {
    throw new Error("El archivo no tiene el formato de Motiveva.");
  }

  const payload = asRecord(outer.data) ?? outer;
  if (!Array.isArray(payload.habits) || !asRecord(payload.logs)) {
    throw new Error("El archivo no tiene el formato de Motiveva.");
  }

  const data = sanitizeData(payload);
  if (data.habits.length === 0) {
    throw new Error("No se encontraron hábitos válidos.");
  }

  return data;
}
