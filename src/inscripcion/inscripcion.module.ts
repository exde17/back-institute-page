import { Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programa } from 'src/programas/entities/programa.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [InscripcionController],
  providers: [InscripcionService],
  imports: [
    TypeOrmModule.forFeature([Programa, Inscripcion, User, Pago]),
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
    MailModule,
  ],
})
export class InscripcionModule {}
