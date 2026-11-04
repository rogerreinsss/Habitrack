"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHabits } from "@/components/app/HabitProvider";
import { useToast } from "@/components/app/ToastProvider";
import { Sidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { MobileNav } from "@/components/app/MobileNav";
import { HabitEditor } from "@/components/app/HabitEditor";
import { HistoryModal } from "@/components/app/HistoryModal";
import { ImportModal } from "@/components/app/ImportModal";
import { CommandPalette } from "@/components/app/CommandPalette";
import { TodayView } from "@/components/app/views/TodayView";
import { HabitsView } from "@/components/app/views/HabitsView";
import { StatsView } from "@/components/app/views/StatsView";
import { SettingsView } from "@/components/app/views/SettingsView";
import { readImportFile } from "@/lib/export";
import { MOTION_KEY, readPreference } from "@/lib/storage";
import type { Habit, ImportedData, View } from "@/lib/types";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function HabitApp() {
  const { hydrated, importData, exportAll } = useHabits();
  const { toast } = useToast();

  const [view, setView] = useState<View>("today");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<ImportedData | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const modalOpen =
    editorOpen || historyId !== null || commandOpen || pendingImport !== null;

  // Apply the stored motion preference before the settings view is visited.
  useEffect(() => {
    document.documentElement.dataset.motion =
      readPreference(MOTION_KEY) === "1" ? "reduced" : "full";
  }, []);

  const openNew = useCallback(() => {
    setEditing(null);
    setEditorOpen(true);
  }, []);

  const openEdit = useCallback((habit: Habit) => {
    setEditing(habit);
    setEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditing(null);
  }, []);

  const openHistory = useCallback((habitId: string) => {
    setHistoryId(habitId);
  }, []);

  const openImport = useCallback(() => {
    fileInput.current?.click();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.repeat ||
        modalOpen ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "n":
          event.preventDefault();
          openNew();
          break;
        case "t":
          setView("today");
          break;
        case "h":
          setView("habits");
          break;
        case "s":
          setView("stats");
          break;
        case ",":
          setView("settings");
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, openNew]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const imported = await readImportFile(file);
      setPendingImport(imported);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo leer el archivo.";
      toast(message, "error");
    }
  }

  function applyImport(mode: "merge" | "replace") {
    if (!pendingImport) return;
    importData(mode, pendingImport);
    setPendingImport(null);
  }

  if (!hydrated) {
    return (
      <div className="app-loading" aria-live="polite">
        <span className="app-loading-mark" aria-hidden="true">
          ✦
        </span>
        <span>Cargando tu espacio…</span>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} onNavigate={setView} />

      <main className="main" id="contenido" tabIndex={-1}>
        <Topbar
          view={view}
          onSearch={() => setCommandOpen(true)}
          onNew={openNew}
        />

        <div className="content">
          {view === "today" && (
            <TodayView
              onNew={openNew}
              onEdit={openEdit}
              onHistory={openHistory}
              onGoToHabits={() => setView("habits")}
            />
          )}
          {view === "habits" && (
            <HabitsView
              onNew={openNew}
              onEdit={openEdit}
              onHistory={openHistory}
            />
          )}
          {view === "stats" && <StatsView onHistory={openHistory} />}
          {view === "settings" && <SettingsView onImport={openImport} />}
        </div>
      </main>

      <MobileNav view={view} onNavigate={setView} onNew={openNew} />

      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={handleFileChange}
      />

      {editorOpen && <HabitEditor habit={editing} onClose={closeEditor} />}

      {historyId !== null && (
        <HistoryModal habitId={historyId} onClose={() => setHistoryId(null)} />
      )}

      {commandOpen && (
        <CommandPalette
          onClose={() => setCommandOpen(false)}
          onNavigate={setView}
          onNewHabit={openNew}
          onImport={openImport}
          onExport={exportAll}
          onHistory={openHistory}
        />
      )}

      {pendingImport && (
        <ImportModal
          imported={pendingImport}
          onApply={applyImport}
          onClose={() => setPendingImport(null)}
        />
      )}
    </div>
  );
}
