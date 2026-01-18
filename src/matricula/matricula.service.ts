import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto, UpdateTipoPagoDto, UpdateBecadoDto } from './dto/update-matricula.dto';
import { Matricula, TipoPago, EstadoMatricula } from './entities/matricula.entity';
import { UploadService } from 'src/utils/upload.service';
import { CuotaService } from 'src/cuota/cuota.service';
import { PlanPagoPredefinidoService } from 'src/plan-pago-predefinido/plan-pago-predefinido.service';
import { EntidadService } from 'src/entidad/entidad.service';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';

@Injectable()
export class MatriculaService {
  constructor(
    @InjectRepository(Matricula)
    private matriculaRepository: Repository<Matricula>,
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
    private uploadService: UploadService,
    private cuotaService: CuotaService,
    private planPagoPredefinidoService: PlanPagoPredefinidoService,
    private entidadService: EntidadService,
  ) {}

  async create(createMatriculaDto: CreateMatriculaDto) {
    const matriculaData: DeepPartial<Matricula> = {
      estudiante: { id: createMatriculaDto.estudianteId },
      inscripcion: { id: createMatriculaDto.inscripcionId },
      documentoEstudiante: createMatriculaDto.documentoEstudiante,
      diplomaCertificadoGrado10: createMatriculaDto.diplomaCertificadoGrado10,
      documentoAcudiente: createMatriculaDto.documentoAcudiente,
      formularioMatricula: createMatriculaDto.formularioMatricula,
      tipoPago: createMatriculaDto.tipoPago,
      valorTotal: createMatriculaDto.valorTotal,
      esBecado: createMatriculaDto.esBecado || false,
    };

    if (createMatriculaDto.planPagoId) {
      matriculaData.planPagoSeleccionado = { id: createMatriculaDto.planPagoId };
    }

    if (createMatriculaDto.entidadId) {
      matriculaData.entidad = { id: createMatriculaDto.entidadId };
    }

    const matricula = this.matriculaRepository.create(matriculaData);
    const savedMatricula = await this.matriculaRepository.save(matricula);

    // If payment type is CUOTAS and a plan is selected, create the installments
    if (createMatriculaDto.tipoPago === TipoPago.CUOTAS && createMatriculaDto.planPagoId && createMatriculaDto.valorTotal) {
      const plan = await this.planPagoPredefinidoService.findOne(createMatriculaDto.planPagoId);
      await this.cuotaService.createMultipleCuotas(
        savedMatricula.id,
        plan.numeroCuotas,
        createMatriculaDto.valorTotal,
      );
    }

    return savedMatricula;
  }

  async findAll() {
    return await this.matriculaRepository.find({
      relations: ['estudiante', 'inscripcion', 'inscripcion.programa', 'entidad', 'planPagoSeleccionado', 'cuotas'],
    });
  }

  async findOne(id: string) {
    const matricula = await this.matriculaRepository.findOne({
      where: { estudiante: { id } },
      relations: ['estudiante', 'inscripcion', 'inscripcion.programa', 'entidad', 'planPagoSeleccionado', 'cuotas'],
    });

    if (!matricula) {
      throw new NotFoundException(`Matrícula con id ${id} no encontrada`);
    }

    return matricula;
  }

  async findOneById(id: string) {
    const matricula = await this.matriculaRepository.findOne({
      where: { id },
      relations: ['estudiante', 'inscripcion', 'inscripcion.programa', 'entidad', 'planPagoSeleccionado', 'cuotas'],
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

  async updateTipoPago(id: string, updateTipoPagoDto: UpdateTipoPagoDto) {
    const matricula = await this.findOneById(id);

    // Delete existing cuotas if any
    await this.cuotaService.deleteByMatricula(id);

    matricula.tipoPago = updateTipoPagoDto.tipoPago;
    matricula.valorTotal = updateTipoPagoDto.valorTotal;

    if (updateTipoPagoDto.tipoPago === TipoPago.CUOTAS && updateTipoPagoDto.planPagoId) {
      const plan = await this.planPagoPredefinidoService.findOne(updateTipoPagoDto.planPagoId);
      matricula.planPagoSeleccionado = plan;

      // Create new cuotas
      await this.cuotaService.createMultipleCuotas(
        id,
        plan.numeroCuotas,
        updateTipoPagoDto.valorTotal,
      );
    } else {
      matricula.planPagoSeleccionado = null;
    }

    return await this.matriculaRepository.save(matricula);
  }

  async updateBecado(id: string, updateBecadoDto: UpdateBecadoDto) {
    const matricula = await this.findOneById(id);

    matricula.esBecado = updateBecadoDto.esBecado;

    if (updateBecadoDto.esBecado && updateBecadoDto.entidadId) {
      const entidad = await this.entidadService.findOne(updateBecadoDto.entidadId);
      matricula.entidad = entidad;
    } else {
      matricula.entidad = null;
    }

    return await this.matriculaRepository.save(matricula);
  }

  async generarLinkPago(id: string, email: string, cuotaId?: string) {
    const matricula = await this.findOneById(id);

    // Determine the email recipient
    let targetEmail = email;
    if (matricula.esBecado && matricula.entidad?.correo) {
      targetEmail = matricula.entidad.correo;
    }

    // TODO: Integrate with Wompi API
    // For now, return a placeholder
    const linkId = `wompi_link_${Date.now()}`;
    const url = `https://checkout.wompi.co/l/${linkId}`;

    return {
      url,
      linkId,
      email: targetEmail,
      monto: cuotaId ? undefined : matricula.valorTotal,
    };
  }

  async getResumenPago(id: string) {
    const matricula = await this.findOneById(id);
    const cuotas = await this.cuotaService.findByMatricula(id);

    const totalPagado = cuotas
      .filter(c => c.pagado)
      .reduce((sum, c) => sum + Number(c.monto), 0);

    const totalPendiente = cuotas
      .filter(c => !c.pagado)
      .reduce((sum, c) => sum + Number(c.monto), 0);

    return {
      matriculaId: id,
      tipoPago: matricula.tipoPago,
      esBecado: matricula.esBecado,
      entidad: matricula.entidad,
      estadoMatricula: matricula.estadoMatricula,
      valorTotal: matricula.valorTotal,
      totalPagado,
      totalPendiente,
      numeroCuotas: cuotas.length,
      cuotasPagadas: cuotas.filter(c => c.pagado).length,
      cuotasPendientes: cuotas.filter(c => !c.pagado).length,
      cuotas,
    };
  }

  async updateEstadoMatricula(id: string) {
    const matricula = await this.findOneById(id);
    const cuotas = await this.cuotaService.findByMatricula(id);

    if (cuotas.length === 0) {
      return matricula;
    }

    const todasPagadas = cuotas.every(c => c.pagado);
    const algunaPagada = cuotas.some(c => c.pagado);

    if (todasPagadas) {
      matricula.estadoMatricula = EstadoMatricula.PAGADO;
    } else if (algunaPagada) {
      matricula.estadoMatricula = EstadoMatricula.PAGO_PARCIAL;
    } else {
      matricula.estadoMatricula = EstadoMatricula.PENDIENTE_PAGO;
    }

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

    // Delete associated cuotas
    await this.cuotaService.deleteByMatricula(matricula.id);

    return await this.matriculaRepository.remove(matricula);
  }
}
