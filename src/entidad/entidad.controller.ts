import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EntidadService } from './entidad.service';
import { CreateEntidadDto } from './dto/create-entidad.dto';
import { UpdateEntidadDto } from './dto/update-entidad.dto';

@Controller('entidad')
export class EntidadController {
  constructor(private readonly entidadService: EntidadService) {}

  @Post()
  create(@Body() createEntidadDto: CreateEntidadDto) {
    return this.entidadService.create(createEntidadDto);
  }

  @Get()
  findAll() {
    return this.entidadService.findAll();
  }

  @Get('activas')
  findAllActive() {
    return this.entidadService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.entidadService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEntidadDto: UpdateEntidadDto,
  ) {
    return this.entidadService.update(id, updateEntidadDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.entidadService.remove(id);
  }
}
