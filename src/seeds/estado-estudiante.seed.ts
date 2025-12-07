import { EstadoEstudiante } from 'src/estado-estudiante/entities/estado-estudiante.entity';

export const estadoEstudianteSeed: Omit<EstadoEstudiante, 'id'>[] = [
  {
    nombre: 'Aspirante',
    users: [],
  },
  {
    nombre: 'Inscrito',
    users: [],
  },
  {
    nombre: 'Matriculado',
    users: [],
  },
];
