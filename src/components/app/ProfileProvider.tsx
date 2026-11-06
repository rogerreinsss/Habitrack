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
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchProfile, saveProfile, type Profile, type ProfileInput } from "@/lib/profile";
import { getSupabaseClient } from "@/lib/supabase";

interface ProfileContextValue {
  profile: Profile | null;
  /** True until the profile of the current user has been requested. */
  loading: boolean;
  loadError: string | null;
  reload: () => void;
  /** Validates and saves; throws an Error with a readable message on failure. */
  save: (input: ProfileInput) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

interface LoadState {
  userId: string;
  profile: Profile | null;
  error: string | null;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<LoadState | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client || !userId) return;

    let cancelled = false;
    fetchProfile(client, userId)
      .then((profile) => {
        if (!cancelled) setState({ userId, profile, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          userId,
          profile: null,
          error: error instanceof Error ? error.message : "No se pudo cargar tu perfil.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [userId, attempt]);

  // Results for a previous account never count, so a user switch cannot show
  // another person's profile while the new one loads.
  const current = state?.userId === userId ? state : null;
  const profile = current?.profile ?? null;
  const loadError = current?.error ?? null;

  const reload = useCallback(() => {
    setState(null);
    setAttempt((value) => value + 1);
  }, []);

  const save = useCallback(
    async (input: ProfileInput) => {
      const client = getSupabaseClient();
      if (!client || !userId) throw new Error("Tu sesión no está disponible.");

      // Editing later must keep the original onboarding date.
      const completedAt = profile?.onboardingCompletedAt ?? new Date().toISOString();
      const saved = await saveProfile(client, userId, input, completedAt);
      setState({ userId, profile: saved, error: null });
    },
    [profile?.onboardingCompletedAt, userId],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, loading: current === null, loadError, reload, save }),
    [current, loadError, profile, reload, save],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
