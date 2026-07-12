const AppError = require('../../../shared/domain/AppError');

class VerifyUserUseCase {
    constructor(userRepository, verificationStore) {
        Object.assign(this, {
            userRepository,
            verificationStore
        });
    }

    async execute({ email, code } = {}) {
        if (!email || !code) {
            throw new AppError(
                'Correo y código son requeridos.',
                400
            );
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const pending =
            this.verificationStore[normalizedEmail];

        if (!pending) {
            throw new AppError(
                'No hay un código de verificación pendiente para ese correo.',
                400
            );
        }

        if (Date.now() > pending.expiresAt) {
            delete this.verificationStore[normalizedEmail];

            throw new AppError(
                'El código ha expirado. Por favor regístrate nuevamente.',
                400
            );
        }

        if (pending.code !== String(code).trim()) {
            throw new AppError(
                'Código incorrecto. Inténtalo de nuevo.',
                400
            );
        }

        await this.userRepository.update(
            pending.userId,
            {
                verified: true
            }
        );

        delete this.verificationStore[normalizedEmail];
    }
}

module.exports = VerifyUserUseCase;