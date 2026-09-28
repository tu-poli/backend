import { Module } from '@nestjs/common';
import { CategoriaActividadService } from './categoria-actividad.service';
import { CategoriaActividadController } from './categoria-actividad.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaActividadController],
  providers: [CategoriaActividadService],
  exports: [CategoriaActividadService],
})
export class CategoriaActividadModule {}
