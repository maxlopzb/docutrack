import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import certificateRoutes from './routes/certificates';
import adminRoutes from './routes/admin';
import { setupDatabase } from './database/setup';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration para producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://tu-frontend-url.vercel.app',
        'https://docutrack.vercel.app' // Cambia por tu dominio
      ]
    : 'http://localhost:3000',
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Docutrack API funcionando!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Docutrack API - Backend funcionando correctamente' });
});

// Inicializar base de datos y servidor
async function startServer() {
  await setupDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  });
}

startServer();