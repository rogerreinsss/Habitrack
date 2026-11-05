import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

let browserClient: SupabaseClient | null = null;

/**
 * Returns a single browser client so auth state and realtime listeners are not
 * duplicated across React boundaries. Rendering stays local-only when the
 * environment does not define Supabase credentials.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseKey) return null;

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }

  return browserClient;
}
