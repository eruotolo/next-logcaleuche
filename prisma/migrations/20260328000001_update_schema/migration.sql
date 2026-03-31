-- ── 1. Columnas slug en users, feed, noticias ────────────────────────────
ALTER TABLE "users" ADD COLUMN "slug" TEXT;
CREATE UNIQUE INDEX "users_slug_key" ON "users"("slug");

ALTER TABLE "feed" ADD COLUMN "slug" TEXT;
CREATE UNIQUE INDEX "feed_slug_key" ON "feed"("slug");

ALTER TABLE "noticias" ADD COLUMN "slug" TEXT;
CREATE UNIQUE INDEX "noticias_slug_key" ON "noticias"("slug");

-- ── 2. Tabla evento: quitar inicio/fin, agregar autor, cambiar FK ─────────
ALTER TABLE "evento" DROP COLUMN "inicio_Evento";
ALTER TABLE "evento" DROP COLUMN "fin_Evento";
ALTER TABLE "evento" ADD COLUMN "autor_Evento" TEXT;

-- Cambiar FK cat_Evento: de categoryevent → grado
ALTER TABLE "evento" DROP CONSTRAINT "evento_cat_Evento_fkey";
ALTER TABLE "evento" ADD CONSTRAINT "evento_cat_Evento_fkey"
    FOREIGN KEY ("cat_Evento") REFERENCES "grado"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
