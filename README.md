# Intranet Logia Caleuche 250

Plataforma interna para la gestión administrativa de la Logia Caleuche 250. Incluye módulos de tesorería, feed de actividad, eventos con calendario, documentos por grado masónico, notificaciones en tiempo real, gestión de usuarios y autenticación con 2FA.

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.2.0 | Framework (App Router + Server Actions + Turbopack) |
| React | 19.2.4 | UI |
| TailwindCSS | 4 | Estilos (CSS variables en `globals.css`) |
| Prisma | 7.5.0 | ORM (PostgreSQL adapter) |
| PostgreSQL | 16 | Base de datos (Neon hosted) |
| NextAuth | v5 beta.30 | Autenticación (JWT + Credentials + 2FA TOTP) |
| Zod | 4.x | Validación de esquemas |
| React Hook Form | 7.x | Formularios |
| TanStack Table | v8 | Tablas de datos |
| Biome | 2.x | Linter + Formatter (reemplaza ESLint/Prettier) |
| Cloudinary | 2.x | Almacenamiento de archivos e imágenes |
| Nodemailer + Brevo | 8.x | Email transaccional (SMTP) |
| react-markdown + remark-gfm | 10.x / 4.x | Renderizado Markdown en Feed |
| Lucide React | 0.577 | Iconos |
| Sonner | 2.x | Toast notifications |
| date-fns | 4.x | Manipulación de fechas |

## Requisitos

- Node.js 20+
- pnpm
- PostgreSQL 16

## Instalación

```bash
pnpm install
```

Copia el archivo de variables de entorno y completa los valores:

```bash
cp .env.example .env
```

### Variables de entorno

```bash
# Base de datos
DATABASE_URL="postgresql://USER:PASS@HOST:5432/logiacaleuche?sslmode=verify-full"

# NextAuth v5
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="https://tu-dominio.cl"
AUTH_TRUST_HOST=true

# Cron Jobs (Vercel — cabecera Authorization: Bearer $CRON_SECRET)
CRON_SECRET="<openssl rand -base64 32>"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Brevo SMTP (email transaccional)
BREVO_HOST="smtp-relay.brevo.com"
BREVO_PORT="587"
BREVO_USER="tu-email@dominio.cl"
BREVO_PASSWORD="tu-api-key-brevo"
BREVO_FROM="tesoreria@logiacaleuche.cl"
BREVO_FROM_NAME="R∴L∴ Caleuche 250"
BREVO_NOREPLY="noreply@logiacaleuche.cl"

# Firma tesorero (emails de tesorería)
EMAIL_TESORERO_NOMBRE="Nombre del Tesorero"
EMAIL_TESORERO_TEL="+56 9 XXXX XXXX"
EMAIL_TESORERO_EMAIL="tesorero@logiacaleuche.cl"

# RUT del tesorero (excluido del cálculo de cuotas pendientes)
RUT_EXCLUIDO="xxxxxxxxx"
```

### Base de datos

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

## Desarrollo

```bash
pnpm dev       # Servidor de desarrollo (Turbopack)
pnpm build     # Build de producción
pnpm start     # Servidor de producción
pnpm lint      # Verificar con Biome
pnpm check     # Aplicar fixes de Biome automáticamente
pnpm clean     # Eliminar directorio .next
```

## Módulos

| Módulo | Ruta | Acceso |
|---|---|---|
| Dashboard | `/dashboard` | Todos |
| Feed | `/feed` | Todos (crear: cualquier usuario autenticado) |
| Eventos | `/eventos` | Filtrado por grado |
| Documentos — Aprendiz | `/aprendiz/biblioteca`, `/aprendiz/trazados` | Grado 1+ |
| Documentos — Compañero | `/companero/biblioteca`, `/companero/trazados` | Grado 2+ |
| Documentos — Maestro | `/maestro/biblioteca`, `/maestro/trazados` | Grado 3 |
| Documentos generales | `/documentos` | Todos |
| Buscar documentos | `/documentos/buscar` | Todos (Full-Text Search) |
| Documentos favoritos | `/documentos/favoritos` | Todos |
| Tesorería | `/tesoreria/ingresos`, `/egresos`, `/informe` | Tesorero+ |
| Usuarios | `/usuarios` | Admin+ |
| Notificaciones | `/perfil/notificaciones` | Todos (preferencias por tipo) |
| Seguridad | `/perfil/seguridad` | Todos (2FA TOTP) |
| Configuración | `/configuracion` | SuperAdmin |
| Logs de actividad | `/configuracion/logs` | SuperAdmin |

## Control de acceso

| Nivel | `categoryId` | Permisos |
|---|---|---|
| SuperAdmin | 1 | Todo, incluyendo logs y configuración |
| Admin | 2 | CRUD completo de contenido y usuarios |
| Usuario | 3 | Lectura + crear posts en feed |
| Tesorero | `oficialidadId` = 7 | Acceso a módulo tesorería |

**Filtrado por grado masónico:**
- **Aprendiz** (grado 1): ve documentos y eventos de grado 1
- **Compañero** (grado 2): ve documentos y eventos de grado 1 y 2
- **Maestro** (grado 3): ve todo el contenido

## Arquitectura

El proyecto sigue un patrón DDD por features. Cada feature encapsula sus Server Actions, componentes y schemas Zod.

```
src/
├── app/
│   ├── (admin)/            # Rutas protegidas (App Router)
│   │   ├── dashboard/
│   │   ├── feed/
│   │   ├── eventos/
│   │   ├── documentos/
│   │   │   ├── buscar/     # Búsqueda FTS
│   │   │   └── favoritos/
│   │   ├── aprendiz/ companero/ maestro/
│   │   ├── tesoreria/
│   │   ├── usuarios/
│   │   ├── perfil/
│   │   │   ├── notificaciones/
│   │   │   └── seguridad/
│   │   └── configuracion/
│   ├── (public)/           # Login, recuperación de contraseña
│   └── api/
│       ├── auth/
│       ├── cron/           # cumpleanos, aniversarios, eventos
│       ├── notifications/count
│       └── raw/            # proxy de archivos Cloudinary
├── features/               # Lógica de dominio por módulo
│   ├── auth/
│   ├── feed/
│   ├── eventos/
│   ├── documentos/
│   ├── notificaciones/
│   ├── tesoreria/
│   ├── usuarios/
│   └── dashboard/
├── shared/
│   ├── components/
│   │   ├── ui/             # Primitivos: button, card, badge, tooltip...
│   │   └── layout/         # AdminShell, Sidebar, Topbar
│   ├── lib/                # auth, db, utils, cloudinary, email, activity-log
│   ├── constants/          # domain.ts — grados, categorías, oficialidades
│   └── types/              # ActionResult<T>, next-auth.d.ts
└── generated/prisma/       # Cliente Prisma generado (no editar)
```

## Automatizaciones (Cron Jobs)

Registradas en `vercel.json`. Requieren cabecera `Authorization: Bearer $CRON_SECRET`.

| Endpoint | Schedule | Acción |
|---|---|---|
| `/api/cron/cumpleanos` | 12:00 UTC diario | Email + notificación in-app por cumpleaños |
| `/api/cron/aniversarios` | 12:00 UTC diario | Email + notificación in-app por aniversario de iniciación |
| `/api/cron/eventos` | Lunes 12:00 UTC | Email de resumen semanal de eventos |

## Notificaciones

- **In-app**: badge en tiempo real en el Topbar (polling cada 30 s vía `/api/notifications/count`)
- **Email**: configurable por usuario en `/perfil/notificaciones`
- **Tipos**: `feed`, `comment`, `evento`, `biblioteca`, `trazado`, `cumpleanos`, `aniversario`, `mention`
- Las preferencias se almacenan en `notification_preferences` (tabla por usuario × tipo × canal)

## Base de datos — modelos principales

| Tabla | Descripción |
|---|---|
| `users` | Usuarios con grado, categoría, oficialidad, 2FA |
| `feed` | Posts del feed con soporte Markdown |
| `feed_reactions` | Reacciones emoji a posts (❤️) |
| `feed_mentions` | Menciones @usuario en posts |
| `evento` | Eventos filtrados por grado |
| `evento_asistencia` | Confirmación de asistencia a eventos |
| `biblioteca` | Libros/PDFs por grado (con FTS) |
| `trazado` | Trazados masónicos por grado (con FTS) |
| `documents` | Documentos generales (con FTS) |
| `document_favorites` | Favoritos de documentos por usuario |
| `document_views` | Vistas recientes de documentos por usuario |
| `notification_preferences` | Preferencias de notificación por usuario × tipo |
| `notifications` | Notificaciones in-app |
| `activity_log` | Log de auditoría de acciones admin |
| `entradadinero` / `salidadinero` | Movimientos de tesorería |

## Búsqueda de documentos

Implementada con **PostgreSQL Full-Text Search** (`tsvector` generado + índices GIN) en las tablas `biblioteca`, `trazado` y `documents`. No requiere infraestructura adicional.

```sql
-- Ejemplo: columna generada en biblioteca
search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('spanish', coalesce("nombre_Libro",'') || ' ' || coalesce("autor_Libro",''))
) STORED
```
