-- AlterTable
ALTER TABLE "users" ADD COLUMN     "has_seen_onboarding" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "href" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_asistencia" (
    "id" SERIAL NOT NULL,
    "evento_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'confirmado',

    CONSTRAINT "evento_asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_user_id_read_idx" ON "notifications"("user_id", "read");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "evento_asistencia_evento_id_idx" ON "evento_asistencia"("evento_id");

-- CreateIndex
CREATE UNIQUE INDEX "evento_asistencia_evento_id_user_id_key" ON "evento_asistencia"("evento_id", "user_id");

-- CreateIndex
CREATE INDEX "entradadinero_id_User_entrada_Ano_entrada_Motivo_idx" ON "entradadinero"("id_User", "entrada_Ano", "entrada_Motivo");

-- CreateIndex
CREATE INDEX "entradadinero_entrada_Ano_entrada_Mes_idx" ON "entradadinero"("entrada_Ano", "entrada_Mes");

-- CreateIndex
CREATE INDEX "evento_estado_Evento_fecha_Evento_cat_Evento_idx" ON "evento"("estado_Evento", "fecha_Evento", "cat_Evento");

-- CreateIndex
CREATE INDEX "feed_estado_Feed_created_at_idx" ON "feed"("estado_Feed", "created_at");

-- CreateIndex
CREATE INDEX "salidadinero_id_User_salida_Ano_salida_Motivo_idx" ON "salidadinero"("id_User", "salida_Ano", "salida_Motivo");

-- CreateIndex
CREATE INDEX "salidadinero_salida_Ano_salida_Mes_idx" ON "salidadinero"("salida_Ano", "salida_Mes");

-- CreateIndex
CREATE INDEX "users_estado_date_birthday_idx" ON "users"("estado", "date_birthday");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_asistencia" ADD CONSTRAINT "evento_asistencia_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "evento"("id_Evento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_asistencia" ADD CONSTRAINT "evento_asistencia_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
