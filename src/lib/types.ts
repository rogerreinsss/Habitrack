export const CATEGORIES = [
  "Salud",
  "Mente",
  "Social",
  "Trabajo",
  "Fitness",
  "Otro",
] as const;


export type Category = (typeof CATEGORIES)[number];

export const FREQUENCIES = ["daily", "weekdays", "weekend"] as const;

export type Frequency = (typeof FREQUENCIES)[number];

export type HabitSort = "recent" | "name" | "streak" | "rate";

export type View = "today" | "habits" | "stats" | "settings";

export interface Habit {
  id: string;
  name: string;
  desc: string;
  cat: Category;
  freq: Frequency;
  tag: string;
  emoji: string;
  created: string;
  archived: boolean;
}

export type HabitLog = Record<string, true>;

export type Logs = Record<string, HabitLog>;

export interface HabitData {
  habits: Habit[];
  logs: Logs;
}

export interface ImportedData extends HabitData {
  fileName: string;
}

export interface HabitDraft {
  name: string;
  desc: string;
  cat: Category;
  freq: Frequency;
  tag: string;
  emoji: string;
}

export type ImportMode = "merge" | "replace";

export const EMPTY_DATA: HabitData = { habits: [], logs: {} };

export const SORT_OPTIONS: { value: HabitSort; label: string }[] = [
  { value: "recent", label: "Recientes" },
  { value: "name", label: "Nombre A–Z" },
  { value: "streak", label: "Mejor racha" },
  { value: "rate", label: "Cumplimiento" },
];
