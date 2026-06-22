## 1. Configuración de Docker

- [x] 1.1 Crear el archivo `Dockerfile` en la raíz del proyecto basándose en una imagen liviana de Node.js Alpine.
- [x] 1.2 Crear el archivo `.dockerignore` en la raíz para excluir `node_modules`, `.env` y bases de datos SQLite locales.

## 2. Resiliencia de Conexión en la Capa de Datos

- [x] 2.1 Refactorizar `db.js` para añadir un bucle asíncrono de reintentos con retraso antes de crear las tablas de logros y voluntariados.

## 3. Orquestación y Redes en Docker Compose

- [x] 3.1 Modificar `docker-compose.yml` para renombrar el servicio `postgres` a `db`.
- [x] 3.2 Agregar el servicio `api` en `docker-compose.yml` especificando el puerto `3000:3000`, la dependencia `depends_on: [db]` y las variables de entorno asociadas.

## 4. Verificación y Pruebas

- [x] 4.1 Reconstruir y levantar los servicios con `docker compose up -d --build`.
- [x] 4.2 Inspeccionar los logs del contenedor de la API para verificar que la conexión a Postgres se realice correctamente.
- [x] 4.3 Ejecutar llamadas de prueba contra `http://localhost:3000` para comprobar la persistencia y compatibilidad de los endpoints en el contenedor.

