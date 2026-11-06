"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandSymbol } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { SITE_NAME } from "@/lib/site";

type State = "checking" | "form" | "error" | "done";

/**
 * Landing for the password-recovery email. The user arrives from Supabase with
 * a recovery session in the URL; we confirm the session and let them set a new
 * password.
 *
 * The screen state is derived from the auth context (configured, loading,
 * user) plus one local flag for the finished flow, so there is no effect-side
 * state syncing to get out of date.
 */
export function AuthResetForm() {
  const { user, loading, configured, updatePassword, signOut } = useAuth();
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state: State = done
    ? "done"
    : !configured
      ? "error"
      : loading
        ? "checking"
        : user
          ? "form"
          : "error";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 10) {
      setError("La contraseña debe tener al menos 10 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setBusy(true);
    const updateError = await updatePassword(password);
    setBusy(false);

    if (updateError) {
      setError(updateError);
      return;
    }

    // Close the recovery session so the browser does not stay signed in.
    await signOut();
    setDone(true);
  }

  return (
    <main className="auth-callback">
      <div className="auth-callback-card" aria-live="polite">
        <span className="auth-callback-brand" aria-hidden="true">
          <BrandSymbol />
        </span>

        {state === "checking" && (
          <>
            <span className="auth-callback-spinner" aria-hidden="true" />
            <h1>Un momento…</h1>
            <p>Comprobando tu enlace de recuperación.</p>
          </>
        )}

        {state === "error" && (
          <>
            <span className="auth-callback-icon" aria-hidden="true">
              <Icon name="alert" size={20} />
            </span>
            <h1>Enlace no válido</h1>
            <p>
              {!configured
                ? "La autenticación no está configurada en este entorno."
                : "Este enlace de recuperación no es válido o ha caducado. Vuelve a solicitar uno desde la pantalla de acceso."}
            </p>
            <div className="auth-callback-actions">
              <Link href="/login" className="btn btn-primary">
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}

        {state === "form" && (
          <>
            <h1>Crea tu nueva contraseña</h1>
            <p>Usa al menos 10 caracteres, con letras, símbolos y números.</p>
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field">
                <span>Contraseña nueva</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 10 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={10}
                  required
                />
              </label>
              <label className="auth-field">
                <span>Repite la contraseña</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  minLength={10}
                  required
                />
              </label>
              {error && (
                <div className="auth-message is-error" role="alert">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={busy}
              >
                {busy ? "Guardando…" : "Guardar contraseña"}
                {!busy && <Icon name="check" size={16} />}
              </button>
            </form>
            <p className="auth-legal">
              Al guardar, se cierran tus otras sesiones abiertas por seguridad.
            </p>
          </>
        )}

        {state === "done" && (
          <>
            <span className="auth-callback-icon" aria-hidden="true">
              <Icon name="check" size={20} />
            </span>
            <h1>Contraseña actualizada</h1>
            <p>
              Ya puedes entrar en {SITE_NAME} con tu contraseña nueva. Las otras
              sesiones se han cerrado.
            </p>
            <div className="auth-callback-actions">
              <Link href="/login" className="btn btn-primary">
                Entrar con la contraseña nueva
                <Icon name="arrowRight" size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
