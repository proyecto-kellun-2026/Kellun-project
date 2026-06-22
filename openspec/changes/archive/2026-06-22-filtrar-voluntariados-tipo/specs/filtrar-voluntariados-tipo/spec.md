## ADDED Requirements

### Requirement: Obtener tipos de voluntariado de forma dinámica
El sistema SHALL proveer un endpoint HTTP GET `/api/voluntariados/tipos` para obtener una lista con los tipos únicos de voluntariados activos registrados en la base de datos de manera dinámica.

#### Scenario: Obtención exitosa de tipos únicos
- **WHEN** se envía una petición GET a `/api/voluntariados/tipos`
- **THEN** el servidor SHALL responder con un código de estado 200 y una lista en formato JSON que contenga los tipos de voluntariados activos sin duplicados.

### Requirement: Filtrar voluntariados activos por tipo
El sistema SHALL proveer un endpoint HTTP GET `/api/voluntariados` que soporte filtrar voluntariados activos por el tipo seleccionado, además de poder combinarse con otros parámetros de búsqueda.

#### Scenario: Filtrar por un tipo que posee voluntariados activos
- **WHEN** se envía una petición GET a `/api/voluntariados` con el parámetro de consulta `tipo` igual a un tipo con voluntariados activos (ej. `animales`)
- **THEN** el servidor SHALL responder con código 200 y una lista que contenga únicamente los voluntariados activos del tipo especificado.

#### Scenario: Filtrar por un tipo que no posee voluntariados activos
- **WHEN** se envía una petición GET a `/api/voluntariados` con el parámetro de consulta `tipo` igual a un tipo que no tiene voluntariados activos (ej. `tecnologia`)
- **THEN** el servidor SHALL responder con código 200 y una lista vacía.

### Requirement: Interfaz de usuario para búsqueda y filtrado por tipo
El frontend SHALL presentar una interfaz limpia y responsiva para buscar y filtrar voluntariados activos por su tipo, obteniendo las opciones dinámicamente del servidor.

#### Scenario: Cargar opciones de filtro dinámicamente al abrir la página
- **WHEN** el voluntario carga la página de búsqueda
- **THEN** la página SHALL consultar el endpoint de tipos y renderizar el selector con las opciones dinámicas obtenidas.

#### Scenario: Filtrado por tipo seleccionado sin resultados
- **WHEN** el voluntario selecciona un tipo que no tiene voluntariados activos y realiza la búsqueda
- **THEN** la interfaz SHALL desplegar un mensaje claro indicando que no hay voluntariados de ese tipo actualmente.
