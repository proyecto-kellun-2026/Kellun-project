require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'kellun_user',
  password: process.env.DB_PASSWORD || 'kellun_password',
  database: process.env.DB_NAME || 'kellun_db'
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logros (
        "idLogro"             SERIAL PRIMARY KEY,
        "voluntarioId"        INTEGER NOT NULL,
        "nombreLogro"         VARCHAR(255) NOT NULL,
        "fechaObtencion"      VARCHAR(255) NOT NULL,
        descripcion           TEXT NOT NULL,
        UNIQUE("voluntarioId", "nombreLogro")
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS voluntariados (
        "idVoluntariado"     SERIAL PRIMARY KEY,
        titulo               VARCHAR(255) NOT NULL,
        descripcion          TEXT NOT NULL,
        tipo                 VARCHAR(255) NOT NULL,
        activo               INTEGER NOT NULL DEFAULT 1
      );
    `);

    const countRes = await pool.query('SELECT COUNT(*) as count FROM voluntariados');
    const count = parseInt(countRes.rows[0].count, 10);
    if (count === 0) {
      await pool.query(
        'INSERT INTO voluntariados (titulo, descripcion, tipo, activo) VALUES ($1, $2, $3, $4)',
        ['Pasear perros en el Refugio Municipal', 'Cuidado, alimentación y paseo de perritos rescatados.', 'animales', 1]
      );
      await pool.query(
        'INSERT INTO voluntariados (titulo, descripcion, tipo, activo) VALUES ($1, $2, $3, $4)',
        ['Jornada de Reforestación y Limpieza del Parque', 'Limpieza y plantación de árboles nativos en el parque central.', 'limpieza', 1]
      );
      await pool.query(
        'INSERT INTO voluntariados (titulo, descripcion, tipo, activo) VALUES ($1, $2, $3, $4)',
        ['Lectura y acompañamiento en Hogar de Ancianos', 'Lectura de libros, juegos de mesa y conversación con personas de la tercera edad.', 'ayuda a personas de la tercera edad', 1]
      );
      await pool.query(
        'INSERT INTO voluntariados (titulo, descripcion, tipo, activo) VALUES ($1, $2, $3, $4)',
        ['Limpieza de playas (Evento Inactivo)', 'Recogida de plásticos en la playa municipal.', 'limpieza', 0]
      );
      console.log('Semillas de voluntariados creadas en PostgreSQL.');
    }
  } catch (err) {
    console.error('Error inicializando la base de datos (db.js):', err);
  }
};

initDb();

module.exports = pool;