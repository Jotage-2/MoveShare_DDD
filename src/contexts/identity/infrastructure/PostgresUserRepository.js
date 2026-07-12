// ======================================================
// Dependencies
// ======================================================

const UserRepository = require('../domain/UserRepository');
const pool = require('../../../shared/infrastructure/PostgresConnection');


// ======================================================
// Mapper
// ======================================================

function mapUser(row) {
    if (!row) {
        return null;
    }

    return {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        dni: row.dni,
        password: row.password,
        verified: row.verified,
        role: row.role,
        createdAt: row.created_at
    };
}


// ======================================================
// Repository
// ======================================================

class PostgresUserRepository extends UserRepository {

    async findAll() {
        const result = await pool.query(`
            SELECT
                id,
                first_name,
                last_name,
                email,
                dni,
                password,
                verified,
                role,
                created_at
            FROM users
            ORDER BY created_at DESC
        `);

        return result.rows.map(mapUser);
    }

    async findByEmail(email) {
        const normalizedEmail = String(email || '')
            .toLowerCase()
            .trim();

        const result = await pool.query(
            `
                SELECT
                    id,
                    first_name,
                    last_name,
                    email,
                    dni,
                    password,
                    verified,
                    role,
                    created_at
                FROM users
                WHERE LOWER(email) = $1
                LIMIT 1
            `,
            [normalizedEmail]
        );

        return mapUser(result.rows[0]);
    }

    async findById(id) {
        const result = await pool.query(
            `
                SELECT
                    id,
                    first_name,
                    last_name,
                    email,
                    dni,
                    password,
                    verified,
                    role,
                    created_at
                FROM users
                WHERE id = $1
                LIMIT 1
            `,
            [id]
        );

        return mapUser(result.rows[0]);
    }

    async create(user) {
        const data =
            typeof user.toJSON === 'function'
                ? user.toJSON()
                : user;

        const result = await pool.query(
            `
                INSERT INTO users (
                    id,
                    first_name,
                    last_name,
                    email,
                    dni,
                    password,
                    verified,
                    role,
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
                    $9
                )
                RETURNING *
            `,
            [
                data.id,
                data.firstName,
                data.lastName,
                data.email,
                data.dni,
                data.password,
                data.verified,
                data.role || null,
                data.createdAt
            ]
        );

        return mapUser(result.rows[0]);
    }

    async update(id, updates) {
        const currentUser = await this.findById(id);

        if (!currentUser) {
            return null;
        }

        const updatedUser = {
            ...currentUser,
            ...updates
        };

        const result = await pool.query(
            `
                UPDATE users
                SET
                    first_name = $1,
                    last_name = $2,
                    email = $3,
                    dni = $4,
                    password = $5,
                    verified = $6,
                    role = $7
                WHERE id = $8
                RETURNING *
            `,
            [
                updatedUser.firstName,
                updatedUser.lastName,
                updatedUser.email,
                updatedUser.dni,
                updatedUser.password,
                updatedUser.verified,
                updatedUser.role || null,
                id
            ]
        );

        return mapUser(result.rows[0]);
    }
}


// ======================================================
// Export
// ======================================================

module.exports = PostgresUserRepository;