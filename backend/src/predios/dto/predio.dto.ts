import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePredioDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  clienteId: number;

  @ApiProperty({ example: 'Av. Los Pinos 456' })
  @IsString()
  direccion: string;

  @ApiPropertyOptional({ example: 'Frente al parque' })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiProperty({
    example: 'DOMESTICO',
    enum: ['DOMESTICO', 'COMERCIAL', 'INDUSTRIAL', 'ESTATAL'],
  })
  @IsEnum(['DOMESTICO', 'COMERCIAL', 'INDUSTRIAL', 'ESTATAL'])
  tipoUso: string;
}

export class UpdatePredioDto {
  @ApiPropertyOptional({ example: 'Av. Los Pinos 456' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: 'Frente al parque' })
  @IsOptional()
  @IsString()
  referencia?: string;

  @ApiPropertyOptional({
    enum: ['DOMESTICO', 'COMERCIAL', 'INDUSTRIAL', 'ESTATAL'],
  })
  @IsOptional()
  @IsEnum(['DOMESTICO', 'COMERCIAL', 'INDUSTRIAL', 'ESTATAL'])
  tipoUso?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
