document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const tipoFilter = document.getElementById('tipo-filter');
  const searchForm = document.getElementById('search-form');
  const volunteeringsContainer = document.getElementById('volunteerings-container');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');
  const btnReset = document.getElementById('btn-reset');
  const toast = document.getElementById('toast');

  // Inicializar datos al cargar la página
  cargarTipos();
  cargarVoluntariados();

  // Event Listeners para formularios y filtros
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    cargarVoluntariados();
  });

  tipoFilter.addEventListener('change', () => {
    cargarVoluntariados();
  });

  btnReset.addEventListener('click', () => {
    searchInput.value = '';
    tipoFilter.value = '';
    cargarVoluntariados();
  });

  /**
   * Obtiene la lista de tipos de voluntariados dinámicos de la API
   * y los inyecta en el selector de filtros.
   */
  async function cargarTipos() {
    try {
      const response = await fetch('/api/voluntariados/tipos');
      if (!response.ok) throw new Error('Error al cargar tipos de voluntariados');
      
      const tipos = await response.json();
      
      // Resetear opciones manteniendo la de selección por defecto
      tipoFilter.innerHTML = '<option value="">Todos los tipos</option>';
      tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = capitalizar(tipo);
        tipoFilter.appendChild(option);
      });
    } catch (error) {
      console.error(error);
      mostrarToast('Error al conectar con el servidor para obtener los filtros.', 'error');
    }
  }

  /**
   * Obtiene los voluntariados filtrados por tipo y por texto de búsqueda.
   */
  async function cargarVoluntariados() {
    const query = searchInput.value.trim();
    const tipo = tipoFilter.value;
    
    let url = '/api/voluntariados';
    const params = new URLSearchParams();
    
    if (tipo) params.append('tipo', tipo);
    if (query) params.append('q', query);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      resultsCount.textContent = 'Buscando...';
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Error al buscar voluntariados');
      
      const voluntariados = await response.json();
      renderizarVoluntariados(voluntariados);
    } catch (error) {
      console.error(error);
      resultsCount.textContent = 'Error';
      mostrarToast('Error al cargar la lista de voluntariados.', 'error');
    }
  }

  /**
   * Renderiza el listado de voluntariados en la grilla del frontend.
   * Si no hay resultados, muestra el estado vacío.
   */
  function renderizarVoluntariados(lista) {
    volunteeringsContainer.innerHTML = '';
    resultsCount.textContent = `${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'}`;

    if (lista.length === 0) {
      emptyState.classList.remove('hidden');
      volunteeringsContainer.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    volunteeringsContainer.classList.remove('hidden');

    lista.forEach(voluntariado => {
      const card = document.createElement('article');
      card.className = 'volunteering-card glass-panel';
      // Permite usar estilos específicos por tipo
      card.setAttribute('data-type', voluntariado.tipo.toLowerCase());

      card.innerHTML = `
        <div class="card-top">
          <span class="card-type">${voluntariado.tipo}</span>
          <h3 class="card-title">${voluntariado.titulo}</h3>
          <p class="card-description">${voluntariado.descripcion}</p>
        </div>
        <div class="card-action">
          <button class="btn-card" data-id="${voluntariado.idVoluntariado}" data-title="${voluntariado.titulo}">Inscribirse</button>
        </div>
      `;

      // Evento del botón de inscripción
      card.querySelector('.btn-card').addEventListener('click', (e) => {
        const title = e.target.getAttribute('data-title');
        mostrarToast(`¡Inscripción exitosa a "${title}"! 🎉`);
      });

      volunteeringsContainer.appendChild(card);
    });
  }

  /**
   * Capitaliza la primera letra del texto.
   */
  function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Manejo de la notificación Toast
  let toastTimeout;
  function mostrarToast(mensaje, tipo = 'success') {
    clearTimeout(toastTimeout);
    toast.textContent = mensaje;
    toast.className = 'toast'; // resetear clases
    
    if (tipo === 'error') {
      toast.style.background = 'rgba(239, 68, 68, 0.9)'; // rojo
    } else {
      toast.style.background = 'rgba(16, 185, 129, 0.9)'; // verde
    }

    toast.classList.remove('hidden');

    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }
});
