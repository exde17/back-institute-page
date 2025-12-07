import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('parentesco')
export class Parentesco {
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

    @OneToMany(()=> User, (user) => user.parentesco)
    users: User[];
}