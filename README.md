# Motiveva

Seguidor de hábitos tranquilo, con interfaz botánica clara y oscura. Cada
persona usa su cuenta: los hábitos se guardan en una copia privada en Supabase
y se sincronizan entre dispositivos. El inicio de sesión es obligatorio y la
verificación del correo se hace con un código de 6 dígitos. Sin anuncios ni
analítica.

Este repositorio contiene la versión Next.js del proyecto. El archivo `index.html` de la raíz es la versión original en HTML/CSS/JS y se conserva como referencia.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- React 19 + TypeScript 5.9
- CSS propio con variables de diseño (sin framework de UI)
- Fuentes autoalojadas en el build mediante `next/font` (DM Sans + Inter)
- Supabase Auth + Postgres para la cuenta opcional y la sincronización

## Requisitos

- Node.js 20.9 o superior
- npm 10 o superior

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`.

### Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run typecheck` | Comprueba los tipos con `tsc` |
| `npm run lint` | ESLint (flat config) |

## Variables de entorno

Crea un `.env.local` (o edita `.env`) partiendo de `.env.example`:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_CONTACT_EMAIL=privacidad@tu-dominio.com
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

- `NEXT_PUBLIC_SITE_URL`: dominio público sin barra final. Se usa en canonical, Open Graph, Twitter Cards, JSON-LD, `sitemap.xml` y `robots.txt`.
- `NEXT_PUBLIC_CONTACT_EMAIL`: correo que aparece en la política de privacidad y en `/.well-known/security.txt`.
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: habilitan el login opcional y la sincronización. Si faltan, la app funciona en local y muestra la sincronización como no disponible.

Los valores incluidos son marcadores de posición. Cámbialos antes de desplegar.

### Base de datos

Ejecuta `supabase/schema.sql` una vez en el SQL Editor del proyecto de Supabase. Crea la tabla privada `public.motiveva_data`, activa RLS y añade el trigger de `updated_at`.

En Supabase Auth → URL Configuration, configura:

- **Site URL**: `https://motiveva.vercel.app`
- **Redirect URLs**:
  - `https://motiveva.vercel.app/**`
  - `http://localhost:3000/**`

Configuración completa (verificación por código, plantillas de correo,
restablecimiento de contraseña) en `supabase/README.md`.

El proveedor de Google se configura en Supabase Auth → Providers → Google. El redirect URI de Google Cloud debe ser `https://<project-ref>.supabase.co/auth/v1/callback`.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Landing: propuesta de valor, funciones, cómo funciona, privacidad, FAQ y CTA |
| `/app` | Aplicación (requiere sesión): hoy, hábitos, estadísticas y ajustes |
| `/login` | Login y registro con email/contraseña o Google |
| `/auth/callback` | Callback de OAuth y confirmación de email |
| `/auth/reset` | Crear una contraseña nueva desde el enlace de recuperación |
| `/terminos` | Términos y condiciones del servicio |
| `/privacidad` | Política de privacidad |
| `/cookies` | Política de cookies y almacenamiento |
| `/sitemap.xml` | Sitemap generado desde `src/app/sitemap.ts` |
| `/robots.txt` | Robots generado desde `src/app/robots.ts` |
| `/manifest.webmanifest` | Manifest PWA |
| `/opengraph-image` | Imagen Open Graph generada en el build |
| `/apple-icon` | Icono para iOS |
| `/icon.svg` | Favicon vectorial |

## Cuenta y seguridad

- El inicio de sesión es obligatorio: sin sesión, `/app` redirige a `/login`
  y no se renderiza ningún dato (`RequireAuth`).
- El registro confirma el email con un **código de 6 dígitos** que se introduce
  en la propia pantalla (`verifyOtp`); también llega un enlace de respaldo que
  pasa por `/auth/callback`.
- Contraseñas de **10 caracteres o más**, hash en Supabase (jamás en claro).
- Recuperación con enlace/código (`resetPasswordForEmail`) y pantalla dedicada
  `/auth/reset`; al guardar una contraseña nueva se cierran **todas las demás
  sesiones** (`signOut({ scope: "others" })`).
- Cambio de contraseña y de email desde Ajustes → Seguridad. El cambio de
  email pide confirmación con código en la dirección nueva.
- El estado se guarda en `localStorage` (clave `motivevav2`) como copia de
  trabajo y se sincroniza con el JSONB privado de `public.motiveva_data`
  (RLS: cada usuario solo lee y escribe su fila).

## Datos y privacidad

- Hábitos, registros y preferencias viven en el navegador bajo `motivevav2`
  (respaldo offline) y en una copia privada JSONB en `public.motiveva_data`,
  protegida con RLS: cada usuario solo puede leer y escribir su propia fila.
- No hay cookies de analítica, píxeles ni publicidad. Solo el almacenamiento
  técnico de la sesión (claves `sb-*` de Supabase Auth). Detalles en
  `/cookies`.
- Exportar descarga un JSON con hábitos e historial. Importar acepta ese mismo formato, con validación estricta, límite de 3 MB y protección contra claves peligrosas.
- Al iniciar sesión, si la cuenta todavía no tiene copia en la nube, se sube el estado local. Si ya existe una copia, se carga la de la nube.

## Seguridad

- CSP estricta por petición con nonce y `strict-dynamic` en `src/proxy.ts`.
- Cabeceras de seguridad en `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-DNS-Prefetch-Control`, `X-Permitted-Cross-Domain-Policies` y HSTS en producción.
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` y `form-action 'self'`.
- Sin `dangerouslySetInnerHTML` salvo los bloques JSON-LD firmados con el nonce de la petición.
- `public/.well-known/security.txt` para el contacto de seguridad.

## SEO

- Metadatos por página, canonical y Open Graph/Twitter en `src/app/layout.tsx` y en cada página.
- JSON-LD de `WebSite`, `SoftwareApplication` y `FAQPage`.
- `sitemap.xml` (landing + legales), `robots.txt` (bloquea `/app`, `/auth/` y `/login`) y manifest generados por código.
- HTML semántico, `h1` único por página, enlaces con texto descriptivo y `lang="es"`.
- `/app` es privado: `noindex` en metadata y excluido del sitemap.

## Estructura

```
src/
  app/                 Rutas, layout, estilos globales y metadatos
  components/
    app/               Shell de la aplicación, vistas, modales y estado
    marketing/         Navegación, preview del producto, FAQ y footer
    ui/                Iconos, marca y decoración
  lib/                 Tipos, fechas, hábitos, validación, almacenamiento y exportación
public/
  .well-known/         security.txt
index.html             Versión original en un solo archivo
```

## Despliegue

El proyecto funciona en Vercel sin configuración adicional. Para otros entornos:

```bash
npm ci
npm run build
npm start
```

Define `NEXT_PUBLIC_SITE_URL` con el dominio final para que canonical, sitemap y Open Graph apunten al lugar correcto. El servidor debe servirse por HTTPS para que HSTS y `upgrade-insecure-requests` tengan efecto.

## Accesibilidad

- Tema claro, oscuro o automático según el sistema, con preferencia persistente y sin destello al cargar. Foco visible y enlace «Saltar al contenido».
- Modales con trampa de foco, cierre con `Escape` y restauración del foco.
- Preferencia «Reducir movimiento» que desactiva transiciones y animaciones, además de respetar `prefers-reduced-motion`.
- Atajos de teclado: `Ctrl/Cmd + K` para la paleta, `N` nuevo hábito, `T` hoy, `H` hábitos, `S` estadísticas y `,` ajustes.
