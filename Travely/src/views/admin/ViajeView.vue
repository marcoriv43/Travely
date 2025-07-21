<template>
  <section class="ViajeView">
        <h2>Dashboard de Admin</h2>
        <h3>Panel de viajes</h3>        
        <button @click="usuariosPanel">Ir al panel de usuarios</button>   
    <div class="historial">
      <div v-if="viajes.length === 0" class="no-viajes">
        <p>No tienes viajes registrados.</p>
        <p>Encuentra conductores disponibles cerca de ti.</p>
        <button @click="buscarViaje">Buscar Viajes</button>
      </div>
      <table v-else class="tabla-historial">
        <thead>
          <tr>
            <th><button @click="ordenarPor('descripcion')">Descripción</button></th>
            <th><button @click="ordenarPor('nombre_conductor')">Conductor</button></th>
            <th colspan="2"><button @click="ordenarPor('vehiculo')">vehiculo</button></th>
            <th colspan="2"><button @click="ordenarPor('ruta')">Ruta</button></th>
            <th colspan="2"><button @click="ordenarPor('fecha')">Fecha y Hora</button></th>            
            <th><button @click="ordenarPor('precio')">Precio</button></th>
            <th><button @click="ordenarPor('estado')">Estado</button></th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(viaje, idx) in viajes" :key="idx">
            <td>{{ viaje.descripcion }}</td>
            <td>{{ viaje.conductor.nombre_conductor }}</td>
            <td colspan="2">{{ viaje.vehiculo.tipo_vehiculo }}-{{ viaje.vehiculo.modelo }}-{{ viaje.vehiculo.marca }}-{{ viaje.vehiculo.color }}</td>
            <td colspan="2">{{ viaje.ruta.nombre_ruta }} ({{ viaje.ruta.salida }}-{{ viaje.ruta.llegada }})</td>
            <td colspan="2">{{ viaje.fecha }}</td>
            <td>${{ viaje.precio }}</td>
            <td>{{ viaje.estado }}</td>
            <td>
              <button v-if="viaje.estado === 'programado'" @click="cambiarEstado(viaje.id_viaje, 'cancelado')">Cancelar</button>
              <button v-if="viaje.estado === 'cancelado'" @click="cambiarEstado(viaje.id_viaje, 'programado')">Reactivar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';
import axios from 'axios';

onMounted(() => {
  todosViajes();
});

const router = useRouter();
const authStore = useAuthStore();
const usuariosPanel = () => router.push('/dashboard');

const viajes = ref([]);
const orden = ref({ campo: '', asc: true });

function ordenarPor(campo) {
  if (orden.value.campo === campo) {
    orden.value.asc = !orden.value.asc;
  } else {
    orden.value.campo = campo;
    orden.value.asc = true;
  }
  viajes.value.sort((a, b) => {
    let valA, valB;
    if (campo === 'vehiculo') {
      valA = `${a.vehiculo.tipo_vehiculo} ${a.vehiculo.modelo} ${a.vehiculo.marca} ${a.vehiculo.color}`;
      valB = `${b.vehiculo.tipo_vehiculo} ${b.vehiculo.modelo} ${b.vehiculo.marca} ${b.vehiculo.color}`;
    } else if (campo === 'ruta') {
      valA = `${a.ruta.nombre_ruta} ${a.ruta.salida} ${a.ruta.llegada}`;
      valB = `${b.ruta.nombre_ruta} ${b.ruta.salida} ${b.ruta.llegada}`;
    } else if (campo === 'fecha') {
      const parseFecha = (f) => {
        if (!f) return new Date(0);
        const [d, m, yhm] = f.split('/');
        const [y, hm] = yhm.split(' ');
        const [h, min] = hm.split(':');
        return new Date(`${y}-${m}-${d}T${h}:${min}`);
      };
      valA = parseFecha(a.fecha);
      valB = parseFecha(b.fecha);
    } else if (campo in a.vehiculo) {
      valA = a.vehiculo[campo];
      valB = b.vehiculo[campo];
    } else if (campo in a.ruta) {
      valA = a.ruta[campo];
      valB = b.ruta[campo];
    } else {
      valA = a[campo];
      valB = b[campo];
    }
    if (typeof valA === 'string' && campo !== 'fecha') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return orden.value.asc ? -1 : 1;
    if (valA > valB) return orden.value.asc ? 1 : -1;
    return 0;
  });
}

const todosViajes = async () => {
  try {    
    const response = await axios.get('http://localhost:3000/admin/viajes');
    let historial = response.data;    
    let viajesTransformados = [];
    historial.forEach(element => {
      let fecha = '';
      let fechaObj;
      if (element.inicia_el && element.inicia_a) {
        fechaObj = new Date(element.inicia_el);
        const [hora, minuto] = element.inicia_a.split(":");
        fechaObj.setHours(hora, minuto);
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
        const año = fechaObj.getFullYear();
        const horaStr = String(hora).padStart(2, '0');
        const minStr = String(minuto).padStart(2, '0');
        fecha = `${dia}/${mes}/${año} ${horaStr}:${minStr}`;
      }
      viajesTransformados.push({
        id_viaje: element.id_viaje,
        descripcion: element.descripcion,
        conductor: {
          nombre_conductor: element.nombre,
          email: element.email,
          sexo: element.sexo
        },
        vehiculo: {
          tipo_vehiculo: element.tipo_vehiculo,
          modelo: element.modelo,
          marca: element.marca,
          color: element.color,
          capacidad: element.capacidad
        },
        ruta: {
          nombre_ruta: element.nombre_ruta,
          salida: element.salida,
          llegada: element.llegada
        },
        fecha,
        estado: element.estado_viaje,
        precio: element.precio
      });
    });
    viajes.value = viajesTransformados;
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
  }
};

const cambiarEstado = async (id, nuevoEstado) => {
  try {        
    await axios.put(`http://localhost:3000/admin/cambio-v`, {
      id: id,
      estado: nuevoEstado
    });
    todosViajes();
  } catch (error) {
    console.error('Error al cambiar el estado del viaje:', error);
  }
};
</script>

<style scoped>
.tabla-historial {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.tabla-historial th, .tabla-historial td {
  border: 1px solid #ccc;
  padding: 0.5rem 0.7rem;
  text-align: left;
}
.tabla-historial th button {
  background: none;
  border: none;
  color: #2e7d32;
  font-weight: bold;
  cursor: pointer;
}
.tabla-historial th button:focus {
  outline: 2px solid #2e7d32;
}
</style>
