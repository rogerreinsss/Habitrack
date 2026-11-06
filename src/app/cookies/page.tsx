import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { StarField } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Las cookies y el almacenamiento que usa Motiveva: solo técnicas y estrictamente necesarias. Sin cookies de seguimiento, publicidad ni analítica.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Política de cookies · Motiveva",
    description:
      "Motiveva no usa cookies de seguimiento. Aquí te contamos, una por una, las cookies técnicas que nuestra cuenta necesita.",
    url: "/cookies",
  },
};

const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "que-son", label: "Qué son las cookies" },
  { id: "inventario", label: "Cookies que usamos" },
  { id: "exencion", label: "Por qué no pedimos consentimiento" },
  { id: "terceros", label: "Cookies de terceros" },
  { id: "gestionar", label: "Cómo gestionarlas" },
  { id: "contacto", label: "Contacto" },
] as const;

export default function CookiesPage() {
  return (
    <div className="site">
      <MarketingNav />

      <main id="contenido">
        <section className="legal-hero">
          <StarField className="legal-stars" />
          <div className="container">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Legal · Cookies
            </p>
            <h1 className="legal-title">
              Política de
              <br />
              <span className="gradient-text">cookies.</span>
            </h1>
            <p className="legal-lede">
              {SITE_NAME} no rastrea, no mide y no vende atención. Esta página
              explica, sin letra pequeña, cada cookie y cada trozo de
              almacenamiento que necesita la aplicación.
            </p>
            <div className="legal-meta">
              <span>
                <Icon name="calendar" size={14} />
                Última actualización: 6 de noviembre de 2026
              </span>
              <span>
                <Icon name="globe" size={14} />
                Aplica a {SITE_URL.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>
        </section>

        <div className="container legal-layout">
          <nav className="legal-toc" aria-label="Índice de la política de cookies">
            <span className="legal-toc-title">Contenido</span>
            <ol>
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.label}
                  </a>
                </li>
              ))}
            </ol>
            <div className="legal-toc-help">
              <Icon name="mail" size={15} />
              <p>
                ¿Dudas? Escríbenos a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </div>
          </nav>

          <article className="legal-body">
            <section id="resumen" aria-labelledby="resumen-title">
              <h2 id="resumen-title">01 · Resumen</h2>
              <p>
                {SITE_NAME} <strong>no utiliza cookies de seguimiento, ni de
                analítica, ni de publicidad</strong>. No hay píxeles, banners de
                consentimiento, rastreadores ni terceros que perfilen tu
                navegación.
              </p>
              <p>
                Las únicas cookies presentes en {SITE_URL.replace(/^https?:\/\//, "")} son
                las <strong>cookies técnicas</strong> que mantienen tu sesión de
                usuario segura mientras usas la aplicación y las cookies
                puntuales que Google puede establecer durante el inicio de
                sesión con su cuenta.
              </p>
              <div className="legal-callout">
                <Icon name="shield" size={18} />
                <p>
                  En una frase: las cookies de {SITE_NAME} solo existen para que
                  sigas identificado de forma segura. No perfilan tu navegación
                  y no se comparten con terceros con fines comerciales.
                </p>
              </div>
            </section>

            <section id="que-son" aria-labelledby="que-son-title">
              <h2 id="que-son-title">02 · Qué son las cookies</h2>
              <p>
                Una <strong>cookie</strong> es un pequeño archivo que un sitio
                guarda en tu navegador para recordar información entre páginas o
                entre visitas. Junto a las cookies existe el{" "}
                <strong>almacenamiento local del navegador</strong> (
                <code>localStorage</code>), que cumple la misma función con más
                capacidad y no se envía al servidor en cada petición.
              </p>
              <p>
                Motiveva usa almacenamiento local para tus datos de trabajo
                (hábitos, registros, preferencias) y cookies de sesión
                estrictamente técnicas para la autenticación.
              </p>
            </section>

            <section id="inventario" aria-labelledby="inventario-title">
              <h2 id="inventario-title">03 · Cookies que usamos</h2>
              <p>
                {SITE_NAME} <strong>no establece cookies propias</strong>. La
                sesión de tu cuenta y todos los datos de la aplicación se
                guardan en <code>localStorage</code>, el almacenamiento del
                propio navegador, con las claves que empezamos por{" "}
                <code>sb-</code> (token y token de renovación de Supabase Auth)
                y <code>motiveva*</code> (tus hábitos y preferencias).
              </p>
              <p>
                Funcionalmente hacen el mismo papel que una cookie de sesión
                técnica: recordar que has iniciado sesión de forma segura para
                que no tengas que repetir tus credenciales en cada visita.
                Caducan cuando cierras sesión y desaparecen si borras los datos
                del navegador.
              </p>
              <p>
                El detalle completo de claves y contenidos está en la{" "}
                <a href="/privacidad#cookies">política de privacidad</a>.
              </p>
            </section>

            <section id="exencion" aria-labelledby="exencion-title">
              <h2 id="exencion-title">04 · Por qué no pedimos consentimiento</h2>
              <p>
                La normativa europea de privacidad electrónica (LSSI en España){" "}
                <strong>exime del consentimiento previo</strong> a los accesos
                al equipo terminal estrictamente necesarios para prestar el
                servicio que el usuario solicita de forma explícita, como
                recordar su sesión autenticada. Aplica igual a cookies que a{" "}
                <code>localStorage</code>.
              </p>
              <p>
                Ese es el único tipo de cookie que {SITE_NAME} usa. Al no haber
                cookies de analítica, medición ni publicidad, no hay banner que
                aceptar: si usas la aplicación, es porque las necesitas de
                verdad.
              </p>
            </section>

            <section id="terceros" aria-labelledby="terceros-title">
              <h2 id="terceros-title">05 · Cookies de terceros</h2>
              <p>
                Si eliges «Continuar con Google», Google puede establecer sus
                propias cookies puntuales durante el popup de OAuth para
                completar el inicio de sesión. Es un paso de un flujo que tú
                mismo solicitas; no se usan para publicidad en {SITE_NAME}.
                Puedes consultar la{" "}
                <a
                  href="https://policies.google.com/privacy?hl=es"
                  rel="noopener noreferrer nofollow"
                >
                  política de privacidad de Google
                </a>
                .
              </p>
              <p>
                El sitio se aloja en Vercel, que no establece cookies de
                seguimiento en el lado del visitante ni emplea cookies de
                analítica publicitaria.
              </p>
            </section>

            <section id="gestionar" aria-labelledby="gestionar-title">
              <h2 id="gestionar-title">06 · Cómo gestionarlas</h2>
              <p>
                Desde la aplicación: <strong>Ajustes → Cerrar sesión</strong>{" "}
                elimina la cookie de sesión de este navegador.{" "}
                <strong>Ajustes → Resetear todo</strong> borra además tus datos
                locales (hábitos, registros y preferencias).
              </p>
              <p>
                Desde el navegador: puedes borrar cookies y datos del sitio en{" "}
                <em>Configuración → Privacidad y seguridad</em> de Chrome,
                Edge o Brave, en <em>Preferencias → Cookies</em> de Firefox y en{" "}
                <em>Preferencias → Privacidad</em> de Safari. Bloquear o borrar
                las cookies de {SITE_NAME} hará que tengas que iniciar sesión de
                nuevo, y puede impedir la sincronización de tus hábitos.
              </p>
            </section>

            <section id="contacto" aria-labelledby="contacto-title">
              <h2 id="contacto-title">07 · Contacto</h2>
              <p>Para cualquier duda sobre cookies o privacidad:</p>
              <div className="legal-contact">
                <span className="legal-contact-icon" aria-hidden="true">
                  <Icon name="mail" size={18} />
                </span>
                <div>
                  <span className="legal-contact-label">Correo</span>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </div>
              </div>
              <p>
                También puedes leer la{" "}
                <Link href="/privacidad">política de privacidad</Link>, los{" "}
                <Link href="/terminos">términos y condiciones</Link> o volver a
                la <Link href="/">página principal</Link>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
