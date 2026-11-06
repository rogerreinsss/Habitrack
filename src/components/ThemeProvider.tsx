"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  readPreference,
  removePreference,
  THEME_KEY,
  writePreference,
} from "@/lib/storage";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: "#F5F4ED",
  dark: "#0C1310",
};

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [system, setSystem] = useState<ResolvedTheme>("light");

  const resolvedTheme: ResolvedTheme = mode === "system" ? system : mode;

  useEffect(() => {
    const stored = readPreference(THEME_KEY);
    // Preferences hydrate after mount so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isThemeMode(stored)) setModeState(stored);

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => setSystem(query.matches ? "dark" : "light");
    syncSystem();

    const onSystemChange = (event: MediaQueryListEvent) => {
      setSystem(event.matches ? "dark" : "light");
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return;
      setModeState(isThemeMode(event.newValue) ? event.newValue : "system");
    };

    query.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);

    return () => {
      query.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    if (next === "system") {
      removePreference(THEME_KEY);
    } else {
      writePreference(THEME_KEY, next);
    }
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      const next: ThemeMode =
        current === "light" ? "dark" : current === "dark" ? "system" : "light";
      if (next === "system") {
        removePreference(THEME_KEY);
      } else {
        writePreference(THEME_KEY, next);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, resolvedTheme, setMode, cycleMode }),
    [mode, resolvedTheme, setMode, cycleMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
}
