import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanPagoService } from './plan-pago.service';
import { CreatePlanPagoDto } from './dto/create-plan-pago.dto';
import { UpdatePlanPagoDto } from './dto/update-plan-pago.dto';

@Controller('plan-pago')
export class PlanPagoController {
  constructor(private readonly planPagoService: PlanPagoService) {}

  @Post()
  create(@Body() createPlanPagoDto: CreatePlanPagoDto) {
    return this.planPagoService.create(createPlanPagoDto);
  }

  @Get()
  findAll() {
    return this.planPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planPagoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanPagoDto: UpdatePlanPagoDto) {
    return this.planPagoService.update(id, updatePlanPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planPagoService.remove(id);
  }
}
