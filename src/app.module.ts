import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';

// Modulo de Inventario
import { CategoriaItemModule } from './modules/categoria-item/categoria-item.module';
import { InventarioModule } from './modules/inventario/inventario.module';
// Modulo de Actividades
import { CategoriaActividadModule } from './modules/categoria-actividad/categoria-actividad.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriaItemModule,
    InventarioModule,
    CategoriaActividadModule,
    // PrismaModule se activará una vez que tengamos los modelos listos en schema.prisma
    // y ejecutemos "npm run prisma:generate":
    // PrismaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

