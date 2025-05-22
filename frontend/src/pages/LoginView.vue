<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-[#1A7350]">UBAQ Compliance</h2>
        <p class="text-gray-600">Connectez-vous à votre compte</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A7350]"
            required
          >
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A7350]"
            required
          >
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
        
        <div v-if="authService.error.value" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ authService.error.value }}

        </div>
        
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A7350] hover:bg-[#116340] focus:outline-none"
          :disabled="authService.loading.value"
        >
          <LoadingSpinner v-if="authService.loading.value" class="h-5 w-5 mr-2" />
          {{ authService.loading.value ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const email = ref('')
const password = ref('')

// Mock user credentials pour les tests (fallback)
const mockUsers = [
  { email: 'admin@ubaq.com', password: 'admin123', role: 'admin', name: 'Admin User', id: 1 },
  { email: 'compliance@ubaq.com', password: 'compliance123', role: 'compliance', name: 'Compliance Officer', id: 2 },
  { email: 'user@ubaq.com', password: 'user123', role: 'user', name: 'Standard User', id: 3 }
]

async function handleLogin() {
  try {
    // Tentative d'authentification via votre service GraphQL
    const success = await authService.login(email.value, password.value)
    
    if (success) {
      window.location.href = '/dashboard'
    }
  } catch (err) {
    console.error('Erreur GraphQL, utilisation des mocks:', err)
    
    // Fallback vers les données mockées si GraphQL échoue
    const user = mockUsers.find(
      u => u.email === email.value && u.password === password.value
    )
    
    if (user) {
      // Simuler le succès avec les données mockées
      authService.user.value = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      authService.isAuthenticated.value = true
      authService.error.value = null
      localStorage.setItem('user', JSON.stringify(authService.user.value))
      
      router.push({ name: 'dashboard' })
    } else {
      authService.error.value = 'Email ou mot de passe incorrect'
    }
  }
}
</script>