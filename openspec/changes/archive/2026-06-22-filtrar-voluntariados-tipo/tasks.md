## 1. Backend Layer Implementation

- [x] 1.1 Crear el archivo `services/voluntariadoService.js` con las funciones `getVoluntariadosActivos(tipo, busqueda)` y `getTiposActivos()` para consultar la base de datos sqlite.
- [x] 1.2 Crear el archivo `controllers/voluntariadoController.js` para manejar la lógica de las peticiones, validación de parámetros y respuestas HTTP semánticas.
- [x] 1.3 Crear el archivo `routes/voluntariados.js` para definir las rutas GET `/` y GET `/tipos` y asociarlas al controlador.

## 2. Server Integration

- [x] 2.1 Importar y registrar el router de voluntariados en `index.js` bajo el prefijo `/api/voluntariados`.
- [x] 2.2 Configurar Express en `index.js` para servir de forma estática los archivos contenidos en el directorio `public/`.

## 3. Frontend Implementation

- [x] 3.1 Crear la carpeta `public/` en la raíz del proyecto.
- [x] 3.2 Crear el archivo `public/index.html` con la estructura semántica de la página de búsqueda, incluyendo selector de tipo, campo de búsqueda y sección para listar resultados o mensajes.
- [x] 3.3 Crear el archivo `public/style.css` implementando un diseño de interfaz de usuario moderno, paleta de colores premium y estilos responsivos.
- [x] 3.4 Crear el archivo `public/app.js` para manejar la lógica de fetch dinámico a la API, poblar el selector de tipos, ejecutar la búsqueda y renderizar las tarjetas de voluntariado.

## 4. Verification and Testing

- [x] 4.1 Iniciar el servidor localmente y verificar que los endpoints `/api/voluntariados` y `/api/voluntariados/tipos` responden con códigos y formatos de datos correctos.
- [x] 4.2 Probar manualmente el flujo completo: carga inicial dinámica, búsqueda por texto, filtrado por tipo, combinación de ambos, y visualización del mensaje informativo cuando no hay voluntariados disponibles.
