# Backend — TuPoli API

API REST construida con **NestJS**, **Prisma** y **MySQL** para la gestión del polideportivo TuPoli.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) y Docker Compose

---

## Puesta en marcha — Desarrollo

### 1. Clonar y configurar variables de entorno

```bash
cp .env.example .env
```

Editá el `.env` y completá los valores. Lo más importante es `DATABASE_URL`, que debe ser un valor **literal completo** (el archivo `.env` no expande variables):

```env
DATABASE_URL="mysql://tupoli_user:tupoli_password@localhost:3306/tupoli_db"
```

> Si cambiás el puerto de MySQL en `docker-compose-dev.yaml`, actualizá el puerto en `DATABASE_URL` también.

---

### 2. Levantar la base de datos con Docker

```bash
docker compose -f docker-compose-dev.yaml up -d
```

Esto levanta un contenedor MySQL en el puerto definido en `.env` (`DB_PORT`, por defecto `3306`).
Al crearse por primera vez, ejecuta automáticamente `docker/mysql-init/01-grants.sql` que otorga los permisos necesarios al usuario.

---

### 3. Instalar dependencias

```bash
npm install
```

---

### 4. Aplicar migraciones de base de datos

```bash
npm run prisma:migrate
```

Esto sincroniza las tablas de la DB con el schema definido en `prisma/schema.prisma`.
Solo necesitás correrlo la primera vez o cuando el schema cambie.

---

### 5. (Opcional) Cargar datos de prueba

```bash
npm run prisma:seed
```

Inserta datos iniciales: roles, espacios, actividades, usuarios de ejemplo, reservas e ítems de inventario.
El seed es idempotente — puede ejecutarse múltiples veces sin errores.

---

### 6. Iniciar la API

```bash
npm run start:dev
```

La API queda disponible con hot-reload en:

| Recurso | URL |
|---|---|
| API base | `http://localhost:3000` |
| Swagger docs | _(próximamente)_ |

---

## Producción con Docker Compose

Levanta el stack completo (MySQL + API) en un solo comando:

```bash
docker compose -f docker-compose-prod.yaml up -d --build
```

Al arrancar, el contenedor de la API aplica automáticamente las migraciones pendientes (`prisma migrate deploy`) antes de iniciar NestJS. No es necesario correr nada manualmente.

> Asegurate de tener un `.env` con valores de producción antes de ejecutar este comando.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start:dev` | Inicia la API con hot-reload |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm run start:prod` | Inicia la API desde `dist/` (sin hot-reload) |
| `npm run prisma:migrate` | Genera y aplica migraciones (desarrollo) |
| `npm run prisma:migrate:deploy` | Aplica migraciones existentes (producción/CI) |
| `npm run prisma:seed` | Carga datos de prueba |
| `npm run prisma:generate` | Regenera el cliente de Prisma |
| `npm run prisma:studio` | Abre Prisma Studio (UI para la DB) |
| `npm run lint` | Corre el linter |
| `npm run test` | Corre los tests unitarios |

---

## Estructura del proyecto

```
backend/
├── docker/
│   └── mysql-init/       # Scripts SQL que se ejecutan al crear el contenedor
├── prisma/
│   ├── schema.prisma     # Definición de modelos y conexión a la DB
│   ├── migrations/       # Historial de migraciones generadas por Prisma
│   └── seeds.js          # Script de datos iniciales
├── src/
│   ├── modules/          # Módulos de la aplicación (uno por entidad/feature)
│   ├── prisma/           # Módulo y servicio compartido de Prisma
│   ├── app.module.ts
│   └── main.ts
├── docker-compose-dev.yaml   # Solo DB (para desarrollo local)
├── docker-compose-prod.yaml  # DB + API (para producción)
├── Dockerfile
└── .env.example
```
