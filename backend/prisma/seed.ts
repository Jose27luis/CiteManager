import { PrismaClient, TipoUso, Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Crear usuario administrador por defecto si no existe
  const adminEmail = 'admin@citemanager.com';
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        nombre: 'Administrador',
        apellido: 'Sistema',
        rol: Rol.ADMIN,
      },
    });
    console.log('Usuario administrador creado: admin@citemanager.com / admin123');
  }

  // Crear usuario administrador personalizado
  const customAdminEmail = '18121040@unamad.edu.pe';
  const existingCustomAdmin = await prisma.usuario.findUnique({
    where: { email: customAdminEmail },
  });

  if (!existingCustomAdmin) {
    const hashedPassword = await bcrypt.hash('75318092@.', 10);
    await prisma.usuario.create({
      data: {
        email: customAdminEmail,
        password: hashedPassword,
        nombre: 'Administrador',
        apellido: 'UNAMAD',
        rol: Rol.ADMIN,
      },
    });
    console.log('Usuario administrador personalizado creado: 18121040@unamad.edu.pe / 75318092@.');
  }

  // Crear tarifas si no existen
  const countTarifas = await prisma.tarifa.count();
  if (countTarifas === 0) {
    const tarifasDomestico = [
      { tipoUso: TipoUso.DOMESTICO, rangoMinM3: 0, rangoMaxM3: 10, precioM3: 1.5, cargoFijo: 5.0 },
      { tipoUso: TipoUso.DOMESTICO, rangoMinM3: 11, rangoMaxM3: 25, precioM3: 2.2, cargoFijo: 0 },
      { tipoUso: TipoUso.DOMESTICO, rangoMinM3: 26, rangoMaxM3: 50, precioM3: 3.5, cargoFijo: 0 },
      { tipoUso: TipoUso.DOMESTICO, rangoMinM3: 51, rangoMaxM3: null, precioM3: 5.0, cargoFijo: 0 },
    ];

    const tarifasComercial = [
      { tipoUso: TipoUso.COMERCIAL, rangoMinM3: 0, rangoMaxM3: null, precioM3: 4.5, cargoFijo: 10.0 },
    ];

    const tarifasIndustrial = [
      { tipoUso: TipoUso.INDUSTRIAL, rangoMinM3: 0, rangoMaxM3: null, precioM3: 6.0, cargoFijo: 20.0 },
    ];

    for (const tarifa of [...tarifasDomestico, ...tarifasComercial, ...tarifasIndustrial]) {
      await prisma.tarifa.create({ data: tarifa });
    }
    console.log('Tarifas creadas');
  }

  // Crear cliente de ejemplo si no existe
  let cliente = await prisma.cliente.findUnique({
    where: { dniRuc: '12345678' },
  });

  if (!cliente) {
    cliente = await prisma.cliente.create({
      data: {
        dniRuc: '12345678',
        tipoDocumento: 'DNI',
        nombres: 'Juan Carlos',
        apellidos: 'Perez Garcia',
        telefono: '999888777',
        email: 'juan.perez@email.com',
        direccion: 'Av. Principal 123',
      },
    });
    console.log('Cliente de ejemplo creado');
  }

  // Crear predio si no existe
  let predio = await prisma.predio.findFirst({
    where: { clienteId: cliente.id, direccion: 'Av. Principal 123' },
  });

  if (!predio) {
    predio = await prisma.predio.create({
      data: {
        clienteId: cliente.id,
        direccion: 'Av. Principal 123',
        referencia: 'Frente al parque central',
        tipoUso: TipoUso.DOMESTICO,
      },
    });
    console.log('Predio de ejemplo creado');
  }

  // Crear medidor si no existe
  const medidor = await prisma.medidor.findUnique({
    where: { numeroSerie: 'MED-2024-000001' },
  });

  if (!medidor) {
    await prisma.medidor.create({
      data: {
        predioId: predio.id,
        numeroSerie: 'MED-2024-000001',
        marca: 'ELSTER',
        lecturaInstalacion: 0,
        fechaInstalacion: new Date('2024-01-01'),
      },
    });
    console.log('Medidor de ejemplo creado');
  }

  console.log('Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
