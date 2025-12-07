import { NivelEducativo } from 'src/nivel-educativo/entities/nivel-educativo.entity';

export const nivelEducativoSeed: Omit<NivelEducativo, 'id'>[] = [
  {
    nombre: 'Bachillerato',
    descripcion: 'Nivel educativo correspondiente a la educación secundaria.',
    users: [],
  },
  {
    nombre: 'Primaria',
    descripcion: 'Nivel educativo correspondiente a la educación primaria.',
    users: [],
  },
  {
    nombre: 'Técnico',
    descripcion: 'Nivel educativo correspondiente a la formación técnica.',
    users: [],
  },
  {
    nombre: 'Profesional',
    descripcion: 'Nivel educativo correspondiente a la educación universitaria.',
    users: [],
  },
  {
    nombre: 'Tecnólogo',
    descripcion: 'Nivel educativo correspondiente a la formación tecnológica.',
    users: [],
  },
  {
    nombre: 'Bachillerato en curso',
    descripcion: 'Nivel educativo correspondiente a la educación secundaria en curso.',
    users: [],
  },
];
