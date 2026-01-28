import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { WompiWebhookDto } from './dto/wompi-webhook.dto';
import { Pago, EstadoPago, MetodoPago } from './entities/pago.entity';
import { Matricula } from 'src/matricula/entities/matricula.entity';

@Injectable()
export class PagoService {
  private readonly logger = new Logger(PagoService.name);

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Matricula)
    private readonly matriculaRepository: Repository<Matricula>,
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

      if (!pago) {
        // Si no existe, crear un nuevo pago
        // Intentar encontrar la matrícula por la referencia
        let matricula: Matricula | null = null;

        // La referencia podría contener información sobre la matrícula
        // Aquí deberías implementar tu lógica para encontrar la matrícula
        // Por ejemplo, si la referencia contiene el ID de la matrícula
        // matricula = await this.matriculaRepository.findOne({ where: { ... } });

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
      }

      // Guardar el pago
      await this.pagoRepository.save(pago);

      this.logger.log(`Pago ${pago.id} procesado exitosamente con estado ${estadoPago}`);

      return {
        success: true,
        message: 'Webhook procesado correctamente',
        pagoId: pago.id,
      };
    } catch (error) {
      this.logger.error(`Error procesando webhook de Wompi: ${error.message}`, error.stack);
      throw error;
    }
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
