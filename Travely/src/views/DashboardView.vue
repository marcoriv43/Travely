<template>
  <div class="min-h-screen flex flex-col">
 
    <header class="h-20 w-screen  bg-[rgba(177,154,205,1)] flex justify-between items-center">
        <div class="p-2">
            <img src="/travely.png" style="cursor:pointer;" @click="goHome" class="w-[70px] pt-[0px] pb-0 px-[5px] "/>
        </div>
      <h1 class="text-2xl">Bienvenido, {{ nombreUsuario }}</h1>
      
    <div class="flex">
      <button @click="historialNtf" class="flex items-center gap-2 cursor-pointer text-black px-4 py-2 rounded-md border-0 bg-white">
        <img src="/notificacion.png" alt="Notificaciones" class="w-6 h-6" />
        Notificaciones
      </button>
    </div>
      <div class="p-6">
        <button @click="logout" class="btn-dark">Cerrar Sesión</button> 
      </div>
      
    </header>
    

        <main class="min-w-screen min-h-screen h-[2000px] p-1.5 flex-auto">
          <router-view />
        </main>

  

    <div id="ntfUbicacion" class="aviso-contenedor"></div>

        <footer class="w-screen h-auto relative overflow-hidden bg-[rgba(177,154,205,1)]">
            <!-- Fondo con gradiente -->
            <div class="">
                <!-- Formas decorativas de fondo -->
              <div class="absolute inset-0 overflow-hidden">
                    <div class="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full float"></div>
                    <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-300 opacity-20 rounded-full pulse-slow"></div>
                    <div class="absolute top-20 left-1/4 w-32 h-32 bg-blue-300 opacity-15 rounded-full float" style="animation-delay: -2s;"></div>
                </div>

                <div class="relative z-10  mx-auto px-4 py-8">
                    <!-- Contenido principal del footer -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8  pb-8 ">
                        
                        <!-- Columna 1: Logo y descripción -->
                        <div class="lg:col-span-2 w-2/4">
                            <div class="mb-6 pl-8">
                                <h3 class="text-3xl font-bold text-white mb-4 float">Travely</h3>
                                <p class="text-gray-200 text-lg leading-relaxed max-w-md">
                                    Somos una empresa que te ayuda a conseguir viajes de forma rapida y segura, en el estado Trujiilo.
                                </p>
                            </div>
                            
                            <!-- Redes sociales -->
                            <div class="flex space-x-4 pl-8">
                                <a href="#" class="glass-effect p-3 rounded-full hover-glow transition-all duration-300 group">
                                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                                    </svg>
                                </a>
                                <a href="#" class="glass-effect p-3 rounded-full hover-glow transition-all duration-300 group">
                                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
                                    </svg>
                                </a>
                                <a href="https://github.com/marcoriv43/Travely"  class="glass-effect p-3 rounded-full hover-glow transition-all duration-300 group">
                                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.583 0-.288-.01-1.05-.016-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.104.823 2.226 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                </a>

                            </div>
                        </div>

                        <!-- Columna 3: Contacto -->
                        <div class="w-2/4 pl-8">
                            <h4 class="text-2xl font-semibold text-white mb-6">Contacto</h4>
                            <div class="space-y-4 text-gray-200">
                                <div class="flex items-center space-x-3">
                                    <div class="glass-effect p-2 rounded-lg">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                        </svg>
                                    </div>
                                    <span>info@travely.com</span>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <div class="glass-effect p-2 rounded-lg">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                        </svg>
                                    </div>
                                    <span>+58 0412 123-4567</span>
                                </div>
                                <div class="flex items-start space-x-3">
                                    <div class="glass-effect p-2 rounded-lg">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                    <span>Av. Bolivar<br>Valera, Trujillo, Venezuela 3101</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-white/20 pt-8">
                        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p class="text-gray-200 text-center md:text-left">
                                © 2024 Mi Empresa. Todos los derechos reservados.
                            </p>
                            <div class="flex space-x-6 text-sm pr-4">
                                <a href="#" class="text-black hover:text-white transition-colors">Política de Privacidad</a>
                                <a href="#" class="text-black hover:text-white transition-colors">Términos de Uso</a>
                                <a href="#" class="text-black hover:text-white transition-colors">Cookies</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';
import axios from 'axios';



const authStore = useAuthStore();
const router    = useRouter();

const goHome = () => router.push('/');
const historialNtf = () => router.push('/dashboard/notificaciones');
const nombreUsuario = authStore.user.nombre;

const logout = () => {
  authStore.logout();
  router.push('/');
}

onMounted(() => {
  revisarNtf();
})

const ntf = ref(false);
const contenidoNtf = ref([]);

const revisarNtf = async () => {
  try {
    const response = await axios.get('http://localhost:3000/ntf', 
      { params: { id_usuario: authStore.user.id } }
    );
    contenidoNtf.value = response.data;
    contenidoNtf.value.forEach(crearAviso);
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
  }
};

const crearAviso = (notificacion) => {
  const avisoContenido = document.createElement('div');
  avisoContenido.className = 'modal-ntf';
  avisoContenido.id = `aviso-n-${notificacion.id_ntf + 1}`;

  const cerrarBtn = document.createElement('button');
  cerrarBtn.textContent = 'X';
  cerrarBtn.onclick = () => removeAlert(notificacion.id_ntf);

  const contenidoDiv = document.createElement('div');
  contenidoDiv.className = 'modal-contenido';

  const titulo = document.createElement('h3');
  titulo.textContent = notificacion.titulo_nft || 'No Title';

  const mensaje = document.createElement('p');
  mensaje.textContent = notificacion.mensaje_ntf || 'No Message';

  contenidoDiv.appendChild(cerrarBtn);
  contenidoDiv.appendChild(titulo);
  contenidoDiv.appendChild(mensaje);

  avisoContenido.appendChild(contenidoDiv);

  document.getElementById('ntfUbicacion').appendChild(avisoContenido);
};

const removeAlert = async (id) => {
  const alertElement = document.getElementById(`aviso-n-${id + 1}`);
  if (alertElement) {
    alertElement.remove();
    ntf.value = false;
  }
  try {        
    const response = await axios.put('http://localhost:3000/ntf/cambio', {
      id: id,
      estado: 'visto'
    });    
  } catch (error) {
    console.error('Error obteniendo datos del servidor:', error);
  }
};
</script>

