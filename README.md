# Backend — TuPoli API

API REST construida con **NestJS**, **Prisma** y **MySQL** para la gestión del polideportivo TuPoli.

---

<<<<<<< HEAD
## Requisitos previos

=======
## 📖 Documentación de la API (Swagger)

Toda la especificación e interacción con los endpoints del backend se encuentra documentada y centralizada a través de **Swagger UI**.

- **URL Swagger UI:** [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)
- **Prefijo Global de la API:** `/api/v1`

> [!TIP]
> Los desarrolladores de Frontend pueden ingresar directamente a Swagger UI para:
> - Inspeccionar los endpoints disponibles agrupados por módulo.
> - Ver los esquemas de Request (Body, Parámetros) y Response con sus tipos y validaciones.
> - Ejecutar peticiones en tiempo real utilizando la opción **"Try it out"**.

---

## 🚀 Requisitos Previos
>>>>>>> test
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) y Docker Compose

---

## Puesta en marcha — Desarrollo

### 1. Clonar y configurar variables de entorno

> **Arquitectura local:** la base de datos corre en un contenedor Docker y la API NestJS se ejecuta directamente en tu máquina con `npm run start:dev`.

### 1. Variables de Entorno
Copia el archivo de ejemplo y ajustá los valores si es necesario:
```bash
cp .env.example .env
```

Asegurate de que `DATABASE_URL` apunte a `localhost` con el puerto mapeado del contenedor:
```env
DATABASE_URL="mysql://tupoli_user:tupoli_password@localhost:33306/tupoli_db"
```

### 2. Levantar la Base de Datos con Docker
```bash
docker compose -f docker-compose-prod.yaml up -d
```
> Esto levanta solo el contenedor de MySQL. La API **no** corre en Docker.

### 3. Instalar dependencias
```bash
npm install
```

### 4. Aplicar migraciones (crear tablas)
```bash
npm run prisma:migrate:deploy
```
> Ejecuta las migraciones pendientes y crea todas las tablas en la base de datos.

### 5. Cargar datos iniciales (seed)
```bash
npm run prisma:seed
```

### 6. Levantar la API
```bash
npm run start:dev
```

Una vez levantado el servidor:
- **API Base:** `http://localhost:3000/api/v1`
- **Swagger Docs:** `http://localhost:3000/api/v1/docs`

---

## 🧪 Pruebas Rápidas de API (Scripts)
Se incluye un script para verificar el correcto funcionamiento del CRUD de categorías:
```bash
./scripts/test-categoria-item.sh
```

Al arrancar, el contenedor de la API aplica automáticamente las migraciones pendientes (`prisma migrate deploy`) antes de iniciar NestJS. No es necesario correr nada manualmente.

> Asegurate de tener un `.env` con valores de producción antes de ejecutar este comando.

---

## 📦 Levantar el stack para pruebas (Frontend ↔ API)

Este es el flujo recomendado para que los devs de Frontend levanten la API junto a la base de datos usando Docker Compose, **evitando cache, código viejo y conflictos de contenedores**.

### Pasos

**1. Bajar todo lo que esté corriendo (limpieza completa):**
```bash
sudo docker compose -f docker-compose-prod.yaml down --volumes --remove-orphans
```
> Esto elimina los contenedores, la red y el **volumen de MySQL** (datos incluidos). La próxima vez que levante, el seed corre desde cero.

**2. Reconstruir la imagen y levantar:**
```bash
sudo docker compose -f docker-compose-prod.yaml up --build --force-recreate -d
```

| Flag | Qué hace |
|---|---|
| `--build` | Reconstruye la imagen del API desde el `Dockerfile` (sin usar cache de imagen anterior) |
| `--force-recreate` | Recrea los contenedores aunque la config no haya cambiado |
| `-d` | Corre en background |

**3. Verificar que todo esté `Up`:**
```bash
sudo docker compose -f docker-compose-prod.yaml ps
```

**4. Ver los logs del API (opcional, para confirmar que el seed corrió):**
```bash
sudo docker logs tupoli_api
```

### URLs disponibles
Una vez levantado:
- **API Base:** `http://localhost:3000/api/v1`
- **Swagger Docs:** `http://localhost:3000/api/v1/docs`

### Bajar el stack al terminar
```bash
sudo docker compose -f docker-compose-prod.yaml down
```
> Sin `--volumes` conserva los datos de MySQL para la próxima sesión.

---

## 📂 Guía de SCM y Convenciones
Por favor revisa [SCM_BACKEND.md](docs/SCM_BACKEND.md) para conocer las pautas de commits, nombres de archivos y estructura.
