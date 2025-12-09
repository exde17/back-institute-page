import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}
