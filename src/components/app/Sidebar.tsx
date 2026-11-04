"use client";

import Link from "next/link";
import { useHabits } from "@/components/app/HabitProvider";
import { Brand } from "@/components/ui/Brand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { activeHabits, bestStreak, todayProgress } from "@/lib/habits";
import { plural } from "@/lib/date";
import type { View } from "@/lib/types";

const primaryNav: { view: View; label: string; icon: IconName }[] = [
  { view: "today", label: "Hoy", icon: "today" },
  { view: "habits", label: "Mis hábitos", icon: "habits" },
  { view: "stats", label: "Estadísticas", icon: "stats" },
];

interface SidebarProps {
  view: View;
  onNavigate: (view: View) => void;
}

export function Sidebar({ view, onNavigate }: SidebarProps) {
  const { data } = useHabits();
  const progress = todayProgress(data);
  const active = activeHabits(data);
  const archived = data.habits.length - active.length;
  const topStreak = bestStreak(data);

  return (
    <aside className="sidebar">
      <Brand href="/" />

      <div className="nav-section">Principal</div>
      <nav aria-label="Secciones de la app">
        {primaryNav.map((item) => (
          <button
            key={item.view}
            type="button"
            className={`nav-item ${view === item.view ? "is-active" : ""}`}
            onClick={() => onNavigate(item.view)}
            aria-current={view === item.view ? "page" : undefined}
          >
            <span className="nav-icon">
              <Icon name={item.icon} size={17} />
            </span>
            <span>{item.label}</span>
            {item.view === "today" && progress.remaining > 0 && (
              <span className="nav-badge">{progress.remaining}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-bottom">
        <button
          type="button"
          className={`nav-item ${view === "settings" ? "is-active" : ""}`}
          onClick={() => onNavigate("settings")}
          aria-current={view === "settings" ? "page" : undefined}
        >
          <span className="nav-icon">
            <Icon name="settings" size={17} />
          </span>
          <span>Ajustes</span>
        </button>

        <div className="sidebar-user">
          <span className="user-avatar" aria-hidden="true">
            <Icon name="sparkle" size={16} />
          </span>
          <div className="user-copy">
            <span className="user-name">Tu espacio local</span>
            <span className="user-sub">
              {plural(active.length, "hábito activo", "hábitos activos")}
              {archived > 0 ? ` · ${archived} archivado${archived === 1 ? "" : "s"}` : ""}
            </span>
          </div>
        </div>

        <div className="sidebar-streak">
          <Icon name="flame" size={14} />
          <span>Racha: {topStreak} día{topStreak === 1 ? "" : "s"}</span>
        </div>

        <Link href="/privacidad" className="sidebar-privacy">
          <Icon name="shield" size={13} />
          Privacidad
        </Link>
      </div>
    </aside>
  );
}
