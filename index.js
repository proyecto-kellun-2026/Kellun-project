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
app.get('/logros', (req, res) => {
  const logros = db.prepare('SELECT * FROM logros').all();
  res.json(logros);
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
app.get('/voluntariados', (req, res) => {
  const { tipo, activo } = req.query;

  let sql = 'SELECT * FROM voluntariados WHERE 1=1';
  const params = [];

  if (tipo) {
    sql += ' AND tipo = ?';
    params.push(tipo);
  }

  if (activo !== undefined) {
    sql += ' AND activo = ?';
    params.push(Number(activo));
  }

  const voluntariados = db.prepare(sql).all(...params);

  res.json(voluntariados);
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
app.get('/voluntariados/:id', (req, res) => {
  const voluntariado = db.prepare(
    'SELECT * FROM voluntariados WHERE idVoluntariado = ?'
  ).get(req.params.id);

  if (!voluntariado) {
    return res.status(404).json({
      error: 'Voluntariado no encontrado'
    });
  }

  res.json(voluntariado);
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
app.post('/voluntariados', validarVoluntariado, (req, res) => {
  const { titulo, descripcion, tipo, activo } = req.body;

  const result = db.prepare(
    `INSERT INTO voluntariados
    (titulo, descripcion, tipo, activo)
    VALUES (?, ?, ?, ?)`
  ).run(
    titulo,
    descripcion,
    tipo,
    activo
  );

  res.status(201).json({
    idVoluntariado: result.lastInsertRowid,
    titulo,
    descripcion,
    tipo,
    activo
  });
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
app.put('/voluntariados/:id', validarVoluntariado, (req, res) => {
  const { titulo, descripcion, tipo, activo } = req.body;

  const info = db.prepare(
    `UPDATE voluntariados
     SET titulo=?, descripcion=?, tipo=?, activo=?
     WHERE idVoluntariado=?`
  ).run(
    titulo,
    descripcion,
    tipo,
    activo,
    req.params.id
  );

  if (info.changes === 0) {
    return res.status(404).json({
      error: 'Voluntariado no encontrado'
    });
  }

  res.json({
    mensaje: 'Voluntariado actualizado correctamente'
  });
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
app.delete('/voluntariados/:id', (req, res) => {
  const info = db.prepare(
    'DELETE FROM voluntariados WHERE idVoluntariado = ?'
  ).run(req.params.id);

  if (info.changes === 0) {
    return res.status(404).json({
      error: 'Voluntariado no encontrado'
    });
  }

  res.json({
    mensaje: 'Voluntariado eliminado correctamente'
  });
});

app.listen(3000, () => {
  console.log('API corriendo en http://localhost:3000');
  console.log('Swagger disponible en http://localhost:3000/docs');
});