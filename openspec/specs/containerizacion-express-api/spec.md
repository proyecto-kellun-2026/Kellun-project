# containerizacion-express-api Specification

## Purpose
TBD - created by archiving change containerize-express-api. Update Purpose after archive.
## Requirements
### Requirement: Contenedorización de la API Express
El sistema SHALL empaquetar la aplicación Express utilizando un Dockerfile basado en una imagen de Node.js Alpine y exponer el puerto 3000 de forma accesible desde la máquina host.

#### Scenario: Ejecución de la API en contenedor
- **WHEN** se construye y arranca el contenedor de la API
- **THEN** la API SHALL estar disponible en `http://localhost:3000`.

### Requirement: Comunicación por Red Interna en Docker Compose
La API Express y PostgreSQL SHALL comunicarse de manera privada mediante la red de Docker Compose utilizando el Host de la base de datos parametrizado como el nombre del servicio de base de datos.

#### Scenario: Conexión interna exitosa
- **WHEN** la API inicia indicando el Host de conexión igual al nombre del servicio db de Postgres
- **THEN** la API SHALL conectarse exitosamente a la base de datos a través de la red interna de Docker.

### Requirement: Resiliencia de Conexión (Reintentos)
La inicialización de la API SHALL reintentar la conexión a PostgreSQL periódicamente si el motor de base de datos aún no está listo para recibir conexiones.

#### Scenario: Base de datos no lista inicialmente
- **WHEN** la API inicia pero el servicio de base de datos aún no acepta conexiones
- **THEN** la API SHALL registrar el reintento en consola y volver a intentar la conexión hasta que se establezca exitosamente.

### Requirement: Exclusión de archivos locales en la Imagen (.dockerignore)
La construcción de la imagen de Docker SHALL ignorar archivos locales de desarrollo como la carpeta `node_modules` y el archivo `.env`.

#### Scenario: Construcción limpia de la imagen
- **WHEN** se construye la imagen de la API
- **THEN** el contexto de construcción de Docker SHALL excluir `.env` y `node_modules`, previniendo fugas de credenciales locales y colisiones de dependencias.

