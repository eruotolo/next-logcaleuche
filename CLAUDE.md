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
    - **Prohibido** usar `prisma db push` — no deja registro, no permite rollback
    - Si hay drift detectado, resolverlo con `prisma migrate resolve` o `prisma migrate reset` (con aprobación explícita del usuario), nunca con `db push`

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
- **Contract-First**: Si Frontend necesita un dato del Backend inexistente, generar primero la Interface TypeScript.---

## Stack

| Tecnología      | Versión    | Uso                                            |
| --------------- | ---------- | ---------------------------------------------- |
| Next.js         | 16.2.0     | Framework (App Router)                         |
| React           | 19.2.4     | UI                                             |
| TailwindCSS     | 4          | Estilos (con CSS variables en `globals.css`)   |
| Prisma          | 7.5.0      | ORM (PostgreSQL adapter)                       |
| PostgreSQL      | 16         | Base de datos                                  |
| NextAuth        | v5 beta.30 | Autenticación (JWT, Credentials)               |
| Zod             | 4.x        | Validación de esquemas                         |
| React Hook Form | 7.x        | Manejo de formularios                          |
| TanStack Table  | v8         | Tablas de datos                                |
| Biome           | 2.x        | Linter + Formatter (reemplaza ESLint/Prettier) |
| Lucide React    | 0.577      | Iconos                                         |
| Sonner          | 2.x        | Toast notifications                            |
| date-fns        | 4.x        | Manipulación de fechas                         |
| bcryptjs        | 3.x        | Hash de contraseñas                            |
| **Idioma UI**   | —          | Español (`lang="es"`)                          |

---

## Estructura de Directorios

```
src/
├── app/
│   ├── (public)/                        # Rutas sin auth
│   │   ├── layout.tsx                   # Layout centrado (sin sidebar)
│   │   ├── login/page.tsx
│   │   └── recovery/page.tsx
│   ├── (admin)/                         # Rutas protegidas (requieren auth)
│   │   ├── layout.tsx                   # auth() → redirect si no hay sesión
│   │   ├── dashboard/page.tsx
│   │   ├── feed/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── noticias/
│   │   │   ├── page.tsx
│   │   │   ├── nueva/page.tsx
│   │   │   ├── editar/[id]/page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── usuarios/
│   │   │   ├── page.tsx
│   │   │   ├── nuevo/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── eventos/
│   │   │   ├── page.tsx
│   │   │   └── nuevo/page.tsx
│   │   ├── tesoreria/
│   │   │   ├── ingresos/page.tsx
│   │   │   ├── ingresos/nuevo/page.tsx
│   │   │   ├── egresos/page.tsx
│   │   │   ├── egresos/nuevo/page.tsx
│   │   │   └── informe/page.tsx
│   │   ├── documentos/page.tsx
│   │   ├── mensajes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── aprendiz/                    # Documentos grado 1
│   │   │   ├── actas/, biblioteca/, boletin/, trazados/
│   │   ├── companero/                   # Documentos grado 2
│   │   │   ├── actas/, biblioteca/, boletin/, trazados/
│   │   └── maestro/                     # Documentos grado 3
│   │       ├── actas/, biblioteca/, boletin/, trazados/
│   ├── api/auth/[...nextauth]/route.ts
│   ├── globals.css
│   └── layout.tsx                       # Root layout (html/body/providers)
│
├── features/                            # Módulos DDD
│   ├── auth/
│   ├── feed/
│   ├── noticias/
│   ├── eventos/
│   ├── documentos/
│   ├── mensajes/
│   ├── tesoreria/
│   ├── usuarios/
│   └── dashboard/
│
├── shared/
│   ├── components/
│   │   ├── ui/                          # Primitivos: button, card, input, table, badge, avatar
│   │   └── layout/                      # AdminShell, Sidebar, Topbar, AuthBackground
│   ├── hooks/                           # Custom hooks globales
│   ├── lib/
│   │   ├── auth.ts                      # NextAuth config (CANÓNICO — usar siempre este)
│   │   ├── db.ts                        # Prisma client singleton (CANÓNICO)
│   │   ├── utils.ts                     # cn(), truncate(), formatCLP(), formatDate(), getMesNombre()
│   │   └── slugs.ts                     # slugify(), generateUniqueSlug()
│   └── types/
│       ├── actions.ts                   # ActionResult<T>
│       └── next-auth.d.ts               # Type augmentation de sesión
│
├── generated/
│   └── prisma/                          # Cliente Prisma generado — NO EDITAR
│
└── lib/                                 # Re-exports legacy — no usar en código nuevo
    ├── auth.ts                          → re-export de @/shared/lib/auth
    └── db.ts                            → re-export de @/shared/lib/db
```

---

## Modelos de Base de Datos (Prisma)

### Usuarios y Permisos

| Modelo         | Campos clave                                                                                                                                                                       | Notas                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `User`         | id, email, username (RUT), password, name, lastName, slug, dateBirthday, phone, address, city, categoryId, gradoId, oficialidadId, dateInitiation, dateSalary, dateExalted, active | Imagen en `public/uploads/profile/` |
| `Grado`        | id, nombre                                                                                                                                                                         | 1=Aprendiz, 2=Compañero, 3=Maestro  |
| `UserCategory` | id, nombre                                                                                                                                                                         | 1=SuperAdmin, 2=Admin, 3=Usuario    |
| `Oficial`      | id, nombre                                                                                                                                                                         | 15 oficialidades, id=7 es Tesorero  |

### Contenido

| Modelo            | Campos clave                                                                              | Notas                            |
| ----------------- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| `Feed`            | id, titulo, slug, categoryId, fileName, contenido, userId, active, createdAt              | Archivos adjuntos opcionales     |
| `CategoryFeed`    | id, nombre                                                                                | Categorías de posts              |
| `CommentFeed`     | id, userId, feedId, message, createdAt                                                    |                                  |
| `Noticia`         | id, titulo, slug, imagen, extracto, descripcion, gallery, createdAt, authorId, categoryId | Gallery = JSON array de imágenes |
| `NoticiaCategory` | id, nombre                                                                                |                                  |
| `Evento`          | id, nombre, trabajo, fecha, inicio, fin, categoryId, active                               | categoryId mapea a grado visible |
| `CategoryEvent`   | id, nombre                                                                                |                                  |

### Documentos (filtrados por `gradoId`)

| Modelo       | Campos clave                                                    |
| ------------ | --------------------------------------------------------------- |
| `Acta`       | id, nombre, fileName, gradoId, fecha                            |
| `Biblioteca` | id, nombre, autor, fileName, gradoId                            |
| `Boletin`    | id, titulo, fileName, gradoId, createdAt                        |
| `Trazado`    | id, nombre, fileName, autorId, gradoId, fecha                   |
| `Document`   | id, nombre, fileName, fechaDoc, createdAt (sin filtro de grado) |

### Tesorería

| Modelo          | Campos clave                                    |
| --------------- | ----------------------------------------------- |
| `EntradaDinero` | id, userId, mes, ano, motivoId, monto, fechaMov |
| `EntradaMotivo` | id, nombre                                      |
| `SalidaDinero`  | id, userId, mes, ano, motivoId, monto, fechaMov |
| `SalidaMotivo`  | id, nombre                                      |

### Mensajería

| Modelo    | Campos clave                                          | Notas                                                |
| --------- | ----------------------------------------------------- | ---------------------------------------------------- |
| `Message` | id, fromId, toId, subject, content, createdAt, status | status: 0=no leído, 1=leído, 2=eliminado, 3=borrador |

---

## Autenticación y Sesión

**Archivo canónico:** `src/shared/lib/auth.ts`

**Estructura de sesión JWT:**

```typescript
session.user = {
  id: string
  email: string
  name: string                    // firstName + " " + lastName
  image: string | null            // URL del avatar
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

---

## Control de Acceso

```typescript
// Obtener sesión en Server Actions o layouts
const session = await auth();

// Niveles de acceso
const isAdmin = session.user.categoryId <= 2; // SuperAdmin o Admin
const isTesorero = session.user.oficialidad === 7 || isAdmin;

// Acceso por grado (documentos y eventos)
// Aprendiz (1): solo contenido gradoId=1
// Compañero (2): contenido gradoId <= 2
// Maestro (3): todo el contenido
const grado = session.user.grado;
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

| Feature      | Acciones principales                                                                           | Restricción                     |
| ------------ | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| `auth`       | loginAction, recoveryAction                                                                    | —                               |
| `dashboard`  | getDashboardData, sendBirthdayMessage                                                          | auth                            |
| `feed`       | getFeedPosts, getFeedPostBySlug, createFeedPost, addComment                                    | auth / crear: cualquier usuario |
| `noticias`   | getNoticias, getNoticiaBySlug, createNoticia, updateNoticia, deleteNoticia                     | crear/editar/borrar: admin+     |
| `usuarios`   | getUsuarios, getUsuarioById, createUser, updateUserProfile, changePassword, uploadProfileImage | crear: admin+                   |
| `eventos`    | getEventos (filtrado por grado), createEvento                                                  | crear: admin+                   |
| `documentos` | CRUD para Acta, Libro, Boletin, Trazado, Document (por grado)                                  | crear: admin+                   |
| `tesoreria`  | getResumenTesoreria, getEntradas/Salidas, createEntrada/Salida                                 | tesorero+                       |
| `mensajes`   | getInbox, getSent, getMessageById (auto-mark read), sendMessage, deleteMessage                 | auth                            |

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

## Generación de Slugs

Utilidad en `@/shared/lib/slugs.ts`:

- `slugify(text)` — convierte texto a slug kebab-case
- `generateUniqueSlug(text, checkFn)` — genera slug único consultando la BD, evita errores `P2002`

Usado en: `Feed`, `Noticia`, `User` (basado en nombre completo).

---

## Subida de Archivos

- Destino: `public/uploads/{tipo}/` (actas, biblioteca, boletin, trazados, profile, noticias, feed)
- Prefijo aleatorio para evitar colisiones: `${Date.now()}-${Math.random()}`
- Sin validación de MIME type actualmente — solo extensión

---

## Componentes Compartidos (`shared/`)

### UI Primitivos

| Componente   | Descripción                                                  |
| ------------ | ------------------------------------------------------------ |
| `button.tsx` | Botón con variantes (primary, secondary, ghost, destructive) |
| `card.tsx`   | Contenedor con header/content/footer                         |
| `input.tsx`  | Input con label y estado de error                            |
| `table.tsx`  | Wrapper de TanStack Table                                    |
| `badge.tsx`  | Etiqueta/indicador de estado                                 |
| `avatar.tsx` | Imagen de perfil con fallback                                |

### Layout

| Componente           | Descripción                                                |
| -------------------- | ---------------------------------------------------------- |
| `AdminShell.tsx`     | Wrapper principal: sidebar + topbar + `{children}`         |
| `Sidebar.tsx`        | Navegación vertical con ítems filtrados por grado          |
| `Topbar.tsx`         | Header con perfil de usuario y badge de mensajes no leídos |
| `AuthBackground.tsx` | Fondo para pantallas de auth                               |

### Utilidades (`shared/lib/utils.ts`)

```typescript
cn(...classes); // Tailwind merge + clsx
truncate(str, length); // Truncar texto con "..."
formatCLP(amount); // Formato moneda chilena: $1.234.567
formatDate(date); // dd/MM/yyyy
getMesNombre(mes); // 1 → "Enero", ..., 12 → "Diciembre"
```

---

## Variables de Entorno Requeridas

```bash
DATABASE_URL=postgresql://USER:PASS@HOST:5432/logiacaleuche
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://tu-dominio.cl
AUTH_TRUST_HOST=true
```

---

## Colores del Sistema

```css
/* globals.css — @theme */
--color-primary: #2980b9; /* Azul principal */
--color-entrada: #41a65a; /* Verde ingresos tesorería */
--color-salida: #56c0ef; /* Azul egresos tesorería */
--color-total: #f29c13; /* Naranja saldo */
--color-hospital: #41729d; /* Azul oscuro caja hospitalaria */
```

Clases custom relevantes: `.admin-sidebar`, `.sidebar-nav-link`, `.sidebar-nav-link--active`, `.admin-topbar`, `.card-dashboard`, `.img-news`.

---

## Convenciones de Nombres

| Tipo                | Convención          | Ejemplo                            |
| ------------------- | ------------------- | ---------------------------------- |
| Componentes         | PascalCase          | `LoginForm.tsx`, `UserProfile.tsx` |
| Server Actions      | camelCase verbo     | `createEvento`, `deleteActa`       |
| Schemas Zod         | PascalCase + Schema | `LoginSchema`, `EventoSchema`      |
| Rutas (carpetas)    | kebab-case          | `recovery/`, `actas-view/`         |
| Variables/funciones | camelCase           | `gradoId`, `handleSubmit`          |

---

## Comandos de Desarrollo

```bash
pnpm dev       # Servidor de desarrollo
pnpm build     # Build de producción
pnpm start     # Servidor de producción
pnpm lint      # Verificar con Biome
pnpm format    # Formatear con Biome
pnpm check     # Aplicar fixes de Biome automáticamente
pnpm clean     # Eliminar directorio .next
```

---

## TODOs y Deuda Técnica

- **Recuperación de contraseña** (`features/auth/actions/index.ts`): La acción existe pero el envío real de email vía Brevo SMTP está comentado (pendiente de implementar).
- **Validación MIME en uploads**: Solo se valida la extensión, no el tipo real del archivo.
- **Status de mensajes**: Se usan enteros crudos (0/1/2/3) en lugar de enums Prisma.
- **Mensajería**: No hay sistema de respuesta/hilo (solo mensajes individuales).
