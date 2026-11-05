"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  HabitData,
  HabitDraft,
  ImportMode,
  Logs,
} from "@/lib/types";
import { EMPTY_DATA } from "@/lib/types";
import { todayKey, uid } from "@/lib/date";
import { toggleLog } from "@/lib/habits";
import { createSeedHabits } from "@/lib/seed";
import {
  LAST_EXPORT_KEY,
  readPreference,
  readStoredData,
  writePreference,
  writeStoredData,
} from "@/lib/storage";
import { sanitizeData, sanitizeHabit } from "@/lib/validation";
import { downloadExport, mergeData } from "@/lib/export";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase";
import { useToast } from "./ToastProvider";

export type SyncStatus = "local" | "syncing" | "synced" | "error";

interface HabitContextValue {
  data: HabitData;
  hydrated: boolean;
  storageError: boolean;
  lastExport: string | null;
  syncStatus: SyncStatus;
  toggleHabit: (habitId: string, key?: string) => void;
  saveHabit: (draft: HabitDraft, habitId?: string) => boolean;
  deleteHabit: (habitId: string) => void;
  archiveHabit: (habitId: string, archived: boolean) => void;
  importData: (mode: ImportMode, imported: HabitData) => void;
  resetAll: () => void;
  exportAll: () => void;
}

const HabitContext = createContext<HabitContextValue | null>(null);

function stripHabitLogs(logs: Logs, habitId: string): Logs {
  const next: Logs = {};

  for (const [key, day] of Object.entries(logs)) {
    const entries = Object.entries(day).filter(([id]) => id !== habitId);
    if (entries.length > 0) {
      next[key] = Object.fromEntries(entries) as Record<string, true>;
    }
  }

  return next;
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const [data, setData] = useState<HabitData>(EMPTY_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");
  const [cloudReadyFor, setCloudReadyFor] = useState<string | null>(null);
  const booted = useRef(false);
  const latestData = useRef<HabitData>(EMPTY_DATA);
  const remoteLoadedFor = useRef<string | null>(null);
  const userId = user?.id ?? null;

  // Load from localStorage after mount so server and client markup match.
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    const stored = readStoredData();
    if (stored === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration after mount
      setData({ habits: createSeedHabits(), logs: {} });
    } else {
      setData(stored);
    }

    const exported = readPreference(LAST_EXPORT_KEY);
    if (exported) setLastExport(exported);

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const ok = writeStoredData(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- surface persistence failures to the UI
    setStorageError(!ok);
  }, [data, hydrated]);

  useEffect(() => {
    latestData.current = data;
  }, [data]);

  // Pull the account copy once per signed-in user. Without an account the app
  // remains local-only; with one, cloud data becomes the source of truth.
  useEffect(() => {
    if (!hydrated) return;

    async function resetSyncState() {
      setCloudReadyFor(null);
      setSyncStatus("local");
    }

    if (!userId || !supabase) {
      remoteLoadedFor.current = null;
      void resetSyncState();
      return;
    }

    if (remoteLoadedFor.current === userId) return;

    const client = supabase;
    remoteLoadedFor.current = userId;
    let cancelled = false;

    async function loadCloud() {
      setCloudReadyFor(null);
      setSyncStatus("syncing");

      const { data: row, error } = await client
        .from("motiveva_data")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.error("No se pudo cargar la copia en la nube", error);
        setCloudReadyFor(null);
        setSyncStatus("error");
        return;
      }

      if (row?.data) {
        setData(sanitizeData(row.data));
        setCloudReadyFor(userId);
        setSyncStatus("synced");
        return;
      }

      const { error: createError } = await client.from("motiveva_data").upsert(
        {
          user_id: userId,
          data: latestData.current,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (cancelled) return;

      if (createError) {
        console.error("No se pudo crear la copia en la nube", createError);
        setCloudReadyFor(null);
        setSyncStatus("error");
        return;
      }

      setCloudReadyFor(userId);
      setSyncStatus("synced");
    }

    void loadCloud();

    return () => {
      cancelled = true;
      if (remoteLoadedFor.current === userId) {
        remoteLoadedFor.current = null;
      }
    };
  }, [hydrated, userId, supabase]);

  // Debounced cloud save. It waits until the account copy has loaded so local
  // seed data can never overwrite an existing cloud snapshot. The loaded user
  // id is compared instead of a boolean so switching accounts cannot save the
  // previous account's local state into the new account.
  useEffect(() => {
    if (!hydrated || !userId || !supabase || cloudReadyFor !== userId) return;

    const client = supabase;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflects pending background save
    setSyncStatus("syncing");

    const timer = window.setTimeout(async () => {
      const { error } = await client.from("motiveva_data").upsert(
        {
          user_id: userId,
          data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) {
        console.error("No se pudo guardar la copia en la nube", error);
        setSyncStatus("error");
        return;
      }

      setSyncStatus("synced");
    }, 750);

    return () => window.clearTimeout(timer);
  }, [data, hydrated, userId, supabase, cloudReadyFor]);

  function toggleHabit(habitId: string, key = todayKey()) {
    setData((previous) => ({
      ...previous,
      logs: toggleLog(previous.logs, habitId, key),
    }));
  }

  function saveHabit(draft: HabitDraft, habitId?: string): boolean {
    const existing = habitId
      ? data.habits.find((habit) => habit.id === habitId)
      : undefined;

    const habit = sanitizeHabit(
      {
        ...draft,
        id: habitId ?? uid(),
        created: existing?.created ?? todayKey(),
        archived: existing?.archived ?? false,
      },
      habitId ?? undefined,
    );

    if (!habit) return false;

    setData((previous) => ({
      ...previous,
      habits: existing
        ? previous.habits.map((item) =>
            item.id === habit.id ? habit : item,
          )
        : [...previous.habits, habit],
    }));

    return true;
  }

  function deleteHabit(habitId: string) {
    const habit = data.habits.find((item) => item.id === habitId);
    if (!habit) return;

    const snapshot = data;

    setData((previous) => ({
      habits: previous.habits.filter((item) => item.id !== habitId),
      logs: stripHabitLogs(previous.logs, habitId),
    }));

    toast(`«${habit.name}» eliminado`, "info", {
      label: "Deshacer",
      onClick: () => {
        setData(snapshot);
        toast("Hábito restaurado", "success");
      },
    });
  }

  function archiveHabit(habitId: string, archived: boolean) {
    const habit = data.habits.find((item) => item.id === habitId);
    if (!habit || habit.archived === archived) return;

    const snapshot = data;

    setData((previous) => ({
      ...previous,
      habits: previous.habits.map((item) =>
        item.id === habitId ? { ...item, archived } : item,
      ),
    }));

    toast(archived ? "Hábito archivado" : "Hábito restaurado", "info", {
      label: "Deshacer",
      onClick: () => {
        setData(snapshot);
        toast("Cambio deshecho", "info");
      },
    });
  }

  function importData(mode: ImportMode, imported: HabitData) {
    const snapshot = data;
    const clean = sanitizeData(imported);

    setData((previous) =>
      mode === "replace" ? clean : mergeData(previous, clean),
    );

    toast(mode === "replace" ? "Datos reemplazados" : "Datos combinados", "success", {
      label: "Deshacer",
      onClick: () => {
        setData(snapshot);
        toast("Importación deshecha", "info");
      },
    });
  }

  function resetAll() {
    const snapshot = data;
    setData({ habits: [], logs: {} });

    toast("Todos los datos eliminados", "warning", {
      label: "Deshacer",
      onClick: () => {
        setData(snapshot);
        toast("Datos restaurados", "success");
      },
    });
  }

  function exportAll() {
    const iso = downloadExport(data);
    writePreference(LAST_EXPORT_KEY, iso);
    setLastExport(iso);
    toast("Copia exportada", "success");
  }

  const value = useMemo<HabitContextValue>(
    () => ({
      data,
      hydrated,
      storageError,
      lastExport,
      syncStatus,
      toggleHabit,
      saveHabit,
      deleteHabit,
      archiveHabit,
      importData,
      resetAll,
      exportAll,
    }),
    // Actions close over the latest data on each render on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, hydrated, storageError, lastExport, syncStatus],
  );

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits(): HabitContextValue {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits debe usarse dentro de HabitProvider");
  }
  return context;
}
