import express from 'express';
import dotenv from 'dotenv';
import { query } from '../database/connection';
import { auth } from '../middleware/auth';

dotenv.config();

const router = express.Router();

// Interfaz para request autenticado
interface AuthenticatedRequest extends express.Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

// Solicitar un certificado (requiere autenticación)
router.post('/request', auth, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { certificateType, formData } = req.body;
    const userId = authReq.user.userId;

    // Validación básica
    if (!certificateType || !formData) {
      return res.status(400).json({ message: 'Tipo de certificado y datos son requeridos' });
    }

    if (!['birth', 'education'].includes(certificateType)) {
      return res.status(400).json({ message: 'Tipo de certificado inválido' });
    }

    // Crear solicitud
    const result = await query(
      'INSERT INTO certificate_requests (user_id, certificate_type, request_data) VALUES ($1, $2, $3) RETURNING *',
      [userId, certificateType, JSON.stringify(formData)]
    );

    const request = result.rows[0];

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      data: {
        id: request.id,
        certificateType: request.certificate_type,
        status: request.status,
        requestData: request.request_data,
        createdAt: request.created_at
      }
    });

  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener solicitudes del usuario
router.get('/my-requests', auth, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user.userId;

    const result = await query(
      'SELECT * FROM certificate_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const requests = result.rows.map(row => ({
      id: row.id,
      certificateType: row.certificate_type,
      status: row.status,
      requestData: row.request_data,
      createdAt: row.created_at
    }));

    res.json({
      message: 'Solicitudes obtenidas exitosamente',
      data: requests
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener una solicitud específica
router.get('/request/:id', auth, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const requestId = req.params.id;
    const userId = authReq.user.userId;

    const result = await query(
      'SELECT * FROM certificate_requests WHERE id = $1 AND user_id = $2',
      [requestId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const request = result.rows[0];

    res.json({
      message: 'Solicitud obtenida exitosamente',
      data: {
        id: request.id,
        certificateType: request.certificate_type,
        status: request.status,
        requestData: request.request_data,
        createdAt: request.created_at
      }
    });

  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;