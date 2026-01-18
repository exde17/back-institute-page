import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MatriculaService } from './matricula.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto, UpdateTipoPagoDto, UpdateBecadoDto, GenerarLinkPagoDto } from './dto/update-matricula.dto';
import { UploadService } from 'src/utils/upload.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import * as multer from 'multer';

// Configurar storage personalizado
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldName = file.fieldname;
    const destPath = path.join(process.cwd(), 'uploads/matriculas', fieldName);

    // Crear directorio si no existe
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const fieldName = file.fieldname;
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `${fieldName}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

@Controller('matricula')
export class MatriculaController {
  constructor(
    private readonly matriculaService: MatriculaService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'documentoEstudiante', maxCount: 1 },
        { name: 'diplomaCertificadoGrado10', maxCount: 1 },
        { name: 'documentoAcudiente', maxCount: 1 },
        { name: 'formularioMatricula', maxCount: 1 },
      ],
      {
        storage: storage,
        limits: { fileSize: 50 * 1024 * 1024 },
      },
    ),
  )
  create(
    @Body() createMatriculaDto: CreateMatriculaDto,
    @UploadedFiles()
    files: any,
  ) {
    // Mapear archivos a rutas en la DTO
    if (files?.documentoEstudiante?.[0]) {
      createMatriculaDto.documentoEstudiante = `uploads/matriculas/documentoEstudiante/${files.documentoEstudiante[0].filename}`;
    }

    if (files?.diplomaCertificadoGrado10?.[0]) {
      createMatriculaDto.diplomaCertificadoGrado10 = `uploads/matriculas/diplomaCertificadoGrado10/${files.diplomaCertificadoGrado10[0].filename}`;
    }

    if (files?.documentoAcudiente?.[0]) {
      createMatriculaDto.documentoAcudiente = `uploads/matriculas/documentoAcudiente/${files.documentoAcudiente[0].filename}`;
    }

    if (files?.formularioMatricula?.[0]) {
      createMatriculaDto.formularioMatricula = `uploads/matriculas/formularioMatricula/${files.formularioMatricula[0].filename}`;
    }

    return this.matriculaService.create(createMatriculaDto);
  }

  @Get()
  findAll() {
    return this.matriculaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matriculaService.findOne(id);
  }

  @Get('by-id/:id')
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.matriculaService.findOneById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'documentoEstudiante', maxCount: 1 },
        { name: 'diplomaCertificadoGrado10', maxCount: 1 },
        { name: 'documentoAcudiente', maxCount: 1 },
        { name: 'formularioMatricula', maxCount: 1 },
      ],
      {
        storage: storage,
        limits: { fileSize: 50 * 1024 * 1024 },
      },
    ),
  )
  update(
    @Param('id') id: string,
    @Body() updateMatriculaDto: UpdateMatriculaDto,
    @UploadedFiles()
    files: any,
  ) {
    // Mapear archivos a rutas en la DTO
    if (files?.documentoEstudiante?.[0]) {
      updateMatriculaDto.documentoEstudiante = `uploads/matriculas/documentoEstudiante/${files.documentoEstudiante[0].filename}`;
    }

    if (files?.diplomaCertificadoGrado10?.[0]) {
      updateMatriculaDto.diplomaCertificadoGrado10 = `uploads/matriculas/diplomaCertificadoGrado10/${files.diplomaCertificadoGrado10[0].filename}`;
    }

    if (files?.documentoAcudiente?.[0]) {
      updateMatriculaDto.documentoAcudiente = `uploads/matriculas/documentoAcudiente/${files.documentoAcudiente[0].filename}`;
    }

    if (files?.formularioMatricula?.[0]) {
      updateMatriculaDto.formularioMatricula = `uploads/matriculas/formularioMatricula/${files.formularioMatricula[0].filename}`;
    }

    return this.matriculaService.update(id, updateMatriculaDto);
  }

  @Patch(':id/tipo-pago')
  updateTipoPago(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoPagoDto: UpdateTipoPagoDto,
  ) {
    return this.matriculaService.updateTipoPago(id, updateTipoPagoDto);
  }

  @Patch(':id/becado')
  updateBecado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBecadoDto: UpdateBecadoDto,
  ) {
    return this.matriculaService.updateBecado(id, updateBecadoDto);
  }

  @Post(':id/generar-link')
  generarLinkPago(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() generarLinkPagoDto: GenerarLinkPagoDto,
  ) {
    return this.matriculaService.generarLinkPago(id, generarLinkPagoDto.email, generarLinkPagoDto.cuotaId);
  }

  @Get(':id/resumen-pago')
  getResumenPago(@Param('id', ParseUUIDPipe) id: string) {
    return this.matriculaService.getResumenPago(id);
  }

  @Patch(':id/actualizar-estado')
  updateEstadoMatricula(@Param('id', ParseUUIDPipe) id: string) {
    return this.matriculaService.updateEstadoMatricula(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matriculaService.remove(id);
  }

  /**
   * Endpoint para descargar archivos
   * Uso: GET /matricula/archivo/uploads/matriculas/documentos-estudiantes/archivo.pdf
   */
  @Get('archivo/*')
  downloadFile(@Param() params: any, @Res() res: Response) {
    const filePath = Object.values(params).join('/');
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      throw new BadRequestException('Archivo no encontrado');
    }

    res.download(fullPath);
  }
}
