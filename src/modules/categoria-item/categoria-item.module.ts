import { Module } from '@nestjs/common';
import { CategoriaItemService } from './categoria-item.service';
import { CategoriaItemController } from './categoria-item.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaItemController],
  providers: [CategoriaItemService],
})
export class CategoriaItemModule {}
