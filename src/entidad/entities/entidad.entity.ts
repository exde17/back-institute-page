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
export class Entidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Razón social de la entidad',
  })
  razonSocial: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: 'NIT de la entidad',
  })
  nit: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Dirección de la entidad',
  })
  direccion: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Correo electrónico de la entidad',
  })
  correo: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Teléfono de la entidad',
  })
  telefono: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Estado activo de la entidad',
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

  @OneToMany(() => Matricula, (matricula) => matricula.entidad)
  matriculas: Matricula[];
}
