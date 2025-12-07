import { Injectable } from '@nestjs/common';
import { CreateCategoriaEstudianteDto } from './dto/create-categoria-estudiante.dto';
import { UpdateCategoriaEstudianteDto } from './dto/update-categoria-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEstudiante } from './entities/categoria-estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaEstudianteService {
  constructor(
    @InjectRepository(CategoriaEstudiante) private readonly categoriaEstudianteRepository: Repository<CategoriaEstudiante>
  ){

  }
  async create(createCategoriaEstudianteDto: CreateCategoriaEstudianteDto) {
    try {
      const categoriaEstudiante = this.categoriaEstudianteRepository.create(createCategoriaEstudianteDto);
      await this.categoriaEstudianteRepository.save(categoriaEstudiante);
      return 'CategoriaEstudiante created successfully';
      
    } catch (error) {

      console.error('Error creating categoriaEstudiante:', error);
      return error;
      
    }
  }

  async findAll() {
    try {
      return await this.categoriaEstudianteRepository.find();
      
    } catch (error) {
      console.error('Error fetching categoriaEstudiantes:', error);
      return error;
      
    }
  }

  async findOne(id: string) {
    try {
      const categoriaEstudiante = await this.categoriaEstudianteRepository.findOneBy({ id });
      return categoriaEstudiante;
      
    } catch (error) {
      console.error(`Error fetching categoriaEstudiante with id ${id}:`, error);
      return error;
      
    }
  }

  async update(id: string, updateCategoriaEstudianteDto: UpdateCategoriaEstudianteDto) {
    try {
      await this.categoriaEstudianteRepository.update(id, updateCategoriaEstudianteDto);
      return `CategoriaEstudiante with id ${id} updated successfully`;
      
    } catch (error) {
      console.error(`Error updating categoriaEstudiante with id ${id}:`, error);
      return error;
      
    }
  }

  async remove(id: string) {
    try {
      await this.categoriaEstudianteRepository.delete(id);
      return `CategoriaEstudiante with id ${id} removed successfully`;
      
    } catch (error) {
      console.error(`Error removing categoriaEstudiante with id ${id}:`, error);
      return error;
      
    }
  }
}
