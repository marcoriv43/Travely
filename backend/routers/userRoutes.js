const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de perfil
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Rutas de cambio de rol
router.post('/switch-role', userController.switchRole);

// Rutas específicas del conductor
router.put('/driver-info', userController.updateDriverInfo);

// Dashboard
router.get('/dashboard', userController.getDashboard);

module.exports = router;

