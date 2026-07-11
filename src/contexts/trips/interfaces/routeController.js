// ======================================================
// Controller
// ======================================================

function createRouteController(useCases) {

    const fail = (res, error, message) => {

        console.error(message, error);

        return res.status(error.statusCode || 500).json({
            error: error.statusCode
                ? error.message
                : message
        });
    };

    return {

        // ======================================================
        // Obtener rutas disponibles
        // ======================================================

        getAllRoutes: (req, res) => {

            try {

                return res.status(200).json(
                    useCases.available.execute()
                );

            } catch (error) {

                return fail(
                    res,
                    error,
                    'Hubo un problema al obtener las rutas'
                );

            }
        },


        // ======================================================
        // Publicar una nueva ruta
        // ======================================================

        publishRoute: (req, res) => {

            try {

                const route = useCases.publish.execute(
                    req.body,
                    req.session?.userId || null
                );

                return res.status(201).json({
                    message: 'Ruta publicada correctamente',
                    route
                });

            } catch (error) {

                return fail(
                    res,
                    error,
                    'Hubo un problema al publicar la ruta.'
                );

            }
        },


        // ======================================================
        // Unirse a una ruta
        // ======================================================

        joinRoute: (req, res) => {

            try {

                const result = useCases.join.execute(
                    req.body?.routeId
                );

                return res.status(200).json({
                    message: '¡Te has unido a la ruta con éxito!',
                    ...result
                });

            } catch (error) {

                return fail(
                    res,
                    error,
                    'Hubo un problema al unirse a la ruta.'
                );

            }
        },


        // ======================================================
        // Obtener mis rutas publicadas
        // ======================================================

        getMyPublishedRoutes: (req, res) => {

            try {

                return res.status(200).json(
                    useCases.mine.execute(
                        req.session?.userId || null
                    )
                );

            } catch (error) {

                return fail(
                    res,
                    error,
                    'Hubo un problema al obtener tus rutas publicadas.'
                );

            }
        },


        // ======================================================
        // Cancelar una ruta publicada
        // ======================================================

        cancelPublishedRoute: (req, res) => {

            try {

                useCases.cancel.execute(
                    req.params.routeId,
                    req.session?.userId || null
                );

                return res.status(200).json({
                    message: 'Ruta cancelada correctamente.'
                });

            } catch (error) {

                return fail(
                    res,
                    error,
                    'Hubo un problema al cancelar la ruta.'
                );

            }
        }

    };
}


// ======================================================
// Export
// ======================================================

module.exports = createRouteController;