# AGENTS.md — Directrices y Contexto para Agentes de IA en TuPoli Backend

Este archivo proporciona la guía completa de arquitectura, estándares de desarrollo, convenciones y flujos operativos para que cualquier agente de IA o desarrollador interactúe de forma consistente y autónoma con el repositorio del **Backend de TuPoli**.

---

## 1. Visión General del Proyecto

- **Nombre del Proyecto:** Backend — TuPoli API
- **Objetivo:** API REST para la gestión integral del polideportivo comunitario/institucional **TuPoli** (gestión de actividades, reservas, espacios físicos, inventario de ítems, tutores, menores a cargo, inscripciones, documentación médica y autorizaciones).
- **Stack Tecnológico Principal:**
  - **Lenguaje:** TypeScript 5+ (compilado con `ES2021`, CommonJS)
  - **Framework:** NestJS 10 (arquitectura modular, inyección de dependencias)
  - **ORM:** Prisma 5.22.0
  - **Base de Datos:** PostgreSQL 16 (vía Docker)
  - **Almacenamiento de Archivos:** Supabase Storage (`@supabase/supabase-js`)
  - **Documentación API:** Swagger UI (`@nestjs/swagger`, `swagger-ui-express`)
  - **Seguridad & Validación:** `class-validator`, `class-transformer`, `helmet`, JWT, `secretlint`
  - **Testing:** Jest, Supertest, scripts de integración Bash

---

## 2. Reglas de Oro y Directivas No Negociables

> [!IMPORTANT]
> **REGLA DE IDIOMA (ESTRICTA):**
> Todo el desarrollo, nombrado de variables, funciones, clases, DTOs, interfaces, mensajes de commit, nombres de ramas, comentarios de código y mensajes de error **debe realizarse estrictamente en ESPAÑOL** (referencia: `docs/SCM_BACKEND.md`). No introduzcas nombres en inglés para lógica de negocio o documentación interna.

### 2.1 Convenciones de Nomenclatura
- **Archivos y Directorios:** `kebab-case` (ej. `actividades.controller.ts`, `create-actividad.dto.ts`, `almacenamiento.service.ts`).
- **Clases e Interfaces:** `PascalCase` (ej. `ActividadesController`, `PrismaService`, `CrearActividadDto`).
- **Métodos y Variables:** `camelCase` (ej. `obtenerPorId`, `categoriaExiste`, `idActividad`).
- **Constantes y Enums:** `UPPER_SNAKE_CASE` (ej. `BucketAlmacenamiento.DOCUMENTACION_MEDICA`).
- **Base de Datos (Prisma y PostgreSQL):** Tablas y columnas en `snake_case` (ej. `id_actividad`, `requiere_autorizacion`), mapeadas a `camelCase` en los DTOs y respuestas de la API.

### 2.2 Convención de Commits (Conventional Commits en Español)
Estructura: `<tipo>(<módulo/ámbito>): <descripción corta en minúsculas>`
- `feat`: Nueva funcionalidad o endpoint (ej. `feat(actividad): implementar filtrado por autorización`).
- `fix`: Corrección de bug o error (ej. `fix(item): corregir validacion de cantidad minima`).
- `docs`: Documentación (ej. `docs(api): actualizar parametros de swagger`).
- `refactor`: Refactorización de código sin alterar comportamiento externo.
- `test`: Tests unitarios o de integración.
- `chore`: Tareas de configuración, Docker, dependencias, scripts o migraciones Prisma.

### 2.3 Estrategia de Ramas
- `main`: Producción / versión estable.
- `test`: Rama de integración para pruebas compartidas.
- `feat/<nombre-funcionalidad>`: Nuevas características.
- `fix/<nombre-del-bug>`: Correcciones.
- `chore/<tarea>`: Mantenimiento y configuración.

---

## 3. Estructura del Repositorio

```text
backend/
├── docker/                     # Configuraciones e inicialización de contenedores
│   └── postgres-init/          # Scripts SQL automáticos para inicio (permisos Prisma CREATEDB)
├── docs/                       # Especificaciones técnicas de negocio y arquitectura
│   ├── API.md                  # Contrato de endpoints y especificación de payloads
│   ├── SCM_BACKEND.md          # Guía oficial de Git, idioma y convenciones
│   └── estructura_carpetas.txt # Descripción general de carpetas
├── prisma/                     # Persistencia de datos y ORM
│   ├── migrations/             # Historial de migraciones SQL aplicadas
│   ├── schema.prisma           # Modelos de datos Prisma y configuración de datasource
│   ├── seeds.js                # Semilla de datos iniciales para desarrollo y testing
│   └── tablas.sql              # Dump auxiliar de estructura SQL (PostgreSQL)
├── scripts/                    # Scripts de automatización y verificación
│   ├── deploy.sh               # Script de validación integral pre-despliegue
│   └── validar-rutas.sh        # Test suite E2E en Bash de todas las rutas HTTP
├── src/                        # Código fuente de la aplicación
│   ├── common/                 # Pipes, guards, filtros, interceptores globales
│   ├── modules/                # Módulos funcionales de dominio
│   │   ├── actividad/          # Gestión de actividades deportivas
│   │   ├── almacenamiento/     # Integración con Supabase Storage (archivos privados)
│   │   ├── categoria-actividad/# Categorías de actividades
│   │   ├── categoria-item/     # Categorías de inventario de ítems
│   │   ├── espacio-fisico/     # Canchas, salas y playones deportivos
│   │   └── item/               # Ítems físicos e inventario
│   ├── prisma/                 # PrismaModule y PrismaService (conexión a DB)
│   ├── app.controller.ts       # Healthcheck (/api/v1/health) y bienvenida
│   ├── app.module.ts           # Módulo raíz que ensambla todos los módulos
│   └── main.ts                 # Bootstrap de la app (CORS, Pipes globales, Swagger)
├── test/                       # Tests End-to-End de NestJS (Jest e2e)
├── docker-compose-dev.yaml     # Compose para PostgreSQL en desarrollo local
├── docker-compose-prod.yaml    # Compose para PostgreSQL y la API en producción
├── Dockerfile                  # Multi-stage build para contenedor Docker de la API
├── package.json                # Dependencias, scripts npm y configuración de Jest
├── tsconfig.json               # Configuración del compilador TypeScript
└── .env.example                # Plantilla de variables de entorno requeridas
```

---

## 4. Arquitectura de Endpoints y Módulos

- **Prefijo Global de la API:** `/api/v1`
- **Ruta Swagger UI:** `/api/v1/docs`
- **Healthcheck:** `GET /api/v1/health`

### 4.1 Módulos Implementados
1. **Actividades (`/api/v1/actividades`):**
   - CRUD completo de actividades polideportivas.
   - Filtros por `nombre`, `categoriaId`, `requiereAutorizacion`.
   - Modificación parcial mediante `PATCH /api/v1/actividades/:id`.
   - Control de borrado: No permite eliminar actividades con reservas asociadas.
2. **Categorías de Actividades (`/api/v1/actividades/categorias`):**
   - Agrupador de actividades (`Clase`, `Deporte`, `Taller`, etc.).
   - Validación de nombres únicos sin distinción de mayúsculas/minúsculas.
3. **Categorías de Ítems (`/api/v1/inventario/categorias`):**
   - Clasificación de equipamiento deportivo o bienes (`Pelotas`, `Redes`, etc.).
4. **Ítems de Inventario (`/api/v1/items`):**
   - Stock de materiales deportivos vinculados a una categoría de inventario.
5. **Espacios Físicos (`/api/v1/espacios-fisicos`):**
   - Gestión de playones, canchas y gimnasios disponibles para reservas.
6. **Almacenamiento (`AlmacenamientoService`):**
   - Cliente seguro de Supabase Storage.
   - Buckets privados: `documentacion_medica` (fichas médicas, CUD) y `autorizaciones`.
   - Sanitización contra Path Traversal (`sanitizarRuta`).
   - Generación de **Signed URLs** temporales (`obtenerUrlFirmada`) para lectura segura; nunca exponer enlaces públicos directos a documentos sensibles.

---

## 5. Patrones de Código y Guía de Implementación

### 5.1 Estructura Estándar de DTOs (`create-*.dto.ts` / `update-*.dto.ts`)
Los DTOs deben implementar validación y transformación estricta:
```typescript
import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsNumber } from "class-validator";

export class CreateEjemploDto {
  @ApiProperty({ example: "Cancha Principal", description: "Nombre del espacio" })
  @Transform(({ value }) => typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value)
  @IsNotEmpty({ message: "El campo nombre no puede estar vacío" })
  @IsString({ message: "El campo nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El campo nombre debe tener al menos 3 caracteres" })
  @MaxLength(100, { message: "El campo nombre no puede exceder los 100 caracteres" })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,]+$/, {
    message: "El campo nombre contiene símbolos no permitidos. Use solo letras, números, espacios o puntuación básica.",
  })
  nombre: string;
}

// Para actualizaciones parciales:
export class UpdateEjemploDto extends PartialType(CreateEjemploDto) {}

// Alias en español para mantener consistencia:
export class CrearEjemploDto extends CreateEjemploDto {}
export class ActualizarEjemploDto extends UpdateEjemploDto {}
```

### 5.2 Estructura Estándar de Controladores (`*.controller.ts`)
- Decorar con `@ApiTags("Nombre del Módulo")` para agrupar en Swagger.
- Usar pipes de transformación para IDs numéricos: `@Param("id", ParseIntPipe) id: number`.
- Estandarizar métodos HTTP:
  - Creación: `POST` con `@HttpCode(HttpStatus.CREATED)` (por defecto en NestJS).
  - Consulta: `GET` con `@HttpCode(HttpStatus.OK)`.
  - Modificación parcial: `PATCH` con `@HttpCode(HttpStatus.OK)`.
  - Eliminación: `DELETE` con `@HttpCode(HttpStatus.NO_CONTENT)` (código 204).
- Describir respuestas con `@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiQuery`.

### 5.3 Estructura Estándar de Servicios (`*.service.ts`)
- Inyectar `PrismaService` en el constructor: `constructor(private readonly prisma: PrismaService) {}`.
- Controlar existencia y conflictos arrojando excepciones nativas de NestJS:
  - `NotFoundException` (404) para registros inexistentes.
  - `ConflictException` (409) para duplicados de claves únicas o nombres repetidos.
  - `BadRequestException` (400) para violaciones de reglas de negocio.
- Implementar un método privado `mapearDto(entidad: any)` para normalizar la salida de datos desde el formato `snake_case` de la base de datos hacia el contrato `camelCase` esperado por el frontend.

---

## 6. Base de Datos y Flujo de Prisma

### 6.1 Modelos Principales (`prisma/schema.prisma`)
- **Usuarios & Permisos:** `Rol`, `Usuario` (DNI, email, contraseña, rol).
- **Menores & Tutores:** `Menor` (datos personales, tutor asociado, `ficha_medica_url`, `cud_url`).
- **Espacios & Actividades:** `EspacioFisico`, `CategoriaActividad`, `Actividad` (`requiere_autorizacion`).
- **Reservas & Turnos:** `EstadoReserva`, `Reserva` (profesor, espacio, actividad, fechas).
- **Inscripciones:** `EstadoInscripcion`, `Inscripcion` (asocia menor con reserva, `autorizacion_url`).
- **Inventario:** `CategoriaInventario`, `Item`, `ReservaItem` (materiales asignados a reservas).

### 6.2 Comandos Esenciales de Base de Datos
| Comando | Descripción |
|---|---|
| `npm run prisma:generate` | Regenera el cliente tipado de Prisma (`@prisma/client`) tras cambios en el schema. |
| `npm run prisma:migrate` | Crea y aplica una nueva migración en desarrollo (`prisma migrate dev`). Requiere PostgreSQL corriendo. |
| `npm run prisma:migrate:deploy` | Aplica migraciones pendientes sin modificar el schema (modo producción/CI). |
| `npm run prisma:seed` | Ejecuta el script `prisma/seeds.js` para repoblar la base con datos de prueba. |
| `npm run prisma:studio` | Abre interfaz web para explorar y editar los datos de PostgreSQL. |

---

## 7. Variables de Entorno (`.env`)

Copia siempre `.env.example` a `.env` al configurar un nuevo entorno:
```bash
cp .env.example .env
```

| Variable | Descripción | Valor por Defecto / Ejemplo |
|---|---|---|
| `PORT` | Puerto HTTP donde escucha la API | `3000` |
| `NODE_ENV` | Entorno de ejecución (`development`, `production`, `test`) | `development` |
| `DB_HOST` | Host del contenedor PostgreSQL | `tupoli_db` |
| `DB_PORT` | Puerto expuesto en el host para PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `tupoli_db` |
| `DB_USER` | Usuario de PostgreSQL | `tupoli_user` |
| `DB_PASSWORD` | Contraseña del usuario PostgreSQL | `tupoli_password` |
| `DB_ROOT_PASSWORD` | Contraseña del usuario administrador PostgreSQL | `tupoli_root_secret` |
| `DATABASE_URL` | URL de conexión para Prisma (Texto plano) | Local: `postgresql://tupoli_user:tupoli_password@localhost:5432/tupoli_db?schema=public`<br>Docker: `postgresql://tupoli_user:tupoli_password@tupoli_db:5432/tupoli_db?schema=public` |
| `RUN_SEEDS` | Ejecuta seeds automáticamente al iniciar contenedor Docker | `true` |
| `JWT_SECRET` | Clave secreta para tokens JWT | `super_secret_jwt_key_change_me` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `1d` |
| `SUPABASE_URL` | URL del proyecto de Supabase | `https://<proyecto>.supabase.co` |
| `SUPABASE_SECRET_KEY` | Service role key para operaciones seguras de backend | Secret key de Supabase |
| `SUPABASE_BUCKET_DOCUMENTACION_MEDICA` | Nombre del bucket para fichas médicas y CUD | `documentacion_medica` |
| `SUPABASE_BUCKET_AUTORIZACIONES` | Nombre del bucket para autorizaciones firmadas | `autorizaciones` |

---

## 8. Flujo de Desarrollo y Comandos de Ejecución

### 8.1 Levantar la Base de Datos con Docker
```bash
# Levantar el contenedor PostgreSQL en segundo plano (puerto 5432 en el host)
docker compose -f docker-compose-dev.yaml up -d

# Comprobar estado del contenedor
docker compose -f docker-compose-dev.yaml ps
```

### 8.2 Levantar la API en Modo Desarrollo
```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente de Prisma
npm run prisma:generate

# 3. Aplicar migraciones
npm run prisma:migrate:deploy

# 4. Poblar datos iniciales
npm run prisma:seed

# 5. Iniciar servidor con recarga en caliente (watch)
npm run start:dev
```

---

## 9. Pruebas, Linters y Control de Calidad

### 9.1 Comandos de Testing
```bash
# Ejecutar tests unitarios con Jest
npm test

# Ejecutar tests en modo observador
npm run test:watch

# Generar reporte de cobertura de código
npm run test:cov

# Ejecutar tests End-to-End de NestJS
npm run test:e2e

# Validar todas las rutas y respuestas HTTP contra el backend corriendo
npm run test:routes
# o directamente:
bash scripts/validar-rutas.sh
```

### 9.2 Linter, Formateador y Verificación de Secretos
```bash
# Validar y corregir formato con ESLint
npm run lint

# Formatear archivos TypeScript con Prettier
npm run format

# Escanear código en busca de credenciales o secretos accidentales
npx secretlint "src/**/*" "scripts/**/*" "prisma/**/*"

# Ejecutar verificación integral pre-deploy (secretos + linter + prettier + build + test:routes)
bash scripts/deploy.sh
```

---

## 10. Checklist de Verificación para Agentes de IA

Antes de dar por finalizada cualquier tarea o proponer un commit/pull request, el agente debe verificar rigurosamente los siguientes puntos:

- [ ] **Idioma:** Todo el código nuevo (variables, nombres de funciones, comentarios, DTOs y mensajes de error) está estrictamente en **español**.
- [ ] **DTOs & Validaciones:** Todos los endpoints nuevos tienen DTOs con `@Transform` (`trim()`), `@Matches` (regex permitida) y decoradores de Swagger (`@ApiProperty`).
- [ ] **Manejo de Errores:** Se utilizan excepciones HTTP de NestJS (`NotFoundException`, `ConflictException`, `BadRequestException`) con mensajes claros y descriptivos.
- [ ] **Swagger UI:** Los endpoints, parámetros y códigos de retorno están documentados con `@ApiTags`, `@ApiOperation` y `@ApiResponse`.
- [ ] **Prisma & Base de Datos:** Si se modificó `schema.prisma`, se generó la migración correspondiente y se actualizó `seeds.js` si aplica.
- [ ] **Seguridad de Archivos:** No se exponen URLs públicas para documentación médica o de menores; se utiliza `obtenerUrlFirmada` con tiempo de expiración.
- [ ] **Secretos:** No se introdujeron contraseñas, tokens o llaves en plano (verificado con `secretlint`).
- [ ] **Compilación:** `npm run build` o `npx tsc --noEmit` ejecuta sin errores de tipos.
- [ ] **Calidad de Código:** `npm run lint` y `npx prettier --check` pasan sin advertencias.
- [ ] **Mensaje de Commit:** Cumple con el formato Conventional Commits en español (ej. `feat(modulo): descripción en español`).
