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
  "https://habitrack.app",
);

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "privacidad@habitrack.app";

export const SITE_NAME = "HabiTrack";
export const SITE_TAGLINE = "Tu mejor versión, sin ruido";
export const SITE_DESCRIPTION =
  "HabiTrack es un seguidor de hábitos local-first: rachas, estadísticas, historial y recordatorios. Sin cuentas, sin servidores y sin anuncios. Tus datos se quedan en tu dispositivo.";

export const APP_PATH = "/app";

export const NAV_LINKS = [
  { href: "#producto", label: "Producto" },
  { href: "#funciones", label: "Funciones" },
  { href: "#privacidad", label: "Privacidad" },
  { href: "#faq", label: "FAQ" },
] as const;
