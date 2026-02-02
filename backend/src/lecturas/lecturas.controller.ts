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
import { LecturasService } from './lecturas.service';
import { CreateLecturaDto } from './dto/lectura.dto';

@ApiTags('Lecturas')
@Controller('lecturas')
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las lecturas' })
  @ApiQuery({
    name: 'periodo',
    required: false,
    description: 'Filtrar por periodo (YYYY-MM-DD)',
  })
  findAll(@Query('periodo') periodo?: string) {
    return this.lecturasService.findAll(periodo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lectura por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lecturasService.findOne(id);
  }

  @Get('medidor/:medidorId')
  @ApiOperation({ summary: 'Obtener lecturas por medidor' })
  findByMedidor(@Param('medidorId', ParseIntPipe) medidorId: number) {
    return this.lecturasService.findByMedidor(medidorId);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva lectura' })
  create(@Body() dto: CreateLecturaDto) {
    return this.lecturasService.create(dto);
  }
}
