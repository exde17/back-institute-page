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

      // Obtener el payment_link_id del webhook
      // Este ID se guardó previamente en la cuota o matrícula cuando se generó el link
      const paymentLinkId = transaction.payment_link_id;
      this.logger.log(`Payment Link ID recibido: ${paymentLinkId}`);

      let matricula: Matricula | null = null;
      let tipoReferencia: 'cuota' | 'matricula' | null = null;

      // Buscar por payment_link_id en cuotas y matrículas
      if (paymentLinkId) {
        // Primero buscar en cuotas (pago a cuotas)
        const cuota = await this.cuotaRepository.findOne({
          where: { wompiLinkId: paymentLinkId },
          relations: ['matricula'],
        });

        if (cuota) {
          tipoReferencia = 'cuota';
          matricula = cuota.matricula;
          this.logger.log(`Cuota encontrada: ${cuota.id} para matrícula ${matricula?.id}`);

          // Si el pago fue aprobado, actualizar la cuota
          if (estadoPago === EstadoPago.COMPLETADO) {
            cuota.pagado = true;
            cuota.estado = EstadoCuota.PAGADO;
            cuota.fechaPago = transaction.finalized_at ? new Date(transaction.finalized_at) : new Date();
            cuota.wompiTransaccion = transaction.id;
            await this.cuotaRepository.save(cuota);

            this.logger.log(`Cuota ${cuota.id} marcada como pagada`);

            // Actualizar estado de la matrícula
            if (cuota.matricula?.id) {
              await this.actualizarEstadoMatricula(cuota.matricula.id);
            }
          }
        } else {
          // Si no es cuota, buscar en matrículas (pago de contado o beca)
          matricula = await this.matriculaRepository.findOne({
            where: { wompiLinkId: paymentLinkId },
            relations: ['cuotas'],
          });

          if (matricula) {
            tipoReferencia = 'matricula';
            this.logger.log(`Matrícula encontrada (pago total): ${matricula.id}, esBecado: ${matricula.esBecado}`);

            if (estadoPago === EstadoPago.COMPLETADO) {
              // Pago total aprobado - marcar matrícula como pagada
              matricula.estadoMatricula = EstadoMatricula.PAGADO;
              await this.matriculaRepository.save(matricula);

              // Si la matrícula tiene cuotas (becado que eligió cuotas), marcar todas como pagadas
              if (matricula.cuotas && matricula.cuotas.length > 0) {
                for (const cuota of matricula.cuotas) {
                  if (!cuota.pagado) {
                    cuota.pagado = true;
                    cuota.estado = EstadoCuota.PAGADO;
                    cuota.fechaPago = transaction.finalized_at ? new Date(transaction.finalized_at) : new Date();
                    cuota.wompiTransaccion = transaction.id;
                    await this.cuotaRepository.save(cuota);
                  }
                }
                this.logger.log(`Todas las cuotas (${matricula.cuotas.length}) marcadas como pagadas para matrícula ${matricula.id}`);
              }

              this.logger.log(`Matrícula ${matricula.id} marcada como pagada (pago total/beca)`);
            }
          } else {
            this.logger.warn(`No se encontró cuota ni matrícula con wompiLinkId: ${paymentLinkId}`);
          }
        }
      } else {
        this.logger.warn('No se recibió payment_link_id en el webhook');
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
        paymentLinkId,
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
