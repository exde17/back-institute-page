import { Injectable } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Repository, DataSource } from 'typeorm';
import { Pago } from 'src/pago/entities/pago.entity';
import { Programa } from 'src/programas/entities/programa.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion) 
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
    private readonly dataSource: DataSource,
  ){}

  async create(user: User, createInscripcionDto: CreateInscripcionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('Creando inscripcion para el usuario:', user.id);
      const inscripcion = queryRunner.manager.create(Inscripcion, {
        ...createInscripcionDto,
        user: { id: user.id }
      });
      await queryRunner.manager.save(Inscripcion, inscripcion);
      
      // buscar el valor del programa para ponerlo en pago inicial
      const programa = await queryRunner.manager.findOne(Programa, {
        where: { id: createInscripcionDto.programa.id },
      });

      if (!programa) {
        throw new Error('Programa not found');
      }

      // crear un pago inicial asociado a la inscripcion
      const pagoInicial = queryRunner.manager.create(Pago, {
        monto: programa.costo,
        inscripcion: inscripcion,
        referenciaPago: user.email, // solo para tener un dato en referenciaPago
      });
      await queryRunner.manager.save(Pago, pagoInicial);

      await queryRunner.commitTransaction();
      return 'Inscripcion creada exitosamente';
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new Error('Error creating inscripcion');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const inscripciones = await this.inscripcionRepository.find();
      return inscripciones;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching inscripciones');
    }
  }

  async findOne(id: string) {
    try {
      const inscripcion = await this.inscripcionRepository.findOne({ where: { id } });
      if (!inscripcion) {
        throw new Error('Inscripcion not found');
      }
      return inscripcion;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching inscripcion');
    }
  }

  async update(id: string, updateInscripcionDto: UpdateInscripcionDto) {
    try {
      await this.inscripcionRepository.update(id, updateInscripcionDto);
      return `This action updates a #${id} inscripcion`;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating inscripcion');
    }
  }

  async remove(id: string) {
    try {
      await this.inscripcionRepository.delete(id);
      return `This action removes a #${id} inscripcion`;
    } catch (error) {
      console.error(error);
      throw new Error('Error removing inscripcion');
    }
  }
}
