import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexión con la base de datos establecida exitosamente.');
    } catch (error) {
      this.logger.warn(
        'Aviso: No se pudo conectar a la base de datos MariaDB. Verifique si el contenedor o servicio está activo. El backend continuará corriendo.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
