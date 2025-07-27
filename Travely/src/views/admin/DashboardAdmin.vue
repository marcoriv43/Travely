<template>
    <section class="pr-4">
        <h2 class="text-center text-3xl py-6">Dashboard de Admin</h2>
            <div class="pb-2">  
                <button class="btn-dark" @click="viajesPanel()">Ir al panel de Viajes</button> 
            </div>
            <div class="p-4 border shadow-[0_2px_4px_rgba(0,0,0,0.1)] rounded-lg border-solid border-[#ddd]">
                <h3 class="text-center text-xl pb-4">Panel de usuarios</h3>   
                <form @submit.prevent="buscar" class="form">
                    <input type="text" v-model="busqueda" placeholder="Buscar usuario por nombre o email"/>
                    <button class="btn-dark" type="submit">Buscar</button>                    
                </form>
                <div class="pt-2">
                    <button class="btn-primary w-full" @click="cargarUsuarios">Limpiar</button>
                </div>
            </div>
            <div class=" w-full mt-4 overflow-x-auto p-4 border shadow-[0_2px_4px_rgba(0,0,0,0.1)] rounded-lg border-solid border-[#ddd]">
            <div v-if="usuarios.length === 0" class="no-usuarios">
                <p>{{ mensajeCambio }}</p>
            </div>
            <table v-else class="w-full min-w-[700px] border-collapse">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Sexo</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(usuario, idx) in usuarios" :key="idx">
                        <td>{{ usuario.id }}</td>
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.email }}</td>
                        <td>{{ usuario.sexo }}</td>
                        <td>{{ usuario.tipo }}</td>
                        <td>{{ usuario.estado }}</td>
                        <td>
                            <button class="btn-red" v-if="usuario.estado === 'activo'" @click="cambiarEstado(usuario.id, 'inactivo')">Bloquear</button>
                            <button class="btn-green w-full" v-else @click="cambiarEstado(usuario.id, 'activo')">Activar</button>
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

const router = useRouter();
const authStore = useAuthStore();
const viajesPanel = () => router.push('/dashboard/vpanel');

onMounted(() => {
  cargarUsuarios();  
});

const usuarios = ref([]);
const mensajeCambio = ref('No hay usuarios registrados.');

const cargarUsuarios = async () => {
    mensajeCambio.value = 'No hay usuarios registrados.';
    busqueda.value = '';
    try {
        const response = await axios.get('http://localhost:3000/admin/usuarios',{
            params: { id_usuario: authStore.user.id }
        });
        usuarios.value = response.data;
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
};

const busqueda = ref('');
const buscar = async () => {
    mensajeCambio.value = 'No se encontraron usuarios con los valores indicados.';
    try {        
        const response = await axios.get('http://localhost:3000/admin/buscar', {
            params:{busqueda: busqueda.value}
        });
        usuarios.value = response.data;
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
    }
};

const cambiarEstado = async (id, nuevoEstado) => {
  try {        
    await axios.put(`http://localhost:3000/admin/cambio`, {
      id: id,
      estado: nuevoEstado
    });
    cargarUsuarios();
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
  }
};

</script>

<style scoped>
.tabla-usuarios {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.tabla-usuarios th, .tabla-usuarios td {
  border: 1px solid #ccc;
  padding: 0.5rem 0.7rem;
  text-align: left;
}
.tabla-usuarios th button {
  background: none;
  border: none;
  color: #2e7d32;
  font-weight: bold;
  cursor: pointer;
}
.tabla-usuarios th button:focus {
  outline: 2px solid #2e7d32;
}
</style>