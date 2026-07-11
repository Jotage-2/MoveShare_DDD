// ======================================================
// Class
// ======================================================

class GetAvailableRoutesUseCase {

    constructor(repository) {
        this.repository = repository;
    }

    execute() {

        const allRoutes = this.repository.findAll();

        const currentTime = Date.now();

        const validRoutes = allRoutes.filter((route) => {

            const isNotExpired = route.expiresAtTimestamp
                ? Number(route.expiresAtTimestamp) > currentTime
                : true;

            const hasAvailableSeats =
                Number(route.seats) > 0;

            return isNotExpired && hasAvailableSeats;
        });

        if (validRoutes.length !== allRoutes.length) {
            this.repository.saveAll(validRoutes);
        }

        return validRoutes;
    }
}


// ======================================================
// Export
// ======================================================

module.exports = GetAvailableRoutesUseCase;