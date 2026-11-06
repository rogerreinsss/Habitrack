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
  verifyEmailOtp: (email: string, code: string) => Promise<string | null>;
  resendEmailOtp: (email: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
  changeEmail: (newEmail: string) => Promise<
    { error: string | null; needsConfirmation: boolean }
  >;
  signOut: () => Promise<void>;
}

export const MIN_PASSWORD_LENGTH = 10;

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
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (normalized.includes("weak password") || normalized.includes("longest common")) {
    return "La contraseña es demasiado débil. Usa letras, números y símbolos.";
  }
  if (normalized.includes("token has expired") || normalized.includes("otp expired")) {
    return "El código ha caducado. Solicita uno nuevo.";
  }
  if (normalized.includes("invalid otp") || normalized.includes("invalid token")) {
    return "El código no es correcto. Revísalo e inténtalo de nuevo.";
  }
  if (normalized.includes("email rate limit") || normalized.includes("resend")) {
    return "Has recibido demasiados correos seguidos. Espera un minuto antes de pedir otro.";
  }
  if (normalized.includes("reauthentication required")) {
    return "Confirma tu contraseña para hacer este cambio. Cierra sesión y vuelve a entrar si el problema continúa.";
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

  async function verifyEmailOtp(email: string, code: string): Promise<string | null> {
    if (!supabase) return "La autenticación no está configurada.";

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.replace(/\s/g, ""),
      type: "email",
    });

    return error ? translateAuthError(error.message) : null;
  }

  async function resendEmailOtp(email: string): Promise<string | null> {
    if (!supabase) return "La autenticación no está configurada.";

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
    });

    return error ? translateAuthError(error.message) : null;
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

  async function requestPasswordReset(email: string): Promise<string | null> {
    if (!supabase) return "La autenticación no está configurada.";

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset`,
    });

    return error ? translateAuthError(error.message) : null;
  }

  async function updatePassword(newPassword: string): Promise<string | null> {
    if (!supabase) return "La autenticación no está configurada.";

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) return translateAuthError(error.message);

    // Invalidate every other session after a password change.
    await supabase.auth.signOut({ scope: "others" });
    return null;
  }

  async function changeEmail(
    newEmail: string,
  ): Promise<{ error: string | null; needsConfirmation: boolean }> {
    if (!supabase) return { error: "La autenticación no está configurada.", needsConfirmation: false };

    const { data, error } = await supabase.auth.updateUser({
      email: newEmail.trim(),
    });

    if (error) {
      return { error: translateAuthError(error.message), needsConfirmation: false };
    }

    return {
      error: null,
      // Supabase sends a confirmation code to the new address when email
      // changes require confirmation (the default).
      needsConfirmation: data.user?.new_email !== undefined,
    };
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
      verifyEmailOtp,
      resendEmailOtp,
      signInWithGoogle,
      requestPasswordReset,
      updatePassword,
      changeEmail,
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
