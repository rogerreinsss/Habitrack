"use client";

import { useHabits } from "@/components/app/HabitProvider";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { activeHabits, todayProgress } from "@/lib/habits";
import { formatLongDate } from "@/lib/date";
import type { View } from "@/lib/types";

const TITLES: Record<View, string> = {
  today: "Hoy",
  habits: "Mis hábitos",
  stats: "Estadísticas",
  settings: "Ajustes",
};

interface TopbarProps {
  view: View;
  onSearch: () => void;
  onNew: () => void;
}

export function Topbar({ view, onSearch, onNew }: TopbarProps) {
  const { data } = useHabits();
  const progress = todayProgress(data);
  const active = activeHabits(data);
  const archived = data.habits.length - active.length;

  const subtitles: Record<View, string> = {
    today: `${progress.completed}/${progress.scheduled} completados · ${formatLongDate(new Date())}`,
    habits: `${active.length} activo${active.length === 1 ? "" : "s"}${
      archived > 0 ? ` · ${archived} archivado${archived === 1 ? "" : "s"}` : ""
    }`,
    stats: "Tu progreso en perspectiva",
    settings: "Preferencias y datos locales",
  };

  return (
    <header className="topbar">
      <div className="topbar-mobile-brand">
        <Brand href="/" compact />
      </div>

      <div className="topbar-left">
        <span className="topbar-title">{TITLES[view]}</span>
        <span className="topbar-sub">{subtitles[view]}</span>
      </div>

      <div className="topbar-actions">
        <ThemeToggle />
        <button
          type="button"
          className="btn btn-ghost topbar-search"
          onClick={onSearch}
          aria-keyshortcuts="Control+K Meta+K"
          title="Buscar o ir a… (Ctrl + K)"
        >
          <Icon name="search" size={15} />
          <span className="search-label">Buscar</span>
          <kbd>Ctrl K</kbd>
        </button>

        <button type="button" className="btn btn-primary" onClick={onNew}>
          <Icon name="plus" size={16} />
          <span>Nuevo hábito</span>
        </button>
      </div>
    </header>
  );
}
