import { Parentesco } from 'src/parentesco/entities/parentesco.entity';

export const parentescoSeed: Omit<Parentesco, 'id'>[] = [
  {
    nombre: 'MADRE',
    descripcion: 'Parentesco correspondiente a la madre.',
    users: [],
  },
  {
    nombre: 'PADRE',
    descripcion: 'Parentesco correspondiente al padre.',
    users: [],
  },
  {
    nombre: 'ABUELO(A)',
    descripcion: 'Parentesco correspondiente al abuelo o abuela.',
    users: [],
  },
  {
    nombre: 'TIO(A)',
    descripcion: 'Parentesco correspondiente al tío o tía.',
    users: [],
  },
  {
    nombre: 'OTRO FAMILIAR',
    descripcion: 'Parentesco correspondiente a otro familiar.',
    users: [],
  },
];
