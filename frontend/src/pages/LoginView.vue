<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <!-- Logo -->
        <div class="text-center">
          <div class="flex justify-center">
            <div class="w-20 h-20 rounded-full bg-[#1A7350] flex items-center justify-center">
              <span class="text-white text-xl font-bold">U</span>
            </div>
          </div>
          <h2 class="mt-4 text-3xl font-extrabold text-gray-900">UBAQ Compliance</h2>
          <p class="mt-2 text-sm text-gray-600">Connectez-vous à votre espace</p>
        </div>
        
        <!-- Login Form -->
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A7350] focus:border-[#1A7350]"
                placeholder="Adresse email"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1A7350] focus:border-[#1A7350]"
                placeholder="Mot de passe"
              />
            </div>
          </div>
  
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-[#1A7350] focus:ring-[#1A7350] border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>
  
            <div class="text-sm">
              <a href="#" class="font-medium text-[#1A7350] hover:text-[#116340]">
                Mot de passe oublié?
              </a>
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A7350] hover:bg-[#116340] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A7350]"
              :disabled="loading"
            >
              <span v-if="loading">Connexion en cours...</span>
              <span v-else>Se connecter</span>
            </button>
          </div>
          
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-800 text-sm rounded-md p-3">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const errorMessage = ref('');
  
  // Mock user credentials for development
  const mockUsers = [
    { email: 'admin@ubaq.com', password: 'admin123', role: 'admin' },
    { email: 'compliance@ubaq.com', password: 'compliance123', role: 'compliance_officer' },
    { email: 'user@ubaq.com', password: 'user123', role: 'user' }
  ];
  
  const handleLogin = () => {
    loading.value = true;
    errorMessage.value = '';
    
    // Simulate API request delay
    setTimeout(() => {
      // Find user with matching credentials
      const user = mockUsers.find(
        u => u.email === email.value && u.password === password.value
      );
      
      if (user) {
        // Store token and user info in localStorage (for mock auth)
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          role: user.role
        }));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        errorMessage.value = 'Email ou mot de passe incorrect';
      }
      
      loading.value = false;
    }, 1000);
  };
  </script>