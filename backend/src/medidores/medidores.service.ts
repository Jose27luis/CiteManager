import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedidorDto, UpdateMedidorDto } from './dto/medidor.dto';
import { Medidor } from '@prisma/client';

@Injectable()
export class MedidoresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.medidor.findMany({
      include: {
        predio: {
          include: {
            cliente: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const medidor = await this.prisma.medidor.findUnique({
      where: { id },
      include: {
        predio: {
          include: {
            cliente: true,
          },
        },
        lecturas: {
          orderBy: { periodo: 'desc' },
          take: 12,
        },
      },
    });

    if (!medidor) {
      throw new NotFoundException(`Medidor con ID ${id} no encontrado`);
    }

    return medidor;
  }

  async create(dto: CreateMedidorDto) {
    // Verificar que el predio existe
    const predio = await this.prisma.predio.findUnique({
      where: { id: dto.predioId },
    });

    if (!predio) {
      throw new NotFoundException(
        `Predio con ID ${dto.predioId} no encontrado`,
      );
    }

    // Verificar que el predio no tiene medidor
    const existingMedidor = await this.prisma.medidor.findUnique({
      where: { predioId: dto.predioId },
    });

    if (existingMedidor) {
      throw new ConflictException(`El predio ya tiene un medidor asignado`);
    }

    // Verificar numero de serie unico
    const serieExists = await this.prisma.medidor.findUnique({
      where: { numeroSerie: dto.numeroSerie },
    });

    if (serieExists) {
      throw new ConflictException(
        `El numero de serie ${dto.numeroSerie} ya existe`,
      );
    }

    return this.prisma.medidor.create({
      data: {
        predioId: dto.predioId,
        numeroSerie: dto.numeroSerie,
        marca: dto.marca,
        lecturaInstalacion: dto.lecturaInstalacion,
        fechaInstalacion: dto.fechaInstalacion
          ? new Date(dto.fechaInstalacion)
          : undefined,
      },
      include: {
        predio: {
          include: {
            cliente: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateMedidorDto): Promise<Medidor> {
    await this.findOne(id);

    if (dto.numeroSerie) {
      const exists = await this.prisma.medidor.findFirst({
        where: {
          numeroSerie: dto.numeroSerie,
          id: { not: id },
        },
      });

      if (exists) {
        throw new ConflictException(
          `El numero de serie ${dto.numeroSerie} ya existe`,
        );
      }
    }

    return this.prisma.medidor.update({
      where: { id },
      data: {
        numeroSerie: dto.numeroSerie,
        marca: dto.marca,
        estado: dto.estado,
      },
    });
  }

  async getUltimaLectura(id: number) {
    const medidor = await this.findOne(id);

    const ultimaLectura = await this.prisma.lectura.findFirst({
      where: { medidorId: id },
      orderBy: { periodo: 'desc' },
    });

    return {
      medidor: {
        id: medidor.id,
        numeroSerie: medidor.numeroSerie,
      },
      ultimaLectura: ultimaLectura?.lecturaActual ?? medidor.lecturaInstalacion,
      fechaUltimaLectura:
        ultimaLectura?.fechaLectura ?? medidor.fechaInstalacion,
    };
  }
}
