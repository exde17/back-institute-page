import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function runSeeds() {
  const client = await pool.connect();

  try {
    console.log('🌱 Iniciando seeds...');

    // Seed TipoDocumento
    console.log('Insertando Tipo Documentos...');
    await client.query(`
      INSERT INTO tipo_documento (nombre) VALUES
      ('CC'),
      ('T.I'),
      ('OTRO')
      ON CONFLICT DO NOTHING;
    `);

    // Seed Departamento
    console.log('Insertando Departamentos...');
    const deptResult = await client.query(`
      INSERT INTO departamento (nombre) VALUES ('Córdoba')
      ON CONFLICT DO NOTHING
      RETURNING id;
    `);
    const deptId = deptResult.rows[0]?.id;

    // Seed Municipio
    console.log('Insertando Municipios...');
    if (deptId) {
      await client.query(`
        INSERT INTO municipio (nombre, "departamentoId") VALUES
        ('Montería', $1),
        ('Cereté', $1),
        ('San Carlos', $1),
        ('Planeta Rica', $1),
        ('Lorica', $1),
        ('Ciénaga de Oro', $1)
        ON CONFLICT DO NOTHING;
      `, [deptId]);
    }

    // Seed Parentesco
    console.log('Insertando Parentescos...');
    await client.query(`
      INSERT INTO parentesco (nombre) VALUES
      ('MADRE'),
      ('PADRE'),
      ('ABUELO(A)'),
      ('TIO(A)'),
      ('OTRO FAMILIAR')
      ON CONFLICT DO NOTHING;
    `);

    // Seed NivelEducativo
    console.log('Insertando Niveles Educativos...');
    await client.query(`
      INSERT INTO nivel_educativo (nombre) VALUES
      ('Bachillerato'),
      ('Primaria'),
      ('Técnico'),
      ('Profesional'),
      ('Tecnólogo'),
      ('Bachillerato en curso')
      ON CONFLICT DO NOTHING;
    `);

    // Seed Grupo
    console.log('Insertando Grupos...');
    await client.query(`
      INSERT INTO grupo (nombre) VALUES
      ('Desplazado'),
      ('Afrodescendiente'),
      ('Etnias'),
      ('Desmovilizados'),
      ('Otros')
      ON CONFLICT DO NOTHING;
    `);

    // Seed CategoriaEstudiante
    console.log('Insertando Categorías de Estudiante...');
    await client.query(`
      INSERT INTO categoria_estudiante (nombre) VALUES
      ('Becado por gobernación'),
      ('Becado por empresa'),
      ('Normal')
      ON CONFLICT DO NOTHING;
    `);

    // Seed EstadoEstudiante
    console.log('Insertando Estados de Estudiante...');
    await client.query(`
      INSERT INTO estado_estudiante (nombre) VALUES
      ('Aspirante'),
      ('Inscrito'),
      ('Matriculado')
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Seeds completados exitosamente!');
  } catch (error) {
    console.error('❌ Error al ejecutar seeds:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds();
