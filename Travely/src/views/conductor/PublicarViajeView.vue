<template>
  <section class="publicar">
    <h2>Publicar viaje</h2>

    <form @submit.prevent="publicar" class="form">
      <label>
        Descripcion<input v-model="nuevo.descripcion" required />
      </label>

      <label>
        Selecciona un vehículo
          <template v-if="vehiculos.length > 0">
            <select v-model="nuevo.vehiculo_id" required>
              <option disabled value="">Seleccione</option>
              <option v-for="v in vehiculos" :key="v.id_vehiculo || v.tipo_vehiculo || v.modelo || v.marca || v.color || v.capacidad":value="v.id_vehiculo || v.tipo_vehiculo || v.modelo || v.marca || v.color || v.capacidad">
                {{v.tipo_vehiculo}} {{v.modelo}} {{v.marca}} {{v.color}} (Capacidad: {{ v.capacidad }})
              </option>
            </select>
          </template>
          <template v-else>
            <span style="color:#b00;">No hay vehículos registrados</span>
          </template>
          <button type="button" @click="abrirModalVehiculo">Agregar vehículo</button>
      </label>

      <label>
        Ruta
        <template v-if="rutas.length > 0">
          <select v-model="nuevo.ruta_id" required>
            <option disabled value="">Seleccione</option>
            <option v-for="r in rutas" :key="r.id_ruta || r.nombre_ruta || r.salida || r.llegada" :value="r.id_ruta || r.nombre_ruta || r.salida || r.llegada">
              {{ r.nombre_ruta }} ({{ r.salida }} - {{ r.llegada }})
            </option>
          </select>
        </template>
        <template v-else>
          <span style="color:#b00;">No hay rutas registradas</span>                      
        </template>
        <button type="button" @click="abrirModalRuta">Agregar ruta</button>
      </label>

      <label>
        Fecha de inicio        
        <button type="button" :class="{ hoy: nuevo.disponibleHoy }" @click="disponibleHoyBtn">
          {{ nuevo.disponibleHoy ? 'Disponible HOY ✅' : 'Disponible hoy' }}
        </button>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <input type="date" v-model="nuevo.inicia_el" :disabled="nuevo.disponibleHoy" :min="fechaHoy()" required>
          <input type="time" v-model="nuevo.inicia_a" required>
        </div>
      </label>

      <label>
        Precio ($)
        <input type="number" v-model.number="nuevo.precio" min="1" required />
      </label>
      <input type="hidden" v-model="nuevo.conductor_id"/>
      <div class="row">        
        <button type="submit">
          Publicar
        </button>
      </div>
    </form>
  </section>

  <div v-if="cargando" class="modal-vista">
    <div class="modal-contenido">
      <h3>Registrando viaje...</h3>
      <p>Por favor espere.</p>
    </div>
  </div>
  
  <div v-if="modalVehiculo" class="modal-vista">
    <div class="modal-contenido">
      <h3>Agregar vehículo</h3>
      <form @submit.prevent="registrarVehiculo">
        <label>Tipo<input v-model="vehiculoForm.tipo_vehiculo" required /></label>
        <label>Modelo<input v-model="vehiculoForm.modelo" required /></label>
        <label>Marca<input v-model="vehiculoForm.marca" required /></label>
        <label>Color<input v-model="vehiculoForm.color" required /></label>
        <label>Capacidad<input type="number" v-model.number="vehiculoForm.capacidad" min="1" max="25" required /></label>
        <div style="display:flex;gap:1rem;justify-content:flex-end;">
          <button class="cerrarBtn" type="button" @click="cerrarModalVehiculo">Cancelar</button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modalRuta" class="modal-vista">
    <div class="modal-contenido">
      <h3>Agregar Rutas</h3>
      <form @submit.prevent="registrarRuta">
        <label>Nombre<input v-model="rutaForm.nombre_ruta" required /></label>
        <label>Salida<input v-model="rutaForm.salida" required /></label>
        <label>Llegada<input v-model="rutaForm.llegada" required /></label>        
        <div style="display:flex;gap:1rem;justify-content:flex-end;">
          <button class="cerrarBtn" type="button" @click="cerrarModalRuta">Cancelar</button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();
const cargando = ref(false);

onMounted(() => {    
  vehiculosRegristrados();
  rutasRegistradas();
});

const nuevo = ref({
  descripcion: '',
  vehiculo_id: '',
  ruta_id: '',
  disponibleHoy: false,
  inicia_el: '',
  inicia_a: '',
  precio: 0,
  conductor_id: authStore.user.id
});

const publicar = async () => {
  cargando.value = true;
  try {
    const response = await axios.post('http://localhost:3000/viajes/register', nuevo.value);
    nuevo.value = {
      descripcion: '',
      vehiculo_id: '',
      ruta_id: '',      
      disponibleHoy: false,
      inicia_el: '',
      inicia_a: '',
      precio: 0,
    };
    setTimeout(() => {
      cargando.value = false;
      router.push('/dashboard');
    }, 800);
  } catch (error) {
    cargando.value = false;
    console.error('Error sending data to server:', error);
    alert('Hubo un error al publicar el viaje. Por favor, inténtelo nuevamente.');
  }
};

function fechaHoy() {
  const d = new Date();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function disponibleHoyBtn() {
  nuevo.value.disponibleHoy = !nuevo.value.disponibleHoy;
  if (nuevo.value.disponibleHoy) {
    nuevo.value.inicia_el = fechaHoy();
  }
}

const vehiculos = ref([]);
const modalVehiculo = ref(false);
const vehiculoForm = ref({ tipo_vehiculo: '', modelo: '', marca: '', color:'', capacidad: 1 });

const vehiculosRegristrados = async () => {
  try {
    const response = await axios.get('http://localhost:3000/viajes/vehiculos', {
      params: { conductor_id: authStore.user.id }
    });
    vehiculos.value = response.data;
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
    vehiculos.value = [];
  }
};

const abrirModalVehiculo = () => {
  vehiculoForm.value = { tipo_vehiculo: '', modelo: '', marca: '', color:'', capacidad: 1, usuario_id: authStore.user.id };
  modalVehiculo.value = true;
};
const cerrarModalVehiculo = () => {
  modalVehiculo.value = false;
};

const registrarVehiculo = async () => {
  try {
    const response = await axios.post('http://localhost:3000/viajes/nuevo-vehiculo', vehiculoForm.value);
    cerrarModalVehiculo();
    vehiculosRegristrados();

  } catch (error) {
    alert('Error al registrar vehículo: ' + error.message);
  }
};

const rutas = ref([]);
const modalRuta = ref(false);
const rutaForm = ref({ nombre_ruta: '', salida: '', llegada: '' });

const rutasRegistradas = async () => {
  try {
    const response = await axios.get('http://localhost:3000/viajes/rutas');
    rutas.value = response.data;
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
    rutas.value = [];
  }
};

const abrirModalRuta = () => {
  rutaForm.value = { nombre_ruta: '', salida: '', llegada: '' };
  modalRuta.value = true;
};
const cerrarModalRuta = () => {
  modalRuta.value = false;
};

const registrarRuta = async () => {
  try {
    const response = await axios.post('http://localhost:3000/viajes/nueva-ruta', rutaForm.value);
    cerrarModalRuta();
    rutasRegistradas();
  } catch (error) {
    alert('Error al registrar la ruta');
  }
};

</script>

<style scoped>
.publicar { max-width: 700px; margin: 0 auto; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.row  { display: flex; gap: 1rem; flex-wrap: wrap; }
label { display: flex; flex-direction: column; flex: 1; min-width: 150px; }
input, select {
  padding: .4rem .6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: .5rem 1rem;
  border: 0; cursor: pointer;
  border-radius: 6px;
  background: #111; color: #fff;
}
button.hoy { background: #2e7d32; }       /* verde cuando está activo */

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

.cerrarBtn {
  background: #f44336; 
  color: #fff; 
  border: none;
  padding-left: 100px;
}
</style>
