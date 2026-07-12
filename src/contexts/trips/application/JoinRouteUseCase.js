const AppError = require('../../../shared/domain/AppError');

class JoinRouteUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async execute(routeId) {
        const normalizedRouteId = String(routeId ?? '').trim();

        if (!normalizedRouteId) {
            throw new AppError(
                'No se recibió el ID de la ruta seleccionada.',
                400
            );
        }

        const route = await this.repository.findById(
            normalizedRouteId
        );

        if (!route) {
            throw new AppError(
                'La ruta ya no está disponible o no existe.',
                404
            );
        }

        const expiration = Number(route.expiresAtTimestamp);

        if (
            Number.isFinite(expiration) &&
            expiration > 0 &&
            expiration <= Date.now()
        ) {
            await this.repository.deleteById(
                normalizedRouteId
            );

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
            await this.repository.deleteById(
                normalizedRouteId
            );

            throw new AppError(
                'Lo sentimos, ya no quedan asientos disponibles.',
                409
            );
        }

        const updatedRoute =
            await this.repository.decrementSeats(
                normalizedRouteId
            );

        if (!updatedRoute) {
            throw new AppError(
                'La ruta ya no está disponible o no tiene asientos.',
                409
            );
        }

        const remainingSeats = Number(updatedRoute.seats);

        if (remainingSeats === 0) {
            await this.repository.deleteById(
                normalizedRouteId
            );
        }

        return {
            remainingSeats,
            routeRemoved: remainingSeats === 0
        };
    }
}

module.exports = JoinRouteUseCase;