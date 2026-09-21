import { Module } from '@nestjs/common';
import { CategoriaItemService } from './categoria-item.service';
import { CategoriaItemController } from './categoria-item.controller';

@Module({
  controllers: [CategoriaItemController],
  providers: [CategoriaItemService],
})
export class CategoriaItemModule {}
