import dotenv from 'dotenv';
import { query } from './connection';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno
dotenv.config();

export async function setupDatabase() {
  try {
    console.log('📊 Creando tablas...');

    // Crear tabla de usuarios
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de solicitudes
    await query(`
      CREATE TABLE IF NOT EXISTS certificate_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        certificate_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        request_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tablas creadas exitosamente');

    const adminExists = await query('SELECT id FROM users WHERE email = $1', ['admin@docutrack.com']);

    if (adminExists.rows.length === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
        ['admin@docutrack.com', adminPassword, 'Admin', 'System', 'admin']
      );
      console.log('👨‍💼 Usuario administrador creado: admin@docutrack.com / admin123');
    }

    // Probar una consulta simple
    const testResult = await query('SELECT NOW() as current_time');
    console.log('🕐 Conexión verificada:', testResult.rows[0].current_time);

  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    throw error;
  }
}