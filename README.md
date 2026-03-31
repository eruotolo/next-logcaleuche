# Intranet Logia Caleuche 250

Plataforma interna para la gestión administrativa de la Logia Caleuche 250. Incluye módulos de tesorería, feed, noticias, eventos, documentos por grado, mensajería interna y gestión de usuarios.

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.2.0 | Framework (App Router + Server Actions) |
| React | 19.2.4 | UI |
| TailwindCSS | 4 | Estilos |
| Prisma | 7.5.0 | ORM (PostgreSQL adapter) |
| PostgreSQL | 16 | Base de datos |
| NextAuth | v5 beta.30 | Autenticación (JWT + Credentials) |
| Zod | 4.x | Validación |
| React Hook Form | 7.x | Formularios |
| TanStack Table | v8 | Tablas de datos |
| Biome | 2.x | Linter + Formatter |
| Cloudinary | — | Almacenamiento de archivos e imágenes |

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

### Variables de entorno requeridas

```bash
DATABASE_URL="postgresql://USER:PASS@HOST:5432/logiacaleuche?sslmode=verify-full"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="https://tu-dominio.cl"
AUTH_TRUST_HOST=true

# RUT del tesorero excluido del cálculo de cuotas
RUT_EXCLUIDO="xxxxxxxxx"

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
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
| Feed | `/feed` | Todos |
| Noticias | `/noticias` | Todos (crear/editar: Admin+) |
| Eventos | `/eventos` | Filtrado por grado |
| Tesorería | `/tesoreria/ingresos`, `/egresos`, `/informe` | Tesorero+ |
| Documentos | `/aprendiz`, `/companero`, `/maestro` | Filtrado por grado |
| Mensajes | `/mensajes` | Todos |
| Usuarios | `/usuarios` | Admin+ |

## Arquitectura

El proyecto sigue un patrón DDD por features:

```
src/
├── app/(admin)/        # Rutas protegidas (App Router)
├── app/(public)/       # Login y recuperación de contraseña
├── features/           # Lógica de dominio por módulo
│   ├── [feature]/
│   │   ├── actions/    # Server Actions
│   │   ├── components/ # Componentes del dominio
│   │   └── schemas/    # Validación Zod
├── shared/
│   ├── components/ui/  # Primitivos de UI
│   ├── lib/            # auth, db, utils, cloudinary
│   └── constants/      # domain, roles
└── generated/prisma/   # Cliente Prisma (no editar)
```

## Control de acceso

- **SuperAdmin / Admin** (`categoryId` 1–2): acceso completo
- **Tesorero** (`oficialidadId` 7): acceso a módulo de tesorería
- **Grado** (1=Aprendiz, 2=Compañero, 3=Maestro): filtra documentos y eventos visibles
