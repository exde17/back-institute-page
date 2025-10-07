import { Injectable } from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Noticia } from './entities/noticia.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia) private noticiaRepository: Repository<Noticia>,
  ) {}
  async create(createNoticiaDto: CreateNoticiaDto) {
    try {
      const noticia = this.noticiaRepository.create(createNoticiaDto);
      await this.noticiaRepository.save(noticia);
      return noticia;
    } catch (error) {
      console.error(error);
      throw new Error('Error al crear la noticia');
    }
  }

  async findAll() {
    try {
      return await this.noticiaRepository.find();
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener las noticias');
    }
  }

  async findOne(id: string) {
    try {
      return await this.noticiaRepository.findOne({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener la noticia');
    }
  }

  async update(id: string, updateNoticiaDto: UpdateNoticiaDto) {
    try {
      await this.noticiaRepository.update(id, updateNoticiaDto);
      return await this.noticiaRepository.findOne({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error al actualizar la noticia');
    }
  }

  async remove(id: number) {
    try {
      await this.noticiaRepository.delete(id);
    } catch (error) {
      console.error(error);
      throw new Error('Error al eliminar la noticia');
    }
  }
}
