const express = require('express');
const db      = require('./db_organizaciones'); 
const swaggerUi    = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app     = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Organizaciones', version: '1.0.0',
            description: 'API para gestionar el registro de organizaciones' },
    servers: [
      { url: 'http://localhost:4000',                   description: 'Local' }
    ]
  },
  tags: [
      {
        name: 'Organizaciones',
        description: 'Operaciones relacionadas con el registro de organizaciones'
      }
    ],
  apis: ['./index2.js']
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /registroOrganizaciones:
 *   get:
 *     summary: Lista todas las organizaciones
 *     tags:
 *      - Organizaciones
 * 
 *     responses:
 *       200:
 *         description: Array de organizaciones registradas
 */

// GET /registroOrganizaciones
app.get('/registroOrganizaciones', (req, res) => {
  const registroOrganizaciones = db.prepare('SELECT * FROM registroOrganizaciones').all();
  res.json(registroOrganizaciones);
});

/**
 * @swagger
 * /registroOrganizaciones:
 *   post:
 *     summary: Registra una nueva organización
 *     tags:
 *      - Organizaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:     { type: string }
 *               contrasena: { type: string }
 *               correo:   { type: integer }
 *     responses:
 *       201:
 *         description: Organizacion creada
 *       400:
 *         description: La organizacion no ha sido creada porque el correo ya esta registrado
 */
// POST /registroOrganizaciones
app.post('/registroOrganizaciones', (req, res) => {
  const { nombre, contrasena, correo } = req.body;
  try {
    // CORREGIDO: Agregada la columna 'contrasena' y el cuarto '?'
    const result = db.prepare(
      'INSERT INTO registroOrganizaciones (nombre, contrasena, correo) VALUES ( ?, ?, ?)'
    ).run(nombre, contrasena, correo);
    
    
    return res.status(201).json({ id: result.lastInsertRowid, nombre, contrasena, correo });
  }
  catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: "El correo ya ha sido registrado" });
    }
  }
});
/**
 * @swagger
 * /registroOrganizaciones/{id}:
 *   put:
 *     summary: Modifica una organización existente
 *     tags:
 *      - Organizaciones
 * 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:     { type: string }
 *               contrasena: { type: string }
 *               correo:   { type: string }
 *     responses:
 *       200:
 *         description: Organización actualizada
 *       404:
 *         description: Organiazacion no encontrada
 */
// PUT /registroOrganizaciones/:id
app.put('/registroOrganizaciones/:id', (req, res) => {
  const { nombre, contrasena, correo } = req.body; // CORREGIDO: Se obtiene contrasena si se planea usar o mapear
  

  const info = db.prepare(
    'UPDATE registroOrganizaciones SET nombre=?, contrasena=?, correo=? WHERE id=?'
  ).run(nombre, contrasena, correo, req.params.id);
  
  if (info.changes === 0) return res.status(404).json({ error: 'Organización no encontrada' });
  res.json({ mensaje: 'Organización actualizada' });
});
/**
 * @swagger
 * /registroOrganizaciones/{id}:
 *   delete:
 *     summary: Elimina una organización
 *     tags:
 *     - Organizaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Organización eliminada con éxito
 *       404:
 *         description: Organización no encontrada
 */
// DELETE /registroOrganizaciones/:id
app.delete('/registroOrganizaciones/:id', (req, res) => {
  const info = db.prepare('DELETE FROM registroOrganizaciones WHERE id=?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Organización no encontrada' });
  res.json({ mensaje: 'Organización eliminada' });
});

app.listen(4000, () => {
  console.log('API corriendo en http://localhost:4000');
});