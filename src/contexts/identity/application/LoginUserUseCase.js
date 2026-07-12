const bcrypt = require('bcryptjs');

const AppError = require('../../../shared/domain/AppError');

class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ email, password } = {}) {
        if (!email || !password) {
            throw new AppError(
                'Correo y contraseña son obligatorios.',
                400
            );
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const user = await this.userRepository.findByEmail(
            normalizedEmail
        );

        const passwordIsValid =
            user &&
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordIsValid) {
            throw new AppError(
                'Correo o contraseña incorrectos.',
                401
            );
        }

        if (!user.verified) {
            throw new AppError(
                'Debes verificar tu correo antes de iniciar sesión.',
                403
            );
        }

        return user;
    }
}

module.exports = LoginUserUseCase;