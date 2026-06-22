## Context

El sistema Kellun posee una base de datos SQLite con una tabla `voluntariados` conteniendo información sobre voluntariados activos e inactivos, con campos como `titulo`, `descripcion`, `tipo` y `activo`. Actualmente, toda la lógica de la API está concentrada en un único archivo (`index.js`). No hay una interfaz de usuario integrada para que los voluntarios busquen y filtren los voluntariados.

Para cumplir con la Historia de Usuario y la Definición de Terminado (DOD), se requiere:
1. Refactorizar/estructurar la lógica de negocio de voluntariados en capas de Responsabilidad Única: `routes/`, `controllers/` y `services/`.
2. Crear una interfaz frontend en Vanilla HTML, CSS y JS, estructurada en archivos separados, servida de forma estática por el mismo servidor Express.
3. Consumir la API para obtener dinámicamente las opciones de filtrado (tipos) y realizar búsquedas con soporte de filtros combinados.

## Goals / Non-Goals

**Goals:**
- Separar la arquitectura del backend en capas estructuradas (`routes/`, `controllers/`, `services/`).
- Proveer un endpoint dinámico `/api/voluntariados/tipos` para consultar los tipos de voluntariados activos existentes.
- Proveer un endpoint `/api/voluntariados` que liste los voluntariados activos, permitiendo filtrar por tipo y realizar búsqueda por texto (combinados).
- Diseñar e implementar una interfaz de frontend premium usando HTML5 semántico, CSS responsivo/estilizado y JS con `fetch` para interacción interactiva sin recarga de página.
- Retornar códigos HTTP semánticos correctos (200 para éxito, 400 para parámetros inválidos, etc.).

**Non-Goals:**
- Implementar frameworks de frontend (React, Vue, etc.) - Todo debe ser vanilla.
- Modificar la lógica existente de Logros u Organizaciones en `index2.js` (API Organizaciones en puerto 4000).
- Rediseñar el motor de base de datos actual (se mantiene `better-sqlite3`).

## Decisions

### 1. Estructura de Capas en Backend
Se creará la siguiente estructura de carpetas:
- **`services/voluntariadoService.js`**: Encapsula el acceso directo a la base de datos SQLite.
  - `getVoluntariadosActivos(tipo, busqueda)`: Genera y ejecuta consultas preparadas para obtener voluntariados activos, aplicando filtros si existen.
  - `getTiposActivos()`: Retorna una lista de cadenas con los tipos únicos de voluntariados que tienen `activo = 1`.
- **`controllers/voluntariadoController.js`**: Valida y parsea los parámetros de entrada y formatea las respuestas JSON correspondientes.
  - `listarVoluntariados(req, res)`: Maneja `GET /api/voluntariados`.
  - `listarTipos(req, res)`: Maneja `GET /api/voluntariados/tipos`.
- **`routes/voluntariados.js`**: Enrutador Express que conecta los endpoints con sus controladores.

### 2. Integración en `index.js`
- Se montarán las rutas creadas en `/api/voluntariados` usando `app.use('/api/voluntariados', voluntariadosRouter)`.
- Se configurará middleware estático para servir la carpeta `public/` en la raíz del sitio web: `app.use(express.static('public'))`.

### 3. Consultas SQL
Para asegurar un correcto filtrado de registros activos:
- **Obtener tipos únicos activos**:
  ```sql
  SELECT DISTINCT tipo FROM voluntariados WHERE activo = 1
  ```
- **Listar voluntariados activos con filtros combinados**:
  ```sql
  SELECT * FROM voluntariados WHERE activo = 1
  ```
  Si se proporciona `tipo`: `AND tipo = ?`
  Si se proporciona `q` (búsqueda por texto): `AND (titulo LIKE ? OR descripcion LIKE ?)` (con parámetros `%query%`)

### 4. Estructura del Frontend
Se colocará en el directorio `public/`:
- `index.html`: Estructura HTML5 semántica. Contiene contenedor de búsqueda, selector `<select id="tipo-filter">`, contenedor de resultados y un mensaje informativo para cuando no hay coincidencias.
- `styles.css`: Estilos premium usando CSS variables para una paleta de colores moderna (grises profundos, verdes y violetas elegantes), micro-animaciones en tarjetas de voluntariado y adaptabilidad móvil.
- `app.js`: Lógica de interacción en JS vainilla. Realiza las llamadas `fetch` a la API para poblar el selector de tipos y para listar/filtrar los voluntariados al cambiar el filtro o enviar la búsqueda.

## Risks / Trade-offs

- **[Riesgo]** Conflicto con las rutas existentes de `/voluntariados` de `index.js`.
  - *Mitigación:* Se mantendrán las rutas antiguas sin cambios para retrocompatibilidad, pero las nuevas funcionalidades y el frontend utilizarán los endpoints modularizados bajo el prefijo `/api/voluntariados`.
- **[Riesgo]** Inyección SQL al usar filtros dinámicos.
  - *Mitigación:* Se utilizarán exclusivamente consultas preparadas con placeholders `?` proporcionados por `better-sqlite3`.
