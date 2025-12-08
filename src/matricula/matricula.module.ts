import { Module } from '@nestjs/common';
import { MatriculaService } from './matricula.service';
import { MatriculaController } from './matricula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Matricula } from './entities/matricula.entity';

@Module({
  controllers: [MatriculaController],
  providers: [MatriculaService],
  imports: [TypeOrmModule.forFeature([Matricula]),
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
export class MatriculaModule {}
