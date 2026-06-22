# persistencia-datos-postgres Specification

## Purpose
TBD - created by archiving change migrate-to-postgres-docker. Update Purpose after archive.
## Requirements
### Requirement: Persistencia en PostgreSQL mediante Docker
El sistema SHALL ejecutar el motor de base de datos PostgreSQL dentro de un contenedor Docker con volumen persistente, garantizando que los datos no se pierdan al reiniciar o detener el contenedor.

#### Scenario: Persistencia tras reinicio de contenedor
- **WHEN** se detiene y reinicia el contenedor Docker de PostgreSQL
- **THEN** los datos previamente insertados SHALL seguir existiendo y ser accesibles.

### Requirement: Configuración mediante variables de entorno
El sistema SHALL cargar las credenciales y parámetros de conexión (host, puerto, usuario, contraseña, nombre de base de datos) a través de un archivo `.env`, omitido del control de versiones.

#### Scenario: Conexión exitosa a la base de datos
- **WHEN** el servidor Express inicia leyendo las variables de entorno válidas de `.env`
- **THEN** el pool de conexiones de `pg` SHALL conectarse exitosamente a PostgreSQL en localhost.

### Requirement: Compatibilidad de Endpoints
La API Express SHALL responder a las peticiones GET, POST, PUT y DELETE para logros, voluntariados y organizaciones con la misma estructura JSON y códigos de estado HTTP que con SQLite.

#### Scenario: Consulta de voluntariados activos
- **WHEN** se envía una petición GET a `/api/voluntariados`
- **THEN** el servidor SHALL responder con código 200 y la lista de voluntariados activos en formato JSON.

#### Scenario: Creación de logros
- **WHEN** se envía una petición POST a `/logros` con datos válidos
- **THEN** el servidor SHALL insertar el logro en PostgreSQL y responder con código 201 y el objeto creado.

