<template>
  <div class="dashboard-container">
    <header>
      <h1>Bienvenido, {{ authStore.user.nombre }}</h1>
      <button @click="authStore.logout" class="logout-btn">Cerrar Sesión</button>
    </header>
    
    <main class="content">
      <router-view />
    </main>
  </div>
  
 <footer class="app-footer">
    <p>&copy; {{ new Date().getFullYear() }} Travely – Todos los derechos reservados.</p>
  </footer>

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
  background-color: #000;
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

.app-footer {
background: #E1BEE7;
  text-align: center;
  font-size: .9rem;
  color: #666;
  padding: 1rem 0;
  border-top: 1px solid #e0e0e0;
}
  


</style>