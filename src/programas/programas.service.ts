import { Injectable } from '@nestjs/common';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Programa } from './entities/programa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa) private programaRepository: Repository<Programa>
  ){}
  async create(createProgramaDto: CreateProgramaDto) {
    try {
      const programa = this.programaRepository.create(createProgramaDto);
      await this.programaRepository.save(programa);
      return programa;
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear el programa');
    }
  }

  async findAll() {
    try {
      return await this.programaRepository.find();
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener los programas');
    }
  }

  async findOne(id: string) {
    try {
      return await this.programaRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el programa');
    }
  }

  async update(id: string, updateProgramaDto: UpdateProgramaDto) {
    try {
      await this.programaRepository.update(id, updateProgramaDto);
      return await this.programaRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar el programa');
    }
  }

  async remove(id: number) {
    try {
      await this.programaRepository.delete(id);
      return { deleted: true };
    } catch (error) {
      console.error(error);
      throw new Error('Error al eliminar el programa');
    }
  }
}
