## Context

Tras migrar la persistencia de datos de SQLite a PostgreSQL en un contenedor de Docker en el cambio previo (`migrate-to-postgres-docker`), la API Express todavía se ejecuta localmente en la máquina del desarrollador.

Se requiere dar el siguiente paso en la containerización: empaquetar la API Express en su propio contenedor Docker y orquestar ambos servicios (Base de Datos y API) mediante Docker Compose. Esto permitirá levantar todo el entorno de backend del proyecto Kellun con un único comando reproducible en cualquier máquina.

## Goals / Non-Goals

**Goals:**
- Crear un `Dockerfile` optimizado y basado en Node Alpine para la API Express.
- Asegurar la exclusión de archivos locales innecesarios y sensibles mediante un archivo `.dockerignore`.
- Actualizar `docker-compose.yml` para incorporar el servicio de la API, renombrar el servicio de base de datos a `db` (según DoD) y configurar la comunicación en red interna.
- Implementar un mecanismo de reconexión/reintento en `db.js` para asegurar que si PostgreSQL tarda en arrancar, la API no finalice abruptamente y espere hasta que el puerto esté listo.
- Mantener la exposición pública del puerto `3000` de la API para su consumo desde el host.

**Non-Goals:**
- Containerizar el servidor secundario de organizaciones (`index2.js`) en este cambio específico, a menos que el usuario lo solicite (se prioriza el cumplimiento de la API principal en el puerto 3000).
- Cambiar la lógica de negocio o firmas de las rutas.

## Decisions

### 1. Estructura de Dockerfile
- **Decisión:** Utilizar un Dockerfile basado en `node:18-alpine` por su tamaño reducido y perfil de seguridad. Se copiarán primero `package.json` y `package-lock.json` para aprovechar la caché de capas de Docker en `npm install`.
- **Razón:** Agiliza los tiempos de compilación subsiguientes y mantiene la imagen final optimizada y ligera.

### 2. Renombrar el Servicio de PostgreSQL
- **Decisión:** Cambiar el nombre del servicio de base de datos en `docker-compose.yml` de `postgres` a `db` para cumplir estrictamente con el Definition of Done.
- **Razón:** Utilizar el nombre del servicio `db` permite que en Docker Compose actúe como nombre de host DNS interno para la API.

### 3. Redes y Variables de Entorno en Docker Compose
- **Decisión:** Configurar variables de entorno en el servicio `api` dentro de `docker-compose.yml` apuntando `DB_HOST=db`.
- **Razón:** Docker Compose crea una red interna por defecto donde los servicios se resuelven entre sí mediante sus nombres de servicio.

### 4. Lógica de Reintentos de Conexión en la Base de Datos
- **Decisión:** Implementar un bucle de reintento con retardo de 3 segundos (hasta 5 reintentos) en la función `initDb` dentro de [db.js](file:///C:/Users/felip/Documents/Kellun-project/db.js). Si se agotan los reintentos, el proceso finalizará con un código de error (`process.exit(1)`).
- **Razón:** PostgreSQL suele tardar unos segundos adicionales en inicializar el motor de datos tras levantar el contenedor. Un simple `depends_on` sólo espera a que el contenedor de la BD *inicie*, no a que el puerto esté *listo para recibir conexiones*. Esta lógica de reintento robustece la inicialización de la API.

## Risks / Trade-offs

- **[Riesgo] Levantamiento asincrónico lento de PostgreSQL causa caídas de la API**
  - *Mitigación:* La lógica de reintentos en `db.js` evitará que Express aborte al primer error de conexión, reintentando la conexión hasta que PostgreSQL acepte peticiones.
- **[Riesgo] Conflicto de puertos si hay una base de datos local corriendo**
  - *Mitigación:* Se mantendrá el puerto de base de datos parametrizado a través de variables de entorno, permitiendo cambiar el puerto del host si es necesario sin afectar la red interna de Docker.
