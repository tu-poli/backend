#!/usr/bin/env bash

# ==============================================================================
# Script de Validación Pre-Deploy - TuPoli Backend
# ==============================================================================
# Este script se asegura de que el código esté listo para ser desplegado
# validando secretos, linter, pruebas de rutas y build.

set -e

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sin color

echo -e "${YELLOW}🚀 Iniciando validaciones pre-deploy...${NC}\n"

# 1. Validación de secretos filtrados
echo -e "${YELLOW}[1/5] Verificando que no haya secretos filtrados (secretlint)...${NC}"
npx secretlint "src/**/*" "scripts/**/*" "prisma/**/*" || {
  echo -e "${RED}✖ Error: Se han detectado posibles secretos (claves, tokens) en el código.${NC}"
  echo -e "${RED}  Por favor revisa y elimina cualquier credencial antes de continuar.${NC}"
  exit 1
}
echo -e "${GREEN}✔ Análisis de secretos completado sin problemas.${NC}\n"

# 2. Linter (ESLint)
echo -e "${YELLOW}[2/5] Ejecutando linter para validar calidad del código...${NC}"
npm run lint || {
  echo -e "${RED}✖ Error: El código no cumple con las reglas del linter.${NC}"
  exit 1
}
echo -e "${GREEN}✔ Linter exitoso.${NC}\n"

# 3. Formateo (Prettier)
echo -e "${YELLOW}[3/5] Comprobando formato de código (Prettier)...${NC}"
npx prettier --check "src/**/*.ts" || {
  echo -e "${RED}✖ Error: Hay problemas de formato de código. Ejecuta 'npm run format'.${NC}"
  exit 1
}
echo -e "${GREEN}✔ Formato correcto.${NC}\n"

# 4. Compilación (Build)
echo -e "${YELLOW}[4/5] Compilando el backend...${NC}"
npm run build || {
  echo -e "${RED}✖ Error: La compilación ha fallado.${NC}"
  exit 1
}
echo -e "${GREEN}✔ Compilación exitosa.${NC}\n"

# 5. Pruebas End-to-End de Rutas
echo -e "${YELLOW}[5/5] Ejecutando validación integral de rutas (E2E)...${NC}"
bash scripts/validar-rutas.sh || {
  echo -e "${RED}✖ Error: Las pruebas de rutas han fallado.${NC}"
  exit 1
}
echo -e "${GREEN}✔ Todas las rutas pasaron las pruebas.${NC}\n"


echo -e "${GREEN}==================================================================${NC}"
echo -e "${GREEN}✅ ¡Todo listo! El código está validado y seguro para deploy.✅${NC}"
echo -e "${GREEN}==================================================================${NC}"
