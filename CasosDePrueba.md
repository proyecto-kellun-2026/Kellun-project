# Casos de Prueba – US-09
 
| ID    | Qué se debe hacer (acción / entrada)        | Salida esperada                |
|-------|---------------------------------------------|--------------------------------|
| CP-01 | Busqueda sin filtro: Ingresar a la pantalla de búsqueda y hacer clic en la pestaña de filtros. Seleccionar la opción de todos los tipos     | Se muestra la cantidad de voluntariados  disponible sin importar el tipo, además de mostrar todos los voluntariados disponibles.           |
| CP-02 | Busqueda con filtro: Ingresar a la pantalla de búsqueda y hacer clic en la pestaña de filtros. Seleccionar la opción de animales          | Se muestra la cantidad de voluntariados de tipo animales, además de mostrar solo los voluntariados de ese tipo      |
| CP-03 | Filtro de un nuevo tipo de voluntariado: Desde la api, postear un voluntariado cuyo tipo sea eduacion (no existente previamiente). Luego, desde la pagina de busqueda, clickear la pestaña de filtros                | El nuevo tipo de voluntariado aparece en la pestaña de filtros          |
|  CP-4 | Busqueda por la barra de búsqueda: Ingresar a la pantalla de búsqueda. Seleccionar en filtro que muestre todos los tipos. Seleccionar la barra de busqueda e ingresar la palabra lectura| Se muestra la cantidad de voluntariados y los voluntariados que tengan en su titulo o descripcion la palabra lectura
| CP-5 | Busqueda de voluntarios inactivos: Desde la Api, postear un voluntariado cuyo estado sea 0. Luego, desde la página de busqueda seleccionar el filtro de todos los tipos y presionar buscar| Aparecen solo voluntariados que se encuentren activos(valor 0)| 

