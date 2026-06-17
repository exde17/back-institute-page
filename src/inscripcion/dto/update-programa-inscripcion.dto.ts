import { IsUUID } from 'class-validator';

export class UpdateProgramaInscripcionDto {
  @IsUUID()
  programaId: string;
}
