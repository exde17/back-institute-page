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
import { CuotaService } from './cuota.service';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { UpdateCuotaDto } from './dto/update-cuota.dto';

@Controller('cuota')
export class CuotaController {
  constructor(private readonly cuotaService: CuotaService) {}

  @Post()
  create(@Body() createCuotaDto: CreateCuotaDto) {
    return this.cuotaService.create(createCuotaDto);
  }

  @Get()
  findAll() {
    return this.cuotaService.findAll();
  }

  @Get('matricula/:matriculaId')
  findByMatricula(@Param('matriculaId', ParseUUIDPipe) matriculaId: string) {
    return this.cuotaService.findByMatricula(matriculaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cuotaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCuotaDto: UpdateCuotaDto,
  ) {
    return this.cuotaService.update(id, updateCuotaDto);
  }

  @Patch(':id/marcar-pagado')
  marcarPagado(@Param('id', ParseUUIDPipe) id: string) {
    return this.cuotaService.marcarPagado(id);
  }

  @Post(':id/generar-link')
  generarLinkPago(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('email') email: string,
  ) {
    return this.cuotaService.generarLinkPago(id, email);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cuotaService.remove(id);
  }
}
