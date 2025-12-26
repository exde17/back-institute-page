import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanPagoDto } from './create-plan-pago.dto';

export class UpdatePlanPagoDto extends PartialType(CreatePlanPagoDto) {}
