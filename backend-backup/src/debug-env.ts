import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('=== DIAGNÓSTICO DE VARIABLES DE ENTORNO ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);
console.log('JWT_SECRET existe:', !!process.env.JWT_SECRET);

if (process.env.DATABASE_URL) {
  // Mostrar solo los primeros 50 caracteres por seguridad
  console.log('DATABASE_URL (primeros 50 chars):', process.env.DATABASE_URL.substring(0, 50) + '...');
} else {
  console.log('❌ DATABASE_URL no está definida');
}

console.log('=== FIN DIAGNÓSTICO ===');