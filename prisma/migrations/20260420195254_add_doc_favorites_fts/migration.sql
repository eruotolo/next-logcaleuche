-- CreateTable
CREATE TABLE "document_favorites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_views" (
    "user_id" INTEGER NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_id" INTEGER NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_views_pkey" PRIMARY KEY ("user_id","document_type","document_id")
);

-- CreateIndex
CREATE INDEX "document_favorites_user_id_idx" ON "document_favorites"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_favorites_user_id_document_type_document_id_key" ON "document_favorites"("user_id", "document_type", "document_id");

-- CreateIndex
CREATE INDEX "document_views_user_id_viewed_at_idx" ON "document_views"("user_id", "viewed_at");

-- AddForeignKey
ALTER TABLE "document_favorites" ADD CONSTRAINT "document_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_views" ADD CONSTRAINT "document_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Full-Text Search: biblioteca
ALTER TABLE "biblioteca" ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("nombre_Libro", '') || ' ' || coalesce("autor_Libro", ''))) STORED;
CREATE INDEX IF NOT EXISTS biblioteca_search_idx ON "biblioteca" USING GIN(search_vector);

-- Full-Text Search: trazado
ALTER TABLE "trazado" ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("name_Trazado", ''))) STORED;
CREATE INDEX IF NOT EXISTS trazado_search_idx ON "trazado" USING GIN(search_vector);

-- Full-Text Search: documents
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('spanish', coalesce("name_Doc", ''))) STORED;
CREATE INDEX IF NOT EXISTS documents_search_idx ON "documents" USING GIN(search_vector);
