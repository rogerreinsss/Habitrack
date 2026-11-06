"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { getSupabaseClient } from "@/lib/supabase";
import { APP_PATH } from "@/lib/site";

type CallbackState =
  | { kind: "working"; message: string }
  | { kind: "error"; message: string };

export default function AuthCallbackPage() {
  const router = useRouter();
  const [state, setState] = useState<CallbackState>({
    kind: "working",
    message: "Completando el inicio de sesión…",
  });

  useEffect(() => {
    const supabase = getSupabaseClient();
    let cancelled = false;

    async function finish() {
      if (!supabase) {
        setState({
          kind: "error",
          message: "La autenticación no está configurada en este entorno.",
        });
        return;
      }

      const client = supabase;
      const url = new URL(window.location.href);
      const queryError =
        url.searchParams.get("error_description") ??
        url.searchParams.get("error");

      if (queryError) {
        setState({ kind: "error", message: queryError });
        return;
      }

      // The Supabase client is configured with detectSessionInUrl, so it
      // exchanges the PKCE code (or reads the implicit hash) during its own
      // initialization. Calling exchangeCodeForSession here as well would try
      // to redeem the same code twice. getSession waits for that initialization
      // and returns the fresh session.
      const { data, error } = await client.auth.getSession();
      if (cancelled) return;

      if (error) {
        setState({ kind: "error", message: error.message });
        return;
      }
      if (data.session) {
        router.replace(APP_PATH);
        router.refresh();
        return;
      }

      setState({
        kind: "error",
        message:
          "No hemos podido completar el inicio de sesión. Vuelve a intentarlo.",
      });
    }

    void finish();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="auth-callback">
      <Brand href="/" />
      <div className="auth-callback-card" aria-live="polite">
        {state.kind === "working" ? (
          <span className="auth-callback-spinner" aria-hidden="true" />
        ) : (
          <span className="auth-callback-icon" aria-hidden="true">
            <Icon name="alert" size={20} />
          </span>
        )}
        <h1>
          {state.kind === "working" ? "Un momento…" : "No se pudo entrar"}
        </h1>
        <p>{state.message}</p>
        {state.kind === "error" && (
          <div className="auth-callback-actions">
            <Link href="/login" className="btn btn-primary">
              Volver a intentarlo
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
