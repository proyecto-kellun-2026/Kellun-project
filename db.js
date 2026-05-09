const Database = require('better-sqlite3');
const db = new Database('datos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS logros (
    nombreLogro         TEXT NOT NULL PRIMARY KEY,
    fechaObtencion      TEXT NOT NULL,
    descripcion         TEXT NOT NULL
  )
`);

module.exports = db;