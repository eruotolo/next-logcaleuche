# Scripts de Migración

## migrate-mysql-dump.js

Migra todos los datos desde el backup MySQL (`bk-database/db-backup.sql`)
directamente a PostgreSQL de producción. No requiere un servidor MySQL corriendo.

### Pre-requisitos

```bash
# 1. Instalar el cliente PostgreSQL para Node.js
npm install pg --legacy-peer-deps

# 2. Las tablas deben existir en PostgreSQL (ejecutar migraciones Prisma primero)
npx prisma migrate dev --name init
# o para producción:
npx prisma migrate deploy
```

### Ejecutar

```bash
cd next-logiacaleuche
node scripts/migrate-mysql-dump.js
```

### PostgreSQL de producción

- Host: localhost
- Usuario: eruotolo
- Base de datos: dbcaleuche
- Puerto: 5432

### Qué hace el script

1. Lee `../../bk-database/db-backup.sql`
2. Parsea los INSERT MySQL tabla por tabla
3. Inserta en PostgreSQL respetando el orden de claves foráneas
4. Resetea las secuencias de autoincrement
5. Omite la tabla `files` (legacy sin uso)

### Tablas migradas (en orden FK-safe)

grado → user_category → oficiales → categoryevent → categoryfeed →
noticias_category → entradamotivo → salidamotivo → users → feed →
commentsfeed → evento → acta → biblioteca → boletin → trazado →
noticias → documents → message → entradadinero → salidadinero
