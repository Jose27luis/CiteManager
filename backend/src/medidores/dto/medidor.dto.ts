import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoMedidor } from '@prisma/client';

export class CreateMedidorDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  predioId: number;

  @ApiProperty({ example: 'MED-001-2024' })
  @IsString()
  numeroSerie: string;

  @ApiPropertyOptional({ example: 'ELSTER' })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  lecturaInstalacion?: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  fechaInstalacion?: string;
}

export class UpdateMedidorDto {
  @ApiPropertyOptional({ example: 'MED-001-2024' })
  @IsOptional()
  @IsString()
  numeroSerie?: string;

  @ApiPropertyOptional({ example: 'ELSTER' })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiPropertyOptional({ enum: EstadoMedidor })
  @IsOptional()
  @IsEnum(EstadoMedidor)
  estado?: EstadoMedidor;
}
