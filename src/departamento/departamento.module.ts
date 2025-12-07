import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
  imports: [TypeOrmModule.forFeature([Departamento]),
      PassportModule.register({ defaultStrategy: 'jwt' }),
          JwtModule.registerAsync({
            imports:[ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              // console.log(configService.get('JWT_SECRET'));
              return{
              secret: configService.get('JWT_SECRET'),
              signOptions: { expiresIn: '1d' },
              }
              
            },
          }),
    ],
})
export class DepartamentoModule {}
