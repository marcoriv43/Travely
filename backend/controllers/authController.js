const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
  // Generar JWT Token
  generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Registro de usuario
  async register(req, res) {
    try {
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phone,
        birthDate,
        gender
      } = req.body;

      // Validaciones básicas
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'Email, contraseña, nombre y apellido son requeridos'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Las contraseñas no coinciden'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Verificar si el email ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Crear el usuario
      const userId = await User.create({
        email,
        password,
        firstName,
        lastName,
        phone,
        birthDate,
        gender
      });

      // Obtener el usuario creado
      const newUser = await User.findById(userId);
      const publicProfile = User.getPublicProfile(newUser);

      // Generar token
      const token = this.generateToken(userId, email);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: publicProfile
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Login de usuario
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario por email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token
      const token = this.generateToken(user.id, user.email);

      // Obtener perfil público
      const publicProfile = User.getPublicProfile(user);

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: publicProfile
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Logout (opcional - principalmente para limpiar tokens del lado del cliente)
  async logout(req, res) {
    try {
      // En un JWT stateless, el logout se maneja principalmente en el frontend
      // Pero podríamos implementar una blacklist de tokens si fuera necesario
      
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Obtener información del usuario autenticado
  async getMe(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const publicProfile = User.getPublicProfile(user);
      
      res.json({
        success: true,
        user: publicProfile
      });
    } catch (error) {
      console.error('Error en getMe:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Refrescar token (opcional)
  async refreshToken(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Generar nuevo token
      const newToken = this.generateToken(user.id, user.email);
      const publicProfile = User.getPublicProfile(user);

      res.json({
        success: true,
        message: 'Token refrescado exitosamente',
        token: newToken,
        user: publicProfile
      });
    } catch (error) {
      console.error('Error en refresh token:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();