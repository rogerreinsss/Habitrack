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
    "Cómo trata Motiveva tus datos: cuenta obligatoria con copia privada en Supabase. Sin cookies de seguimiento, analítica ni publicidad.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    title: "Política de privacidad · Motiveva",
    description:
      "Tu cuenta, tu copia privada y tu historial. Así funciona la privacidad de Motiveva.",
    url: "/privacidad",
  },
};

const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "responsable", label: "Responsable" },
  { id: "datos", label: "Datos y cuenta" },
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
              {SITE_NAME} funciona con cuenta desde el primer momento. Esta
              página explica, sin rodeos, qué datos se guardan, dónde y para
              qué.
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
                {SITE_NAME} es una aplicación web de seguimiento de hábitos{" "}
                <strong>con cuenta obligatoria</strong>. Tus hábitos y tu
                historial se guardan en una copia privada en Supabase, asociada
                únicamente a tu cuenta, para que los recuperes en cualquiera de
                tus dispositivos. Además, el navegador conserva una copia de
                trabajo local para usar la app incluso si la conexión falla.
              </p>
              <div className="legal-callout">
                <Icon name="shield" size={18} />
                <p>
                  En una frase: tus hábitos viven en tu espacio privado de la
                  nube y, como respaldo, en tu navegador. Nunca se usan para
                  publicidad y no se comparten con nadie.
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
                Para la cuenta, {SITE_NAME} utiliza Supabase como
                proveedor de autenticación y base de datos. Supabase actúa como
                encargado del tratamiento y solo procesa los datos necesarios
                para prestar el servicio.
              </p>
            </section>

            <section id="datos" aria-labelledby="datos-title">
              <h2 id="datos-title">03 · Datos y cuenta</h2>
              <p>
                Para crear la cuenta y autenticarte tratamos los siguientes
                datos:
              </p>
              <ul>
                <li>
                  <strong>Email</strong> y contraseña. La contraseña se guarda
                  como hash en Supabase; nunca la vemos en claro.
                </li>
                <li>
                  <strong>Email de contacto y códigos de verificación</strong>:
                  para confirmar tu cuenta, cambiar de email o restablecer la
                  contraseña enviamos códigos de 6 dígitos o enlaces únicos
                  temporales.
                </li>
                <li>
                  <strong>Datos de perfil</strong> que devuelve Google si eliges
                  «Continuar con Google»: nombre, email y foto de perfil.
                </li>
                <li>
                  <strong>Datos de perfil que nos indicas</strong>: nombre, fecha
                  de nacimiento y, si quieres, tu objetivo y tu motivación. Los
                  puedes cambiar cuando quieras en Ajustes.
                </li>
                <li>
                  <strong>Datos de la app</strong>: hábitos, registros,
                  estadísticas y preferencias que decidas sincronizar.
                </li>
                <li>
                  <strong>Metadatos técnicos</strong>: identificador de usuario,
                  fechas de creación y actualización de tu copia.
                </li>
              </ul>
              <p>
                No usamos identificadores publicitarios, no elaboramos perfiles
                comerciales y no vendemos datos a terceros.
              </p>
              <p>
                Los datos de la app se guardan en{" "}
                <code>public.motiveva_data</code>, una tabla privada de
                Supabase protegida con Row Level Security: cada usuario solo
                puede leer y escribir su propia fila.
              </p>
            </section>

            <section id="local" aria-labelledby="local-title">
              <h2 id="local-title">04 · Datos en tu dispositivo</h2>
              <p>
                Para que la app sea rápida y funcione incluso sin conexión, tu
                navegador guarda en <code>localStorage</code> una copia de
                trabajo de tu información, siempre en tu propio dispositivo:
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
                Si la conexión falla, estos datos se quedan en el dispositivo y
                se sincronizan al volver. Si inicias sesión en otro
                dispositivo, se descargan desde la copia de la nube. Si usas la
                función de exportar, el archivo JSON se genera en tu
                dispositivo y se descarga directamente.
              </p>
            </section>

            <section id="base-legal" aria-labelledby="base-legal-title">
              <h2 id="base-legal-title">05 · Base legal</h2>
              <p>
                La base legal del tratamiento es la <strong>ejecución del
                contrato</strong> de servicio: necesitamos tu email y tu
                contraseña cifrada para autenticarte y conservar tu espacio
                privado con tus hábitos mientras la cuenta exista. Las
                funciones principales de la app (rachas, estadísticas,
                exportación) funcionan sobre estos mismos datos, sin fines
                publicitarios.
              </p>
              <p>
                El almacenamiento local estrictamente necesario para prestar el
                servicio (la copia de trabajo y la sesión) está además exento
                de consentimiento previo según la normativa europea de
                privacidad electrónica.
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
                {SITE_NAME} no utiliza cookies de seguimiento ni de publicidad.
                En <code>localStorage</code> conviven <strong>tus datos de la
                app</strong> (hábitos, registros, preferencias, clave{" "}
                <code>motivevav2</code>) y <strong>la sesión de Supabase
                Auth</strong> (claves <code>sb-*</code>), que funciona como una
                cookie de sesión técnica: recuerda que has iniciado sesión de
                forma segura. Puedes borrar los datos locales desde la app
                (Ajustes → Resetear todo) o desde la configuración de tu
                navegador; al borrarlas tendrás que iniciar sesión de nuevo.
              </p>
              <p>
                Todos los detalles están en la{" "}
                <a href="/cookies">política de cookies</a>.
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
                El sitio se aloja en Vercel, que puede registrar datos técnicos
                básicos (por ejemplo, la dirección IP) durante la entrega de la
                página por motivos de seguridad y funcionamiento.
              </p>
              <p>
                La cuenta y la sincronización usan Supabase
                (autenticación y base de datos). Si eliges «Continuar con
                Google», Google interviene en el proceso de inicio de sesión y
                nos devuelve los datos básicos de tu perfil. Puedes consultar
                sus propias políticas de privacidad.
              </p>
              <p>
                No incrustamos vídeos, mapas, botones sociales ni widgets de
                terceros que puedan rastrearte.
              </p>
            </section>

            <section id="seguridad" aria-labelledby="seguridad-title">
              <h2 id="seguridad-title">09 · Seguridad</h2>
              <p>Cuidamos la aplicación y los datos que decidas sincronizar:</p>
              <ul>
                <li>Conexión cifrada mediante HTTPS.</li>
                <li>
                  Política de seguridad de contenidos (CSP) con nonce para
                  reducir el riesgo de inyección de scripts.
                </li>
                <li>
                  Saneamiento de todos los datos que se leen de{" "}
                  <code>localStorage</code>, de la nube o de un archivo
                  importado, con límites de tamaño y de número de registros.
                </li>
                <li>
                  Row Level Security en Supabase: cada fila de{" "}
                  <code>motiveva_data</code> solo es accesible por su usuario.
                </li>
                <li>
                  Contraseñas gestionadas por Supabase Auth y nunca almacenadas
                  en claro por {SITE_NAME}.
                </li>
                <li>
                  Cabeceras de seguridad: <code>nosniff</code>, protección
                  contra framing, política de referencia estricta y permisos
                  del navegador desactivados por defecto.
                </li>
                <li>Sin dependencias de seguimiento ni scripts publicitarios.</li>
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
                La copia de trabajo local permanece en tu navegador hasta que
                la borres («Resetear todo», borrado del sitio o ventana
                privada). Al usar «Resetear todo» se eliminan los hábitos, el
                historial y las preferencias de ese navegador y se vacía la
                copia en la nube.
              </p>
              <p>
                La copia de Supabase permanece mientras la cuenta exista. Para
                eliminar la cuenta completa y todos sus datos, escríbenos a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
                <li>
                  <strong>Cuenta</strong>: para eliminar tu cuenta y la copia en
                  la nube, escríbenos a{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
                {SITE_NAME} no está dirigida específicamente a menores de 14
                años. Si un menor crea una cuenta, debe contar con la
                autorización de su padre, madre o tutor legal. Para solicitar
                la eliminación de una cuenta de un menor, escríbenos a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
