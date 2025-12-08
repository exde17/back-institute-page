import { Injectable } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Grupo } from './entities/grupo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
  ) {}
  async create(createGrupoDto: CreateGrupoDto) {
    try {
      const grupo = this.grupoRepository.create({ ...createGrupoDto });
      await this.grupoRepository.save(grupo);
      return 'Grupo created successfully';
      
    } catch (error) {
      console.error('Error creating grupo:', error);
      return error;
      
    }
  }

  async findAll() {
    try {
      const grupos = await this.grupoRepository.find();
      return grupos;
    } catch (error) {
      console.error('Error finding grupos:', error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const grupo = await this.grupoRepository.findOneBy({ id });
      return grupo;
    } catch (error) {
      console.error(`Error finding grupo with id ${id}:`, error);
      return error;
    }
  }

  async update(id: string, updateGrupoDto: UpdateGrupoDto) {
    try {
      await this.grupoRepository.update(id, updateGrupoDto);
      return `Grupo with id ${id} updated successfully`;
    } catch (error) {
      console.error(`Error updating grupo with id ${id}:`, error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.grupoRepository.delete(id);
      return `Grupo with id ${id} removed successfully`;
    } catch (error) {
      console.error(`Error removing grupo with id ${id}:`, error);
      return error;
    }
  }
}
