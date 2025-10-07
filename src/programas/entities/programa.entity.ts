import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
