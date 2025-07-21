const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const pool = require('../db/pool');
app.use(bodyParser.json());

app.get('', async (req, res) => {  
  try {    
    let id_usuario = req.query.id_usuario;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM pasajeros 
        LEFT JOIN viajes ON viaje_id = id_viaje 
        LEFT JOIN usuarios ON conductor_id=id 
        LEFT JOIN vehiculo ON vehiculo_id=id_vehiculo 
        LEFT JOIN ruta ON ruta_id=id_ruta 
        WHERE id_pasajero1 = ? AND (estado_viaje = 'programado' OR estado_viaje = 'en proceso')        
        ORDER BY inicia_el`, [id_usuario]
    );
    connection.release(); 
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
  }
});

app.delete('/cancelar', async (req, res) => {
  try {
    let id_usuario = req.query.id_usuario;
    let id_viaje = req.query.id_viaje;
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM pasajeros WHERE id_pasajero1 = ? AND viaje_id = ?', [id_usuario, id_viaje]);
    connection.release();
    res.sendStatus(204);
  } catch (error) {
    console.error('Error al cancelar el viaje:', error);
    res.status(500).json({ error: 'Error al cancelar el viaje' });    
  }
});


app.get('/inical', async (req, res) => {  
  try {    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM viajes 
        LEFT JOIN vehiculo ON vehiculo_id=id_vehiculo
        LEFT JOIN ruta ON ruta_id=id_ruta
        LEFT JOIN usuarios ON conductor_id=id           
        ORDER BY inicia_el DESC`
    );
    connection.release(); 
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
  }
});

app.post('/reservar', async (req, res) => {
  try {
    const { id_viaje, id_usuario } = req.body; 
    const connection = await pool.getConnection();        
    const [result] = await connection.execute('INSERT INTO pasajeros(id_pasajero1, viaje_id) VALUES (?, ?)', [id_usuario, id_viaje]);
    connection.release();
    res.send(result);
  } catch (error) {
    console.error('Error al reservar el viaje:', error);
    res.status(500).json({ error: 'Error al reservar el viaje' });    
  }  
});

app.post('/buscador', async (req, res) => {  
  try {
    const { id_ruta, asientos, pago, fecha, hora } = req.body;
    const connection = await pool.getConnection();

    let conditions = ["estado_viaje = 'programado'"];
    let params = [];
    if (id_ruta) {
      conditions.push("id_ruta LIKE ?");
      params.push(id_ruta);
    }
    if (asientos) {
      conditions.push("capacidad >= ?");
      params.push(asientos);
    }
    if (pago) {
      conditions.push("precio >= ?");
      params.push(pago);
    }
    if (fecha) {
      conditions.push("inicia_el = ?");
      params.push(fecha);
    }
    if (hora) {
      conditions.push("inicia_a LIKE ?");
      params.push(hora);
    }
    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';    
    const [result] = await connection.execute(
      `SELECT * FROM viajes 
        LEFT JOIN vehiculo ON vehiculo_id=id_vehiculo
        LEFT JOIN ruta ON ruta_id=id_ruta
        LEFT JOIN usuarios ON conductor_id=id
        ${whereClause}
        ORDER BY inicia_el DESC`,
      params
    );    
    
    connection.release(); 
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes de forma especifica:', error);
    res.status(500).json({ error: 'Error al obtener los viajes de forma especifica' });
  }
});

app.get('/historial', async (req, res) => {  
  try {
    let id_usuario = req.query.id_usuario;
    
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `SELECT * FROM pasajeros 
        LEFT JOIN viajes ON viaje_id = id_viaje 
        LEFT JOIN usuarios ON conductor_id=id 
        LEFT JOIN vehiculo ON vehiculo_id=id_vehiculo 
        LEFT JOIN ruta ON ruta_id=id_ruta 
        WHERE id_pasajero1 = ? ORDER BY inicia_el DESC`, [id_usuario]
    );
    connection.release();
    res.send(result);
  } catch (error) {
    console.error('Error al obtener los viajes registrados:', error);
    res.status(500).json({ error: 'Error al obtener los viajes registrados' });
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

module.exports = app;