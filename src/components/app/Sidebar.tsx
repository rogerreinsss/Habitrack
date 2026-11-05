"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
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
  const { data, syncStatus } = useHabits();
  const { user, signOut } = useAuth();
  const progress = todayProgress(data);
  const active = activeHabits(data);
  const archived = data.habits.length - active.length;
  const topStreak = bestStreak(data);
  const accountName =
    (typeof user?.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.trim()) ||
    (typeof user?.user_metadata?.name === "string" &&
      user.user_metadata.name.trim()) ||
    user?.email?.split("@")[0] ||
    "Tu espacio local";
  const initials = accountName.slice(0, 2).toUpperCase();
  const accountSub = !user
    ? `${plural(active.length, "hábito activo", "hábitos activos")}${
        archived > 0
          ? ` · ${archived} archivado${archived === 1 ? "" : "s"}`
          : ""
      }`
    : syncStatus === "synced"
      ? "Sincronizado en la nube"
      : syncStatus === "syncing"
        ? "Sincronizando…"
        : syncStatus === "error"
          ? "Solo en este dispositivo"
          : "Cuenta conectada";

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
          <span
            className={`user-avatar ${user ? "is-account" : ""}`}
            aria-hidden="true"
          >
            {user ? initials : <Icon name="sparkle" size={16} />}
          </span>
          <div className="user-copy">
            <span className="user-name">{accountName}</span>
            <span className="user-sub" title={accountSub}>
              {accountSub}
            </span>
          </div>
        </div>

        {user ? (
          <button
            type="button"
            className="sidebar-account-action"
            onClick={() => void signOut()}
          >
            <Icon name="external" size={13} />
            Cerrar sesión
          </button>
        ) : (
          <Link href="/login" className="sidebar-account-action">
            <Icon name="globe" size={13} />
            Iniciar sesión para sincronizar
          </Link>
        )}

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
