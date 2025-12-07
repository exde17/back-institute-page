import { Injectable } from '@nestjs/common';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoDocumento } from './entities/tipo-documento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoDocumentoService {
  constructor(
    @InjectRepository(TipoDocumento)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>
  ){}
  
  create(createTipoDocumentoDto: CreateTipoDocumentoDto) {
    return 'This action adds a new tipoDocumento';
  }

  async findAll() {
    try {
      const tipoDocumentos = await this.tipoDocumentoRepository.find();
      return tipoDocumentos;
      
    } catch (error) {
      console.error('Error fetching tipoDocumentos:', error);
      return error;
      
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} tipoDocumento`;
  }

  update(id: string, updateTipoDocumentoDto: UpdateTipoDocumentoDto) {
    return `This action updates a #${id} tipoDocumento`;
  }

  remove(id: string) {
    return `This action removes a #${id} tipoDocumento`;
  }
}
