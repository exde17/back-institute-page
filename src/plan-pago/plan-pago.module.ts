import { Module } from '@nestjs/common';
import { PlanPagoService } from './plan-pago.service';
import { PlanPagoController } from './plan-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlanPago } from './entities/plan-pago.entity';
import { Matricula } from 'src/matricula/entities/matricula.entity';

@Module({
  controllers: [PlanPagoController],
  providers: [PlanPagoService],
  imports: [TypeOrmModule.forFeature([Matricula, PlanPago]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
            JwtModule.registerAsync({
              imports:[ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => {
                return{
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
                }
              },
            }),
      ],
})
export class PlanPagoModule {}
