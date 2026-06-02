const Database = require('better-sqlite3');
const db = new Database('registro_organizaciones.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS registroOrganizaciones (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre     TEXT NOT NULL,
    contrasena TEXT NOT NULL,
    correo     TEXT NOT NULL UNIQUE
  );
`);

module.exports = db;