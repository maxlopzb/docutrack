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

// Middleware para verificar que es admin
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  if (authReq.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

// Obtener todas las solicitudes (solo admins)
router.get('/requests', auth, requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        cr.*,
        u.first_name,
        u.last_name,
        u.email
      FROM certificate_requests cr
      JOIN users u ON cr.user_id = u.id
      ORDER BY cr.created_at DESC
    `);

    const requests = result.rows.map(row => ({
      id: row.id,
      user: {
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email
      },
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

// Cambiar estado de una solicitud
router.patch('/requests/:id/status', auth, requireAdmin, async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const authReq = req as AuthenticatedRequest;

    // Validar estado
    const validStatuses = ['pending', 'processing', 'ready', 'delivered', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    // Actualizar estado
    const result = await query(
      'UPDATE certificate_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Registrar en historial (opcional, para ahora solo actualizamos)
    res.json({
      message: 'Estado actualizado exitosamente',
      data: {
        id: result.rows[0].id,
        status: result.rows[0].status
      }
    });

  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener estadísticas del dashboard
router.get('/stats', auth, requireAdmin, async (req, res) => {
  try {
    const totalRequests = await query('SELECT COUNT(*) FROM certificate_requests');
    const pendingRequests = await query('SELECT COUNT(*) FROM certificate_requests WHERE status = $1', ['pending']);
    const processingRequests = await query('SELECT COUNT(*) FROM certificate_requests WHERE status = $1', ['processing']);
    const readyRequests = await query('SELECT COUNT(*) FROM certificate_requests WHERE status = $1', ['ready']);

    const stats = {
      total: parseInt(totalRequests.rows[0].count),
      pending: parseInt(pendingRequests.rows[0].count),
      processing: parseInt(processingRequests.rows[0].count),
      ready: parseInt(readyRequests.rows[0].count)
    };

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;