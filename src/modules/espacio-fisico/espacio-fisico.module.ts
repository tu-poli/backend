import { Module } from "@nestjs/common";
import { EspaciosFisicosService } from "./espacios-fisicos.service";
import { EspaciosFisicosController } from "./espacios-fisicos.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [EspaciosFisicosController],
  providers: [EspaciosFisicosService],
})
export class EspacioFisicoModule {}
