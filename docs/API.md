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

### Menores y Documentación Médica
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/menores` | Listar menores a cargo del tutor autenticado |
| `POST` | `/menores` | Registrar un menor a cargo de un tutor |
| `GET` | `/menores/:id` | Obtener detalle de un menor |
| `POST` | `/menores/:id/documentacion` | Subir ficha médica o CUD (`multipart/form-data`) |
| `GET` | `/menores/:id/documentacion/:tipo/url` | Obtener URL firmada temporal para ver/descargar documento |

### Inscripciones y Autorizaciones
| MÉTODO | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/inscripciones/reserva/:idReserva` | Listar inscripciones de una reserva con estado de autorización |
| `POST` | `/inscripciones` | Inscribir un menor a una reserva (con validación de autorización si la actividad lo requiere) |
| `GET` | `/inscripciones/:id/autorizacion/url` | Obtener URL firmada temporal de la autorización del menor |
| `DELETE` | `/inscripciones/:id` | Cancelar inscripción |

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
      "id_categoria": 1,
      "nombre": "Deportes",
      "color": "#10B981",
      "icono": "trophy"
    }
  ]
  ```

#### `POST /inventario/categorias`
- **Body:**
  ```json
  {
    "nombre": "Alimentos",
    "color": "#F59E0B",
    "icono": "utensils"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id_categoria": 2,
    "nombre": "Alimentos",
    "color": "#F59E0B",
    "icono": "utensils"
  }
  ```

#### `PUT /inventario/categorias/:id` o `PATCH /inventario/categorias/:id`
- **Body:**
  ```json
  {
    "nombre": "Deportes de Contacto",
    "color": "#059669",
    "icono": "shield"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id_categoria": 1,
    "nombre": "Deportes de Contacto",
    "color": "#059669",
    "icono": "shield"
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
        "nombre": "Deportes",
        "color": "#10B981",
        "icono": "trophy"
      },
      "cantidad": 10,
      "lote": "LOTE-2024/01#DEP",
      "stockMinimo": 5
    }
  ]
  ```

#### `POST /inventario/items`
- **Body:**
  ```json
  {
    "elemento": "Pelota de Básquet",
    "categoriaId": 1,
    "cantidad": 10,
    "lote": "LOTE-2024/01#DEP",
    "stockMinimo": 5
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": 1,
    "elemento": "Pelota de Básquet",
    "categoriaId": 1,
    "cantidad": 10,
    "lote": "LOTE-2024/01#DEP",
    "stockMinimo": 5
  }
  ```

#### `PUT /inventario/items/:id` o `PATCH /inventario/items/:id`
- **Body:**
  ```json
  {
    "elemento": "Pelota de Básquet Oficial",
    "categoriaId": 1,
    "cantidad": 15,
    "lote": "LOTE-2024/02#DEP",
    "stockMinimo": 8
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
      "nombre": "Deportes",
      "color": "#10B981",
      "icono": "trophy"
    },
    "cantidad": 15,
    "lote": "LOTE-2024/02#DEP",
    "stockMinimo": 8
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

### 6. Menores y Documentación Médica

#### `GET /menores`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Devuelve la lista de menores a cargo del tutor autenticado (o todos si el rol es `ADMIN`).
- **Response (200 OK):**
  ```json
  [
    {
      "id_menor": 1,
      "id_tutor": 5,
      "nombre": "Lucas",
      "apellido": "Gómez",
      "tipo_doc": "DNI",
      "num_doc": "55112233",
      "fecha_nacimiento": "2015-05-12T00:00:00.000Z",
      "tieneFichaMedica": true,
      "tieneCud": false
    }
  ]
  ```

#### `POST /menores`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "nombre": "Lucas",
    "apellido": "Gómez",
    "tipo_doc": "DNI",
    "num_doc": "55112233",
    "fecha_nacimiento": "2015-05-12"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id_menor": 1,
    "id_tutor": 5,
    "nombre": "Lucas",
    "apellido": "Gómez",
    "tipo_doc": "DNI",
    "num_doc": "55112233",
    "fecha_nacimiento": "2015-05-12T00:00:00.000Z",
    "ficha_medica_url": null,
    "cud_url": null
  }
  ```

#### `POST /menores/:id/documentacion`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Parámetros:**
  - `id`: ID del menor
- **Body (form-data):**
  - `tipo`: `"ficha_medica"` o `"cud"`
  - `archivo`: Archivo binario (PDF, PNG, JPEG, máx. 5MB)
- **Seguridad:** El bucket de Supabase es privado. Se almacena la ruta relativa en MySQL y no una URL pública.
- **Response (201 Created):**
  ```json
  {
    "mensaje": "Documentación cargada exitosamente",
    "tipo": "ficha_medica",
    "ruta": "fichas/menor_1_a83f9c.pdf"
  }
  ```

#### `GET /menores/:id/documentacion/:tipo/url`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Genera un enlace firmado temporal (Signed URL) para previsualizar o descargar el documento médico privado.
- **Seguridad (Control de acceso / Prevención IDOR):** Solo accesible para el tutor a cargo del menor, directivos o rol médico/coordinador.
- **Response (200 OK):**
  ```json
  {
    "urlFirmada": "https://xwfjhrpwlzkespelyxwr.supabase.co/storage/v1/object/sign/documentacion_medica/fichas/menor_1_a83f9c.pdf?token=eyJhbGciOi...",
    "expiraEnSegundos": 900
  }
  ```

---

### 7. Inscripciones y Autorizaciones (Actividades Extraordinarias)

#### `POST /inscripciones`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Inscribe a un menor a una reserva horaria de una actividad.
- **Regla de negocio:** Si la actividad asociada a la reserva tiene `requiere_autorizacion: true` (ej. Excursión), el payload debe incluir `autorizacion_url` (ruta del archivo en bucket de autorizaciones) o el menor debe tener autorización adjuntada.
- **Body:**
  ```json
  {
    "id_reserva": 3,
    "id_menor": 1,
    "autorizacion_url": "autorizaciones/reserva_3/menor_1_aut.pdf"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id_inscripcion": 10,
    "id_reserva": 3,
    "id_menor": 1,
    "autorizacion_url": "autorizaciones/reserva_3/menor_1_aut.pdf",
    "fecha_hora_inscripcion": "2026-10-20T14:30:00.000Z",
    "id_estado_inscripcion": 1
  }
  ```

#### `GET /inscripciones/reserva/:idReserva`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Permite al profesor o coordinador visualizar todos los menores inscriptos a una reserva y el estado de sus autorizaciones y fichas médicas.
- **Response (200 OK):**
  ```json
  [
    {
      "id_inscripcion": 10,
      "id_menor": 1,
      "nombre": "Lucas",
      "apellido": "Gómez",
      "tutor": {
        "id": 5,
        "nombre": "Carlos Gómez",
        "telefono": "3511234567"
      },
      "requiereAutorizacion": true,
      "autorizacionPresentada": true,
      "fichaMedicaPresentada": true,
      "estado": "CONFIRMADA"
    }
  ]
  ```

#### `GET /inscripciones/:id/autorizacion/url`
- **Headers:** `Authorization: Bearer <token>`
- **Descripción:** Genera una URL firmada temporal de la autorización para que el profesor o directivo pueda verificar la firma del tutor previo a la excursión.
- **Response (200 OK):**
  ```json
  {
    "urlFirmada": "https://xwfjhrpwlzkespelyxwr.supabase.co/storage/v1/object/sign/autorizaciones/reserva_3/menor_1_aut.pdf?token=eyJ...",
    "expiraEnSegundos": 900
  }
  ```

---

## 8. Convención de Errores y Códigos de Estado

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
