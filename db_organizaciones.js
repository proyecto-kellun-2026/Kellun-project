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
      CREATE TABLE IF NOT EXISTS "registroOrganizaciones" (
        id           SERIAL PRIMARY KEY,
        nombre       VARCHAR(255) NOT NULL,
        contrasena   VARCHAR(255) NOT NULL,
        correo       VARCHAR(255) NOT NULL UNIQUE
      );
    `);
  } catch (err) {
    console.error('Error inicializando la base de datos (db_organizaciones.js):', err);
  }
};

initDb();

module.exports = pool;