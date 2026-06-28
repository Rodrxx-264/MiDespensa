# Mi Despensa V2

App web para gestionar compras familiares en Guatemala con Supabase, Google OAuth, QR, Realtime y búsqueda de precios con Gemini.

## Requisitos

Instala Node.js 20+, Git y crea cuentas gratuitas en Google, Supabase, Vercel y Google AI Studio.

## Configuración local

1. Ejecuta `npm install`.
2. Crea un proyecto en Supabase llamado `mi-despensa`.
3. En Supabase, copia Project URL y anon public key desde `Project Settings > API`.
4. Activa Google en `Authentication > Providers`.
5. En Google Cloud Console crea credenciales OAuth y pega Client ID/Secret en Supabase.
6. En Supabase agrega `http://localhost:3000` como Site URL y `http://localhost:3000/auth/callback` como Redirect URL.
7. Crea una API key en `https://aistudio.google.com/apikey`.
8. Copia `.env.local` y reemplaza los placeholders.
9. Ejecuta el contenido de `supabase.sql` en Supabase SQL Editor.
10. Corre `npm run dev` y abre `http://localhost:3000`.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
GEMINI_API_KEY=tu_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Conecta el repo en Vercel.
3. Agrega las mismas variables de entorno en Vercel Dashboard.
4. En Supabase actualiza Site URL con tu dominio de Vercel.
5. Agrega `https://tu-dominio.vercel.app/auth/callback` a Redirect URLs.
6. Haz deploy.

## Verificación funcional

- `npm run dev` debe arrancar en `localhost:3000`.
- Google OAuth funciona con las URLs configuradas.
- Crear grupo y QR funciona desde `/dashboard` y `/dashboard/grupo`.
- Unirse por código funciona desde `/unirse?codigo=...`.
- Los productos usan Supabase Realtime por la tabla `productos`.
- Gemini se consulta solo desde `/api/gemini` y guarda historial de precios.
