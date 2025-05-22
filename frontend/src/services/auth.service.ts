import { ref } from 'vue'
import { apolloClient } from '../lib/apollo'
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../graphql/mutations/auth.mutations'

interface User {
  id: number
  name: string
  email: string
  role?: string
}

// Mock users pour les tests de rôles (en attendant l'ajout du champ role)
const mockUsers = [
  { email: 'admin@ubaq.com', password: 'admin123', role: 'admin', name: 'Admin User', id: 1 },
  { email: 'compliance@ubaq.com', password: 'compliance123', role: 'compliance', name: 'Compliance Officer', id: 2 },
  { email: 'user@ubaq.com', password: 'user123', role: 'user', name: 'Standard User', id: 3 }
]

// État global pour l'authentification
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isAuthenticated = ref(false)

// Vérifier si l'utilisateur est déjà connecté lors du chargement
const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')
if (storedUser && storedToken) {
  user.value = JSON.parse(storedUser)
  isAuthenticated.value = true
}

export const authService = {
  user,
  loading,
  error,
  isAuthenticated,

  async login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      })
      
      if (data.login.access_token) {
        // Ajouter un rôle basé sur l'email en attendant l'ajout du champ role
        const mockUser = mockUsers.find(u => u.email === email)
        const userWithRole = {
          ...data.login.user,
          role: mockUser?.role || 'user'
        }
        
        user.value = userWithRole
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(userWithRole))
        localStorage.setItem('token', data.login.access_token)
        return true
      } else {
        error.value = 'Échec de l\'authentification'
        return false
      }
    } catch (err: any) {
      console.error('Erreur GraphQL:', err)
      error.value = err.message || 'Erreur de connexion'
      return false
    } finally {
      loading.value = false
    }
  },

  async logout() {
    try {
      await apolloClient.mutate({ mutation: LOGOUT_MUTATION })
    } catch (err) {
      console.error('Erreur de déconnexion:', err)
    } finally {
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
}