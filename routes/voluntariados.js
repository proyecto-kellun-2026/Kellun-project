const express = require('express');
const router = express.Router();
const voluntariadoController = require('../controllers/voluntariadoController');

/**
 * @swagger
 * /api/voluntariados:
 *   get:
 *     tags:
 *       - Voluntariados
 *     summary: Obtener voluntariados activos filtrados
 *     description: Retorna todos los voluntariados activos, permitiendo filtrar por tipo y/o por término de búsqueda (q).
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Tipo de voluntariado (por ejemplo, animales, limpieza, etc.)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar por título y descripción
 *     responses:
 *       200:
 *         description: Lista de voluntariados activos.
 *       400:
 *         description: Parámetros inválidos.
 *       500:
 *         description: Error del servidor.
 */
router.get('/', voluntariadoController.listarVoluntariados);

/**
 * @swagger
 * /api/voluntariados/tipos:
 *   get:
 *     tags:
 *       - Voluntariados
 *     summary: Obtener tipos de voluntariado activos únicos
 *     description: Retorna una lista con todos los tipos únicos de voluntariados que están activos en el sistema.
 *     responses:
 *       200:
 *         description: Lista de tipos únicos.
 *       500:
 *         description: Error del servidor.
 */
router.get('/tipos', voluntariadoController.listarTipos);

module.exports = router;
