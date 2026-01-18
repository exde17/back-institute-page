import { Matricula } from 'src/matricula/entities/matricula.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoCuota {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO',
}

@Entity()
export class Cuota {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    comment: 'Número de cuota (1, 2, 3...)',
  })
  numeroCuota: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    comment: 'Monto de la cuota',
  })
  monto: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si la cuota fue pagada',
  })
  pagado: boolean;

  @Column({
    type: 'date',
    comment: 'Fecha de vencimiento de la cuota',
  })
  fechaVencimiento: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Fecha en que se realizó el pago',
  })
  fechaPago: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ID del link de pago generado en Wompi',
  })
  wompiLinkId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ID de la transacción en Wompi',
  })
  wompiTransaccion: string;

  @Column({
    type: 'enum',
    enum: EstadoCuota,
    default: EstadoCuota.PENDIENTE,
    comment: 'Estado de la cuota',
  })
  estado: EstadoCuota;

  @ManyToOne(() => Matricula, (matricula) => matricula.cuotas, { onDelete: 'CASCADE' })
  matricula: Matricula;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
