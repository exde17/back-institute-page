import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entidad } from './entities/entidad.entity';
import { CreateEntidadDto } from './dto/create-entidad.dto';
import { UpdateEntidadDto } from './dto/update-entidad.dto';

@Injectable()
export class EntidadService {
  constructor(
    @InjectRepository(Entidad)
    private entidadRepository: Repository<Entidad>,
  ) {}

  async create(createEntidadDto: CreateEntidadDto): Promise<Entidad> {
    // Check if NIT already exists
    const existingEntidad = await this.entidadRepository.findOne({
      where: { nit: createEntidadDto.nit },
    });

    if (existingEntidad) {
      throw new ConflictException(`Ya existe una entidad con el NIT ${createEntidadDto.nit}`);
    }

    const entidad = this.entidadRepository.create(createEntidadDto);
    return await this.entidadRepository.save(entidad);
  }

  async findAll(): Promise<Entidad[]> {
    return await this.entidadRepository.find({
      order: { razonSocial: 'ASC' },
    });
  }

  async findAllActive(): Promise<Entidad[]> {
    return await this.entidadRepository.find({
      where: { isActive: true },
      order: { razonSocial: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Entidad> {
    const entidad = await this.entidadRepository.findOne({
      where: { id },
      relations: ['matriculas'],
    });

    if (!entidad) {
      throw new NotFoundException(`Entidad con id ${id} no encontrada`);
    }

    return entidad;
  }

  async update(id: string, updateEntidadDto: UpdateEntidadDto): Promise<Entidad> {
    const entidad = await this.findOne(id);

    // If NIT is being updated, check for conflicts
    if (updateEntidadDto.nit && updateEntidadDto.nit !== entidad.nit) {
      const existingEntidad = await this.entidadRepository.findOne({
        where: { nit: updateEntidadDto.nit },
      });

      if (existingEntidad) {
        throw new ConflictException(`Ya existe una entidad con el NIT ${updateEntidadDto.nit}`);
      }
    }

    Object.assign(entidad, updateEntidadDto);
    return await this.entidadRepository.save(entidad);
  }

  async remove(id: string): Promise<void> {
    const entidad = await this.findOne(id);
    await this.entidadRepository.remove(entidad);
  }
}
