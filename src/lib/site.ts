function safeUrl(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return fallback;
    }
    return parsed.origin.replace(/\/$/, "");
  } catch {
    return fallback;
  }
}

export const SITE_URL = safeUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://motiveva.vercel.app",
);

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
