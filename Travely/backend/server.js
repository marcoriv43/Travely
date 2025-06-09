const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'travelty'
};

const pool = mysql.createPool(dbConfig);

// Secret para JWT
const JWT_SECRET = 'tu_secreto_seguro';

// Registrar usuario
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, password, tipo, sexo } = req.body;
    
    // Validar tipo de usuario
    if (tipo !== 'conductor' && tipo !== 'pasajero') {
      return res.status(400).json({ error: 'Tipo de usuario no válido' });
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, email, password, tipo, sexo) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hashedPassword, tipo, sexo]
    );
    connection.release();
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
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
      { id: user.id, email: user.email, tipo: user.tipo, sexo: user.sexo },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, tipo: user.tipo, sexo: user.sexo } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Ruta protegida de ejemplo
app.get('/api/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Bienvenido al dashboard de ${req.user.tipo}` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});