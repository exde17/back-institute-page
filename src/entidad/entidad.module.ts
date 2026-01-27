import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadService } from './entidad.service';
import { EntidadController } from './entidad.controller';
import { Entidad } from './entities/entidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidad])],
  controllers: [EntidadController],
  providers: [EntidadService],
  exports: [EntidadService, TypeOrmModule],
})
export class EntidadModule {}
