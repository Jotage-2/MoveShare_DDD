const path = require('path');

function createDashboardController(getCurrentUserUseCase) {
    return {
        getDashboard: (req, res) =>
            res.sendFile(
                path.join(__dirname, '../../../../views/dashboard.html')
            ),

        getProfile: (req, res) => {
            try {
                const user = getCurrentUserUseCase.execute(req.session.userId);

                return res.status(200).json({
                    success: true,
                    user: {
                        firstName: user.firstName || user.nombre || 'Usuario',
                        lastName: user.lastName || user.apellido || '',
                        email: user.email,
                        dni: user.dni,
                        createdAt: user.createdAt
                    }
                });
            } catch (e) {
                return res.status(e.statusCode || 500).json({
                    success: false,
                    message: e.message || 'Error interno del servidor.'
                });
            }
        }
    };
}

module.exports = createDashboardController;