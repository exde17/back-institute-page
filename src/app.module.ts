import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProgramasModule } from './programas/programas.module';
import { NoticiasModule } from './noticias/noticias.module';
import { InscripcionModule } from './inscripcion/inscripcion.module';
import { PagoModule } from './pago/pago.module';
import { MailModule } from './mail/mail.module';
import { TipoDocumentoModule } from './tipo-documento/tipo-documento.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { MunicipioModule } from './municipio/municipio.module';
import { ParentescoModule } from './parentesco/parentesco.module';
import { NivelEducativoModule } from './nivel-educativo/nivel-educativo.module';
import { GruposModule } from './grupos/grupos.module';
import { EstadoEstudianteModule } from './estado-estudiante/estado-estudiante.module';
import { CategoriaEstudianteModule } from './categoria-estudiante/categoria-estudiante.module';
import { MatriculaModule } from './matricula/matricula.module';
import { PlanPagoModule } from './plan-pago/plan-pago.module';
import { FacturaModule } from './factura/factura.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    ProgramasModule,
    NoticiasModule,
    InscripcionModule,
    PagoModule,
    MailModule,
    TipoDocumentoModule,
    DepartamentoModule,
    MunicipioModule,
    ParentescoModule,
    NivelEducativoModule,
    GruposModule,
    EstadoEstudianteModule,
    CategoriaEstudianteModule,
    MatriculaModule,
    PlanPagoModule,
    FacturaModule,
  ],
})
export class AppModule {}
