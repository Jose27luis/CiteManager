import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredioDto, UpdatePredioDto } from './dto/predio.dto';
import { TipoUso, Predio, Prisma } from '@prisma/client';

@Injectable()
export class PrediosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.predio.findMany({
      include: {
        cliente: true,
        medidor: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const predio = await this.prisma.predio.findUnique({
      where: { id },
      include: {
        cliente: true,
        medidor: {
          include: {
            lecturas: {
              orderBy: { periodo: 'desc' },
              take: 12,
            },
          },
        },
      },
    });

    if (!predio) {
      throw new NotFoundException(`Predio con ID ${id} no encontrado`);
    }

    return predio;
  }

  async findByCliente(clienteId: number) {
    return this.prisma.predio.findMany({
      where: { clienteId },
      include: {
        medidor: true,
      },
    });
  }

  async create(dto: CreatePredioDto) {
    // Verificar que el cliente existe
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: dto.clienteId },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${dto.clienteId} no encontrado`,
      );
    }

    return this.prisma.predio.create({
      data: {
        clienteId: dto.clienteId,
        direccion: dto.direccion,
        referencia: dto.referencia,
        tipoUso: dto.tipoUso as TipoUso,
      },
      include: {
        cliente: true,
      },
    });
  }

  async update(id: number, dto: UpdatePredioDto): Promise<Predio> {
    await this.findOne(id);

    const updateData: Prisma.PredioUpdateInput = {};
    if (dto.direccion !== undefined) updateData.direccion = dto.direccion;
    if (dto.referencia !== undefined) updateData.referencia = dto.referencia;
    if (dto.tipoUso !== undefined) updateData.tipoUso = dto.tipoUso as TipoUso;
    if (dto.activo !== undefined) updateData.activo = dto.activo;

    return this.prisma.predio.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Predio> {
    await this.findOne(id);

    return this.prisma.predio.update({
      where: { id },
      data: { activo: false },
    });
  }
}
