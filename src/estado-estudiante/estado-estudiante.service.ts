import { Injectable } from '@nestjs/common';
import { CreateEstadoEstudianteDto } from './dto/create-estado-estudiante.dto';
import { UpdateEstadoEstudianteDto } from './dto/update-estado-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoEstudiante } from './entities/estado-estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoEstudianteService {
  constructor(
    @InjectRepository(EstadoEstudiante) private readonly estadoEstudianteRepository: Repository<EstadoEstudiante>
  ){}
  async create(createEstadoEstudianteDto: CreateEstadoEstudianteDto) {
   try {
      const estadoEstudiante = this.estadoEstudianteRepository.create(createEstadoEstudianteDto);
      await this.estadoEstudianteRepository.save(estadoEstudiante);
      return 'EstadoEstudiante created successfully';
   } catch (error) {
      console.error('Error creating estadoEstudiante:', error);
      return error;
    
   }
  }

  async findAll() {
    try {
      return await this.estadoEstudianteRepository.find();
    } catch (error) {
      console.error('Error finding estadoEstudiantes:', error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const estadoEstudiante =  await this.estadoEstudianteRepository.findOneBy({ id });
      return estadoEstudiante;
    } catch (error) {
      console.error('Error finding estadoEstudiante:', error);
      return error;
    }
  }

  async update(id: string, updateEstadoEstudianteDto: UpdateEstadoEstudianteDto) {
    try {
      await this.estadoEstudianteRepository.update(id, updateEstadoEstudianteDto);
      return `EstadoEstudiante with id ${id} updated successfully`;
      
    } catch (error) {
      console.error('Error updating estadoEstudiante:', error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.estadoEstudianteRepository.delete(id);
      return `EstadoEstudiante with id ${id} removed successfully`;
    } catch (error) {
      console.error('Error removing estadoEstudiante:', error);
      return error;
    }
  }
}
