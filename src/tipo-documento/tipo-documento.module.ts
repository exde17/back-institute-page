import { Module } from '@nestjs/common';
import { TipoDocumentoService } from './tipo-documento.service';
import { TipoDocumentoController } from './tipo-documento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TipoDocumento } from './entities/tipo-documento.entity';

@Module({
  controllers: [TipoDocumentoController],
  providers: [TipoDocumentoService],
  imports: [TypeOrmModule.forFeature([TipoDocumento]),
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
export class TipoDocumentoModule {}
