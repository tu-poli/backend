import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";

// Modulo de Item
import { CategoriaItemModule } from "./modules/categoria-item/categoria-item.module";
import { ItemModule } from "./modules/item/item.module";
// Modulo de Actividades
import { CategoriaActividadModule } from "./modules/categoria-actividad/categoria-actividad.module";
import { ActividadModule } from "./modules/actividad/actividad.module";
// Modulo de Espacios Fisicos
import { EspacioFisicoModule } from "./modules/espacio-fisico/espacio-fisico.module";
// Modulo de Almacenamiento (Supabase Storage)
import { AlmacenamientoModule } from "./modules/almacenamiento/almacenamiento.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriaItemModule,
    ItemModule,
    CategoriaActividadModule,
    ActividadModule,
    AlmacenamientoModule,
    PrismaModule,
    EspacioFisicoModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
