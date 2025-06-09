<template>
  <div class="register-container">
    <h2>Registro</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="nombre" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="tipo">Tipo de usuario:</label>
        <select id="tipo" v-model="tipo" required>
          <option value="pasajero">Pasajero</option>
          <option value="conductor">Conductor</option>
        </select>
      </div>
        <div class="form-group">
        <label for="sexo">Sexo:</label>
        <select id="sexo" v-model="sexo" required>
          <option value="masculino">Maculino</option>
          <option value="femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Registrarse' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </form>
    <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const nombre = ref('');
const email = ref('');
const password = ref('');
const tipo = ref('pasajero');
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
      sexo: sexo.value
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

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: rgba(177, 154, 205, 1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  background-color: #000;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>