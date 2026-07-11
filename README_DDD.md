# Arquitectura DDD de MoveShare

Este proyecto conserva el frontend, los endpoints públicos y la persistencia mediante `data/users.json` y `data/routes.json`, pero reorganiza el backend usando Domain-Driven Design (DDD), Bounded Contexts y cuatro capas.

## Bounded Contexts

- **identity**: registro, verificación, reenvío de código, login, logout, usuario actual, perfil y persistencia de usuarios.
- **trips**: publicación, listado, unión, cancelación, rutas del conductor, limpieza de rutas vencidas/sin asientos y persistencia de rutas.
- **notifications**: abstracción de correo, caso de uso de correo de verificación y adaptador Nodemailer.
- **dashboard**: entrega de la vista del dashboard y datos del perfil.

## Capas

- **domain**: entidades (`User`, `Route`) y contratos (`UserRepository`, `RouteRepository`, `EmailService`). No conoce Express ni archivos JSON.
- **application**: casos de uso que coordinan reglas de negocio y dependen de contratos de dominio.
- **infrastructure**: adaptadores concretos para JSON y Nodemailer.
- **interfaces**: controllers y routers de Express. Traducen HTTP a casos de uso y mantienen las respuestas existentes.

## Archivos migrados

- `src/auth/*` → `src/contexts/identity/*` y `src/contexts/notifications/*`.
- `src/trips/*` → `src/contexts/trips/*`.
- `src/dashboards/*` → `src/contexts/dashboard/interfaces/*`.
- `src/shared/middleware/authMiddleware.js` se conserva.
- Se agregaron `src/shared/domain/AppError.js` y `src/shared/infrastructure/JsonFileStorage.js`.
- `app.js` ahora importa los routers desde los bounded contexts.

Los directorios backend antiguos fueron retirados para evitar dos implementaciones activas de la misma lógica.

## Compatibilidad mantenida

Siguen montados exactamente estos endpoints públicos:

- `/auth`
- `/dashboard`
- `/trips`

Se conservan también los endpoints internos existentes (`/auth/register`, `/auth/verify`, `/auth/resend-code`, `/auth/login`, `/auth/logout`, `/auth/me`, `/dashboard/profile`, `/trips`, `/trips/join`, `/trips/mine`, `/trips/:routeId`) y los nombres de campos consumidos por el frontend.

## Cómo ejecutar y probar

1. Copia `.env.example` a `.env` y configura `SESSION_SECRET`, `EMAIL_USER` y `EMAIL_PASS`.
2. Ejecuta `npm install`.
3. Ejecuta `npm start` (o `npm run dev`).
4. Abre `http://localhost:3000`.
5. Prueba registro, verificación, login, perfil y logout.
6. Como conductor, selecciona origen/destino reales, publica una ruta, revisa “mis rutas” y cancélala.
7. Como pasajero, lista rutas, abre el detalle, revisa el mapa y únete. Confirma que se descuente un asiento y que la ruta se elimine al llegar a cero.
8. Confirma que rutas vencidas se eliminen al listar rutas o consultar las rutas publicadas.

## Persistencia

No se migró a PostgreSQL y no se agregaron dependencias. Los repositorios usan:

- `data/users.json`
- `data/routes.json`
