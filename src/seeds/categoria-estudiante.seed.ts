import { CategoriaEstudiante } from 'src/categoria-estudiante/entities/categoria-estudiante.entity';

export const categoriaEstudianteSeed: Omit<CategoriaEstudiante, 'id'>[] = [
  {
    nombre: 'Becado por gobernación',
    descripcion: 'Estudiante que recibe una beca otorgada por la gobernación del departamento.',
    users: [],
  },
  {
    nombre: 'Becado por empresa',
    descripcion: 'Estudiante que recibe una beca otorgada por una empresa.',
    users: [],
  },
  {
    nombre: 'Normal',
    descripcion: 'Estudiante que no recibe ninguna beca.',
    users: [],
  },
];
