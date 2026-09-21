# Guía SCM y Convenciones - Backend (TuPoli)

Este documento establece las directrices de control de versiones, estructura y nombrado para el desarrollo backend.

---

## 1. Regla General de Idioma
**Todo el desarrollo, nombrado de variables, commits, ramas y comentarios debe realizarse estrictamente en ESPAÑOL.** Esta es una convención de equipo para mantener consistencia absoluta en el repositorio.

---

## 2. Convención de Commits (Conventional Commits)
Formato: `<tipo>(<módulo/ámbito>): <descripción corta>`

### Tipos:
- `feat`: Nueva funcionalidad / endpoint.
- `fix`: Corrección de un bug / error en lógica o API.
- `docs`: Documentación (Swagger, README, etc.).
- `refactor`: Refactorización de servicios, controladores o queries.
- `test`: Unit tests o E2E.
- `chore`: Configuración, Docker, dependencias, migraciones Prisma.

**Ejemplos:**
- `feat(autenticacion): implementar generacion de token jwt`
- `fix(inventario): corregir consulta de validacion de stock`
- `chore(prisma): inicializar esquema base`

---

## 3. Estrategia de Ramas
- `main`: Rama de producción / despliegue estable.
- **Ramas de trabajo:**
  - `feat/<nombre-de-la-funcionalidad>` (ej: `feat/autenticacion-jwt`)
  - `fix/<nombre-del-bug>` (ej: `fix/cabeceras-cors`)
  - `chore/<tarea>` (ej: `chore/configuracion-docker`)

---

## 4. Convenciones de Nombrado de Archivos y Carpetas (NestJS)
Seguir el estándar oficial de NestJS con `kebab-case`:

- **Módulos**: `*.module.ts` (ej: `autenticacion.module.ts`)
- **Controladores**: `*.controller.ts` (ej: `actividades.controller.ts`)
- **Servicios**: `*.service.ts` (ej: `actividades.service.ts`)
- **DTOs (Data Transfer Objects)**: `*.dto.ts` (ej: `crear-actividad.dto.ts`, `actualizar-actividad.dto.ts`)
- **Entidades / Interfaces**: `*.entity.ts` o `*.interface.ts`
- **Guards / Interceptors / Pipes**: `*.guard.ts`, `*.interceptor.ts`, `*.pipe.ts`
- **Carpetas de módulos**: En plural o singular coherente dentro de `src/modules/` (ej: `src/modules/autenticacion/`, `src/modules/actividades/`).

---

## 5. Convenciones de Código TypeScript
- **Clases**: `PascalCase` (ej: `ActividadesController`, `AutenticacionService`)
- **Métodos y Variables**: `camelCase` (ej: `obtenerActividadPorId`, `usuarioId`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `TAMAÑO_PAGINA_DEFECTO`)
- **Interfaces / Tipos**: `PascalCase` (ej: `CargaJwt`)

---

## 6. Estructura de Carpetas Propuesta

Se propone una estructura modular y orientada al dominio (Domain-Driven Design básico) para mantener la escalabilidad, usando las características de NestJS y las herramientas definidas:




































