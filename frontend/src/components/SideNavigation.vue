<template>
  <aside class="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">
    <!-- Icônes de navigation -->
    <nav class="flex flex-col items-center space-y-6 flex-1">
      <div v-for="(item, index) in navItems" :key="index">
        <router-link 
          :to="item.path"
          class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group"
          :class="{ 
            'text-[#2C2C7B] bg-[#6A7DFF]/10': isActiveRoute(item.path), 
            'text-gray-500 hover:text-[#2C2C7B] hover:bg-gray-100': !isActiveRoute(item.path) 
          }"
          :title="item.label"
        >
          <component :is="item.icon" class="w-5 h-5" />
          
          <!-- Tooltip -->
          <div class="absolute left-12 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {{ item.label }}
          </div>
        </router-link>
      </div>
    </nav>
    
    <!-- Expand sidebar button -->
    <div class="mt-auto">
      <button 
        class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#2C2C7B] transition-colors"
        title="Étendre le menu"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { 
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  BeakerIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';

// Navigation items avec les vrais composants importés
const navItems = [
  {
    path: '/',
    icon: HomeIcon,
    label: 'Dashboard'
  },
  {
    path: '/events',
    icon: DocumentTextIcon,
    label: 'Événements'
  },
  {
    path: '/doctors',
    icon: UserIcon,
    label: 'Médecins'
  },
  {
    path: '/laboratories',
    icon: BeakerIcon,
    label: 'Laboratoires'
  },
  {
    path: '/compliance',
    icon: ShieldCheckIcon,
    label: 'Conformité'
  }
];

const route = useRoute();

// Check if route is active
const isActiveRoute = (path: string) => {
  if (path === '/') {
    return route.path === '/' || route.path === '/dashboard';
  }
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script>