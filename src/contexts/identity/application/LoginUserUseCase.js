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

        const user = this.userRepository.findByEmail(email);

        if (
            !user ||
            !(await bcrypt.compare(password, user.password))
        ) {
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