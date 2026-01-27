import { Matricula } from 'src/matricula/entities/matricula.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlanPagoPredefinido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Nombre del plan de pago',
  })
  nombre: string;

  @Column({
    type: 'int',
    comment: 'Número de cuotas del plan',
  })
  numeroCuotas: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descripción del plan de pago',
  })
  descripcion: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Estado activo del plan',
  })
  isActive: boolean;

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

  @OneToMany(() => Matricula, (matricula) => matricula.planPagoSeleccionado)
  matriculas: Matricula[];
}
