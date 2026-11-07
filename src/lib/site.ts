/**
 * Canonical public origin. Every public URL (canonical, Open Graph, JSON-LD,
 * sitemap, robots, auth redirects) is built from this value.
 */
export const CANONICAL_ORIGIN = "https://motiveva.site";

/**
 * Hosts that must never be used as the public identity. The Vercel deployment
 * domain still exists for the platform, but links should always point to the
 * canonical domain.
 */
const LEGACY_ORIGINS = new Set(["https://motiveva.vercel.app"]);

function safeUrl(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return fallback;
    }
    const origin = parsed.origin.replace(/\/$/, "");
    if (LEGACY_ORIGINS.has(origin)) return fallback;
    return origin;
  } catch {
    return fallback;
  }
}

export const SITE_URL = safeUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  CANONICAL_ORIGIN,
);

/**
 * Absolute URL for Supabase auth emails and redirects. Production always uses
 * the canonical domain so no auth link can point at the technical deployment
 * host; local development keeps using the current origin.
 */
export function authRedirectUrl(path: string): string {
  const base =
    process.env.NODE_ENV === "production"
      ? SITE_URL
      : typeof window !== "undefined"
        ? window.location.origin
        : SITE_URL;
  return `${base}${path}`;
}

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "privacidad@motiveva.app";

export const SITE_NAME = "Motiveva";
export const SITE_TAGLINE = "Tu mejor versión, sin ruido";
export const SITE_DESCRIPTION =
  "Motiveva es un seguidor de hábitos con rachas, estadísticas, historial y recordatorios. Crea tu cuenta gratuita y sincroniza tus hábitos entre dispositivos. Sin anuncios.";

export const APP_PATH = "/app";
export const LOGIN_PATH = "/login";
export const RESET_PATH = "/auth/reset";

export const NAV_LINKS = [
  { href: "#producto", label: "Producto" },
  { href: "#funciones", label: "Funciones" },
  { href: "#privacidad", label: "Privacidad" },
  { href: "#faq", label: "FAQ" },
] as const;
