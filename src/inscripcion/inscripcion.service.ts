import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Repository, DataSource } from 'typeorm';
import { Pago } from 'src/pago/entities/pago.entity';
import { Programa } from 'src/programas/entities/programa.entity';
import { User } from '../user/entities/user.entity';
import { MailService } from 'src/mail/mail.service';

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
    private readonly mailService: MailService,
  ){}

  async create(user: User, createInscripcionDto: CreateInscripcionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log('Creando inscripcion para el usuario:', user.id);
      console.log('Programa ID:', createInscripcionDto.programa);
      
      // Verificar si ya existe una inscripción con ese usuario y programa
      const inscripcionExistente = await queryRunner.manager
        .createQueryBuilder(Inscripcion, 'inscripcion')
        .where('inscripcion.userId = :userId', { userId: user.id })
        .andWhere('inscripcion.programaId = :programaId', { programaId: createInscripcionDto.programa })
        .getOne();
      
      console.log('Inscripción existente encontrada:', inscripcionExistente);
          
      if (inscripcionExistente) {
        throw new HttpException('Ya existe una inscripción para este usuario en este programa', HttpStatus.CONFLICT);
      }

      const inscripcion = queryRunner.manager.create(Inscripcion, {
        observacion: createInscripcionDto.observacion,
        user: { id: user.id },
        programa: { id: createInscripcionDto.programa }
      });
      await queryRunner.manager.save(Inscripcion, inscripcion);
      
      // buscar el valor del programa para ponerlo en pago inicial
      const programa = await queryRunner.manager.findOne(Programa, {
        where: { id: createInscripcionDto.programa },
      });

      if (!programa) {
        throw new HttpException('Programa no encontrado', HttpStatus.NOT_FOUND);
      }

      // crear un pago inicial asociado a la inscripcion
      const pagoInicial = queryRunner.manager.create(Pago, {
        monto: programa.costo,
        inscripcion: inscripcion,
        referenciaPago: user.email, // solo para tener un dato en referenciaPago
      });
      await queryRunner.manager.save(Pago, pagoInicial);

      await queryRunner.commitTransaction();
      
      // Enviar correo de confirmación después de que la transacción sea exitosa
      await this.mailService.sendInscripcionConfirmation(
        user.email,
        `${user.firstName} ${user.lastName}`,
        {
          nombre: programa.nombre,
          descripcion: programa.descripcion,
          duracion: `${programa.duracion} semestres`,
        },
        {
          nombre: 'FCM INSTITUTE',
          direccion: 'Cra. 13B # 62A - 16, Montería-Córdoba',
          telefono: '+(57) 302 4340389',
          email: 'direccionn@fundacioncolombiamia.org',
        }
      );
      
      return {
        message: 'Inscripcion creada exitosamente',
        inscripcion: {
          id: inscripcion.id,
          programa: programa.nombre,
          fechaInscripcion: inscripcion.fechaInscripcion,
        }
      };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      
      // Re-lanzar HttpException para que llegue al frontend con el mensaje correcto
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Para cualquier otro error, lanzar un error genérico
      throw new HttpException('Error al crear la inscripción', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const inscripciones = await this.inscripcionRepository.find({
        relations: ['user', 'programa', 'pagos'],
      });
      return inscripciones;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching inscripciones');
    }
  }

  async findByUserId(userId: string) {
    try {
      const inscripciones = await this.inscripcionRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'programa', 'matriculas'],
      });
      return inscripciones;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las inscripciones del usuario', HttpStatus.INTERNAL_SERVER_ERROR);
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
      const updateData: any = {
        observacion: updateInscripcionDto.observacion,
      };
      
      if (updateInscripcionDto.programa) {
        updateData.programa = { id: updateInscripcionDto.programa };
      }
      
      await this.inscripcionRepository.update(id, updateData);
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
