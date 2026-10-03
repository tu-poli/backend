# API TuPoli - Contrato de Endpoints (Sprint 1)

**Base URL:** `/api/v1`  
**Autenticación:** JWT (Bearer Token requerido en cabecera `Authorization: Bearer <token>`)

---

## Resumen de Endpoints

### Autenticación
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Iniciar sesión y obtener token JWT |

### Categorías de Inventario
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/inventario/categorias` | Listar categorías (filtro opcional por nombre) |
| `POST` | `/inventario/categorias` | Registrar una nueva categoría |
| `PUT` | `/inventario/categorias/:id` | Actualizar nombre de una categoría |
| `DELETE` | `/inventario/categorias/:id` | Eliminar una categoría |

### Items de Inventario
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/inventario/items` | Listar items con categoría anidada (filtros opcionales) |
| `POST` | `/inventario/items` | Registrar un nuevo ítem en inventario |
| `PUT` | `/inventario/items/:id` | Actualizar datos o cantidad de un ítem |
| `DELETE` | `/inventario/items/:id` | Eliminar un ítem de inventario |

### Actividades
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/actividades` | Listar actividades programadas (filtros por profesor, tipo o fechas) |
| `POST` | `/actividades` | Programar una nueva actividad |
| `PUT` | `/actividades/:id` | Modificar datos de una actividad |
| `DELETE` | `/actividades/:id` | Cancelar/eliminar una actividad |

### Usuarios y Roles
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/usuarios` | Listar cuentas de usuarios (filtro por rol o email) |
| `POST` | `/usuarios` | Crear un nuevo usuario |
| `PUT` | `/usuarios/:id` | Actualizar rol o email de un usuario |

---

## Detalle de Endpoints y Ejemplos

### 1. Autenticación

#### `POST /auth/login`
- **Body:**
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

### 2. Inventario - Categorías

#### `GET /inventario/categorias`
- **Query Params:** `?nombre=Depor` *(opcional)*
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "nombre": "Deportes"
    }
  ]
  ```

#### `POST /inventario/categorias`
- **Body:**
  ```json
  {
    "nombre": "Alimentos"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 2,
    "nombre": "Alimentos"
  }
  ```

#### `PUT /inventario/categorias/:id`
- **Body:**
  ```json
  {
    "nombre": "Deportes de Contacto"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "nombre": "Deportes de Contacto"
  }
  ```

#### `DELETE /inventario/categorias/:id`
- **Response:** `200 OK` o `204 No Content`

---

### 3. Inventario - Items

#### `GET /inventario/items`
- **Query Params:** `?elemento=Pelota&categoriaId=1` *(opcionales)*
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

#### `POST /inventario/items`
- **Body:**
  ```json
  {
    "elemento": "Pelota de Básquet",
    "categoriaId": 1,
    "cantidad": 10
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "elemento": "Pelota de Básquet",
    "categoriaId": 1,
    "cantidad": 10
  }
  ```

#### `PUT /inventario/items/:id`
- **Body:**
  ```json
  {
    "elemento": "Pelota de Básquet Oficial",
    "categoriaId": 1,
    "cantidad": 15
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "elemento": "Pelota de Básquet Oficial",
    "categoriaId": 1,
    "categoria": {
      "id": 1,
      "nombre": "Deportes"
    },
    "cantidad": 15
  }
  ```

#### `DELETE /inventario/items/:id`
- **Response:** `200 OK` o `204 No Content`

---

### 4. Actividades

#### `GET /actividades`
- **Query Params:** `?profesorId=2&categoriaActividad=Clase&fechaDesde=2024-03-01T00:00:00Z` *(opcionales)*
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

#### `POST /actividades`
- **Body:**
  ```json
  {
    "horario": "2024-03-15T16:00:00Z",
    "profesorId": 2,
    "categoriaActividad": "Clase",
    "espacioNecesario": "Cancha Principal"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "horario": "2024-03-15T16:00:00Z",
    "profesorId": 2,
    "categoriaActividad": "Clase",
    "espacioNecesario": "Cancha Principal"
  }
  ```

#### `PUT /actividades/:id`
- **Body:**
  ```json
  {
    "horario": "2024-03-15T18:00:00Z",
    "profesorId": 2,
    "categoriaActividad": "Clase",
    "espacioNecesario": "Gimnasio 2"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "horario": "2024-03-15T18:00:00Z",
    "profesorId": 2,
    "profesor": {
      "id": 2,
      "email": "profesor@tupoli.com"
    },
    "categoriaActividad": "Clase",
    "espacioNecesario": "Gimnasio 2"
  }
  ```

#### `DELETE /actividades/:id`
- **Response:** `200 OK` o `204 No Content`

---

### 5. Usuarios y Roles

#### `GET /usuarios`
- **Query Params:** `?rol=PROFESOR` *(opcional)*
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

#### `POST /usuarios`
- **Body:**
  ```json
  {
    "email": "nuevo@tupoli.com",
    "password": "password123",
    "rol": "PROFESOR"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 3,
    "email": "nuevo@tupoli.com",
    "rol": "PROFESOR"
  }
  ```

#### `PUT /usuarios/:id`
- **Body:**
  ```json
  {
    "email": "actualizado@tupoli.com",
    "rol": "ADMIN"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 2,
    "email": "actualizado@tupoli.com",
    "rol": "ADMIN"
  }
  ```

---

## 6. Convención de Errores y Códigos de Estado

Todos los endpoints siguen la estructura estándar de error provista por NestJS:

```json
{
  "statusCode": 400,
  "message": ["El campo cantidad no puede ser negativo"],
  "error": "Bad Request"
}
```

### Códigos de Estado Principales:

| Código | Estado | Significado / Caso de Uso |
| :--- | :--- | :--- |
| **`200`** | `OK` | Petición exitosa con retorno de datos (`GET`, `PUT`). |
| **`201`** | `Created` | Recurso creado exitosamente (`POST`). |
| **`204`** | `No Content` | Petición exitosa sin contenido en la respuesta (`DELETE`). |
| **`400`** | `Bad Request` | Datos de entrada inválidos o faltantes (fallo en validación DTO). |
| **`401`** | `Unauthorized` | Token JWT ausente, expirado o credenciales incorrectas. |
| **`403`** | `Forbidden` | Usuario autenticado sin permisos de rol suficientes. |
| **`404`** | `Not Found` | Recurso no encontrado (ID inexistente). |
| **`409`** | `Conflict` | Clave única duplicada (email/categoría) o restricción de integridad. |
| **`500`** | `Internal Server Error` | Excepción no controlada o fallo con la base de datos. |
