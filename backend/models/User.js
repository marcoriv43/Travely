const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

class User {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(config);
    }
    return this.connection;
  }

  async create(userData) {
    const conn = await this.connect();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      birthDate,
      gender
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await conn.execute(
      `INSERT INTO users (email, password, first_name, last_name, phone, birth_date, gender) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, firstName, lastName, phone, birthDate, gender]
    );

    return result.insertId;
  }

  async findByEmail(email) {
    const conn = await this.connect();
    const [rows] = await conn.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  async findById(id) {
    const conn = await this.connect();
    const [rows] = await conn.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async updateProfile(id, profileData) {
    const conn = await this.connect();
    const fields = [];
    const values = [];

    // Construir dinámicamente la query con solo los campos que se van a actualizar
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(profileData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    const [result] = await conn.execute(query, values);
    return result.affectedRows > 0;
  }

  async switchRole(id, newRole) {
    const conn = await this.connect();
    const [result] = await conn.execute(
      'UPDATE users SET current_role = ? WHERE id = ?',
      [newRole, id]
    );
    return result.affectedRows > 0;
  }

  async updateDriverInfo(id, driverData) {
    const conn = await this.connect();
    const {
      driverLicense,
      carModel,
      carColor,
      carPlate,
      carYear
    } = driverData;

    const [result] = await conn.execute(
      `UPDATE users SET 
       driver_license = ?, 
       car_model = ?, 
       car_color = ?, 
       car_plate = ?, 
       car_year = ? 
       WHERE id = ?`,
      [driverLicense, carModel, carColor, carPlate, carYear, id]
    );
    
    return result.affectedRows > 0;
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Método para obtener el perfil sin datos sensibles
  getPublicProfile(user) {
    const {
      password,
      ...publicProfile
    } = user;
    return publicProfile;
  }

  // Verificar si el usuario puede actuar como conductor
  canActAsDriver(user) {
    return user.driver_license && user.car_model && user.car_plate;
  }
}

module.exports = new User();