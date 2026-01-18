import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Matricula } from './entities/matricula.entity';
import { UploadService } from 'src/utils/upload.service';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { CuotaModule } from 'src/cuota/cuota.module';
import { PlanPagoPredefinidoModule } from 'src/plan-pago-predefinido/plan-pago-predefinido.module';
import { EntidadModule } from 'src/entidad/entidad.module';

@Module({
  controllers: [MatriculaController],
  providers: [MatriculaService, UploadService],
  imports: [
    TypeOrmModule.forFeature([Matricula, Inscripcion]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    CuotaModule,
    PlanPagoPredefinidoModule,
    EntidadModule,
  ],
  exports: [MatriculaService],
})
export class MatriculaModule {}
