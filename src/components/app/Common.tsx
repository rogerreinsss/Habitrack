"use client";

import type { ReactNode } from "react";

interface ProgressRingProps {
  percentage: number;
  label?: string;
  size?: number;
}

export function ProgressRing({
  percentage,
  label = "HOY",
  size = 96,
}: ProgressRingProps) {
  const radius = 37;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (circumference * clamped) / 100;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 90 90" width={size} height={size} aria-hidden="true">
        <circle className="ring-bg" cx="45" cy="45" r={radius} />
        <circle
          className="ring-fill"
          cx="45"
          cy="45"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-text">
        <span className="ring-value">{clamped}%</span>
        <span className="ring-label">{label}</span>
      </div>
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={`toggle ${disabled ? "is-disabled" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
    </label>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-text">{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
