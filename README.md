# Backend - TuPoli API

API REST construida con NestJS, Prisma y MariaDB para la gestión del polideportivo TuPoli.

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

La API estará disponible en:
- **API Base:** `http://localhost:3000/api`
- **Swagger Docs:** `http://localhost:3000/api/docs`

---

## 📦 Producción con Docker Compose
Para levantar todo el stack empaquetado (DB + API):
```bash
docker compose -f docker-compose-prod.yaml up -d --build
```

---

## 📂 Guía de SCM y Convenciones
Por favor revisa [SCM_BACKEND.md](../SCM_BACKEND.md) para conocer las pautas de commits, nombres de archivos y estructura.
