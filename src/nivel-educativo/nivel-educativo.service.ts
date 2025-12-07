import { Injectable } from '@nestjs/common';
import { CreateNivelEducativoDto } from './dto/create-nivel-educativo.dto';
import { UpdateNivelEducativoDto } from './dto/update-nivel-educativo.dto';

@Injectable()
export class NivelEducativoService {
  create(createNivelEducativoDto: CreateNivelEducativoDto) {
    return 'This action adds a new nivelEducativo';
  }

  findAll() {
    return `This action returns all nivelEducativo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nivelEducativo`;
  }

  update(id: number, updateNivelEducativoDto: UpdateNivelEducativoDto) {
    return `This action updates a #${id} nivelEducativo`;
  }

  remove(id: number) {
    return `This action removes a #${id} nivelEducativo`;
  }
}
