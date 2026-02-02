import {
  IsInt,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTarifaDto {
  @ApiProperty({
    example: 'DOMESTICO',
    enum: ['DOMESTICO', 'COMERCIAL', 'INDUSTRIAL', 'ESTATAL'],
  })
  @IsEnum(['DOMESTICO', 'COMERCIAL', 'INDUSTRIAL', 'ESTATAL'])
  tipoUso: string;

  @ApiProperty({ example: 0, description: 'Rango minimo en m3' })
  @IsInt()
  rangoMinM3: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Rango maximo en m3 (null = sin limite)',
  })
  @IsOptional()
  @IsInt()
  rangoMaxM3?: number;

  @ApiProperty({ example: 1.5, description: 'Precio por m3' })
  @IsNumber()
  @Type(() => Number)
  precioM3: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Cargo fijo mensual' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cargoFijo?: number;
}

export class UpdateTarifaDto {
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  rangoMinM3?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  rangoMaxM3?: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  precioM3?: number;

  @ApiPropertyOptional({ example: 5.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cargoFijo?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
