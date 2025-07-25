<template>
  <section class="buscador">
    <h2>Buscar viaje</h2>
    <div class="contenedor">
      <div class="cuarto-contenedor">
        <form @submit.prevent="buscar" class="form">
          <div v-if="rutas.length>0" class="row">
            <label>Ruta
              <select v-model="opcionesBuscar.id_ruta">
                <option disabled value="">Seleccione una opción</option>
                <option v-for="r in rutas" :key="r.id_ruta" :value="r.id_ruta">{{ r.salida }} - {{ r.llegada }}</option>
              </select>
            </label>          
          </div>
          <div v-else class="row">No existen rutas disponibles</div>
          <div class="row">
            <label>Asientos
              <input type="number" v-model="opcionesBuscar.asientos" min="1"/>
            </label>

            <label>Pago($)
              <input type="number" v-model="opcionesBuscar.pago" min="1"/>
            </label>
          </div>
          <div class="row">
            <label>Fecha
              <input type="date" v-model="opcionesBuscar.fecha" :min="fechaHoy()"/>
            </label>
            <br>
            <label>Hora aproximada
              <input type="time" v-model="opcionesBuscar.hora"/>
            </label>
          </div>
          <button type="submit">Buscar</button>          
        </form>
        <button @click="viajesActivos">Limpiar</button>
      </div>
      <div v-if="viajes.length === 0" class="resto-contenedor">
        <h3>No hay Viajes disponibles actualmente</h3>
        <p>{{ mensajeVariable }}</p>
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
              <li>Precio: ${{ viaje.precio }}</li>
              <li>Disponibilidad: {{ viaje.disponibilidad }} asientos</li>
            </ul>
            <button @click="reservarViaje(viaje.id_viaje, viaje.conductor.id_conductor)">Viajar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="cargando" class="modal-vista">
      <div class="modal-contenido">
        <h3>Registrando viaje...</h3>
        <p>Por favor espere.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();
const cargando = ref(false);
const mensajeVariable = ref('');

onMounted(() => {    
  viajesActivos();  
  rutasRegistradas();
});

const viajes = ref([]);
const opcionesBuscar = ref({
  id_ruta: '',
  asientos: 1,
  pago: 1,
  fecha: '',
  hora: ''
});

const viajesActivos = async () => {
  mensajeVariable.value = 'No se encontraron viajes. Espera a que los conductores esten trabajando. Y registren sus viajes.';
  try {
    const response = await axios.get('http://localhost:3000/pasajeros/inical');
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
      if (
        pasajeroDisp.data.length > 0 &&
        pasajeroDisp.data.some(p => p.id_pasajero1 === authStore.user.id)
      ) {
        return null;
      }
      disponibilidad = disponibilidad - pasajeroDisp.data.length;
      if (disponibilidad <= 0) {
        return null;
      }
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
    opcionesBuscar.value = {
      id_ruta: '',
      asientos: 1,
      pago: 1,
      fecha: '',
      hora: ''
    };
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
    viajes.value = [];
  }
};

const reservarViaje = async (id_viaje, id_conductor) => {
  cargando.value = true;
  try {
    const response = await axios.post('http://localhost:3000/pasajeros/reservar', {
      id_viaje,
      id_usuario: authStore.user.id
    });    
    setTimeout(async () => {      
      let ntfMensaje = await axios.post('http://localhost:3000/ntf/crear', {
        id_usuario: id_conductor,
        titulo_ntf: `Nuevo pasajero`,
        mensaje_ntf: `El pasajero ${authStore.user.nombre} ha reservado tu viaje.`
      });
      cargando.value = false;
      router.push('/');
    }, 400);        
  } catch (error) {
    console.error('Error reservando el viaje:', error);
  }
};

const buscar = async () => {
  mensajeVariable.value = 'No se encontraron viajes con las caracteristicas que especificaste.';
  try {
    const response = await axios.post('http://localhost:3000/pasajeros/buscador', opcionesBuscar.value);
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
      if (
        pasajeroDisp.data.length > 0 &&
        pasajeroDisp.data.some(p => p.id_pasajero1 === authStore.user.id)
      ) {
        return null;
      }
      disponibilidad = disponibilidad - pasajeroDisp.data.length;
      if (disponibilidad <= 0) {
        return null;
      }
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

function fechaHoy() {
  const d = new Date();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const rutas = ref([]);

const rutasRegistradas = async () => {
  try {
    const response = await axios.get('http://localhost:3000/pasajeros/rutas');
    rutas.value = response.data;
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

.modal-vista {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-contenido {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  min-width: 300px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
}
</style>
