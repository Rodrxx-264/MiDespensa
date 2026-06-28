# Empaquetar como APK con Capacitor

## Requisitos

- Node.js 18+
- Android Studio (con SDK)
- JDK 17+
- Una cuenta en Supabase (para sincronización)

## Instalación

```bash
npm install
npx cap init "Mi Despensa" "com.midespensa.app"
npx cap add android
```

## Estrategia de empaquetado

Este proyecto usa **Capacitor en modo servidor remoto**.  
La app carga la URL de Vercel dentro de un WebView nativo.

### Ventajas

- No rompe Next.js App Router.
- Auth con Supabase funciona correctamente.
- Las actualizaciones no requieren nueva APK.
- Las rutas dinámicas, cookies y middleware funcionan.

### Desventajas

- Requiere conexión a internet.

## Variables de entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
CAPACITOR_SERVER_URL=https://tu-dominio.vercel.app
```

## Build y sincronización

### Con servidor remoto (recomendado)

```bash
CAPACITOR_SERVER_URL=https://tu-dominio.vercel.app npx cap sync android
npx cap open android
```

### Con build estático (alternativa)

Si querés una app completamente offline, necesitás cambiar a `output: "export"` en `next.config.mjs`.
Esto **rompe** las rutas dinámicas de Supabase Auth y el middleware.  
No recomendado para este proyecto.

## Generar APK desde Android Studio

1. Abrí Android Studio.
2. Esperá que sincronice Gradle.
3. Andá a `Build → Build Bundle(s) / APK(s) → Build APK(s)`.
4. El APK se genera en `android/app/build/outputs/apk/debug/`.

Para release:

1. `Build → Generate Signed Bundle / APK`.
2. Seguí el asistente con tu keystore.
3. Elegí `APK` o `Android App Bundle`.

## Iconos y splash

Los iconos SVG están en `public/icons/`.  
Para generar PNG reales, usá una herramienta como **sharp** o **PWA Asset Generator** antes del build.

Ejemplo con sharp:

```bash
npm install --save-dev sharp
npx sharp-cli --input public/icons/icon.svg --output public/icons/icon-192.png --width 192 --height 192
```

## Deep links

Para que funcione OAuth en la app empaquetada, configurá estos deep links en Supabase:

```
com.midespensa.app://auth/callback
```

Y en `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.midespensa.app" android:host="auth" />
</intent-filter>
```
