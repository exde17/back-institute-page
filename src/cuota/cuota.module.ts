import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuotaService } from './cuota.service';
import { CuotaController } from './cuota.controller';
import { Cuota } from './entities/cuota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuota])],
  controllers: [CuotaController],
  providers: [CuotaService],
  exports: [CuotaService, TypeOrmModule],
})
export class CuotaModule {}
