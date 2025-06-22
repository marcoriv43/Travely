import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/api'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const currentRole = computed(() => user.value?.current_role || 'passenger')
  const isDriver = computed(() => currentRole.value === 'driver')
  const isPassenger = computed(() => currentRole.value === 'passenger')
  const canActAsDriver = computed(() => {
    if (!user.value) return false
    return !!(user.value.driver_license && user.value.car_model && user.value.car_plate)
  })
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name} ${user.value.last_name}`
  })

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, user: userData } = response.data
      
      // Guardar token
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      user.value = userData
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user: newUser } = response.data
      
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      user.value = newUser
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al registrarse'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function loadProfile() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/user/profile')
      user.value = response.data.user
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar perfil'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/user/profile', profileData)
      user.value = response.data.user
      return { success: true, message: response.data.message }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar perfil'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function switchRole(newRole) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/user/switch-role', { role: newRole })
      user.value = response.data.user
      return { success: true, message: response.data.message }
    } catch (err) {
      const errorData = err.response?.data
      error.value = errorData?.message || 'Error al cambiar rol'
      
      return { 
        success: false, 
        error: error.value,
        missingDriverInfo: errorData?.missingDriverInfo || false
      }
    } finally {
      loading.value = false
    }
  }

  async function updateDriverInfo(driverData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/user/driver-info', driverData)
      user.value = response.data.user
      return { success: true, message: response.data.message }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar información del conductor'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function loadDashboard() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/user/dashboard')
      return { success: true, data: response.data.dashboard }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar dashboard'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  function clearError() {
    error.value = null
  }

  // Inicialización: verificar si hay token guardado
  function initializeAuth() {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      loadProfile()
    }
  }

  return {
    // State
    user,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    currentRole,
    isDriver,
    isPassenger,
    canActAsDriver,
    fullName,
    
    // Actions
    login,
    register,
    loadProfile,
    updateProfile,
    switchRole,
    updateDriverInfo,
    loadDashboard,
    logout,
    clearError,
    initializeAuth
  }
})