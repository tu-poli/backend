-- AlterTable
ALTER TABLE "categoria_inventario" ADD COLUMN     "color" VARCHAR(50),
ADD COLUMN     "icono" VARCHAR(50);

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "lote" VARCHAR(100);
