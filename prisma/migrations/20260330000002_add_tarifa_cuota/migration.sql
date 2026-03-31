-- Tabla de tarifas de cuota mensual
CREATE TABLE "tarifa_cuota" (
    "id"     SERIAL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "monto"  INTEGER NOT NULL
);

-- Tarifas por defecto (de menor a mayor)
INSERT INTO "tarifa_cuota" ("nombre", "monto") VALUES
    ('Tarifa Reducida', 15000),
    ('Tarifa Media', 30000),
    ('Tarifa Estándar', 45000);

-- FK en users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cuota_id" INTEGER REFERENCES "tarifa_cuota"("id");
