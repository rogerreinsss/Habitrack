"use client";

import { useTheme, type ThemeMode } from "@/components/ThemeProvider";
import { Icon, type IconName } from "@/components/ui/Icon";

const MODE_LABEL: Record<ThemeMode, string> = {
  light: "Tema claro",
  dark: "Tema oscuro",
  system: "Tema del sistema",
};

const MODE_ICON: Record<ThemeMode, IconName> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { mode, cycleMode } = useTheme();
  const label = MODE_LABEL[mode];

  return (
    <button
      type="button"
      className={`icon-btn theme-toggle${className ? ` ${className}` : ""}`}
      onClick={cycleMode}
      title={`${label}. Cambiar tema.`}
      aria-label={`${label}. Cambiar tema.`}
    >
      <Icon name={MODE_ICON[mode]} size={16} />
    </button>
  );
}
