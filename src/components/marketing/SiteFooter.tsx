import Link from "next/link";
import { Brand } from "@/components/ui/Brand";
import { Icon } from "@/components/ui/Icon";
import { APP_PATH, CONTACT_EMAIL } from "@/lib/site";

const columns = [
  {
    title: "Producto",
    links: [
      { href: APP_PATH, label: "Abrir Motiveva", external: false },
      { href: "/login", label: "Iniciar sesión", external: false },
      { href: "/#producto", label: "Cómo funciona", external: false },
      { href: "/#funciones", label: "Funciones", external: false },
      { href: "/#faq", label: "Preguntas frecuentes", external: false },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacidad", label: "Política de privacidad", external: false },
      { href: "/privacidad#seguridad", label: "Seguridad", external: false },
      { href: "/privacidad#derechos", label: "Tus derechos", external: false },
      { href: `mailto:${CONTACT_EMAIL}`, label: "Contacto", external: true },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Brand href="/" />
          <p>
            Un lugar tranquilo para construir constancia. Sin cuenta
            obligatoria, sin anuncios y sin ruido.
          </p>
          <span className="footer-local">
            <Icon name="shield" size={14} />
            Local-first · Cuenta opcional
          </span>
        </div>

        <div className="footer-columns">
          {columns.map((column) => (
            <div key={column.title} className="footer-column">
              <h2 className="footer-title">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href}>{link.label}</a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Motiveva. Hecho para durar.</p>
        <p className="footer-note">
          Sin cookies de seguimiento · Sin analítica · Sin anuncios
        </p>
      </div>
    </footer>
  );
}
