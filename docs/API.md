# API TuPoli - Contrato de Endpoints (Sprint 1)

**Base URL:** `/api/v1`
**Autenticación:** JWT (Bearer Token requerido en cabecera `Authorization: Bearer <token>`)

---

## 1. Autenticación

### `POST /auth/login`
Autentica a un usuario en el sistema.
- **Body Request:**
  ```json
  {
    "email": "admin@tupoli.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
    "usuario": {
      "id": 1,
      "email": "admin@tupoli.com",
      "rol": "ADMIN"
    }
  }
  ```

---

## 2. Inventario - Categorías

### `GET /inventario/categorias`
Listado paginado/completo de categorías.
- **Query Params (Filtros Opcionales):**
  - `nombre` (string): Búsqueda por coincidencia parcial (ej. `?nombre=Depor`).
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "nombre": "Deportes",
      "descripcion": "Elementos deportivos del polideportivo"
    }
  ]
  ```

### `POST /inventario/categorias`
Crea una nueva categoría.
- **Body Request:**
  ```json
  {
    "nombre": "Alimentos",
    "descripcion": "Insumos para viandas y meriendas"
  }
  ```
- **Response (201 Created):** Retorna la categoría creada con su `id`.

### `PUT /inventario/categorias/:id`
Actualiza una categoría existente.
- **Body Request:** (Campos parciales o totales a actualizar)

### `DELETE /inventario/categorias/:id`
Elimina una categoría del sistema.
- **Response (200 OK o 204 No Content)**

---

## 3. Inventario - Items

### `GET /inventario/items`
Listado de los items de inventario. Útil para rellenar tablas en el frontend.
- **Query Params (Filtros Opcionales):**
  - `elemento` (string): Búsqueda parcial por el nombre del elemento.
  - `categoriaId` (number): Trae todos los items pertenecientes a una categoría (ej. `?categoriaId=1`).
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "elemento": "Pelota de Básquet",
      "categoriaId": 1,
      "categoria": {
        "id": 1,
        "nombre": "Deportes"
      },
      "cantidad": 10
    }
  ]
  ```

### `POST /inventario/items`
- **Body Request:**
  ```json
  {
    "elemento": "Pelota de Básquet",
    "categoriaId": 1,
    "cantidad": 10
  }
  ```
- **Response (201 Created)**

### `PUT /inventario/items/:id`
- **Body Request:** Permite actualizar `elemento`, `categoriaId`, o sumar/restar `cantidad`.

### `DELETE /inventario/items/:id`

---

## 4. Actividades

### `GET /actividades`
Listado de actividades programadas en el polideportivo.
- **Query Params (Filtros Opcionales):**
  - `profesorId` (number): Ver actividades vinculadas a un profesor.
  - `categoriaActividad` (string): Filtrar por tipo (ej. "clase", "feria", "deporte").
  - `fechaDesde` / `fechaHasta` (ISO 8601): Para filtrar por rangos de fechas de las actividades.
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "horario": "2024-03-15T16:00:00Z",
      "profesorId": 2,
      "profesor": {
        "id": 2,
        "email": "profesor@tupoli.com"
      },
      "categoriaActividad": "Clase",
      "espacioNecesario": "Cancha Principal"
    }
  ]
  ```

### `POST /actividades`
- **Body Request:**
  ```json
  {
    "horario": "2024-03-15T16:00:00Z",
    "profesorId": 2,
    "categoriaActividad": "Clase",
    "espacioNecesario": "Cancha Principal"
  }
  ```

### `PUT /actividades/:id`

### `DELETE /actividades/:id`

---

## 5. Usuarios y Roles (Gestión de Administradores)

### `GET /usuarios`
Listado de cuentas (necesario para cuando el frontend pida la lista de profesores al crear una actividad).
- **Query Params (Filtros Opcionales):**
  - `rol` (string): Para obtener solo a los profesores (ej. `?rol=PROFESOR`).
  - `email` (string): Búsqueda por correo.
- **Response (200 OK):**
  ```json
  [
    {
      "id": 2,
      "email": "profesor@tupoli.com",
      "rol": "PROFESOR"
    }
  ]
  ```

### `POST /usuarios`
Crear un nuevo usuario desde el panel.
- **Body Request:**
  ```json
  {
    "email": "nuevo@tupoli.com",
    "password": "password123",
    "rol": "PROFESOR"
  }
  ```
