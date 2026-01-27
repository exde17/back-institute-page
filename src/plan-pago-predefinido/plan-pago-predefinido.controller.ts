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
import { PlanPagoPredefinidoService } from './plan-pago-predefinido.service';
import { CreatePlanPagoPredefinidoDto } from './dto/create-plan-pago-predefinido.dto';
import { UpdatePlanPagoPredefinidoDto } from './dto/update-plan-pago-predefinido.dto';

@Controller('plan-pago-predefinido')
export class PlanPagoPredefinidoController {
  constructor(private readonly planPagoPredefinidoService: PlanPagoPredefinidoService) {}

  @Post()
  create(@Body() createDto: CreatePlanPagoPredefinidoDto) {
    return this.planPagoPredefinidoService.create(createDto);
  }

  @Get()
  findAll() {
    return this.planPagoPredefinidoService.findAllActive();
  }

  @Get('todos')
  findAllIncludingInactive() {
    return this.planPagoPredefinidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.planPagoPredefinidoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePlanPagoPredefinidoDto,
  ) {
    return this.planPagoPredefinidoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.planPagoPredefinidoService.remove(id);
  }

  @Post('seed')
  seed() {
    return this.planPagoPredefinidoService.seed();
  }
}
