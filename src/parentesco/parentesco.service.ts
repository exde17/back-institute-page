import { Injectable } from '@nestjs/common';
import { CreateParentescoDto } from './dto/create-parentesco.dto';
import { UpdateParentescoDto } from './dto/update-parentesco.dto';
import { Repository } from 'typeorm';
import { Parentesco } from './entities/parentesco.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParentescoService {
  constructor(
    @InjectRepository(Parentesco) private readonly parentescoRepository: Repository<Parentesco>
  ) {}
  create(createParentescoDto: CreateParentescoDto) {
    return 'This action adds a new parentesco';
  }

  async findAll() {
    try {
      return await this.parentescoRepository.find();
    } catch (error) {
      console.error('Error fetching parentescos:', error);
      return error;
      
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} parentesco`;
  }

  update(id: number, updateParentescoDto: UpdateParentescoDto) {
    return `This action updates a #${id} parentesco`;
  }

  remove(id: number) {
    return `This action removes a #${id} parentesco`;
  }
}
