const path = require('path');

function createDashboardController(getCurrentUserUseCase) {
    return {
        getDashboard: (req, res) => {
            return res.sendFile(
                path.join(
                    __dirname,
                    '../../../../views/dashboard.html'
                )
            );
        },

        getProfile: async (req, res) => {
            try {
                const user = await getCurrentUserUseCase.execute(
                    req.session.userId
                );

                return res.status(200).json({
                    success: true,
                    user: {
                        firstName:
                            user.firstName ||
                            user.nombre ||
                            'Usuario',

                        lastName:
                            user.lastName ||
                            user.apellido ||
                            '',

                        email: user.email,
                        dni: user.dni,
                        createdAt: user.createdAt
                    }
                });
            } catch (error) {
                return res
                    .status(error.statusCode || 500)
                    .json({
                        success: false,
                        message:
                            error.message ||
                            'Error interno del servidor.'
                    });
            }
        }
    };
}

module.exports = createDashboardController;