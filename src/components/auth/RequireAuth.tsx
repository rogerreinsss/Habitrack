"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandSymbol } from "@/components/ui/Brand";
import { LOGIN_PATH } from "@/lib/site";

/**
 * Every screen of the app requires an account. While the session is being
 * checked we show a loading shell; without a session we redirect to /login.
 * Nothing renders for guests, so local data never leaks to a shared browser.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, configured } = useAuth();
  const hasSession = Boolean(user);

  useEffect(() => {
    if (!loading && !hasSession) {
      router.replace(LOGIN_PATH);
    }
  }, [loading, hasSession, router]);

  if (!configured) {
    return (
      <div className="app-loading" aria-live="polite">
        <span className="app-loading-mark">
          <BrandSymbol />
        </span>
        <h1>Falta la configuración</h1>
        <p>
          La autenticación no está disponible en este entorno. Define
          NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para habilitar
          la cuenta.
        </p>
      </div>
    );
  }

  if (loading || !hasSession) {
    return (
      <div className="app-loading" aria-live="polite">
        <span className="app-loading-mark">
          <BrandSymbol />
        </span>
        <span>{loading ? "Cargando tu espacio…" : "Redirigiendo al inicio de sesión…"}</span>
        {!loading && (
          <Link href={LOGIN_PATH} className="btn btn-ghost btn-sm">
            Ir al inicio de sesión
          </Link>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
