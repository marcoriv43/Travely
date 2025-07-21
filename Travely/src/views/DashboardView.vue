<template>
  <div class="max-w-screen max-h-screen">
 
    <header class="h-20 flex">
      <img src="/travely.png" alt="" style="cursor:pointer;" @click="goHome" class="w-[70px] pt-[5px] pb-0 px-[5px] "/>
      <h1 class="text-2xl">Bienvenido, {{ nombreUsuario }}</h1>
      <button @click="historialNtf">Notificaciones</button>
      <button @click="logout" class="btn-dark ">Cerrar Sesión</button>
    </header>
    
    <div class="w-screen maxh-screen h-full p-1.5 flex-auto">
        <main class="content">
          <router-view />
        </main>
    </div>
  

    <div id="ntfUbicacion" class="aviso-contenedor"></div>

        <footer class="max-w-full max-h-100 relative overflow-hidden bg-[rgba(177,154,205,1)]">
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
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                    </svg>
                                </a>
                                <a href="#" class="glass-effect p-3 rounded-full hover-glow transition-all duration-300 group">
                                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                    </svg>
                                </a>
                                <a href="#" class="glass-effect p-3 rounded-full hover-glow transition-all duration-300 group">
                                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="#" class="glass-effect p-3 rounded-full hover-glow transition-all duration-300 group">
                                    <svg class="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.219 0 .359.179.359.399 0 .219-.140.359-.140.578-.219.937.662 1.797 1.797 1.797 2.156 0 3.847-2.277 3.847-5.595 0-2.919-2.156-4.957-5.256-4.957-3.598 0-5.595 2.697-5.595 5.476 0 1.083.415 2.24.934 2.876.103.119.117.224.086.345-.092.388-.298 1.202-.337 1.371-.051.219-.172.265-.396.159-1.488-.694-2.416-2.876-2.416-4.618 0-3.797 2.756-7.282 7.939-7.282 4.178 0 7.42 2.977 7.42 6.944 0 4.139-2.607 7.462-6.233 7.462-1.219 0-2.357-.636-2.748-1.396 0 0-.599 2.277-.744 2.836-.269 1.023-1.002 2.301-1.490 3.085 1.123.345 2.306.524 3.527.524 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
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
                            <div class="flex space-x-6 text-sm ">
                                <a href="#" class="text-yellow hover:text-white transition-colors">Política de Privacidad</a>
                                <a href="#" class="text-gray-200 hover:text-white transition-colors">Términos de Uso</a>
                                <a href="#" class="text-gray-200 hover:text-white transition-colors">Cookies</a>
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
    rutas.value = [];
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
    rutas.value = [];
  }
};
</script>

