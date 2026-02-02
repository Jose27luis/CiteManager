import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagoDto } from './dto/pago.dto';
import { MetodoPago, Prisma } from '@prisma/client';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async findAll(fechaDesde?: string, fechaHasta?: string) {
    const where: Prisma.PagoWhereInput = {};

    if (fechaDesde || fechaHasta) {
      const fechaPagoFilter: Prisma.DateTimeFilter = {};
      if (fechaDesde) {
        fechaPagoFilter.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        fechaPagoFilter.lte = new Date(fechaHasta);
      }
      where.fechaPago = fechaPagoFilter;
    }

    return this.prisma.pago.findMany({
      where,
      include: {
        factura: {
          include: {
            cliente: true,
          },
        },
      },
      orderBy: { fechaPago: 'desc' },
    });
  }

  async findOne(id: number) {
    const pago = await this.prisma.pago.findUnique({
      where: { id },
      include: {
        factura: {
          include: {
            cliente: true,
          },
        },
      },
    });

    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return pago;
  }

  async create(dto: CreatePagoDto) {
    // Obtener la factura
    const factura = await this.prisma.factura.findUnique({
      where: { id: dto.facturaId },
      include: { pagos: true },
    });

    if (!factura) {
      throw new NotFoundException(
        `Factura con ID ${dto.facturaId} no encontrada`,
      );
    }

    if (factura.estado === 'ANULADA') {
      throw new BadRequestException(
        'No se puede registrar pago en una factura anulada',
      );
    }

    if (factura.estado === 'PAGADA') {
      throw new BadRequestException('La factura ya esta pagada');
    }

    // Calcular total pagado
    const totalPagado = factura.pagos.reduce(
      (sum, p) => sum + Number(p.monto),
      0,
    );
    const saldoPendiente = Number(factura.total) - totalPagado;

    if (dto.monto > saldoPendiente) {
      throw new BadRequestException(
        `El monto del pago (${dto.monto}) excede el saldo pendiente (${saldoPendiente.toFixed(2)})`,
      );
    }

    // Crear el pago
    const pago = await this.prisma.pago.create({
      data: {
        facturaId: dto.facturaId,
        monto: dto.monto,
        fechaPago: dto.fechaPago ? new Date(dto.fechaPago) : new Date(),
        metodoPago: dto.metodoPago as MetodoPago,
        comprobante: dto.comprobante,
        observaciones: dto.observaciones,
      },
      include: {
        factura: true,
      },
    });

    // Actualizar estado de factura si esta completamente pagada
    const nuevoTotalPagado = totalPagado + dto.monto;
    if (nuevoTotalPagado >= Number(factura.total)) {
      await this.prisma.factura.update({
        where: { id: dto.facturaId },
        data: { estado: 'PAGADA' },
      });
    }

    return pago;
  }

  async findByFactura(facturaId: number) {
    return this.prisma.pago.findMany({
      where: { facturaId },
      orderBy: { fechaPago: 'desc' },
    });
  }

  async getResumenRecaudacion(fechaDesde: string, fechaHasta: string) {
    const pagos = await this.prisma.pago.findMany({
      where: {
        fechaPago: {
          gte: new Date(fechaDesde),
          lte: new Date(fechaHasta),
        },
      },
      include: {
        factura: true,
      },
    });

    const totalRecaudado = pagos.reduce((sum, p) => sum + Number(p.monto), 0);

    // Agrupar por metodo de pago
    const porMetodo: Record<string, number> = {};
    for (const pago of pagos) {
      if (!porMetodo[pago.metodoPago]) {
        porMetodo[pago.metodoPago] = 0;
      }
      porMetodo[pago.metodoPago] += Number(pago.monto);
    }

    return {
      fechaDesde,
      fechaHasta,
      totalRecaudado,
      cantidadPagos: pagos.length,
      porMetodoPago: porMetodo,
    };
  }
}
