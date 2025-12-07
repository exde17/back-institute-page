import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadoEstudianteService } from './estado-estudiante.service';
import { CreateEstadoEstudianteDto } from './dto/create-estado-estudiante.dto';
import { UpdateEstadoEstudianteDto } from './dto/update-estado-estudiante.dto';

@Controller('estado-estudiante')
export class EstadoEstudianteController {
  constructor(private readonly estadoEstudianteService: EstadoEstudianteService) {}

  @Post()
  create(@Body() createEstadoEstudianteDto: CreateEstadoEstudianteDto) {
    return this.estadoEstudianteService.create(createEstadoEstudianteDto);
  }

  @Get()
  findAll() {
    return this.estadoEstudianteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadoEstudianteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstadoEstudianteDto: UpdateEstadoEstudianteDto) {
    return this.estadoEstudianteService.update(id, updateEstadoEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadoEstudianteService.remove(id);
  }
}
