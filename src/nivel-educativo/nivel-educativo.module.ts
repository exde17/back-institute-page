import { Module } from '@nestjs/common';
import { NivelEducativoService } from './nivel-educativo.service';
import { NivelEducativoController } from './nivel-educativo.controller';

@Module({
  controllers: [NivelEducativoController],
  providers: [NivelEducativoService]
})
export class NivelEducativoModule {}
