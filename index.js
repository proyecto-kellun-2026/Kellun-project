const express = require('express');
const db      = require('./db');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app     = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API voluntariado', version: '1.0.0',
            description: 'API para gestionar aplicacion Kellun' },
    servers: [
      { url: 'https://kellun-project-api.onrender.com', description: 'Produccion' },
      { url: 'http://localhost:3000',                   description: 'Local' }
    ]
  },
  apis: ['./index.js']
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /logros:
 *   get:
 *     summary: Lista todos los Logros
 *     responses:
 *       200:
 *         description: Array de Logros
 */

// GET /logros
app.get('/logros', (req, res) => {
  const logros = db.prepare('SELECT * FROM logros').all();
  res.json(logros);
});

/**
 * @swagger
 * /logros:
 *   post:
 *     summary: Crea un nuevo logro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreLogro:     { type: string }
 *               fechaObtencion: { type: string }
 *               descripcion:   { type: string }
 *     responses:
 *       201:
 *         description: Logro creado
 */
// POST /logros
app.post('/logros', (req, res) => {
  const { nombreLogro, fechaObtencion, descripcion, icono } = req.body;
  const result = db.prepare(
    'INSERT INTO logros (nombreLogro, fechaObtencion, descripcion, icono) VALUES (?, ?, ?, ?)'
  ).run(nombreLogro, fechaObtencion, descripcion, icono);
  res.status(201).json({ idLogro: result.lastInsertRowid, nombreLogro, fechaObtencion, descripcion, icono });
});


/**
 * @swagger
 * /logros/{idLogro}:
 *   put:
 *     summary: Modifica un logro existente
 *     parameters:
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreLogro:     { type: string }
 *               fechaObtencion: { type: string }
 *               descripcion:   { type: string }
 *     responses:
 *       200:
 *         description: Logro actualizado
 *       404:
 *         description: No encontrado
 */

// PUT /logros/:id
app.put('/logros/:idLogro', (req, res) => {
  const { nombreLogro, fechaObtencion, descripcion, icono } = req.body;
  const info = db.prepare(
    'UPDATE logros SET nombreLogro=?, fechaObtencion=?, descripcion=?, icono=? WHERE idLogro=?'
  ).run(nombreLogro, fechaObtencion, descripcion, icono, req.params.idLogro);
  if (info.changes === 0) return res.status(404).json({ error: 'Logro no encontrado' });
  res.json({ mensaje: 'Logro actualizado' });
});

/**
 * @swagger
 * /logros/{idLogro}:
 *   delete:
 *     summary: Elimina un logro
 *     parameters:
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Logro eliminado
 *       404:
 *         description: No encontrado
 */

// DELETE /logros/:id
app.delete('/logros/:idLogro', (req, res) => {
  const info = db.prepare('DELETE FROM logros WHERE idLogro=?').run(req.params.idLogro);
  if (info.changes === 0) return res.status(404).json({ error: 'Logro no encontrado' });
  res.json({ mensaje: 'Logro eliminado' });
});

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
});