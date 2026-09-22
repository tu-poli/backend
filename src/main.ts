import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function iniciarAplicacion() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validaciones globales (class-validator)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configurar el prefijo global
  app.setGlobalPrefix('api/v1');

  // Configuración simple de Swagger
  const config = new DocumentBuilder()
    .setTitle('API TuPoli')
    .setDescription('Documentación de los endpoints del backend TuPoli')
    .setVersion('1.0')
    .addBearerAuth() // Opcional, para endpoints protegidos
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // La ruta de swagger será /api/v1/docs
  SwaggerModule.setup('api/v1/docs', app, document);

  const puerto = process.env.PORT || 3000;
  await app.listen(puerto);
  console.log(`Backend iniciado en: http://localhost:${puerto}`);
  console.log(`Swagger disponible en: http://localhost:${puerto}/api/v1/docs`);
}

iniciarAplicacion();
