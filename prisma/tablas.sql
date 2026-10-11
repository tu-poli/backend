-- ============================================================
-- TuPoli — Schema PostgreSQL (snake_case, Prisma-compatible)
-- Solo definiciones DDL de tablas para importación y referencia
-- ============================================================

CREATE TABLE "rol" (
    "id_rol"  SERIAL PRIMARY KEY,
    "nombre"  VARCHAR(100) NOT NULL
);

CREATE TABLE "usuario" (
    "id_usuario"  SERIAL PRIMARY KEY,
    "tipo_doc"    VARCHAR(50)  NOT NULL,
    "num_doc"     VARCHAR(50)  NOT NULL,
    "nombre"      VARCHAR(255) NOT NULL,
    "mail"        VARCHAR(255),
    "password"    VARCHAR(255),
    "id_rol"      INT REFERENCES "rol"("id_rol"),
    CONSTRAINT "uq_usuario_doc" UNIQUE ("tipo_doc", "num_doc")
);

CREATE TABLE "menor" (
    "id_menor"          SERIAL PRIMARY KEY,
    "id_tutor"          INT          NOT NULL REFERENCES "usuario"("id_usuario"),
    "nombre"            VARCHAR(255) NOT NULL,
    "apellido"          VARCHAR(255) NOT NULL,
    "tipo_doc"          VARCHAR(50)  NOT NULL,
    "num_doc"           VARCHAR(50)  NOT NULL,
    "fecha_nacimiento"  DATE         NOT NULL,
    "ficha_medica_url"  VARCHAR(500),
    "cud_url"           VARCHAR(500),
    CONSTRAINT "uq_menor_doc" UNIQUE ("tipo_doc", "num_doc")
);

CREATE TABLE "espacio_fisico" (
    "id_espacio"   SERIAL PRIMARY KEY,
    "nombre"       VARCHAR(255) NOT NULL,
    "descripcion"  VARCHAR(255)
);

CREATE TABLE "categoria_actividad" (
    "id_categoria"  SERIAL PRIMARY KEY,
    "nombre"        VARCHAR(255) NOT NULL
);

CREATE TABLE "actividad" (
    "id_actividad"          SERIAL PRIMARY KEY,
    "nombre"                VARCHAR(255) NOT NULL,
    "descripcion"           VARCHAR(255),
    "id_categoria"          INT REFERENCES "categoria_actividad"("id_categoria"),
    "requiere_autorizacion" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "estado_reserva" (
    "id_estado_reserva"  SERIAL PRIMARY KEY,
    "nombre"             VARCHAR(100) NOT NULL
);

CREATE TABLE "reserva" (
    "id_reserva"         SERIAL PRIMARY KEY,
    "id_actividad"       INT REFERENCES "actividad"("id_actividad"),
    "id_espacio"         INT REFERENCES "espacio_fisico"("id_espacio"),
    "id_profesor"        INT REFERENCES "usuario"("id_usuario"),
    "fecha_hora_inicio"  TIMESTAMP(3) NOT NULL,
    "fecha_hora_fin"     TIMESTAMP(3) NOT NULL,
    "cupo_maximo"        INT,
    "id_estado_reserva"  INT REFERENCES "estado_reserva"("id_estado_reserva")
);

CREATE TABLE "estado_inscripcion" (
    "id_estado_inscripcion"  SERIAL PRIMARY KEY,
    "nombre"                 VARCHAR(100) NOT NULL
);

CREATE TABLE "inscripcion" (
    "id_inscripcion"         SERIAL PRIMARY KEY,
    "id_reserva"             INT NOT NULL REFERENCES "reserva"("id_reserva"),
    "id_menor"               INT NOT NULL REFERENCES "menor"("id_menor"),
    "autorizacion_url"       VARCHAR(500),
    "fecha_hora_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_estado_inscripcion"  INT REFERENCES "estado_inscripcion"("id_estado_inscripcion"),
    CONSTRAINT "uq_inscripcion_reserva_menor" UNIQUE ("id_reserva", "id_menor")
);

CREATE TABLE "categoria_inventario" (
    "id_categoria"  SERIAL PRIMARY KEY,
    "nombre"        VARCHAR(255) NOT NULL,
    "color"         VARCHAR(50),
    "icono"         VARCHAR(50)
);

CREATE TABLE "item" (
    "id_item"       SERIAL PRIMARY KEY,
    "nombre"        VARCHAR(255) NOT NULL,
    "cantidad"      INT NOT NULL DEFAULT 0,
    "id_categoria"  INT REFERENCES "categoria_inventario"("id_categoria"),
    "lote"          VARCHAR(100)
);

CREATE TABLE "reserva_item" (
    "id_reserva"  INT NOT NULL REFERENCES "reserva"("id_reserva"),
    "id_item"     INT NOT NULL REFERENCES "item"("id_item"),
    "cantidad"    INT NOT NULL DEFAULT 1,
    PRIMARY KEY ("id_reserva", "id_item")
);
