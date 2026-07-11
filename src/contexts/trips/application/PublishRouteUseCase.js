// ======================================================
// Dependencies
// ======================================================

const AppError = require('../../../shared/domain/AppError');
const Route = require('../domain/Route');


// ======================================================
// Class
// ======================================================

class PublishRouteUseCase {

    constructor(repository) {
        this.repository = repository;
    }

    execute(body = {}, driverId = null) {

        const origin = String(body.origin || '').trim();
        const dest = String(body.dest || '').trim();
        const time = String(body.time || '').trim();
        const notes = String(body.notes || '').trim();

        const seats = Number(body.seats);

        const originCoords = body.originCoords;
        const destCoords = body.destCoords;

        if (!origin) {
            throw new AppError(
                'El origen es obligatorio.',
                400
            );
        }

        if (!dest) {
            throw new AppError(
                'El destino es obligatorio.',
                400
            );
        }

        if (!time) {
            throw new AppError(
                'La hora de salida es obligatoria.',
                400
            );
        }

        if (
            !Number.isInteger(seats) ||
            seats < 1 ||
            seats > 4
        ) {
            throw new AppError(
                'Los asientos disponibles deben estar entre 1 y 4.',
                400
            );
        }

        if (origin.toLowerCase() === dest.toLowerCase()) {
            throw new AppError(
                'El origen y el destino no pueden ser iguales.',
                400
            );
        }

        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
            throw new AppError(
                'La hora debe tener el formato HH:mm.',
                400
            );
        }

        const coords = (value, label) => {

            if (
                !Array.isArray(value) ||
                value.length !== 2
            ) {
                throw new AppError(
                    `Debes seleccionar el ${label} desde las sugerencias de dirección.`,
                    400
                );
            }

            const lat = Number(value[0]);
            const lng = Number(value[1]);

            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng) ||
                lat < -90 ||
                lat > 90 ||
                lng < -180 ||
                lng > 180
            ) {
                throw new AppError(
                    `Las coordenadas del ${label} no son válidas.`,
                    400
                );
            }

            return [lat, lng];
        };

        const o = coords(originCoords, 'origen');
        const d = coords(destCoords, 'destino');

        const [h, m] = time.split(':').map(Number);

        const expiresAt = new Date();

        expiresAt.setHours(h, m, 0, 0);

        if (expiresAt.getTime() <= Date.now()) {
            throw new AppError(
                'La hora de salida no puede estar vencida.',
                400
            );
        }

        const route = new Route({
            id: Date.now(),
            driverId: driverId || null,
            origin,
            originCoords: o,
            dest,
            destCoords: d,
            seats,
            time,
            notes,
            expiresAtTimestamp: expiresAt.getTime(),
            createdAt: new Date().toISOString()
        });

        const routes = this.repository.findAll();

        routes.unshift(route.toJSON());

        this.repository.saveAll(routes);

        return route.toJSON();
    }
}


// ======================================================
// Export
// ======================================================

module.exports = PublishRouteUseCase;