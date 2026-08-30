# Guía SCM y Convenciones - Backend (TuPoli)

Este documento establece las directrices de control de versiones, estructura y nombrado para el desarrollo backend.

---

## 1. Convención de Commits (Conventional Commits)
Formato: `<tipo>(<módulo/ámbito>): <descripción corta>`

### Tipos:
- `feat`: Nueva funcionalidad / endpoint.
- `fix`: Corrección de un bug / error en lógica o API.
- `docs`: Documentación (Swagger, README, etc.).
- `refactor`: Refactorización de servicios, controladores o queries.
- `test`: Unit tests o E2E.
- `chore`: Configuración, Docker, dependencias, migraciones Prisma.

**Ejemplos:**
- `feat(auth): implement jwt token generation`
- `fix(inventory): fix stock validation query`
- `chore(prisma): initialize base schema`

---

## 2. Estrategia de Ramas
- `main`: Rama de producción / despliegue estable.
- **Ramas de trabajo:**
  - `feat/<nombre-de-la-funcionalidad>` (ej: `feat/jwt-auth`)
  - `fix/<nombre-del-bug>` (ej: `fix/cors-headers`)
  - `chore/<tarea>` (ej: `chore/setup-docker`)

---

## 3. Convenciones de Nombrado de Archivos y Carpetas (NestJS)
Seguir el estándar oficial de NestJS con `kebab-case`:

- **Módulos**: `*.module.ts` (ej: `auth.module.ts`)
- **Controladores**: `*.controller.ts` (ej: `activities.controller.ts`)
- **Servicios**: `*.service.ts` (ej: `activities.service.ts`)
- **DTOs (Data Transfer Objects)**: `*.dto.ts` (ej: `create-activity.dto.ts`, `update-activity.dto.ts`)
- **Entidades / Interfaces**: `*.entity.ts` o `*.interface.ts`
- **Guards / Interceptors / Pipes**: `*.guard.ts`, `*.interceptor.ts`, `*.pipe.ts`
- **Carpetas de módulos**: En plural o singular coherente dentro de `src/modules/` (ej: `src/modules/auth/`, `src/modules/activities/`).

---

## 4. Convenciones de Código TypeScript
- **Clases**: `PascalCase` (ej: `ActivitiesController`, `AuthService`)
- **Métodos y Variables**: `camelCase` (ej: `getActivityById`, `userId`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `DEFAULT_PAGE_SIZE`)
- **Interfaces / Tipos**: `PascalCase` (ej: `JwtPayload`)
