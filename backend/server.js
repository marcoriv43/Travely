// backend/test-server.js
// Servidor simple para probar que todo funciona
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rutas de prueba para auth
app.post('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta de auth funcionando',
    body: req.body
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de prueba corriendo en http://localhost:${PORT}`);
  console.log(`🔗 Prueba: http://localhost:${PORT}/health`);
});