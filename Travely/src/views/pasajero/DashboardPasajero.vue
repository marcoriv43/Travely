<template>    
  <h2 class="text-center text-3xl pb-4 >Dashboard de Pasajero"</h2>
  <div class="flex flex-row">
    <div class="w-1/4 p-5">
      <div class="card">
        <h3 class="text-xl">Buscar Viajes</h3>
        <p>Encuentra conductores disponibles cerca de ti.</p>
        <button class="btn-dark" @click="buscarViaje">Buscar Viajes</button>
      </div>
      <div class="card">
        <h3 class="text-xl">Historial de Viajes</h3>
        <p>Revisa tus viajes anteriores.</p>
        <button class="btn-dark" @click="verHistorial">Ver Viajes</button>
      </div>
    </div>
    <div class="w-3/4 p-4">
      <div class="card">
      <h3 class="text-xl">Mis Viajes Activos:</h3>
      <div v-if="viajes.length === 0" class="resto-contenedor">
        <p class="py-1">No hay Viajes Activos</p>
        <button class="btn-dark" @click="buscarViaje">Buscar Viajes</button>
      </div>
        <div v-else class="resto-contenedor">
          <h3>Resultados de la búsqueda</h3><br>
          <div class="cards-container">
            <div v-for="(viaje, idx) in viajes" class="card" :key="idx">
              <h4>{{ viaje.descripcion }}</h4><br>
              <ul>
                <li>Conductor: {{ viaje.conductor.nombre_conductor }}</li>
                <li>Vehículo: {{ viaje.vehiculo.tipo_vehiculo }} {{ viaje.vehiculo.marca }} {{ viaje.vehiculo.modelo }}</li>
                <li>Ruta: {{ viaje.ruta.salida }} - {{ viaje.ruta.llegada }}</li>
                <li>Fecha: {{ viaje.fecha }}</li>
                <li v-if="viaje.estado_viaje === 'programado'">Inician en: {{ tiempoRestante(viaje.fecha) }}</li>
                <li>Precio: ${{ viaje.precio }}</li>
                <li>Disponibilidad: {{ viaje.disponibilidad }} asientos</li>              
              </ul>
              <button v-if="viaje.estado_viaje === 'programado'" @click="cancelarViaje(viaje.id_viaje, viaje.conductor.id_conductor)">Cancelar</button>
              <button v-else>Viaje en proceso</button>
            </div>
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

const router = useRouter();
const authStore = useAuthStore();

const buscarViaje = () => router.push('/dashboard/buscar');
const verHistorial = () => router.push('/dashboard/historial');

onMounted(() => {
  misViajes();
});

const viajes = ref([]);

const misViajes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/pasajeros',
      { params: { id_usuario: authStore.user.id } }
    );
    let historial = response.data;
    let viajesTransformados = await Promise.all(historial.map(async element => {
      let fecha = '';
      if (element.inicia_el && element.inicia_a) {
        const fechaObj = new Date(element.inicia_el);
        const [hora, minuto] = element.inicia_a.split(":");
        fechaObj.setHours(hora, minuto);
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const año = fechaObj.getFullYear();
        const horaStr = String(hora).padStart(2, '0');
        const minStr = String(minuto).padStart(2, '0');
        fecha = `${dia}/${mes}/${año} ${horaStr}:${minStr}`;
      }
      let disponibilidad = element.capacidad;
      const pasajeroDisp = await axios.get('http://localhost:3000/viajes/disp', {
        params: { id_viaje: element.id_viaje }
      });
      disponibilidad = disponibilidad - pasajeroDisp.data.length;
      return {
        id_viaje: element.id_viaje,
        descripcion: element.descripcion,
        conductor: {
          id_conductor: element.id,
          nombre_conductor: element.nombre,
          email: element.email,
          sexo: element.sexo
        },
        vehiculo: {
          tipo_vehiculo: element.tipo_vehiculo,
          modelo: element.modelo,
          marca: element.marca,
          color: element.color
        },
        ruta: {
          nombre_ruta: element.nombre_ruta,
          salida: element.salida,
          llegada: element.llegada
        },
        estado_viaje: element.estado_viaje,
        disponibilidad,
        fecha,
        precio: element.precio
      };
    }));    
    viajes.value = viajesTransformados.filter(v => v);        
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
    viajes.value = [];
  }
};

const cancelarViaje = async (id_viaje, id_conductor) => {
  try {    
    await axios.delete(`http://localhost:3000/pasajeros/cancelar`, {
      params: { id_usuario: authStore.user.id,
        id_viaje
       }
    });    
    await axios.post('http://localhost:3000/ntf/crear', {
      id_usuario: id_conductor,
      titulo_ntf: `Usuario canceló viaje`,
      mensaje_ntf: `El usuario ${authStore.user.nombre} ha cancelado su ruta.`
    });    
    misViajes();
  } catch (error) {
    console.error('Error cancelando el viaje:', error);
  }
};

function tiempoRestante(fechaStr) {
  const [fecha, hora] = fechaStr.split(' ');
  const [dia, mes, año] = fecha.split('/');
  const [h, m] = hora.split(':');
  const fechaViaje = new Date(`${año}-${mes}-${dia}T${h}:${m}:00`);
  const ahora = new Date();
  const diffMs = fechaViaje - ahora;
  if (diffMs <= 0) return 'Ya inició';
  const diffMin = Math.floor(diffMs / 60000);
  const horas = Math.floor(diffMin / 60);
  const minutos = diffMin % 60;
  if (horas > 0) {
    return `En ${horas}h ${minutos}min`;
  } else {
    return `En ${minutos}min`;
  }
}

</script>

