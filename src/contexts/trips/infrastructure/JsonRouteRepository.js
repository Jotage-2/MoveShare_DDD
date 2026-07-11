// ======================================================
// Dependencies
// ======================================================

const path = require('path');

const RouteRepository = require('../domain/RouteRepository');
const JsonFileStorage = require('../../../shared/infrastructure/JsonFileStorage');


// ======================================================
// Class
// ======================================================

class JsonRouteRepository extends RouteRepository {

    constructor(
        filePath = path.join(
            __dirname,
            '../../../../data/routes.json'
        )
    ) {
        super();

        this.storage = new JsonFileStorage(filePath);
    }

    findAll() {
        return this.storage.read([]);
    }

    saveAll(routes) {

        if (!this.storage.write(routes)) {
            throw new Error(
                'No se pudieron guardar las rutas.'
            );
        }

        return true;
    }
}


// ======================================================
// Export
// ======================================================

module.exports = JsonRouteRepository;