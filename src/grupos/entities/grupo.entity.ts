import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('grupo')
export class Grupo {
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

    @OneToMany(() => User, (user) => user.grupo)
    users: User[];
}