import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  
  const isAuthenticated = computed(() => !!token.value);
  const userType = computed(() => user.value?.tipo);
  
  async function register({ nombre, email, password, tipo, sexo, estado }) {
    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        nombre,
        email,
        password,
        tipo,
        sexo,
        estado
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  async function login({ email, password }) {
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });
      
      token.value = response.data.token;
      user.value = response.data.user;
      
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
  
  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }
  

  function initialize() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  }
  
  return {
    user,
    token,
    isAuthenticated,
    userType,
    register,
    login,
    logout,
    initialize
  };
});