const AppError = require('../../../shared/domain/AppError');

class CancelRouteUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async execute(routeId, userId) {
        const normalizedRouteId = String(routeId || '').trim();

        if (!normalizedRouteId) {
            throw new AppError(
                'No se recibió el ID de la ruta.',
                400
            );
        }

        const route = await this.repository.findById(
            normalizedRouteId
        );

        if (!route) {
            throw new AppError(
                'La ruta ya no existe o ya fue cancelada.',
                404
            );
        }

        if (
            route.driverId &&
            userId &&
            String(route.driverId) !== String(userId)
        ) {
            throw new AppError(
                'No tienes permiso para cancelar esta ruta.',
                403
            );
        }

        await this.repository.deleteById(
            normalizedRouteId
        );
    }
}

module.exports = CancelRouteUseCase;