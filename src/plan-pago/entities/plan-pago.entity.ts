import { Matricula } from "src/matricula/entities/matricula.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PlanPago {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric', {
        nullable: false,
        comment: 'Valor total del plan de pago'
    })
    valorTotal: number;

    @Column('int', {
        nullable: false,
        comment: 'Número de cuotas en las que se divide el plan de pago'
    })
    numeroCuotas: number;

    @Column('numeric', {
        nullable: false,
        comment: 'Valor de cada cuota del plan de pago'
    })
    valorCuota: number;

    @Column('varchar', {
        nullable: false,
        comment: 'Descripción del plan de pago'
    })
    descripcion: string;

    @ManyToOne(()=> Matricula, (matricula) => matricula.planPagos)
    matricula: Matricula;
}
