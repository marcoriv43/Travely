<template>
    <h2 class="text-center text-3xl py-6" >Dashboard de Conductor</h2>
    <div class="w-screen h-48 max-h-full md:max-h-screen flex flex-col md:flex-row">        
        <div class=" p-4  md:w-1/4 md:pr-2 pr-10">
            <div class="card">
                <h3 class="text-xl">Ofertas de Viaje</h3>
                <p class="py-2">Publica un nuevo viaje disponible.</p>
                <button class="btn-primary" @click="publicarViaje">Publicar Viaje</button>
            </div>
            <div class="card">
                <h3 class="text-xl">Historial de Viajes</h3>
                <p class="py-2">Revisa tus viajes anteriores.</p>
                <button class="btn-primary" @click="verHistorial">Ver Viajes</button>
            </div>
        </div>
        <div class="md:w-3/4 p-4 pr-10">
          <div class="card">
            <div class="pb-1" >
              <h3 class="text-2xl py-2">Viajes Activos</h3>
            </div>
            <div v-if="viajes.length === 0" class="no-viajes ">
                <p class="">No tienes viajes publicados, publica un nuevo viaje.</p>
                <button class="btn-primary" @click="publicarViaje">Publicar Viaje</button>
            </div>
            <div v-else class="w-full mt-4 overflow-x-auto">
            <table  class="w-full min-w-[700px] border-collapse">
                <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Vehiculo</th>
                    <th>Disponibilidad</th>
                    <th>Ruta</th>
                    <th>Fecha y Hora</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(viaje, idx) in viajes" :key="idx">
                    <td>{{ viaje.descripcion }}</td>
                    <td>{{ viaje.vehiculo.tipo_vehiculo }} {{ viaje.vehiculo.color }}<br>({{ viaje.vehiculo.modelo }} - {{ viaje.vehiculo.marca }})</td>
                    <td>{{ viaje.disponibilidad }}</td>
                    <td>{{ viaje.ruta.nombre }}<br>({{ viaje.ruta.salida }} - {{ viaje.ruta.llegada }})</td>
                    <td>{{ viaje.fecha }}</td>                        
                    <td>${{ viaje.precio }}</td>
                    <td>{{ viaje.estado_viaje }}</td>
                    <td v-if="viaje.estado_viaje === 'programado'">
                      <button class="btn-green" @click="iniciarViaje(viaje.id_viaje)">Iniciar</button>
                      <button class="btn-red" @click="cancelarViaje(viaje.id_viaje)">Cancelar</button>
                    </td>
                    <td v-else>
                      <button class="btn-dark" @click="finalizarViaje(viaje.id_viaje)">Finalizar</button>
                    </td>
                </tr>
                </tbody>
            </table>
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

const verHistorial = () => router.push('/dashboard/historial-c');
const publicarViaje = () => router.push('/dashboard/publicar');

onMounted(() => {
  misViajes();
});

const viajes = ref([]);
let historial = ref([]);

const misViajes = async () => {
  try {
    let id_conductor = authStore.user.id;
    const response = await axios.get('http://localhost:3000/viajes', {
      params: { id_conductor }
    });
    historial = response.data;

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
        vehiculo: {
          tipo_vehiculo: element.tipo_vehiculo,
          modelo: element.modelo,
          marca: element.marca,
          color: element.color
        },
        ruta: {
          nombre: element.nombre_ruta,
          salida: element.salida,
          llegada: element.llegada
        },
        estado_viaje: element.estado_viaje,
        disponibilidad,
        fecha,
        precio: element.precio
      };
    }));

    viajes.value = viajesTransformados;
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
  }
};

const cancelarViaje = async (id_viaje) => {
  try {
    const pasajeroDisp = await axios.get('http://localhost:3000/viajes/disp', {
      params: { id_viaje: id_viaje }
    });
    await axios.patch(`http://localhost:3000/viajes/cambio`,{
      id_viaje,
      estado_viaje: 'cancelado'
    });
    misViajes();
    for (const pasajero of pasajeroDisp.data) {      
      await axios.post('http://localhost:3000/ntf/crear', {
        id_usuario: pasajero.id_pasajero1,
        titulo_ntf: `Viaje cancelado`,
        mensaje_ntf: `El viaje con el conductor ${authStore.user.nombre} ha sido cancelado.`
      });
    }
  } catch (error) {
    console.error('Error cancelando el viaje:', error);
    alert('Hubo un error al cancelar el viaje. Por favor, inténtelo nuevamente.');
  }
};

const iniciarViaje = async (id_viaje) => {
  try {
    await axios.patch(`http://localhost:3000/viajes/cambio`, {
      id_viaje,
      estado_viaje: 'en proceso'
    });
    misViajes();
    const pasajeroDisp = await axios.get('http://localhost:3000/viajes/disp', {
      params: { id_viaje: id_viaje }
    });
    for (const pasajero of pasajeroDisp.data) {      
      await axios.post('http://localhost:3000/ntf/crear', {
        id_usuario: pasajero.id_pasajero1,
        titulo_ntf: `Viaje iniciado`,
        mensaje_ntf: `El viaje con el conductor ${authStore.user.nombre} ha comenzado.`
      });
    }
  } catch (error) {
    console.error('Error iniciando el viaje:', error);
    alert('Hubo un error al iniciar el viaje. Por favor, inténtelo nuevamente.');
  }
};

const finalizarViaje = async (id_viaje) => {
  try {
    await axios.patch(`http://localhost:3000/viajes/cambio`, {
      id_viaje,
      estado_viaje: 'finalizado'
    });
    misViajes();
    const pasajeroDisp = await axios.get('http://localhost:3000/viajes/disp', {
      params: { id_viaje: id_viaje }
    });
    for (const pasajero of pasajeroDisp.data) {      
      await axios.post('http://localhost:3000/ntf/crear', {
        id_usuario: pasajero.id_pasajero1,
        titulo_ntf: `Viaje finalizado`,
        mensaje_ntf: `El viaje con el conductor ${authStore.user.nombre} ha finalizado.`
      });
    }
  } catch (error) {
    console.error('Error finalizando el viaje:', error);
    alert('Hubo un error al finalizar el viaje. Por favor, inténtelo nuevamente.');
  }
};

</script>