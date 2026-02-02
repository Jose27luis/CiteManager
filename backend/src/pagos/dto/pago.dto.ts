import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePagoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  facturaId: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Type(() => Number)
  monto: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  fechaPago?: string;

  @ApiProperty({
    example: 'EFECTIVO',
    enum: ['EFECTIVO', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'TARJETA'],
  })
  @IsEnum(['EFECTIVO', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'TARJETA'])
  metodoPago: string;

  @ApiPropertyOptional({ example: 'OP-12345' })
  @IsOptional()
  @IsString()
  comprobante?: string;

  @ApiPropertyOptional({ example: 'Pago parcial' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
