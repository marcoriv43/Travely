<template>
    <h2 class="text-center text-3xl pb-4 " >Dashboard de Conductor</h2>
    <div class="flex flex-row">        
        <div class="w-1/4 p-5">
            <div class="card">
                <h3 class="text-xl">Ofertas de Viaje</h3>
                <p class="py-1">Publica un nuevo viaje disponible.</p>
                <button class="btn-dark" @click="publicarViaje">Publicar Viaje</button>
            </div>
            <div class="card">
                <h3 class="text-xl">Historial de Viajes</h3>
                <p class="py-1">Revisa tus viajes anteriores.</p>
                <button class="btn-dark" @click="verHistorial">Ver Viajes</button>
            </div>
        </div>
        <div class="w-3/4 p-4">
          <div class="card">
            <h3 class="text-xl">Viajes Activos</h3>
            <p class="py-1">Revisa tus viajes activos.</p>
            <div v-if="viajes.length === 0" class="no-viajes">
                <p class="pb-2">No tienes viajes publicados, publica un nuevo viaje disponible</p>
                <button class="btn-dark" @click="publicarViaje">Publicar Viaje</button>
            </div>
            <table v-else class="w-full">
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
                      <button @click="iniciarViaje(viaje.id_viaje)">Iniciar</button>
                      <button @click="cancelarViaje(viaje.id_viaje)">Cancelar</button>
                    </td>
                    <td v-else>
                      <button @click="finalizarViaje(viaje.id_viaje)">Finalizar</button>
                    </td>
                </tr>
                </tbody>
            </table>
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