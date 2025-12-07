import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categoria_estudiante')
export class CategoriaEstudiante {

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

    @OneToMany(()=> User, (user) => user.categoriaEstudiante)
    users: User[];
}
