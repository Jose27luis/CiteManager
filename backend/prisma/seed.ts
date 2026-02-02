import { PrismaClient, TipoUso } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Crear tarifas para uso domestico (escalonadas tipo SEDAPAL)
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

  // Crear cliente de ejemplo
  const cliente = await prisma.cliente.create({
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

  // Crear predio
  const predio = await prisma.predio.create({
    data: {
      clienteId: cliente.id,
      direccion: 'Av. Principal 123',
      referencia: 'Frente al parque central',
      tipoUso: TipoUso.DOMESTICO,
    },
  });

  console.log('Predio de ejemplo creado');

  // Crear medidor
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
