"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/app/Modal";
import { useHabits } from "@/components/app/HabitProvider";
import { Icon, type IconName } from "@/components/ui/Icon";
import { freqLabel } from "@/lib/date";
import type { View } from "@/lib/types";

interface CommandPaletteProps {
  onClose: () => void;
  onNavigate: (view: View) => void;
  onNewHabit: () => void;
  onImport: () => void;
  onExport: () => void;
  onHistory: (habitId: string) => void;
}

interface CommandItem {
  id: string;
  group: "Acciones" | "Hábitos";
  icon?: string;
  iconName?: IconName;
  title: string;
  sub: string;
  hint?: string;
  keywords: string;
  run: () => void;
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function CommandPalette({
  onClose,
  onNavigate,
  onNewHabit,
  onImport,
  onExport,
  onHistory,
}: CommandPaletteProps) {
  const { data } = useHabits();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const items = useMemo<CommandItem[]>(() => {
    const actions: CommandItem[] = [
      {
        id: "action-new",
        group: "Acciones",
        iconName: "plus",
        title: "Nuevo hábito",
        sub: "Crear un hábito",
        hint: "N",
        keywords: "crear nuevo añadir agregar",
        run: onNewHabit,
      },
      {
        id: "action-today",
        group: "Acciones",
        iconName: "today",
        title: "Ir a Hoy",
        sub: "Vista diaria",
        hint: "T",
        keywords: "today inicio diario",
        run: () => onNavigate("today"),
      },
      {
        id: "action-habits",
        group: "Acciones",
        iconName: "habits",
        title: "Mis hábitos",
        sub: "Gestiona tu lista completa",
        hint: "H",
        keywords: "habits lista todos",
        run: () => onNavigate("habits"),
      },
      {
        id: "action-stats",
        group: "Acciones",
        iconName: "stats",
        title: "Estadísticas",
        sub: "Progreso y perspectiva",
        hint: "S",
        keywords: "stats progreso datos gráficas",
        run: () => onNavigate("stats"),
      },
      {
        id: "action-settings",
        group: "Acciones",
        iconName: "settings",
        title: "Ajustes",
        sub: "Preferencias y datos",
        hint: ",",
        keywords: "settings configuración privacidad",
        run: () => onNavigate("settings"),
      },
      {
        id: "action-export",
        group: "Acciones",
        iconName: "download",
        title: "Exportar datos",
        sub: "Descargar una copia JSON",
        keywords: "backup copia exportar",
        run: onExport,
      },
      {
        id: "action-import",
        group: "Acciones",
        iconName: "upload",
        title: "Importar datos",
        sub: "Restaurar o combinar una copia",
        keywords: "restore json importar",
        run: onImport,
      },
    ];

    const normalized = normalize(query.trim());

    const filteredActions = actions.filter((action) => {
      if (!normalized) return true;
      return normalize(`${action.title} ${action.sub} ${action.keywords}`).includes(
        normalized,
      );
    });

    const habits: CommandItem[] = data.habits
      .filter((habit) => {
        if (!normalized) return true;
        return normalize(
          [habit.name, habit.desc, habit.cat, habit.tag, habit.emoji].join(" "),
        ).includes(normalized);
      })
      .slice(0, normalized ? 20 : 8)
      .map((habit) => ({
        id: `habit-${habit.id}`,
        group: "Hábitos",
        icon: habit.emoji,
        title: habit.name,
        sub: `${habit.cat} · ${freqLabel(habit.freq)}${
          habit.archived ? " · Archivado" : ""
        }`,
        keywords: "",
        run: () => onHistory(habit.id),
      }));

    return [...filteredActions, ...habits];
  }, [data.habits, onExport, onHistory, onImport, onNavigate, onNewHabit, query]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(".is-active");
    node?.scrollIntoView({ block: "nearest" });
  }, [active, items.length]);

  const activeIndex = items.length ? Math.min(active, items.length - 1) : 0;

  function runItem(item: CommandItem | undefined) {
    if (!item) return;
    onClose();
    item.run();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => (items.length ? (value + 1) % items.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) =>
        items.length ? (value - 1 + items.length) % items.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      runItem(items[activeIndex]);
    }
  }

  let runningIndex = -1;

  return (
    <Modal onClose={onClose} ariaLabel="Buscar y ejecutar acciones" className="command-modal" overlayClassName="command-overlay">
      <div className="command-head">
        <Icon name="search" size={18} />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar hábitos o acciones…"
          autoComplete="off"
          spellCheck={false}
          aria-label="Buscar hábitos o acciones"
          data-autofocus
        />
        <kbd>Esc</kbd>
      </div>

      <div className="command-results" ref={listRef} role="listbox" aria-label="Resultados">
        {items.length === 0 && (
          <div className="command-empty">
            Sin resultados para «{query.trim()}».
          </div>
        )}

        {(["Acciones", "Hábitos"] as const).map((group) => {
          const groupItems = items.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="command-section">
              <span className="command-section-label">{group}</span>
              {groupItems.map((item) => {
                runningIndex += 1;
                const index = runningIndex;
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`command-item ${isActive ? "is-active" : ""}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => runItem(item)}
                  >
                    <span className="command-icon" aria-hidden="true">
                      {item.icon ?? (
                        <Icon name={item.iconName ?? "sparkle"} size={16} />
                      )}
                    </span>
                    <span className="command-copy">
                      <span className="command-title">{item.title}</span>
                      <span className="command-sub">{item.sub}</span>
                    </span>
                    {item.hint && <span className="command-key">{item.hint}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="command-foot">
        <span>↑↓ navegar</span>
        <span>Enter abrir</span>
        <span>
          <kbd>Ctrl</kbd>
          <kbd>K</kbd> abrir
        </span>
      </div>
    </Modal>
  );
}
