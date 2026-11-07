# Configuración de Supabase

Todo lo que hay que revisar en el panel de Supabase para que la cuenta
obligatoria, la verificación por código y el cambio de contraseña funcionen.

Proyecto: `hoorwidwqscrsxtsipxf`

## 1. SQL · Tabla y RLS

Ejecuta `supabase/schema.sql` una vez en el **SQL Editor**. Crea:

- `public.motiveva_data`: un JSONB por usuario con hábitos, logs y preferencias.
- `public.motiveva_profiles`: nombre, fecha de nacimiento, objetivo y motivación que el usuario indica al registrarse y puede cambiar en Ajustes.
- RLS activada y políticas por fila (`auth.uid() = user_id`).
- Trigger `updated_at`.

## 2. Authentication → URL Configuration

| Campo | Valor |
| --- | --- |
| Site URL | `https://motiveva.site` |
| Redirect URLs | `https://motiveva.site/**`, `http://localhost:3000/**` |

## 3. Authentication → Sign In / Providers

- **Email**: activado.
- **Confirm email**: ON (obligatorio).
- Al activar la verificación, en *Email* elige el flujo **Magic Link + OTP**
  (por defecto) para que el template use `{{ .Token }}`.
- **Password minimum length**: 10 (queremos que coincida con la UI).
- **Minimum interval between emails**: 60 segundos.
- **Google**: configurar en Providers → Google con el callback
  `https://hoorwidwqscrsxtsipxf.supabase.co/auth/v1/callback`.

## 4. Authentication → Emails → Templates

En cada plantilla, pega el HTML correspondiente de `supabase/templates/`:

| Plantilla del panel | Archivo | Variables usadas |
| --- | --- | --- |
| Confirm signup | `confirm-signup.html` | `{{ .Token }}`, `{{ .ConfirmationURL }}` |
| Reset password | `reset-password.html` | `{{ .Token }}`, `{{ .ConfirmationURL }}` |
| Change email address | `email-change.html` | `{{ .Token }}`, `{{ .ConfirmationURL }}` |
| Magic link | (desactivado; no se usa) | — |

## 5. Autenticación segura

- No desactives «Confirm email»: en la app, el registro no se completa hasta
  introducir el código de 6 dígitos (`verifyOtp`).
- El restablecimiento usa `resetPasswordForEmail` con redirect a `/auth/reset`.
- Al guardar una contraseña nueva, la app cierra las demás sesiones
  (`signOut({ scope: "others" })`).
- SMTP propio recomendado (Project → Authentication → SMTP) para envíos
  desde tu dominio y evitar los límites del SMTP integrado.

## 6. Comprobación final

1. Crea una cuenta de prueba → llega el correo con código de 6 dígitos.
2. Introduce el código → sesión activa y `/app` accesible.
3. Cierra sesión y prueba «¿Has olvidado tu contraseña?» → correo con
   código/enlace → `/auth/reset` → contraseña nueva → sesiones cerradas.
4. Comprueba en Ajustes → Seguridad: cambiar contraseña y cambiar email.
5. Verifica que la tabla `motiveva_data` se crea y se actualiza al usar la app.
