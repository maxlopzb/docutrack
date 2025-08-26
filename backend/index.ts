import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar las rutas correctamente
import authRoutes from './src/routes/auth';
import certificateRoutes from './src/routes/certificates';
import adminRoutes from './src/routes/admin';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://docutrack-frontend-maxlopzb.vercel.app', 
    /\.vercel\.app$/,
    'http://localhost:3000'
  ],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'API funcionando', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ message: 'Docutrack Backend API' });
});

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};