# Checklist de release móvil

## Build

- [ ] `npm run build` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run lint` pasa sin errores.

## Funcionalidad

- [ ] Login con Google funciona.
- [ ] Login sin cuenta (modo local) funciona.
- [ ] Dashboard carga correctamente.
- [ ] Lista activa se puede navegar.
- [ ] Agregar productos funciona.
- [ ] Modo compra funciona.
- [ ] Cerrar lista funciona.
- [ ] Despensa funciona.
- [ ] Comparador de tiendas funciona.
- [ ] Historial funciona.
- [ ] Estadísticas funciona.
- [ ] Grupo funciona.
- [ ] Onboarding se muestra solo una vez.
- [ ] Ajustes se abren.
- [ ] Tema claro/oscuro funciona.
- [ ] Exportar datos funciona.
- [ ] Borrar datos locales funciona.
- [ ] Cerrar sesión funciona.

## Mobile

- [ ] Navegación inferior no tapa contenido.
- [ ] Botón atrás de Android funciona.
- [ ] Safe areas respetan notch/isla dinámica.
- [ ] Inputs no hacen zoom en móvil.
- [ ] Botones miden al menos 44px.
- [ ] Offline muestra banner sin conexión.
- [ ] Modo compra usable con una mano.
- [ ] Scroll horizontal no ocurre.
- [ ] Pull-to-refresh no rompe navegación.

## PWA

- [ ] Manifest se sirve con Content-Type correcto.
- [ ] Iconos 192 y 512 existen y se ven bien.
- [ ] Maskable icons existen.
- [ ] Theme-color funciona en modo claro y oscuro.
- [ ] La app se puede instalar como PWA.
- [ ] Splash screen se ve correcta.

## Android Studio

- [ ] Proyecto se abre sin errores.
- [ ] Sincronización de Gradle pasa.
- [ ] Build APK release funciona.
- [ ] APK se instala en dispositivo real.
- [ ] Login con Google funciona en dispositivo.
- [ ] Deep links configurados.
- [ ] Notificaciones piden permiso solo desde ajustes.
- [ ] Token push se guarda en Supabase.
- [ ] Ícono de app se ve correcto.
- [ ] Splash screen nativa se ve correcta.
- [ ] Status bar y navigation bar usan colores del proyecto.
- [ ] Orientación forzada a portrait.

## Seguridad

- [ ] No se guardan tokens manualmente en localStorage.
- [ ] No se loguean datos personales.
- [ ] No se exponen service role keys.
- [ ] No se incluyen analytics externos.
- [ ] No se piden permisos innecesarios.
- [ ] Permiso de notificaciones se pide solo cuando usuario activa.
- [ ] RLS está activo en todas las tablas.

## Documentación

- [ ] README actualizado con sección de empaquetado.
- [ ] docs/capacitor.md actualizado.
- [ ] docs/android-push-notifications.md actualizado.
- [ ] Variables de entorno documentadas.
