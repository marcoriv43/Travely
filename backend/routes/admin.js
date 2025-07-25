const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const pool = require('../db/pool');
app.use(bodyParser.json());

app.get('/usuarios', async (req, res) => {  
  try {    
    let id_usuario = req.query.id_usuario;    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM usuarios WHERE id != ?`, [id_usuario]
    );
    connection.release();     
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los usuarios registrados:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios registrados' });
  }
});

app.get('/buscar', async (req, res) => {
  try {
    const busqueda = req.query.busqueda || '';
    const busquedaLike = `%${busqueda}%`;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM usuarios WHERE nombre LIKE ? OR email LIKE ?`, [busquedaLike, busquedaLike]
    );
    connection.release();
    res.send(result);
  } catch (error) {
    console.error('Error al buscar los usuarios:', error);
    res.status(500).json({ error: 'Error al buscar los usuarios' });
  }
});

app.put('/cambio', async (req, res) => {
  try {
    const id = req.body.id;
    const estado = req.body.estado;        
    const connection = await pool.getConnection();
    await connection.execute(
      `UPDATE usuarios SET estado = ? WHERE id = ?`, [estado, id]
    );
    connection.release();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
    res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
  }
});

app.get('/viajes', async (req, res) => {  
  try {    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM viajes
      LEFT JOIN usuarios ON conductor_id = id
      LEFT JOIN vehiculo ON vehiculo_id = id_vehiculo
      LEFT JOIN ruta ON ruta_id = id_ruta` 
    );
    connection.release();
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
  }
});

app.put('/cambio-v', async (req, res) => {
  try {
    const id = req.body.id;
    const estado = req.body.estado;
    const connection = await pool.getConnection();
    await connection.execute(
      `UPDATE viajes SET estado_viaje = ? WHERE id_viaje = ?`, [estado, id]
    );
    connection.release();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
    res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
  }
});

module.exports = app;