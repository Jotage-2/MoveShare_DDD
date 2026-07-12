class GetAvailableRoutesUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async execute() {
        await this.repository.deleteExpiredOrFull();

        return await this.repository.findAll();
    }
}

module.exports = GetAvailableRoutesUseCase;