const { Pool } = require('pg');

const isProduction =
    process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: isProduction
        ? {
              rejectUnauthorized: false
          }
        : false
});

pool.on('error', (error) => {
    console.error(
        '[PostgreSQL] Error inesperado en la conexión:',
        error
    );
});

module.exports = pool;