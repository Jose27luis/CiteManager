import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredioDto, UpdatePredioDto } from './dto/predio.dto';
import { TipoUso } from '@prisma/client';

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

  async update(id: number, dto: UpdatePredioDto) {
    await this.findOne(id);

    return this.prisma.predio.update({
      where: { id },
      data: {
        ...dto,
        tipoUso: dto.tipoUso ? (dto.tipoUso as TipoUso) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.predio.update({
      where: { id },
      data: { activo: false },
    });
  }
}
