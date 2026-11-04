"use client";

import { Icon } from "@/components/ui/Icon";
import { useHabits } from "@/components/app/HabitProvider";
import { isDone, lastSevenDays, rate, streak } from "@/lib/habits";
import { freqShort, todayKey } from "@/lib/date";
import type { Habit } from "@/lib/types";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onHistory: (habitId: string) => void;
}

function rateClass(value: number): string {
  if (value >= 70) return "is-high";
  if (value >= 40) return "is-mid";
  if (value > 0) return "is-low";
  return "is-zero";
}

export function HabitCard({ habit, onEdit, onHistory }: HabitCardProps) {
  const { data, toggleHabit, deleteHabit, archiveHabit } = useHabits();
  const key = todayKey();
  const done = isDone(data.logs, habit.id, key);
  const currentStreak = streak(data, habit.id);
  const consistency = rate(data, habit.id);
  const dots = lastSevenDays(data, habit.id);
  const archived = habit.archived;

  return (
    <article
      className={`habit-card ${done ? "is-done" : ""} ${
        archived ? "is-archived" : ""
      }`}
    >
      <button
        type="button"
        className={`habit-check ${done ? "is-checked" : ""}`}
        onClick={() => toggleHabit(habit.id)}
        disabled={archived}
        aria-pressed={done}
        aria-label={
          archived
            ? `Hábito archivado: ${habit.name}`
            : `${done ? "Desmarcar" : "Marcar"} ${habit.name}`
        }
      >
        {done && <Icon name="check" size={14} strokeWidth={2.2} />}
      </button>

      <span className="habit-emoji" aria-hidden="true">
        {habit.emoji}
      </span>

      <div className="habit-info">
        <h3 className="habit-name">{habit.name}</h3>
        {habit.desc && <p className="habit-desc">{habit.desc}</p>}

        <div className="habit-meta">
          <span className="tag tag-category">{habit.cat}</span>
          <span className="tag">{freqShort(habit.freq)}</span>
          {archived && <span className="tag tag-archived">Archivado</span>}
          {habit.tag && (
            <span className="tag tag-custom">#{habit.tag}</span>
          )}
          {currentStreak > 0 && (
            <span className="streak-badge">
              <Icon name="flame" size={12} />
              {currentStreak}d
            </span>
          )}

          <div className="week-dots" aria-hidden="true">
            {dots.map((dot) => (
              <span
                key={dot.key}
                className={`week-dot ${dot.done ? "is-filled" : ""} ${
                  dot.today ? "is-today" : ""
                }`}
                title={dot.key}
              />
            ))}
          </div>

          <button
            type="button"
            className="hist-link"
            onClick={() => onHistory(habit.id)}
            aria-label={`Ver historial de ${habit.name}`}
          >
            <Icon name="calendar" size={14} />
            <span>Historial</span>
          </button>
        </div>
      </div>

      <div className="habit-right">
        <span
          className={`rate-badge ${rateClass(consistency)}`}
          title={`${consistency}% de cumplimiento en 30 días`}
        >
          {consistency}%
        </span>

        <div className="habit-actions">
          {archived && (
            <button
              type="button"
              className="icon-btn icon-btn-accent"
              onClick={() => archiveHabit(habit.id, false)}
              aria-label={`Restaurar ${habit.name}`}
              title="Restaurar"
            >
              <Icon name="restore" size={16} />
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(habit)}
            aria-label={`Editar ${habit.name}`}
            title="Editar"
          >
            <Icon name="edit" size={16} />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn-ghost"
            onClick={() => deleteHabit(habit.id)}
            aria-label={`Eliminar ${habit.name}`}
            title="Eliminar"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
