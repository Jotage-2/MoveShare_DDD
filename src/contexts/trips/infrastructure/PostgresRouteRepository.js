// ======================================================
// Dependencies
// ======================================================

const RouteRepository = require('../domain/RouteRepository');
const pool = require('../../../shared/infrastructure/PostgresConnection');


// ======================================================
// Mapper
// ======================================================

function mapRoute(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,
        driverId: row.driver_id,
        origin: row.origin,

        originCoords: [
            Number(row.origin_latitude),
            Number(row.origin_longitude)
        ],

        dest: row.destination,

        destCoords: [
            Number(row.destination_latitude),
            Number(row.destination_longitude)
        ],

        seats: row.seats,
        time: row.departure_time,
        notes: row.notes,
        status: row.status,

        expiresAtTimestamp:
            new Date(row.expires_at).getTime(),

        createdAt: row.created_at
    };
}


// ======================================================
// Repository
// ======================================================

class PostgresRouteRepository extends RouteRepository {
    async findAll() {
        const result = await pool.query(`
            SELECT
                id,
                driver_id,
                origin,
                origin_latitude,
                origin_longitude,
                destination,
                destination_latitude,
                destination_longitude,
                seats,
                departure_time,
                notes,
                status,
                expires_at,
                created_at
            FROM trips
            ORDER BY created_at DESC
        `);

        return result.rows.map(mapRoute);
    }

    async findById(routeId) {
        const result = await pool.query(
            `
                SELECT
                    id,
                    driver_id,
                    origin,
                    origin_latitude,
                    origin_longitude,
                    destination,
                    destination_latitude,
                    destination_longitude,
                    seats,
                    departure_time,
                    notes,
                    status,
                    expires_at,
                    created_at
                FROM trips
                WHERE id = $1
                LIMIT 1
            `,
            [routeId]
        );

        return mapRoute(result.rows[0]);
    }

    async create(route) {
        const data =
            typeof route.toJSON === 'function'
                ? route.toJSON()
                : route;

        const result = await pool.query(
            `
                INSERT INTO trips (
                    id,
                    driver_id,
                    origin,
                    origin_latitude,
                    origin_longitude,
                    destination,
                    destination_latitude,
                    destination_longitude,
                    seats,
                    departure_time,
                    notes,
                    status,
                    expires_at,
                    created_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12,
                    $13,
                    $14
                )
                RETURNING *
            `,
            [
                data.id,
                data.driverId,
                data.origin,
                data.originCoords[0],
                data.originCoords[1],
                data.dest,
                data.destCoords[0],
                data.destCoords[1],
                data.seats,
                data.time,
                data.notes,
                data.status || 'available',
                new Date(data.expiresAtTimestamp),
                data.createdAt
            ]
        );

        return mapRoute(result.rows[0]);
    }

    async findByDriverId(driverId) {
        const result = await pool.query(
            `
                SELECT
                    id,
                    driver_id,
                    origin,
                    origin_latitude,
                    origin_longitude,
                    destination,
                    destination_latitude,
                    destination_longitude,
                    seats,
                    departure_time,
                    notes,
                    status,
                    expires_at,
                    created_at
                FROM trips
                WHERE driver_id = $1
                ORDER BY created_at DESC
            `,
            [driverId]
        );

        return result.rows.map(mapRoute);
    }

    async deleteById(routeId) {
        const result = await pool.query(
            `
                DELETE FROM trips
                WHERE id = $1
                RETURNING *
            `,
            [routeId]
        );

        return mapRoute(result.rows[0]);
    }

    async deleteExpiredOrFull() {
        await pool.query(`
            DELETE FROM trips
            WHERE expires_at <= CURRENT_TIMESTAMP
               OR seats <= 0
        `);
    }

    async decrementSeats(routeId) {
        const result = await pool.query(
            `
                UPDATE trips
                SET seats = seats - 1
                WHERE id = $1
                  AND seats > 0
                  AND expires_at > CURRENT_TIMESTAMP
                RETURNING *
            `,
            [routeId]
        );

        return mapRoute(result.rows[0]);
    }
}


// ======================================================
// Export
// ======================================================

module.exports = PostgresRouteRepository;