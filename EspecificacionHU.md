# Especificación de Historia de Usuario
 
## US-09: Búsqueda de voluntariados por tipo
Como voluntario, quiero filtrar los voluntariados por tipo, para escoger los de mi interés.
 
## Criterios de aceptación
- CA1: Dado que el voluntario abra la página de búsqueda, cuando seleccione la opción de filtrar, entonces se debe desplegar una serie de opciones para escoger el tipo(animales, limpieza, ayuda a personas de la tercera edad, etc ).
- CA2: Dado que se seleccione alguna de esas opciones, cuando se ingrese la búsqueda, entonces se debe mostrar solo los voluntariados de ese tipo.
- CA3: Dado que no existan voluntariados activos del tipo seleccionado, cuando se realice la búsqueda, entonces se muestra un mensaje indicando al voluntario que no hay voluntariados de ese tipo actualmente.
 
## Definition of Done 
1. La lógica de negocio queda separada en routes/, controllers/ y services/, cada capa con una sola responsabilidad.
2. El frontend es HTML + fetch vanilla, sin frameworks, servido por el mismo servidor Express.
3. La API responde con códigos HTTP semánticamente correctos: 201 al crear, 400 para datos inválidos, 404 si no existe, 500 para errores del servidor y 200 para respuesta exitosa.
4. El endpoint de búsqueda por tipo retorna solo los voluntariados que coincidan con el tipo seleccionado.
5. Si no existen voluntariados del tipo seleccionado, el servidor responde con 200 y una lista vacía, y el frontend muestra el mensaje correspondiente.
6. Los tipos disponibles se obtienen dinámicamente desde el servidor, no están hardcodeados en el frontend.
7. El filtro por tipo puede combinarse con otros filtros activos sin romper los resultados.
8. El frontend está estructurado en archivos separados: un .html para el marcado, un .css para los estilos y un .js para la lógica de interacción.
9. La página cuenta con un campo de búsqueda, un selector de filtro por tipo y una sección que lista todos los voluntariados activos disponibles.
