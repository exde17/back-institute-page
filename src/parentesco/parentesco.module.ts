import { Module } from '@nestjs/common';
import { ParentescoService } from './parentesco.service';
import { ParentescoController } from './parentesco.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Parentesco } from './entities/parentesco.entity';

@Module({
  controllers: [ParentescoController],
  providers: [ParentescoService],
  imports: [TypeOrmModule.forFeature([Parentesco]),
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
export class ParentescoModule {}
