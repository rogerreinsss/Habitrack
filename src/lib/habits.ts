import type { Habit, HabitData, Logs } from "./types";
import { dateKey } from "./date";

export function activeHabits(data: HabitData): Habit[] {
  return data.habits.filter((habit) => !habit.archived);
}

export function schedDay(habit: Habit, date: Date): boolean {
  const weekday = date.getDay();
  if (habit.freq === "daily") return true;
  if (habit.freq === "weekdays") return weekday >= 1 && weekday <= 5;
  if (habit.freq === "weekend") return weekday === 0 || weekday === 6;
  return true;
}

export function isScheduledToday(habit: Habit, now = new Date()): boolean {
  return schedDay(habit, now);
}

export function isDone(logs: Logs, habitId: string, key: string): boolean {
  return logs[key]?.[habitId] === true;
}

/** Returns a new logs object with the entry for `habitId` on `key` toggled. */
export function toggleLog(
  logs: Logs,
  habitId: string,
  key: string,
): Logs {
  const day = { ...(logs[key] ?? {}) };

  if (day[habitId]) {
    delete day[habitId];
  } else {
    day[habitId] = true;
  }

  const next: Logs = { ...logs };
  if (Object.keys(day).length === 0) {
    delete next[key];
  } else {
    next[key] = day;
  }
  return next;
}

export function streak(data: HabitData, habitId: string, now = new Date()): number {
  const habit = data.habits.find((item) => item.id === habitId);
  if (!habit) return 0;

  let total = 0;
  const cursor = new Date(now);

  if (
    schedDay(habit, cursor) &&
    !isDone(data.logs, habitId, dateKey(cursor))
  ) {
    cursor.setDate(cursor.getDate() - 1);
  }

  for (let i = 0; i < 730; i += 1) {
    if (!schedDay(habit, cursor)) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (isDone(data.logs, habitId, dateKey(cursor))) {
      total += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return total;
}

export function maxStreak(
  data: HabitData,
  habitId: string,
  now = new Date(),
): number {
  const habit = data.habits.find((item) => item.id === habitId);
  if (!habit) return 0;

  let best = 0;
  let current = 0;
  const cursor = new Date(now);
  cursor.setDate(cursor.getDate() - 729);

  for (let i = 0; i < 730; i += 1) {
    if (schedDay(habit, cursor)) {
      if (isDone(data.logs, habitId, dateKey(cursor))) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return best;
}

export function rate(
  data: HabitData,
  habitId: string,
  days = 30,
  now = new Date(),
): number {
  const habit = data.habits.find((item) => item.id === habitId);
  if (!habit) return 0;

  const start = habit.created || "0000-01-01";
  let done = 0;
  let total = 0;

  for (let i = 0; i < days; i += 1) {
    const cursor = new Date(now);
    cursor.setDate(cursor.getDate() - i);
    if (!schedDay(habit, cursor)) continue;

    const key = dateKey(cursor);
    const dayDone = isDone(data.logs, habitId, key);
    if (key < start && !dayDone) continue;

    total += 1;
    if (dayDone) done += 1;
  }

  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export function bestStreak(data: HabitData, now = new Date()): number {
  const habits = activeHabits(data);
  if (habits.length === 0) return 0;
  return Math.max(...habits.map((habit) => streak(data, habit.id, now)));
}

export function todayProgress(data: HabitData, now = new Date()) {
  const scheduled = activeHabits(data).filter((habit) =>
    schedDay(habit, now),
  );
  const key = dateKey(now);
  const completed = scheduled.filter((habit) =>
    isDone(data.logs, habit.id, key),
  ).length;
  const percentage =
    scheduled.length > 0
      ? Math.round((completed / scheduled.length) * 100)
      : 0;

  return {
    scheduled: scheduled.length,
    completed,
    remaining: scheduled.length - completed,
    percentage,
    allDone: scheduled.length > 0 && completed === scheduled.length,
    habits: scheduled,
  };
}

export function periodStats(
  data: HabitData,
  startAgo: number,
  endAgo: number,
  now = new Date(),
): { done: number; total: number; pct: number | null } {
  const habits = activeHabits(data);
  let done = 0;
  let total = 0;

  for (let i = startAgo; i <= endAgo; i += 1) {
    const cursor = new Date(now);
    cursor.setDate(cursor.getDate() - i);
    const key = dateKey(cursor);

    for (const habit of habits) {
      if (!schedDay(habit, cursor)) continue;
      const start = habit.created || "0000-01-01";
      const dayDone = isDone(data.logs, habit.id, key);
      if (key < start && !dayDone) continue;
      total += 1;
      if (dayDone) done += 1;
    }
  }

  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : null };
}

export function bestWeekday(
  data: HabitData,
  now = new Date(),
): { name: string; pct: number } | null {
  const names = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const totals = Array.from({ length: 7 }, () => ({ done: 0, total: 0 }));
  const habits = activeHabits(data);

  for (let i = 0; i < 90; i += 1) {
    const cursor = new Date(now);
    cursor.setDate(cursor.getDate() - i);
    const key = dateKey(cursor);
    const weekday = cursor.getDay();
    const bucket = totals[weekday];
    if (!bucket) continue;

    for (const habit of habits) {
      if (!schedDay(habit, cursor)) continue;
      const start = habit.created || "0000-01-01";
      const dayDone = isDone(data.logs, habit.id, key);
      if (key < start && !dayDone) continue;

      bucket.total += 1;
      if (dayDone) bucket.done += 1;
    }
  }

  let best: { name: string; ratio: number } | null = null;
  for (let index = 0; index < totals.length; index += 1) {
    const bucket = totals[index];
    if (!bucket || bucket.total < 3 || bucket.done === 0) continue;
    const ratio = bucket.done / bucket.total;
    if (!best || ratio > best.ratio) {
      best = { name: names[index] ?? "—", ratio };
    }
  }

  return best
    ? { name: best.name, pct: Math.round(best.ratio * 100) }
    : null;
}

export function activeDaysThisMonth(
  data: HabitData,
  now = new Date(),
): number {
  const prefix = dateKey(now).slice(0, 7);
  const ids = new Set(activeHabits(data).map((habit) => habit.id));

  return Object.keys(data.logs).filter((key) => {
    if (!key.startsWith(prefix)) return false;
    const day = data.logs[key];
    return day ? Object.keys(day).some((id) => ids.has(id)) : false;
  }).length;
}

export function totalRecords(data: HabitData): number {
  const ids = new Set(activeHabits(data).map((habit) => habit.id));
  return Object.values(data.logs).reduce((acc, day) => {
    return acc + Object.keys(day).filter((id) => ids.has(id)).length;
  }, 0);
}

export function lastSevenDays(
  data: HabitData,
  habitId: string,
  now = new Date(),
): { key: string; done: boolean; today: boolean }[] {
  const today = dateKey(now);
  return Array.from({ length: 7 }, (_, index) => {
    const cursor = new Date(now);
    cursor.setDate(cursor.getDate() - (6 - index));
    const key = dateKey(cursor);
    return {
      key,
      done: isDone(data.logs, habitId, key),
      today: key === today,
    };
  });
}

export function monthHistory(
  habit: Habit,
  logs: Logs,
  year: number,
  month: number,
  now = new Date(),
): { scheduled: number; done: number; pct: number | null } {
  const isCurrent =
    year === now.getFullYear() && month === now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastDay = isCurrent ? now.getDate() : daysInMonth;
  const start = habit.created || "0000-01-01";

  let scheduled = 0;
  let done = 0;

  for (let day = 1; day <= lastDay; day += 1) {
    const date = new Date(year, month, day);
    if (!schedDay(habit, date)) continue;

    const key = dateKey(date);
    const dayDone = isDone(logs, habit.id, key);
    if (key < start && !dayDone) continue;

    scheduled += 1;
    if (dayDone) done += 1;
  }

  return {
    scheduled,
    done,
    pct: scheduled > 0 ? Math.round((done / scheduled) * 100) : null,
  };
}
