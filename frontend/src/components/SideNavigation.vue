<template>
  <aside class="w-16 bg-gray-50 border-r flex flex-col items-center py-6">
    <!-- Icônes de navigation -->
    <nav class="flex flex-col items-center space-y-8 flex-1">
      <div v-for="(item, index) in navItems" :key="index">
        <router-link 
          :to="item.path"
          class="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
          :class="{ 'text-[#1A7350]': isActiveRoute(item.path), 'text-gray-500 hover:text-[#1A7350]': !isActiveRoute(item.path) }"
        >
          <component :is="item.icon" class="w-5 h-5" />
        </router-link>
      </div>
    </nav>
    
    <!-- Expand sidebar button -->
    <div class="mt-auto">
      <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#1A7350]">
        <ChevronRightIcon />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

// Navigation items
const navItems = [
  {
    path: '/dashboard',
    icon: 'HomeIcon',
    label: 'Dashboard'
  },
  {
    path: '/events',
    icon: 'DocumentIcon',
    label: 'Événements'
  },
  {
    path: '/doctors',
    icon: 'UserIcon',
    label: 'Médecins'
  },
  {
    path: '/laboratories',
    icon: 'BeakerIcon',
    label: 'Laboratoires'
  },
  {
    path: '/compliance',
    icon: 'ShieldCheckIcon',
    label: 'Conformité'
  }
];

const route = useRoute();

// Check if route is active
const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

// Icons
const HomeIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
};

const DocumentIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
};

const UserIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  `
};

const BeakerIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  `
};

const ShieldCheckIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  `
};

const ChevronRightIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  `
};
</script>