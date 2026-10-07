#!/usr/bin/env bash

# ==============================================================================
# Script de Validación Integral de Rutas de la API - TuPoli Backend
# ==============================================================================

# Colores para la salida en consola
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # Sin color

# Resolver directorio base del backend y cargar .env si existe
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -f "$BACKEND_DIR/.env" ]; then
  # Extraer PORT si está configurado en .env
  ENV_PORT=$(grep -E '^PORT=' "$BACKEND_DIR/.env" | cut -d '=' -f2 | tr -d ' "\r\n')
fi

# Configuración del servidor y endpoint base
DEFAULT_PORT="${ENV_PORT:-3000}"
HOST_URL="${1:-${API_URL:-http://localhost:${DEFAULT_PORT}}}"
BASE_URL="${HOST_URL%/}/api/v1"

# Contadores de resultados
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo -e "${BLUE}==================================================================${NC}"
echo -e "${BOLD}${CYAN}   VALIDADOR INTEGRAL DE TODAS LAS RUTAS DE LA API (TuPoli)${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo -e "Servidor objetivo : ${BOLD}$HOST_URL${NC}"
echo -e "Prefijo API       : ${BOLD}$BASE_URL${NC}\n"

# ------------------------------------------------------------------------------
# 1. Comprobación inicial de conectividad con el servidor
# ------------------------------------------------------------------------------
echo -e "${YELLOW}▶ Verificando disponibilidad del backend...${NC}"
SERVER_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" --connect-timeout 3 2>/dev/null)

if [ "$SERVER_CHECK" = "000" ] || [ -z "$SERVER_CHECK" ]; then
  echo -e "${RED}✖ Error: No se pudo conectar al servidor en $BASE_URL.${NC}"
  echo -e "${RED}  Por favor asegúrate de iniciar el backend antes de ejecutar el validador:${NC}"
  echo -e "  npm run start:dev  (o verifica la variable PORT / API_URL)\n"
  exit 1
fi
echo -e "${GREEN}✔ Servidor en línea (Respondiendo HTTP $SERVER_CHECK)${NC}\n"

# ------------------------------------------------------------------------------
# Función auxiliar para ejecutar peticiones y evaluar resultados
# ------------------------------------------------------------------------------
run_test() {
  local method="$1"
  local endpoint="$2"
  local expected_status="$3"
  local payload="$4"
  local description="$5"

  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  local url="${BASE_URL}${endpoint}"
  local response
  local http_code
  local body

  if [ -n "$payload" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
      -H "Content-Type: application/json" \
      -d "$payload")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
  fi

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  # Verificar si el código devuelto coincide con el esperado (admite lista separada por comas)
  local is_match=0
  IFS=',' read -ra ADDR <<< "$expected_status"
  for expected in "${ADDR[@]}"; do
    if [ "$http_code" -eq "$expected" ]; then
      is_match=1
      break
    fi
  done

  local display_endpoint="${endpoint:-/}"

  if [ $is_match -eq 1 ]; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "  ${GREEN}✔ [PASS]${NC} ${BOLD}${method}${NC} ${display_endpoint} -> ${GREEN}${http_code}${NC} (${description})"
  else
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "  ${RED}✖ [FAIL]${NC} ${BOLD}${method}${NC} ${display_endpoint} -> ${RED}Recibido: ${http_code}${NC} (Esperado: ${expected_status})"
    echo -e "    ${RED}Detalle:${NC} ${description}"
    echo -e "    ${RED}Respuesta:${NC} ${body}"
  fi

  # Guardar última respuesta y código en variables globales para encadenar tests
  LAST_BODY="$body"
  LAST_HTTP_CODE="$http_code"
}

# ==============================================================================
# SECCIÓN 1: Rutas de Sistema y Documentación
# ==============================================================================
echo -e "${BOLD}${YELLOW}[1/5] Validando Rutas Base del Sistema y Documentación${NC}"

run_test "GET" "" "200" "" "Ruta raíz de bienvenida"
run_test "GET" "/health" "200" "" "Health check de la aplicación"
run_test "GET" "/docs" "200,301,302" "" "Interfaz Swagger UI"
run_test "GET" "/docs-json" "200" "" "Especificación OpenAPI en formato JSON"

echo ""

# ==============================================================================
# SECCIÓN 2: Rutas de Categorías de Actividad (con alias)
# ==============================================================================
echo -e "${BOLD}${YELLOW}[2/5] Validando Módulo Categorías de Actividad${NC}"

# 2.1 Crear categoría de actividad (solo letras, números y espacios según regex)
TIMESTAMP=$(date +%s)
run_test "POST" "/actividades/categorias" "201" "{\"nombre\":\"TestActividad $TIMESTAMP\"}" "Crear categoría de actividad"

CAT_ACT_ID=""
if command -v jq >/dev/null 2>&1; then
  CAT_ACT_ID=$(echo "$LAST_BODY" | jq -r '.id_categoria // empty')
else
  CAT_ACT_ID=$(echo "$LAST_BODY" | grep -o '"id_categoria":[0-9]*' | head -n1 | cut -d':' -f2)
fi

# 2.2 Listar todas las categorías de actividad
run_test "GET" "/actividades/categorias" "200" "" "Listar todas las categorías de actividad"

# 2.3 Filtrar por parámetro query 'nombre'
run_test "GET" "/actividades/categorias?nombre=TestActividad" "200" "" "Filtrar categorías de actividad por query param 'nombre'"

if [ -n "$CAT_ACT_ID" ] && [ "$CAT_ACT_ID" != "null" ]; then
  # 2.4 Obtener por ID
  run_test "GET" "/actividades/categorias/$CAT_ACT_ID" "200" "" "Obtener categoría de actividad por ID"

  # 2.5 Actualizar (PATCH)
  run_test "PATCH" "/actividades/categorias/$CAT_ACT_ID" "200" "{\"nombre\":\"TestActividad Editada $TIMESTAMP\"}" "Actualizar categoría de actividad (PATCH)"

  # 2.7 Eliminar categoría
  run_test "DELETE" "/actividades/categorias/$CAT_ACT_ID" "200,204" "" "Eliminar categoría de actividad"

  # 2.8 Verificar que ya no existe (404)
  run_test "GET" "/actividades/categorias/$CAT_ACT_ID" "404" "" "Verificar 404 tras eliminar categoría de actividad"
else
  echo -e "  ${RED}✖ Saltando pruebas dependientes por fallo en creación de categoría de actividad${NC}"
fi

echo ""

# ==============================================================================
# SECCIÓN 3: Rutas de Categorías de Inventario
# ==============================================================================
echo -e "${BOLD}${YELLOW}[3/5] Validando Módulo Categorías de Inventario${NC}"

# 3.1 Crear categoría de inventario (solo letras, números y espacios según regex)
run_test "POST" "/inventario/categorias" "201" "{\"nombre\":\"TestItemCat $TIMESTAMP\"}" "Crear categoría de inventario"

CAT_ITEM_ID=""
if command -v jq >/dev/null 2>&1; then
  CAT_ITEM_ID=$(echo "$LAST_BODY" | jq -r '.id_categoria // empty')
else
  CAT_ITEM_ID=$(echo "$LAST_BODY" | grep -o '"id_categoria":[0-9]*' | head -n1 | cut -d':' -f2)
fi

# 3.2 Listar todas las categorías de inventario
run_test "GET" "/inventario/categorias" "200" "" "Listar todas las categorías de inventario"

# 3.3 Filtrar por parámetro query 'nombre'
run_test "GET" "/inventario/categorias?nombre=TestItemCat" "200" "" "Filtrar categorías de inventario por query param 'nombre'"

if [ -n "$CAT_ITEM_ID" ] && [ "$CAT_ITEM_ID" != "null" ]; then
  # 3.4 Obtener por ID
  run_test "GET" "/inventario/categorias/$CAT_ITEM_ID" "200" "" "Obtener categoría de inventario por ID"

  # 3.5 Actualizar (PATCH)
  run_test "PATCH" "/inventario/categorias/$CAT_ITEM_ID" "200" "{\"nombre\":\"TestItemCat Editada $TIMESTAMP\"}" "Actualizar categoría de inventario (PATCH)"
else
  echo -e "  ${RED}✖ No se pudo crear la categoría de inventario necesaria para las pruebas siguientes${NC}"
fi

echo ""

# ==============================================================================
# SECCIÓN 4: Rutas de Ítems de Inventario
# ==============================================================================
echo -e "${BOLD}${YELLOW}[4/5] Validando Módulo Ítems de Inventario${NC}"

ITEM_ID=""
if [ -n "$CAT_ITEM_ID" ] && [ "$CAT_ITEM_ID" != "null" ]; then
  # 4.1 Crear un ítem vinculado a la categoría creada
  run_test "POST" "/items" "201" "{\"elemento\":\"Pelota Test $TIMESTAMP\",\"categoriaId\":$CAT_ITEM_ID,\"cantidad\":12}" "Crear ítem de inventario asociado a categoría"

  if command -v jq >/dev/null 2>&1; then
    ITEM_ID=$(echo "$LAST_BODY" | jq -r '.id // empty')
  else
    ITEM_ID=$(echo "$LAST_BODY" | grep -o '"id":[0-9]*' | head -n1 | cut -d':' -f2)
  fi

  # 4.2 Listar todos los ítems
  run_test "GET" "/items" "200" "" "Listar todos los ítems"

  # 4.3 Filtrar ítems por elemento
  run_test "GET" "/items?elemento=Pelota" "200" "" "Filtrar ítems por query param 'elemento'"

  # 4.4 Filtrar ítems por categoriaId
  run_test "GET" "/items?categoriaId=$CAT_ITEM_ID" "200" "" "Filtrar ítems por query param 'categoriaId'"

  if [ -n "$ITEM_ID" ] && [ "$ITEM_ID" != "null" ]; then
    # 4.5 Obtener ítem por ID
    run_test "GET" "/items/$ITEM_ID" "200" "" "Obtener ítem por ID"

    # 4.6 Actualizar ítem (PATCH)
    run_test "PATCH" "/items/$ITEM_ID" "200" "{\"elemento\":\"Pelota Test Editada\",\"categoriaId\":$CAT_ITEM_ID,\"cantidad\":15}" "Actualizar ítem (PATCH)"

    # 4.7 Eliminar ítem
    run_test "DELETE" "/items/$ITEM_ID" "200,204" "" "Eliminar ítem por ID"

    # 4.8 Verificar 404 tras eliminación del ítem
    run_test "GET" "/items/$ITEM_ID" "404" "" "Verificar 404 tras eliminar ítem"
  fi

  # Limpieza de la categoría de inventario creada
  run_test "DELETE" "/inventario/categorias/$CAT_ITEM_ID" "200,204" "" "Limpieza: Eliminar categoría de inventario de prueba"
  run_test "GET" "/inventario/categorias/$CAT_ITEM_ID" "404" "" "Verificar 404 tras eliminar categoría de inventario"
else
  echo -e "  ${RED}✖ Saltando pruebas de ítems por falta de categoría válida${NC}"
fi

echo ""

# ==============================================================================
# SECCIÓN 5: Rutas del Módulo Actividades
# ==============================================================================
echo -e "${BOLD}${YELLOW}[5/6] Validando Módulo Actividades${NC}"

# Crear una categoría de actividad auxiliar si no existe
AUX_CAT_ACT_NAME="CatAuxActividad $TIMESTAMP"
run_test "POST" "/actividades/categorias" "201" "{\"nombre\":\"$AUX_CAT_ACT_NAME\"}" "Crear categoría auxiliar para actividad"

AUX_CAT_ID=""
if command -v jq >/dev/null 2>&1; then
  AUX_CAT_ID=$(echo "$LAST_BODY" | jq -r '.id_categoria // empty')
else
  AUX_CAT_ID=$(echo "$LAST_BODY" | grep -o '"id_categoria":[0-9]*' | head -n1 | cut -d':' -f2)
fi

ACT_ID=""
if [ -n "$AUX_CAT_ID" ] && [ "$AUX_CAT_ID" != "null" ]; then
  # 5.1 Crear actividad asociada a categoría
  run_test "POST" "/actividades" "201" "{\"nombre\":\"Taller Test $TIMESTAMP\",\"descripcion\":\"Taller deportivo\",\"categoriaId\":$AUX_CAT_ID,\"requiereAutorizacion\":true}" "Crear actividad vinculada a categoría"

  if command -v jq >/dev/null 2>&1; then
    ACT_ID=$(echo "$LAST_BODY" | jq -r '.id // empty')
  else
    ACT_ID=$(echo "$LAST_BODY" | grep -o '"id":[0-9]*' | head -n1 | cut -d':' -f2)
  fi

  # 5.2 Listar todas las actividades
  run_test "GET" "/actividades" "200" "" "Listar todas las actividades"

  # 5.3 Filtrar por nombre
  run_test "GET" "/actividades?nombre=Taller" "200" "" "Filtrar actividades por query param 'nombre'"

  # 5.4 Filtrar por categoriaId
  run_test "GET" "/actividades?categoriaId=$AUX_CAT_ID" "200" "" "Filtrar actividades por query param 'categoriaId'"

  # 5.5 Filtrar por requiereAutorizacion
  run_test "GET" "/actividades?requiereAutorizacion=true" "200" "" "Filtrar actividades por query param 'requiereAutorizacion'"

  if [ -n "$ACT_ID" ] && [ "$ACT_ID" != "null" ]; then
    # 5.6 Obtener por ID
    run_test "GET" "/actividades/$ACT_ID" "200" "" "Obtener actividad por ID"

    # 5.7 Actualizar actividad (PATCH)
    run_test "PATCH" "/actividades/$ACT_ID" "200" "{\"nombre\":\"Taller Test Actualizado\",\"descripcion\":\"Descripción modificada\",\"requiereAutorizacion\":false}" "Actualizar actividad (PATCH)"

    # 5.8 Actualizar parcialmente (PATCH)
    run_test "PATCH" "/actividades/$ACT_ID" "200" "{\"descripcion\":\"Descripción vía PATCH\"}" "Actualizar actividad parcialmente (PATCH)"

    # 5.8.5 Probar duplicado exacto de nombre (409)
    run_test "POST" "/actividades" "409" "{\"nombre\":\"Taller Test Actualizado\",\"categoriaId\":$AUX_CAT_ID}" "Validar 409 Conflicto por nombre duplicado de actividad"

    # 5.9 Eliminar actividad
    run_test "DELETE" "/actividades/$ACT_ID" "200,204" "" "Eliminar actividad por ID"

    # 5.10 Verificar 404 tras eliminación
    run_test "GET" "/actividades/$ACT_ID" "404" "" "Verificar 404 tras eliminar actividad"
  fi

  # Limpiar categoría auxiliar
  run_test "DELETE" "/actividades/categorias/$AUX_CAT_ID" "200,204" "" "Limpieza: Eliminar categoría auxiliar de actividad"
fi

echo ""

# ==============================================================================
# SECCIÓN 6: Manejo de Errores y Validaciones DTO (Pruebas Negativas)
# ==============================================================================
echo -e "${BOLD}${YELLOW}[6/6] Validando Manejo de Errores y Validaciones (400 y 404)${NC}"

# 6.1 Enviar payload inválido a categoría actividad
run_test "POST" "/actividades/categorias" "400" "{}" "Validar rechazo por DTO vacío en categorías actividad"

# 6.2 Enviar nombre con caracteres especiales no permitidos
run_test "POST" "/actividades/categorias" "400" "{\"nombre\":\"Nombre@Invalido$$\"}" "Validar rechazo por regex en categorías actividad"

# 6.3 Enviar payload inválido a items
run_test "POST" "/items" "400" "{\"elemento\":\"Incompleto\"}" "Validar rechazo por DTO incompleto en items"

# 6.4 Enviar payload inválido a actividades (nombre vacío)
run_test "POST" "/actividades" "400" "{}" "Validar rechazo por DTO vacío en actividades"

# 6.5 Consultar recurso inexistente (404)
run_test "GET" "/items/99999999" "404" "" "Validar 404 en ítem inexistente"
run_test "GET" "/inventario/categorias/99999999" "404" "" "Validar 404 en categoría inventario inexistente"
run_test "GET" "/actividades/categorias/99999999" "404" "" "Validar 404 en categoría actividad inexistente"
run_test "GET" "/actividades/99999999" "404" "" "Validar 404 en actividad inexistente"

echo ""

# ==============================================================================
# RESUMEN FINAL
# ==============================================================================
echo -e "${BLUE}==================================================================${NC}"
echo -e "${BOLD}                     RESUMEN DE VALIDACIÓN${NC}"
echo -e "${BLUE}==================================================================${NC}"
echo -e "Total de pruebas ejecutadas : ${BOLD}$TOTAL_TESTS${NC}"
echo -e "Pruebas exitosas            : ${GREEN}${BOLD}$PASSED_TESTS${NC}"

if [ "$FAILED_TESTS" -eq 0 ]; then
  echo -e "Pruebas fallidas            : ${BOLD}0${NC}"
  echo -e "${GREEN}${BOLD}✔ ¡Todas las rutas de la API han sido validadas exitosamente!${NC}"
  echo -e "${BLUE}==================================================================${NC}"
  exit 0
else
  echo -e "Pruebas fallidas            : ${RED}${BOLD}$FAILED_TESTS${NC}"
  echo -e "${RED}${BOLD}✖ Algunas pruebas fallaron. Revisa los detalles arriba.${NC}"
  echo -e "${BLUE}==================================================================${NC}"
  exit 1
fi
