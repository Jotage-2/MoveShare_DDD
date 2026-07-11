// ======================================================
// Dependencies
// ======================================================

const AppError = require('../../../shared/domain/AppError');


// ======================================================
// Class
// ======================================================

class GetMyPublishedRoutesUseCase {

    constructor(repository) {
        this.repository = repository;
    }

    execute(userId) {

        if (!userId) {
            throw new AppError(
                'Debes iniciar sesión para ver tus rutas publicadas.',
                401
            );
        }

        const routes = this.repository.findAll();

        const currentTime = Date.now();

        const activeRoutes = routes.filter((route) => {

            const isNotExpired =
                Number.isFinite(Number(route.expiresAtTimestamp)) &&
                Number(route.expiresAtTimestamp) > currentTime;

            const hasAvailableSeats =
                Number.isInteger(Number(route.seats)) &&
                Number(route.seats) > 0;

            return isNotExpired && hasAvailableSeats;
        });

        if (activeRoutes.length !== routes.length) {
            this.repository.saveAll(activeRoutes);
        }

        return activeRoutes.filter(
            (route) => String(route.driverId) === String(userId)
        );
    }
}


// ======================================================
// Export
// ======================================================

module.exports = GetMyPublishedRoutesUseCase;