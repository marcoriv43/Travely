<template>
  <div>
    <div v-if="authStore.userType === 'pasajero'" class="pasajero-dashboard">
      <h2>Dashboard de Pasajero</h2>
      <div class="card">
        <h3>Buscar Viajes</h3>
        <p>Encuentra conductores disponibles cerca de ti.</p>
        <button @click="router.push('/dashboard/buscar')">Buscar Viajes</button>
      </div>
      <div class="card">
        <h3>Historial de Viajes</h3>
        <p>Revisa tus viajes anteriores.</p>
        <button @click="router.push('/dashboard/historial')">Ver Viajes</button>
      </div>
    </div>

    <div v-else-if="authStore.userType === 'conductor'" class="conductor-dashboard">
      <h2>Dashboard de Conductor</h2>
      <div class="card">
        <h3>Ofertas de Viaje</h3>
        <p>Publica un nuevo viaje disponible.</p>
        <button @click="router.push('/dashboard/publicar')">Publicar Viaje</button>
      </div>
      <div class="card">
        <h3>Historial de Viajes</h3>
        <p>Revisa tus viajes anteriores.</p>
        <button @click="router.push('/dashboard/historial-c')">Ver Viajes</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const router = useRouter();
const authStore = useAuthStore();
</script>

<style scoped>

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