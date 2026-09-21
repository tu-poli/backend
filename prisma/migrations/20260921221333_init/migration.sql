-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_doc` VARCHAR(50) NOT NULL,
    `num_doc` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `mail` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `id_rol` INTEGER NULL,

    UNIQUE INDEX `usuario_tipo_doc_num_doc_key`(`tipo_doc`, `num_doc`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `espacio_fisico` (
    `id_espacio` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id_espacio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_actividad` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actividad` (
    `id_actividad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `id_categoria` INTEGER NULL,

    PRIMARY KEY (`id_actividad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado_reserva` (
    `id_estado_reserva` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_estado_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva` (
    `id_reserva` INTEGER NOT NULL AUTO_INCREMENT,
    `id_actividad` INTEGER NULL,
    `id_espacio` INTEGER NULL,
    `id_profesor` INTEGER NULL,
    `fecha_hora_inicio` DATETIME(3) NOT NULL,
    `fecha_hora_fin` DATETIME(3) NOT NULL,
    `cupo_maximo` INTEGER NULL,
    `id_estado_reserva` INTEGER NULL,

    PRIMARY KEY (`id_reserva`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado_inscripcion` (
    `id_estado_inscripcion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_estado_inscripcion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscripcion` (
    `id_inscripcion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_actividad` INTEGER NOT NULL,
    `fecha_hora_inscripcion` DATETIME(3) NOT NULL,
    `id_estado_inscripcion` INTEGER NULL,

    PRIMARY KEY (`id_inscripcion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria_inventario` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventario` (
    `id_inventario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id_inventario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item` (
    `id_item` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 0,
    `id_categoria` INTEGER NULL,
    `id_inventario` INTEGER NULL,

    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_item` (
    `id_reserva` INTEGER NOT NULL,
    `id_item` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id_reserva`, `id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actividad` ADD CONSTRAINT `actividad_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_actividad`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_actividad_fkey` FOREIGN KEY (`id_actividad`) REFERENCES `actividad`(`id_actividad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_espacio_fkey` FOREIGN KEY (`id_espacio`) REFERENCES `espacio_fisico`(`id_espacio`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_profesor_fkey` FOREIGN KEY (`id_profesor`) REFERENCES `usuario`(`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva` ADD CONSTRAINT `reserva_id_estado_reserva_fkey` FOREIGN KEY (`id_estado_reserva`) REFERENCES `estado_reserva`(`id_estado_reserva`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_id_actividad_fkey` FOREIGN KEY (`id_actividad`) REFERENCES `actividad`(`id_actividad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_id_estado_inscripcion_fkey` FOREIGN KEY (`id_estado_inscripcion`) REFERENCES `estado_inscripcion`(`id_estado_inscripcion`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_inventario`(`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item` ADD CONSTRAINT `item_id_inventario_fkey` FOREIGN KEY (`id_inventario`) REFERENCES `inventario`(`id_inventario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_item` ADD CONSTRAINT `reserva_item_id_reserva_fkey` FOREIGN KEY (`id_reserva`) REFERENCES `reserva`(`id_reserva`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_item` ADD CONSTRAINT `reserva_item_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `item`(`id_item`) ON DELETE RESTRICT ON UPDATE CASCADE;
