-- ============================================================
-- TuPoli — Schema MySQL (snake_case, Prisma-compatible)
-- Solo definiciones DDL de tablas para importación en DrawDB
-- ============================================================

CREATE TABLE `rol` (
    `id_rol`  INT          NOT NULL AUTO_INCREMENT,
    `nombre`  VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id_rol`)
);

CREATE TABLE `usuario` (
    `id_usuario`  INT          NOT NULL AUTO_INCREMENT,
    `tipo_doc`    VARCHAR(50)  NOT NULL,
    `num_doc`     VARCHAR(50)  NOT NULL,
    `nombre`      VARCHAR(255) NOT NULL,
    `mail`        VARCHAR(255),
    `password`    VARCHAR(255),
    `id_rol`      INT,
    PRIMARY KEY (`id_usuario`),
    UNIQUE KEY `uq_usuario_doc` (`tipo_doc`, `num_doc`),
    CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
);

CREATE TABLE `menor` (
    `id_menor`          INT          NOT NULL AUTO_INCREMENT,
    `id_tutor`          INT          NOT NULL,
    `nombre`            VARCHAR(255) NOT NULL,
    `apellido`          VARCHAR(255) NOT NULL,
    `tipo_doc`          VARCHAR(50)  NOT NULL,
    `num_doc`           VARCHAR(50)  NOT NULL,
    `fecha_nacimiento`  DATE         NOT NULL,
    `ficha_medica_url`  VARCHAR(500),
    `cud_url`           VARCHAR(500),
    PRIMARY KEY (`id_menor`),
    UNIQUE KEY `uq_menor_doc` (`tipo_doc`, `num_doc`),
    CONSTRAINT `fk_menor_tutor` FOREIGN KEY (`id_tutor`) REFERENCES `usuario` (`id_usuario`)
);

CREATE TABLE `espacio_fisico` (
    `id_espacio`   INT          NOT NULL AUTO_INCREMENT,
    `nombre`       VARCHAR(255) NOT NULL,
    `descripcion`  VARCHAR(255),
    PRIMARY KEY (`id_espacio`)
);

CREATE TABLE `categoria_actividad` (
    `id_categoria`  INT          NOT NULL AUTO_INCREMENT,
    `nombre`        VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id_categoria`)
);

CREATE TABLE `actividad` (
    `id_actividad`          INT          NOT NULL AUTO_INCREMENT,
    `nombre`                VARCHAR(255) NOT NULL,
    `descripcion`           VARCHAR(255),
    `id_categoria`          INT,
    `requiere_autorizacion` BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (`id_actividad`),
    CONSTRAINT `fk_actividad_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_actividad` (`id_categoria`)
);

CREATE TABLE `estado_reserva` (
    `id_estado_reserva`  INT          NOT NULL AUTO_INCREMENT,
    `nombre`             VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id_estado_reserva`)
);

CREATE TABLE `reserva` (
    `id_reserva`         INT      NOT NULL AUTO_INCREMENT,
    `id_actividad`       INT,
    `id_espacio`         INT,
    `id_profesor`        INT,
    `fecha_hora_inicio`  DATETIME NOT NULL,
    `fecha_hora_fin`     DATETIME NOT NULL,
    `cupo_maximo`        INT,
    `id_estado_reserva`  INT,
    PRIMARY KEY (`id_reserva`),
    CONSTRAINT `fk_reserva_actividad` FOREIGN KEY (`id_actividad`)      REFERENCES `actividad` (`id_actividad`),
    CONSTRAINT `fk_reserva_espacio`   FOREIGN KEY (`id_espacio`)        REFERENCES `espacio_fisico` (`id_espacio`),
    CONSTRAINT `fk_reserva_profesor`  FOREIGN KEY (`id_profesor`)       REFERENCES `usuario` (`id_usuario`),
    CONSTRAINT `fk_reserva_estado`    FOREIGN KEY (`id_estado_reserva`) REFERENCES `estado_reserva` (`id_estado_reserva`)
);

CREATE TABLE `estado_inscripcion` (
    `id_estado_inscripcion`  INT          NOT NULL AUTO_INCREMENT,
    `nombre`                 VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id_estado_inscripcion`)
);

CREATE TABLE `inscripcion` (
    `id_inscripcion`         INT          NOT NULL AUTO_INCREMENT,
    `id_reserva`             INT          NOT NULL,
    `id_menor`               INT          NOT NULL,
    `autorizacion_url`       VARCHAR(500),
    `fecha_hora_inscripcion` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `id_estado_inscripcion`  INT,
    PRIMARY KEY (`id_inscripcion`),
    UNIQUE KEY `uq_inscripcion_reserva_menor` (`id_reserva`, `id_menor`),
    CONSTRAINT `fk_inscripcion_reserva` FOREIGN KEY (`id_reserva`)             REFERENCES `reserva` (`id_reserva`),
    CONSTRAINT `fk_inscripcion_menor`   FOREIGN KEY (`id_menor`)               REFERENCES `menor` (`id_menor`),
    CONSTRAINT `fk_inscripcion_estado`  FOREIGN KEY (`id_estado_inscripcion`) REFERENCES `estado_inscripcion` (`id_estado_inscripcion`)
);

CREATE TABLE `categoria_inventario` (
    `id_categoria`  INT          NOT NULL AUTO_INCREMENT,
    `nombre`        VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id_categoria`)
);

CREATE TABLE `item` (
    `id_item`       INT          NOT NULL AUTO_INCREMENT,
    `nombre`        VARCHAR(255) NOT NULL,
    `cantidad`      INT          NOT NULL DEFAULT 0,
    `id_categoria`  INT,
    PRIMARY KEY (`id_item`),
    CONSTRAINT `fk_item_categoria`  FOREIGN KEY (`id_categoria`)  REFERENCES `categoria_inventario` (`id_categoria`)
);

CREATE TABLE `reserva_item` (
    `id_reserva`  INT NOT NULL,
    `id_item`     INT NOT NULL,
    `cantidad`    INT NOT NULL DEFAULT 1,
    PRIMARY KEY (`id_reserva`, `id_item`),
    CONSTRAINT `fk_reserva_item_reserva` FOREIGN KEY (`id_reserva`) REFERENCES `reserva` (`id_reserva`),
    CONSTRAINT `fk_reserva_item_item`    FOREIGN KEY (`id_item`)    REFERENCES `item` (`id_item`)
);
