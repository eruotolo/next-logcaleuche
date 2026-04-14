-- ============================================================
-- Resolución de drift: tablas eliminadas de la DB sin migración
-- (IF EXISTS → no-op si ya no existen, sincroniza historial)
-- CASCADE resuelve dependencias en shadow DB de prisma migrate dev
-- ============================================================
DROP TABLE IF EXISTS "noticias" CASCADE;
DROP TABLE IF EXISTS "noticias_category" CASCADE;
DROP TABLE IF EXISTS "message" CASCADE;
DROP TABLE IF EXISTS "boletin" CASCADE;
DROP TABLE IF EXISTS "acta" CASCADE;

-- ============================================================
-- CreateTable: tipo_actividad (tabla de referencia)
-- ============================================================
CREATE TABLE "tipo_actividad" (
    "id_TipoActividad" INTEGER NOT NULL,
    "nombre_TipoActividad" TEXT NOT NULL,
    CONSTRAINT "tipo_actividad_pkey" PRIMARY KEY ("id_TipoActividad")
);

-- Seed de referencia
INSERT INTO "tipo_actividad" ("id_TipoActividad", "nombre_TipoActividad") VALUES
    (1,  'Tenida'),
    (2,  'Cámara'),
    (3,  'Tenida Administrativa'),
    (4,  'Tenida Iniciación'),
    (5,  'Tenida Aumento de Salario'),
    (6,  'Tenida Jurisdiccional'),
    (7,  'Tenida Aniversario'),
    (8,  'Tenida Conjunta'),
    (9,  'Cámara Conjunta'),
    (10, 'Reunión Blanca'),
    (11, 'Tenida Exaltación'),
    (12, 'Fiesta del Aprendiz'),
    (13, 'Fiesta del Compañero'),
    (14, 'Fiesta del Maestro'),
    (15, 'Trazado'),
    (16, 'Ceremonia'),
    (17, 'Tenida Solsticial');

-- ============================================================
-- AlterTable evento: agregar FK primero (para migrar datos),
-- luego dropear columna de texto
-- ============================================================
ALTER TABLE "evento" ADD COLUMN "tipo_actividad_id" INTEGER;

-- Migración de datos: texto libre → FK normalizada
UPDATE "evento" SET "tipo_actividad_id" = CASE
    WHEN "trabajo_Evento" ILIKE 'Trazado'                                                                   THEN 15
    WHEN "trabajo_Evento" ILIKE 'Tenida Administrativa'                                                     THEN 3
    WHEN "trabajo_Evento" ILIKE 'Tenida de Iniciación'   OR "trabajo_Evento" ILIKE 'Tenida Iniciación'     THEN 4
    WHEN "trabajo_Evento" ILIKE 'Tenida de Aumento%'     OR "trabajo_Evento" ILIKE 'Tenida Aumento%'       THEN 5
    WHEN "trabajo_Evento" ILIKE 'Tenida Jurisdiccional'                                                     THEN 6
    WHEN "trabajo_Evento" ILIKE 'Aniversario'            OR "trabajo_Evento" ILIKE 'Tenida Aniversario'    THEN 7
    WHEN "trabajo_Evento" ILIKE 'Tenida Conjunta'                                                           THEN 8
    WHEN "trabajo_Evento" ILIKE 'Cámara Conjunta'                                                          THEN 9
    WHEN "trabajo_Evento" ILIKE 'Reunión Blanca'                                                           THEN 10
    WHEN "trabajo_Evento" ILIKE 'Tenida de Exaltación'   OR "trabajo_Evento" ILIKE 'Tenida Exaltación'     THEN 11
    WHEN "trabajo_Evento" ILIKE 'Fiesta del Aprendiz'                                                       THEN 12
    WHEN "trabajo_Evento" ILIKE 'Fiesta del Compañero'   OR "trabajo_Evento" ILIKE 'Fiesta del Companero'  THEN 13
    WHEN "trabajo_Evento" ILIKE 'Fiesta del Maestro'                                                        THEN 14
    WHEN "trabajo_Evento" ILIKE 'Ceremonia%'                                                                THEN 16
    WHEN "trabajo_Evento" ILIKE '%Solsticial%'                                                              THEN 17
    WHEN "trabajo_Evento" ILIKE 'Cámara'                                                                   THEN 2
    ELSE 1
END
WHERE "trabajo_Evento" IS NOT NULL;

-- Ahora sí dropear la columna de texto (datos ya migrados)
ALTER TABLE "evento" DROP COLUMN "trabajo_Evento";

-- ============================================================
-- AlterTable trazado: agregar FK (nullable, sin datos previos)
-- ============================================================
ALTER TABLE "trazado" ADD COLUMN "tipo_actividad_id" INTEGER;

-- ============================================================
-- DropForeignKey / AddForeignKey: users → tarifa_cuota
-- (regenerado por Prisma al detectar cambio en el modelo)
-- ============================================================
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_cuota_id_fkey";
ALTER TABLE "users" ADD CONSTRAINT "users_cuota_id_fkey"
    FOREIGN KEY ("cuota_id") REFERENCES "tarifa_cuota"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- AddForeignKey: evento → tipo_actividad
-- ============================================================
ALTER TABLE "evento" ADD CONSTRAINT "evento_tipo_actividad_id_fkey"
    FOREIGN KEY ("tipo_actividad_id") REFERENCES "tipo_actividad"("id_TipoActividad")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- AddForeignKey: trazado → tipo_actividad
-- ============================================================
ALTER TABLE "trazado" ADD CONSTRAINT "trazado_tipo_actividad_id_fkey"
    FOREIGN KEY ("tipo_actividad_id") REFERENCES "tipo_actividad"("id_TipoActividad")
    ON DELETE SET NULL ON UPDATE CASCADE;
