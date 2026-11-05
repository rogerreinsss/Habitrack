import type { Metadata } from "next";
import { HabitApp } from "@/components/app/HabitApp";
import { HabitProvider } from "@/components/app/HabitProvider";
import { ToastProvider } from "@/components/app/ToastProvider";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Abrir la app",
  description:
    "Abre Motiveva y empieza a seguir tus hábitos. Funciona sin cuenta en tu dispositivo y, si quieres, sincroniza tus datos entre dispositivos.",
  alternates: { canonical: "/app" },
  openGraph: {
    title: "Motiveva — Tu mejor versión, sin ruido",
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
