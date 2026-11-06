import type { SupabaseClient } from "@supabase/supabase-js";
import { cleanText } from "./validation";

export const PROFILE_TABLE = "motiveva_profiles";
export const MIN_AGE = 14;
export const NAME_MAX_LENGTH = 60;
export const MOTIVATION_MAX_LENGTH = 200;

export const MAIN_GOALS = [
  { value: "health", label: "Salud y energía" },
  { value: "productivity", label: "Productividad" },
  { value: "learning", label: "Aprender algo nuevo" },
  { value: "wellbeing", label: "Bienestar y calma" },
  { value: "finance", label: "Finanzas personales" },
  { value: "other", label: "Otro objetivo" },
] as const;

export type MainGoal = (typeof MAIN_GOALS)[number]["value"];

export interface Profile {
  displayName: string;
  /** YYYY-MM-DD, or null for accounts that have not answered yet. */
  birthDate: string | null;
  mainGoal: MainGoal | null;
  motivation: string;
  onboardingCompletedAt: string | null;
}

export interface ProfileInput {
  displayName: string;
  birthDate: string;
  mainGoal: MainGoal | null;
  motivation: string;
}

interface ProfileRow {
  display_name: string;
  birth_date: string | null;
  main_goal: string | null;
  motivation: string | null;
  onboarding_completed_at: string | null;
}

const PROFILE_COLUMNS =
  "display_name, birth_date, main_goal, motivation, onboarding_completed_at";

/** Raised when the table is absent, so the UI can say what is really wrong. */
export class ProfileTableMissingError extends Error {
  constructor() {
    super(
      "La tabla de perfiles aún no existe. Ejecuta supabase/schema.sql en el SQL Editor de Supabase.",
    );
    this.name = "ProfileTableMissingError";
  }
}

function toError(error: { code?: string; message: string }): Error {
  if (error.code === "42P01" || error.code === "PGRST205") {
    return new ProfileTableMissingError();
  }
  return new Error(error.message);
}

function isMainGoal(value: unknown): value is MainGoal {
  return MAIN_GOALS.some((goal) => goal.value === value);
}

function fromRow(row: ProfileRow): Profile {
  return {
    displayName: row.display_name,
    birthDate: row.birth_date,
    mainGoal: isMainGoal(row.main_goal) ? row.main_goal : null,
    motivation: row.motivation ?? "",
    onboardingCompletedAt: row.onboarding_completed_at,
  };
}

export function goalLabel(goal: MainGoal): string {
  return MAIN_GOALS.find((item) => item.value === goal)?.label ?? goal;
}

export function validateDisplayName(value: string): string | null {
  const name = cleanText(value, NAME_MAX_LENGTH);
  return name ? null : "Escribe cómo quieres que te llamemos.";
}

/**
 * Birth dates need their own check: `isValidDateKey` rejects anything before
 * 1970 because it is meant for habit logs.
 */
export function validateBirthDate(
  value: string,
  today: Date = new Date(),
): string | null {
  if (!value) return "Indica tu fecha de nacimiento.";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return "La fecha no es válida.";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (!isRealDate || year < 1900) return "La fecha no es válida.";

  const birthdayPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  const age = today.getFullYear() - year - (birthdayPassed ? 0 : 1);
  if (age < 0) return "La fecha no puede estar en el futuro.";
  if (age < MIN_AGE) {
    return `Motiveva es para personas de ${MIN_AGE} años o más.`;
  }
  return null;
}

export async function fetchProfile(
  client: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await client
    .from(PROFILE_TABLE)
    .select(PROFILE_COLUMNS)
    .eq("user_id", userId)
    .maybeSingle<ProfileRow>();

  if (error) throw toError(error);
  return data ? fromRow(data) : null;
}

/** Validates, saves and returns the stored profile. */
export async function saveProfile(
  client: SupabaseClient,
  userId: string,
  input: ProfileInput,
  onboardingCompletedAt: string,
): Promise<Profile> {
  const problem =
    validateDisplayName(input.displayName) ?? validateBirthDate(input.birthDate);
  if (problem) throw new Error(problem);

  const { data, error } = await client
    .from(PROFILE_TABLE)
    .upsert(
      {
        user_id: userId,
        display_name: cleanText(input.displayName, NAME_MAX_LENGTH),
        birth_date: input.birthDate,
        main_goal: input.mainGoal,
        motivation: cleanText(input.motivation, MOTIVATION_MAX_LENGTH) || null,
        onboarding_completed_at: onboardingCompletedAt,
      },
      { onConflict: "user_id" },
    )
    .select(PROFILE_COLUMNS)
    .single<ProfileRow>();

  if (error) throw toError(error);
  return fromRow(data);
}
