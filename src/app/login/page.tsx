import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { StarField } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Entra en Motiveva para guardar tus hábitos en tu cuenta y sincronizarlos entre dispositivos.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

const BENEFITS = [
  "Tus hábitos y tu historial en todos tus dispositivos.",
  "Una copia privada en la nube, protegida por tu cuenta.",
  "Verificación de email y restablecimiento de contraseña incluidos.",
];

export default function LoginPage() {
  return (
    <div className="site">
      <MarketingNav />
      <main id="contenido" className="auth-page">
        <StarField className="auth-stars" />
        <div className="container auth-container">
          <div className="auth-copy">
            <p className="eyebrow">Cuenta Motiveva</p>
            <h1>Tus hábitos, en todos tus dispositivos.</h1>
            <p className="auth-lede">
              Inicia sesión para que tus rachas, estadísticas e historial te
              sigan a cualquier lugar. Sin ruido, sin anuncios y sin perder el
              control de tus datos.
            </p>

            <ul className="auth-benefits">
              {BENEFITS.map((benefit) => (
                <li key={benefit}>
                  <span className="auth-benefit-icon" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <Link href="/" className="auth-back-link">
              Conocer Motiveva
              <Icon name="arrowRight" size={15} />
            </Link>
          </div>

          <AuthForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
