import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoDocumento } from '@prisma/client';

export class CreateClienteDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  dniRuc: string;

  @ApiProperty({ enum: TipoDocumento, example: 'DNI' })
  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento;

  @ApiProperty({ example: 'Juan Carlos' })
  @IsString()
  nombres: string;

  @ApiProperty({ example: 'Pérez García' })
  @IsString()
  apellidos: string;

  @ApiPropertyOptional({ example: '999888777' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Av. Principal 123' })
  @IsOptional()
  @IsString()
  direccion?: string;
}

export class UpdateClienteDto {
  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  dniRuc?: string;

  @ApiPropertyOptional({ enum: TipoDocumento })
  @IsOptional()
  @IsEnum(TipoDocumento)
  tipoDocumento?: TipoDocumento;

  @ApiPropertyOptional({ example: 'Juan Carlos' })
  @IsOptional()
  @IsString()
  nombres?: string;

  @ApiPropertyOptional({ example: 'Pérez García' })
  @IsOptional()
  @IsString()
  apellidos?: string;

  @ApiPropertyOptional({ example: '999888777' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Av. Principal 123' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
