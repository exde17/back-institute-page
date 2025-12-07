import { TipoDocumento } from 'src/tipo-documento/entities/tipo-documento.entity';

export const tipoDocumentoSeed: Omit<TipoDocumento, 'id'>[] = [
  {
    nombre: 'CC',
    descripcion: 'Cédula de ciudadanía.',
    users: [],
  },
  {
    nombre: 'T.I',
    descripcion: 'Tarjeta de identidad.',
    users: [],
  },
  {
    nombre: 'OTRO',
    descripcion: 'Otro tipo de documento.',
    users: [],
  },
];
