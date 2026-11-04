import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { StarField } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo trata HabiTrack tus datos: todo se guarda en el almacenamiento local de tu navegador. Sin cuentas, sin servidores, sin cookies de seguimiento.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    title: "Política de privacidad · HabiTrack",
    description:
      "Tus hábitos nunca salen de tu dispositivo. Así funciona la privacidad de HabiTrack.",
    url: "/privacidad",
  },
};

const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "responsable", label: "Responsable" },
  { id: "datos", label: "Datos que no recogemos" },
  { id: "local", label: "Datos en tu dispositivo" },
  { id: "base-legal", label: "Base legal" },
  { id: "cookies", label: "Cookies y almacenamiento" },
  { id: "notificaciones", label: "Notificaciones" },
  { id: "terceros", label: "Terceros" },
  { id: "seguridad", label: "Seguridad" },
  { id: "conservacion", label: "Conservación" },
  { id: "derechos", label: "Tus derechos" },
  { id: "menores", label: "Menores" },
  { id: "cambios", label: "Cambios" },
  { id: "contacto", label: "Contacto" },
] as const;

export default function PrivacyPage() {
  return (
    <div className="site">
      <MarketingNav />

      <main id="contenido">
        <section className="legal-hero">
          <StarField className="legal-stars" />
          <div className="container">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Legal · Privacidad
            </p>
            <h1 className="legal-title">
              Política de
              <br />
              <span className="gradient-text">privacidad.</span>
            </h1>
            <p className="legal-lede">
              {SITE_NAME} está diseñada para no necesitar tus datos. Esta página
              explica, sin rodeos, qué ocurre con la información cuando usas la
              app.
            </p>
            <div className="legal-meta">
              <span>
                <Icon name="calendar" size={14} />
                Última actualización: 4 de noviembre de 2026
              </span>
              <span>
                <Icon name="globe" size={14} />
                Aplica a {SITE_URL.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>
        </section>

        <div className="container legal-layout">
          <nav className="legal-toc" aria-label="Índice de la política">
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
                {SITE_NAME} es una aplicación web <strong>local-first</strong>.
                No hay cuentas, no hay servidor de datos y no hay forma de que
                el equipo de {SITE_NAME} vea tus hábitos, tu historial o tus
                estadísticas.
              </p>
              <div className="legal-callout">
                <Icon name="shield" size={18} />
                <p>
                  En una frase: todo lo que escribes y marcas se guarda en el
                  almacenamiento local de tu navegador y nunca se transmite a
                  nuestros servidores.
                </p>
              </div>
            </section>

            <section id="responsable" aria-labelledby="responsable-title">
              <h2 id="responsable-title">02 · Responsable</h2>
              <p>
                El responsable del sitio web es {SITE_NAME}. Puedes contactar
                con nosotros en{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> para
                cualquier cuestión relacionada con esta política o con la
                protección de datos.
              </p>
              <p>
                {SITE_NAME} no trata datos personales en un servidor propio
                porque no dispone de base de datos de usuarios ni de sistema de
                registro.
              </p>
            </section>

            <section id="datos" aria-labelledby="datos-title">
              <h2 id="datos-title">03 · Datos que no recogemos</h2>
              <p>No solicitamos ni almacenamos:</p>
              <ul>
                <li>Nombre, apellidos, correo electrónico o teléfono.</li>
                <li>Contraseñas ni credenciales de acceso.</li>
                <li>Dirección IP con fines analíticos o publicitarios.</li>
                <li>Identificadores de publicidad o de seguimiento.</li>
                <li>Datos de salud, ubicación, contactos o dispositivo.</li>
              </ul>
              <p>
                Tampoco utilizamos cookies de analítica, píxeles de redes
                sociales, mapas de calor ni herramientas de experimentación.
              </p>
            </section>

            <section id="local" aria-labelledby="local-title">
              <h2 id="local-title">04 · Datos en tu dispositivo</h2>
              <p>
                Para que la app funcione, tu navegador guarda en{" "}
                <code>localStorage</code> la siguiente información, siempre en
                tu propio dispositivo:
              </p>
              <ul>
                <li>
                  <strong>Hábitos</strong>: nombre, descripción, icono,
                  categoría, frecuencia, etiqueta, fecha de creación y estado
                  de archivo.
                </li>
                <li>
                  <strong>Registros</strong>: los días en que has completado
                  cada hábito.
                </li>
                <li>
                  <strong>Preferencias</strong>: orden de la lista, hora del
                  recordatorio, permiso de notificaciones y preferencia de
                  movimiento reducido.
                </li>
                <li>
                  <strong>Última exportación</strong>: la fecha de tu última
                  copia de seguridad.
                </li>
              </ul>
              <p>
                Estos datos no se envían, no se sincronizan y no se comparten.
                Si usas la función de exportar, el archivo JSON se genera en tu
                dispositivo y se descarga directamente.
              </p>
            </section>

            <section id="base-legal" aria-labelledby="base-legal-title">
              <h2 id="base-legal-title">05 · Base legal</h2>
              <p>
                El almacenamiento local estrictamente necesario para prestar el
                servicio solicitado está exento del consentimiento previo según
                la normativa europea de privacidad electrónica. No se utiliza
                para elaborar perfiles ni para publicidad.
              </p>
              <p>
                Cuando activas las notificaciones, el navegador te pide permiso
                expreso. Ese permiso se puede retirar en cualquier momento
                desde los ajustes del navegador o de la propia app.
              </p>
            </section>

            <section id="cookies" aria-labelledby="cookies-title">
              <h2 id="cookies-title">06 · Cookies y almacenamiento</h2>
              <p>
                {SITE_NAME} no utiliza cookies. Utiliza <code>localStorage</code>{" "}
                como almacenamiento técnico para conservar tus hábitos entre
                visitas. Puedes borrarlo desde la app (Ajustes → Resetear todo)
                o desde la configuración de tu navegador.
              </p>
              <p>
                Las tipografías se sirven desde el propio sitio web, no desde
                servidores de terceros, para evitar peticiones externas
                innecesarias.
              </p>
            </section>

            <section id="notificaciones" aria-labelledby="notificaciones-title">
              <h2 id="notificaciones-title">07 · Notificaciones</h2>
              <p>
                El recordatorio diario es una notificación local generada por tu
                navegador. No hay servicio de push, no interviene ningún
                servidor y no se comparte ningún identificador. Si no activas
                el permiso, no se muestra ninguna notificación.
              </p>
            </section>

            <section id="terceros" aria-labelledby="terceros-title">
              <h2 id="terceros-title">08 · Servicios de terceros</h2>
              <p>
                El sitio se aloja en un proveedor de infraestructura web que,
                como cualquier servidor, puede registrar datos técnicos básicos
                (por ejemplo, la dirección IP) durante la entrega de la página
                por motivos de seguridad y funcionamiento. Ese tratamiento es
                ajeno a {SITE_NAME} y se limita a lo necesario para servir el
                sitio.
              </p>
              <p>
                No incrustamos vídeos, mapas, botones sociales ni widgets de
                terceros que puedan rastrearte.
              </p>
            </section>

            <section id="seguridad" aria-labelledby="seguridad-title">
              <h2 id="seguridad-title">09 · Seguridad</h2>
              <p>
                Aunque no custodiamos tus hábitos, cuidamos la aplicación:
              </p>
              <ul>
                <li>Conexión cifrada mediante HTTPS.</li>
                <li>
                  Política de seguridad de contenidos (CSP) con nonce para
                  reducir el riesgo de inyección de scripts.
                </li>
                <li>
                  Saneamiento de todos los datos que se leen de{" "}
                  <code>localStorage</code> o de un archivo importado, con
                  límites de tamaño y de número de registros.
                </li>
                <li>
                  Cabeceras de seguridad: <code>nosniff</code>, protección
                  contra framing, política de referencia estricta y permisos
                  del navegador desactivados por defecto.
                </li>
                <li>
                  Sin dependencias de seguimiento ni scripts de terceros.
                </li>
              </ul>
              <p>
                Ningún sistema es infalible. Si detectas una vulnerabilidad,
                escríbenos a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> y te
                responderemos lo antes posible.
              </p>
            </section>

            <section id="conservacion" aria-labelledby="conservacion-title">
              <h2 id="conservacion-title">10 · Conservación y eliminación</h2>
              <p>
                Tus datos permanecen en tu navegador hasta que los borras. Al
                usar «Resetear todo» se eliminan los hábitos, el historial y las
                preferencias de ese navegador. También desaparecen si borras los
                datos del sitio o usas una ventana privada.
              </p>
              <p>
                Como no tenemos copia, no podemos recuperar tus datos por ti.
                Te recomendamos exportar una copia de vez en cuando.
              </p>
            </section>

            <section id="derechos" aria-labelledby="derechos-title">
              <h2 id="derechos-title">11 · Tus derechos</h2>
              <p>
                La normativa de protección de datos te reconoce derechos de
                acceso, rectificación, supresión, limitación, portabilidad y
                oposición. En {SITE_NAME} se ejercen directamente desde la app:
              </p>
              <ul>
                <li>
                  <strong>Acceso y portabilidad</strong>: Ajustes → Exportar
                  datos descarga una copia completa en JSON.
                </li>
                <li>
                  <strong>Rectificación</strong>: edita cualquier hábito desde
                  su tarjeta.
                </li>
                <li>
                  <strong>Supresión</strong>: elimina hábitos uno a uno o usa
                  «Resetear todo».
                </li>
              </ul>
              <p>
                Si consideras que no hemos atendido correctamente una solicitud,
                puedes presentar una reclamación ante la Agencia Española de
                Protección de Datos (AEPD).
              </p>
            </section>

            <section id="menores" aria-labelledby="menores-title">
              <h2 id="menores-title">12 · Menores</h2>
              <p>
                {SITE_NAME} no está dirigida específicamente a menores ni
                recoge datos de ellos. Al no existir registro ni transmisión de
                información, no se crea ningún perfil de usuario.
              </p>
            </section>

            <section id="cambios" aria-labelledby="cambios-title">
              <h2 id="cambios-title">13 · Cambios en esta política</h2>
              <p>
                Si en el futuro cambiamos la forma en que se tratan los datos,
                actualizaremos esta página y la fecha de revisión. Si el cambio
                afectara a datos que ya estuvieran en tu dispositivo, lo
                comunicaríamos dentro de la app antes de aplicarlo.
              </p>
            </section>

            <section id="contacto" aria-labelledby="contacto-title">
              <h2 id="contacto-title">14 · Contacto</h2>
              <p>
                Para cualquier pregunta sobre privacidad, seguridad o esta
                política:
              </p>
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
                También puedes volver a la{" "}
                <Link href="/">página principal</Link> o{" "}
                <Link href="/app">abrir la app</Link>.
              </p>
            </section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
