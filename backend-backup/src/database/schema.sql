-- Tabla de usuarios (empezamos simple)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de solicitudes de certificados
CREATE TABLE certificate_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    certificate_type VARCHAR(20) NOT NULL, -- 'birth' o 'education'
    status VARCHAR(20) DEFAULT 'pending',   -- 'pending', 'processing', 'ready', 'delivered'
    request_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);