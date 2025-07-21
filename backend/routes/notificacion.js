const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const pool = require('../db/pool');
app.use(bodyParser.json());

app.get('/', async (req, res) => {  
  try {    
    let id_usuario = req.query.id_usuario;    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM notificaciones WHERE id_usuario = ? AND estado_ntf = 'enviado' ORDER BY fecha_ntf DESC`, [id_usuario]
    );
    connection.release();     
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
  }
});

app.get('/activas', async (req, res) => {  
  try {    
    let id_usuario = req.query.id_usuario;    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM notificaciones WHERE id_usuario = ? AND estado_ntf IN ('visto', 'enviado') ORDER BY fecha_ntf DESC`, [id_usuario]
    );
    connection.release();     
    res.send(result);
  } catch (error) {
    console.error('Error al obtener las notificaciones activas:', error);
    res.status(500).json({ error: 'Error al obtener las notificaciones activas' });
  }
});

app.post('/crear', async (req, res) => {
  try {
    const { id_usuario, titulo_ntf, mensaje_ntf } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO notificaciones (estado_ntf, titulo_nft, mensaje_ntf, id_usuario) VALUES (?, ?, ?, ?)`, ['enviado', titulo_ntf, mensaje_ntf, id_usuario]
    );
    connection.release();
    res.status(201).json({ message: 'Notificación creada' });
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    res.status(500).json({ error: 'Error al crear la notificación' });
  }
});

app.put('/cambio', async (req, res) => {
  try {    
    const id_ntf = req.body.id;
    const estado_ntf = req.body.estado;
    const connection = await pool.getConnection();
    await connection.execute(
      `UPDATE notificaciones SET estado_ntf = ? WHERE id_ntf = ?`, [estado_ntf, id_ntf]
    );
    connection.release();
    res.status(200).json({ message: 'Notificación actualizada a visto' });
  } catch (error) {
    console.error('Error al actualizar la notificación:', error);
    res.status(500).json({ error: 'Error al actualizar la notificación' });
  }
});

module.exports = app;