## Context

El proyecto Kellun actualmente utiliza SQLite (mediante la librería `better-sqlite3`) con dos archivos de base de datos locales: `datos.db` y `registro_organizaciones.db`. Aunque esto simplifica el desarrollo inicial, genera problemas para ambientes colaborativos al depender de archivos locales y no es ideal para producción.

Se requiere migrar a PostgreSQL corriendo en un contenedor de Docker para unificar el motor de persistencia, asegurar que los datos persistan mediante un volumen Docker y que la API continúe respondiendo de manera idéntica a los clientes.

## Goals / Non-Goals

**Goals:**
- Desplegar PostgreSQL en un contenedor Docker con volumen local persistente.
- Manejar la configuración de conexión mediante un archivo `.env` local (no versionado), con un ejemplo público `.env.example`.
- Modificar la capa de acceso a datos utilizando la librería `pg` (node-postgres).
- Mantener la funcionalidad de los endpoints sin alterar sus firmas, contratos de respuesta (cuerpo JSON, códigos de estado) ni la lógica del frontend.
- Adaptar las consultas SQL de formato SQLite (placeholders `?`, `AUTOINCREMENT`, códigos de error específicos como `SQLITE_CONSTRAINT_UNIQUE`) al dialecto de PostgreSQL (placeholders `$1`, `$2`, `SERIAL`, códigos de error como `23505`).
- Convertir la lógica síncrona de acceso a base de datos en asíncrona mediante `async/await` en los servicios, controladores y endpoints de Express.

**Non-Goals:**
- Migrar el frontend a un framework SPA (permanece como HTML/JS vanilla).
- Cambiar la estructura y firma de la API REST (los endpoints siguen respondiendo igual).
- Implementar un ORM complejo (se mantendrá el uso de consultas SQL puras con `pg.Pool`).

## Decisions

### 1. Motor de Base de Datos y Contenedorización
- **Decisión:** Utilizar `docker-compose.yml` en la raíz del proyecto definiendo el servicio de PostgreSQL utilizando la imagen `postgres:15-alpine`.
- **Alternativas consideradas:**
  - Instalar PostgreSQL directamente en el sistema operativo (Descartado: viola el criterio de no depender de instalación local).
  - Usar un servicio de base de datos en la nube (Descartado: aumenta la latencia y la dependencia de internet durante el desarrollo local).
- **Razón:** El uso de Docker Compose con la imagen Alpine de Postgres asegura un entorno portable, liviano e idéntico para todos los desarrolladores.

### 2. Persistencia de Datos
- **Decisión:** Mapear un volumen Docker persistente en `docker-compose.yml` apuntando a `/var/lib/postgresql/data`.
- **Razón:** Garantizar que los datos no se pierdan cuando el contenedor sea detenido o reiniciado (`docker-compose down` y `docker-compose up`).

### 3. Librería de Conexión (Driver)
- **Decisión:** Utilizar `pg` (node-postgres) instalada como dependencia del proyecto, configurando un `pg.Pool` para gestionar las conexiones.
- **Alternativas consideradas:**
  - `sequelize` / `TypeORM` / `Prisma` (Descartado: requiere una reestructuración masiva del código y añade sobrecarga conceptual innecesaria para un proyecto pequeño que ya usa SQL puro).
- **Razón:** Es una dependencia directa requerida por el DoD y mantiene el control sobre las consultas SQL del proyecto.

### 4. Transición de Síncrono a Asíncrono
- **Decisión:** Convertir los servicios, controladores y middlewares a funciones asíncronas (`async / await`).
- **Razón:** A diferencia de `better-sqlite3` que es síncrono, `pg` funciona de forma asíncrona. Los controladores de Express deben capturar errores asíncronos mediante bloques `try/catch`.

### 5. Adaptación SQL (SQLite a PostgreSQL)
- **Definición de Tipos**:
  - `INTEGER PRIMARY KEY AUTOINCREMENT` en SQLite se convierte en `SERIAL PRIMARY KEY` en PostgreSQL.
  - El campo `activo` se mantendrá como `INTEGER` (con valores `0` y `1`) para no romper compatibilidades con el frontend, o bien migrar a `BOOLEAN` si la conversión de respuesta JSON es idéntica (se mantendrá `INTEGER` para evitar riesgos de discrepancia).
- **Placeholders**:
  - Reemplazar todos los signos `?` en las consultas SQL por placeholders posicionales de PostgreSQL (`$1`, `$2`, etc.).
- **Retorno de IDs de inserción**:
  - Agregar la cláusula `RETURNING idLogro` o `RETURNING id` al final de los `INSERT` y obtener el ID desde `result.rows[0].idlogro` o `result.rows[0].id`.
- **Manejo de Errores por Duplicados**:
  - Validar si `error.code === '23505'` (código de violación de unicidad de PostgreSQL) para simular el comportamiento de `SQLITE_CONSTRAINT_UNIQUE`.
- **Búsqueda Insensitiva (LIKE)**:
  - Cambiar `LIKE` por `ILIKE` en PostgreSQL para mantener búsquedas insensibles a mayúsculas y minúsculas sin importar la configuración de localización.

## Risks / Trade-offs

- **[Riesgo] Asincronía rompe el flujo actual de Express**
  - *Mitigación:* Refactorizar sistemáticamente todas las rutas y servicios involucrados para usar `async / await` y asegurar que los controladores manejen las promesas rechazadas con bloques `try/catch` para evitar caídas de los servidores (`index.js` e `index2.js`).
- **[Riesgo] Conflictos en puertos al correr en localhost**
  - *Mitigación:* Exponer el puerto estándar de PostgreSQL `5432` en el contenedor pero permitir parametrizarlo a través del archivo `.env` si el desarrollador ya posee un servicio local corriendo en dicho puerto.
- **[Riesgo] Dificultad para inicializar las tablas (Semilla)**
  - *Mitigación:* Implementar un script de inicialización automático en la conexión inicial en `db.js` y `db_organizaciones.js` que cree las tablas y, si la tabla voluntariados está vacía, inserte los registros de semilla iniciales.
