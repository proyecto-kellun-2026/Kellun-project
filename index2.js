require('dotenv').config();
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
app.get('/registroOrganizaciones', async (req, res) => {
  try {
    const registroOrganizaciones = await db.query('SELECT * FROM "registroOrganizaciones"');
    res.json(registroOrganizaciones.rows);
  } catch (error) {
    console.error('Error en GET /registroOrganizaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
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
app.post('/registroOrganizaciones', async (req, res) => {
  const { nombre, contrasena, correo } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO "registroOrganizaciones" (nombre, contrasena, correo) VALUES ($1, $2, $3) RETURNING id',
      [nombre, contrasena, correo]
    );
    
    return res.status(201).json({ id: result.rows[0].id, nombre, contrasena, correo });
  }
  catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: "El correo ya ha sido registrado" });
    }
    console.error('Error en POST /registroOrganizaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
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
app.put('/registroOrganizaciones/:id', async (req, res) => {
  const { nombre, contrasena, correo } = req.body;
  
  try {
    const info = await db.query(
      'UPDATE "registroOrganizaciones" SET nombre=$1, contrasena=$2, correo=$3 WHERE id=$4',
      [nombre, contrasena, correo, req.params.id]
    );
    
    if (info.rowCount === 0) return res.status(404).json({ error: 'Organización no encontrada' });
    res.json({ mensaje: 'Organización actualizada' });
  } catch (error) {
    console.error('Error en PUT /registroOrganizaciones/:id:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
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
app.delete('/registroOrganizaciones/:id', async (req, res) => {
  try {
    const info = await db.query('DELETE FROM "registroOrganizaciones" WHERE id=$1', [req.params.id]);
    if (info.rowCount === 0) return res.status(404).json({ error: 'Organización no encontrada' });
    res.json({ mensaje: 'Organización eliminada' });
  } catch (error) {
    console.error('Error en DELETE /registroOrganizaciones/:id:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

const PORT_ORGS = process.env.PORT_ORGS || 4000;
app.listen(PORT_ORGS, () => {
  console.log(`API corriendo en http://localhost:${PORT_ORGS}`);
});