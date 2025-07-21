<template>
    <section class="ViajeView">
        <h2>Dashboard de Admin</h2>
        <div class="mitad-contenedor">
            <div class="mitad-contenedor">
                <h3>Panel de usuarios</h3>
                <button @click="viajesPanel()">Ir al panel de Viajes</button> 
            </div>                        
            <div class="mitad-contenedor">
                <form @submit.prevent="buscar" class="form">
                    <input type="text" v-model="busqueda" placeholder="Buscar usuario por nombre o email"/>
                    <button type="submit">Buscar</button>                    
                </form>
                <button @click="cargarUsuarios">Limpiar</button>
            </div>
            <div v-if="usuarios.length === 0" class="no-usuarios">
                <p>{{ mensajeCambio }}</p>
            </div>
            <table v-else class="tabla-usuarios">
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
                            <button v-if="usuario.estado === 'activo'" @click="cambiarEstado(usuario.id, 'inactivo')">Bloquear</button>
                            <button v-else @click="cambiarEstado(usuario.id, 'activo')">Activar</button>
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