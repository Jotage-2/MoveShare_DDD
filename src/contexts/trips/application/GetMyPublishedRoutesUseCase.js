const AppError = require('../../../shared/domain/AppError');

class GetMyPublishedRoutesUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async execute(userId) {
        if (!userId) {
            throw new AppError(
                'Debes iniciar sesión para ver tus rutas publicadas.',
                401
            );
        }

        await this.repository.deleteExpiredOrFull();

        return await this.repository.findByDriverId(userId);
    }
}

module.exports = GetMyPublishedRoutesUseCase;