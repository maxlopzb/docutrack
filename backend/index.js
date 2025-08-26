const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

// Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors({
  origin: [
    'https://docutrack-frontend-maxlopzb.vercel.app',
    /\.vercel\.app$/,
    'http://localhost:3000'
  ],
  credentials: true,
}));

app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Docutrack API funcionando!' });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Health check OK', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, passwordHash, firstName, lastName]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Init DB
const initDB = async () => {
  try {
    await pool.query(`
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

    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificate_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        certificate_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        request_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const adminExists = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@docutrack.com']);
    
    if (adminExists.rows.length === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
        ['admin@docutrack.com', adminPassword, 'Admin', 'System', 'admin']
      );
    }
  } catch (error) {
    console.error('DB Init error:', error);
  }
};

initDB();

module.exports = app;