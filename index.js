const express = require('express');
const db = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API voluntariado',
      version: '1.0.0',
      description: 'API para gestionar aplicación Kellun'
    },
    servers: [
      {
        url: 'https://kellun-project-api.onrender.com',
        description: 'Producción'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local'
      }
    ]
  },
  apis: ['./index.js']
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function validarLogro(req, res, next) {
  const { voluntarioId, nombreLogro, fechaObtencion, descripcion } = req.body;

  if (typeof voluntarioId !== 'number' || !Number.isInteger(voluntarioId)) {
    return res.status(400).json({
      error: "El atributo 'voluntarioId' debe ser un número entero."
    });
  }

  if (typeof nombreLogro !== 'string' || nombreLogro.trim() === '') {
    return res.status(400).json({
      error: "El atributo 'nombreLogro' debe ser una cadena de texto no vacía."
    });
  }

  if (typeof fechaObtencion !== 'string' || fechaObtencion.trim() === '') {
    return res.status(400).json({
      error: "El atributo 'fechaObtencion' debe ser una cadena de texto no vacía."
    });
  }

  if (typeof descripcion !== 'string' || descripcion.trim() === '') {
    return res.status(400).json({
      error: "El atributo 'descripcion' debe ser una cadena de texto no vacía."
    });
  }

  next();
}

/**
 * @swagger
 * /logros:
 *   get:
 *     summary: Lista todos los logros globales
 *     responses:
 *       200:
 *         description: Array de logros
 */
app.get('/logros', (req, res) => {
  const logros = db.prepare('SELECT * FROM logros').all();
  res.json(logros);
});

/**
 * @swagger
 * /voluntarios/{voluntarioId}/logros:
 *   get:
 *     summary: Lista las insignias de un voluntario específico
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array de insignias del voluntario
 */
app.get('/voluntarios/:voluntarioId/logros', (req, res) => {
  const logros = db
    .prepare('SELECT * FROM logros WHERE voluntarioId = ?')
    .all(req.params.voluntarioId);

  res.json(logros);
});

/**
 * @swagger
 * /logros:
 *   post:
 *     summary: Crea un nuevo logro manualmente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voluntarioId
 *               - nombreLogro
 *               - fechaObtencion
 *               - descripcion
 *             properties:
 *               voluntarioId:
 *                 type: integer
 *               nombreLogro:
 *                 type: string
 *               fechaObtencion:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Logro creado con éxito
 *       400:
 *         description: Error de validación o logro duplicado
 */
app.post('/logros', validarLogro, (req, res) => {
  const {
    voluntarioId,
    nombreLogro,
    fechaObtencion,
    descripcion
  } = req.body;

  try {
    const result = db.prepare(
      'INSERT INTO logros (voluntarioId, nombreLogro, fechaObtencion, descripcion) VALUES (?, ?, ?, ?)'
    ).run(
      voluntarioId,
      nombreLogro,
      fechaObtencion,
      descripcion
    );

    res.status(201).json({
      idLogro: result.lastInsertRowid,
      voluntarioId,
      nombreLogro,
      fechaObtencion,
      descripcion
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({
        error: 'El voluntario ya posee esta insignia.'
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntarios/{voluntarioId}/completar-actividad:
 *   post:
 *     summary: Completa una actividad y otorga la insignia automática si corresponde
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Insignia otorgada automáticamente
 *       200:
 *         description: Actividad registrada sin nueva insignia
 */
app.post('/voluntarios/:voluntarioId/completar-actividad', (req, res) => {
  const voluntarioId = parseInt(req.params.voluntarioId, 10);

  if (isNaN(voluntarioId)) {
    return res.status(400).json({
      error: 'ID de voluntario inválido.'
    });
  }

  const conteoInsignias = db.prepare(
    'SELECT COUNT(*) as total FROM logros WHERE voluntarioId = ?'
  ).get(voluntarioId);

  if (conteoInsignias.total === 0) {
    const nombreLogro = 'Colaborador Iniciado';
    const fechaObtencion = new Date().toISOString().split('T')[0];
    const descripcion =
      'Otorgada automáticamente al validar su primera actividad de voluntariado.';

    try {
      const result = db.prepare(
        'INSERT INTO logros (voluntarioId, nombreLogro, fechaObtencion, descripcion) VALUES (?, ?, ?, ?)'
      ).run(
        voluntarioId,
        nombreLogro,
        fechaObtencion,
        descripcion
      );

      return res.status(201).json({
        mensaje:
          '¡Primera actividad completada! Sistema validado de forma automática.',
        insignia: {
          idLogro: result.lastInsertRowid,
          voluntarioId,
          nombreLogro,
          fechaObtencion,
          descripcion
        }
      });
    } catch (error) {
      return res.status(400).json({
        error: 'Error al generar la insignia automática.'
      });
    }
  }

  res.json({
    mensaje:
      'Actividad registrada con éxito. El voluntario ya cuenta con insignias previas.'
  });
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
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voluntarioId:
 *                 type: integer
 *               nombreLogro:
 *                 type: string
 *               fechaObtencion:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logro actualizado
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Logro no encontrado
 */
app.put('/logros/:idLogro', validarLogro, (req, res) => {
  const {
    voluntarioId,
    nombreLogro,
    fechaObtencion,
    descripcion
  } = req.body;

  try {
    const info = db.prepare(
      'UPDATE logros SET voluntarioId=?, nombreLogro=?, fechaObtencion=?, descripcion=? WHERE idLogro=?'
    ).run(
      voluntarioId,
      nombreLogro,
      fechaObtencion,
      descripcion,
      req.params.idLogro
    );

    if (info.changes === 0) {
      return res.status(404).json({
        error: 'Logro no encontrado'
      });
    }

    res.json({
      mensaje: 'Logro actualizado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      error:
        'Error al actualizar el logro (posible duplicado).'
    });
  }
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
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Logro eliminado
 *       404:
 *         description: Logro no encontrado
 */
app.delete('/logros/:idLogro', (req, res) => {
  const info = db
    .prepare('DELETE FROM logros WHERE idLogro=?')
    .run(req.params.idLogro);

  if (info.changes === 0) {
    return res.status(404).json({
      error: 'Logro no encontrado'
    });
  }

  res.json({
    mensaje: 'Logro eliminado'
  });
});

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
  console.log('Swagger disponible en http://localhost:3000/docs');
});