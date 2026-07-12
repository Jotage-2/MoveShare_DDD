CREATE TYPE user_role AS ENUM (
    'driver',
    'passenger'
);

CREATE TYPE trip_status AS ENUM (
    'available',
    'on_course',
    'completed',
    'canceled'
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    dni VARCHAR(8) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    role user_role,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id BIGINT PRIMARY KEY,
    driver_id UUID,
    origin VARCHAR(255) NOT NULL,
    origin_latitude DOUBLE PRECISION NOT NULL,
    origin_longitude DOUBLE PRECISION NOT NULL,
    destination VARCHAR(255) NOT NULL,
    destination_latitude DOUBLE PRECISION NOT NULL,
    destination_longitude DOUBLE PRECISION NOT NULL,
    seats INTEGER NOT NULL CHECK (seats BETWEEN 0 AND 4),
    departure_time VARCHAR(5) NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    status trip_status NOT NULL DEFAULT 'available',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT trips_driver_fk
        FOREIGN KEY (driver_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);