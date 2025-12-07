# Seeds - Datos Iniciales

Esta carpeta contiene los seeds (datos iniciales) para la base de datos.

## Contenido

- **tipo-documento.seed.ts**: CC, T.I, OTRO
- **departamento.seed.ts**: Córdoba
- **municipio.seed.ts**: Montería, Cereté, San Carlos, Planeta Rica, Lorica, Ciénaga de Oro
- **parentesco.seed.ts**: MADRE, PADRE, ABUELO(A), TIO(A), OTRO FAMILIAR
- **nivel-educativo.seed.ts**: Bachillerato, Primaria, Técnico, Profesional, Tecnólogo, Bachillerato en curso
- **grupo.seed.ts**: Desplazado, Afrodescendiente, Etnias, Desmovilizados, Otros
- **categoria-estudiante.seed.ts**: Becado por gobernación, Becado por empresa, Normal
- **estado-estudiante.seed.ts**: Aspirante, Inscrito, Matriculado

## Cómo usar

Para ejecutar todos los seeds:

```bash
npm run seed
```

O con yarn:

```bash
yarn seed
```

## Notas

- Los seeds se ejecutan en orden: Tipo Documento, Departamento, Municipio, Parentesco, Nivel Educativo, Grupo, Categoría Estudiante, Estado Estudiante
- Todos los municipios están asociados al departamento de Córdoba
- Los IDs están predefinidos para facilitar las referencias en la API
