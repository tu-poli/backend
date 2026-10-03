# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Genera el cliente de Prisma durante el build
RUN npx prisma generate

COPY . .

RUN npm run build

# Stage 2: Production Run
FROM node:22-alpine AS runner

WORKDIR /app

# Instalar dependencias necesarias para Prisma en Alpine
RUN apk add --no-cache openssl libc6-compat
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Aplica migraciones pendientes, corre seeds (si RUN_SEEDS=true) y arranca la app
CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$RUN_SEEDS\" = \"true\" ]; then node prisma/seeds.js; fi && node dist/main"]
