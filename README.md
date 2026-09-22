# Backend - TuPoli API

API REST construida con NestJS, Prisma y MySQL para la gestión del polideportivo TuPoli.

---

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
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) y Docker Compose

---

## 🛠️ Puesta en marcha en Desarrollo

### 1. Variables de Entorno
Copia el archivo de ejemplo en la raíz del proyecto o en esta carpeta:
```bash
cp ../.env.example ../.env
```

### 2. Levantar la Base de Datos con Docker
Desde la raíz del proyecto:
```bash
docker compose -f docker-compose-dev.yaml up -d
```

### 3. Instalar dependencias y levantar API
```bash
npm install
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

---

## 📦 Producción con Docker Compose
Para levantar todo el stack empaquetado (DB + API):
```bash
docker compose -f docker-compose-prod.yaml up -d --build
```

---

## 📂 Guía de SCM y Convenciones
Por favor revisa [SCM_BACKEND.md](docs/SCM_BACKEND.md) para conocer las pautas de commits, nombres de archivos y estructura.
