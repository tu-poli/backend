import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ActividadesController } from "./actividades.controller";
import { ActividadesService } from "./actividades.service";

@Module({
  imports: [PrismaModule],
  controllers: [ActividadesController],
  providers: [ActividadesService],
  exports: [ActividadesService],
})
export class ActividadModule {}
