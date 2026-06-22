'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [tipos, setTipos] = useState([]);
  const [voluntariados, setVoluntariados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  // URL base de la API parametrizada desde variables de entorno
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    cargarTipos();
    cargarVoluntariados();
  }, []);

  const mostrarToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const cargarTipos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/voluntariados/tipos`);
      if (!res.ok) throw new Error('No se pudieron obtener los tipos de voluntariados');
      const data = await res.json();
      setTipos(data);
    } catch (error) {
      console.error(error);
      setErrorMsg('Error al conectar con el servidor para obtener los filtros.');
      mostrarToast('Error al cargar tipos de filtros.', 'error');
    }
  };

  const cargarVoluntariados = async (searchQuery = query, tipo = selectedTipo) => {
    setIsLoading(true);
    setErrorMsg('');
    let url = `${API_URL}/api/voluntariados`;
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error en la búsqueda de voluntariados');
      const data = await res.json();
      setVoluntariados(data);
    } catch (error) {
      console.error(error);
      setErrorMsg('Error al cargar la lista de voluntariados. Verifique si el servidor de la API está en línea.');
      mostrarToast('Error de conexión con el servidor.', 'error');
      setVoluntariados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    cargarVoluntariados();
  };

  const handleTipoChange = (e) => {
    const val = e.target.value;
    setSelectedTipo(val);
    cargarVoluntariados(query, val);
  };

  const handleReset = () => {
    setQuery('');
    setSelectedTipo('');
    cargarVoluntariados('', '');
  };

  const handleInscribirse = (title) => {
    mostrarToast(`¡Inscripción exitosa a "${title}"! 🎉`);
  };

  const capitalizar = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  return (
    <>
      {/* Fondos difuminados dinámicos */}
      <div className="background-glow bg-glow-1"></div>
      <div className="background-glow bg-glow-2"></div>

      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#logo-grad)"/>
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="3" x2="22" y2="21.35" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="logo-text">Kellun</h1>
          </div>
          <p className="subtitle">Conecta con voluntariados y haz la diferencia hoy (Next.js)</p>
          <a href={`${API_URL}/docs`} target="_blank" rel="noopener noreferrer" className="docs-link" id="btn-api-docs">Ver API Docs</a>
        </header>

        <main className="main-content">
          {/* Banner de error si la API no responde */}
          {errorMsg && (
            <div className="error-banner">
              <svg className="error-banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Filtros y campo de búsqueda */}
          <section className="search-section glass-panel">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  id="search-input"
                  placeholder="Buscar voluntariados por título o descripción..."
                  aria-label="Buscar voluntariados"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              
              <div className="select-wrapper">
                <select
                  id="tipo-filter"
                  aria-label="Filtrar por tipo de voluntariado"
                  value={selectedTipo}
                  onChange={handleTipoChange}
                >
                  <option value="">Todos los tipos</option>
                  {tipos.map((tipo, idx) => (
                    <option key={idx} value={tipo}>
                      {capitalizar(tipo)}
                    </option>
                  ))}
                </select>
              </div>
              
              <button type="submit" id="btn-buscar" className="btn-primary">Buscar</button>
            </form>
          </section>

          {/* Resultados */}
          <section className="results-section">
            <div className="results-header">
              <h2 class="section-title">Oportunidades de Voluntariado</h2>
              <span id="results-count" className="badge">
                {isLoading ? 'Buscando...' : `${voluntariados.length} ${voluntariados.length === 1 ? 'resultado' : 'resultados'}`}
              </span>
            </div>

            {!isLoading && voluntariados.length > 0 ? (
              <div className="volunteerings-grid">
                {voluntariados.map((voluntariado) => (
                  <article
                    key={voluntariado.idVoluntariado}
                    className="volunteering-card glass-panel"
                    data-type={voluntariado.tipo.toLowerCase()}
                  >
                    <div className="card-top">
                      <span className="card-type">{voluntariado.tipo}</span>
                      <h3 className="card-title">{voluntariado.titulo}</h3>
                      <p className="card-description">{voluntariado.descripcion}</p>
                    </div>
                    <div className="card-action">
                      <button
                        className="btn-card"
                        onClick={() => handleInscribirse(voluntariado.titulo)}
                      >
                        Inscribirse
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {/* Estado Vacío */}
            {!isLoading && voluntariados.length === 0 && (
              <div id="empty-state" className="empty-state glass-panel">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
                <h3>No se encontraron voluntariados</h3>
                <p>No existen voluntariados activos que coincidan con tu búsqueda en este momento.</p>
                <button onClick={handleReset} id="btn-reset" className="btn-secondary">Restablecer filtros</button>
              </div>
            )}
          </section>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 Proyecto Kellun. Todos los derechos reservados.</p>
        </footer>
      </div>

      {/* Componente Toast de notificación */}
      {toast.visible && (
        <div
          id="toast"
          className="toast"
          style={{ background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)' }}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}
