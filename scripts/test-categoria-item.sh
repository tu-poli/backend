#!/usr/bin/env bash

# Configuración base
BASE_URL="http://localhost:3030/api/v1/inventario/categorias"

# Colores para mensajes legibles
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  Iniciando Pruebas de API: Categorías de Inventario${NC}"
echo -e "${BLUE}====================================================${NC}\n"

# 1. Verificar si el servidor está corriendo
echo -e "${YELLOW}[1/5] Verificando conexión con el backend...${NC}"
HTTP_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CHECK" -eq 000 ]; then
  echo -e "${RED}✖ Error: No se pudo conectar al servidor en $BASE_URL.${NC}"
  echo -e "${RED}  Asegúrate de haber iniciado el servidor con 'npm run start:dev'.${NC}"
  exit 1
fi
echo -e "${GREEN}✔ Servidor en línea (Código HTTP: $HTTP_CHECK)${NC}\n"

# 2. Test POST: Crear categoría
echo -e "${YELLOW}[2/5] Creando una nueva categoría ('Deportes Test')...${NC}"
POST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Deportes Test"}')

HTTP_CODE=$(echo "$POST_RESPONSE" | tail -n1)
BODY=$(echo "$POST_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
  echo -e "${GREEN}✔ Categoría creada exitosamente (HTTP 201).${NC}"
  echo -e "  Respuesta: $BODY"
  
  # Extraer el id_categoria usando grep/sed si jq no está instalado
  CATEGORY_ID=$(echo "$BODY" | grep -o '"id_categoria":[0-9]*' | cut -d':' -f2)
  if [ -z "$CATEGORY_ID" ]; then
    # Fallback si el campo fuera 'id'
    CATEGORY_ID=$(echo "$BODY" | grep -o '"id":[0-9]*' | cut -d':' -f2)
  fi
  echo -e "  ID generado: ${BLUE}$CATEGORY_ID${NC}\n"
else
  echo -e "${RED}✖ Falló la creación de categoría (HTTP $HTTP_CODE).${NC}"
  echo -e "  Respuesta: $BODY"
  exit 1
fi

# 3. Test GET: Listar todas las categorías
echo -e "${YELLOW}[3/5] Consultando todas las categorías...${NC}"
GET_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL")
HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
BODY=$(echo "$GET_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✔ Listado obtenido con éxito (HTTP 200).${NC}"
  echo -e "  Total/Respuesta: $BODY\n"
else
  echo -e "${RED}✖ Error al consultar las categorías (HTTP $HTTP_CODE).${NC}"
  echo -e "  Respuesta: $BODY"
  exit 1
fi

# 4. Test PUT: Modificar la categoría creada
echo -e "${YELLOW}[4/5] Modificando categoría ID $CATEGORY_ID a 'Deportes Acuáticos'...${NC}"
PUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE_URL/$CATEGORY_ID" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Deportes Acuáticos"}')

HTTP_CODE=$(echo "$PUT_RESPONSE" | tail -n1)
BODY=$(echo "$PUT_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✔ Categoría modificada exitosamente (HTTP 200).${NC}"
  echo -e "  Respuesta: $BODY\n"
else
  echo -e "${RED}✖ Error al modificar la categoría (HTTP $HTTP_CODE).${NC}"
  echo -e "  Respuesta: $BODY"
  exit 1
fi

# 5. Test DELETE: Eliminar la categoría creada
echo -e "${YELLOW}[5/5] Eliminando categoría ID $CATEGORY_ID...${NC}"
DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/$CATEGORY_ID")
HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)
BODY=$(echo "$DELETE_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 204 ] || [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✔ Categoría eliminada correctamente (HTTP $HTTP_CODE).${NC}\n"
else
  echo -e "${RED}✖ Error al eliminar la categoría (HTTP $HTTP_CODE).${NC}"
  echo -e "  Respuesta: $BODY"
  exit 1
fi

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}  ¡Todas las pruebas finalizaron con éxito! (CRUD OK)${NC}"
echo -e "${GREEN}====================================================${NC}"
