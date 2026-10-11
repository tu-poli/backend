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
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'tupoli_salt').digest('hex');
}

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // ------------------------------------------------------------------
  // Limpiar en orden inverso a las FK (para poder re-ejecutar el seed)
  // ------------------------------------------------------------------
  console.log('🧹 Limpiando datos existentes...');
  await prisma.inscripcion.deleteMany();
  await prisma.menor.deleteMany();
  await prisma.reservaItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.actividad.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.espacioFisico.deleteMany();
  await prisma.categoriaActividad.deleteMany();
  await prisma.categoriaInventario.deleteMany();
  await prisma.estadoReserva.deleteMany();
  await prisma.estadoInscripcion.deleteMany();
  await prisma.rol.deleteMany();
  console.log('   ✔ Limpieza completa\n');

  // ------------------------------------------------------------------
  // 1. ROL
  // ------------------------------------------------------------------
  console.log('1️⃣  Creando roles...');
  const [rolAdmin, rolProfesor, rolTutor] = await Promise.all([
    prisma.rol.create({ data: { nombre: 'admin' } }),
    prisma.rol.create({ data: { nombre: 'profesor' } }),
    prisma.rol.create({ data: { nombre: 'tutor' } }),
  ]);
  console.log(`   ✔ admin (id: ${rolAdmin.id_rol}), profesor (id: ${rolProfesor.id_rol}), tutor (id: ${rolTutor.id_rol})\n`);

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
  const [catClase, catDeporte, catComida, catReunion, catExtraordinaria] = await Promise.all([
    prisma.categoriaActividad.create({ data: { nombre: 'Clase' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Deporte' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Comida' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Reunion' } }),
    prisma.categoriaActividad.create({ data: { nombre: 'Extraordinaria' } }),
  ]);
  console.log(`   ✔ Clase, Deporte, Comida, Reunion, Extraordinaria\n`);

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
  const [estInscConfirmada, estInscCancelada, estInscEnProceso] = await Promise.all([
    prisma.estadoInscripcion.create({ data: { nombre: 'Confirmada' } }),
    prisma.estadoInscripcion.create({ data: { nombre: 'Cancelada' } }),
    prisma.estadoInscripcion.create({ data: { nombre: 'EnProceso' } }),
  ]);
  console.log(`   ✔ Confirmada, Cancelada, EnProceso\n`);

  // ------------------------------------------------------------------
  // 6. CATEGORÍA DE INVENTARIO
  // ------------------------------------------------------------------
  console.log('6️⃣  Creando categorías de inventario...');
  const [catInvAlimento, catInvClase, catInvDeporte] = await Promise.all([
    prisma.categoriaInventario.create({
      data: { nombre: 'Alimento', color: '#F59E0B', icono: 'utensils' },
    }),
    prisma.categoriaInventario.create({
      data: { nombre: 'Clase', color: '#3B82F6', icono: 'book' },
    }),
    prisma.categoriaInventario.create({
      data: { nombre: 'Deporte', color: '#10B981', icono: 'trophy' },
    }),
  ]);
  console.log(`   ✔ Alimento, Clase, Deporte\n`);

  // ------------------------------------------------------------------
  // 7. USUARIO
  // ------------------------------------------------------------------
  console.log('7️⃣  Creando usuarios...');
  const [admin, alice, tutorCarlos] = await Promise.all([
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
        password: hashPassword('profesor1234'),
        id_rol: rolProfesor.id_rol,
      },
    }),
    prisma.usuario.create({
      data: {
        tipo_doc: 'DNI',
        num_doc: '00000003',
        nombre: 'Carlos Gómez',
        mail: 'carlos.tutor@example.com',
        password: hashPassword('tutor1234'),
        id_rol: rolTutor.id_rol,
      },
    }),
  ]);
  console.log(`   ✔ admin (id: ${admin.id_usuario}), alice (id: ${alice.id_usuario}), carlos (id: ${tutorCarlos.id_usuario})\n`);

  // ------------------------------------------------------------------
  // 8. MENORES (A cargo del tutor Carlos)
  // ------------------------------------------------------------------
  console.log('8️⃣  Creando menores a cargo de tutores...');
  const [menorLucas, menorSofia] = await Promise.all([
    prisma.menor.create({
      data: {
        id_tutor: tutorCarlos.id_usuario,
        nombre: 'Lucas',
        apellido: 'Gómez',
        tipo_doc: 'DNI',
        num_doc: '55112233',
        fecha_nacimiento: new Date('2015-05-12'),
        ficha_medica_url: 'https://ejemplo.supabase.co/storage/v1/object/public/documentacion_medica/fichas/ficha_lucas.pdf',
        cud_url: null,
      },
    }),
    prisma.menor.create({
      data: {
        id_tutor: tutorCarlos.id_usuario,
        nombre: 'Sofía',
        apellido: 'Gómez',
        tipo_doc: 'DNI',
        num_doc: '55112234',
        fecha_nacimiento: new Date('2017-08-24'),
        ficha_medica_url: 'https://ejemplo.supabase.co/storage/v1/object/public/documentacion_medica/fichas/ficha_sofia.pdf',
        cud_url: 'https://ejemplo.supabase.co/storage/v1/object/public/documentacion_medica/cud/cud_sofia.pdf',
      },
    }),
  ]);
  console.log(`   ✔ Lucas (id: ${menorLucas.id_menor}), Sofía (id: ${menorSofia.id_menor})\n`);

  // ------------------------------------------------------------------
  // 9. ACTIVIDADES
  // ------------------------------------------------------------------
  console.log('9️⃣  Creando actividades...');
  const [actYoga, actFutbol, actExcursion] = await Promise.all([
    prisma.actividad.create({
      data: {
        nombre: 'Yoga',
        descripcion: 'Clase de yoga para principiantes',
        id_categoria: catClase.id_categoria,
        requiere_autorizacion: false,
      },
    }),
    prisma.actividad.create({
      data: {
        nombre: 'Futbol',
        descripcion: 'Partido de futbol abierto',
        id_categoria: catDeporte.id_categoria,
        requiere_autorizacion: false,
      },
    }),
    prisma.actividad.create({
      data: {
        nombre: 'Excursion',
        descripcion: 'Actividad extraordinaria al aire libre que requiere autorización firmada',
        id_categoria: catExtraordinaria.id_categoria,
        requiere_autorizacion: true,
      },
    }),
  ]);
  console.log(`   ✔ Yoga (id: ${actYoga.id_actividad}), Futbol (id: ${actFutbol.id_actividad}), Excursion (id: ${actExcursion.id_actividad})\n`);

  // ------------------------------------------------------------------
  // 10. RESERVAS
  // ------------------------------------------------------------------
  console.log('🔟  Creando reservas...');
  const ahora = new Date();
  const [reservaYoga, reservaFutbol, reservaExcursion] = await Promise.all([
    prisma.reserva.create({
      data: {
        id_actividad: actYoga.id_actividad,
        id_espacio: espacioContencion.id_espacio,
        id_profesor: alice.id_usuario,
        fecha_hora_inicio: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000), // mañana
        fecha_hora_fin: new Date(ahora.getTime() + 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // +1h
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
        fecha_hora_fin: new Date(ahora.getTime() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // +1.5h
        cupo_maximo: 22,
        id_estado_reserva: estReservaEnProceso.id_estado_reserva,
      },
    }),
    prisma.reserva.create({
      data: {
        id_actividad: actExcursion.id_actividad,
        id_espacio: espacioPlayon.id_espacio,
        id_profesor: alice.id_usuario,
        fecha_hora_inicio: new Date('2026-10-20T15:00:00Z'),
        fecha_hora_fin: new Date('2026-10-20T16:00:00Z'),
        cupo_maximo: 30,
        id_estado_reserva: estReservaConfirmada.id_estado_reserva,
      },
    }),
  ]);
  console.log(`   ✔ Reserva Yoga (id: ${reservaYoga.id_reserva}), Futbol (id: ${reservaFutbol.id_reserva}), Excursion (id: ${reservaExcursion.id_reserva})\n`);

  // ------------------------------------------------------------------
  // 11. INSCRIPCIONES (Menores inscriptos a Reservas)
  // ------------------------------------------------------------------
  console.log('1️⃣1️⃣  Inscribiendo menores a reservas...');
  await Promise.all([
    // Lucas inscripto a la Excursión (requiere autorización)
    prisma.inscripcion.create({
      data: {
        id_reserva: reservaExcursion.id_reserva,
        id_menor: menorLucas.id_menor,
        autorizacion_url: 'https://ejemplo.supabase.co/storage/v1/object/public/autorizaciones/aut_lucas_excursion.pdf',
        id_estado_inscripcion: estInscConfirmada.id_estado_inscripcion,
      },
    }),
    // Sofía inscripta a Yoga (no requiere autorización)
    prisma.inscripcion.create({
      data: {
        id_reserva: reservaYoga.id_reserva,
        id_menor: menorSofia.id_menor,
        autorizacion_url: null,
        id_estado_inscripcion: estInscConfirmada.id_estado_inscripcion,
      },
    }),
  ]);
  console.log(`   ✔ Lucas inscripto a Excursión (con autorización) | Sofía inscripta a Yoga (sin autorización)\n`);

  // ------------------------------------------------------------------
  // 13. ITEM DE INVENTARIO
  // ------------------------------------------------------------------
  console.log('1️⃣3️⃣  Creando items de inventario...');
  const [itemPelota, itemColchoneta] = await Promise.all([
    prisma.item.create({
      data: {
        nombre: 'Pelota de Futbol',
        cantidad: 10,
        id_categoria: catInvDeporte.id_categoria,
        lote: 'LOTE-2024/01#DEP',
        stock_minimo: 5,
      },
    }),
    prisma.item.create({
      data: {
        nombre: 'Colchoneta',
        cantidad: 20,
        id_categoria: catInvClase.id_categoria,
        lote: 'LOTE-2024/02#CLA',
        stock_minimo: 2,
      },
    }),
  ]);
  console.log(`   ✔ Pelota de Futbol (id: ${itemPelota.id_item}), Colchoneta (id: ${itemColchoneta.id_item})\n`);

  // ------------------------------------------------------------------
  // 14. RESERVA ITEM
  // ------------------------------------------------------------------
  console.log('1️⃣4️⃣  Asociando items a reservas...');
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
