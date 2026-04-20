@AGENTS.md

# Intranet Logia Caleuche 250 — Guía de Arquitectura

## 0. Principios Generales (siempre respetar)

- **Idioma**: SIEMPRE comunicarse en **español**. El código puede estar en inglés, la comunicación nunca.

- **Plan Mode primero** — Presenta un plan detallado y espera aprobación antes de implementar en estos casos:
    - Nuevo módulo o feature completo
    - Cambio de schema de Prisma
    - Nueva ruta o layout en el App Router
    - Cambio que afecte > 2 archivos no relacionados

    Termina siempre el plan con: _"¿Apruebas este plan? ¿Qué cambiarías?"_

    **Escape hatch**: Si el usuario incluye `"sin plan"` en su mensaje, implementa directamente.

- **Verificación obligatoria** — Después de cualquier cambio:
    - Ejecuta `pnpm lint && pnpm build` en el área modificada
    - Nunca marques una tarea como terminada sin lint + build pasando

- **Prisma: SIEMPRE migraciones, NUNCA `db push`** — Ante cualquier cambio de schema:
    - Usar `pnpm prisma migrate dev --name descripcion_del_cambio`
    - Para migraciones con SQL raw personalizado: `pnpm prisma migrate dev --create-only --name nombre` → editar el archivo SQL → `pnpm prisma migrate dev`
    - Si el CLI detecta ambiente no-interactivo, crear la migración manualmente en `prisma/migrations/` y marcarla con `pnpm prisma migrate resolve --applied <nombre>`
    - **Prohibido** usar `prisma db push` — no deja registro, no permite rollback

- **Eficiencia** — Haz ÚNICAMENTE lo que se solicita. Sin extras, sin refactors no pedidos.

- **Subagentes cuando sea útil** — Usa subagentes para tareas paralelas o de exploración extensa.

- **Actualiza el CLAUDE.md** — Si el usuario corrige un comportamiento repetido, proponer ajuste al CLAUDE.md solo cuando la regla sea reutilizable.

## 1. Uso obligatorio de Agentes por área

- `frontend/` → Skill `nextjs-ddd-expert`
- `backend/` → Skill `backend-architect`
- Exploración amplia → `Agent` con `subagent_type=Explore`
- Búsquedas dirigidas → `Glob` o `Grep`

## 2. Protocolo de Control y Seguridad del Agente

- **Restricción de scope**: Frontend prohibido generar lógica de DB, controladores o esquemas Prisma. Backend prohibido generar JSX/TSX o estilos Tailwind.
- **Sin código aleatorio**: Cada línea debe tener un lugar en la arquitectura DDD.
- **Scope quirúrgico**: Prohibido modificar archivos de configuración (`package.json`, `tsconfig.json`, `biome.json`, etc.) salvo solicitud explícita.
- **No reescribas archivos completos**: Si el archivo tiene > 50 líneas, entrega solo el bloque modificado.
- **DRY Enforcement**: Verificar si la lógica ya existe antes de escribir.
- **Contract-First**: Si Frontend necesita un dato del Backend inexistente, generar primero la Interface TypeScript.

---

## Stack

| Tecnología           | Versión    | Uso                                            |
| -------------------- | ---------- | ---------------------------------------------- |
| Next.js              | 16.2.0     | Framework (App Router + Turbopack)             |
| React                | 19.2.4     | UI                                             |
| TailwindCSS          | 4          | Estilos (con CSS variables en `globals.css`)   |
| Prisma               | 7.5.0      | ORM (PostgreSQL adapter)                       |
| PostgreSQL           | 16         | Base de datos (Neon hosted)                    |
| NextAuth             | v5 beta.30 | Autenticación (JWT, Credentials, 2FA TOTP)     |
| Zod                  | 4.x        | Validación de esquemas                         |
| React Hook Form      | 7.x        | Manejo de formularios                          |
| TanStack Table       | v8         | Tablas de datos                                |
| Biome                | 2.x        | Linter + Formatter (reemplaza ESLint/Prettier) |
| Cloudinary           | 2.x        | Almacenamiento de archivos e imágenes          |
| Nodemailer + Brevo   | 8.x        | Email transaccional vía SMTP                   |
| react-markdown       | 10.x       | Renderizado Markdown en posts del Feed         |
| remark-gfm           | 4.x        | Plugin GitHub Flavored Markdown                |
| Lucide React         | 0.577      | Iconos                                         |
| Sonner               | 2.x        | Toast notifications                            |
| date-fns             | 4.x        | Manipulación de fechas                         |
| bcryptjs             | 3.x        | Hash de contraseñas                            |
| **Idioma UI**        | —          | Español (`lang="es"`)                          |

---

## Estructura de Directorios

```
src/
├── app/
│   ├── (public)/                          # Rutas sin auth
│   │   ├── layout.tsx                     # Layout centrado (sin sidebar)
│   │   ├── login/page.tsx
│   │   ├── login/verify-2fa/page.tsx      # Segundo factor TOTP
│   │   └── recovery/page.tsx
│   ├── (admin)/                           # Rutas protegidas (requieren auth)
│   │   ├── layout.tsx                     # auth() → redirect si no hay sesión
│   │   ├── dashboard/page.tsx
│   │   ├── feed/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── usuarios/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── eventos/page.tsx
│   │   ├── tesoreria/
│   │   │   ├── ingresos/page.tsx
│   │   │   ├── egresos/page.tsx
│   │   │   └── informe/page.tsx
│   │   ├── documentos/
│   │   │   ├── page.tsx                   # Documentos generales
│   │   │   ├── buscar/page.tsx            # Búsqueda Full-Text Search
│   │   │   └── favoritos/page.tsx         # Favoritos del usuario
│   │   ├── aprendiz/                      # Documentos grado 1
│   │   │   ├── biblioteca/, trazados/
│   │   ├── companero/                     # Documentos grado 1-2
│   │   │   ├── biblioteca/, trazados/
│   │   ├── maestro/                       # Documentos todos los grados
│   │   │   ├── biblioteca/, trazados/
│   │   ├── perfil/
│   │   │   ├── notificaciones/page.tsx    # Preferencias de notificación
│   │   │   └── seguridad/page.tsx         # 2FA TOTP
│   │   └── configuracion/
│   │       ├── page.tsx                   # Panel SuperAdmin
│   │       └── logs/page.tsx              # Log de auditoría
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── cron/
│   │   │   ├── cumpleanos/route.ts        # Email + notificación in-app cumpleaños
│   │   │   ├── aniversarios/route.ts      # Email + notificación in-app iniciación
│   │   │   └── eventos/route.ts           # Resumen semanal de eventos
│   │   ├── notifications/count/route.ts   # GET — cuenta sin leer (polling 30s)
│   │   └── raw/[...path]/route.ts         # Proxy de archivos Cloudinary
│   ├── globals.css
│   └── layout.tsx                         # Root layout (html/body/providers)
│
├── features/                              # Módulos DDD
│   ├── auth/
│   ├── feed/
│   ├── eventos/
│   ├── documentos/
│   ├── notificaciones/
│   ├── tesoreria/
│   ├── usuarios/
│   └── dashboard/
│
├── shared/
│   ├── components/
│   │   ├── ui/                            # Primitivos: button, card, input, table, badge, avatar, tooltip, confirm-dialog
│   │   └── layout/                        # AdminShell, Sidebar, Topbar, AuthBackground
│   ├── hooks/                             # Custom hooks globales
│   ├── lib/
│   │   ├── auth.ts                        # NextAuth config (CANÓNICO — usar siempre este)
│   │   ├── auth-guards.ts                 # requireAuth(), requireAdmin(), requireTesorero()
│   │   ├── db.ts                          # Prisma client singleton (CANÓNICO)
│   │   ├── utils.ts                       # cn(), truncate(), formatCLP(), formatDate(), getMesNombre()
│   │   ├── slugs.ts                       # slugify(), generateUniqueSlug()
│   │   ├── cloudinary.ts                  # getCloudinaryImageUrl(), getCloudinaryRawImageUrl(), getCloudinaryPdfUrl()
│   │   ├── cloudinary-upload.ts           # uploadToCloudinary(file, folder, resourceType)
│   │   ├── email.ts                       # sendCumpleanos(), sendAniversario(), sendInvitacionEvento(), sendRecovery()
│   │   └── activity-log.ts               # logActivity() — escribe en tabla activity_log
│   ├── constants/
│   │   └── domain.ts                      # GRADO, CATEGORIA, OFICIALIDAD, MESES_NOMBRE, GRADO_LABEL, ...
│   └── types/
│       ├── actions.ts                     # ActionResult<T>
│       └── next-auth.d.ts                 # Type augmentation de sesión
│
└── generated/
    └── prisma/                            # Cliente Prisma generado — NO EDITAR
```

---

## Modelos de Base de Datos (Prisma)

### Usuarios y Permisos

| Modelo         | Campos clave                                                                                                                                                                                     | Notas                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `User`         | id, email, username (RUT), password, name, lastName, slug, dateBirthday, phone, address, city, categoryId, gradoId, oficialidadId, dateInitiation, dateSalary, dateExalted, active, 2FA fields | Imagen en Cloudinary (`logiacaleuche/usuarios/`) |
| `Grado`        | id, nombre                                                                                                                                                                                       | 1=Aprendiz, 2=Compañero, 3=Maestro              |
| `UserCategory` | id, nombre                                                                                                                                                                                       | 1=SuperAdmin, 2=Admin, 3=Usuario                |
| `Oficial`      | id, nombre                                                                                                                                                                                       | 15 oficialidades, id=7 es Tesorero              |

### Contenido — Feed

| Modelo          | Campos clave                                                             | Notas                                              |
| --------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| `Feed`          | id, titulo, slug, categoryId, fileName, contenido, userId, active, createdAt | Contenido renderizado como Markdown (react-markdown) |
| `CategoryFeed`  | id, nombre                                                               | Categorías de posts                                |
| `CommentFeed`   | id, userId, feedId, message, createdAt                                   |                                                    |
| `FeedReaction`  | id, feedId, userId, emoji, createdAt                                     | `@@unique([feedId, userId, emoji])` — botón ❤️ funcional |
| `FeedMention`   | id, feedId, mentionedUserId                                              | Parser @slug en createFeedPost — notifica al mencionado |

### Contenido — Eventos

| Modelo              | Campos clave                                         | Notas                        |
| ------------------- | ---------------------------------------------------- | ---------------------------- |
| `Evento`            | id, nombre, autor, fecha, hora, lugar, gradoId, tipoActividadId, active | categoryId mapea a grado visible |
| `TipoActividad`     | id, nombre                                           |                              |
| `EventoAsistencia`  | id, eventoId, userId, estado                         | confirmado / tentativo / no_asiste |

### Documentos (filtrados por `gradoId`)

| Modelo              | Campos clave                                               | Notas                              |
| ------------------- | ---------------------------------------------------------- | ---------------------------------- |
| `Biblioteca`        | id, nombre, autor, fileName, gradoId                       | FTS en español (columna `search_vector`) |
| `Trazado`           | id, nombre, fileName, autorId, gradoId, tipoActividadId, fecha | FTS en español (columna `search_vector`) |
| `Document`          | id, nombre, fileName, fechaDoc, createdAt                  | Sin filtro de grado. FTS en español |
| `DocumentFavorite`  | id, userId, documentType, documentId, createdAt            | `@@unique([userId, documentType, documentId])` |
| `DocumentView`      | userId, documentType, documentId, viewedAt                 | Compuesto PK — upsert en cada vista |

### Tesorería

| Modelo          | Campos clave                                    |
| --------------- | ----------------------------------------------- |
| `EntradaDinero` | id, userId, mes, ano, motivoId, monto, fechaMov |
| `EntradaMotivo` | id, nombre                                      |
| `SalidaDinero`  | id, userId, mes, ano, motivoId, monto, fechaMov |
| `SalidaMotivo`  | id, nombre                                      |

### Notificaciones y Auditoría

| Modelo                    | Campos clave                                                            | Notas                                                                             |
| ------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Notification`            | id, userId, type, title, message, href, read, createdAt                 | type: `feed`, `comment`, `evento`, `biblioteca`, `trazado`, `cumpleanos`, `aniversario`, `mention` |
| `NotificationPreference`  | userId, type, inApp, email                                              | `@@id([userId, type])` — defaults: inApp=true, email=false                        |
| `ActivityLog`             | id, userId, userEmail, action, entity, entityId, description, metadata, ipAddress, status, createdAt | Log de auditoría de acciones admin |

---

## Autenticación y Sesión

**Archivo canónico:** `src/shared/lib/auth.ts`

**Estructura de sesión JWT:**

```typescript
session.user = {
  id: string
  email: string
  name: string                    // firstName + " " + lastName
  image: string | null            // URL del avatar (Cloudinary)
  rut: string                     // username (RUT chileno)
  grado: number                   // 1=Aprendiz, 2=Compañero, 3=Maestro
  gradoNombre: string
  oficialidad: number             // id de Oficial (7=Tesorero)
  oficialidadNombre: string
  categoryId: number              // 1=SuperAdmin, 2=Admin, 3=Usuario
  categoryNombre: string
  active: boolean
}
```

**2FA TOTP**: Los usuarios pueden activar autenticación de dos factores en `/perfil/seguridad`. El flujo de login con 2FA redirige a `/login/verify-2fa` donde se valida el código TOTP o un código de respaldo.

---

## Control de Acceso

```typescript
// Obtener sesión en Server Actions o layouts
const session = await auth();

// Niveles de acceso
const isAdmin = session.user.categoryId <= 2;     // SuperAdmin o Admin
const isTesorero = session.user.oficialidad === 7 || isAdmin;

// Filtrado por grado (documentos y eventos)
// Aprendiz (1): solo contenido con gradoId = 1
// Compañero (2): contenido con gradoId <= 2
// Maestro (3): todo el contenido
const grado = session.user.grado;
```

**Notificaciones por grado** — Al crear contenido de grado N, notificar solo a usuarios que pueden verlo:
```typescript
// grado 1 → todos | grado 2 → compañeros y maestros | grado 3 → solo maestros
const gradoWhere =
    gradoId === 1 ? {} :
    gradoId === 2 ? { gradoId: { in: [2, 3] } } :
    { gradoId: 3 };
```

**Regla del layout `(admin)`:** `auth()` → si no hay sesión → `redirect("/login")`. Ninguna página protegida hace su propio redirect.

---

## Features (DDD)

Cada feature encapsula su dominio completo:

```
features/[nombre]/
├── actions/index.ts    # Server Actions (fetch + mutaciones)
├── components/*.tsx    # Componentes del dominio
└── schemas/index.ts    # Zod schemas de validación
```

**Regla:** Las páginas en `app/(admin)/[feature]/page.tsx` solo importan de `features/[feature]/` y `shared/`. Nunca cruzan features.

### Resumen de Features Implementados

| Feature           | Acciones principales                                                                                             | Restricción                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `auth`            | loginAction, recoveryAction                                                                                      | —                                |
| `dashboard`       | getDashboardData, sendBirthdayMessage                                                                            | auth                             |
| `feed`            | getFeedPosts, getFeedPostBySlug, createFeedPost, addComment, toggleReaction, deleteFeedPost                      | auth / crear: cualquier usuario  |
| `notificaciones`  | createNotifications, getNotifications, markAsRead, getNotificationPreferences, updateNotificationPreference      | auth                             |
| `usuarios`        | getUsuarios, getUsuarioById, createUser, updateUserProfile, changePassword, uploadProfileImage                   | crear: admin+                    |
| `eventos`         | getEventos (filtrado por grado), createEvento, getTiposActividad                                                 | crear: admin+                    |
| `documentos`      | getBiblioteca, getTrazados, getDocumentos — CRUD para Libro, Trazado, Document — toggleDocumentFavorite, getFavoritesWithDetails, registerDocumentView, searchDocumentos | crear: admin+ |
| `tesoreria`       | getResumenTesoreria, getEntradas/Salidas, createEntrada/Salida, getInforme                                       | tesorero+                        |

---

## Sistema de Notificaciones

### In-app (tiempo real)
- `NotificationBell.tsx` hace polling cada **30 segundos** a `/api/notifications/count`
- Badge en el Topbar muestra conteo de notificaciones no leídas
- Las notificaciones se crean con `createNotifications(userIds, type, title, message?, href?)`
- `createNotifications` consulta `NotificationPreference` antes de insertar: si `inApp: false` para ese tipo, no se crea la notificación

### Email (Brevo SMTP)
- `sendCumpleanos(user)` — email de cumpleaños
- `sendAniversario({ email, nombre, anios })` — aniversario de iniciación masónica
- `sendInvitacionEvento(user, evento)` — invitación semanal de eventos
- `sendRecovery(email, token)` — recuperación de contraseña

### Preferencias por usuario
- Tabla `notification_preferences`: `@@id([userId, type])`, defaults `inApp: true`, `email: false`
- UI en `/perfil/notificaciones` con toggles por tipo × canal
- `updateNotificationPreference(type, field, value)` usa `upsert`

### Cron Jobs (registrados en `vercel.json`)
Todos requieren cabecera `Authorization: Bearer $CRON_SECRET`.

| Endpoint | Schedule | Acción |
|---|---|---|
| `/api/cron/cumpleanos` | `0 12 * * *` (diario 12 UTC) | Email + notificación in-app por cumpleaños |
| `/api/cron/aniversarios` | `0 12 * * *` (diario 12 UTC) | Email + notificación por aniversario de iniciación |
| `/api/cron/eventos` | `0 12 * * 1` (lunes 12 UTC) | Resumen semanal de eventos por email |

---

## Búsqueda Full-Text Search (FTS)

Implementada con **PostgreSQL FTS nativo** — no requiere infraestructura adicional.

- **Columnas generadas**: `search_vector tsvector GENERATED ALWAYS AS ... STORED` en `biblioteca`, `trazado`, `documents`
- **Índices GIN** sobre cada columna `search_vector`
- **Idioma**: `spanish` (diccionario de stems en español)
- **Server Action**: `searchDocumentos(query, tipo?)` en `features/documentos/actions/index.ts`
- Filtra automáticamente por grado del usuario en sesión
- Usa `$queryRawUnsafe` con parámetros — entrada sanitizada antes de usarse

---

## Feed — Funcionalidades

- **Markdown**: `FeedDetail.tsx` renderiza el contenido con `react-markdown` + `remark-gfm` (listas, negritas, links, código)
- **Reacciones ❤️**: botón funcional con `useOptimistic` para feedback instantáneo. `toggleReaction(feedId)` hace upsert/delete en `feed_reactions`
- **@Menciones**: `createFeedPost` parsea `/@([a-z0-9-]+)/g` sobre el contenido, resuelve slugs de usuarios, crea registros en `feed_mentions` y notifica a los mencionados
- **Paginación client-side**: `FeedList.tsx` pagina en memoria (PAGE_SIZE=4). Para escalar, refactorizar a cursor-based con `getFeedPosts({ cursor, limit })`

---

## Documentos — Funcionalidades

- **Favoritos**: botón ★ en cada card (`DocGradoList.tsx`). Estado optimista con `useState<Set<number>>`. `toggleDocumentFavorite(tipo, id)` es la Server Action
- **Vistas recientes**: `registerDocumentView(tipo, id)` hace upsert al abrir un documento
- **Vista unificada de favoritos**: `/documentos/favoritos` — muestra biblioteca, trazados y documentos favoritos del usuario
- **Búsqueda**: `/documentos/buscar?q=...` — Server Component que llama `searchDocumentos(q)`

---

## Server Actions — Patrón Estándar

```typescript
'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/db';

import { Schema } from '../schemas';

export async function createItem(formData: FormData): Promise<ActionResult<Item>> {
    const session = await auth();
    if (!session) throw new Error('No autorizado');

    const parsed = Schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { success: false, error: parsed.error.flatten() };

    const data = await prisma.model.create({ data: parsed.data });
    revalidatePath('/ruta/del/feature');
    return { success: true, data };
}
```

**Tipo de retorno estándar** (`src/shared/types/actions.ts`):

```typescript
type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string | ZodFlattenedErrors };
```

**Nunca usar** Route Handlers (`/api/`) para mutaciones internas — solo Server Actions.

---

## Auth Guards

Usar `@/shared/lib/auth-guards.ts` para controlar acceso en Server Actions:

```typescript
import { requireAuth, requireAdmin, requireTesorero } from '@/shared/lib/auth-guards';

// Para lecturas (cualquier usuario autenticado):
await requireAuth(); // lanza Error si no hay sesión

// Para mutations de admin (categoryId <= 2):
const session = await requireAdmin();
if (!session) return { success: false, error: 'No autorizado' };

// Para tesorería (tesorero u admin):
const session = await requireTesorero();
if (!session) return { success: false, error: 'No autorizado' };
```

---

## Generación de Slugs

Utilidad en `@/shared/lib/slugs.ts`:

- `slugify(text)` — convierte texto a slug kebab-case
- `generateUniqueSlug(text, checkFn)` — genera slug único consultando la BD, evita errores `P2002`

Usado en: `Feed`, `User` (basado en nombre completo).

---

## Subida de Archivos

- Destino: **Cloudinary** — helper `uploadToCloudinary(file, folder, resourceType)` en `@/shared/lib/cloudinary-upload.ts`
- Carpetas: `logiacaleuche/usuarios/`, `logiacaleuche/biblioteca/`, `logiacaleuche/trazados/`, `logiacaleuche/documentos/`
- Validación de MIME type via magic bytes — soporta imágenes y PDFs
- Helpers de lectura en `@/shared/lib/cloudinary.ts`:
  - `getCloudinaryImageUrl(fileName)` — URL optimizada para imágenes
  - `getCloudinaryRawImageUrl(fileName)` — URL sin optimización (para avatares)
  - `getCloudinaryPdfUrl(fileName)` — URL de descarga para PDFs

---

## Componentes Compartidos (`shared/`)

### UI Primitivos

| Componente          | Descripción                                                  |
| ------------------- | ------------------------------------------------------------ |
| `button.tsx`        | Botón con variantes (primary, secondary, ghost, destructive) |
| `card.tsx`          | Contenedor con header/content/footer                         |
| `input.tsx`         | Input con label y estado de error                            |
| `table.tsx`         | Wrapper de TanStack Table                                    |
| `badge.tsx`         | Etiqueta/indicador de estado                                 |
| `avatar.tsx`        | Imagen de perfil con fallback                                |
| `glass-panel.tsx`   | Panel con efecto glass (`rounded-xl border backdrop-blur`)   |
| `tooltip.tsx`       | Tooltip Radix UI con `asChild` — usar `<span>` como trigger si hay `<button>` padre |
| `confirm-dialog.tsx`| Dialog de confirmación para acciones destructivas            |
| `modal.tsx`         | Modal genérico Radix UI                                      |

### Componentes compartidos

| Componente         | Descripción                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `BirthdayCard.tsx` | Lista de próximos cumpleaños con avatar, nombre y badge de días   |
| `FeedNewsList.tsx` | Lista de posts del feed: avatar inicial, título, fecha, categoría |

### Layout

| Componente           | Descripción                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `AdminShell.tsx`     | Wrapper principal: sidebar + topbar + `{children}`                     |
| `Sidebar.tsx`        | Navegación vertical con ítems filtrados por grado                      |
| `Topbar.tsx`         | Header con perfil de usuario, NotificationBell (badge polling 30s)     |
| `AuthBackground.tsx` | Fondo para pantallas de auth                                           |

### Utilidades (`shared/lib/utils.ts`)

```typescript
cn(...classes);          // Tailwind merge + clsx
truncate(str, length);   // Truncar texto con "..."
formatCLP(amount);       // Formato moneda chilena: $1.234.567
formatDate(date);        // dd/MM/yyyy
getMesNombre(mes);       // 1 → "Enero", ..., 12 → "Diciembre"
```

---

## Variables de Entorno Requeridas

```bash
# Base de datos
DATABASE_URL=postgresql://USER:PASS@HOST:5432/logiacaleuche?sslmode=verify-full

# NextAuth v5
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://tu-dominio.cl
AUTH_TRUST_HOST=true

# Cron Jobs
CRON_SECRET=<openssl rand -base64 32>

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Brevo SMTP
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_USER=
BREVO_PASSWORD=
BREVO_FROM=tesoreria@logiacaleuche.cl
BREVO_FROM_NAME=R∴L∴ Caleuche 250
BREVO_NOREPLY=noreply@logiacaleuche.cl

# Firma tesorero (emails de tesorería)
EMAIL_TESORERO_NOMBRE=
EMAIL_TESORERO_TEL=
EMAIL_TESORERO_EMAIL=

# RUT del tesorero (excluido del cálculo de cuotas pendientes)
RUT_EXCLUIDO=
```

---

## Colores del Sistema

```css
/* globals.css — @theme */
--color-cg-primary-tonal: #9ea7ff;    /* Violeta-azul principal (texto/iconos) */
--color-cg-on-surface: #e7e6fc;       /* Texto principal */
--color-cg-on-surface-variant: #9b9bb5; /* Texto secundario */
--color-cg-outline: #4a4b6b;          /* Bordes y texto terciario */
--color-cg-surface: #0d0e1e;          /* Fondo principal */
--color-entrada: #41a65a;             /* Verde ingresos tesorería */
--color-salida: #56c0ef;              /* Azul egresos tesorería */
--color-total: #f29c13;               /* Naranja saldo */
--color-hospital: #41729d;            /* Azul oscuro caja hospitalaria */
```

Clases custom relevantes: `.admin-sidebar`, `.sidebar-nav-link`, `.sidebar-nav-link--active`, `.admin-topbar`, `.card-dashboard`, `.form-input`, `.form-textarea`, `.cg-empty-state`.

---

## Convenciones de Nombres

| Tipo                | Convención          | Ejemplo                            |
| ------------------- | ------------------- | ---------------------------------- |
| Componentes         | PascalCase          | `LoginForm.tsx`, `UserProfile.tsx` |
| Server Actions      | camelCase verbo     | `createEvento`, `deleteActa`       |
| Schemas Zod         | PascalCase + Schema | `LoginSchema`, `EventoSchema`      |
| Rutas (carpetas)    | kebab-case          | `recovery/`, `documentos/buscar/`  |
| Variables/funciones | camelCase           | `gradoId`, `handleSubmit`          |

---

## Comandos de Desarrollo

```bash
pnpm dev       # Servidor de desarrollo (Turbopack)
pnpm build     # Build de producción
pnpm start     # Servidor de producción
pnpm lint      # Verificar con Biome
pnpm format    # Formatear con Biome
pnpm check     # Aplicar fixes de Biome automáticamente
pnpm clean     # Eliminar directorio .next
```

```bash
# Migraciones Prisma
pnpm prisma migrate dev --name nombre         # Migración interactiva estándar
pnpm prisma migrate dev --create-only --name nombre  # Solo crea el archivo SQL (para SQL raw)
pnpm prisma migrate resolve --applied nombre  # Marcar como aplicada (entornos no-interactivos)
pnpm prisma generate                          # Regenerar cliente tras cambios de schema
pnpm prisma migrate status                    # Ver estado de migraciones
```

---

## Deuda Técnica Conocida

- **Complejidad ciclomática**: Biome reporta > 15 en `UserProfile.tsx`, `Sidebar.tsx`, `cloudinary-upload.ts`, `FeedCard.tsx` y otros. Son advertencias, no errores. Refactorizar cuando se toque cada archivo.
- **Paginación del Feed**: `FeedList.tsx` pagina en memoria todos los posts. Para > 200 posts, migrar a cursor-based en `getFeedPosts`.
- **FeedMention UI**: el parser de @menciones existe en el servidor, pero el textarea de `FeedForm.tsx` no tiene autocomplete de usuarios todavía.
- **registerDocumentView**: la acción existe pero aún no está integrada en los handlers de vista/descarga de documentos individuales.
