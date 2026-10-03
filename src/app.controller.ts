import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  obtenerHolaMundo(): string {
    return "¡Hola Mundo desde el backend de TuPoli!";
  }

  @Get("health")
  checkHealth() {
    return {
      status: "ok",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())} seconds`,
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      },
      // TODO: Una vez que se habilite PrismaModule, se puede inyectar el servicio
      // y verificar la conexión a DB aquí (ej: await prisma.$queryRaw`SELECT 1`)
    };
  }
}
