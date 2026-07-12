// ======================================================
// Framework
// ======================================================

const express = require('express');


// ======================================================
// Infrastructure
// ======================================================
const {
    requireAuth
} = require('../../../shared/middleware/authMiddleware');

const PostgresRouteRepository = require(
    '../infrastructure/PostgresRouteRepository'
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
const repository = new PostgresRouteRepository();

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

router.get(
    '/',
    controller.getAllRoutes
);

router.post(
    '/',
    requireAuth,
    controller.publishRoute
);

router.post(
    '/join',
    requireAuth,
    controller.joinRoute
);

router.get(
    '/mine',
    requireAuth,
    controller.getMyPublishedRoutes
);

router.delete(
    '/:routeId',
    requireAuth,
    controller.cancelPublishedRoute
);
// ======================================================
// Export
// ======================================================

module.exports = router;