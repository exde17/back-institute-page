import { Injectable } from '@nestjs/common';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Municipio } from './entities/municipio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MunicipioService {
  constructor(
    @InjectRepository(Municipio)
    private municipioRepository: Repository<Municipio>,
  ) {}
  async create(createMunicipioDto: CreateMunicipioDto) {
    try {
      const municipio = this.municipioRepository.create({ ...createMunicipioDto });
      await this.municipioRepository.save(municipio);
      return 'Municipio created successfully';
      
    } catch (error) {
      console.error('Error creating municipio:', error);
      return error;
      
    }
  }

  async findAll() {
    try {
      const municipios = await this.municipioRepository.find();
      return municipios;
    } catch (error) {
      console.error('Error finding municipios:', error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const municipio = await this.municipioRepository.findOneBy({ id });
      return municipio;
    } catch (error) {
      console.error(`Error finding municipio with id ${id}:`, error);
      return error;
    }
  }

  async update(id: string, updateMunicipioDto: UpdateMunicipioDto) {
    try {
      await this.municipioRepository.update(id, updateMunicipioDto);
      return `Municipio with id ${id} updated successfully`;
    } catch (error) {
      console.error(`Error updating municipio with id ${id}:`, error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.municipioRepository.delete(id);
      return `Municipio with id ${id} removed successfully`;
    } catch (error) {
      console.error(`Error removing municipio with id ${id}:`, error);
      return error;
    }
  }
}
