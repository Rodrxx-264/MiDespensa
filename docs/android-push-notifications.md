# Notificaciones Push con Firebase Cloud Messaging

## Requisitos

- Proyecto en [Firebase Console](https://console.firebase.google.com)
- Cuenta de desarrollador de Google (para publicar)
- Dispositivo físico Android (el emulador no recibe FCM)

## 1. Crear proyecto Firebase

1. Andá a [Firebase Console](https://console.firebase.google.com).
2. Creá un proyecto nuevo o usá uno existente.
3. Registrá una app Android con package name:

```
com.midespensa.app
```

4. Descargá el archivo `google-services.json`.

## 2. Configurar Android

1. Copiá `google-services.json` en:

```
android/app/google-services.json
```

2. En `android/build.gradle`, asegurate de tener:

```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.4.2'
  }
}
```

3. En `android/app/build.gradle`:

```gradle
apply plugin: 'com.google.gms.google-services'
```

4. Sincronizá:

```bash
npx cap sync android
```

5. Abrí Android Studio y verificá que no haya errores.

## 3. Probar en dispositivo real

1. Conectá un dispositivo Android por USB.
2. En Android Studio, ejecutá la app.
3. La app pedirá permiso de notificaciones si está activado en ajustes.
4. El token se registra automáticamente y se guarda en Supabase.

## 4. Enviar notificaciones de prueba

Usá Firebase Console:

1. `Engage → Cloud Messaging → Send first message`.
2. Elegí la app.
3. Escribí título y texto.
4. Enviá.

## 5. Backend para envío (producción)

Para enviar notificaciones desde tu backend:

```ts
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const tokens = ["token1", "token2"]; // desde Supabase push_tokens

await admin.messaging().sendEachForMulticast({
  tokens,
  notification: {
    title: "Recordatorio de compra",
    body: "Tu lista semanal está esperando",
  },
});
```

Usá Firebase Admin SDK en un backend seguro (no en el cliente).

## Casos de uso planeados

- Recordatorio de compra semanal.
- Producto próximo a vencer en despensa.
- Presupuesto de categoría superado.
- Lista compartida modificada por otro miembro.
- Lista cerrada y lista nueva creada.

## Seguridad

- No exponer claves de Firebase en el cliente.
- No loguear tokens push.
- Los tokens se guardan en Supabase con RLS por usuario.
- La ruta `/api/push/send` devuelve 501 hasta implementarla.
