import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FacturasService } from './facturas.service';
import {
  GenerarFacturaDto,
  GenerarFacturasMasivasDto,
} from './dto/factura.dto';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las facturas' })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'periodo', required: false })
  findAll(
    @Query('estado') estado?: string,
    @Query('periodo') periodo?: string,
  ) {
    return this.facturasService.findAll(estado, periodo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.findOne(id);
  }

  @Post('generar')
  @ApiOperation({ summary: 'Generar factura para una lectura' })
  generarFactura(@Body() dto: GenerarFacturaDto) {
    return this.facturasService.generarFactura(dto);
  }

  @Post('generar-masivo')
  @ApiOperation({ summary: 'Generar facturas masivamente por periodo' })
  generarFacturasMasivas(@Body() dto: GenerarFacturasMasivasDto) {
    return this.facturasService.generarFacturasMasivas(dto);
  }

  @Patch(':id/anular')
  @ApiOperation({ summary: 'Anular una factura' })
  anularFactura(@Param('id', ParseIntPipe) id: number) {
    return this.facturasService.anularFactura(id);
  }

  @Post('actualizar-vencidos')
  @ApiOperation({ summary: 'Actualizar estado de facturas vencidas' })
  actualizarEstadosVencidos() {
    return this.facturasService.actualizarEstadosVencidos();
  }
}
