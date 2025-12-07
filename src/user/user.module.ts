import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtStrategy } from './strategies/jwt.strategy';
import { TipoDocumento } from 'src/tipo-documento/entities/tipo-documento.entity';
import { Municipio } from 'src/municipio/entities/municipio.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Parentesco } from 'src/parentesco/entities/parentesco.entity';
import { NivelEducativo } from 'src/nivel-educativo/entities/nivel-educativo.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CategoriaEstudiante } from 'src/categoria-estudiante/entities/categoria-estudiante.entity';
import { EstadoEstudiante } from 'src/estado-estudiante/entities/estado-estudiante.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, jwtStrategy],
  imports: 
  [
    ConfigModule,  
    TypeOrmModule.forFeature([User, TipoDocumento, Municipio, Departamento, Parentesco, NivelEducativo, Grupo, CategoriaEstudiante, EstadoEstudiante]), 
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
  exports: [TypeOrmModule, jwtStrategy, PassportModule, JwtModule],
})
export class UserModule {}
