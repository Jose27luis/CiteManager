import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrediosService } from './predios.service';
import { CreatePredioDto, UpdatePredioDto } from './dto/predio.dto';

@ApiTags('Predios')
@Controller('predios')
export class PrediosController {
  constructor(private readonly prediosService: PrediosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los predios' })
  findAll() {
    return this.prediosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un predio por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prediosService.findOne(id);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Obtener predios por cliente' })
  findByCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
    return this.prediosService.findByCliente(clienteId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo predio' })
  create(@Body() dto: CreatePredioDto) {
    return this.prediosService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un predio' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePredioDto) {
    return this.prediosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un predio' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prediosService.remove(id);
  }
}
