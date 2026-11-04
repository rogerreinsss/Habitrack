import type { Metadata } from "next";
import { HabitApp } from "@/components/app/HabitApp";
import { HabitProvider } from "@/components/app/HabitProvider";
import { ToastProvider } from "@/components/app/ToastProvider";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Abrir la app",
  description:
    "Abre HabiTrack y empieza a seguir tus hábitos. Todo se guarda en tu dispositivo: sin cuentas, sin servidores y sin anuncios.",
  alternates: { canonical: "/app" },
  openGraph: {
    title: "HabiTrack — Tu mejor versión, sin ruido",
    description: SITE_DESCRIPTION,
    url: "/app",
  },
  robots: { index: true, follow: true },
};

export default function AppPage() {
  return (
    <ToastProvider>
      <HabitProvider>
        <HabitApp />
      </HabitProvider>
    </ToastProvider>
  );
}
