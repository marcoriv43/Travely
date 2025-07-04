<template>
  <section class="buscador">
    <h2>Buscar viaje</h2>
    <form @submit.prevent="buscar" class="form">

       <div class="row">
        <label>Origen
          <select v-model="form.origen" required>
            <option disabled value="">Seleccione una opción</option>
            <option v-for="lugar in lugares" :key="lugar" :value="lugar">{{ lugar }}</option>
          </select>
        </label>

           <label>Recogida
          <select v-model="form.recogida" required>
            <option disabled value="">Seleccione una opción</option>
            <option v-for="lugar in lugares" :key="lugar" :value="lugar">{{ lugar }}</option>
          </select>
        </label>
      </div>

      <div class="row">
        <label>Asientos
          <input type="number" v-model.number="form.asientos" min="1" required />
        </label>

        <label>Pago ($)
          <input type="number" v-model.number="form.precioMax" min="1" />
        </label>
      </div>

      <div class="row">
        <label>Fecha
          <input type="date" v-model="form.fecha" required />
        </label>

        <label>Hora aproximada
          <input type="time" v-model="form.hora" />
        </label>
      </div>

      <button type="submit">Buscar</button>
    </form>

    <table v-if="viajes.length" class="tabla">
      <thead>
        <tr>
          <th>Origen</th>
          <th>Recogida</th>
          <th>Fecha</th>
          <th>Asientos</th>
          <th>Precio $</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in viajes" :key="v.id">
          <td>{{ v.origen }}</td>
          <td>{{ v.recogida }}</td>
          <td>{{ formatear(v.fecha) }}</td>
          <td>{{ v.asientos }}</td>
          <td>{{ v.precioMax }}</td>
          <td>
            <button :disabled="v.asientos === 0" @click="reservar(v)">
              Reservar
            </button>
          </td>
          <td>
            <button @click="eliminar(v.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="buscado && !viajes.length">No se encontraron viajes.</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const lugares = [
  'Valera',
  'Carvajal',
  'Centro-Valera',
  'Trujillo',
  'Contry',
  'La Beatriz',
  'Carmania'
];


const form = ref({
  origen: '', recogida: '', asientos: 1,
  precioMax: '', fecha: '', hora: ''
});

const viajes = ref([]);
const buscado = ref(false);
let autoId = 1;

const buscar = () => {
  viajes.value.push({ id: autoId++, ...form.value });
  buscado.value = true;
  form.value = { origen: '', recogida: '', asientos: 1, precioMax: '', fecha: '', hora: '' };
};

const reservar = (v) => {
  alert('¡Reservado!');
  // Aquí podrías agregar lógica extra si quieres
};

const eliminar = (id) => {
  viajes.value = viajes.value.filter(v => v.id !== id);
};

const formatear = (iso) =>
  iso ? iso.split('-').reverse().join('/') : '—';
</script>

<style scoped>
.buscador { max-width:900px; margin:0 auto; }
.form { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
.row { display:flex; gap:1rem; flex-wrap:wrap; }
label { display:flex; flex-direction:column; flex:1; min-width:150px; }
input { padding:.4rem .6rem; border:1px solid #ccc; border-radius:4px; }
button { padding:.4rem .8rem; background:#111; color:#fff; border:0; border-radius:5px; cursor:pointer; }
.tabla { width:100%; border-collapse:collapse; }
.tabla th, .tabla td { border:1px solid #ddd; padding:.4rem; text-align:center; }
.tabla th { background:#f4f4f4; }
</style>
