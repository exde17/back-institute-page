import { Injectable } from '@nestjs/common';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
  ){}
  async create(createDepartamentoDto: CreateDepartamentoDto) {
    try {
      const departamento = this.departamentoRepository.create({...createDepartamentoDto});
      await this.departamentoRepository.save(departamento);
      return 'Departamento created successfully';
      
    } catch (error) {
      console.error('Error creating departamento:', error);
      return error;
      
    }
  }

  async findAll() {
    try {
      const departamentos = await this.departamentoRepository.find();
      return departamentos;
    } catch (error) {
      console.error('Error finding departamentos:', error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const departamento = await this.departamentoRepository.findOneBy({ id });
      return departamento;
    } catch (error) {
      console.error(`Error finding departamento with id ${id}:`, error);
      return error;
    }
  }

  async update(id: string, updateDepartamentoDto: UpdateDepartamentoDto) {
    try {
      await this.departamentoRepository.update(id, updateDepartamentoDto);
      return `Departamento with id ${id} updated successfully`;
    } catch (error) {
      console.error(`Error updating departamento with id ${id}:`, error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.departamentoRepository.delete(id);
      return `Departamento with id ${id} removed successfully`;
    } catch (error) {
      console.error(`Error removing departamento with id ${id}:`, error);
      return error;
    }
  }
}
