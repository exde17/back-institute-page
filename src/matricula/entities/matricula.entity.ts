import { Cuota } from "src/cuota/entities/cuota.entity";
import { Entidad } from "src/entidad/entities/entidad.entity";
import { Factura } from "src/factura/entities/factura.entity";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { PlanPago } from "src/plan-pago/entities/plan-pago.entity";
import { PlanPagoPredefinido } from "src/plan-pago-predefinido/entities/plan-pago-predefinido.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TipoPago {
  CONTADO = 'CONTADO',
  CUOTAS = 'CUOTAS',
}

export enum EstadoMatricula {
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',
  PAGO_PARCIAL = 'PAGO_PARCIAL',
  PAGADO = 'PAGADO',
}

@Entity()
export class Matricula {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.matriculas)
  estudiante: User;

  // Propiedades para almacenar rutas de archivos
  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Ruta del documento de identidad del estudiante'
  })
  documentoEstudiante: string;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Ruta del diploma o certificado grado 10'
  })
  diplomaCertificadoGrado10: string;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Ruta del documento del acudiente (opcional)'
  })
  documentoAcudiente?: string;

  @Column({
    nullable: true,
    type: 'varchar',
    comment: 'Ruta del formulario de matricula'
  })
  formularioMatricula: string;

  // Nuevos campos para pagos y becas
  @Column({
    type: 'enum',
    enum: TipoPago,
    nullable: true,
    comment: 'Tipo de pago: contado o cuotas'
  })
  tipoPago: TipoPago;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si el estudiante es becado'
  })
  esBecado: boolean;

  @Column({
    type: 'enum',
    enum: EstadoMatricula,
    default: EstadoMatricula.PENDIENTE_PAGO,
    comment: 'Estado de pago de la matrícula'
  })
  estadoMatricula: EstadoMatricula;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    comment: 'Valor total a pagar'
  })
  valorTotal: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ID del link de pago generado en Wompi (para pago de contado)'
  })
  wompiLinkId: string;

  @ManyToOne(() => Entidad, (entidad) => entidad.matriculas, { nullable: true })
  entidad: Entidad;

  @ManyToOne(() => PlanPagoPredefinido, (plan) => plan.matriculas, { nullable: true })
  planPagoSeleccionado: PlanPagoPredefinido;

  @OneToMany(() => Cuota, (cuota) => cuota.matricula)
  cuotas: Cuota[];

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

  @OneToMany(() => Pago, (pago) => pago.matricula)
    pagos: Pago[];

  @ManyToOne(()=> Inscripcion, (inscripcion) => inscripcion.matriculas)
    inscripcion: Inscripcion;

  @OneToMany(()=> PlanPago, (planPago) => planPago.matricula)
    planPagos: PlanPago[];

  @OneToMany(()=> Factura, (factura) => factura.matricula)
    facturas: Factura[];
}
