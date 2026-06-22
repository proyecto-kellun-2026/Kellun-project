## 1. Setup y Variables de Entorno

- [x] 1.1 Crear el archivo `docker-compose.yml` en la raíz del proyecto definiendo el servicio PostgreSQL y la persistencia de datos.
- [x] 1.2 Crear el archivo `.env.example` con las variables de configuración de conexión de la base de datos y puertos.
- [x] 1.3 Agregar `.env` al archivo `.gitignore` para prevenir subir credenciales sensibles.
- [x] 1.4 Instalar las dependencias `pg` y `dotenv` en el archivo `package.json`.

## 2. Capa de Datos y Persistencia en PostgreSQL

- [x] 2.1 Refactorizar `db.js` para usar `pg.Pool`, cargar variables del `.env` e inicializar las tablas `logros` y `voluntariados` con sus semillas iniciales.
- [x] 2.2 Refactorizar `db_organizaciones.js` para usar `pg.Pool` conectándose a PostgreSQL e inicializando la tabla `registroOrganizaciones`.

## 3. Adaptación Asíncrona de Endpoints y Controladores

- [x] 3.1 Refactorizar `services/voluntariadoService.js` para que sus métodos sean asíncronos y utilicen consultas compatibles con PostgreSQL (placeholders `$1`, `$2`, etc.).
- [x] 3.2 Refactorizar `controllers/voluntariadoController.js` para llamar de forma asíncrona (`await`) a los servicios y propagar errores mediante `try/catch`.
- [x] 3.3 Refactorizar todos los endpoints de `index.js` (logros, voluntariados) para usar `async/await`, placeholders `$1`, `$2` de PostgreSQL y mapear el ID del objeto creado con `RETURNING`.
- [x] 3.4 Refactorizar todos los endpoints de `index2.js` (registroOrganizaciones) para usar `async/await`, placeholders de PostgreSQL y manejo de errores de unicidad `23505`.

## 4. Verificación y Pruebas

- [x] 4.1 Iniciar el contenedor Docker de PostgreSQL mediante `docker-compose up -d`.
- [x] 4.2 Ejecutar las API (`npm run start` o equivalentes para `index.js` e `index2.js`) para validar la creación automática de tablas y la siembra de datos.
- [x] 4.3 Verificar el correcto funcionamiento de los endpoints GET, POST, PUT y DELETE mediante llamadas de prueba.

