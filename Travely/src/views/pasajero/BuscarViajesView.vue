<template>
  <section class="buscador">
    <h2>Buscar viaje</h2>
    <form @submit.prevent="buscar" class="form">
      <div class="row">
        <label>Lugar de ida
          <input v-model="form.origen" required />
        </label>

        <label>Lugar de recogida
          <input v-model="form.recogida" required />
        </label>
      </div>

      <div class="row">
        <label>Asientos
          <input type="number" v-model.number="form.asientos" min="1" required />
        </label>

        <label>Precio máximo ($)
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
          <th>Origen</th><th>Recogida</th><th>Destino</th>
          <th>Fecha</th><th>Asientos</th><th>Conductor</th><th>Precio $</th><th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in viajes" :key="v.id">
          <td>{{ v.origen }}</td>
          <td>{{ v.recogida }}</td>
          <td>{{ v.destino }}</td>
          <td>{{ formatear(v.fecha) }}</td>
          <td>{{ v.asientos }}</td>
          <td>{{ v.conductor }}</td>
          <td>{{ v.precio }}</td>
          <td>
            <button :disabled="v.asientos===0" @click="reservar(v)">
              Reservar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="buscado && !cargando">No se encontraron viajes.</p>
    <p v-if="cargando">Buscando viajes…</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';


const form = ref({
  origen:    '',
  recogida:  '',
  asientos:  1,
  precioMax: '',
  fecha:     '',
  hora:      '',
});


const viajes   = ref([]);
const cargando = ref(false);
const buscado  = ref(false);

const buscar = async () => {
  cargando.value = true;
  viajes.value   = [];
  // Envía los campos no vacíos como query‑params
  const params = Object.fromEntries(
    Object.entries(form.value).filter(([_, v]) => v !== '' && v !== null)
  );
  const { data } = await axios.get('/api/viajes', { params });
  viajes.value   = data;
  cargando.value = false;
  buscado.value  = true;
};

const reservar = async (v) => {
  await axios.post(`/api/viajes/${v.id}/reservar`);
  alert('¡Reserva exitosa!');
  buscar(); // refrescar cupos
};

const formatear = iso => new Date(iso).toLocaleString();
</script>

<style scoped>
.buscador { max-width:900px; margin:0 auto; }
.form { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
.row { display:flex; gap:1rem; flex-wrap:wrap; }
label { display:flex; flex-direction:column; flex:1; min-width:150px; }
input { padding:.4rem .6rem; border:1px solid #ccc; border-radius:4px; }
button { padding:.4rem .8rem; background:#111; color:#fff; border:0; border-radius:5px; cursor:pointer; }
.tabla { width:100%; border-collapse:collapse; }
.tabla th,.tabla td { border:1px solid #ddd; padding:.4rem; text-align:center; }
.tabla th { background:#f4f4f4; }
</style>
