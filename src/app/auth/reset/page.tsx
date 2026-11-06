import type { Metadata } from "next";
import { AuthResetForm } from "@/components/auth/AuthResetForm";

export const metadata: Metadata = {
  title: "Crear una contraseña nueva",
  robots: { index: false, follow: false },
};

export default function AuthResetPage() {
  return <AuthResetForm />;
}
