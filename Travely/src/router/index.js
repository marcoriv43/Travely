import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import BuscarViajesView from '../views/pasajero/BuscarViajesView.vue';
import DashboardHome from '../views/pasajero/DashboardHome.vue';
import PublicarViajeView from '../views/conductor/PublicarViajeView.vue'
import { useAuthStore } from '../stores/auth';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login', 
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
   

{
  path: '/dashboard',
  component: DashboardView,
  meta: { requiresAuth: true },
  children: [
    { path: '', component: DashboardHome },
    { path: 'buscar', component: BuscarViajesView },
    { path:'publicar', component: PublicarViajeView},

  ],
}

  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;

