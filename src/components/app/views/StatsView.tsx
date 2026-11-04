"use client";

import { useHabits } from "@/components/app/HabitProvider";
import { EmptyState } from "@/components/app/Common";
import { Icon } from "@/components/ui/Icon";
import {
  activeDaysThisMonth,
  activeHabits,
  bestStreak,
  bestWeekday,
  maxStreak,
  periodStats,
  rate,
  schedDay,
  streak,
  todayProgress,
  totalRecords,
} from "@/lib/habits";
import { dateKey } from "@/lib/date";

interface StatsViewProps {
  onHistory: (habitId: string) => void;
}

export function StatsView({ onHistory }: StatsViewProps) {
  const { data } = useHabits();
  const now = new Date();
  const active = activeHabits(data);

  if (active.length === 0) {
    return (
      <div className="view">
        <h1 className="sr-only">Estadísticas</h1>
        <EmptyState
          icon="◔"
          title="Sin datos todavía"
          description={
            data.habits.length > 0
              ? "Restaura un hábito archivado o crea uno nuevo para ver estadísticas."
              : "Añade tu primer hábito y marca algunos días para descubrir tus patrones."
          }
        />
      </div>
    );
  }

  const today = todayProgress(data, now);
  const avg7 = Math.round(
    active.reduce((acc, habit) => acc + rate(data, habit.id, 7), 0) /
      active.length,
  );
  const avg30 = Math.round(
    active.reduce((acc, habit) => acc + rate(data, habit.id, 30), 0) /
      active.length,
  );
  const topStreak = bestStreak(data, now);
  const records = totalRecords(data);

  const cards = [
    { label: "Hoy", value: `${today.completed}/${today.scheduled}`, sub: "completados" },
    { label: "7 días", value: `${avg7}%`, sub: "de éxito" },
    { label: "30 días", value: `${avg30}%`, sub: "promedio" },
    { label: "Racha", value: `${topStreak}`, sub: "días seguidos" },
    { label: "Hábitos", value: `${active.length}`, sub: "activos" },
    { label: "Registros", value: `${records}`, sub: "marcados" },
  ];

  const bars = active
    .map((habit) => ({ habit, value: rate(data, habit.id) }))
    .sort((a, b) => b.value - a.value);

  const activeIds = new Set(active.map((habit) => habit.id));
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const base = new Date(monday);
  base.setDate(monday.getDate() - 28);
  const todayStamp = dateKey(now);

  const heatmap = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    const key = dateKey(date);
    const future = key > todayStamp;
    const count = Object.keys(data.logs[key] ?? {}).filter((id) =>
      activeIds.has(id),
    ).length;
    const scheduled = active.filter(
      (habit) => schedDay(habit, date) && (!habit.created || habit.created <= key),
    ).length;
    const level =
      future || scheduled === 0 || count === 0
        ? 0
        : count / scheduled < 0.34
          ? 1
          : count / scheduled < 0.67
            ? 2
            : 3;

    return {
      key,
      label: date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      }),
      count,
      scheduled,
      level,
      future,
      today: key === todayStamp,
    };
  });

  const last = periodStats(data, 0, 29, now);
  const previous = periodStats(data, 30, 59, now);
  const delta =
    last.pct !== null && previous.pct !== null ? last.pct - previous.pct : null;
  const bestDay = bestWeekday(data, now);
  const ranked = active
    .map((habit) => ({
      habit,
      current: streak(data, habit.id, now),
      max: maxStreak(data, habit.id, now),
      consistency: rate(data, habit.id),
    }))
    .sort((a, b) => b.current - a.current);
  const topHabit = ranked[0] && ranked[0].current > 0 ? ranked[0] : null;
  const activeDays = activeDaysThisMonth(data, now);

  const insights = [
    {
      icon: "calendar" as const,
      label: "Mejor día",
      value: bestDay ? bestDay.name : "—",
      sub: bestDay ? `${bestDay.pct}% de éxito` : "Aún sin datos suficientes",
    },
    {
      icon: "flame" as const,
      label: "Racha top",
      value: topHabit ? topHabit.habit.name : "—",
      sub: topHabit ? `${topHabit.current} días seguidos` : "Sin rachas activas",
    },
    {
      icon: "target" as const,
      label: "Días activos",
      value: `${activeDays}`,
      sub: "este mes",
    },
    {
      icon: "trend" as const,
      label: "Tendencia",
      value:
        delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta} pts`,
      sub:
        previous.pct === null
          ? "Sin datos anteriores"
          : "vs 30 días anteriores",
    },
  ];

  return (
    <div className="view">
      <h1 className="sr-only">Estadísticas</h1>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <span className="stat-label">{card.label}</span>
            <span className="stat-value">{card.value}</span>
            <span className="stat-sub">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <span className="panel-icon">
              <Icon name="stats" size={16} />
            </span>
            <h2 className="panel-title">Tasa de éxito · 30 días</h2>
          </div>
          <div className="panel-body">
            <div className="chart-list">
              {bars.map(({ habit, value }) => (
                <div className="chart-row" key={habit.id}>
                  <span className="chart-label" title={habit.name}>
                    <span aria-hidden="true">{habit.emoji}</span>
                    {habit.name}
                  </span>
                  <span className="chart-track">
                    <span
                      className="chart-fill"
                      style={{ width: `${value}%` }}
                    />
                  </span>
                  <span className="chart-value">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <span className="panel-icon">
              <Icon name="calendar" size={16} />
            </span>
            <h2 className="panel-title">Actividad · 5 semanas</h2>
          </div>
          <div className="panel-body">
            <div className="heatmap-labels" aria-hidden="true">
              {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="heatmap" role="img" aria-label="Mapa de calor de actividad de las últimas cinco semanas">
              {heatmap.map((cell) => (
                <span
                  key={cell.key}
                  className={`heatmap-cell ${cell.future ? "is-future" : ""} ${
                    cell.today ? "is-today" : ""
                  }`}
                  data-level={cell.level}
                  title={`${cell.label}: ${cell.count}/${cell.scheduled}`}
                />
              ))}
            </div>
            <div className="heatmap-legend" aria-hidden="true">
              <span>Menos</span>
              {[0, 1, 2, 3].map((level) => (
                <i key={level} data-level={level} />
              ))}
              <span>Más</span>
            </div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <span className="panel-icon">
            <Icon name="sparkle" size={16} />
          </span>
          <h2 className="panel-title">Perspectiva</h2>
        </div>
        <div className="panel-body">
          <div className="insights-grid">
            {insights.map((insight) => (
              <div className="insight" key={insight.label}>
                <span className="insight-icon">
                  <Icon name={insight.icon} size={16} />
                </span>
                <div className="insight-body">
                  <span className="insight-label">{insight.label}</span>
                  <span className="insight-value" title={insight.value}>
                    {insight.value}
                  </span>
                  <span className="insight-sub">{insight.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <span className="panel-icon">
            <Icon name="star" size={16} />
          </span>
          <h2 className="panel-title">Ranking de rachas</h2>
        </div>
        <div className="panel-body panel-body-flush">
          <div className="streak-list">
            {ranked.map((row, index) => (
              <button
                key={row.habit.id}
                type="button"
                className="streak-row"
                onClick={() => onHistory(row.habit.id)}
                aria-label={`Ver historial de ${row.habit.name}`}
              >
                <span className="streak-medal">{index + 1}</span>
                <span className="streak-emoji" aria-hidden="true">
                  {row.habit.emoji}
                </span>
                <span className="streak-name">{row.habit.name}</span>
                <span className="streak-numbers">
                  <span className="streak-value">
                    {row.current > 0 ? `${row.current}d` : "—"}
                  </span>
                  <span className="streak-meta">
                    máx {row.max}d · {row.consistency}%
                  </span>
                </span>
                <Icon name="chevronRight" size={14} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
