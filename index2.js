const express = require('express');
const db      = require('./db_organizaciones'); 
const app     = express();

app.use(express.json());

// GET /registroOrganizaciones
app.get('/registroOrganizaciones', (req, res) => {
  const registroOrganizaciones = db.prepare('SELECT * FROM registroOrganizaciones').all();
  res.json(registroOrganizaciones);
});

// POST /registroOrganizaciones
app.post('/registroOrganizaciones', (req, res) => {
  const { nombre, contrasena, correo, mensaje } = req.body;
  try {
    // CORREGIDO: Agregada la columna 'contrasena' y el cuarto '?'
    const result = db.prepare(
      'INSERT INTO registroOrganizaciones (nombre, contrasena, correo, mensaje) VALUES (?, ?, ?, ?)'
    ).run(nombre, contrasena, correo, mensaje);
    
    // CORREGIDO: Se añade 'return' para finalizar la ejecución exitosa
    return res.status(201).json({ id: result.lastInsertRowid, nombre, contrasena, correo, mensaje });
  }
  catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "El correo ya ha sido registrado" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /registroOrganizaciones/:id
app.put('/registroOrganizaciones/:id', (req, res) => {
  const { nombre, contrasena, correo, mensaje } = req.body; // CORREGIDO: Se obtiene contrasena si se planea usar o mapear
  
  // Si vas a actualizar también la contraseña, agrega 'contrasena=?' al query. 
  // Aquí asumimos que actualizas todo:
  const info = db.prepare(
    'UPDATE registroOrganizaciones SET nombre=?, contrasena=?, correo=?, mensaje=? WHERE id=?'
  ).run(nombre, contrasena, correo, mensaje, req.params.id);
  
  if (info.changes === 0) return res.status(404).json({ error: 'Organización no encontrada' });
  res.json({ mensaje: 'Organización actualizada' });
});

// DELETE /registroOrganizaciones/:id
app.delete('/registroOrganizaciones/:id', (req, res) => {
  const info = db.prepare('DELETE FROM registroOrganizaciones WHERE id=?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Organización no encontrada' });
  res.json({ mensaje: 'Organización eliminada' });
});

app.listen(4000, () => {
  console.log('API corriendo en http://localhost:4000');
});