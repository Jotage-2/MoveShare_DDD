// ======================================================
// Framework
// ======================================================

const express = require('express');


// ======================================================
// Infrastructure
// ======================================================

const JsonRouteRepository = require(
    '../infrastructure/JsonRouteRepository'
);


// ======================================================
// Application (Use Cases)
// ======================================================

const GetAvailableRoutesUseCase = require(
    '../application/GetAvailableRoutesUseCase'
);

const PublishRouteUseCase = require(
    '../application/PublishRouteUseCase'
);

const JoinRouteUseCase = require(
    '../application/JoinRouteUseCase'
);

const CancelRouteUseCase = require(
    '../application/CancelRouteUseCase'
);

const GetMyPublishedRoutesUseCase = require(
    '../application/GetMyPublishedRoutesUseCase'
);


// ======================================================
// Interfaces
// ======================================================

const createRouteController = require(
    './routeController'
);


// ======================================================
// Router
// ======================================================

const router = express.Router();


// ======================================================
// Dependencies
// ======================================================

// Repositorio de rutas (JSON)
const repository = new JsonRouteRepository();


// ======================================================
// Controller
// ======================================================

const controller = createRouteController({

    available: new GetAvailableRoutesUseCase(
        repository
    ),

    publish: new PublishRouteUseCase(
        repository
    ),

    join: new JoinRouteUseCase(
        repository
    ),

    cancel: new CancelRouteUseCase(
        repository
    ),

    mine: new GetMyPublishedRoutesUseCase(
        repository
    )

});


// ======================================================
// Routes
// ======================================================

// Obtener todas las rutas disponibles
router.get('/', controller.getAllRoutes);

// Publicar una nueva ruta
router.post('/', controller.publishRoute);

// Unirse a una ruta
router.post('/join', controller.joinRoute);

// Cancelar una ruta publicada
router.delete('/:routeId', controller.cancelPublishedRoute);

// Obtener las rutas publicadas por el conductor autenticado
router.get('/mine', controller.getMyPublishedRoutes);


// ======================================================
// Export
// ======================================================

module.exports = router;