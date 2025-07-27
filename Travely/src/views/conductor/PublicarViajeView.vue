<template>
  <section class="publicar pr-3.5">
    <h2 class="text-center text-3xl py-6">Publicar viaje</h2>

    <div class="w-full flex flex-col items-center justify-center">

      <div class="max-w-[800px] w-full border bg-[rgba(177,154,205,1)] mx-auto p-5 rounded-[5px] border-solid border-[#ccc]" >
        <form @submit.prevent="publicar" class="form">
          <label class="text-lg block mb-[5px]">
            Descripcion<input class="w-full box-border p-2 bg-white rounded-[5px]" v-model="nuevo.descripcion" required />
          </label>

          <label class="text-lg">
            Selecciona un vehículo
            <div class="py-2" >
              <template class="" v-if="vehiculos.length > 0">
                <select class="w-full box-border p-2 bg-white rounded-[5px]" v-model="nuevo.vehiculo_id" required>
                  <option disabled value="">Seleccione</option>
                  <option v-for="v in vehiculos" :key="v.id_vehiculo || v.tipo_vehiculo || v.modelo || v.marca || v.color || v.capacidad":value="v.id_vehiculo || v.tipo_vehiculo || v.modelo || v.marca || v.color || v.capacidad">
                    {{v.tipo_vehiculo}} {{v.modelo}} {{v.marca}} {{v.color}} (Capacidad: {{ v.capacidad }})
                  </option>
                </select>
              </template>
              <template v-else>
                <span style="color:#b00;">No hay vehículos registrados</span>
              </template>
            </div>
              <button class="btn-dark2 pt-2" type="button" @click="abrirModalVehiculo">Agregar vehículo</button>
            </label>

          <label class="text-lg">
            Ruta
            <div class="py-2" >
            <template v-if="rutas.length > 0">
              <select class="w-full box-border p-2 bg-white rounded-[5px]" v-model="nuevo.ruta_id" required>
                <option disabled value="">Seleccione</option>
                <option v-for="r in rutas" :key="r.id_ruta || r.nombre_ruta || r.salida || r.llegada" :value="r.id_ruta || r.nombre_ruta || r.salida || r.llegada">
                  {{ r.nombre_ruta }} ({{ r.salida }} - {{ r.llegada }})
                </option>
              </select>
            </template>
            <template v-else>
              <span style="color:#b00;">No hay rutas registradas</span>                      
            </template>
            </div>
            <button class="btn-dark2" type="button" @click="abrirModalRuta">Agregar ruta</button>
          </label>

          <label class="text-lg">
            Fecha de inicio
            <div class="py-2">       
            <button type="button" class="btn-dark2 w-full" :class="{ hoy: nuevo.disponibleHoy }" @click="disponibleHoyBtn">
              {{ nuevo.disponibleHoy ? 'Disponible HOY ✅' : 'Disponible hoy' }}
            </button>
            </div> 
            <div style="display: flex; gap: 1rem; align-items: center;">
              <input type="date" v-model="nuevo.inicia_el" :disabled="nuevo.disponibleHoy" :min="fechaHoy()" required>
              <input type="time" v-model="nuevo.inicia_a" required>
            </div>
          
          </label>

          <label class="text-lg">
            Precio ($)
            <input type="number" v-model.number="nuevo.precio" min="1" required />
          </label>
          <input type="hidden" v-model="nuevo.conductor_id"/>
          <div class="w-full " style="display: flex; gap: 1rem; align-items: center;">
            <div class="w-1/2">        
              <button class="btn-dark w-full" type="submit">
                Publicar
              </button>
            </div>
            <div class="w-1/2">
              <button class="btn-white w-full" @click="goHome" >Regresar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>

  <div v-if="cargando" class="modal-vista">
    <div class="modal-contenido">
      <h3>Registrando viaje...</h3>
      <p>Por favor espere.</p>
    </div>
  </div>
  
  <div v-if="modalVehiculo" class="modal-vista">
    <div class="min-w-[300px] shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-8 rounded-[10px] bg-white">
      <h3 class="text-center text-xl pb-2">Agregar vehículo</h3>
      <form @submit.prevent="registrarVehiculo">
        <label>Tipo<input v-model="vehiculoForm.tipo_vehiculo" required /></label>
        <label>Modelo<input v-model="vehiculoForm.modelo" required /></label>
        <label>Marca<input v-model="vehiculoForm.marca" required /></label>
        <label>Color<input v-model="vehiculoForm.color" required /></label>
        <label>Capacidad<input type="number" v-model.number="vehiculoForm.capacidad" min="1" max="25" required /></label>
        <div class="flex gap-4 justify-between pt-2" >
            <div>
              <button class="btn-red" type="button" @click="cerrarModalVehiculo">Cancelar</button>
            </div>
            <div>
              <button class="btn-green"type="submit">Guardar</button>
            </div>
        </div>
      </form>
    </div>
  </div>

  <div v-if="modalRuta" class="modal-vista">
    <div class="min-w-[300px] shadow-[0_2px_16px_rgba(0,0,0,0.2)] p-8 rounded-[10px] bg-white">
      <h3 class="text-center text-xl pb-2">Agregar Rutas</h3>
      <form @submit.prevent="registrarRuta">
        <label>Nombre<input v-model="rutaForm.nombre_ruta" required /></label>
        <label>Salida<input v-model="rutaForm.salida" required /></label>
        <label>Llegada<input v-model="rutaForm.llegada" required /></label>        
        <div class="flex gap-4 justify-between pt-2" >
            <div>
              <button class="btn-red" type="button" @click="cerrarModalRuta">Cancelar</button>
            </div>
            <div>
              <button class="btn-green"type="submit">Guardar</button>
            </div>
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

const goHome = () => router.push('/');

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

input, select {
  padding: .4rem .6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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


</style>
