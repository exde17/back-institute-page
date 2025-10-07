import { Module } from '@nestjs/common';
import { ProgramasService } from './programas.service';
import { ProgramasController } from './programas.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programa } from './entities/programa.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProgramasController],
  providers: [ProgramasService],
  imports: [TypeOrmModule.forFeature([Programa]),
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
export class ProgramasModule {}
