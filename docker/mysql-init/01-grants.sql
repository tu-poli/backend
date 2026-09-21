-- Script de inicialización que se ejecuta al crear el contenedor MySQL por primera vez.
-- Otorga al usuario de la app los permisos necesarios para Prisma Migrate.
--
-- Por qué CREATE/DROP globales:
--   `prisma migrate dev` requiere crear una "shadow database" temporal para calcular
--   los diffs del schema. Sin estos permisos, la migración falla con error P3014.
--   En producción esto NO es necesario (se usa `prisma migrate deploy` que no usa shadow DB).

GRANT CREATE, DROP, REFERENCES ON *.* TO 'tupoli_user'@'%';
FLUSH PRIVILEGES;
