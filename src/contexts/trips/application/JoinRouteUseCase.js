// ======================================================
// Dependencies
// ======================================================

const AppError = require('../../../shared/domain/AppError');


// ======================================================
// Class
// ======================================================

class JoinRouteUseCase {

    constructor(repository) {
        this.repository = repository;
    }

    execute(routeId) {

        routeId = String(routeId ?? '').trim();

        if (!routeId) {
            throw new AppError(
                'No se recibió el ID de la ruta seleccionada.',
                400
            );
        }

        const routes = this.repository.findAll();

        const index = routes.findIndex(
            (route) => String(route.id) === routeId
        );

        if (index < 0) {
            throw new AppError(
                'La ruta ya no está disponible o no existe.',
                404
            );
        }

        const route = routes[index];

        const expiration = Number(route.expiresAtTimestamp);

        if (
            Number.isFinite(expiration) &&
            expiration > 0 &&
            expiration <= Date.now()
        ) {
            routes.splice(index, 1);

            this.repository.saveAll(routes);

            throw new AppError(
                'Esta ruta ya venció y fue retirada de la lista.',
                410
            );
        }

        const seats = Number(route.seats);

        if (
            !Number.isInteger(seats) ||
            seats <= 0
        ) {
            routes.splice(index, 1);

            this.repository.saveAll(routes);

            throw new AppError(
                'Lo sentimos, ya no quedan asientos disponibles.',
                409
            );
        }

        const remainingSeats = seats - 1;

        if (remainingSeats === 0) {
            routes.splice(index, 1);
        } else {
            routes[index] = {
                ...route,
                seats: remainingSeats
            };
        }

        this.repository.saveAll(routes);

        return {
            remainingSeats,
            routeRemoved: remainingSeats === 0
        };
    }
}


// ======================================================
// Export
// ======================================================

module.exports = JoinRouteUseCase;