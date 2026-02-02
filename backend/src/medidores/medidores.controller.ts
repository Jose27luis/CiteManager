import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MedidoresService } from './medidores.service';
import { CreateMedidorDto, UpdateMedidorDto } from './dto/medidor.dto';

@ApiTags('Medidores')
@Controller('medidores')
export class MedidoresController {
  constructor(private readonly medidoresService: MedidoresService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los medidores' })
  findAll() {
    return this.medidoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un medidor por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medidoresService.findOne(id);
  }

  @Get(':id/ultima-lectura')
  @ApiOperation({ summary: 'Obtener última lectura del medidor' })
  getUltimaLectura(@Param('id', ParseIntPipe) id: number) {
    return this.medidoresService.getUltimaLectura(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo medidor' })
  create(@Body() dto: CreateMedidorDto) {
    return this.medidoresService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un medidor' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedidorDto) {
    return this.medidoresService.update(id, dto);
  }
}
