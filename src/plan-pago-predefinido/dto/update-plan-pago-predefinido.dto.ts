import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanPagoPredefinidoDto } from './create-plan-pago-predefinido.dto';

export class UpdatePlanPagoPredefinidoDto extends PartialType(CreatePlanPagoPredefinidoDto) {}
