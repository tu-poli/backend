-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "tipo_doc" VARCHAR(50) NOT NULL,
    "num_doc" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "mail" VARCHAR(255),
    "password" VARCHAR(255),
    "id_rol" INTEGER,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "menor" (
    "id_menor" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "apellido" VARCHAR(255) NOT NULL,
    "tipo_doc" VARCHAR(50) NOT NULL,
    "num_doc" VARCHAR(50) NOT NULL,
    "fecha_nacimiento" DATE NOT NULL,
    "ficha_medica_url" VARCHAR(500),
    "cud_url" VARCHAR(500),

    CONSTRAINT "menor_pkey" PRIMARY KEY ("id_menor")
);

-- CreateTable
CREATE TABLE "espacio_fisico" (
    "id_espacio" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),

    CONSTRAINT "espacio_fisico_pkey" PRIMARY KEY ("id_espacio")
);

-- CreateTable
CREATE TABLE "categoria_actividad" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "categoria_actividad_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "actividad" (
    "id_actividad" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),
    "id_categoria" INTEGER,
    "requiere_autorizacion" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "actividad_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "estado_reserva" (
    "id_estado_reserva" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "estado_reserva_pkey" PRIMARY KEY ("id_estado_reserva")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id_reserva" SERIAL NOT NULL,
    "id_actividad" INTEGER,
    "id_espacio" INTEGER,
    "id_profesor" INTEGER,
    "fecha_hora_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_hora_fin" TIMESTAMP(3) NOT NULL,
    "cupo_maximo" INTEGER,
    "id_estado_reserva" INTEGER,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "estado_inscripcion" (
    "id_estado_inscripcion" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "estado_inscripcion_pkey" PRIMARY KEY ("id_estado_inscripcion")
);

-- CreateTable
CREATE TABLE "inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "id_menor" INTEGER NOT NULL,
    "autorizacion_url" VARCHAR(500),
    "fecha_hora_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_estado_inscripcion" INTEGER,

    CONSTRAINT "inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "categoria_inventario" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,

    CONSTRAINT "categoria_inventario_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "item" (
    "id_item" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "id_categoria" INTEGER,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id_item")
);

-- CreateTable
CREATE TABLE "reserva_item" (
    "id_reserva" INTEGER NOT NULL,
    "id_item" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "reserva_item_pkey" PRIMARY KEY ("id_reserva","id_item")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_tipo_doc_num_doc_key" ON "usuario"("tipo_doc", "num_doc");

-- CreateIndex
CREATE UNIQUE INDEX "menor_tipo_doc_num_doc_key" ON "menor"("tipo_doc", "num_doc");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_id_reserva_id_menor_key" ON "inscripcion"("id_reserva", "id_menor");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menor" ADD CONSTRAINT "menor_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividad" ADD CONSTRAINT "actividad_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria_actividad"("id_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id_actividad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_espacio_fkey" FOREIGN KEY ("id_espacio") REFERENCES "espacio_fisico"("id_espacio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_estado_reserva_fkey" FOREIGN KEY ("id_estado_reserva") REFERENCES "estado_reserva"("id_estado_reserva") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_id_menor_fkey" FOREIGN KEY ("id_menor") REFERENCES "menor"("id_menor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion" ADD CONSTRAINT "inscripcion_id_estado_inscripcion_fkey" FOREIGN KEY ("id_estado_inscripcion") REFERENCES "estado_inscripcion"("id_estado_inscripcion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria_inventario"("id_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_item" ADD CONSTRAINT "reserva_item_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_item" ADD CONSTRAINT "reserva_item_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;
