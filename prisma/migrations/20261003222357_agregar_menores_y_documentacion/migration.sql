-- AlterTable
ALTER TABLE `actividad` ADD COLUMN `requiere_autorizacion` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `menor` (
    `id_menor` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tutor` INTEGER NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `apellido` VARCHAR(255) NOT NULL,
    `tipo_doc` VARCHAR(50) NOT NULL,
    `num_doc` VARCHAR(50) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `ficha_medica_url` VARCHAR(500) NULL,
    `cud_url` VARCHAR(500) NULL,

    UNIQUE INDEX `menor_tipo_doc_num_doc_key`(`tipo_doc`, `num_doc`),
    PRIMARY KEY (`id_menor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserva_menor` (
    `id_reserva_menor` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reserva` INTEGER NOT NULL,
    `id_menor` INTEGER NOT NULL,
    `autorizacion_url` VARCHAR(500) NULL,
    `fecha_hora_inscripcion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_estado_inscripcion` INTEGER NULL,

    UNIQUE INDEX `reserva_menor_id_reserva_id_menor_key`(`id_reserva`, `id_menor`),
    PRIMARY KEY (`id_reserva_menor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menor` ADD CONSTRAINT `menor_id_tutor_fkey` FOREIGN KEY (`id_tutor`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_menor` ADD CONSTRAINT `reserva_menor_id_reserva_fkey` FOREIGN KEY (`id_reserva`) REFERENCES `reserva`(`id_reserva`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_menor` ADD CONSTRAINT `reserva_menor_id_menor_fkey` FOREIGN KEY (`id_menor`) REFERENCES `menor`(`id_menor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserva_menor` ADD CONSTRAINT `reserva_menor_id_estado_inscripcion_fkey` FOREIGN KEY (`id_estado_inscripcion`) REFERENCES `estado_inscripcion`(`id_estado_inscripcion`) ON DELETE SET NULL ON UPDATE CASCADE;
