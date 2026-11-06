"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useProfile } from "@/components/app/ProfileProvider";
import { BrandSymbol } from "@/components/ui/Brand";
import {
  MAIN_GOALS,
  MIN_AGE,
  MOTIVATION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  validateBirthDate,
  validateDisplayName,
  type MainGoal,
} from "@/lib/profile";
import { todayKey } from "@/lib/date";

const STEPS = ["name", "birth", "goal"] as const;

function metadataName(metadata: Record<string, unknown> | undefined): string {
  const value = metadata?.full_name ?? metadata?.name;
  return typeof value === "string" ? value.trim().slice(0, NAME_MAX_LENGTH) : "";
}

function LoadingShell({ children }: { children?: ReactNode }) {
  return (
    <div className="app-loading" aria-live="polite">
      <span className="app-loading-mark">
        <BrandSymbol />
      </span>
      {children ?? <span>Cargando tu perfil…</span>}
    </div>
  );
}

function OnboardingForm() {
  const { user, signOut } = useAuth();
  const { save } = useProfile();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState(() => metadataName(user?.user_metadata));
  const [birthDate, setBirthDate] = useState("");
  const [mainGoal, setMainGoal] = useState<MainGoal | null>(null);
  const [motivation, setMotivation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const problem =
      current === "name"
        ? validateDisplayName(displayName)
        : current === "birth"
          ? validateBirthDate(birthDate)
          : null;
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    if (!isLast) {
      setStep(step + 1);
      return;
    }

    setSaving(true);
    try {
      // On success the gate swaps this screen for the app.
      await save({ displayName, birthDate, mainGoal, motivation });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  return (
    <main className="auth-callback">
      <div className="auth-callback-card onboarding-card">
        <span className="auth-callback-brand" aria-hidden="true">
          <BrandSymbol />
        </span>

        <p className="onboarding-progress">
          Paso {step + 1} de {STEPS.length}
        </p>
        <div className="onboarding-dots" aria-hidden="true">
          {STEPS.map((item, index) => (
            <span key={item} className={index <= step ? "is-done" : ""} />
          ))}
        </div>

        <h1>
          {current === "name" && "¿Cómo te llamas?"}
          {current === "birth" && "¿Cuándo naciste?"}
          {current === "goal" && "¿Qué quieres mejorar?"}
        </h1>
        <p>
          {current === "name" && "Así te llamaremos dentro de Motiveva."}
          {current === "birth" && `Motiveva es para personas de ${MIN_AGE} años o más.`}
          {current === "goal" && "Es opcional. Podrás cambiarlo en Ajustes."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {current === "name" && (
            <label className="auth-field">
              <span>Tu nombre</span>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={NAME_MAX_LENGTH}
                autoComplete="given-name"
                autoFocus
              />
            </label>
          )}

          {current === "birth" && (
            <label className="auth-field">
              <span>Fecha de nacimiento</span>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                min="1900-01-01"
                max={todayKey()}
                autoComplete="bday"
                autoFocus
              />
            </label>
          )}

          {current === "goal" && (
            <>
              <div className="onboarding-goals" role="group" aria-label="Objetivo principal">
                {MAIN_GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    className={`onboarding-goal ${mainGoal === goal.value ? "is-selected" : ""}`}
                    aria-pressed={mainGoal === goal.value}
                    onClick={() =>
                      setMainGoal(mainGoal === goal.value ? null : goal.value)
                    }
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
              <label className="auth-field">
                <span>¿Qué te motiva? (opcional)</span>
                <textarea
                  className="onboarding-textarea"
                  value={motivation}
                  onChange={(event) => setMotivation(event.target.value)}
                  maxLength={MOTIVATION_MAX_LENGTH}
                  rows={3}
                />
              </label>
            </>
          )}

          {error && (
            <p className="auth-message is-error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn-primary auth-submit" type="submit" disabled={saving}>
            {saving ? "Guardando…" : isLast ? "Empezar" : "Continuar"}
          </button>
          {step > 0 && (
            <button
              type="button"
              className="btn btn-ghost auth-submit"
              disabled={saving}
              onClick={() => {
                setError(null);
                setStep(step - 1);
              }}
            >
              Atrás
            </button>
          )}
        </form>

        <button
          type="button"
          className="onboarding-signout"
          onClick={() => void signOut()}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

/** Shows the questions until the account has finished them, then the app. */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const { profile, loading, loadError, reload } = useProfile();

  if (loading) return <LoadingShell />;

  if (loadError) {
    return (
      <LoadingShell>
        <h1>No pudimos cargar tu perfil</h1>
        <p>{loadError}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={reload}>
          Reintentar
        </button>
      </LoadingShell>
    );
  }

  if (!profile?.onboardingCompletedAt) return <OnboardingForm />;

  return <>{children}</>;
}
