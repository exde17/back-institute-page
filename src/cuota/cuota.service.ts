import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuota, EstadoCuota } from './entities/cuota.entity';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { UpdateCuotaDto } from './dto/update-cuota.dto';

@Injectable()
export class CuotaService {
  constructor(
    @InjectRepository(Cuota)
    private cuotaRepository: Repository<Cuota>,
  ) {}

  async create(createCuotaDto: CreateCuotaDto): Promise<Cuota> {
    const cuota = this.cuotaRepository.create({
      ...createCuotaDto,
      matricula: { id: createCuotaDto.matriculaId } as any,
    });
    return await this.cuotaRepository.save(cuota);
  }

  async findAll(): Promise<Cuota[]> {
    return await this.cuotaRepository.find({
      relations: ['matricula'],
      order: { numeroCuota: 'ASC' },
    });
  }

  async findByMatricula(matriculaId: string): Promise<Cuota[]> {
    return await this.cuotaRepository.find({
      where: { matricula: { id: matriculaId } },
      order: { numeroCuota: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Cuota> {
    const cuota = await this.cuotaRepository.findOne({
      where: { id },
      relations: ['matricula', 'matricula.estudiante', 'matricula.inscripcion', 'matricula.inscripcion.programa'],
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota con id ${id} no encontrada`);
    }

    return cuota;
  }

  async update(id: string, updateCuotaDto: UpdateCuotaDto): Promise<Cuota> {
    const cuota = await this.findOne(id);
    Object.assign(cuota, updateCuotaDto);
    return await this.cuotaRepository.save(cuota);
  }

  async marcarPagado(id: string): Promise<Cuota> {
    const cuota = await this.findOne(id);
    cuota.pagado = true;
    cuota.estado = EstadoCuota.PAGADO;
    cuota.fechaPago = new Date();
    return await this.cuotaRepository.save(cuota);
  }

  async generarLinkPago(id: string, email: string): Promise<{ url: string; linkId: string }> {
    const cuota = await this.findOne(id);

    // TODO: Integrate with Wompi API
    // For now, return a placeholder
    const linkId = `wompi_link_${Date.now()}`;
    const url = `https://checkout.wompi.co/l/${linkId}`;

    cuota.wompiLinkId = linkId;
    await this.cuotaRepository.save(cuota);

    return { url, linkId };
  }

  async remove(id: string): Promise<void> {
    const cuota = await this.findOne(id);
    await this.cuotaRepository.remove(cuota);
  }

  async createMultipleCuotas(
    matriculaId: string,
    numeroCuotas: number,
    montoTotal: number,
  ): Promise<Cuota[]> {
    const montoPorCuota = Math.round((montoTotal / numeroCuotas) * 100) / 100;
    const cuotas: Cuota[] = [];

    for (let i = 1; i <= numeroCuotas; i++) {
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);

      const cuota = this.cuotaRepository.create({
        numeroCuota: i,
        monto: montoPorCuota,
        fechaVencimiento,
        estado: EstadoCuota.PENDIENTE,
        pagado: false,
        matricula: { id: matriculaId } as any,
      });

      cuotas.push(await this.cuotaRepository.save(cuota));
    }

    return cuotas;
  }

  async deleteByMatricula(matriculaId: string): Promise<void> {
    await this.cuotaRepository.delete({ matricula: { id: matriculaId } });
  }
}
