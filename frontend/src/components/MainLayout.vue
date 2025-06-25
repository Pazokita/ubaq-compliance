<template>
  <div class="flex min-h-screen bg-white">
    <SideNavigation />
    
    <div class="flex-1">
      <!-- Header -->
      <header class="bg-[#1A7350] h-16 flex items-center px-6 text-white">
        <div class="flex items-center">
          <div class="text-sm">
            <div class="font-light">NAYACT</div>
            <div class="font-bold">Transparency by <span class="text-[#8FDFC6]">Demo</span></div>
          </div>
        </div>
        
        <div class="ml-auto flex items-center space-x-6">
          <div class="text-sm">
            <span class="font-semibold">{{ userName }}</span>
            <span class="mx-2">|</span>
            <button @click="logout" class="hover:underline">Déconnexion</button>
          </div>
        </div>
      </header>
      
      <!-- Content -->
      <main class="p-6">
        <div v-if="isLoading" class="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
        <div v-else>
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import SideNavigation from '../components/SideNavigation.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const isLoading = ref(false);
const user = ref<any>(null);

// Get user info from localStorage
onMounted(() => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user.value = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
  }
});

// Computed property for user name
const userName = computed(() => {
  if (!user.value) return 'Utilisateur';
  return user.value.email.split('@')[0]; // Display first part of email
});

// Logout function
const logout = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Redirect to login page
  router.push('/login');
};
</script>