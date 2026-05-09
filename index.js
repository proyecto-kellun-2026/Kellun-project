const express = require('express');
const db      = require('./db');
const app     = express();

app.use(express.json());

// GET /logros
app.get('/logros', (req, res) => {
  const logros = db.prepare('SELECT * FROM logros').all();
  res.json(logros);
});

/*
// POST /logros
app.post('/logros', (req, res) => {
  const { nombre, instructor, creditos } = req.body;
  const result = db.prepare(
    'INSERT INTO logros (nombre, instructor, creditos) VALUES (?, ?, ?)'
  ).run(nombre, instructor, creditos);
  res.status(201).json({ id: result.lastInsertRowid, nombre, instructor, creditos });
});

// PUT /logros/:id
app.put('/logros/:id', (req, res) => {
  const { nombre, instructor, creditos } = req.body;
  const info = db.prepare(
    'UPDATE logros SET nombre=?, instructor=?, creditos=? WHERE id=?'
  ).run(nombre, instructor, creditos, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json({ mensaje: 'Curso actualizado' });
});

// DELETE /logros/:id
app.delete('/logros/:id', (req, res) => {
  const info = db.prepare('DELETE FROM logros WHERE id=?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json({ mensaje: 'Curso eliminado' });
});
*/
app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});