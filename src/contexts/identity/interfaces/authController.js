function createAuthController(useCases) {
    const handle = (res, error, label) => {
        console.error(
            `[AuthController] ${label} error:`,
            error
        );

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode
                ? error.message
                : 'Error interno del servidor.'
        });
    };

    return {
        register: async (req, res) => {
            try {
                const r = await useCases.register.execute(req.body);

                if (!r.emailSent) {
                    console.log(
                        `[DEV] Código de verificación para ${req.body.email}: ${r.code}`
                    );

                    return res.status(200).json({
                        success: true,
                        message:
                            'Cuenta creada. No se pudo enviar el correo (revisa las credenciales en .env). Código en consola del servidor.',
                        devCode:
                            process.env.NODE_ENV !== 'production'
                                ? r.code
                                : undefined
                    });
                }

                return res.status(200).json({
                    success: true,
                    message:
                        'Cuenta creada. Se envió un código de verificación a tu correo.'
                });
            } catch (e) {
                return handle(res, e, 'register');
            }
        },

        verifyCode: async (req, res) => {
            try {
                await useCases.verify.execute(req.body);

                return res.status(200).json({
                    success: true,
                    message:
                        '¡Cuenta verificada exitosamente! Ya puedes iniciar sesión.'
                });
            } catch (error) {
                return handle(
                    res,
                    error,
                    'verifyCode'
                );
            }
        },

        reenviarCodigo: async (req, res) => {
            try {
                const r = await useCases.resend.execute(req.body);

                if (!r.emailSent) {
                    console.log(
                        `[DEV] Nuevo código para ${req.body.email}: ${r.code}`
                    );

                    return res.status(200).json({
                        success: true,
                        message:
                            'Código generado. No se pudo enviar el correo, míralo en la consola.',
                        devCode:
                            process.env.NODE_ENV !== 'production'
                                ? r.code
                                : undefined
                    });
                }

                return res.status(200).json({
                    success: true,
                    message:
                        'Nuevo código de verificación enviado.'
                });
            } catch (e) {
                return handle(res, e, 'reenviarCodigo');
            }
        },

        login: async (req, res) => {
            try {
                const user = await useCases.login.execute(req.body);

                req.session.userId = user.id;
                req.session.userEmail = user.email;
                req.session.userName = user.firstName;

                return res.status(200).json({
                    success: true,
                    message: 'Sesión iniciada correctamente.',
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }
                });
            } catch (e) {
                return handle(res, e, 'login');
            }
        },

        logout: async (req, res) => {
            try {
                await useCases.logout.execute(req.session);

                res.clearCookie('connect.sid');

                return res.status(200).json({
                    success: true,
                    message: 'Sesión cerrada.'
                });
            } catch (e) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión.'
                });
            }
        },

        getMe: (req, res) => {
            if (!req.session.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado.'
                });
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: req.session.userId,
                    email: req.session.userEmail,
                    firstName: req.session.userName
                }
            });
        }
    };
}

module.exports = createAuthController;