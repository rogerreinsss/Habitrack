# HabiTrack

Seguidor de hábitos **local-first** con una interfaz cosmos oscura. Sin cuentas, sin servidores y sin analítica: todo se guarda en el navegador.

Este repositorio contiene la versión Next.js del proyecto. El archivo `index.html` de la raíz es la versión original en HTML/CSS/JS y se conserva como referencia.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- React 19 + TypeScript 5.9
- CSS propio con variables de diseño (sin framework de UI)
- Fuentes autoalojadas en el build mediante `next/font` (DM Sans + Inter)

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
```

- `NEXT_PUBLIC_SITE_URL`: dominio público sin barra final. Se usa en canonical, Open Graph, Twitter Cards, JSON-LD, `sitemap.xml` y `robots.txt`.
- `NEXT_PUBLIC_CONTACT_EMAIL`: correo que aparece en la política de privacidad y en `/.well-known/security.txt`.

Los valores incluidos son marcadores de posición. Cámbialos antes de desplegar.

## Rutas

| Ruta | Contenido |
| --- | --- |
| `/` | Landing: propuesta de valor, funciones, cómo funciona, privacidad, FAQ y CTA |
| `/app` | Aplicación: hoy, hábitos, estadísticas y ajustes |
| `/privacidad` | Política de privacidad |
| `/sitemap.xml` | Sitemap generado desde `src/app/sitemap.ts` |
| `/robots.txt` | Robots generado desde `src/app/robots.ts` |
| `/manifest.webmanifest` | Manifest PWA |
| `/opengraph-image` | Imagen Open Graph generada en el build |
| `/apple-icon` | Icono para iOS |
| `/icon.svg` | Favicon vectorial |

## Datos y privacidad

- Los hábitos, registros y preferencias viven en `localStorage` bajo la clave `habitrackv2`.
- No hay backend, cuentas, cookies de analítica ni peticiones a servicios de terceros.
- Exportar descarga un JSON con hábitos e historial. Importar acepta ese mismo formato, con validación estricta, límite de 3 MB y protección contra claves peligrosas.
- La primera visita crea cuatro hábitos de ejemplo para poder probar la app. Si ya existe el almacenamiento, no se vuelve a sembrar.

## Seguridad

- CSP estricta por petición con nonce y `strict-dynamic` en `src/proxy.ts`.
- Cabeceras de seguridad en `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-DNS-Prefetch-Control`, `X-Permitted-Cross-Domain-Policies` y HSTS en producción.
- `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` y `form-action 'self'`.
- Sin `dangerouslySetInnerHTML` salvo los bloques JSON-LD firmados con el nonce de la petición.
- `public/.well-known/security.txt` para el contacto de seguridad.

## SEO

- Metadatos por página, canonical y Open Graph/Twitter en `src/app/layout.tsx` y en cada página.
- JSON-LD de `WebSite`, `SoftwareApplication` y `FAQPage`.
- `sitemap.xml`, `robots.txt` y manifest generados por código.
- HTML semántico, `h1` único por página, enlaces con texto descriptivo y `lang="es"`.

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

- Tema oscuro único, foco visible y enlace «Saltar al contenido».
- Modales con trampa de foco, cierre con `Escape` y restauración del foco.
- Preferencia «Reducir movimiento» que desactiva transiciones y animaciones, además de respetar `prefers-reduced-motion`.
- Atajos de teclado: `Ctrl/Cmd + K` para la paleta, `N` nuevo hábito, `T` hoy, `H` hábitos, `S` estadísticas y `,` ajustes.
