En esta carpeta vive un proyecto de software. Sus funciones basicas:
- Brindar informacion para la gestion de un polideportivo
- Un usuario puede gestionar horarios, actividades y profesores.
- Un usuario puede gestionar inventario para una actividad. 
- Un profesor puede ver sus actividades vinculadas y materiales provistos.
Estas son las mas basicas en esta primera etapa.
El software esta pensado para la gestion de la informacion en un polideportivo, donde se dictan actividades como: clases, deportes, ferias, meriendas y otro tipo de actividades "extraordinarias"
El polideportivo tambien necesita llevar seguimiento de un inventario para asociar elementos a las actividades por ejemplo pelotas para deportes o alimientos para comida.

**IMPORTANTE (Idioma):** Todo el desarrollo, nombrado de variables, commits, ramas, comentarios y respuestas de los agentes debe realizarse estrictamente en **ESPAÑOL**. Pero respectando el SCM.

# Funcionalidades
El sistema en una primera version se enfoca en que un usuario administrador pueda llevar un control de inventario y seguimiento de actividades del polideportivo.

## Sprint 1
- El administrador del sistema puede consultar, registrar, quitar o modificar items dentro de un inventario, indicando elemento, categoria y cantidad
- El administrador del sistema puede consultar, registrar, quitar o modificar categorias del inventario agregando nombre y descripcion.

- Un usuario tiene una cuenta
- Una cuenta tiene un rol 
- El administrador del sistema puede consultar, registrar, quitar o modificar actividades. Indicando horario, profesor, categoria de actividad y que espacio necesita.

## Arquitectura
### Backend
- NodeJS + Typescript
- NestJS para la API Rest
- MariaDB para la Base de datos
- Prisma como ORM
Seguridad: 
- class-validator 
- JWT 
- bcrypt 
- CORS 
- throttler 
- Helmet
Herramientas 
- Variables de Entorno > dotenv 
- Documentacion > Swagger 
- Logs > Pino 
- Testing > Jest
---
