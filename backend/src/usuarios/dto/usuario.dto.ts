import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rol } from '@prisma/client';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'admin@citemanager.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  apellido: string;

  @ApiProperty({ enum: Rol, default: Rol.OPERADOR })
  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ example: 'Juan' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Perez' })
  @IsString()
  @IsOptional()
  apellido?: string;

  @ApiPropertyOptional({ enum: Rol })
  @IsEnum(Rol)
  @IsOptional()
  rol?: Rol;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@citemanager.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}
