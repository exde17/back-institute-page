import { Factura } from "src/factura/entities/factura.entity";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum MetodoPago {
  TARJETA_CREDITO = 'Tarjeta de Crédito',
  TARJETA_DEBITO = 'Tarjeta de Débito',
  TRANSFERENCIA_BANCARIA = 'Transferencia Bancaria',
  EFECTIVO = 'Efectivo',
}

export enum EstadoPago {
  PENDIENTE = 'Pendiente',
  COMPLETADO = 'Completado',
  FALLIDO = 'Fallido',
  PARCIAL = 'Parcial',
}

@Entity()
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', {
    nullable: true,
    precision: 10,
    scale: 2,
  })
  monto: number;

  @Column('enum', {
    enum: MetodoPago,
    nullable: true,
  })
  metodo: MetodoPago;

  @ManyToOne(() => Matricula, (matricula) => matricula.pagos)
  matricula: Matricula;

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

    @Column('text',{
        nullable: true,
    })
    referenciaPago: string;

    @Column('text',{
        nullable: true,
    })
    wompi_transaccion: string;

    // fecha del pago
    @Column('timestamptz', {
        // default fecha del dia que se hace el pago y no es el mismo que createdAt asi que no poner default
        name: 'fecha_pago',
        nullable: true,
    })
    fechaPago: Date;

    // raw_response de wompi
    @Column('text',{
        nullable: true,
    })
    raw_response: string;

    @Column('enum', {
        enum: EstadoPago,
        default: EstadoPago.PENDIENTE,
    })
    estado: EstadoPago;

    @OneToMany(()=> Factura, (factura) => factura.pago)
    facturas: Factura[];
}
