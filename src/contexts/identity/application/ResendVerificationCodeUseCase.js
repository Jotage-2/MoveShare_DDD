const AppError = require('../../../shared/domain/AppError');

class ResendVerificationCodeUseCase {
    constructor(
        userRepository,
        sendVerificationEmailUseCase,
        verificationStore
    ) {
        Object.assign(this, {
            userRepository,
            sendVerificationEmailUseCase,
            verificationStore
        });
    }

    async execute({ email } = {}) {
        if (!email) {
            throw new AppError(
                'El correo es obligatorio.',
                400
            );
        }

        const normalized = email.toLowerCase().trim();

        const user = this.userRepository.findByEmail(normalized);

        if (!user) {
            throw new AppError(
                'No existe un usuario con ese correo.',
                404
            );
        }

        if (user.verified) {
            throw new AppError(
                'Esta cuenta ya está verificada.',
                400
            );
        }

        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        this.verificationStore[normalized] = {
            code,
            expiresAt: Date.now() + 15 * 60 * 1000,
            userId: user.id
        };

        const emailSent =
            await this.sendVerificationEmailUseCase.execute({
                email: normalized,
                firstName: user.firstName,
                code
            });

        return {
            emailSent,
            code
        };
    }
}

module.exports = ResendVerificationCodeUseCase;
