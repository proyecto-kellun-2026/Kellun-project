const db = require('../db');

/**
 * Obtiene los voluntariados activos del sistema, permitiendo filtrar por tipo
 * y/o realizar una búsqueda por texto en el título y descripción.
 * 
 * @param {string} [tipo] - Tipo de voluntariado para filtrar.
 * @param {string} [busqueda] - Término de búsqueda para título y descripción.
 * @returns {Array} Lista de voluntariados activos que coinciden con los criterios.
 */
function getVoluntariadosActivos(tipo, busqueda) {
  let sql = 'SELECT * FROM voluntariados WHERE activo = 1';
  const params = [];

  if (tipo) {
    sql += ' AND tipo = ?';
    params.push(tipo);
  }

  if (busqueda && busqueda.trim() !== '') {
    sql += ' AND (titulo LIKE ? OR descripcion LIKE ?)';
    const searchPattern = `%${busqueda.trim()}%`;
    params.push(searchPattern, searchPattern);
  }

  return db.prepare(sql).all(...params);
}

/**
 * Obtiene la lista de todos los tipos únicos de voluntariados activos registrados.
 * 
 * @returns {Array<string>} Lista de nombres de tipos únicos.
 */
function getTiposActivos() {
  const rows = db.prepare('SELECT DISTINCT tipo FROM voluntariados WHERE activo = 1').all();
  return rows.map(row => row.tipo);
}

module.exports = {
  getVoluntariadosActivos,
  getTiposActivos
};
