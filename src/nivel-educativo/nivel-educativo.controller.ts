import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NivelEducativoService } from './nivel-educativo.service';
import { CreateNivelEducativoDto } from './dto/create-nivel-educativo.dto';
import { UpdateNivelEducativoDto } from './dto/update-nivel-educativo.dto';

@Controller('nivel-educativo')
export class NivelEducativoController {
  constructor(private readonly nivelEducativoService: NivelEducativoService) {}

  @Post()
  create(@Body() createNivelEducativoDto: CreateNivelEducativoDto) {
    return this.nivelEducativoService.create(createNivelEducativoDto);
  }

  @Get()
  findAll() {
    return this.nivelEducativoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nivelEducativoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNivelEducativoDto: UpdateNivelEducativoDto) {
    return this.nivelEducativoService.update(+id, updateNivelEducativoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nivelEducativoService.remove(+id);
  }
}
