import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TarifasService } from '../tarifas/tarifas.service';
import {
  GenerarFacturaDto,
  GenerarFacturasMasivasDto,
} from './dto/factura.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FacturasService {
  private readonly IGV_RATE = 0.18; // 18% IGV

  constructor(
    private prisma: PrismaService,
    private tarifasService: TarifasService,
  ) {}

  async findAll(estado?: string, periodo?: string) {
    const where: Prisma.FacturaWhereInput = {};

    if (estado) {
      where.estado = estado as Prisma.EnumEstadoFacturaFilter;
    }

    if (periodo) {
      where.periodo = new Date(periodo);
    }

    return this.prisma.factura.findMany({
      where,
      include: {
        cliente: true,
        lectura: {
          include: {
            medidor: true,
          },
        },
        pagos: true,
      },
      orderBy: { fechaEmision: 'desc' },
    });
  }

  async findOne(id: number) {
    const factura = await this.prisma.factura.findUnique({
      where: { id },
      include: {
        cliente: true,
        lectura: {
          include: {
            medidor: {
              include: {
                predio: true,
              },
            },
          },
        },
        pagos: true,
      },
    });

    if (!factura) {
      throw new NotFoundException(`Factura con ID ${id} no encontrada`);
    }

    return factura;
  }

  async generarFactura(dto: GenerarFacturaDto) {
    // Obtener la lectura con su medidor y cliente
    const lectura = await this.prisma.lectura.findUnique({
      where: { id: dto.lecturaId },
      include: {
        medidor: {
          include: {
            predio: {
              include: {
                cliente: true,
              },
            },
          },
        },
        factura: true,
      },
    });

    if (!lectura) {
      throw new NotFoundException(
        `Lectura con ID ${dto.lecturaId} no encontrada`,
      );
    }

    if (lectura.factura) {
      throw new BadRequestException(`Ya existe una factura para esta lectura`);
    }

    const predio = lectura.medidor.predio;
    const cliente = predio.cliente;
    const tipoUso = predio.tipoUso;

    // Calcular monto segun tarifas
    const { monto, cargoFijo } = await this.tarifasService.calcularMontoConsumo(
      tipoUso,
      lectura.consumoM3,
    );

    const subtotal = monto + cargoFijo;
    const igv = subtotal * this.IGV_RATE;
    const total = subtotal + igv;

    // Generar numero de factura
    const numero = await this.generarNumeroFactura();

    return this.prisma.factura.create({
      data: {
        numero,
        clienteId: cliente.id,
        lecturaId: lectura.id,
        periodo: lectura.periodo,
        consumoM3: lectura.consumoM3,
        montoConsumo: monto,
        cargoFijo,
        subtotal,
        igv,
        total,
        fechaVencimiento: new Date(dto.fechaVencimiento),
      },
      include: {
        cliente: true,
        lectura: true,
      },
    });
  }

  async generarFacturasMasivas(dto: GenerarFacturasMasivasDto) {
    const periodo = new Date(dto.periodo);

    // Obtener lecturas del periodo sin factura
    const lecturas = await this.prisma.lectura.findMany({
      where: {
        periodo,
        factura: null,
      },
      include: {
        medidor: {
          include: {
            predio: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
    });

    const resultados = {
      generadas: 0,
      errores: [] as string[],
    };

    for (const lectura of lecturas) {
      try {
        await this.generarFactura({
          lecturaId: lectura.id,
          fechaVencimiento: dto.fechaVencimiento,
        });
        resultados.generadas++;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Error desconocido';
        resultados.errores.push(`Lectura ${lectura.id}: ${message}`);
      }
    }

    return resultados;
  }

  async anularFactura(id: number) {
    const factura = await this.findOne(id);

    if (factura.pagos.length > 0) {
      throw new BadRequestException(
        'No se puede anular una factura con pagos registrados',
      );
    }

    return this.prisma.factura.update({
      where: { id },
      data: { estado: 'ANULADA' },
    });
  }

  async actualizarEstadosVencidos() {
    const hoy = new Date();

    const result = await this.prisma.factura.updateMany({
      where: {
        estado: 'PENDIENTE',
        fechaVencimiento: { lt: hoy },
      },
      data: { estado: 'VENCIDA' },
    });

    return { actualizadas: result.count };
  }

  private async generarNumeroFactura(): Promise<string> {
    const year = new Date().getFullYear();
    const lastFactura = await this.prisma.factura.findFirst({
      where: {
        numero: { startsWith: `F${year}` },
      },
      orderBy: { numero: 'desc' },
    });

    let sequence = 1;
    if (lastFactura) {
      const lastSequence = parseInt(lastFactura.numero.slice(-6));
      sequence = lastSequence + 1;
    }

    return `F${year}-${sequence.toString().padStart(6, '0')}`;
  }
}
