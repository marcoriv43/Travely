<template>
    <div class=" w-screen p-50 flex items-center justify-items-center">
      <div className="max-w-[700px] max-h-[700px] border bg-[rgba(177,154,205,1)] mx-auto my-0 p-5 rounded-[5px] border-solid border-[#ccc]">
        <div class="pb-2">
          <h2 class="text-3xl text-center">Iniciar Sesión</h2>
        </div>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class=" block mb-[5px]" for="email">Email:</label>
              <input class="w-full box-border p-2 bg-white rounded-[5px]" type="email" id="email" v-model="email" required>
            </div>
            <div class="form-group">
              <label class=" block mb-[5px]" for="password">Contraseña:</label>
              <input class="w-full box-border p-2  bg-white rounded-[5px]" type="password" id="password" v-model="password" required>
            </div>
            <div class="form-group">
            <button class="btn-dark" type="submit" :disabled="loading">
              {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
            </button>
            </div>
            <p v-if="error" class="error">{{ error }}</p>
          </form>
        <p>¿No tienes una cuenta? <router-link to="/register">Regístrate</router-link></p>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.login({
      email: email.value,
      password: password.value
    });
    router.push('/dashboard');
  } catch (err) {
    error.value = err.error || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>
