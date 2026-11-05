"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function translateAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Confirma tu email antes de entrar.";
  }
  if (normalized.includes("user already registered")) {
    return "Ya existe una cuenta con ese email.";
  }
  if (normalized.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (normalized.includes("unable to validate email address")) {
    return "El email no parece válido.";
  }
  if (normalized.includes("rate limit")) {
    return "Demasiados intentos. Espera un momento y vuelve a probar.";
  }

  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no client means auth is unavailable
      setLoading(false);
      return;
    }

    let cancelled = false;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signIn(email: string, password: string): Promise<string | null> {
    if (!supabase) return "La sincronización no está configurada.";

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return error ? translateAuthError(error.message) : null;
  }

  async function signUp(
    email: string,
    password: string,
  ): Promise<{ error: string | null; needsConfirmation: boolean }> {
    if (!supabase) {
      return {
        error: "La sincronización no está configurada.",
        needsConfirmation: false,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { error: translateAuthError(error.message), needsConfirmation: false };
    }

    return { error: null, needsConfirmation: !data.session };
  }

  async function signInWithGoogle(): Promise<string | null> {
    if (!supabase) return "La sincronización no está configurada.";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    return error ? translateAuthError(error.message) : null;
  }

  async function signOut(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    // Actions only close over the stable Supabase client.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
