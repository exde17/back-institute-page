import { Injectable } from '@nestjs/common';
import { CreatePlanPagoDto } from './dto/create-plan-pago.dto';
import { UpdatePlanPagoDto } from './dto/update-plan-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanPago } from './entities/plan-pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanPagoService {
  constructor(
    @InjectRepository(PlanPago)
    private readonly planPagoRepository: Repository<PlanPago>,
  ) {}


  async create(createPlanPagoDto: CreatePlanPagoDto) {
    try {
      const planPago = this.planPagoRepository.create(createPlanPagoDto);
      await this.planPagoRepository.save(planPago);
      return "Plan de pago creado exitosamente";
      
    } catch (error) {
      console.error('Error al crear el plan de pago:', error);
      throw new Error('No se pudo crear el plan de pago');
      
    }
  }

  async findAll() {
    try {
      return await this.planPagoRepository.find();
      
    } catch (error) {
      console.error('Error al obtener los planes de pago:', error);
      throw new Error('No se pudieron obtener los planes de pago');
      
    }
  }

  async findOne(id: string) {
    try {
      return await this.planPagoRepository.findOneBy({ id });
      
    } catch (error) {
      console.error('Error al obtener el plan de pago:', error);
      throw new Error('No se pudo obtener el plan de pago');
    }
  }

  async update(id: string, updatePlanPagoDto: UpdatePlanPagoDto) {
    try {
      await this.planPagoRepository.update(id, updatePlanPagoDto);
      return await this.planPagoRepository.findOneBy({ id });
      
    } catch (error) {
      console.error('Error al actualizar el plan de pago:', error);
      throw new Error('No se pudo actualizar el plan de pago');
      
    }
  }

  async remove(id: string) {
    try {
      await this.planPagoRepository.delete(id);
      return 'Plan de pago eliminado exitosamente';
      
    } catch (error) {
      console.error('Error al eliminar el plan de pago:', error);
      throw new Error('No se pudo eliminar el plan de pago');
      
    }
  }
}
