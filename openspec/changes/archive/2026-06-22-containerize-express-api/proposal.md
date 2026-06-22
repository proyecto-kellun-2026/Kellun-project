## Why

Para lograr un entorno de ejecución del backend completamente reproducible y fácil de desplegar, de modo que cualquier desarrollador o servidor de staging/producción pueda inicializar toda la pila de servicios (API Express + PostgreSQL) con un único comando, eliminando discrepancias entre sistemas operativos y configuraciones de Node.js locales.

## What Changes

- Creación de un archivo `Dockerfile` en la raíz del proyecto para empaquetar la aplicación Express.
- Creación de un archivo `.dockerignore` para evitar incluir dependencias locales (`node_modules`) y configuraciones sensibles del entorno local (`.env`) en la imagen Docker.
- Modificación de `docker-compose.yml` para incorporar el servicio de la API (`api`), enlazado al servicio de PostgreSQL (`postgres`) mediante `depends_on`.
- Configuración de la red interna en Docker Compose para permitir la comunicación directa de la API al contenedor de base de datos usando el nombre del servicio como Host.
- Implementación de lógica de reintento de conexión en la inicialización de la base de datos de Express (`db.js`) para manejar casos en los que PostgreSQL no esté listo para recibir conexiones inmediatamente al arrancar.

## Capabilities

### New Capabilities
- `containerizacion-express-api`: Ejecución del backend Express en un contenedor Docker orquestado con PostgreSQL, con reintentos automáticos de conexión y accesibilidad desde el puerto 3000.

### Modified Capabilities

## Impact

- **Código Afectado**: `docker-compose.yml`, `db.js`, `Dockerfile` (nuevo), `.dockerignore` (nuevo).
- **Dependencias**: Configuración de redes de Docker, compatibilidad de variables de entorno de red.
- **Entorno**: Se elimina la necesidad de tener Node.js instalado localmente para ejecutar la API; Docker/Docker Compose asumen el control total del ciclo de vida del backend.
