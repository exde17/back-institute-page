import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { TipoDocumento } from 'src/tipo-documento/entities/tipo-documento.entity';
import { Municipio } from 'src/municipio/entities/municipio.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { Parentesco } from 'src/parentesco/entities/parentesco.entity';
import { NivelEducativo } from 'src/nivel-educativo/entities/nivel-educativo.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { CategoriaEstudiante } from 'src/categoria-estudiante/entities/categoria-estudiante.entity';
import { EstadoEstudiante } from 'src/estado-estudiante/entities/estado-estudiante.entity';

@Entity({
  name: 'users',
  schema: 'security',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
    name: 'first_name',
  })
  firstName: string;

  @Column('text', {
    nullable: false,
    name: 'last_name',
  })
  lastName: string;

  @ManyToOne(()=> TipoDocumento, (tipoDocumento) => tipoDocumento.users)
  tipoDocumento: TipoDocumento;

  @Column('text', {
    nullable: true,
    name: 'document_number'})
  @IsNotEmpty()
  documentNumber: string;

  @ManyToOne(()=> Municipio, (municipio) => municipio.user)
  lugarExpedicion: Municipio;

  // fecha dd enacimiento
  @Column('text', {
    nullable: true,
    name: 'birth_date',
  })
  birthDate: string;

  //nacionalidad
  @Column('text', {
    nullable: true,
    name: 'nationality',
  })
  nationality: string;

  @ManyToOne(()=> Municipio, (municipio) => municipio.userNacimiento)
  municipioNacimiento: Municipio;

  @ManyToOne(()=> Departamento, (departamento) => departamento.userDepartamentoNacimiento)
  departamentoNacimiento: Departamento;

  // barrio
  @Column('text', {
    nullable: true,
    name: 'barrio',
  })
  barrio: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column('text', {
    nullable: false,
    select: false,
  })
  @MinLength(8)
  password: string;

  @Column('bool', {
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.emailToLowerCase();
  }

  @Column('text', {
    nullable: true,
    name: 'telephone',
  })
  telephone: string;

  @Column('text', {
    nullable: true,
    name: 'address',
  })
  address: string;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.user)
  inscripcion: Inscripcion[];

// REFERENCIAS FAMILIARES
// NOMBRE DEL ACUDIENTE:
  @Column('text',{
    nullable: true,
    name: 'nombre_acudiente',
  })
  nombreAcudiente: string;

  @Column('text',{
    nullable: true,
    name: 'numero_contacto_acudiente',
  })
  numeroContactoAcudiente: string;

  @ManyToOne(()=> Parentesco, (parentesco) => parentesco.users)
  parentesco: Parentesco;

  @Column('text',{
    nullable: true,
    name: 'direccion_acudiente',
  })
  direccionAcudiente: string;

  // INFORMACIÓN ACADÉMICA:
   // NIVEL EDUCATIVO
   @ManyToOne(()=> NivelEducativo, (nivelEducativo) => nivelEducativo.users)
   nivelEducativo: NivelEducativo;

   // AÑO DE CERTIFICACIÓN: 
    @Column('text',{
      nullable: true,
      name: 'anio_certificacion',
    })
    anioCertificacion: string;

    // NOMBRE DE LA INSTITUCIÓN EDUCATIVA:
    @Column('text',{
      nullable: true,
      name: 'institucion_educativa',
    })
    institucionEducativa: string;

    @ManyToOne(() => Departamento, (departamento) => departamento.users)
    departamentoInstitucion: Departamento;

    @ManyToOne(() => Municipio, (municipio) => municipio.users)
    municipioInstitucion: Municipio;

    // CONDICIONES ESPECIALES:
    @Column('bool',{
      nullable: true,
    })
    limitacionFisicaCognitiva: boolean;

    // descripcin de la limitacion
    @Column('text',{
      nullable: true,
      name: 'descripcion_limitacion',
    })
    descripcionLimitacion: string;

    @ManyToOne(()=> Grupo, (grupo) => grupo.users)
    grupo: Grupo;

    @ManyToOne(()=> CategoriaEstudiante, (categoriaEstudiante) => categoriaEstudiante.users,{
      nullable: true,
    })
    categoriaEstudiante: CategoriaEstudiante;

    @ManyToOne(()=> EstadoEstudiante, (estadoEstudiante) => estadoEstudiante.users,{
      nullable: true,
    })
    estadoEstudiante: EstadoEstudiante;
}