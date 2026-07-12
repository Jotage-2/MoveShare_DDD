require('dotenv').config();

const pool = require('./src/shared/infrastructure/PostgresConnection');

async function testDatabaseConnection() {
    try {
        const result = await pool.query(
            'SELECT NOW() AS current_time'
        );

        console.log(
            'Conexión exitosa con PostgreSQL.'
        );

        console.log(
            'Hora de PostgreSQL:',
            result.rows[0].current_time
        );
    } catch (error) {
        console.error(
            'No se pudo conectar con PostgreSQL:',
            error.message
        );
    } finally {
        await pool.end();
    }
}

testDatabaseConnection();