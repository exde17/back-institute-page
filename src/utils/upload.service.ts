import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'matriculas');

  constructor() {
    this.ensureUploadDirectory();
  }

  /**
   * Asegura que la carpeta de uploads exista
   */
  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log(`📁 Carpeta de uploads creada en: ${this.uploadDir}`);
    }
  }

  /**
   * Configura multer para subida de archivos
   */
  getMulterOptions() {
    return {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          // Crear subcarpetas por tipo de documento
          const typeDir = this.getTypeDirectory(file.fieldname);
          const uploadPath = path.join(this.uploadDir, typeDir);
          
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generar nombre único para el archivo
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 8);
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          
          cb(null, `${name}-${timestamp}-${randomString}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Permitir solo PDF e imágenes
        const allowedMimes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
          'image/webp'
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Archivo no permitido: ${file.mimetype}`), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB máximo
      },
    };
  }

  /**
   * Obtiene la carpeta según el tipo de documento
   */
  private getTypeDirectory(fieldname: string): string {
    const typeMap = {
      documentoEstudiante: 'documentos-estudiantes',
      diplomaCertificadoGrado10: 'diplomas-certificados',
      documentoAcudiente: 'documentos-acudientes',
      formularioMatricula: 'formularios',
    };

    return typeMap[fieldname] || 'otros';
  }

  /**
   * Elimina un archivo del servidor
   */
  deleteFile(filePath: string): boolean {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error al eliminar archivo: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtiene la ruta relativa del archivo subido
   */
  getFilePath(filename: string, fieldname: string): string {
    const typeDir = this.getTypeDirectory(fieldname);
    return `uploads/matriculas/${typeDir}/${filename}`;
  }

  /**
   * Obtiene la URL completa del archivo (para servir)
   */
  getFileUrl(filePath: string, baseUrl: string): string {
    return `${baseUrl}/${filePath}`;
  }
}
