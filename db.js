const Database = require('better-sqlite3');
const db = new Database('datos.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS logros (
    idLogro             INTEGER PRIMARY KEY AUTOINCREMENT,
    voluntarioId        INTEGER NOT NULL,
    nombreLogro         TEXT NOT NULL,
    fechaObtencion      TEXT NOT NULL,
    descripcion         TEXT NOT NULL,
    UNIQUE(voluntarioId, nombreLogro)
  )
`);

module.exports = db;