import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendInscripcionConfirmation(
    userEmail: string,
    userName: string,
    programData: {
      nombre: string;
      descripcion: string;
      costo: number;
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
        subject: '¡Inscripción Exitosa! - Confirmación de tu Programa',
        template: './inscripcion-confirmation',
        context: {
          userName,
          programaNombre: programData.nombre,
          programaDescripcion: programData.descripcion,
          programaCosto: programData.costo.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
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
}
