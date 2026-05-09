const express = require('express');
const db      = require('./db');
const app     = express();

app.use(express.json());

// GET /logros
app.get('/logros', (req, res) => {
  const logros = db.prepare('SELECT * FROM logros').all();
  res.json(logros);
});


// POST /logros
app.post('/logros', (req, res) => {
  const { nombreLogro, fechaObtencion, descripcion } = req.body;
  const result = db.prepare(
    'INSERT INTO logros (nombreLogro, fechaObtencion, descripcion) VALUES (?, ?, ?)'
  ).run(nombreLogro, fechaObtencion, descripcion);
  res.status(201).json({ idLogro: result.lastInsertRowid, nombreLogro, fechaObtencion, descripcion });
});

/*
// PUT /logros/:id
app.put('/logros/:id', (req, res) => {
  const { nombreLogro, fechaObtencion, descripcion } = req.body;
  const info = db.prepare(
    'UPDATE logros SET nombreLogro=?, fechaObtencion=?, descripcion=? WHERE id=?'
  ).run(nombreLogro, fechaObtencion, descripcion, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Logro no encontrado' });
  res.json({ mensaje: 'Logro actualizado' });
});

// DELETE /logros/:id
app.delete('/logros/:id', (req, res) => {
  const info = db.prepare('DELETE FROM logros WHERE id=?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Logro no encontrado' });
  res.json({ mensaje: 'Logro eliminado' });
});
*/
app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});