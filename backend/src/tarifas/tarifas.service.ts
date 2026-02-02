import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTarifaDto, UpdateTarifaDto } from './dto/tarifa.dto';
import { TipoUso } from '@prisma/client';

@Injectable()
export class TarifasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tarifa.findMany({
      where: { activo: true },
      orderBy: [{ tipoUso: 'asc' }, { rangoMinM3: 'asc' }],
    });
  }

  async findByTipoUso(tipoUso: TipoUso) {
    return this.prisma.tarifa.findMany({
      where: { tipoUso, activo: true },
      orderBy: { rangoMinM3: 'asc' },
    });
  }

  async findOne(id: number) {
    const tarifa = await this.prisma.tarifa.findUnique({
      where: { id },
    });

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    return tarifa;
  }

  async create(dto: CreateTarifaDto) {
    return this.prisma.tarifa.create({
      data: {
        tipoUso: dto.tipoUso as TipoUso,
        rangoMinM3: dto.rangoMinM3,
        rangoMaxM3: dto.rangoMaxM3,
        precioM3: dto.precioM3,
        cargoFijo: dto.cargoFijo || 0,
      },
    });
  }

  async update(id: number, dto: UpdateTarifaDto) {
    await this.findOne(id);

    return this.prisma.tarifa.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.tarifa.update({
      where: { id },
      data: { activo: false },
    });
  }

  // Calcula el monto por consumo segun las tarifas escalonadas
  async calcularMontoConsumo(
    tipoUso: TipoUso,
    consumoM3: number,
  ): Promise<{ monto: number; cargoFijo: number; detalle: any[] }> {
    const tarifas = await this.findByTipoUso(tipoUso);

    if (tarifas.length === 0) {
      throw new NotFoundException(
        `No hay tarifas configuradas para el tipo de uso: ${tipoUso}`,
      );
    }

    let monto = 0;
    let consumoRestante = consumoM3;
    const detalle: any[] = [];
    let cargoFijo = 0;

    for (const tarifa of tarifas) {
      if (consumoRestante <= 0) break;

      const rangoMax = tarifa.rangoMaxM3 || Infinity;
      const rangoMin = tarifa.rangoMinM3;
      const m3EnRango = Math.min(consumoRestante, rangoMax - rangoMin + 1);

      if (m3EnRango > 0) {
        const montoRango = m3EnRango * Number(tarifa.precioM3);
        monto += montoRango;
        consumoRestante -= m3EnRango;

        detalle.push({
          rango: `${rangoMin} - ${rangoMax === Infinity ? '+' : rangoMax}`,
          m3: m3EnRango,
          precioM3: Number(tarifa.precioM3),
          subtotal: montoRango,
        });
      }

      // Tomar el cargo fijo de la primera tarifa
      if (cargoFijo === 0) {
        cargoFijo = Number(tarifa.cargoFijo);
      }
    }

    return { monto, cargoFijo, detalle };
  }
}
