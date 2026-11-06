import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { StarField } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del servicio de Motiveva: qué es el servicio, tu cuenta, tus contenidos, el precio cero y los límites de responsabilidad.",
  alternates: { canonical: "/terminos" },
  openGraph: {
    title: "Términos y condiciones · Motiveva",
    description:
      "Las reglas del servicio, claras y en lenguaje humano: cuenta, contenidos, disponibilidad y cancelación.",
    url: "/terminos",
  },
};

const SECTIONS = [
  { id: "objeto", label: "Objeto y aceptación" },
  { id: "servicio", label: "El servicio" },
  { id: "cuenta", label: "Cuenta y seguridad" },
  { id: "contenidos", label: "Tus contenidos" },
  { id: "precio", label: "Precio" },
  { id: "uso", label: "Uso correcto" },
  { id: "dpi", label: "Propiedad intelectual" },
  { id: "disponibilidad", label: "Disponibilidad y cambios" },
  { id: "responsabilidad", label: "Responsabilidad" },
  { id: "cancelacion", label: "Cancelación y eliminación" },
  { id: "legal", label: "Marco legal" },
  { id: "contacto", label: "Contacto" },
] as const;

export default function TermsPage() {
  return (
    <div className="site">
      <MarketingNav />

      <main id="contenido">
        <section className="legal-hero">
          <StarField className="legal-stars" />
          <div className="container">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Legal · Términos
            </p>
            <h1 className="legal-title">
              Términos y
              <br />
              <span className="gradient-text">condiciones.</span>
            </h1>
            <p className="legal-lede">
              Las reglas del servicio en lenguaje claro: qué es {SITE_NAME},
              cómo funciona tu cuenta, qué pasa con tus datos y qué puedes y
              no puedes esperar del servicio.
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
          <nav className="legal-toc" aria-label="Índice de los términos">
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
            <section id="objeto" aria-labelledby="objeto-title">
              <h2 id="objeto-title">01 · Objeto y aceptación</h2>
              <p>
                Estas condiciones regulan el acceso y el uso de la aplicación
                web {SITE_NAME}, disponible en {SITE_URL.replace(/^https?:\/\//, "")},
                un rastreador de hábitos de propósito personal que funciona en
                el navegador.
              </p>
              <p>
                Al crear una cuenta, iniciar sesión o usar la aplicación de
                manera voluntaria, aceptas estas condiciones y las políticas
                que las completan. Si no estás de acuerdo, no uses el
                servicio. Recomendamos leer también la{" "}
                <Link href="/privacidad">política de privacidad</Link> y la{" "}
                <Link href="/cookies">política de cookies</Link>.
              </p>
            </section>

            <section id="servicio" aria-labelledby="servicio-title">
              <h2 id="servicio-title">02 · El servicio</h2>
              <p>{SITE_NAME} incluye:</p>
              <ul>
                <li>Registro de hábitos con rachas, historial y estadísticas.</li>
                <li>
                  Copia sincronizada en la nube asociada a tu cuenta, con
                  posibilidad de exportar e importar tus datos en JSON.
                </li>
                <li>
                  Recordatorios diarios locales que solo se activan con tu
                  permiso explícito en el navegador.
                </li>
              </ul>
              <p>
                El servicio se presta tal cual, como herramienta de apoyo
                personal. {SITE_NAME} no es un dispositivo médico, no dirige
                tratamientos y no da consejos sanitarios: cualquier decisión
                sobre tu salud es tuya y, si lo necesitas, consultala con un
                profesional.
              </p>
            </section>

            <section id="cuenta" aria-labelledby="cuenta-title">
              <h2 id="cuenta-title">03 · Cuenta y seguridad</h2>
              <p>
                Para usar el servicio necesitas una cuenta con un correo
                electrónico válido. Al registrarte te pediremos confirmar tu
                dirección con un código de verificación. Puedes iniciar sesión
                con email y contraseña o con tu cuenta de Google.
              </p>
              <p>
                Eres responsable de la custodia de tus credenciales y del uso
                que se haga de tu cuenta. Cambia la contraseña si sospechas un
                acceso no autorizado: puedes hacerlo desde Ajustes o
                solicitando un enlace de recuperación en la pantalla de
                acceso. Al cambiar la contraseña se cierran todas tus sesiones
                abiertas.
              </p>
              <p>
                La autenticación está delegada en Supabase, que cifra y
                gestiona las contraseñas; {SITE_NAME} nunca recibe tu
                contraseña en claro y por eso no puede recuperarla por ti,
                solo crear un enlace para que la cambies.
              </p>
            </section>

            <section id="contenidos" aria-labelledby="contenidos-title">
              <h2 id="contenidos-title">04 · Tus contenidos</h2>
              <p>
                Los hábitos, registros y configuraciones que introduces son{" "}
                <strong>tuyos</strong>. {SITE_NAME} solo guarda tu copia
                sincronizada, la muestra en tus dispositivos y la usa para
                calcular tus estadísticas dentro de la aplicación. No la
                usamos para publicidad, para entrenar modelos ni para nada
                fuera del servicio.
              </p>
              <p>
                Garantizas que los contenidos que introduces no infringen
                derechos de terceros ni la ley. {SITE_NAME} puede suspender
                cuentas que se usen para alojar o distribuir contenido ilegal,
                de acoso o con software malicioso.
              </p>
            </section>

            <section id="precio" aria-labelledby="precio-title">
              <h2 id="precio-title">05 · Precio</h2>
              <p>
                {SITE_NAME} es <strong>gratuito</strong>. No hay compras dentro
                de la aplicación ni suscripciones de ningún tipo. Si en el
                futuro hubiese funciones de pago, se avisará con antelación, se
                pedirá tu consentimiento expreso y tu cuenta actual seguirá
                funcionando sin coste.
              </p>
            </section>

            <section id="uso" aria-labelledby="uso-title">
              <h2 id="uso-title">06 · Uso correcto</h2>
              <p>Al usar {SITE_NAME} aceptas no:</p>
              <ul>
                <li>
                  Intentar acceder a datos de otros usuarios, a la
                  infraestructura del servicio o al código de administración.
                </li>
                <li>
                  Crear cuentas falsas, masivas o automatizadas, o usar emails
                  de los que no seas titular.
                </li>
                <li>
                  Saturar el servicio con peticiones automatizadas o intentar
                  eludir sus límites técnicos.
                </li>
                <li>
                  Suplantar a {SITE_NAME} o presentar el sitio como otra cosa.
                </li>
              </ul>
              <p>
                Podemos suspender una cuenta que ponga en riesgo la seguridad o
                el acceso de otros usuarios, avisando cuando sea posible.
              </p>
            </section>

            <section id="dpi" aria-labelledby="dpi-title">
              <h2 id="dpi-title">07 · Propiedad intelectual</h2>
              <p>
                La marca, el diseño, el código y el contenido propio de{" "}
                {SITE_NAME} pertenecen a su titular. Se te concede el derecho a
                usar la aplicación de forma personal mientras cumplas estas
                condiciones.
              </p>
            </section>

            <section id="disponibilidad" aria-labelledby="disponibilidad-title">
              <h2 id="disponibilidad-title">08 · Disponibilidad y cambios</h2>
              <p>
                Buscamos un servicio estable, pero no prometemos una
                disponibilidad específica: la aplicación se apoya en
                infraestructuras de terceros (Vercel, Supabase) que pueden
                tener caídas temporales.
              </p>
              <p>
                Por eso, junto a la copia en la nube existe una copia de
                trabajo en tu navegador, y a todos los usuarios les
                recomendamos <strong>exportar sus datos</strong> de vez en
                cuando (Ajustes → Exportar). Podemos añadir, corregir o retirar
                funciones de forma evolutiva.
              </p>
            </section>

            <section id="responsabilidad" aria-labelledby="responsabilidad-title">
              <h2 id="responsabilidad-title">09 · Responsabilidad</h2>
              <p>
                {SITE_NAME} responde de los daños que sean consecuencia directa
                e inmediata de un defecto del servicio, en el alcance máximo
                que permita la ley. No respondemos de daños indirectos o
                lucro cesante, ni de pérdidas de datos imputables a un fallo
                ajeno al servicio o a un uso contrario a estas condiciones.
              </p>
              <p>
                Nada de lo anterior limita la responsabilidad por actos
                dolosos o negligencia grave, ni los derechos que asisten al
                usuario con la condición de consumidor.
              </p>
            </section>

            <section id="cancelacion" aria-labelledby="cancelacion-title">
              <h2 id="cancelacion-title">10 · Cancelación y eliminación</h2>
              <p>
                Puedes dejar de usar el servicio en cualquier momento: cierra
                sesión, ejecuta «Resetear todo» en Ajustes o pide la{" "}
                <strong>eliminación completa de tu cuenta</strong> escribiendo
                a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Al
                eliminar la cuenta se borra también la copia en la nube.
              </p>
              <p>
                Si el servicio dejara de existir, avisaremos con antelación
                suficiente por correo y de forma destacada en la aplicación,
                dando una ventana para descargar los datos.
              </p>
            </section>

            <section id="legal" aria-labelledby="legal-title">
              <h2 id="legal-title">11 · Marco legal</h2>
              <p>
                Estas condiciones se rigen por la legislación española. Para
                cualquier conflicto, las partes se someten a los juzgados
                competentes; los consumidores conservan su fuero propio.
              </p>
              <p>
                Si alguna disposición resultara nula, se interpreta de la
                manera más cercana posible a la intención original y el resto
                sigue vigente.
              </p>
            </section>

            <section id="contacto" aria-labelledby="contacto-title">
              <h2 id="contacto-title">12 · Contacto</h2>
              <p>Para consultas, soporte o reclamaciones:</p>
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
                Consulta también la{" "}
                <Link href="/privacidad">política de privacidad</Link>, la{" "}
                <Link href="/cookies">política de cookies</Link> o vuelve a la{" "}
                <Link href="/">página principal</Link>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
