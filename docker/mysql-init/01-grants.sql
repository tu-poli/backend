-- Script de inicialización que se ejecuta al crear el contenedor MySQL por primera vez.
--
-- Por qué ALL PRIVILEGES globales para desarrollo:
--   `prisma migrate dev` crea una "shadow database" temporal con un nombre distinto
--   al de la DB principal (ej: tupoli_db_shadow_xxx). El usuario necesita privilegios
--   completos sobre esa DB nueva para poder ejecutar todas las sentencias DDL
--   (CREATE TABLE, ALTER TABLE, CREATE INDEX, etc.) que contiene la migración.
--
--   Sin esto, falla con error P3006 / P3018 / código MySQL 1142 (ALTER denied).
--
-- NOTA: En producción esto NO aplica porque `prisma migrate deploy` no usa shadow DB.
--       El usuario de prod solo necesita ALL PRIVILEGES sobre su propia base de datos.

GRANT ALL PRIVILEGES ON *.* TO 'tupoli_user'@'%';
FLUSH PRIVILEGES;
