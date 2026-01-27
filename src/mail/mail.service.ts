import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  private readonly instituteInfo = {
    nombre: 'FCM Institute',
    direccion: 'Cra. 13B # 62A - 16, Montería-Córdoba',
    telefono: '+(57) 302 4340389',
    email: 'direccionn@fundacioncolombiamia.org',
  };

  async sendInscripcionConfirmation(
    userEmail: string,
    userName: string,
    programData: {
      nombre: string;
      descripcion: string;
      duracion: string;
    },
    instituteInfo: {
      nombre: string;
      direccion: string;
      telefono: string;
      email: string;
    }
  ) {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: '¡Pre-inscripción Exitosa! - Confirmación de tu Programa',
        template: './inscripcion-confirmation',
        context: {
          userName,
          programaNombre: programData.nombre,
          programaDescripcion: programData.descripcion,
          programaDuracion: programData.duracion,
          instituteNombre: instituteInfo.nombre,
          instituteDireccion: instituteInfo.direccion,
          instituteTelefono: instituteInfo.telefono,
          instituteEmail: instituteInfo.email,
        },
      });

      console.log(`Correo de confirmación enviado a: ${userEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Error al enviar correo:', error);
      return { success: false, error };
    }
  }

  async sendPagoLink(
    userEmail: string,
    userName: string,
    paymentData: {
      programaNombre: string;
      conceptoPago: string;
      monto: number;
      linkPago: string;
      numeroCuota?: number;
      totalCuotas?: number;
    }
  ) {
    try {
      const montoFormateado = paymentData.monto.toLocaleString('es-CO');

      await this.mailerService.sendMail({
        to: userEmail,
        subject: `Link de Pago - ${paymentData.conceptoPago} - FCM Institute`,
        template: './pago-link',
        context: {
          userName,
          programaNombre: paymentData.programaNombre,
          conceptoPago: paymentData.conceptoPago,
          monto: montoFormateado,
          linkPago: paymentData.linkPago,
          numeroCuota: paymentData.numeroCuota,
          totalCuotas: paymentData.totalCuotas,
          instituteNombre: this.instituteInfo.nombre,
          instituteDireccion: this.instituteInfo.direccion,
          instituteTelefono: this.instituteInfo.telefono,
          instituteEmail: this.instituteInfo.email,
        },
      });

      console.log(`Correo de link de pago enviado a: ${userEmail}`);
      return { success: true };
    } catch (error) {
      console.error('Error al enviar correo de pago:', error);
      return { success: false, error };
    }
  }
}
