const db = require('../db');

/**
 * Obtiene los voluntariados activos del sistema, permitiendo filtrar por tipo
 * y/o realizar una búsqueda por texto en el título y descripción.
 * 
 * @param {string} [tipo] - Tipo de voluntariado para filtrar.
 * @param {string} [busqueda] - Término de búsqueda para título y descripción.
 * @returns {Promise<Array>} Lista de voluntariados activos que coinciden con los criterios.
 */
async function getVoluntariadosActivos(tipo, busqueda) {
  let sql = 'SELECT * FROM voluntariados WHERE activo = 1';
  const params = [];
  let paramCount = 1;

  if (tipo) {
    sql += ` AND tipo = $${paramCount++}`;
    params.push(tipo);
  }

  if (busqueda && busqueda.trim() !== '') {
    sql += ` AND (titulo ILIKE $${paramCount++} OR descripcion ILIKE $${paramCount++})`;
    const searchPattern = `%${busqueda.trim()}%`;
    params.push(searchPattern, searchPattern);
  }

  const res = await db.query(sql, params);
  return res.rows;
}

/**
 * Obtiene la lista de todos los tipos únicos de voluntariados activos registrados.
 * 
 * @returns {Promise<Array<string>>} Lista de nombres de tipos únicos.
 */
async function getTiposActivos() {
  const res = await db.query('SELECT DISTINCT tipo FROM voluntariados WHERE activo = 1');
  return res.rows.map(row => row.tipo);
}

module.exports = {
  getVoluntariadosActivos,
  getTiposActivos
};
