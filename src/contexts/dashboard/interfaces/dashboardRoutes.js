const express = require('express');

const { requireAuth } = require('../../../shared/middleware/authMiddleware');

const JsonUserRepository = require('../../identity/infrastructure/JsonUserRepository');
const GetCurrentUserUseCase = require('../../identity/application/GetCurrentUserUseCase');

const createDashboardController = require('./dashboardController');

const router = express.Router();

const controller = createDashboardController(
    new GetCurrentUserUseCase(
        new JsonUserRepository()
    )
);

router.get('/', requireAuth, controller.getDashboard);

router.get('/profile', requireAuth, controller.getProfile);

module.exports = router;