import { Module } from '@nestjs/common';
import { CategoriaEstudianteService } from './categoria-estudiante.service';
import { CategoriaEstudianteController } from './categoria-estudiante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriaEstudiante } from './entities/categoria-estudiante.entity';

@Module({
  controllers: [CategoriaEstudianteController],
  providers: [CategoriaEstudianteService],
  imports: [TypeOrmModule.forFeature([CategoriaEstudiante]),
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
export class CategoriaEstudianteModule {}
