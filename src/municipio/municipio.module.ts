import { Module } from '@nestjs/common';
import { MunicipioService } from './municipio.service';
import { MunicipioController } from './municipio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Municipio } from './entities/municipio.entity';

@Module({
  controllers: [MunicipioController],
  providers: [MunicipioService],
  imports: [TypeOrmModule.forFeature([Municipio]),
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
export class MunicipioModule {}
