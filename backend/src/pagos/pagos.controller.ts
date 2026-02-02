import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/pago.dto';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los pagos' })
  @ApiQuery({ name: 'fechaDesde', required: false })
  @ApiQuery({ name: 'fechaHasta', required: false })
  findAll(
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.pagosService.findAll(fechaDesde, fechaHasta);
  }

  @Get('resumen')
  @ApiOperation({ summary: 'Obtener resumen de recaudacion' })
  @ApiQuery({ name: 'fechaDesde', required: true })
  @ApiQuery({ name: 'fechaHasta', required: true })
  getResumenRecaudacion(
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ) {
    return this.pagosService.getResumenRecaudacion(fechaDesde, fechaHasta);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagosService.findOne(id);
  }

  @Get('factura/:facturaId')
  @ApiOperation({ summary: 'Obtener pagos por factura' })
  findByFactura(@Param('facturaId', ParseIntPipe) facturaId: number) {
    return this.pagosService.findByFactura(facturaId);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo pago' })
  create(@Body() dto: CreatePagoDto) {
    return this.pagosService.create(dto);
  }
}
