<template>
<div class="w-screen h-screen flex flex-col md:flex-row">
  <div class="hidden md:flex w-full md:w-1/2 h-1/3 md:h-full items-center justify-center">
    <img class="object-cover w-full h-full max-h-full" src="../assets/imglogin.png" alt="">
  </div>
  <div class="w-full md:w-1/2 flex p-11 items-center justify-center">
      <div class="max-w-[350px] w-full border bg-[rgba(177,154,205,1)] mx-auto p-5 rounded-[5px] border-solid border-[#ccc]">
        <h2 class="text-3xl text-center pb-2">Registro</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-[15px]">
            <label class="block mb-[5px]" for="nombre">Nombre:</label>
            <input class="w-full box-border p-2 bg-white rounded-[5px]" type="text" id="nombre" v-model="nombre" required>
          </div>
          <div class="mb-[15px]">
            <label class="block mb-[5px]" for="email">Email:</label>
            <input class="w-full box-border p-2 bg-white rounded-[5px]" type="email" id="email" v-model="email" required>
          </div>
          <div class="mb-[15px]">
            <label for="password">Contraseña:</label>
            <input class="w-full box-border p-2 bg-white rounded-[5px]" type="password" id="password" v-model="password" required>
          </div>
          <div class="mb-[15px]">
            <label class="block mb-[5px]" for="tipo">Tipo de usuario:</label>
            <select class="w-full box-border p-2 bg-white rounded-[5px]" id="tipo" v-model="tipo" required>
              <option value="pasajero">Pasajero</option>
              <option value="conductor">Conductor</option>
            </select>
          </div>
          <div class="mb-[15px]">
            <label class="block mb-[5px]" for="sexo">Sexo:</label>
            <select class="w-full box-border p-2 bg-white rounded-[5px]" id="sexo" v-model="sexo" required>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <button class="btn-dark" type="submit" :disabled="loading">
            {{ loading ? 'Cargando...' : 'Registrarse' }}
          </button>
          <p v-if="error" class="error">{{ error }}</p>
          <p v-if="success" class="success">{{ success }}</p>
        </form>
        <p class="pt-3">¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const nombre = ref('');
const email = ref('');
const password = ref('');
const tipo = ref('');
const sexo = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    await authStore.register({
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      tipo: tipo.value,
      sexo: sexo.value,
      estado: 'activo'
    });
    
    success.value = 'Registro exitoso. Redirigiendo...';
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (err) {
    error.value = err.error || 'Error al registrarse';
  } finally {
    loading.value = false;
  }
};
</script>