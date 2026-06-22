## ADDED Requirements

### Requirement: Frontend Next.js Independiente
El sistema SHALL ejecutar un frontend desarrollado en Next.js dentro de un directorio `frontend/` y exponerlo en el puerto 3001 de manera independiente de la API Express.

#### Scenario: Acceso al frontend por el puerto 3001
- **WHEN** el usuario navega a `http://localhost:3001`
- **THEN** el sistema SHALL renderizar la página principal de Kellun cargada desde el servidor Next.js.

### Requirement: Carga Dinámica de Voluntariados
El frontend de Next.js SHALL consultar dinámicamente la lista de voluntariados activos desde la API Express utilizando la variable de entorno `NEXT_PUBLIC_API_URL` configurada durante el arranque.

#### Scenario: Carga exitosa de voluntariados activos
- **WHEN** la página del frontend se carga en el navegador
- **THEN** la aplicación SHALL hacer un fetch a la URL de la API y mostrar la lista de voluntariados activos obtenidos.

### Requirement: Mensaje de Error en la API
El frontend de Next.js SHALL mostrar un mensaje de error visible y claro al usuario si la API de voluntariados no responde o devuelve un código de estado de error.

#### Scenario: API fuera de servicio
- **WHEN** la API Express no es accesible (ej. caída de servicio o error de red) durante la carga de voluntariados
- **THEN** el frontend SHALL mostrar un mensaje en pantalla indicando que hubo un error al conectar con el servidor.

### Requirement: Desconexión de Archivos Estáticos de Express
El servidor Express de la API ya no SHALL servir la carpeta `public` que contenía el frontend legacy, delegando por completo el servicio de interfaz al contenedor del frontend.

#### Scenario: Ruta raíz de la API
- **WHEN** se consulta la raíz `http://localhost:3000/` de la API Express
- **THEN** el servidor SHALL responder con un código 404 o no servir la página estática legacy.
