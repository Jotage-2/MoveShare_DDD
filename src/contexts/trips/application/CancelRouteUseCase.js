// ======================================================
// Dependencies
// ======================================================

const AppError = require('../../../shared/domain/AppError');


// ======================================================
// Class
// ======================================================

class CancelRouteUseCase {

    constructor(repository) {
        this.repository = repository;
    }

    execute(routeId, userId) {

        routeId = String(routeId || '').trim();

        if (!routeId) {
            throw new AppError(
                'No se recibió el ID de la ruta.',
                400
            );
        }

        const routes = this.repository.findAll();

        const index = routes.findIndex(
            (route) => String(route.id) === routeId
        );

        if (index < 0) {
            throw new AppError(
                'La ruta ya no existe o ya fue cancelada.',
                404
            );
        }

        const route = routes[index];

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

        routes.splice(index, 1);

        this.repository.saveAll(routes);
    }
}


// ======================================================
// Export
// ======================================================

module.exports = CancelRouteUseCase;