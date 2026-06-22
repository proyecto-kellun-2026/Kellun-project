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
  );

  CREATE TABLE IF NOT EXISTS voluntariados (
    idVoluntariado     INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo             TEXT NOT NULL,
    descripcion        TEXT NOT NULL,
    tipo               TEXT NOT NULL,
    activo             INTEGER NOT NULL DEFAULT 1
  );
`);

// Insertar datos de semilla si la tabla voluntariados está vacía
const countVoluntariados = db.prepare('SELECT COUNT(*) as count FROM voluntariados').get();
if (countVoluntariados.count === 0) {
  const insert = db.prepare('INSERT INTO voluntariados (titulo, descripcion, tipo, activo) VALUES (?, ?, ?, ?)');
  insert.run('Pasear perros en el Refugio Municipal', 'Cuidado, alimentación y paseo de perritos rescatados.', 'animales', 1);
  insert.run('Jornada de Reforestación y Limpieza del Parque', 'Limpieza y plantación de árboles nativos en el parque central.', 'limpieza', 1);
  insert.run('Lectura y acompañamiento en Hogar de Ancianos', 'Lectura de libros, juegos de mesa y conversación con personas de la tercera edad.', 'ayuda a personas de la tercera edad', 1);
  insert.run('Limpieza de playas (Evento Inactivo)', 'Recogida de plásticos en la playa municipal.', 'limpieza', 0);
}
module.exports = db;