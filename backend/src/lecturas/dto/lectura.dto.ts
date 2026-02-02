import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLecturaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  medidorId: number;

  @ApiProperty({
    example: 150,
    description: 'Lectura actual del medidor en m3',
  })
  @IsInt()
  lecturaActual: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Periodo de facturacion (YYYY-MM-DD)',
  })
  @IsDateString()
  periodo: string;

  @ApiPropertyOptional({ example: 'Sin novedad' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
