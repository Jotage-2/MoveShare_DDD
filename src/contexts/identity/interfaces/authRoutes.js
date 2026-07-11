// ======================================================
// Framework
// ======================================================

const express = require('express');


// ======================================================
// Infrastructure
// ======================================================

const JsonUserRepository = require('../infrastructure/JsonUserRepository');

const NodemailerEmailService = require(
    '../../notifications/infrastructure/NodemailerEmailService'
);


// ======================================================
// Application (Use Cases)
// ======================================================

const RegisterUserUseCase = require(
    '../application/RegisterUserUseCase'
);

const LoginUserUseCase = require(
    '../application/LoginUserUseCase'
);

const LogoutUserUseCase = require(
    '../application/LogoutUserUseCase'
);

const VerifyUserUseCase = require(
    '../application/VerifyUserUseCase'
);

const ResendVerificationCodeUseCase = require(
    '../application/ResendVerificationCodeUseCase'
);

const SendVerificationEmailUseCase = require(
    '../../notifications/application/SendVerificationEmailUseCase'
);


// ======================================================
// Interfaces
// ======================================================

const createAuthController = require('./authController');


// ======================================================
// Router
// ======================================================

const router = express.Router();


// ======================================================
// Dependencies
// ======================================================

// Repositorio de usuarios (JSON)
const repository = new JsonUserRepository();

// Almacén temporal de códigos de verificación
const verificationStore = {};

// Servicio de envío de correos
const emailUseCase = new SendVerificationEmailUseCase(
    new NodemailerEmailService()
);


// ======================================================
// Controller
// ======================================================

const controller = createAuthController({

    register: new RegisterUserUseCase(
        repository,
        emailUseCase,
        verificationStore
    ),

    login: new LoginUserUseCase(repository),

    logout: new LogoutUserUseCase(),

    verify: new VerifyUserUseCase(
        repository,
        verificationStore
    ),

    resend: new ResendVerificationCodeUseCase(
        repository,
        emailUseCase,
        verificationStore
    )

});


// ======================================================
// Routes
// ======================================================

router.post('/register', controller.register);

router.post('/verify', controller.verifyCode);

router.post('/login', controller.login);

router.post('/logout', controller.logout);

router.get('/me', controller.getMe);

router.post('/resend-code', controller.reenviarCodigo);


// ======================================================
// Export
// ======================================================

module.exports = router;