"use client";

import { useMemo, useState } from "react";
import { useHabits } from "@/components/app/HabitProvider";
import { HabitCard } from "@/components/app/HabitCard";
import { EmptyState } from "@/components/app/Common";
import { Icon } from "@/components/ui/Icon";
import { activeHabits, rate, streak } from "@/lib/habits";
import { readPreference, writePreference, SORT_KEY } from "@/lib/storage";
import { SORT_OPTIONS, type Habit, type HabitSort } from "@/lib/types";

interface HabitsViewProps {
  onNew: () => void;
  onEdit: (habit: Habit) => void;
  onHistory: (habitId: string) => void;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("es").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function HabitsView({ onNew, onEdit, onHistory }: HabitsViewProps) {
  const { data } = useHabits();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<HabitSort>(() => {
    const stored = readPreference(SORT_KEY);
    return SORT_OPTIONS.some((option) => option.value === stored)
      ? (stored as HabitSort)
      : "recent";
  });

  const active = activeHabits(data);
  const archivedCount = data.habits.length - active.length;
  const categories = ["all", ...new Set(active.map((habit) => habit.cat))];
  const validFilter =
    filter === "all" ||
    filter === "archived" ||
    categories.includes(filter)
      ? filter
      : "all";

  function changeSort(value: HabitSort) {
    setSort(value);
    writePreference(SORT_KEY, value);
  }

  const list = useMemo(() => {
    let items = data.habits.slice();

    if (validFilter === "archived") {
      items = items.filter((habit) => habit.archived);
    } else if (validFilter === "all") {
      items = items.filter((habit) => !habit.archived);
    } else {
      items = items.filter(
        (habit) => !habit.archived && habit.cat === validFilter,
      );
    }

    const query = normalize(search.trim());
    if (query) {
      items = items.filter((habit) => {
        const haystack = normalize(
          [habit.name, habit.desc, habit.cat, habit.tag, `#${habit.tag}`, habit.emoji].join(" "),
        );
        return haystack.includes(query);
      });
    }

    const order = new Map(data.habits.map((habit, index) => [habit.id, index]));
    const sorters: Record<HabitSort, (a: Habit, b: Habit) => number> = {
      recent: (a, b) =>
        (b.created || "").localeCompare(a.created || "") ||
        (order.get(b.id) ?? 0) - (order.get(a.id) ?? 0),
      name: (a, b) => a.name.localeCompare(b.name, "es"),
      streak: (a, b) => streak(data, b.id) - streak(data, a.id),
      rate: (a, b) => rate(data, b.id) - rate(data, a.id),
    };

    return items.sort(sorters[sort]);
  }, [data, validFilter, search, sort]);

  const hasQuery = search.trim().length > 0;

  let emptyTitle = "Aún no hay hábitos";
  let emptyText = "Crea el primero y empieza con algo pequeño.";
  let emptyIcon = "✦";

  if (hasQuery) {
    emptyTitle = "Sin resultados";
    emptyText = "Prueba con otro nombre, categoría o etiqueta.";
    emptyIcon = "⌕";
  } else if (validFilter === "archived") {
    emptyTitle = "No hay hábitos archivados";
    emptyText =
      "Archiva un hábito desde su edición para guardarlo sin perder el historial.";
    emptyIcon = "◌";
  } else if (validFilter !== "all") {
    emptyTitle = "Sin hábitos en esta categoría";
    emptyText = "Cambia de categoría o crea uno nuevo.";
  } else if (active.length === 0 && archivedCount > 0) {
    emptyTitle = "No hay hábitos activos";
    emptyText = `Tienes ${archivedCount} archivado${
      archivedCount === 1 ? "" : "s"
    }. Restáuralos cuando quieras.`;
  }

  return (
    <div className="view">
      <div className="habits-toolbar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <span className="sr-only">Buscar hábitos</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, etiqueta…"
            autoComplete="off"
            spellCheck={false}
          />
          {hasQuery && (
            <button
              type="button"
              className="search-clear"
              aria-label="Limpiar búsqueda"
              onClick={() => setSearch("")}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </label>

        <div className="select-wrap">
          <label htmlFor="habit-sort" className="sr-only">
            Ordenar hábitos
          </label>
          <select
            id="habit-sort"
            className="form-control"
            value={sort}
            onChange={(event) => changeSort(event.target.value as HabitSort)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon name="chevronRight" size={14} className="select-chevron" />
        </div>
      </div>

      <div className="filter-bar" role="group" aria-label="Filtrar hábitos">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip ${
              validFilter === category ? "is-active" : ""
            }`}
            onClick={() => setFilter(category)}
            aria-pressed={validFilter === category}
          >
            {category === "all" ? "Todos" : category}
          </button>
        ))}
        {archivedCount > 0 && (
          <button
            type="button"
            className={`filter-chip ${
              validFilter === "archived" ? "is-active" : ""
            }`}
            onClick={() => setFilter("archived")}
            aria-pressed={validFilter === "archived"}
          >
            Archivados {archivedCount}
          </button>
        )}
        <button type="button" className="filter-chip is-add" onClick={onNew}>
          <Icon name="plus" size={13} />
          Nuevo
        </button>
      </div>

      <div className="section-head">
        <h1 className="section-label">Todos mis hábitos</h1>
        <span className="section-count">{list.length}</span>
      </div>

      {list.length > 0 ? (
        <div className="habits-grid">
          {list.map((habit) => (
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
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyText}
          action={
            hasQuery ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSearch("")}
              >
                Limpiar búsqueda
              </button>
            ) : validFilter === "archived" ? undefined : (
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
