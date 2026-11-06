"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandSymbol } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { APP_PATH } from "@/lib/site";

type Mode = "login" | "signup" | "verify" | "forgot";
type Status = { type: "error" | "success" | "info"; text: string } | null;

const MODE_COPY: Record<Mode, { title: string; lede: string }> = {
  login: {
    title: "Entra en Motiveva",
    lede: "Sincroniza tus hábitos y vuelve a ellos desde cualquier dispositivo.",
  },
  signup: {
    title: "Crea tu cuenta",
    lede: "Guarda tus hábitos en tu cuenta privada y sincronízalos entre dispositivos.",
  },
  verify: {
    title: "Confirma tu email",
    lede: "Te hemos enviado un código de 6 dígitos a tu correo. Escríbelo a continuación.",
  },
  forgot: {
    title: "Recupera tu contraseña",
    lede: "Te enviaremos un enlace para crear una contraseña nueva.",
  },
};

function GoogleMark() {
  return (
    <svg
      className="google-mark"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function AuthForm() {
  const router = useRouter();
  const {
    user,
    loading,
    configured,
    signIn,
    signUp,
    verifyEmailOtp,
    resendEmailOtp,
    signInWithGoogle,
    requestPasswordReset,
    signOut,
  } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  function changeMode(next: Mode) {
    setMode(next);
    setStatus(null);
    setCode("");
    setPassword("");
    setConfirm("");
  }

  async function goAfterAuth() {
    router.push(APP_PATH);
    router.refresh();
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (code.replace(/\s/g, "").length !== 6) {
      setStatus({ type: "error", text: "El código tiene 6 dígitos." });
      return;
    }

    setBusy(true);
    const error = await verifyEmailOtp(email, code);
    if (error) {
      setStatus({ type: "error", text: error });
      setBusy(false);
      return;
    }
    await goAfterAuth();
  }

  async function handleResend() {
    setStatus(null);
    setBusy(true);
    const error = await resendEmailOtp(email);
    setBusy(false);
    setStatus(
      error
        ? { type: "error", text: error }
        : { type: "success", text: "Enviamos un código nuevo. Mira tu correo." },
    );
  }

  async function handleForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatus({ type: "error", text: "Escribe tu email." });
      return;
    }

    setBusy(true);
    const error = await requestPasswordReset(cleanEmail);
    setBusy(false);
    if (error) {
      setStatus({ type: "error", text: error });
      return;
    }
    setStatus({
      type: "success",
      text: "Te hemos enviado un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setStatus({ type: "error", text: "Escribe tu email." });
      return;
    }
    if (mode === "signup" && password.length < 10) {
      setStatus({
        type: "error",
        text: "La contraseña debe tener al menos 10 caracteres.",
      });
      return;
    }
    if (mode === "signup" && password !== confirm) {
      setStatus({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    setBusy(true);

    if (mode === "login") {
      const error = await signIn(cleanEmail, password);
      if (error) {
        setStatus({ type: "error", text: error });
        setBusy(false);
        return;
      }
      await goAfterAuth();
      return;
    }

    const result = await signUp(cleanEmail, password);
    if (result.error) {
      setStatus({ type: "error", text: result.error });
      setBusy(false);
      return;
    }

    if (result.needsConfirmation) {
      setMode("verify");
      setBusy(false);
      return;
    }

    await goAfterAuth();
  }

  async function handleGoogle() {
    setStatus(null);
    setBusy(true);
    const error = await signInWithGoogle();
    if (error) {
      setStatus({ type: "error", text: error });
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-card auth-card-loading" aria-live="polite">
        <span className="auth-loading-mark">
          <BrandSymbol />
        </span>
        <p>Comprobando tu sesión…</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-card">
        <div className="auth-head">
          <span className="auth-mark" aria-hidden="true">
            <Icon name="check" size={18} />
          </span>
          <h1>Ya tienes sesión</h1>
          <p>
            Has entrado como <strong>{user.email}</strong>. Tus hábitos se
            sincronizan en tu cuenta.
          </p>
        </div>

        <div className="auth-session-actions">
          <Link href={APP_PATH} className="btn btn-primary btn-lg">
            Ir a la app
            <Icon name="arrowRight" size={16} />
          </Link>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => void signOut()}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const copy = MODE_COPY[mode];

  return (
    <div className="auth-card">
      <div className="auth-head">
        <span className="auth-mark">
          <BrandSymbol />
        </span>
        <h1>{copy.title}</h1>
        <p>{copy.lede}</p>
      </div>

      {mode === "verify" ? (
        <form className="auth-form" onSubmit={handleVerify}>
          <label className="auth-field">
            <span>Código de verificación</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={busy || !configured}
              maxLength={6}
              required
            />
          </label>

          {status && (
            <div className={`auth-message is-${status.type}`} role="status">
              {status.text}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={busy || !configured}
          >
            {busy ? "Comprobando…" : "Confirmar mi cuenta"}
            {!busy && <Icon name="arrowRight" size={16} />}
          </button>

          <p className="auth-switch">
            ¿No te ha llegado el código?{" "}
            <button type="button" onClick={() => void handleResend()}>
              Reenviar código
            </button>
          </p>
          <p className="auth-switch">
            <button type="button" onClick={() => changeMode("signup")}>
              Volver al registro
            </button>
          </p>
        </form>
      ) : (
        <>
          {mode !== "forgot" && (
            <>
              <div className="auth-tabs" role="tablist" aria-label="Tipo de acceso">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "login"}
                  className={mode === "login" ? "is-active" : ""}
                  onClick={() => changeMode("login")}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signup"}
                  className={mode === "signup" ? "is-active" : ""}
                  onClick={() => changeMode("signup")}
                >
                  Crear cuenta
                </button>
              </div>

              {!configured && (
                <div className="auth-message is-error" role="alert">
                  La autenticación no está configurada en este entorno.
                </div>
              )}

              <button
                type="button"
                className="btn btn-google"
                onClick={handleGoogle}
                disabled={busy || !configured}
              >
                <GoogleMark />
                Continuar con Google
              </button>

              <div className="auth-divider">
                <span>o con email</span>
              </div>
            </>
          )}

          <form
            className="auth-form"
            onSubmit={mode === "forgot" ? handleForgot : handleSubmit}
          >
            {mode === "forgot" && (
              <div className="auth-field">
                <span>Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={busy || !configured}
                  required
                />
              </div>
            )}

            {mode !== "forgot" && (
              <>
                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={busy || !configured}
                    required
                  />
                </label>

                <label className="auth-field">
                  <span>Contraseña</span>
                  <input
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    placeholder={
                      mode === "login" ? "Tu contraseña" : "Mínimo 10 caracteres"
                    }
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={busy || !configured}
                    minLength={mode === "signup" ? 10 : undefined}
                    required
                  />
                </label>

                {mode === "signup" && (
                  <label className="auth-field">
                    <span>Repite la contraseña</span>
                    <input
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repite tu contraseña"
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      disabled={busy || !configured}
                      minLength={10}
                      required
                    />
                  </label>
                )}
              </>
            )}

            {status && (
              <div className={`auth-message is-${status.type}`} role="status">
                {status.text}
              </div>
            )}

            {mode === "forgot" ? (
              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={busy || !configured}
              >
                {busy ? "Enviando…" : "Enviar enlace de recuperación"}
                {!busy && <Icon name="arrowRight" size={16} />}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-lg auth-submit"
                disabled={busy || !configured}
              >
                {busy
                  ? "Un momento…"
                  : mode === "login"
                    ? "Entrar"
                    : "Crear mi cuenta"}
                {!busy && <Icon name="arrowRight" size={16} />}
              </button>
            )}
          </form>

          <p className="auth-switch">
            {mode === "login" ? (
              <>
                ¿Has olvidado tu contraseña?{" "}
                <button type="button" onClick={() => changeMode("forgot")}>
                  Recuperar
                </button>
              </>
            ) : mode === "forgot" ? (
              <button type="button" onClick={() => changeMode("login")}>
                Volver a iniciar sesión
              </button>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={() => changeMode("login")}>
                  Entrar
                </button>
              </>
            )}
          </p>
        </>
      )}

      <p className="auth-legal">
        Al continuar aceptas los{" "}
        <Link href="/terminos">términos y condiciones</Link> y la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </div>
  );
}
