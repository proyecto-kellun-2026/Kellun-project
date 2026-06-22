const voluntariadoService = require('../services/voluntariadoService');

/**
 * Controlador para listar voluntariados activos.
 * Permite filtrar por tipo y/o realizar búsqueda por texto (q).
 * Retorna 200 con la lista (puede ser vacía) o 400 si los parámetros son inválidos.
 */
function listarVoluntariados(req, res) {
  try {
    const { tipo, q } = req.query;

    // Validación de parámetros de consulta
    if (tipo !== undefined && typeof tipo !== 'string') {
      return res.status(400).json({
        error: "El parámetro de consulta 'tipo' debe ser una cadena de texto."
      });
    }

    if (q !== undefined && typeof q !== 'string') {
      return res.status(400).json({
        error: "El parámetro de consulta 'q' (búsqueda) debe ser una cadena de texto."
      });
    }

    const voluntariados = voluntariadoService.getVoluntariadosActivos(tipo, q);
    return res.status(200).json(voluntariados);
  } catch (error) {
    console.error('Error en listarVoluntariados:', error);
    return res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
}

/**
 * Controlador para listar tipos únicos de voluntariados activos.
 * Retorna 200 con la lista de tipos o 500 ante un error.
 */
function listarTipos(req, res) {
  try {
    const tipos = voluntariadoService.getTiposActivos();
    return res.status(200).json(tipos);
  } catch (error) {
    console.error('Error en listarTipos:', error);
    return res.status(500).json({
      error: 'Error interno del servidor.'
    });
  }
}

module.exports = {
  listarVoluntariados,
  listarTipos
};
