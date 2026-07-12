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
        getAllRoutes: async (req, res) => {
            try {
                const routes =
                    await useCases.available.execute();

                return res.status(200).json(routes);
            } catch (error) {
                return fail(
                    res,
                    error,
                    'Hubo un problema al obtener las rutas'
                );
            }
        },

        publishRoute: async (req, res) => {
            try {
                const route =
                    await useCases.publish.execute(
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

        joinRoute: async (req, res) => {
            try {
                const result =
                    await useCases.join.execute(
                        req.body?.routeId
                    );

                return res.status(200).json({
                    message:
                        '¡Te has unido a la ruta con éxito!',
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

        getMyPublishedRoutes: async (req, res) => {
            try {
                const routes =
                    await useCases.mine.execute(
                        req.session?.userId || null
                    );

                return res.status(200).json(routes);
            } catch (error) {
                return fail(
                    res,
                    error,
                    'Hubo un problema al obtener tus rutas publicadas.'
                );
            }
        },

        cancelPublishedRoute: async (req, res) => {
            try {
                await useCases.cancel.execute(
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

module.exports = createRouteController;