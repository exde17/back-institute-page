import { Matricula } from "src/matricula/entities/matricula.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Factura {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> Matricula, (matricula) => matricula.facturas)
    matricula: Matricula;

    @ManyToOne(()=> Pago, (pago) => pago.facturas)
    pago: Pago;

    @Column('numeric', {
        nullable: false,
        comment: 'Valor total de la factura'
    })
    valorTotal: number;

    @Column('varchar', {
        nullable: false,
        comment: 'Descripción de la factura'
    })
    descripcion: string;

    // Timestamps
    @Column('timestamptz', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column('timestamptz', {
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    // bollean pago o no pago
    @Column('bool',{
        default: false,
        comment: 'Indica si la factura ha sido pagada'
    })
    isPaid: boolean;
}
