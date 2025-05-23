import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/debug-events',
    name: 'DebugEvents',
    component: () => import('../pages/DebugEventsView.vue'),
    meta: { 
      requiresAuth: true,
      title: 'Debug Événements'
    }
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../pages/EventsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('../pages/EventDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/events/create',
    name: 'event-create',
    component: () => import('../pages/EventCreateView.vue'),
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: () => import('../pages/DoctorsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/laboratories',
    name: 'Laboratories',
    component: () => import('../pages/LaboratoriesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/compliance',
    name: 'Compliance',
    component: () => import('../pages/ComplianceView.vue'),
    meta: { requiresAuth: true, requiredRole: 'compliance_officer' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard with mock authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiredRole;
  
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  // Get user role if authenticated
  let userRole = '';
  if (isAuthenticated) {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userRole = user.role;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
    }
  }
  
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else if (requiredRole && requiredRole !== userRole) {
    alert('Vous n\'avez pas les permissions nécessaires pour accéder à cette page');
    next('/dashboard');
  } else {
    next();
  }
});

export default router;