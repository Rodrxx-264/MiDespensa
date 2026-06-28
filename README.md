# Mi Despensa

App web mobile-first para comprar mejor, cuidar presupuesto, evitar desperdicio y entender precios con datos propios. Funciona en modo local sin cuenta o sincronizada con Supabase/Google.

## Enfoque de privacidad

Mi Despensa no vende datos, no usa publicidad y no incluye rastreadores ocultos. Solo guarda información necesaria para listas, presupuestos, historial, despensa y sugerencias. Consulta `PRIVACY.md`.

## Funciones principales

- Lista activa con presupuesto y modo compra.
- Prioridad por producto y modo `No me alcanza`.
- Presupuesto por categoría.
- Pegar listas desde WhatsApp/texto.
- Historial de precios y comparador de tiendas según tus datos.
- Despensa en casa.
- Onboarding privado y ajustes.
- Exportar/borrar datos.
- Modo local sin cuenta.

## Requisitos

Instala Node.js 20+, Git y crea cuentas gratuitas en Google, Supabase, Vercel y Google AI Studio.

## Configuración local

1. Ejecuta `npm install`.
2. Crea un proyecto en Supabase llamado `mi-despensa`.
3. En Supabase, copia Project URL y anon public key desde `Project Settings > API`.
4. Activa Google en `Authentication > Providers`.
5. En Google Cloud Console crea credenciales OAuth y pega Client ID/Secret en Supabase.
6. En Supabase agrega `http://localhost:3000` como Site URL y `http://localhost:3000/auth/callback` como Redirect URL.
7. Copia `.env.local` y reemplaza los placeholders.
8. Ejecuta el contenido de `supabase.sql` en Supabase SQL Editor.
9. Corre `npm run dev` y abre `http://localhost:3000`.

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Despliegue en Vercel

1. Sube el proyecto a GitHub.
2. Conecta el repo en Vercel.
3. Agrega las mismas variables de entorno en Vercel Dashboard.
4. En Supabase actualiza Site URL con tu dominio de Vercel.
5. Agrega `https://tu-dominio.vercel.app/auth/callback` a Redirect URLs.
6. Haz deploy.

## Contribuir

Lee `CONTRIBUTING.md`. El proyecto prioriza privacidad, mobile-first y lógica transparente sin dependencias obligatorias de IA externa.

## Empaquetar como APK

```bash
npm install
npm install --save-dev @capacitor/core @capacitor/cli @capacitor/android @capacitor/push-notifications @capacitor/app
npx cap init "Mi Despensa" "com.midespensa.app"
npx cap add android
CAPACITOR_SERVER_URL=https://tu-dominio.vercel.app npx cap sync android
npx cap open android
```

Luego en Android Studio: `Build → Build APK`.

> La app carga la URL de Vercel dentro de un WebView nativo.  
> No requiere build estático. Las actualizaciones son inmediatas.

Ver `docs/capacitor.md` para más detalles.

## Verificación funcional

- `npm run dev` debe arrancar en `localhost:3000`.
- Google OAuth funciona con las URLs configuradas.
- Crear grupo y QR funciona desde `/dashboard` y `/dashboard/grupo`.
- Unirse por código funciona desde `/unirse?codigo=...`.
- Los productos usan Supabase Realtime por la tabla `productos`.
- Los precios se registran manualmente al agregar o marcar productos como comprados.
