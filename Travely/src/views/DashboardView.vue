<template>
  <div class="dashboard-container">
    <header>
      <h1>Bienvenido, {{ authStore.user.nombre }}</h1>
      <button @click="authStore.logout" class="logout-btn">Cerrar Sesión</button>
    </header>
    
    <div v-if="authStore.userType === 'pasajero'" class="pasajero-dashboard">
      <h2>Dashboard de Pasajero</h2>
      <div class="card">
        <h3>Buscar Viajes</h3>
        <p>Encuentra conductores disponibles cerca de ti.</p>
        <button @click="buscarViajes">Buscar Viajes</button>
      </div>
      <div class="card">
        <h3>Historial de Viajes</h3>
        <p>Revisa tus viajes anteriores.</p>
      </div>
    </div>
    
    <div v-else-if="authStore.userType === 'conductor'" class="conductor-dashboard">
      <h2>Dashboard de Conductor</h2>
      <div class="card">
        <h3>Ofertas de Viaje</h3>
        <p>Publica un nuevo viaje disponible.</p>
        <button @click="publicarViaje">Publicar Viaje</button>
      </div>
      <div class="card">
        <h3>Viajes Activos</h3>
        <p>Gestiona tus viajes en curso.</p>
      </div>
      <div class="card">
        <h3>Historial de Viajes</h3>
        <p>Revisa tus viajes anteriores.</p>
      </div>
    </div>
  </div>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router    = useRouter();

const buscarViajes = () => router.push('/dashboard/buscar');

const verHistorialPasajero = () => router.push('/dashboard/historial');

const publicarViaje = () => router.push('/dashboard/publicar');

const verActivos = () => router.push('/dashboard/activos');

const verHistorialConductor = () => router.push('/dashboard/historial-c');

</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  background-color: rgba(177, 154, 205, 1);
}

.logout-btn {
  background-color: #f44336;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h3 {
  margin-top: 0;
}

.card button {
  background-color: #000;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.pasajero-dashboard .card {
  background-color: #f0f8ff;
}

.conductor-dashboard .card {
  background-color: #fff0f5;
}
</style>