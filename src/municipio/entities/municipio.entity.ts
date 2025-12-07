import { Departamento } from "src/departamento/entities/departamento.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('municipio')
export class Municipio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    nombre: string;

    @ManyToOne(() => Departamento, (departamento) => departamento.municipios)
    departamento: Departamento;

    @OneToMany(() => User, (user) => user.lugarExpedicion)
    user: User[];

    @OneToMany(() => User, (user) => user.municipioNacimiento)
    userNacimiento: User[];

    @OneToMany(() => User, (user) => user.municipioInstitucion)
    users: User[];

}