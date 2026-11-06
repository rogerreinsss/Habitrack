"use client";

import { useState } from "react";
import { useHabits } from "@/components/app/HabitProvider";
import { HabitCard } from "@/components/app/HabitCard";
import { EmptyState, ProgressRing } from "@/components/app/Common";
import { Icon } from "@/components/ui/Icon";
import {
  activeHabits,
  bestStreak,
  todayProgress,
} from "@/lib/habits";
import { formatLongDate, plural } from "@/lib/date";
import type { Habit } from "@/lib/types";

interface TodayViewProps {
  onNew: () => void;
  onEdit: (habit: Habit) => void;
  onHistory: (habitId: string) => void;
  onGoToHabits: () => void;
}

function greetingFor(hour: number): string {
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function TodayView({
  onNew,
  onEdit,
  onHistory,
  onGoToHabits,
}: TodayViewProps) {
  const { data } = useHabits();
  const [filter, setFilter] = useState<string>("all");

  const now = new Date();
  const today = todayProgress(data, now);
  const active = activeHabits(data);
  const archivedCount = data.habits.length - active.length;
  const streakBest = bestStreak(data, now);
  const categories = ["all", ...new Set(today.habits.map((habit) => habit.cat))];
  const activeFilter =
    filter !== "all" && !categories.includes(filter) ? "all" : filter;

  const visible =
    activeFilter === "all"
      ? today.habits
      : today.habits.filter((habit) => habit.cat === activeFilter);

  const doneCount = today.completed;

  return (
    <div className="view">
      <section className={`today-hero ${today.allDone ? "is-complete" : ""}`}>
        <div className="today-hero-main">
          <ProgressRing percentage={today.percentage} />
          <div className="today-hero-copy">
            <p className="today-greeting">{greetingFor(now.getHours())}</p>
            <h1 className="today-date">{formatLongDate(now)}</h1>
            <p className="today-summary">
              {today.allDone
                ? "Todo completado. Hoy has cumplido."
                : `${doneCount}/${today.scheduled} completados`}
            </p>
            <div className="hero-chips">
              <span className="hero-chip">
                {plural(today.scheduled, "hábito", "hábitos")}
              </span>
              {doneCount > 0 && (
                <span className="hero-chip is-accent">
                  <Icon name="check" size={12} />
                  {plural(doneCount, "completado", "completados")}
                </span>
              )}
              {streakBest > 0 && (
                <span className="hero-chip">
                  <Icon name="flame" size={12} />
                  Racha {streakBest}d
                </span>
              )}
            </div>
          </div>
        </div>
        {today.allDone && (
          <div className="hero-glow" aria-hidden="true" />
        )}
      </section>

      {categories.length > 1 && (
        <div className="filter-bar" role="group" aria-label="Filtrar por categoría">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-chip ${
                activeFilter === category ? "is-active" : ""
              }`}
              onClick={() => setFilter(category)}
              aria-pressed={activeFilter === category}
            >
              {category === "all" ? "Todos" : category}
            </button>
          ))}
        </div>
      )}

      <div className="section-head">
        <h2 className="section-label">Hábitos de hoy</h2>
        <span className="section-count">{visible.length}</span>
      </div>

      {visible.length > 0 ? (
        <div className="habits-grid">
          {visible.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={onEdit}
              onHistory={onHistory}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="✦"
          title={
            active.length === 0 && archivedCount > 0
              ? "Todos tus hábitos están archivados"
              : "Sin hábitos para hoy"
          }
          description={
            active.length === 0 && archivedCount > 0
              ? "Restaura los que quieras retomar y vuelve a tu ritmo."
              : "Crea tu primer hábito y empieza con algo pequeño."
          }
          action={
            active.length === 0 && archivedCount > 0 ? (
              <button type="button" className="btn btn-ghost" onClick={onGoToHabits}>
                Ver archivados
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={onNew}>
                <Icon name="plus" size={16} />
                Crear hábito
              </button>
            )
          }
        />
      )}
    </div>
  );
}
