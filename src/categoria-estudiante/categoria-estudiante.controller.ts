import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaEstudianteService } from './categoria-estudiante.service';
import { CreateCategoriaEstudianteDto } from './dto/create-categoria-estudiante.dto';
import { UpdateCategoriaEstudianteDto } from './dto/update-categoria-estudiante.dto';

@Controller('categoria-estudiante')
export class CategoriaEstudianteController {
  constructor(private readonly categoriaEstudianteService: CategoriaEstudianteService) {}

  @Post()
  create(@Body() createCategoriaEstudianteDto: CreateCategoriaEstudianteDto) {
    return this.categoriaEstudianteService.create(createCategoriaEstudianteDto);
  }

  @Get()
  findAll() {
    return this.categoriaEstudianteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaEstudianteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaEstudianteDto: UpdateCategoriaEstudianteDto) {
    return this.categoriaEstudianteService.update(id, updateCategoriaEstudianteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaEstudianteService.remove(id);
  }
}
