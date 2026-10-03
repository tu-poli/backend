-- DropForeignKey
ALTER TABLE `inscripcion` DROP FOREIGN KEY `inscripcion_id_actividad_fkey`;

-- DropForeignKey
ALTER TABLE `inscripcion` DROP FOREIGN KEY `inscripcion_id_usuario_fkey`;

-- DropForeignKey
ALTER TABLE `reserva_menor` DROP FOREIGN KEY `reserva_menor_id_estado_inscripcion_fkey`;

-- DropForeignKey
ALTER TABLE `reserva_menor` DROP FOREIGN KEY `reserva_menor_id_menor_fkey`;

-- DropForeignKey
ALTER TABLE `reserva_menor` DROP FOREIGN KEY `reserva_menor_id_reserva_fkey`;

-- AlterTable
ALTER TABLE `inscripcion` DROP COLUMN `id_actividad`,
    DROP COLUMN `id_usuario`,
    ADD COLUMN `autorizacion_url` VARCHAR(500) NULL,
    ADD COLUMN `id_menor` INTEGER NOT NULL,
    ADD COLUMN `id_reserva` INTEGER NOT NULL,
    MODIFY `fecha_hora_inscripcion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `reserva_menor`;

-- CreateIndex
CREATE UNIQUE INDEX `inscripcion_id_reserva_id_menor_key` ON `inscripcion`(`id_reserva`, `id_menor`);

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_id_reserva_fkey` FOREIGN KEY (`id_reserva`) REFERENCES `reserva`(`id_reserva`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripcion` ADD CONSTRAINT `inscripcion_id_menor_fkey` FOREIGN KEY (`id_menor`) REFERENCES `menor`(`id_menor`) ON DELETE RESTRICT ON UPDATE CASCADE;
