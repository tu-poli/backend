# Guía de Despliegue de la API (Vercel + Supabase)

Guía rápida paso a paso para desplegar el backend NestJS en **Vercel** conectado a la base de datos PostgreSQL y buckets de **Supabase Storage**.

---

## ⚡ Lo Esencial en 1 Minuto

| Concepto                       | Qué significa para este deploy                                                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vercel = Serverless**        | La API no corre 24/7 en un servidor fijo; se despierta con cada petición. Si pasa tiempo sin recibir tráfico, la primera petición puede tardar 1-2 segundos (**Cold Start**). |
| **Supabase Connection Pooler** | **Obligatorio**. Como Vercel crea múltiples instancias, debes usar el puerto `6543` (`?pgbouncer=true`) para `DATABASE_URL` para no agotar las conexiones de PostgreSQL.      |
| **Migraciones Prisma**         | Se ejecutan **desde tu terminal local** apuntando a la conexión directa (puerto `5432`), **antes** del deploy en Vercel.                                                      |
| **Buckets de Storage**         | Deben crearse como **Privados**. La API genera URLs firmadas temporales seguras.                                                                                              |

---

## 🛠️ Paso 1: Configuración en Supabase (Navegador)

Entra a tu proyecto en [supabase.com/dashboard](https://supabase.com/dashboard):

### 1.1 Obtener URLs de Base de Datos

Ve a **Project Settings** (ícono de engranaje) ➔ **Database**:

1. Busca la sección **Connection string** ➔ Pestaña **URI**.
2. **Connection Pooling (Modo Transaccional - Puerto 6543):**
   - Copia la URI. Reemplaza `[YOUR-PASSWORD]` por la contraseña de tu base de datos.
   - Asegúrate de que termine con `?pgbouncer=true`.
   - _Esta será tu `DATABASE_URL` en Vercel._
3. **Direct Connection (Modo Sesión - Puerto 5432):**
   - Cambia el modo a **Session** o copia la cadena directa con puerto `5432`.
   - _Esta será tu `DIRECT_URL` para ejecutar migraciones._

### 1.2 Obtener Claves de API

Ve a **Project Settings** ➔ **API**:

- **Project URL:** Tu URL base (`https://xxxx.supabase.co`).
- **Project API Keys:**
  - `anon` / `public`: Tu `SUPABASE_PUBLISHABLE_KEY`.
  - `service_role` (Secret): Tu `SUPABASE_SECRET_KEY` _(⚠️ Clave privada del servidor; nunca la expongas en frontend ni en repositorios públicos)_.

### 1.3 Crear Buckets de Almacenamiento

Ve al menú **Storage** ➔ **New bucket**:

1. Crear bucket `documentacion_medica`:
   - **Public bucket:** ❌ Desactivado (debe ser privado).
2. Crear bucket `autorizaciones`:
   - **Public bucket:** ❌ Desactivado (debe ser privado).

---

## 💻 Paso 2: Ejecutar Migraciones (Terminal Local)

Antes de levantar la API en Vercel, la base de datos de Supabase debe tener todas las tablas creadas:

```bash
# 1. Aplicar todas las migraciones SQL a Supabase (usando la conexión directa puerto 5432)
export DIRECT_URL="<tu-cadena-direct-connection-puerto-5432>"
npx prisma migrate deploy

# 2. (Opcional) Poblar la base con datos semilla iniciales (usando conexión pooler puerto 6543)
export DATABASE_URL="<tu-cadena-transaction-pooler-puerto-6543>"
npm run prisma:seed
```

---

## 🌐 Paso 3: Configuración y Deploy en Vercel (Navegador)

### 3.1 Subir Cambios a GitHub

Asegúrate de que tu rama esté actualizada y enviada al repositorio remoto:

```bash
git push origin <tu-rama>
```

### 3.2 Crear Proyecto en Vercel

1. Inicia sesión en [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. En el Dashboard, presiona el botón **Add New...** ➔ **Project**.
3. Busca el repositorio `backend` (o `tu-poli/backend`) y haz clic en **Import**.

### 3.3 Configuración de Compilación (Build & Output Settings)

Vercel detecta automáticamente el framework NestJS:

- **Framework Preset:** `NestJS`
- **Root Directory:** `./` _(dejar por defecto)_
- **Build Command:** `prisma generate && nest build` _(o dejar el predeterminado `npm run build`)_
- **Output Directory:** `dist`

### 3.4 Cargar Variables de Entorno (Environment Variables)

En la sección **Environment Variables**, añade cada una de las siguientes variables para los entornos **Production**, **Preview** y **Development**:

| Variable                               | Valor                                                          |
| -------------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                         | URI de Supabase con Pooler (puerto `6543` y `?pgbouncer=true`) |
| `DIRECT_URL`                           | URI de Supabase directa (puerto `5432`)                        |
| `NODE_ENV`                             | `production`                                                   |
| `JWT_SECRET`                           | Tu clave secreta para firmar tokens JWT                        |
| `JWT_EXPIRES_IN`                       | `1d`                                                           |
| `SUPABASE_URL`                         | `https://<tu-proyecto>.supabase.co`                            |
| `SUPABASE_PUBLISHABLE_KEY`             | Tu anon/public key de Supabase                                 |
| `SUPABASE_SECRET_KEY`                  | Tu service_role key de Supabase                                |
| `SUPABASE_BUCKET_DOCUMENTACION_MEDICA` | `documentacion_medica`                                         |
| `SUPABASE_BUCKET_AUTORIZACIONES`       | `autorizaciones`                                               |

### 3.5 Desplegar

Haz clic en **Deploy**. Vercel compilará la aplicación y generará la URL pública (ej. `https://tupoli-backend.vercel.app`).

---

## 🔍 Paso 4: Verificación Post-Deploy

Prueba los siguientes endpoints en tu navegador o cliente HTTP:

1. **Healthcheck:**

   ```text
   GET https://<tu-dominio-vercel>.vercel.app/api/v1/health
   ```

   _Respuesta esperada:_ `200 OK` con estado de la aplicación.

2. **Documentación Swagger:**
   ```text
   GET https://<tu-dominio-vercel>.vercel.app/api/v1/docs
   ```
   _Respuesta esperada:_ Interfaz web interactiva de Swagger UI.

---

## ⚠️ Errores Frecuentes y Solución Rápida

| Error                                                                  | Causa                                                                    | Solución                                                                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `PrismaClientInitializationError: ... did not initialize`              | El cliente de Prisma no se generó durante el build.                      | Asegúrate de que `package.json` tenga `"build": "prisma generate && nest build"`.                          |
| `Can't reach database server` o error de conexiones agotadas (`P1001`) | Se configuró el puerto `5432` directo en `DATABASE_URL`.                 | Usa la URL del Connection Pooler (puerto `6543`) con `?pgbouncer=true`.                                    |
| `403 Forbidden` al subir o consultar archivos médicos                  | Se utilizó la clave pública `anon` en lugar de la `service_role`.        | Verifica que `SUPABASE_SECRET_KEY` tenga la clave `service_role` de Supabase.                              |
| `Bucket not found`                                                     | El nombre del bucket en Supabase no coincide con la variable de entorno. | Revisa que los buckets creados se llamen exactamente `documentacion_medica` y `autorizaciones`.            |
| `504 Gateway Timeout` en la primera petición                           | Cold start de la función serverless sumado a primera conexión Prisma.    | Normal en la primera llamada tras inactividad. En llamadas subsiguientes responderá en pocos milisegundos. |
