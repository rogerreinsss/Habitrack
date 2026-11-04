"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/app/Modal";
import { useHabits } from "@/components/app/HabitProvider";
import { Icon } from "@/components/ui/Icon";
import { isDone, maxStreak, monthHistory, schedDay, streak } from "@/lib/habits";
import { dateKey, formatMonthYear, freqLabel, todayKey } from "@/lib/date";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

interface HistoryModalProps {
  habitId: string;
  onClose: () => void;
}

export function HistoryModal({ habitId, onClose }: HistoryModalProps) {
  const { data, toggleHabit } = useHabits();
  const now = new Date();
  const habit = data.habits.find((item) => item.id === habitId);

  const [cursor, setCursor] = useState(() => ({
    year: now.getFullYear(),
    month: now.getMonth(),
  }));

  const isCurrent =
    cursor.year === now.getFullYear() && cursor.month === now.getMonth();
  const today = todayKey();

  const cells = useMemo(() => {
    if (!habit) return [];

    const first = new Date(cursor.year, cursor.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const start = habit.created || "0000-01-01";

    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - offset + 1;

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return { kind: "blank" as const, key: `blank-${index}` };
      }

      const date = new Date(cursor.year, cursor.month, dayNumber);
      const key = dateKey(date);
      const scheduled = schedDay(habit, date);
      const done = isDone(data.logs, habit.id, key);
      const future = key > today;
      const clickable = !future && (scheduled || done);
      const missed = !done && scheduled && key < today && key >= start;

      return {
        kind: "day" as const,
        key,
        dayNumber,
        done,
        scheduled,
        future,
        missed,
        clickable,
        today: key === today,
        label: date.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      };
    });
  }, [cursor, data.logs, habit, today]);

  if (!habit) return null;

  const summary = monthHistory(habit, data.logs, cursor.year, cursor.month, now);
  const currentStreak = streak(data, habit.id, now);
  const best = maxStreak(data, habit.id, now);

  function shiftMonth(delta: number) {
    setCursor((previous) => {
      const date = new Date(previous.year, previous.month + delta, 1);
      if (
        date.getFullYear() > now.getFullYear() ||
        (date.getFullYear() === now.getFullYear() &&
          date.getMonth() > now.getMonth())
      ) {
        return previous;
      }
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  }

  function goToday() {
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  }

  return (
    <Modal
      onClose={onClose}
      labelledBy="history-title"
      className="modal-history"
    >
      <header className="modal-header">
        <span className="modal-header-icon" aria-hidden="true">
          {habit.emoji}
        </span>
        <div>
          <h2 className="modal-title" id="history-title">
            {habit.name}
          </h2>
          <p className="modal-sub">
            {habit.cat} · {freqLabel(habit.freq)}
            {habit.tag ? ` · #${habit.tag}` : ""}
            {habit.archived ? " · Archivado" : ""}
          </p>
        </div>
        <button
          type="button"
          className="icon-btn modal-close"
          onClick={onClose}
          aria-label="Cerrar historial"
        >
          <Icon name="close" size={18} />
        </button>
      </header>

      <div className="modal-body">
        <div className="hist-summary">
          <div className="hist-stat">
            <span className="hist-stat-val">{currentStreak}d</span>
            <span className="hist-stat-lbl">Racha actual</span>
          </div>
          <div className="hist-stat">
            <span className="hist-stat-val">{best}d</span>
            <span className="hist-stat-lbl">Mejor racha</span>
          </div>
          <div className="hist-stat">
            <span className="hist-stat-val">
              {summary.pct === null ? "—" : `${summary.pct}%`}
            </span>
            <span className="hist-stat-lbl">
              {summary.done}/{summary.scheduled} este mes
            </span>
          </div>
        </div>

        <div className="cal-head">
          <button
            type="button"
            className="icon-btn cal-nav"
            onClick={() => shiftMonth(-1)}
            aria-label="Mes anterior"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <span className="cal-month" aria-live="polite">
            {formatMonthYear(new Date(cursor.year, cursor.month, 1))}
          </span>
          <button
            type="button"
            className="icon-btn cal-nav"
            onClick={() => shiftMonth(1)}
            disabled={isCurrent}
            aria-label="Mes siguiente"
          >
            <Icon name="chevronRight" size={16} />
          </button>
        </div>

        <div className="cal-weekdays" aria-hidden="true">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="cal-grid">
          {cells.map((cell) => {
            if (cell.kind === "blank") {
              return <span key={cell.key} className="cal-day is-out" />;
            }

            const classes = ["cal-day"];
            if (cell.done) classes.push("is-done");
            else if (cell.missed) classes.push("is-missed");
            if (cell.today) classes.push("is-today");
            if (!cell.scheduled && !cell.done) classes.push("is-off");
            if (cell.future) classes.push("is-future");

            const state = cell.done
              ? "completado"
              : cell.scheduled
                ? cell.future
                  ? "programado"
                  : "no completado"
                : "no programado";

            return (
              <button
                key={cell.key}
                type="button"
                className={classes.join(" ")}
                disabled={!cell.clickable}
                tabIndex={cell.clickable ? undefined : -1}
                aria-label={`${cell.label}, ${state}`}
                aria-pressed={cell.done}
                onClick={() => toggleHabit(habit.id, cell.key)}
              >
                {cell.dayNumber}
              </button>
            );
          })}
        </div>

        <div className="cal-legend" aria-hidden="true">
          <span>
            <i className="cal-dot is-done" />
            Completado
          </span>
          <span>
            <i className="cal-dot is-missed" />
            No completado
          </span>
          <span>
            <i className="cal-dot is-today" />
            Hoy
          </span>
        </div>

        <p className="cal-hint">
          Toca un día pasado para marcarlo o desmarcarlo. Los días futuros no
          se pueden editar.
        </p>
      </div>

      <footer className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={goToday}>
          Ir a hoy
        </button>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Listo
        </button>
      </footer>
    </Modal>
  );
}
