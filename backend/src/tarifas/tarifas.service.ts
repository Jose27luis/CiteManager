import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTarifaDto, UpdateTarifaDto } from './dto/tarifa.dto';
import { TipoUso, Tarifa, Prisma } from '@prisma/client';

interface TarifaDetalle {
  rango: string;
  m3: number;
  precioM3: number;
  subtotal: number;
}

interface CalculoConsumoResult {
  monto: number;
  cargoFijo: number;
  detalle: TarifaDetalle[];
}

@Injectable()
export class TarifasService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Tarifa[]> {
    return this.prisma.tarifa.findMany({
      where: { activo: true },
      orderBy: [{ tipoUso: 'asc' }, { rangoMinM3: 'asc' }],
    });
  }

  async findByTipoUso(tipoUso: TipoUso): Promise<Tarifa[]> {
    return this.prisma.tarifa.findMany({
      where: { tipoUso, activo: true },
      orderBy: { rangoMinM3: 'asc' },
    });
  }

  async findOne(id: number): Promise<Tarifa> {
    const tarifa = await this.prisma.tarifa.findUnique({
      where: { id },
    });

    if (!tarifa) {
      throw new NotFoundException(`Tarifa con ID ${id} no encontrada`);
    }

    return tarifa;
  }

  async create(dto: CreateTarifaDto): Promise<Tarifa> {
    return this.prisma.tarifa.create({
      data: {
        tipoUso: dto.tipoUso as TipoUso,
        rangoMinM3: dto.rangoMinM3,
        rangoMaxM3: dto.rangoMaxM3,
        precioM3: dto.precioM3,
        cargoFijo: dto.cargoFijo ?? 0,
      },
    });
  }

  async update(id: number, dto: UpdateTarifaDto): Promise<Tarifa> {
    await this.findOne(id);

    const updateData: Prisma.TarifaUpdateInput = {};
    if (dto.tipoUso !== undefined) updateData.tipoUso = dto.tipoUso as TipoUso;
    if (dto.rangoMinM3 !== undefined) updateData.rangoMinM3 = dto.rangoMinM3;
    if (dto.rangoMaxM3 !== undefined) updateData.rangoMaxM3 = dto.rangoMaxM3;
    if (dto.precioM3 !== undefined) updateData.precioM3 = dto.precioM3;
    if (dto.cargoFijo !== undefined) updateData.cargoFijo = dto.cargoFijo;
    if (dto.activo !== undefined) updateData.activo = dto.activo;

    return this.prisma.tarifa.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Tarifa> {
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
  ): Promise<CalculoConsumoResult> {
    const tarifas = await this.findByTipoUso(tipoUso);

    if (tarifas.length === 0) {
      throw new NotFoundException(
        `No hay tarifas configuradas para el tipo de uso: ${tipoUso}`,
      );
    }

    let monto = 0;
    let consumoRestante = consumoM3;
    const detalle: TarifaDetalle[] = [];
    let cargoFijo = 0;

    for (const tarifa of tarifas) {
      if (consumoRestante <= 0) break;

      const rangoMax = tarifa.rangoMaxM3 ?? Infinity;
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
