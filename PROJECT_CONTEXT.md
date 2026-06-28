# Mi Despensa - Contexto completo del proyecto

## Resumen

Mi Despensa es una app web para gestionar compras familiares, enfocada principalmente en uso desde teléfonos. Permite manejar una lista activa de compras, marcar productos como comprados con gasto real, comparar presupuesto estimado contra gasto real, cerrar listas y consultar historial/estadísticas.

La app soporta dos modos de uso:

- Modo local sin cuenta: guarda datos en `localStorage` del navegador.
- Modo con Google/Supabase: guarda y sincroniza datos en la nube usando Supabase.

## Stack técnico

- Next.js 14 con App Router.
- TypeScript.
- Tailwind CSS.
- Supabase para autenticación, base de datos y Realtime.
- Google OAuth vía Supabase.
- Radix UI para modales, dropdown y toast.
- Recharts para estadísticas.
- `react-qr-code` para invitaciones de grupo.
- `lucide-react` para iconos.

## Repositorio

Repositorio remoto:

```txt
git@github.com:Rodrxx-264/MiDespensa.git
```

Rama principal:

```txt
master
```

## Estructura principal

```txt
mi-despensa/
├── README.md
├── PROJECT_CONTEXT.md
├── supabase.sql
├── package.json
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── api/
│   │   └── unirse/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
```

## Funcionalidades actuales

### Landing pública

Ruta:

```txt
/
```

Presenta la app como un cuaderno de mercado digital para compras familiares. El diseño usa una identidad visual inspirada en ticket/lista de mercado, con paleta sobria y enfoque móvil.

### Login

Ruta:

```txt
/auth/login
```

Opciones disponibles:

- Continuar con Google.
- Entrar sin cuenta.

Al usar Google, se limpia la cookie de modo local para evitar que la app siga usando `localStorage`.

Cookie de modo local:

```txt
mi_despensa_local=1
```

### Callback OAuth

Ruta:

```txt
/auth/callback
```

Intercambia el código OAuth por sesión Supabase y borra la cookie local.

### Dashboard

Ruta:

```txt
/dashboard
```

Protegida por middleware. Permite entrar si existe sesión Supabase o cookie local.

Incluye:

- Lista activa.
- Crear grupo inicial.
- Agregar productos.
- Editar productos.
- Eliminar productos.
- Marcar productos como comprados.
- Ingresar precio real y tienda.
- Modo compra optimizado para móvil.
- Cerrar lista.
- Barra de presupuesto.

### Modo compra

El modo compra está pensado para uso en supermercado desde celular.

Flujo actual:

1. El usuario toca un producto pendiente.
2. Se abre un modal.
3. Ingresa precio real pagado.
4. Selecciona tienda.
5. Confirma compra.

Esto alimenta la comparación contra el precio estimado.

### Presupuesto

El resumen calcula:

- Total estimado.
- Total real pagado.
- Diferencia.
- Presupuesto máximo si existe.

Los totales multiplican precio por cantidad.

### Historial

Ruta:

```txt
/dashboard/historial
```

Muestra listas cerradas, detalle de productos, estimado vs real y tienda.

En modo local lee desde `localStorage`.

En modo Supabase lee desde la base de datos.

### Estadísticas

Ruta:

```txt
/dashboard/estadisticas
```

Incluye:

- Comparativa entre listas.
- Gasto por período.
- Productos frecuentes.
- Variación de precios.
- Tiendas favoritas como sección preparada.

### Grupos

Ruta:

```txt
/dashboard/grupo
```

Incluye:

- Nombre del grupo.
- QR de invitación.
- Regenerar QR.
- Miembros del grupo.
- Salir/expulsar miembros según permisos.

### Unirse a grupo

Ruta:

```txt
/unirse?codigo=...
```

Permite ingresar o leer un código QR para unirse a un grupo en Supabase. Si el usuario no tiene sesión, redirige a login conservando el código.

## Modos de persistencia

### Modo local

Archivo clave:

```txt
src/lib/local.ts
```

Usa:

```txt
localStorage: mi_despensa_local_data
cookie: mi_despensa_local=1
```

Guarda localmente:

- Perfil local.
- Grupo local.
- Listas.
- Productos.

Importante: el modo local no sincroniza entre dispositivos y no sube datos a Supabase.

### Modo Supabase

Archivos clave:

```txt
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/middleware.ts
src/middleware.ts
```

Cuando hay sesión real de Supabase, los hooks priorizan Supabase sobre modo local aunque la cookie local haya existido antes.

## Base de datos

Archivo SQL completo:

```txt
supabase.sql
```

Tablas:

- `perfiles`
- `grupos`
- `listas`
- `productos`
- `historial_precios`

Aunque `historial_precios` existe en SQL, la búsqueda con IA fue retirada por problemas de cuota de Gemini.

El SQL incluye:

- Índices.
- RLS.
- Triggers de totales.
- Trigger para crear perfil al registrarse con Google.
- Realtime para productos.

## IA/Gemini

La integración con Gemini fue eliminada.

Motivo:

- Gemini devolvía errores 429 por cuota del free tier.
- El enfoque actual evita dependencia de APIs externas pagadas o limitadas.

Archivos eliminados:

- `src/app/api/gemini/route.ts`
- `src/lib/gemini.ts`
- Componentes de búsqueda con IA.

## Diseño actual

Se aplicó `SKILL.md` como guía de diseño.

Dirección visual:

- Inspiración: cuaderno/ticket de mercado familiar guatemalteco.
- Enfoque: formal, minimalista, móvil e intencional.
- Firma visual: borde tipo recibo/lista perforada y reglas punteadas de mercado.

Tokens principales:

```txt
Tinta volcánica: #18201D
Jade mercado: #1B7F65
Maíz: #D6A531
Crema fría: #EEF1EA
Bosque profundo: #0D3B32
Arcilla: #8B3F2F
```

Clases CSS importantes:

- `surface`
- `panel`
- `eyebrow`
- `metric`
- `receipt-edge`
- `market-rule`

## Enfoque móvil

El proyecto está orientado primero a teléfonos.

Optimizaciones móviles actuales:

- Navegación inferior fija con safe area.
- Acciones principales fijas en la lista activa.
- Categorías sticky en móvil.
- Tarjetas de producto compactas.
- Botón `Comprar` ancho y fácil de tocar.
- Modales bottom sheet con `92dvh`.
- Modo compra fullscreen.
- Padding inferior extra para no tapar contenido con navegación.

## Variables de entorno

Archivo local:

```txt
.env.local
```

Variables actuales:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En Vercel se deben configurar las mismas variables.

## Comandos

Instalar dependencias:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Typecheck:

```bash
npx tsc --noEmit
```

## Flujo Git acordado

De ahora en adelante, cada cambio debe:

1. Validarse cuando aplique.
2. Crear un commit descriptivo en español.
3. Subirse a GitHub con `git push origin master`.

## Commits relevantes

- `629502c Construir base completa de Mi Despensa V2`
- `716985f Mejorar respuesta JSON de Gemini`
- `7c29ffd Manejar errores de Gemini en JSON`
- `76619c0 Agregar modo local sin cuenta y quitar Gemini`
- `70fc7c5 Rediseñar interfaz minimalista y formal`
- `0ab37a4 Optimizar experiencia móvil de compras`

## Pendientes posibles

- Migrar datos locales a Supabase después de iniciar sesión con Google.
- Mejorar reutilización real de listas cerradas.
- Agregar edición de presupuesto máximo desde la UI.
- Completar tiendas favoritas con datos reales.
- Agregar pruebas automatizadas.
- Mejorar visualización de empty states por sección.
