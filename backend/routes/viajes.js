const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const pool = require('../db/pool');
app.use(bodyParser.json());

app.get('', async (req, res) => {  
  try {
    let id_conductor = req.query.id_conductor;
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM viajes 
        LEFT JOIN vehiculo ON vehiculo_id=id_vehiculo 
        LEFT JOIN ruta ON ruta_id=id_ruta         
        WHERE conductor_id = ? 
        AND (estado_viaje = 'programado' OR estado_viaje = 'en proceso')
        AND inicia_el BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 10 DAY)
        ORDER BY inicia_el DESC`,
      [id_conductor]
    );
    connection.release(); 
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
  }
});

app.get('/disp', async (req, res) => {
  try {
    let id_viaje = req.query.id_viaje;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM pasajeros WHERE viaje_id=?`,[id_viaje]);
    connection.release();
    res.send(result);    
  } catch (error) {
    console.error('Error al obtener los pasajeros por viajes:', error);
    res.status(500).json({ error: 'Error al obtener los pasajeros por viajes' });    
  }
},)

app.patch('/cambio', async (req, res) => {
  try {
    const { id_viaje, estado_viaje } = req.body;
    const connection = await pool.getConnection();
    await connection.execute('UPDATE viajes SET estado_viaje = ? WHERE id_viaje = ?', [estado_viaje,id_viaje]);
    connection.release();

    res.status(200).json({ message: 'Viaje cancelado exitosamente' });
  } catch (error) {
    console.error('Error al cancelar el viaje:', error);
    res.status(500).json({ error: 'Error al cancelar el viaje' });
  }
});

app.get('/historial', async (req, res) => {  
  try {
    let id_conductor = req.query.id_conductor;
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'SELECT * FROM viajes LEFT JOIN vehiculo ON vehiculo_id=id_vehiculo LEFT JOIN ruta ON ruta_id=id_ruta WHERE conductor_id = ? ORDER BY inicia_el DESC', [id_conductor]
    );
    connection.release();
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
  }
});

app.post('/register', async (req, res) => {  
  try {
    const { descripcion, vehiculo_id, ruta_id, disponibleHoy, inicia_el, inicia_a, precio, conductor_id } = req.body;
    
    const connection = await pool.getConnection();       
    const [result] = await connection.execute(
      'INSERT INTO viajes (descripcion, vehiculo_id, ruta_id, disp_hoy, inicia_el, inicia_a, precio, conductor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [descripcion, vehiculo_id, ruta_id, disponibleHoy, inicia_el, inicia_a, precio, conductor_id]
    );
    connection.release();

    res.status(200).json({ message: 'Viaje registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar viaje:', error);
    res.status(500).json({ error: 'Error al registrar viaje' });
  }
});

app.get('/vehiculos', async (req, res) => {  
  try {
    const id_conductor = req.query.conductor_id;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'SELECT * FROM vehiculo WHERE usuario_id = ? ORDER BY capacidad' ,
      [id_conductor]
    );
    connection.release();
    
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los vehiculos registrados:', error);
    res.status(500).json({ error: 'Error al obtener los vehiculos registrados' });
  }
});

app.post('/nuevo-vehiculo', async (req, res) => {  
  try {
    const { tipo_vehiculo, modelo, marca, color, capacidad, usuario_id } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO vehiculo(tipo_vehiculo, modelo, marca, color, capacidad, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
      [tipo_vehiculo, modelo, marca, color, capacidad, usuario_id]
    );
    connection.release();
    
    res.status(200).json({ message: 'Vehiculo registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar un nuevo vehiculo:', error);
    res.status(500).json({ error: 'Error al registrar el vehiculo' });
  }
});

app.get('/rutas', async (req, res) => {  
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'SELECT * FROM ruta ORDER BY nombre_ruta',
    );
    connection.release();
    
    res.send(result);
  } catch (error) {
    console.error('Error al obtener las rutas registradas:', error);
    res.status(500).json({ error: 'Error al obtener las rutas registradas' });
  }
});

app.post('/nueva-ruta', async (req, res) => {  
  try {
    const { nombre_ruta, salida, llegada } = req.body;
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO ruta (nombre_ruta, salida, llegada) VALUES (?, ?, ?)',
      [nombre_ruta, salida, llegada]
    );
    connection.release();
    
    res.status(200).json({ message: 'Ruta registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar la nueva ruta:', error);
    res.status(500).json({ error: 'Error al registrar rutas' });
  }
});

module.exports = app;