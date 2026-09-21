// =============================================================
// seeds.js — Datos iniciales para TuPoli
// =============================================================
// Ejecutar con:
//   node prisma/seeds.js
// o:
//   npm run prisma:seed
// =============================================================

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Hash simple con SHA-256 + salt fijo para seed (en producción usar bcrypt en la app)
// Como este es un seed de desarrollo, usamos una implementación básica sin dependencias extra.
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'tupoli_salt').digest('hex');
}

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // ------------------------------------------------------------------
  // Limpiar en orden inverso a las FK (para poder re-ejecutar el seed)
  // ------------------------------------------------------------------
  console.log('🧹 Limpiando datos existentes...');
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;
  await prisma.reservaItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.inscripcion.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.actividad.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.inventario.deleteMany();
  await prisma.espacioFisico.deleteMany();
  await prisma.categoriaActividad.deleteMany();
  await prisma.categoriaInventario.deleteMany();
  await prisma.estadoReserva.deleteMany();
  await prisma.estadoInscripcion.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;
  console.log('   ✔ Limpieza completa\n');

  // ------------------------------------------------------------------
  // 1. ROL
  // ------------------------------------------------------------------
  console.log('1️⃣  Creando roles...');
  const [rolAdmin, rolProfesor] = await Promise.all([
    prisma.rol.create({ data: { nombre: 'admin' } }),
    prisma.rol.create({ data: { nombre: 'profesor' } }),
  ]);
  console.log(`   ✔ admin (id: ${rolAdmin.id_rol}), profesor (id: ${rolProfesor.id_rol})\n`);

  // ------------------------------------------------------------------
  // 2. ESPACIO FÍSICO
  // ------------------------------------------------------------------
  console.log('2️⃣  Creando espacios físicos...');
  const [espacioPlayon, espacioContencion] = await Promise.all([
    prisma.espacioFisico.create({
      data: { nombre: 'Playon', descripcion: 'Espacio abierto del polideportivo' },
    }),
    prisma.espacioFisico.create({
      data: { nombre: 'Espacio de Contencion', descripcion: 'Espacio fisico de 4 paredes y un techo' },
    }),
  ]);
  console.log(`   ✔ Playon (id: ${espacioPlayon.id_espacio}), Espacio de Contencion (id: ${espacioContencion.id_espacio})\n`);

  // ------------------------------------------------------------------
  // 3. CATEGORÍA DE ACTIVIDAD
  // ------------------------------------------------------------------
  console.log('3️⃣  Creando categorías de actividad...');
  const [catClase, catDeporte, catComida, catReunion] = await Promise.all([
    prisma.categoriaActividad.create({ data: { nombre: 'Clase' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Deporte' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Comida' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Reunion' } }),
  ]);
  console.log(`   ✔ Clase, Deporte, Comida, Reunion\n`);

  // ------------------------------------------------------------------
  // 4. ESTADO DE RESERVA
  // ------------------------------------------------------------------
  console.log('4️⃣  Creando estados de reserva...');
  const [estReservaConfirmada, estReservaCancelada, estReservaEnProceso, estReservaFinalizada] =
    await Promise.all([
      prisma.estadoReserva.create({ data: { nombre: 'Confirmada' } }),
      prisma.estadoReserva.create({ data: { nombre: 'Cancelada' } }),
      prisma.estadoReserva.create({ data: { nombre: 'EnProceso' } }),
      prisma.estadoReserva.create({ data: { nombre: 'Finalizada' } }),
    ]);
  console.log(`   ✔ Confirmada, Cancelada, EnProceso, Finalizada\n`);

  // ------------------------------------------------------------------
  // 5. ESTADO DE INSCRIPCIÓN
  // ------------------------------------------------------------------
  console.log('5️⃣  Creando estados de inscripción...');
  const [estInscConfirmada, , estInscEnProceso] = await Promise.all([
    prisma.estadoInscripcion.create({ data: { nombre: 'Confirmada' } }),
    prisma.estadoInscripcion.create({ data: { nombre: 'Cancelada' } }),
    prisma.estadoInscripcion.create({ data: { nombre: 'EnProceso' } }),
    prisma.estadoInscripcion.create({ data: { nombre: 'Finalizada' } }),
  ]);
  console.log(`   ✔ Confirmada, Cancelada, EnProceso, Finalizada\n`);

  // ------------------------------------------------------------------
  // 6. CATEGORÍA DE INVENTARIO
  // ------------------------------------------------------------------
  console.log('6️⃣  Creando categorías de inventario...');
  const [catInvAlimento, catInvClase, catInvDeporte] = await Promise.all([
    prisma.categoriaInventario.create({ data: { nombre: 'Alimento' } }),
    prisma.categoriaInventario.create({ data: { nombre: 'Clase' } }),
    prisma.categoriaInventario.create({ data: { nombre: 'Deporte' } }),
  ]);
  console.log(`   ✔ Alimento, Clase, Deporte\n`);

  // ------------------------------------------------------------------
  // 7. INVENTARIO
  // ------------------------------------------------------------------
  console.log('7️⃣  Creando inventario...');
  const inventarioPrincipal = await prisma.inventario.create({
    data: { nombre: 'Principal', descripcion: 'Inventario principal del polideportivo' },
  });
  console.log(`   ✔ Principal (id: ${inventarioPrincipal.id_inventario})\n`);

  // ------------------------------------------------------------------
  // 8. USUARIO
  // ------------------------------------------------------------------
  console.log('8️⃣  Creando usuarios...');
  const [admin, alice] = await Promise.all([
    prisma.usuario.create({
      data: {
        tipo_doc: 'DNI',
        num_doc: '00000001',
        nombre: 'Admin',
        mail: 'admin@example.com',
        password: hashPassword('admin1234'),
        id_rol: rolAdmin.id_rol,
      },
    }),
    prisma.usuario.create({
      data: {
        tipo_doc: 'DNI',
        num_doc: '00000002',
        nombre: 'Alice',
        mail: 'alice@example.com',
        password: hashPassword('alice1234'),
        id_rol: rolProfesor.id_rol,
      },
    }),
  ]);
  console.log(`   ✔ admin (id: ${admin.id_usuario}), alice (id: ${alice.id_usuario})\n`);

  // ------------------------------------------------------------------
  // 9. ACTIVIDAD
  // ------------------------------------------------------------------
  console.log('9️⃣  Creando actividades...');
  const [actYoga, actFutbol] = await Promise.all([
    prisma.actividad.create({
      data: { nombre: 'Yoga', descripcion: 'Clase de yoga para principiantes', id_categoria: catClase.id_categoria },
    }),
    prisma.actividad.create({
      data: { nombre: 'Futbol', descripcion: 'Partido de futbol abierto', id_categoria: catDeporte.id_categoria },
    }),
  ]);
  console.log(`   ✔ Yoga (id: ${actYoga.id_actividad}), Futbol (id: ${actFutbol.id_actividad})\n`);

  // ------------------------------------------------------------------
  // 10. RESERVA
  // ------------------------------------------------------------------
  console.log('🔟  Creando reservas...');
  const ahora = new Date();
  const [reservaYoga, reservaFutbol] = await Promise.all([
    prisma.reserva.create({
      data: {
        id_actividad: actYoga.id_actividad,
        id_espacio: espacioContencion.id_espacio,
        id_profesor: alice.id_usuario,
        fecha_hora_inicio: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000), // mañana
        fecha_hora_fin:    new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1h
        cupo_maximo: 15,
        id_estado_reserva: estReservaConfirmada.id_estado_reserva,
      },
    }),
    prisma.reserva.create({
      data: {
        id_actividad: actFutbol.id_actividad,
        id_espacio: espacioPlayon.id_espacio,
        id_profesor: alice.id_usuario,
        fecha_hora_inicio: new Date(ahora.getTime() + 2 * 24 * 60 * 60 * 1000), // pasado mañana
        fecha_hora_fin:    new Date(ahora.getTime() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // +1.5h
        cupo_maximo: 22,
        id_estado_reserva: estReservaEnProceso.id_estado_reserva,
      },
    }),
  ]);
  console.log(`   ✔ Reserva Yoga (id: ${reservaYoga.id_reserva}), Reserva Futbol (id: ${reservaFutbol.id_reserva})\n`);

  // ------------------------------------------------------------------
  // 11. INSCRIPCIÓN
  // ------------------------------------------------------------------
  console.log('1️⃣1️⃣  Creando inscripciones...');
  await prisma.inscripcion.create({
    data: {
      id_usuario: admin.id_usuario,
      id_actividad: actYoga.id_actividad,
      fecha_hora_inscripcion: new Date(),
      id_estado_inscripcion: estInscConfirmada.id_estado_inscripcion,
    },
  });
  console.log(`   ✔ Admin inscripto en Yoga\n`);

  // ------------------------------------------------------------------
  // 12. ITEM
  // ------------------------------------------------------------------
  console.log('1️⃣2️⃣  Creando items de inventario...');
  const [itemPelota, itemColchoneta] = await Promise.all([
    prisma.item.create({
      data: {
        nombre: 'Pelota de Futbol',
        cantidad: 10,
        id_categoria: catInvDeporte.id_categoria,
        id_inventario: inventarioPrincipal.id_inventario,
      },
    }),
    prisma.item.create({
      data: {
        nombre: 'Colchoneta',
        cantidad: 20,
        id_categoria: catInvClase.id_categoria,
        id_inventario: inventarioPrincipal.id_inventario,
      },
    }),
  ]);
  console.log(`   ✔ Pelota de Futbol (id: ${itemPelota.id_item}), Colchoneta (id: ${itemColchoneta.id_item})\n`);

  // ------------------------------------------------------------------
  // 13. RESERVA ITEM
  // ------------------------------------------------------------------
  console.log('1️⃣3️⃣  Asociando items a reservas...');
  await Promise.all([
    prisma.reservaItem.create({
      data: { id_reserva: reservaFutbol.id_reserva, id_item: itemPelota.id_item, cantidad: 4 },
    }),
    prisma.reservaItem.create({
      data: { id_reserva: reservaYoga.id_reserva, id_item: itemColchoneta.id_item, cantidad: 12 },
    }),
  ]);
  console.log(`   ✔ 4 pelotas → Futbol | 12 colchonetas → Yoga\n`);

  // ------------------------------------------------------------------
  console.log('✅  Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
