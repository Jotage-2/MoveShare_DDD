const AppError = require('../../../shared/domain/AppError');
const Route = require('../domain/Route');

class PublishRouteUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    async execute(body = {}, driverId = null) {
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

        const validateCoordinates = (value, label) => {
            if (
                !Array.isArray(value) ||
                value.length !== 2
            ) {
                throw new AppError(
                    `Debes seleccionar el ${label} desde las sugerencias de dirección.`,
                    400
                );
            }

            const latitude = Number(value[0]);
            const longitude = Number(value[1]);

            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                latitude < -90 ||
                latitude > 90 ||
                longitude < -180 ||
                longitude > 180
            ) {
                throw new AppError(
                    `Las coordenadas del ${label} no son válidas.`,
                    400
                );
            }

            return [
                latitude,
                longitude
            ];
        };

        const normalizedOriginCoords = validateCoordinates(
            originCoords,
            'origen'
        );

        const normalizedDestCoords = validateCoordinates(
            destCoords,
            'destino'
        );

        const [hours, minutes] = time
            .split(':')
            .map(Number);

        const expiresAt = new Date();

        expiresAt.setHours(
            hours,
            minutes,
            0,
            0
        );

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
            originCoords: normalizedOriginCoords,
            dest,
            destCoords: normalizedDestCoords,
            seats,
            time,
            notes,
            expiresAtTimestamp: expiresAt.getTime(),
            createdAt: new Date().toISOString()
        });

        return await this.repository.create(route);
    }
}

module.exports = PublishRouteUseCase;