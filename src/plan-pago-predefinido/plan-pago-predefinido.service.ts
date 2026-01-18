import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanPagoPredefinido } from './entities/plan-pago-predefinido.entity';
import { CreatePlanPagoPredefinidoDto } from './dto/create-plan-pago-predefinido.dto';
import { UpdatePlanPagoPredefinidoDto } from './dto/update-plan-pago-predefinido.dto';

@Injectable()
export class PlanPagoPredefinidoService {
  constructor(
    @InjectRepository(PlanPagoPredefinido)
    private planPagoPredefinidoRepository: Repository<PlanPagoPredefinido>,
  ) {}

  async create(createDto: CreatePlanPagoPredefinidoDto): Promise<PlanPagoPredefinido> {
    const plan = this.planPagoPredefinidoRepository.create(createDto);
    return await this.planPagoPredefinidoRepository.save(plan);
  }

  async findAll(): Promise<PlanPagoPredefinido[]> {
    return await this.planPagoPredefinidoRepository.find({
      order: { numeroCuotas: 'ASC' },
    });
  }

  async findAllActive(): Promise<PlanPagoPredefinido[]> {
    return await this.planPagoPredefinidoRepository.find({
      where: { isActive: true },
      order: { numeroCuotas: 'ASC' },
    });
  }

  async findOne(id: string): Promise<PlanPagoPredefinido> {
    const plan = await this.planPagoPredefinidoRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException(`Plan de pago con id ${id} no encontrado`);
    }

    return plan;
  }

  async update(id: string, updateDto: UpdatePlanPagoPredefinidoDto): Promise<PlanPagoPredefinido> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return await this.planPagoPredefinidoRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    await this.planPagoPredefinidoRepository.remove(plan);
  }

  async seed(): Promise<void> {
    const existingPlans = await this.planPagoPredefinidoRepository.count();

    if (existingPlans === 0) {
      const planes = [
        { nombre: 'Plan 2 Cuotas', numeroCuotas: 2, descripcion: 'Pago en 2 cuotas mensuales' },
        { nombre: 'Plan 3 Cuotas', numeroCuotas: 3, descripcion: 'Pago en 3 cuotas mensuales' },
        { nombre: 'Plan 6 Cuotas', numeroCuotas: 6, descripcion: 'Pago en 6 cuotas mensuales' },
      ];

      for (const planData of planes) {
        const plan = this.planPagoPredefinidoRepository.create(planData);
        await this.planPagoPredefinidoRepository.save(plan);
      }
    }
  }
}
