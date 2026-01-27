import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanPagoPredefinidoService } from './plan-pago-predefinido.service';
import { PlanPagoPredefinidoController } from './plan-pago-predefinido.controller';
import { PlanPagoPredefinido } from './entities/plan-pago-predefinido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanPagoPredefinido])],
  controllers: [PlanPagoPredefinidoController],
  providers: [PlanPagoPredefinidoService],
  exports: [PlanPagoPredefinidoService, TypeOrmModule],
})
export class PlanPagoPredefinidoModule {}
