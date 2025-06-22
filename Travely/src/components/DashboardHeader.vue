<template>
  <header class="dashboard-header">
    <div class="header-content">
      <!-- Logo -->
      <div class="logo">
        <h2>Travely</h2>
      </div>

      <!-- Role Switcher -->
      <div class="role-switcher">
        <div class="switch-container">
          <button 
            @click="handleRoleSwitch('passenger')"
            :class="{ 
              'active': userStore.currentRole === 'passenger',
              'loading': switching && targetRole === 'passenger'
            }"
            :disabled="switching"
            class="role-button passenger-btn"
          >
            <i class="icon-passenger"></i>
            Pasajero
          </button>
          
          <button 
            @click="handleRoleSwitch('driver')"
            :class="{ 
              'active': userStore.currentRole === 'driver',
              'loading': switching && targetRole === 'driver',
              'disabled': !userStore.canActAsDriver && userStore.currentRole !== 'driver'
            }"
            :disabled="switching || (!userStore.canActAsDriver && userStore.currentRole !== 'driver')"
            class="role-button driver-btn"
          >
            <i class="icon-driver"></i>
            Conductor
            <span v-if="!userStore.canActAsDriver && userStore.currentRole !== 'driver'" class="incomplete-badge">
              Incompleto
            </span>
          </button>
        </div>
        
        <div class="current-role-indicator">
          <span class="role-text">{{ userStore.currentRole === 'driver' ? 'Conductor' : 'Pasajero' }}</span>
        </div>
      </div>

      <!-- User Menu -->
      <div class="user-menu">
        <div class="user-info" @click="toggleUserMenu">
          <img :src="userAvatar" :alt="userStore.fullName" class="user-avatar">
          <span class="user-name">{{ userStore.fullName }}</span>
          <i class="icon-chevron-down" :class="{ 'rotated': showUserMenu }"></i>
        </div>
        
        <div v-if="showUserMenu" class="user-dropdown">
          <a href="#" @click="goToProfile" class="dropdown-item">
            <i class="icon-user"></i>
            Perfil
          </a>
          <a href="#" @click="logout" class="dropdown-item">
            <i class="icon-logout"></i>
            Cerrar Sesión
          </a>
        </div>
      </div>
    </div>

    <!-- Driver Info Missing Modal -->
    <div v-if="showDriverModal" class="modal-overlay" @click="closeDriverModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Información de Conductor Requerida</h3>
          <button @click="closeDriverModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>Para actuar como conductor, necesitas completar la siguiente información:</p>
          <ul>
            <li>Número de licencia de conducir</li>
            <li>Información del vehículo (modelo, color, placa)</li>
          </ul>
        </div>
        <div class="modal-footer">
          <button @click="closeDriverModal" class="btn-secondary">Cancelar</button>
          <button @click="goToDriverSetup" class="btn-primary">Completar Información</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Composables
const router = useRouter()
const userStore = useUserStore()

// State
const switching = ref(false)
const targetRole = ref(null)
const showUserMenu = ref(false)
const showDriverModal = ref(false)

// Computed
const userAvatar = computed(() => {
  return userStore.user?.profile_image || '/default-avatar.png'
})

// Methods
async function handleRoleSwitch(role) {
  if (switching.value || userStore.currentRole === role) return
  
  switching.value = true
  targetRole.value = role
  
  try {
    const result = await userStore.switchRole(role)
    
    if (result.success) {
      // Emit event to parent to refresh dashboard
      emit('roleChanged', role)
    } else if (result.missingDriverInfo) {
      showDriverModal.value = true
    }
  } catch (error) {
    console.error('Error switching role:', error)
  } finally {
    switching.value = false
    targetRole.value = null
  }
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu() {
  showUserMenu.value = false
}

function closeDriverModal() {
  showDriverModal.value = false
}

function goToProfile() {
  router.push('/profile')
  closeUserMenu()
}

function goToDriverSetup() {
  router.push('/driver-setup')
  closeDriverModal()
}

function logout() {
  userStore.logout()
  router.push('/login')
}

// Event listeners
function handleClickOutside(event) {
  if (!event.target.closest('.user-menu')) {
    closeUserMenu()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Emits
const emit = defineEmits(['roleChanged'])
</script>

