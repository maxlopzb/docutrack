import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Extender el tipo Request para incluir user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};