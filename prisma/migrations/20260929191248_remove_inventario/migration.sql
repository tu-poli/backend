/*
  Warnings:

  - You are about to drop the column `id_inventario` on the `item` table. All the data in the column will be lost.
  - You are about to drop the `inventario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `item` DROP FOREIGN KEY `item_id_inventario_fkey`;

-- AlterTable
ALTER TABLE `item` DROP COLUMN `id_inventario`;

-- DropTable
DROP TABLE `inventario`;
