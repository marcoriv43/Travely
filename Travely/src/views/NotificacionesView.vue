<template>
    <h3 class="text-center text-3xl py-6" >Historial de notificaciones</h3><br>
    <div class="pl-2.5">
      <button class="btn-dark" @click="goHome" >Regresar</button>
    </div>
    <div class="contenedor">
    <div v-if="notificaciones.length === 0" class="resto-contenedor">
      <h3 class="text-center text-3xl py-6" >No tienes notificaciones registradas</h3>

    </div>
    <div v-else class="resto-contenedor">

      
      <div class="flex flex-wrap gap-5 justify-start">
        <div v-for="(notificacion, idx) in notificaciones" class="card" :key="idx">
          <h4>{{ notificacion.titulo_nft }}</h4><br>
          <p>Fecha: {{ notificacion.fecha_ntf }}</p><br>
          <p>{{ notificacion.mensaje_ntf }}</p>
          <div class="pt-3">
            <button class="btn-dark w-full" @click="borrarNtf(notificacion.id_ntf)">Borrar</button>
          </div>
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

const goHome = () => router.push('/');

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

