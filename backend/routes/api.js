const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const JWT_SECRET = 'tu_secreto_seguro';
const { authenticateToken } = require('../utils/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = require('../db/pool');

app.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, tipo, sexo, estado } = req.body;    

    if (tipo !== 'conductor' && tipo !== 'pasajero') {
      return res.status(400).json({ error: 'Tipo de usuario no válido' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, email, password, tipo, sexo, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, tipo, sexo, estado]
    );
    connection.release();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo, sexo: user.sexo, estado: user.estado },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    if (user.estado !== 'activo') {
      return res.status(403).json({ error: 'Usuario suspendido/bloqueado' });
    }
    
    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, tipo: user.tipo, sexo: user.sexo, estado: user.estado } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Bienvenido al dashboard de ${req.user.tipo}` });
});

module.exports = app;