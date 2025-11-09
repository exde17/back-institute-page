import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Programa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  duracion: number;

  @Column()
  costo: number;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.programa)
  inscripcion: Inscripcion[];
}
