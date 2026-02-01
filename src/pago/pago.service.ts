import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { WompiWebhookDto } from './dto/wompi-webhook.dto';
import { Pago, EstadoPago, MetodoPago } from './entities/pago.entity';
import { Matricula, EstadoMatricula } from 'src/matricula/entities/matricula.entity';
import { Cuota, EstadoCuota } from 'src/cuota/entities/cuota.entity';

@Injectable()
export class PagoService {
  private readonly logger = new Logger(PagoService.name);

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
    @InjectRepository(Cuota)
    private readonly cuotaRepository: Repository<Cuota>,
  ) {}

  create(createPagoDto: CreatePagoDto) {
    return 'This action adds a new pago';
  }

  async handleWompiWebhook(webhookData: WompiWebhookDto) {
    this.logger.log(`Recibiendo webhook de Wompi: ${JSON.stringify(webhookData)}`);

    const { data, event, signature, timestamp, environment } = webhookData;
    const transaction = data.transaction;

    try {
      // Buscar si ya existe un pago con este ID de transacción de Wompi
      let pago = await this.pagoRepository.findOne({
        where: { wompi_transaccion: transaction.id },
        relations: ['matricula'],
      });

      // Determinar el estado del pago basado en el status de Wompi
      let estadoPago: EstadoPago;
      switch (transaction.status) {
        case 'APPROVED':
          estadoPago = EstadoPago.COMPLETADO;
          break;
        case 'DECLINED':
        case 'ERROR':
          estadoPago = EstadoPago.FALLIDO;
          break;
        case 'PENDING':
        case 'VOIDED':
          estadoPago = EstadoPago.PENDIENTE;
          break;
        default:
          estadoPago = EstadoPago.PENDIENTE;
      }

      // Determinar el método de pago
      let metodoPago: MetodoPago = MetodoPago.TARJETA_CREDITO;
      if (transaction.payment_method_type === 'CARD') {
        if (transaction.payment_method.extra?.card_type === 'CREDIT') {
          metodoPago = MetodoPago.TARJETA_CREDITO;
        } else if (transaction.payment_method.extra?.card_type === 'DEBIT') {
          metodoPago = MetodoPago.TARJETA_DEBITO;
        }
      } else if (transaction.payment_method_type === 'BANCOLOMBIA_TRANSFER') {
        metodoPago = MetodoPago.TRANSFERENCIA_BANCARIA;
      }

      // Convertir el monto de centavos a pesos
      const montoEnPesos = transaction.amount_in_cents / 100;

      // Parsear el SKU para identificar el tipo de pago y el ID
      // Formato: "c:{uuid}" para cuota, "m:{uuid}" para matrícula, "i:{uuid}" para inscripción
      // El UUID viene sin guiones para cumplir con el límite de 36 caracteres de Wompi
      let tipoReferencia: 'cuota' | 'matricula' | 'inscripcion' | null = null;
      let referenciaId: string | null = null;
      const sku = transaction.sku;

      if (sku) {
        const [tipo, uuidSinGuiones] = sku.split(':');

        // Mapear el prefijo corto al tipo completo
        if (tipo === 'c') {
          tipoReferencia = 'cuota';
        } else if (tipo === 'm') {
          tipoReferencia = 'matricula';
        } else if (tipo === 'i') {
          tipoReferencia = 'inscripcion';
        }

        // Reconstruir el UUID con guiones: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        if (uuidSinGuiones && uuidSinGuiones.length === 32) {
          referenciaId = `${uuidSinGuiones.slice(0, 8)}-${uuidSinGuiones.slice(8, 12)}-${uuidSinGuiones.slice(12, 16)}-${uuidSinGuiones.slice(16, 20)}-${uuidSinGuiones.slice(20)}`;
        }

        this.logger.log(`SKU parseado: tipo=${tipoReferencia}, id=${referenciaId}`);
      }

      let matricula: Matricula | null = null;

      // Procesar según el tipo de referencia del SKU
      if (tipoReferencia === 'cuota' && referenciaId) {
        // Buscar la cuota específica
        const cuota = await this.cuotaRepository.findOne({
          where: { id: referenciaId },
          relations: ['matricula'],
        });

        if (cuota) {
          matricula = cuota.matricula;

          // Si el pago fue aprobado, actualizar la cuota
          if (estadoPago === EstadoPago.COMPLETADO) {
            cuota.pagado = true;
            cuota.estado = EstadoCuota.PAGADO;
            cuota.fechaPago = transaction.finalized_at ? new Date(transaction.finalized_at) : new Date();
            cuota.wompiTransaccion = transaction.id;
            await this.cuotaRepository.save(cuota);

            this.logger.log(`Cuota ${cuota.id} marcada como pagada`);

            // Actualizar estado de la matrícula
            await this.actualizarEstadoMatricula(cuota.matricula.id);
          }
        } else {
          this.logger.warn(`Cuota con ID ${referenciaId} no encontrada`);
        }
      } else if (tipoReferencia === 'matricula' && referenciaId) {
        // Buscar la matrícula directamente (pago de contado)
        matricula = await this.matriculaRepository.findOne({
          where: { id: referenciaId },
        });

        if (matricula && estadoPago === EstadoPago.COMPLETADO) {
          // Pago de contado aprobado - marcar matrícula como pagada
          matricula.estadoMatricula = EstadoMatricula.PAGADO;
          await this.matriculaRepository.save(matricula);

          this.logger.log(`Matrícula ${matricula.id} marcada como pagada (contado)`);
        } else if (!matricula) {
          this.logger.warn(`Matrícula con ID ${referenciaId} no encontrada`);
        }
      }

      if (!pago) {
        // Si no existe, crear un nuevo pago
        pago = this.pagoRepository.create({
          wompi_transaccion: transaction.id,
          referenciaPago: transaction.reference,
          monto: montoEnPesos,
          metodo: metodoPago,
          estado: estadoPago,
          fechaPago: transaction.finalized_at ? new Date(transaction.finalized_at) : new Date(),
          raw_response: JSON.stringify(webhookData),
          matricula: matricula,
        });
      } else {
        // Si existe, actualizar el pago
        pago.estado = estadoPago;
        pago.monto = montoEnPesos;
        pago.metodo = metodoPago;
        pago.fechaPago = transaction.finalized_at ? new Date(transaction.finalized_at) : pago.fechaPago;
        pago.raw_response = JSON.stringify(webhookData);
        pago.updatedAt = new Date();
        // Si no tenía matrícula asociada, asociarla ahora
        if (!pago.matricula && matricula) {
          pago.matricula = matricula;
        }
      }

      // Guardar el pago
      await this.pagoRepository.save(pago);

      this.logger.log(`Pago ${pago.id} procesado exitosamente con estado ${estadoPago}`);

      return {
        success: true,
        message: 'Webhook procesado correctamente',
        pagoId: pago.id,
        tipoReferencia,
        referenciaId,
      };
    } catch (error) {
      this.logger.error(`Error procesando webhook de Wompi: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Actualiza el estado de una matrícula basándose en el estado de sus cuotas
   */
  private async actualizarEstadoMatricula(matriculaId: string): Promise<void> {
    const matricula = await this.matriculaRepository.findOne({
      where: { id: matriculaId },
      relations: ['cuotas'],
    });

    if (!matricula) {
      this.logger.warn(`Matrícula ${matriculaId} no encontrada para actualizar estado`);
      return;
    }

    const totalCuotas = matricula.cuotas.length;
    const cuotasPagadas = matricula.cuotas.filter(c => c.pagado).length;

    if (totalCuotas === 0) {
      return;
    }

    if (cuotasPagadas === totalCuotas) {
      matricula.estadoMatricula = EstadoMatricula.PAGADO;
      this.logger.log(`Matrícula ${matriculaId} actualizada a PAGADO (${cuotasPagadas}/${totalCuotas} cuotas)`);
    } else if (cuotasPagadas > 0) {
      matricula.estadoMatricula = EstadoMatricula.PAGO_PARCIAL;
      this.logger.log(`Matrícula ${matriculaId} actualizada a PAGO_PARCIAL (${cuotasPagadas}/${totalCuotas} cuotas)`);
    }

    await this.matriculaRepository.save(matricula);
  }

  findAll() {
    return `This action returns all pago`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pago`;
  }

  update(id: number, updatePagoDto: UpdatePagoDto) {
    return `This action updates a #${id} pago`;
  }

  remove(id: number) {
    return `This action removes a #${id} pago`;
  }
}
