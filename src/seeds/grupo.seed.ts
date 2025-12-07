import { Grupo } from 'src/grupos/entities/grupo.entity';

export const grupoSeed: Omit<Grupo, 'id'>[] = [
  {
    nombre: 'Desplazado',
    descripcion: 'Grupo de personas desplazadas de sus lugares de origen.',
    users: [],
  },
  {
    nombre: 'Afrodescendiente',
    descripcion: 'Grupo de personas afrodescendientes.',
    users: [],
  },
  {
    nombre: 'Etnias',
    descripcion: 'Grupo de personas pertenecientes a diferentes etnias.',
    users: [],
  },
  {
    nombre: 'Desmovilizados',
    descripcion: 'Grupo de personas desmovilizadas.',
    users: [],
  },
  {
    nombre: 'Otros',
    descripcion: 'Otros grupos no especificados.',
    users: [],
  },
];
