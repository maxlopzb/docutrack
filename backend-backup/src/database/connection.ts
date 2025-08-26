import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno explícitamente
dotenv.config();

// Verificar que la variable de entorno esté cargada
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL no está configurada');
  console.error('Variables disponibles:');
  console.error('NODE_ENV:', process.env.NODE_ENV);
  console.error('JWT_SECRET existe:', !!process.env.JWT_SECRET);
  process.exit(1);
}

console.log('🔍 Conectando a Neon PostgreSQL...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Test de conexión
pool.on('connect', () => {
  console.log('🔗 Conectado exitosamente a Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error de conexión a PostgreSQL:', err.message);
});

export default pool;