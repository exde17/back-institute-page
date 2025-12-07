import { Departamento } from 'src/departamento/entities/departamento.entity';

export const departamentoSeed: Omit<Departamento, 'id'>[] = [
  {
    nombre: 'Córdoba',
    municipios: [],
    users: [],
    userDepartamentoNacimiento: [],
  },
];
