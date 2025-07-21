import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import DashboardAdmin from '../views/admin/DashboardAdmin.vue';
import PanelViajesAdmin from '../views/admin/ViajeView.vue';
import DashboardConductor from '../views/conductor/DashboardConductor.vue';
import PublicarViajeView from '../views/conductor/PublicarViajeView.vue';
import HistorialViajeView from '../views/conductor/HistorialViajeView.vue';
import DashboardPasajero from '../views/pasajero/DashboardPasajero.vue';
import BuscarViajesView from '../views/pasajero/BuscarViajesView.vue';
import HistorialPasajeroView from '../views/pasajero/HistorialViajeView.vue';
import NotificacionesView from '../views/NotificacionesView.vue';
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
        { path: 'admin', component: DashboardAdmin, meta: { roles: ['admin'] } },
        { path: 'vpanel', component: PanelViajesAdmin, meta: { roles: ['admin'] } },
        { path: 'conductor', component: DashboardConductor, meta: { roles: ['conductor'] } },
        { path: 'pasajero', component: DashboardPasajero, meta: { roles: ['pasajero'] } },
        { path: 'historial-c', component: HistorialViajeView, meta: { roles: ['conductor'] } },
        { path: 'publicar', component: PublicarViajeView, meta: { roles: ['conductor'] } },
        { path: 'buscar', component: BuscarViajesView, meta: { roles: ['pasajero'] } },
        { path: 'historial', component: HistorialPasajeroView, meta: { roles: ['pasajero'] } },
        { path: 'notificaciones', component: NotificacionesView, meta: { roles: ['pasajero', 'conductor', 'admin'] } }
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
  } else if (to.path === '/dashboard') {
    const tipo = authStore.user?.tipo;
    if (tipo === 'admin') {
      next('/dashboard/admin');
    } else if (tipo === 'conductor') {
      next('/dashboard/conductor');
    } else if (tipo === 'pasajero') {
      next('/dashboard/pasajero');
    } else {
      next();
    }
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.user?.tipo)) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;

