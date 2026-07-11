const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = require('../domain/User');
const AppError = require('../../../shared/domain/AppError');

class RegisterUserUseCase {
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

    async execute(input) {
        let {
            firstName,
            lastName,
            email,
            dni,
            password
        } = input || {};

        if (!firstName || !lastName || !email || !dni || !password) {
            throw new AppError(
                'Todos los campos son obligatorios.',
                400
            );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new AppError(
                'El correo electrónico no es válido.',
                400
            );
        }

        if (!/^\d{8}$/.test(dni)) {
            throw new AppError(
                'El DNI debe tener exactamente 8 dígitos numéricos.',
                400
            );
        }

        if (password.length < 6) {
            throw new AppError(
                'La contraseña debe tener al menos 6 caracteres.',
                400
            );
        }

        email = email.toLowerCase().trim();

        if (this.userRepository.findByEmail(email)) {
            throw new AppError(
                'Ya existe una cuenta con ese correo electrónico.',
                409
            );
        }

        const user = new User({
            id: uuidv4(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email,
            dni: dni.trim(),
            password: await bcrypt.hash(password, 10),
            verified: false,
            createdAt: new Date().toISOString()
        });

        this.userRepository.create(user);

        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        this.verificationStore[email] = {
            code,
            expiresAt: Date.now() + 15 * 60 * 1000,
            userId: user.id
        };

        let emailSent = false;

        try {
            emailSent =
                await this.sendVerificationEmailUseCase.execute({
                    email,
                    firstName,
                    code
                });
        } catch (error) {
            console.error(
                '[Email Service Error]:',
                error.message
            );
        }

        return {
            emailSent,
            code
        };
    }
}

module.exports = RegisterUserUseCase;