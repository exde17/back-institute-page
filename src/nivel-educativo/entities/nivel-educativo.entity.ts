import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('nivel_educativo')
export class NivelEducativo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true,
    })
    nombre: string;

    @Column('text',{
        nullable: true,
    })
    descripcion: string;

    @OneToMany(()=> User, (user) => user.nivelEducativo)
    users: User[];
}