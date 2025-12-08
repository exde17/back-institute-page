import { Injectable } from '@nestjs/common';
import { CreateNivelEducativoDto } from './dto/create-nivel-educativo.dto';
import { UpdateNivelEducativoDto } from './dto/update-nivel-educativo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NivelEducativo } from './entities/nivel-educativo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NivelEducativoService {
  constructor(
    @InjectRepository(NivelEducativo)
    private nivelEducativoRepository: Repository<NivelEducativo>,
  ) {}
  async create(createNivelEducativoDto: CreateNivelEducativoDto) {
    try {
      const nivelEducativo = this.nivelEducativoRepository.create({ ...createNivelEducativoDto });
      await this.nivelEducativoRepository.save(nivelEducativo);
      return 'NivelEducativo created successfully';
    } catch (error) {
      console.error('Error creating nivelEducativo:', error);
      return error;
    }
  }

  async findAll() {
    try {
      const nivelesEducativos = await this.nivelEducativoRepository.find();
      return nivelesEducativos;
    } catch (error) {
      console.error('Error finding nivelesEducativos:', error);
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const nivelEducativo = await this.nivelEducativoRepository.findOneBy({ id });
      return nivelEducativo;
    } catch (error) {
      console.error(`Error finding nivelEducativo with id ${id}:`, error);
      return error;
    }
  }

  async update(id: string, updateNivelEducativoDto: UpdateNivelEducativoDto) {
    try {
      await this.nivelEducativoRepository.update(id, updateNivelEducativoDto);
      return `NivelEducativo with id ${id} updated successfully`;
    } catch (error) {
      console.error(`Error updating nivelEducativo with id ${id}:`, error);
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.nivelEducativoRepository.delete(id);
      return `NivelEducativo with id ${id} removed successfully`;
    } catch (error) {
      console.error(`Error removing nivelEducativo with id ${id}:`, error);
      return error;
    }
  }
}
