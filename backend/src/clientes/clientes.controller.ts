import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Buscar por nombre o DNI',
  })
  findAll(@Query('search') search?: string) {
    return this.clientesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Get(':id/estado-cuenta')
  @ApiOperation({ summary: 'Obtener estado de cuenta del cliente' })
  getEstadoCuenta(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.getEstadoCuenta(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un cliente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}
