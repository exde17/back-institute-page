import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pago } from 'src/pago/entities/pago.entity';
import { Matricula } from 'src/matricula/entities/matricula.entity';
import { Factura } from './entities/factura.entity';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService],
  imports: [TypeOrmModule.forFeature([Pago, Matricula, Factura]),
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
export class FacturaModule {}
