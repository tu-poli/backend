import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  obtenerHolaMundo(): string {
    return '¡Hola Mundo desde el backend de TuPoli!';
  }
}
