<template>    
  <h2>Dashboard de Notificaciones</h2>
  <div class="contenedor">
    <div v-if="notificaciones.length === 0" class="resto-contenedor">
      <h3>No tienes notificaciones registradas</h3>      
    </div>
    <div v-else class="resto-contenedor">
      <h3>Historial de notificaciones</h3><br>
      <div class="cards-container">
        <div v-for="(notificacion, idx) in notificaciones" class="card" :key="idx">
          <h4>{{ notificacion.titulo_nft }}</h4><br>
          <p>Fecha: {{ notificacion.fecha_ntf }}</p><br>
          <p>{{ notificacion.mensaje_ntf }}</p>
          <button @click="borrarNtf(notificacion.id_ntf)">Borrar</button>
        </div>
      </div>
    </div>
  </div>   
</template>


<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const authStore = useAuthStore();
const router    = useRouter();

onMounted(() => {
  historialNtf();
})

const notificaciones = ref([]);

const historialNtf = async () => {
  try {
    const response = await axios.get('http://localhost:3000/ntf/activas', 
      { params: { id_usuario: authStore.user.id } }
    );
    notificaciones.value = response.data;
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
    rutas.value = [];
  }
};

const borrarNtf = async (id) => {
  try {        
    const response = await axios.put('http://localhost:3000/ntf/cambio', {
      id: id,
      estado: 'archivado'
    });
    historialNtf();
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
    rutas.value = [];
  }
};

</script>

<style scoped>

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 30%;
  min-width: 250px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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


</style>