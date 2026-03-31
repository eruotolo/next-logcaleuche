-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "useremail" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT,
    "image" TEXT,
    "name" TEXT,
    "lastname" TEXT,
    "date_birthday" DATE,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "category" INTEGER,
    "grado" INTEGER,
    "oficialidad" INTEGER,
    "date_initiation" DATE,
    "date_salary" DATE,
    "date_exalted" DATE,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grado" (
    "id" INTEGER NOT NULL,
    "grado_nombre" TEXT NOT NULL,

    CONSTRAINT "grado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_category" (
    "id_Cat" INTEGER NOT NULL,
    "cat_Nombre" TEXT NOT NULL,

    CONSTRAINT "user_category_pkey" PRIMARY KEY ("id_Cat")
);

-- CreateTable
CREATE TABLE "oficiales" (
    "id_Oficial" INTEGER NOT NULL,
    "nombre_Oficial" TEXT NOT NULL,

    CONSTRAINT "oficiales_pkey" PRIMARY KEY ("id_Oficial")
);

-- CreateTable
CREATE TABLE "feed" (
    "id_Feed" SERIAL NOT NULL,
    "titulo_Feed" TEXT,
    "category_Feed" INTEGER,
    "file_name" TEXT,
    "cont_Feed" VARCHAR(3000),
    "user_Feed" INTEGER,
    "estado_Feed" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_pkey" PRIMARY KEY ("id_Feed")
);

-- CreateTable
CREATE TABLE "categoryfeed" (
    "id_Category" INTEGER NOT NULL,
    "nombre_Category" TEXT NOT NULL,

    CONSTRAINT "categoryfeed_pkey" PRIMARY KEY ("id_Category")
);

-- CreateTable
CREATE TABLE "commentsfeed" (
    "id_Comment" SERIAL NOT NULL,
    "user_Comment" INTEGER,
    "feed_Comment" INTEGER,
    "message_Comment" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentsfeed_pkey" PRIMARY KEY ("id_Comment")
);

-- CreateTable
CREATE TABLE "evento" (
    "id_Evento" SERIAL NOT NULL,
    "nombre_Evento" TEXT NOT NULL,
    "trabajo_Evento" TEXT NOT NULL,
    "fecha_Evento" DATE,
    "inicio_Evento" TIME,
    "fin_Evento" TIME,
    "cat_Evento" INTEGER,
    "estado_Evento" INTEGER,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id_Evento")
);

-- CreateTable
CREATE TABLE "categoryevent" (
    "id_Category" INTEGER NOT NULL,
    "nombre_Category" TEXT NOT NULL,

    CONSTRAINT "categoryevent_pkey" PRIMARY KEY ("id_Category")
);

-- CreateTable
CREATE TABLE "acta" (
    "id_Acta" SERIAL NOT NULL,
    "name_Acta" TEXT,
    "file_name" TEXT,
    "grado_Acta" INTEGER,
    "fecha_Acta" DATE,

    CONSTRAINT "acta_pkey" PRIMARY KEY ("id_Acta")
);

-- CreateTable
CREATE TABLE "biblioteca" (
    "id_Libro" SERIAL NOT NULL,
    "nombre_Libro" TEXT,
    "autor_Libro" TEXT,
    "file_name" TEXT,
    "grado_Libro" INTEGER,

    CONSTRAINT "biblioteca_pkey" PRIMARY KEY ("id_Libro")
);

-- CreateTable
CREATE TABLE "boletin" (
    "id_Boletin" SERIAL NOT NULL,
    "titulo_Boletin" TEXT,
    "file_name" TEXT,
    "grado_Boletin" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boletin_pkey" PRIMARY KEY ("id_Boletin")
);

-- CreateTable
CREATE TABLE "trazado" (
    "id_Trazado" SERIAL NOT NULL,
    "name_Trazado" TEXT,
    "file_name" TEXT NOT NULL,
    "autor_Trazado" INTEGER,
    "grado_Trazado" INTEGER,
    "fecha_Trazado" DATE,

    CONSTRAINT "trazado_pkey" PRIMARY KEY ("id_Trazado")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id_Noticia" SERIAL NOT NULL,
    "titulo_Noticia" TEXT NOT NULL,
    "img_Noticia" TEXT,
    "ext_Noticia" TEXT NOT NULL,
    "des_Noticia" TEXT NOT NULL,
    "gallery" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_User" INTEGER,
    "id_Categoria" INTEGER,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id_Noticia")
);

-- CreateTable
CREATE TABLE "noticias_category" (
    "id_Categoria" INTEGER NOT NULL,
    "name_Categoria" TEXT NOT NULL,

    CONSTRAINT "noticias_category_pkey" PRIMARY KEY ("id_Categoria")
);

-- CreateTable
CREATE TABLE "documents" (
    "id_Doc" SERIAL NOT NULL,
    "name_Doc" TEXT,
    "file_name" TEXT,
    "date_Doc" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id_Doc")
);

-- CreateTable
CREATE TABLE "entradadinero" (
    "id_Entrada" SERIAL NOT NULL,
    "id_User" INTEGER,
    "entrada_Mes" VARCHAR(16),
    "entrada_Ano" VARCHAR(16),
    "entrada_Motivo" INTEGER,
    "entrada_Monto" DECIMAL(10,2),
    "entrada_MovimientoFecha" DATE NOT NULL,

    CONSTRAINT "entradadinero_pkey" PRIMARY KEY ("id_Entrada")
);

-- CreateTable
CREATE TABLE "entradamotivo" (
    "id_Motivo" INTEGER NOT NULL,
    "name_Motivo" TEXT NOT NULL,

    CONSTRAINT "entradamotivo_pkey" PRIMARY KEY ("id_Motivo")
);

-- CreateTable
CREATE TABLE "salidadinero" (
    "id_Salida" SERIAL NOT NULL,
    "id_User" INTEGER,
    "salida_Mes" TEXT,
    "salida_Ano" VARCHAR(16) NOT NULL,
    "salida_Motivo" INTEGER,
    "salida_Monto" DECIMAL(10,2),
    "salida_MovimientoFecha" DATE NOT NULL,

    CONSTRAINT "salidadinero_pkey" PRIMARY KEY ("id_Salida")
);

-- CreateTable
CREATE TABLE "salidamotivo" (
    "id_SalidaMotivo" INTEGER NOT NULL,
    "name_SalidaMotivo" TEXT NOT NULL,

    CONSTRAINT "salidamotivo_pkey" PRIMARY KEY ("id_SalidaMotivo")
);

-- CreateTable
CREATE TABLE "message" (
    "id_Message" SERIAL NOT NULL,
    "from_Message" INTEGER,
    "to_Message" INTEGER,
    "subject_Message" TEXT,
    "content_Message" VARCHAR(400),
    "date_Message" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_Message" INTEGER,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id_Message")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_useremail_key" ON "users"("useremail");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_category_fkey" FOREIGN KEY ("category") REFERENCES "user_category"("id_Cat") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_grado_fkey" FOREIGN KEY ("grado") REFERENCES "grado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_oficialidad_fkey" FOREIGN KEY ("oficialidad") REFERENCES "oficiales"("id_Oficial") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed" ADD CONSTRAINT "feed_category_Feed_fkey" FOREIGN KEY ("category_Feed") REFERENCES "categoryfeed"("id_Category") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed" ADD CONSTRAINT "feed_user_Feed_fkey" FOREIGN KEY ("user_Feed") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsfeed" ADD CONSTRAINT "commentsfeed_user_Comment_fkey" FOREIGN KEY ("user_Comment") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentsfeed" ADD CONSTRAINT "commentsfeed_feed_Comment_fkey" FOREIGN KEY ("feed_Comment") REFERENCES "feed"("id_Feed") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_cat_Evento_fkey" FOREIGN KEY ("cat_Evento") REFERENCES "categoryevent"("id_Category") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acta" ADD CONSTRAINT "acta_grado_Acta_fkey" FOREIGN KEY ("grado_Acta") REFERENCES "grado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_grado_Libro_fkey" FOREIGN KEY ("grado_Libro") REFERENCES "grado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletin" ADD CONSTRAINT "boletin_grado_Boletin_fkey" FOREIGN KEY ("grado_Boletin") REFERENCES "grado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazado" ADD CONSTRAINT "trazado_autor_Trazado_fkey" FOREIGN KEY ("autor_Trazado") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazado" ADD CONSTRAINT "trazado_grado_Trazado_fkey" FOREIGN KEY ("grado_Trazado") REFERENCES "grado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_id_User_fkey" FOREIGN KEY ("id_User") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_id_Categoria_fkey" FOREIGN KEY ("id_Categoria") REFERENCES "noticias_category"("id_Categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradadinero" ADD CONSTRAINT "entradadinero_id_User_fkey" FOREIGN KEY ("id_User") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entradadinero" ADD CONSTRAINT "entradadinero_entrada_Motivo_fkey" FOREIGN KEY ("entrada_Motivo") REFERENCES "entradamotivo"("id_Motivo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salidadinero" ADD CONSTRAINT "salidadinero_id_User_fkey" FOREIGN KEY ("id_User") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salidadinero" ADD CONSTRAINT "salidadinero_salida_Motivo_fkey" FOREIGN KEY ("salida_Motivo") REFERENCES "salidamotivo"("id_SalidaMotivo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_from_Message_fkey" FOREIGN KEY ("from_Message") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_to_Message_fkey" FOREIGN KEY ("to_Message") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
