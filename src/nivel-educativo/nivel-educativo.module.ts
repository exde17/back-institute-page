import { Module } from '@nestjs/common';
import { NivelEducativoService } from './nivel-educativo.service';
import { NivelEducativoController } from './nivel-educativo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NivelEducativo } from './entities/nivel-educativo.entity';

@Module({
  controllers: [NivelEducativoController],
  providers: [NivelEducativoService],
  imports: [TypeOrmModule.forFeature([NivelEducativo]),
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
export class NivelEducativoModule {}
