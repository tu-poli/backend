#!/usr/bin/env bash

# Configuración base
PORT="${PORT:-3000}"
BASE_URL="${API_URL:-http://localhost:${PORT}}/api/v1"

# Colores para la salida en consola
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}     Iniciando Pruebas de API: Actividades (CRUD)   ${NC}"
echo -e "${BLUE}====================================================${NC}\n"

# 1. Verificar si el backend está en línea
echo -e "${YELLOW}[1/7] Verificando conexión con el backend...${NC}"
HTTP_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$HTTP_CHECK" = "000" ] || [ -z "$HTTP_CHECK" ]; then
  echo -e "${RED}✖ Error: No se pudo conectar al servidor en $BASE_URL.${NC}"
  echo -e "${RED}  Asegúrate de que el backend esté iniciado.${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Servidor en línea (HTTP $HTTP_CHECK)${NC}\n"

# 2. Crear categoría de actividad para asociarla
TIMESTAMP=$(date +%s)
echo -e "${YELLOW}[2/7] Creando categoría auxiliar para la actividad...${NC}"
CAT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/actividades/categorias" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\": \"Deportes Cat $TIMESTAMP\"}")
CAT_CODE=$(echo "$CAT_RESPONSE" | tail -n1)
CAT_BODY=$(echo "$CAT_RESPONSE" | sed '$d')

if [ "$CAT_CODE" -ne 201 ]; then
  echo -e "${RED}✖ Falló la creación de la categoría (HTTP $CAT_CODE): $CAT_BODY${NC}"
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  CAT_ID=$(echo "$CAT_BODY" | jq -r '.id_categoria // .id // empty')
else
  CAT_ID=$(echo "$CAT_BODY" | grep -o '"id_categoria":[0-9]*' | head -n1 | cut -d':' -f2)
fi
echo -e "${GREEN}✔ Categoría creada con ID: $CAT_ID${NC}\n"

# 3. Crear Actividad
echo -e "${YELLOW}[3/7] Creando actividad 'Taller de Fútbol $TIMESTAMP'...${NC}"
ACT_PAYLOAD=$(cat <<EOF
{
  "nombre": "Taller de Fútbol $TIMESTAMP",
  "descripcion": "Entrenamiento formativo para menores",
  "categoriaId": $CAT_ID,
  "requiereAutorizacion": true
}
EOF
)
POST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/actividades" \
  -H "Content-Type: application/json" \
  -d "$ACT_PAYLOAD")
POST_CODE=$(echo "$POST_RESPONSE" | tail -n1)
POST_BODY=$(echo "$POST_RESPONSE" | sed '$d')

if [ "$POST_CODE" -ne 201 ]; then
  echo -e "${RED}✖ Falló la creación de actividad (HTTP $POST_CODE): $POST_BODY${NC}"
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  ACT_ID=$(echo "$POST_BODY" | jq -r '.id // .id_actividad // empty')
else
  ACT_ID=$(echo "$POST_BODY" | grep -o '"id":[0-9]*' | head -n1 | cut -d':' -f2)
fi
echo -e "${GREEN}✔ Actividad creada exitosamente (HTTP 201). ID: $ACT_ID${NC}"
echo -e "  Respuesta: $POST_BODY\n"

# 4. Listar actividades y filtrar
echo -e "${YELLOW}[4/7] Listando actividades con filtros...${NC}"
GET_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/actividades?nombre=Taller&categoriaId=$CAT_ID")
GET_CODE=$(echo "$GET_RESPONSE" | tail -n1)
GET_BODY=$(echo "$GET_RESPONSE" | sed '$d')

if [ "$GET_CODE" -ne 200 ]; then
  echo -e "${RED}✖ Falló la consulta de actividades (HTTP $GET_CODE): $GET_BODY${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Listado obtenido con éxito (HTTP 200).${NC}\n"

# 5. Obtener por ID
echo -e "${YELLOW}[5/7] Obteniendo actividad por ID $ACT_ID...${NC}"
ONE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/actividades/$ACT_ID")
ONE_CODE=$(echo "$ONE_RESPONSE" | tail -n1)
ONE_BODY=$(echo "$ONE_RESPONSE" | sed '$d')

if [ "$ONE_CODE" -ne 200 ]; then
  echo -e "${RED}✖ Falló la consulta por ID (HTTP $ONE_CODE): $ONE_BODY${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Detalle de actividad obtenido con éxito (HTTP 200).${NC}"
echo -e "  Respuesta: $ONE_BODY\n"

# 6. Actualizar actividad (PUT)
echo -e "${YELLOW}[6/7] Actualizando actividad ID $ACT_ID...${NC}"
PUT_PAYLOAD=$(cat <<EOF
{
  "nombre": "Taller de Fútbol Avanzado $TIMESTAMP",
  "descripcion": "Entrenamiento intensivo y táctico",
  "requiereAutorizacion": false
}
EOF
)
PUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/actividades/$ACT_ID" \
  -H "Content-Type: application/json" \
  -d "$PUT_PAYLOAD")
PUT_CODE=$(echo "$PUT_RESPONSE" | tail -n1)
PUT_BODY=$(echo "$PUT_RESPONSE" | sed '$d')

if [ "$PUT_CODE" -ne 200 ]; then
  echo -e "${RED}✖ Falló la actualización de actividad (HTTP $PUT_CODE): $PUT_BODY${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Actividad actualizada exitosamente (HTTP 200).${NC}"
echo -e "  Respuesta: $PUT_BODY\n"

# 7. Eliminar actividad y categoría auxiliar
echo -e "${YELLOW}[7/7] Eliminando actividad ID $ACT_ID y limpiando datos...${NC}"
DEL_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/actividades/$ACT_ID")
DEL_CODE=$(echo "$DEL_RESPONSE" | tail -n1)

if [ "$DEL_CODE" -ne 204 ] && [ "$DEL_CODE" -ne 200 ]; then
  echo -e "${RED}✖ Falló la eliminación de actividad (HTTP $DEL_CODE)${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Actividad eliminada correctamente (HTTP $DEL_CODE).${NC}"

# Verificar que ya no existe (404)
CHECK_404=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/actividades/$ACT_ID")
if [ "$CHECK_404" -eq 404 ]; then
  echo -e "${GREEN}✔ Verificación 404 confirmada para actividad eliminada.${NC}"
fi

# Eliminar categoría auxiliar
curl -s -X DELETE "$BASE_URL/actividades/categorias/$CAT_ID" >/dev/null 2>&1

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ¡Todas las pruebas del CRUD Actividades pasaron OK!${NC}"
echo -e "${GREEN}====================================================${NC}"
