import { Matricula } from "src/matricula/entities/matricula.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { Programa } from "src/programas/entities/programa.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Inscripcion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: true,
    })
    observacion: string;

    // estado treue o false
    @Column('bool', {
        default: true,
    })
    estado: boolean;

    @ManyToOne(() => Programa, (programa) => programa.inscripcion)
    programa: Programa;

    @ManyToOne(() => User, (user) => user.inscripcion)
    user: User;

    @OneToMany(()=> Matricula, (matricula) => matricula.inscripcion)
    matriculas: Matricula[];

    // fecha de inscripcion
    @Column('timestamptz', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    fechaInscripcion: Date;

}
