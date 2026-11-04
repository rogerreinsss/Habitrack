"use client";

import { Icon, type IconName } from "@/components/ui/Icon";
import { useHabits } from "@/components/app/HabitProvider";
import { todayProgress } from "@/lib/habits";
import type { View } from "@/lib/types";

const ITEMS: { view: View; label: string; icon: IconName }[] = [
  { view: "today", label: "Hoy", icon: "today" },
  { view: "habits", label: "Hábitos", icon: "habits" },
  { view: "stats", label: "Stats", icon: "stats" },
  { view: "settings", label: "Ajustes", icon: "settings" },
];

interface MobileNavProps {
  view: View;
  onNavigate: (view: View) => void;
  onNew: () => void;
}

export function MobileNav({ view, onNavigate, onNew }: MobileNavProps) {
  const { data } = useHabits();
  const progress = todayProgress(data);

  return (
    <>
      <nav className="mobile-nav" aria-label="Navegación de la app">
        {ITEMS.map((item) => (
          <button
            key={item.view}
            type="button"
            className={`mobile-nav-item ${view === item.view ? "is-active" : ""}`}
            onClick={() => onNavigate(item.view)}
            aria-current={view === item.view ? "page" : undefined}
          >
            <span className="mnav-icon">
              <Icon name={item.icon} size={19} />
            </span>
            <span>{item.label}</span>
            {item.view === "today" && progress.remaining > 0 && (
              <span className="mnav-badge" aria-hidden="true" />
            )}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="fab"
        onClick={onNew}
        aria-label="Añadir hábito"
      >
        <Icon name="plus" size={22} />
      </button>
    </>
  );
}
