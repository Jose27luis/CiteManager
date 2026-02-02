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
import { TarifasService } from './tarifas.service';
import { CreateTarifaDto, UpdateTarifaDto } from './dto/tarifa.dto';

@ApiTags('Tarifas')
@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las tarifas activas' })
  findAll() {
    return this.tarifasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarifa por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarifa' })
  create(@Body() dto: CreateTarifaDto) {
    return this.tarifasService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarifa' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTarifaDto) {
    return this.tarifasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar una tarifa' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tarifasService.remove(id);
  }
}
