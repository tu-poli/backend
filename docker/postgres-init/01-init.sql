-- Script de inicialización que se ejecuta al crear el contenedor PostgreSQL por primera vez.
-- Otorga al usuario de la app los permisos necesarios para Prisma Migrate (shadow database).

ALTER USER tupoli_user CREATEDB;
