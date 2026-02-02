import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLecturaDto } from './dto/lectura.dto';

@Injectable()
export class LecturasService {
  constructor(private prisma: PrismaService) {}

  async findAll(periodo?: string) {
    const where = periodo ? { periodo: new Date(periodo) } : {};

    return this.prisma.lectura.findMany({
      where,
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
      orderBy: { periodo: 'desc' },
    });
  }

  async findOne(id: number) {
    const lectura = await this.prisma.lectura.findUnique({
      where: { id },
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
      throw new NotFoundException(`Lectura con ID ${id} no encontrada`);
    }

    return lectura;
  }

  async create(dto: CreateLecturaDto) {
    // Verificar que el medidor existe
    const medidor = await this.prisma.medidor.findUnique({
      where: { id: dto.medidorId },
      include: {
        lecturas: {
          orderBy: { periodo: 'desc' },
          take: 1,
        },
      },
    });

    if (!medidor) {
      throw new NotFoundException(
        `Medidor con ID ${dto.medidorId} no encontrado`,
      );
    }

    // Obtener lectura anterior
    const lecturaAnterior =
      medidor.lecturas[0]?.lecturaActual || medidor.lecturaInstalacion;

    // Validar que la lectura actual sea mayor a la anterior
    if (dto.lecturaActual < lecturaAnterior) {
      throw new BadRequestException(
        `La lectura actual (${dto.lecturaActual}) no puede ser menor a la anterior (${lecturaAnterior})`,
      );
    }

    // Calcular consumo
    const consumoM3 = dto.lecturaActual - lecturaAnterior;

    // Verificar que no exista lectura para este periodo
    const periodo = new Date(dto.periodo);
    const existingLectura = await this.prisma.lectura.findFirst({
      where: {
        medidorId: dto.medidorId,
        periodo,
      },
    });

    if (existingLectura) {
      throw new BadRequestException(
        `Ya existe una lectura para este medidor en el periodo ${dto.periodo}`,
      );
    }

    return this.prisma.lectura.create({
      data: {
        medidorId: dto.medidorId,
        lecturaAnterior,
        lecturaActual: dto.lecturaActual,
        consumoM3,
        periodo,
        observaciones: dto.observaciones,
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
  }

  async findByMedidor(medidorId: number) {
    return this.prisma.lectura.findMany({
      where: { medidorId },
      orderBy: { periodo: 'desc' },
    });
  }
}
