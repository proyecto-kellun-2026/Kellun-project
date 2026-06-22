## Why

Para no depender de SQLite (archivos locales) ni de una instalación local de base de datos en el sistema operativo del desarrollador, lo cual dificulta la portabilidad y la consistencia del entorno de desarrollo. Al migrar a PostgreSQL en un contenedor Docker, garantizamos un entorno homogéneo y persistente para todos los desarrolladores.

## What Changes

- Creación de un archivo `docker-compose.yml` en la raíz del proyecto para definir el servicio de PostgreSQL con un volumen para la persistencia de datos.
- Configuración de las variables de entorno de conexión a la base de datos a través de un archivo `.env` (siguiendo el ejemplo de `.env.example` y añadiéndolo a `.gitignore`).
- Reemplazo de la biblioteca `better-sqlite3` por `pg` (node-postgres) en la capa de persistencia (`db.js` y `db_organizaciones.js`).
- Migración y adaptación de los esquemas de tablas (`logros`, `voluntariados`, `registroOrganizaciones`) y las consultas SQL de SQLite a dialecto PostgreSQL.
- Mantener la misma interfaz HTTP y respuestas (código de estado y formato JSON) en los endpoints existentes (GET, POST, PUT, DELETE) para logros, voluntariados y organizaciones.

## Capabilities

### New Capabilities
- `persistencia-datos-postgres`: Soporte para persistir logros, voluntariados y organizaciones en una base de datos relacional PostgreSQL ejecutada en un contenedor Docker con volumen persistente.

### Modified Capabilities

## Impact

- **Código Afectado**: `db.js`, `db_organizaciones.js`, `services/voluntariadoService.js`, `index.js`, `index2.js`.
- **Dependencias**: Adición de `pg` y remoción (o depreciación de uso activo) de `better-sqlite3`. Adición de `dotenv` para cargar variables de entorno.
- **Entorno**: Requerimiento de Docker y Docker Compose para ejecutar la base de datos localmente.
