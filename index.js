require('dotenv').config();
const express = require('express');
const db = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const voluntariadosRouter = require('./routes/voluntariados');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/api/voluntariados', voluntariadosRouter);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Kellun',
      version: '1.0.0',
      description:
        'API REST para la gestión de logros e insignias de voluntarios dentro de la plataforma Kellun.',
      contact: {
        name: 'Equipo Kellun'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      },
      {
        url: 'https://kellun-project-api.onrender.com',
        description: 'Servidor producción'
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

function validarVoluntariado(req, res, next) {
  const { titulo, descripcion, tipo, activo } = req.body;

  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({
      error: "El atributo 'titulo' debe ser una cadena de texto no vacía."
    });
  }

  if (typeof descripcion !== 'string' || descripcion.trim() === '') {
    return res.status(400).json({
      error: "El atributo 'descripcion' debe ser una cadena de texto no vacía."
    });
  }

  if (typeof tipo !== 'string' || tipo.trim() === '') {
    return res.status(400).json({
      error: "El atributo 'tipo' debe ser una cadena de texto no vacía."
    });
  }

  if (activo !== 0 && activo !== 1) {
    return res.status(400).json({
      error: "El atributo 'activo' debe ser 0 o 1."
    });
  }

  next();
}

/**
 * @swagger
 * /logros:
 *   get:
 *     tags:
 *       - Logros
 *     summary: Obtener todos los logros
 *     description: Retorna una lista con todos los logros registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de logros obtenida correctamente.
 */
app.get('/logros', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM logros');
    res.json(result.rows);
  } catch (error) {
    console.error('Error en GET /logros:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * @swagger
 * /voluntarios/{voluntarioId}/logros:
 *   get:
 *     tags:
 *       - Logros
 *     summary: Obtener logros de un voluntario
 *     description: Retorna todas las insignias asociadas a un voluntario específico.
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         description: Identificador único del voluntario.
 *         schema:
 *           type: integer
 *           example: 12345
 *     responses:
 *       200:
 *         description: Lista de logros obtenida correctamente.
 *       404:
 *         description: Voluntario no encontrado.
 */
app.get('/voluntarios/:voluntarioId/logros', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM logros WHERE "voluntarioId" = $1',
      [req.params.voluntarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error en GET /voluntarios/:voluntarioId/logros:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/**
 * @swagger
 * /logros:
 *   post:
 *     tags:
 *       - Logros
 *     summary: Crear un nuevo logro
 *     description: Registra manualmente una insignia o logro para un voluntario.
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
 *                 description: Identificador único del voluntario.
 *                 example: 12345
 *               nombreLogro:
 *                 type: string
 *                 description: Nombre de la insignia obtenida.
 *                 example: Primer Voluntariado
 *               fechaObtencion:
 *                 type: string
 *                 description: Fecha de obtención del logro.
 *                 example: 2026-06-02
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada del logro.
 *                 example: Participó exitosamente en su primer voluntariado.
 *     responses:
 *       201:
 *         description: Logro creado correctamente.
 *       400:
 *         description: Error de validación o logro duplicado.
 *       500:
 *         description: Error interno del servidor.
 */
app.post('/logros', validarLogro, async (req, res) => {
  const {
    voluntarioId,
    nombreLogro,
    fechaObtencion,
    descripcion
  } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO logros ("voluntarioId", "nombreLogro", "fechaObtencion", descripcion) VALUES ($1, $2, $3, $4) RETURNING "idLogro"',
      [voluntarioId, nombreLogro, fechaObtencion, descripcion]
    );

    res.status(201).json({
      idLogro: result.rows[0].idLogro,
      voluntarioId,
      nombreLogro,
      fechaObtencion,
      descripcion
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'El voluntario ya posee esta insignia.'
      });
    }
    console.error('Error en POST /logros:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntarios/{voluntarioId}/completar-actividad:
 *   post:
 *     tags:
 *       - Logros
 *     summary: Completar actividad
 *     description: Registra una actividad completada y asigna automáticamente la insignia inicial si corresponde.
 *     parameters:
 *       - in: path
 *         name: voluntarioId
 *         required: true
 *         description: Identificador único del voluntario.
 *         schema:
 *           type: integer
 *           example: 12345
 *     responses:
 *       201:
 *         description: Insignia automática otorgada.
 *       200:
 *         description: Actividad registrada sin asignar nuevas insignias.
 *       400:
 *         description: ID inválido o error al generar la insignia.
 */
app.post('/voluntarios/:voluntarioId/completar-actividad', async (req, res) => {
  const voluntarioId = parseInt(req.params.voluntarioId, 10);

  if (isNaN(voluntarioId)) {
    return res.status(400).json({
      error: 'ID de voluntario inválido.'
    });
  }

  try {
    const conteoRes = await db.query(
      'SELECT COUNT(*) as total FROM logros WHERE "voluntarioId" = $1',
      [voluntarioId]
    );
    const total = parseInt(conteoRes.rows[0].total, 10);

    if (total === 0) {
      const nombreLogro = 'Colaborador Iniciado';
      const fechaObtencion = new Date().toISOString().split('T')[0];
      const descripcion =
        'Otorgada automáticamente al validar su primera actividad de voluntariado.';

      const result = await db.query(
        'INSERT INTO logros ("voluntarioId", "nombreLogro", "fechaObtencion", descripcion) VALUES ($1, $2, $3, $4) RETURNING "idLogro"',
        [voluntarioId, nombreLogro, fechaObtencion, descripcion]
      );

      return res.status(201).json({
        mensaje:
          '¡Primera actividad completada! Sistema validado de forma automática.',
        insignia: {
          idLogro: result.rows[0].idLogro,
          voluntarioId,
          nombreLogro,
          fechaObtencion,
          descripcion
        }
      });
    }

    res.json({
      mensaje:
        'Actividad registrada con éxito. El voluntario ya cuenta con insignias previas.'
    });
  } catch (error) {
    console.error('Error en POST /completar-actividad:', error);
    return res.status(400).json({
      error: 'Error al generar la insignia automática.'
    });
  }
});

/**
 * @swagger
 * /logros/{idLogro}:
 *   put:
 *     tags:
 *       - Logros
 *     summary: Actualizar un logro
 *     description: Modifica la información de un logro existente.
 *     parameters:
 *       - in: path
 *         name: idLogro
 *         required: true
 *         description: Identificador único del logro.
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 example: 12345
 *               nombreLogro:
 *                 type: string
 *                 example: Primer Voluntariado
 *               fechaObtencion:
 *                 type: string
 *                 example: 2026-06-02
 *               descripcion:
 *                 type: string
 *                 example: Participó exitosamente en su primer voluntariado.
 *     responses:
 *       200:
 *         description: Logro actualizado correctamente.
 *       400:
 *         description: Error de validación.
 *       404:
 *         description: Logro no encontrado.
 */
app.put('/logros/:idLogro', validarLogro, async (req, res) => {
  const {
    voluntarioId,
    nombreLogro,
    fechaObtencion,
    descripcion
  } = req.body;

  try {
    const info = await db.query(
      'UPDATE logros SET "voluntarioId"=$1, "nombreLogro"=$2, "fechaObtencion"=$3, descripcion=$4 WHERE "idLogro"=$5',
      [
        voluntarioId,
        nombreLogro,
        fechaObtencion,
        descripcion,
        req.params.idLogro
      ]
    );

    if (info.rowCount === 0) {
      return res.status(404).json({
        error: 'Logro no encontrado'
      });
    }

    res.json({
      mensaje: 'Logro actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error en PUT /logros/:idLogro:', error);
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
 *     tags:
 *       - Logros
 *     summary: Eliminar un logro
 *     description: Elimina un logro existente mediante su identificador.
 *     parameters:
 *       - in: path
 *         name: idLogro
 *         required: true
 *         description: Identificador único del logro.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Logro eliminado correctamente.
 *       404:
 *         description: Logro no encontrado.
 */
app.delete('/logros/:idLogro', async (req, res) => {
  try {
    const info = await db.query(
      'DELETE FROM logros WHERE "idLogro"=$1',
      [req.params.idLogro]
    );

    if (info.rowCount === 0) {
      return res.status(404).json({
        error: 'Logro no encontrado'
      });
    }

    res.json({
      mensaje: 'Logro eliminado'
    });
  } catch (error) {
    console.error('Error en DELETE /logros/:idLogro:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntariados:
 *   get:
 *     tags:
 *       - Voluntariados
 *     summary: Obtener voluntariados
 *     description: Retorna todos los voluntariados o permite filtrarlos por tipo y estado.
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         example: limpieza
 *       - in: query
 *         name: activo
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de voluntariados.
 */
app.get('/voluntariados', async (req, res) => {
  const { tipo, activo } = req.query;

  let sql = 'SELECT * FROM voluntariados WHERE 1=1';
  const params = [];
  let paramCount = 1;

  if (tipo) {
    sql += ` AND tipo = $${paramCount++}`;
    params.push(tipo);
  }

  if (activo !== undefined) {
    sql += ` AND activo = $${paramCount++}`;
    params.push(Number(activo));
  }

  try {
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error en GET /voluntariados:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntariados/{id}:
 *   get:
 *     tags:
 *       - Voluntariados
 *     summary: Obtener voluntariado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voluntariado encontrado.
 *       404:
 *         description: Voluntariado no encontrado.
 */
app.get('/voluntariados/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM voluntariados WHERE "idVoluntariado" = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Voluntariado no encontrado'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error en GET /voluntariados/:id:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntariados:
 *   post:
 *     tags:
 *       - Voluntariados
 *     summary: Crear voluntariado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - tipo
 *               - activo
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               activo:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Voluntariado creado correctamente.
 */
app.post('/voluntariados', validarVoluntariado, async (req, res) => {
  const { titulo, descripcion, tipo, activo } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO voluntariados
      (titulo, descripcion, tipo, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING "idVoluntariado"`,
      [titulo, descripcion, tipo, activo]
    );

    res.status(201).json({
      idVoluntariado: result.rows[0].idVoluntariado,
      titulo,
      descripcion,
      tipo,
      activo
    });
  } catch (error) {
    console.error('Error en POST /voluntariados:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntariados/{id}:
 *   put:
 *     tags:
 *       - Voluntariados
 *     summary: Actualizar voluntariado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - tipo
 *               - activo
 *     responses:
 *       200:
 *         description: Voluntariado actualizado.
 *       404:
 *         description: Voluntariado no encontrado.
 */
app.put('/voluntariados/:id', validarVoluntariado, async (req, res) => {
  const { titulo, descripcion, tipo, activo } = req.body;

  try {
    const info = await db.query(
      `UPDATE voluntariados
       SET titulo=$1, descripcion=$2, tipo=$3, activo=$4
       WHERE "idVoluntariado"=$5`,
      [titulo, descripcion, tipo, activo, req.params.id]
    );

    if (info.rowCount === 0) {
      return res.status(404).json({
        error: 'Voluntariado no encontrado'
      });
    }

    res.json({
      mensaje: 'Voluntariado actualizado correctamente'
    });
  } catch (error) {
    console.error('Error en PUT /voluntariados/:id:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

/**
 * @swagger
 * /voluntariados/{id}:
 *   delete:
 *     tags:
 *       - Voluntariados
 *     summary: Eliminar voluntariado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voluntariado eliminado.
 *       404:
 *         description: Voluntariado no encontrado.
 */
app.delete('/voluntariados/:id', async (req, res) => {
  try {
    const info = await db.query(
      'DELETE FROM voluntariados WHERE "idVoluntariado" = $1',
      [req.params.id]
    );

    if (info.rowCount === 0) {
      return res.status(404).json({
        error: 'Voluntariado no encontrado'
      });
    }

    res.json({
      mensaje: 'Voluntariado eliminado correctamente'
    });
  } catch (error) {
    console.error('Error en DELETE /voluntariados/:id:', error);
    res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}/docs`);
});