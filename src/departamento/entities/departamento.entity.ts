import { Municipio } from "src/municipio/entities/municipio.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('departamento')
export class Departamento {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    nombre: string;

    @OneToMany(()=> Municipio, (municipio) => municipio.departamento)
    municipios: Municipio[];

    @OneToMany(()=> User, (user) => user.departamentoNacimiento)
    userDepartamentoNacimiento: User[];

    @OneToMany(() => User, (user) => user.departamentoInstitucion)
    users: User[];
}