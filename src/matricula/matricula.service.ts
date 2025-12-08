import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { Matricula } from './entities/matricula.entity';
import { UploadService } from 'src/utils/upload.service';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private matriculaRepository: Repository<Matricula>,
    private uploadService: UploadService,
  ) {}

  async create(createMatriculaDto: CreateMatriculaDto) {
    const matricula = this.matriculaRepository.create({
      estudiante: { id: createMatriculaDto.estudianteId } as any,
      documentoEstudiante: createMatriculaDto.documentoEstudiante,
      diplomaCertificadoGrado10: createMatriculaDto.diplomaCertificadoGrado10,
      documentoAcudiente: createMatriculaDto.documentoAcudiente,
      formularioMatricula: createMatriculaDto.formularioMatricula,
    });

    return await this.matriculaRepository.save(matricula);
  }

  async findAll() {
    return await this.matriculaRepository.find({
      relations: ['estudiante'],
    });
  }

  async findOne(id: string) {
    const matricula = await this.matriculaRepository.findOne({
      where: { estudiante: { id } },
      relations: ['estudiante'],
    });

    if (!matricula) {
      throw new NotFoundException(`Matrícula con id ${id} no encontrada`);
    }

    return matricula;
  }

  async update(id: string, updateMatriculaDto: UpdateMatriculaDto) {
    const matricula = await this.findOne(id);

    // Si hay nuevos archivos, eliminar los antiguos
    if (updateMatriculaDto.documentoEstudiante && matricula.documentoEstudiante) {
      this.uploadService.deleteFile(matricula.documentoEstudiante);
    }

    if (updateMatriculaDto.diplomaCertificadoGrado10 && matricula.diplomaCertificadoGrado10) {
      this.uploadService.deleteFile(matricula.diplomaCertificadoGrado10);
    }

    if (updateMatriculaDto.documentoAcudiente && matricula.documentoAcudiente) {
      this.uploadService.deleteFile(matricula.documentoAcudiente);
    }

    if (updateMatriculaDto.formularioMatricula && matricula.formularioMatricula) {
      this.uploadService.deleteFile(matricula.formularioMatricula);
    }

    // Actualizar solo los campos que se envían
    Object.assign(matricula, updateMatriculaDto);

    return await this.matriculaRepository.save(matricula);
  }

  async remove(id: string) {
    const matricula = await this.findOne(id);

    // Eliminar archivos asociados
    if (matricula.documentoEstudiante) {
      this.uploadService.deleteFile(matricula.documentoEstudiante);
    }
    if (matricula.diplomaCertificadoGrado10) {
      this.uploadService.deleteFile(matricula.diplomaCertificadoGrado10);
    }
    if (matricula.documentoAcudiente) {
      this.uploadService.deleteFile(matricula.documentoAcudiente);
    }
    if (matricula.formularioMatricula) {
      this.uploadService.deleteFile(matricula.formularioMatricula);
    }

    return await this.matriculaRepository.remove(matricula);
  }
}
