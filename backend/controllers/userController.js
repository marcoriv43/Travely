const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
  // Obtener perfil del usuario
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const publicProfile = User.getPublicProfile(user);
      res.json({
        success: true,
        user: publicProfile
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error al obtener perfil',
        error: error.message 
      });
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(req, res) {
    try {
      const {
        firstName,
        lastName,
        phone,
        birthDate,
        gender,
        preferences
      } = req.body;

      const profileData = {
        first_name: firstName,
        last_name: lastName,
        phone,
        birth_date: birthDate,
        gender,
        preferences: preferences ? JSON.stringify(preferences) : undefined
      };

      // Remover campos undefined
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) {
          delete profileData[key];
        }
      });

      const updated = await User.updateProfile(req.userId, profileData);
      
      if (updated) {
        const updatedUser = await User.findById(req.userId);
        res.json({
          success: true,
          message: 'Perfil actualizado exitosamente',
          user: User.getPublicProfile(updatedUser)
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo actualizar el perfil'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar perfil',
        error: error.message
      });
    }
  }

  // Cambiar rol del usuario
  async switchRole(req, res) {
    try {
      const { role } = req.body;
      
      if (!['passenger', 'driver'].includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Rol inválido'
        });
      }

      // Si quiere cambiar a conductor, verificar que tenga la información necesaria
      if (role === 'driver') {
        const user = await User.findById(req.userId);
        if (!User.canActAsDriver(user)) {
          return res.status(400).json({
            success: false,
            message: 'Debe completar la información de conductor primero',
            missingDriverInfo: true
          });
        }
      }

      const updated = await User.switchRole(req.userId, role);
      
      if (updated) {
        const updatedUser = await User.findById(req.userId);
        res.json({
          success: true,
          message: `Rol cambiado a ${role} exitosamente`,
          user: User.getPublicProfile(updatedUser)
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo cambiar el rol'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cambiar rol',
        error: error.message
      });
    }
  }

  // Actualizar información de conductor
  async updateDriverInfo(req, res) {
    try {
      const {
        driverLicense,
        carModel,
        carColor,
        carPlate,
        carYear
      } = req.body;

      if (!driverLicense || !carModel || !carPlate) {
        return res.status(400).json({
          success: false,
          message: 'Licencia, modelo del auto y placa son requeridos'
        });
      }

      const driverData = {
        driverLicense,
        carModel,
        carColor,
        carPlate,
        carYear: carYear ? parseInt(carYear) : null
      };

      const updated = await User.updateDriverInfo(req.userId, driverData);
      
      if (updated) {
        const updatedUser = await User.findById(req.userId);
        res.json({
          success: true,
          message: 'Información de conductor actualizada exitosamente',
          user: User.getPublicProfile(updatedUser)
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'No se pudo actualizar la información del conductor'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar información del conductor',
        error: error.message
      });
    }
  }

  // Obtener dashboard según el rol actual
  async getDashboard(req, res) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const dashboardData = {
        currentRole: user.current_role,
        user: User.getPublicProfile(user),
        stats: {
          tripsAsDriver: user.total_trips_as_driver,
          tripsAsPassenger: user.total_trips_as_passenger,
          driverRating: user.driver_rating,
          passengerRating: user.passenger_rating
        },
        canActAsDriver: User.canActAsDriver(user)
      };

      // Agregar datos específicos según el rol
      if (user.current_role === 'driver' && User.canActAsDriver(user)) {
        dashboardData.vehicleInfo = {
          model: user.car_model,
          color: user.car_color,
          plate: user.car_plate,
          year: user.car_year
        };
      }

      res.json({
        success: true,
        dashboard: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener dashboard',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();