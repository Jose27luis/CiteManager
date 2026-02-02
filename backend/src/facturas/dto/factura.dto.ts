import { IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerarFacturaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la lectura para generar factura',
  })
  @IsInt()
  lecturaId: number;

  @ApiProperty({ example: '2024-02-15', description: 'Fecha de vencimiento' })
  @IsDateString()
  fechaVencimiento: string;
}

export class GenerarFacturasMasivasDto {
  @ApiProperty({
    example: '2024-01-01',
    description: 'Periodo de facturacion (YYYY-MM-DD)',
  })
  @IsDateString()
  periodo: string;

  @ApiProperty({ example: '2024-02-15', description: 'Fecha de vencimiento' })
  @IsDateString()
  fechaVencimiento: string;
}
