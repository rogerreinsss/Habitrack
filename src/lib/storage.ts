import type { HabitData } from "./types";
import { sanitizeData } from "./validation";

export const STORAGE_KEY = "habitrackv2";
export const SORT_KEY = "habitrackSort";
export const LAST_EXPORT_KEY = "habitrackLastExport";
export const NOTIF_KEY = "habitrackNotif";
export const REMINDER_KEY = "habitrackReminderTime";
export const MOTION_KEY = "habitrackMotion";

/**
 * Returns null only when the user has never stored data (first visit).
 * Corrupted payloads are treated as empty data so we never crash on boot.
 */
export function readStoredData(): HabitData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    return sanitizeData(JSON.parse(raw));
  } catch {
    return { habits: [], logs: {} };
  }
}

export function writeStoredData(data: HabitData): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function readPreference(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePreference(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Storage can be unavailable in private mode. */
  }
}

export function removePreference(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* no-op */
  }
}

export function storageSizeKb(data: HabitData): number {
  try {
    return new Blob([JSON.stringify(data)]).size / 1024;
  } catch {
    return 0;
  }
}
