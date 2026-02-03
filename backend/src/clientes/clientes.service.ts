import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';
import { Prisma, Cliente, Factura } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string): Promise<Cliente[]> {
    const where: Prisma.ClienteWhereInput = search
      ? {
          OR: [
            { nombres: { contains: search, mode: 'insensitive' } },
            { apellidos: { contains: search, mode: 'insensitive' } },
            { dniRuc: { contains: search } },
          ],
        }
      : {};

    return this.prisma.cliente.findMany({
      where,
      include: {
        predios: {
          include: {
            medidor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        predios: {
          include: {
            medidor: {
              include: {
                lecturas: {
                  orderBy: { periodo: 'desc' },
                  take: 12,
                },
              },
            },
          },
        },
        facturas: {
          orderBy: { fechaEmision: 'desc' },
          take: 12,
          include: {
            pagos: true,
          },
        },
      },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const exists = await this.prisma.cliente.findUnique({
      where: { dniRuc: dto.dniRuc },
    });

    if (exists) {
      throw new ConflictException(
        `Ya existe un cliente con DNI/RUC ${dto.dniRuc}`,
      );
    }

    return this.prisma.cliente.create({
      data: dto as Prisma.ClienteCreateInput,
    });
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    await this.findOne(id);

    if (dto.dniRuc) {
      const exists = await this.prisma.cliente.findFirst({
        where: {
          dniRuc: dto.dniRuc,
          id: { not: id },
        },
      });

      if (exists) {
        throw new ConflictException(
          `Ya existe un cliente con DNI/RUC ${dto.dniRuc}`,
        );
      }
    }

    return this.prisma.cliente.update({
      where: { id },
      data: dto as Prisma.ClienteUpdateInput,
    });
  }

  async remove(id: number): Promise<Cliente> {
    await this.findOne(id);

    return this.prisma.cliente.update({
      where: { id },
      data: { activo: false },
    });
  }

  async getEstadoCuenta(id: number) {
    const cliente = await this.findOne(id);

    const facturasPendientes: Factura[] = await this.prisma.factura.findMany({
      where: {
        clienteId: id,
        estado: { in: ['PENDIENTE', 'VENCIDA'] },
      },
      orderBy: { periodo: 'asc' },
    });

    const totalDeuda = facturasPendientes.reduce(
      (sum, f) => sum + Number(f.total),
      0,
    );

    return {
      cliente: {
        id: cliente.id,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        dniRuc: cliente.dniRuc,
      },
      facturasPendientes,
      totalDeuda,
      cantidadFacturasPendientes: facturasPendientes.length,
    };
  }
}
