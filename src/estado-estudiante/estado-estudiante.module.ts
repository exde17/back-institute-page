import { Module } from '@nestjs/common';
import { EstadoEstudianteService } from './estado-estudiante.service';
import { EstadoEstudianteController } from './estado-estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EstadoEstudiante } from './entities/estado-estudiante.entity';

@Module({
  controllers: [EstadoEstudianteController],
  providers: [EstadoEstudianteService],
  imports: [TypeOrmModule.forFeature([EstadoEstudiante]),
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
export class EstadoEstudianteModule {}
