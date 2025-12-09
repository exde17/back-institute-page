import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Programa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('text',{
    nullable: true,
  })
  imagen: string; 

  @Column()
  descripcion: string;

  @Column()
  duracion: number;

  @Column('text',{
    nullable: true,
  })
  modalidad: string;

  @Column('text',{
    nullable: true,
  })
  categoria: string;

  @Column({
    nullable: true,
  })
  badge: string;

  @Column({
    nullable: true,
  })
  badgeColor: string;

  // semestres debe ser um array de objetos
  @Column('jsonb',{
    nullable: true,
  })
  semestres: { nombre: string; asignaturas: string[] }[];

  // detalles debe ser un array de strings
  @Column('text', { array: true, nullable: true })
  detalles: string[];

  @Column('decimal', {
    nullable: true,
  }
)
  costo: number;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.programa)
  inscripcion: Inscripcion[];
}
