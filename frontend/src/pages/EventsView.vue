<template>
  <MainLayout>
    <h1 class="text-2xl font-bold mb-6 text-[#1A1A1A]">
      Bienvenue sur votre <span class="text-[#2C2C7B]">espace</span>
    </h1>

    <!-- User role selector -->
    <div class="mb-8 flex items-center space-x-6">
      <label class="flex items-center space-x-2">
        <input type="radio" name="role" class="form-radio text-[#2C2C7B]" checked>
        <span class="text-sm text-[#1A1A1A]">Je suis le créateur</span>
      </label>
      <label class="flex items-center space-x-2">
        <input type="radio" name="role" class="form-radio text-[#2C2C7B]">
        <span class="text-sm text-[#1A1A1A]">Je suis le validateur</span>
      </label>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Recherche -->
        <div>
          <label class="block text-sm font-medium text-[#1A1A1A] mb-2">Recherche</label>
          <input 
            type="text" 
            v-model="filters.search"
            @input="debouncedSearch"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B] transition-colors" 
            placeholder="Rechercher un événement..."
          />
        </div>
        
        <!-- Filtre par statut -->
        <div>
          <label class="block text-sm font-medium text-[#1A1A1A] mb-2">Statut</label>
          <select 
            v-model="filters.status"
            @change="loadEvents"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B] transition-colors"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En cours de création</option>
            <option value="first_validation">Première validation</option>
            <option value="second_validation">Deuxième validation</option>
            <option value="to_modify">À modifier</option>
            <option value="validated">Validé</option>
            <option value="active">En cours</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
        
        <!-- Filtre par type -->
        <div>
          <label class="block text-sm font-medium text-[#1A1A1A] mb-2">Type</label>
          <select 
            v-model="filters.type"
            @change="loadEvents"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B] transition-colors"
          >
            <option value="">Tous les types</option>
            <option value="conference">Conférence</option>
            <option value="workshop">Atelier</option>
            <option value="formation">Formation</option>
            <option value="seminar">Séminaire</option>
            <option value="presentation">Présentation</option>
          </select>
        </div>
      </div>

      <!-- Reset filters button -->
      <div class="mt-4" v-if="hasActiveFilters">
        <button 
          @click="resetFilters"
          class="text-sm text-[#2C2C7B] hover:text-[#6A7DFF] font-medium flex items-center transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Effacer les filtres
        </button>
      </div>
    </div>

    <!-- Status cards - Vue d'ensemble -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div 
        v-for="status in statusList" 
        :key="status.key"
        @click="quickFilterByStatus(status.key)"
        :class="[
          'rounded-lg p-4 text-center cursor-pointer transition-all duration-200 border-2',
          filters.status === status.key 
            ? 'border-[#2C2C7B] bg-[#6A7DFF] text-white shadow-lg transform scale-105' 
            : `${status.bgClass} border-transparent hover:border-[#6A7DFF] hover:shadow-md hover:scale-102`
        ]"
      >
        <div class="text-sm font-medium">{{ status.label }}</div>
        <div class="text-xs mt-1 opacity-75">
          {{ getEventCountByStatus(status.key) }} événement(s)
        </div>
      </div>
    </div>

    <!-- Actions et résultats -->
    <div class="flex justify-between items-center mb-4">
      <div class="text-sm text-[#1A1A1A]">
        <span class="font-medium">{{ filteredEvents.length }}</span> événement(s) trouvé(s)
        <span v-if="hasActiveFilters" class="text-gray-500">
          (sur {{ allEvents.length }} total)
        </span>
      </div>

      <!-- Bouton de création -->
      <router-link
        to="/events/create"
        class="bg-[#2C2C7B] text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-[#6A7DFF] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nouvel événement
      </router-link>
    </div>

    <!-- Event list -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-4 border-b bg-[#FDFBF9]">
        <h2 class="font-semibold text-[#1A1A1A]">
          {{ getListTitle() }}
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          Triés par date de création (plus récent en premier)
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C2C7B] mx-auto"></div>
        <p class="mt-2 text-gray-600">Chargement des événements...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex justify-center">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">Erreur de chargement</p>
              <p class="text-sm text-red-700">{{ error }}</p>
              <button 
                @click="loadEvents" 
                class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredEvents.length === 0" class="p-8 text-center">
        <div class="text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"></path>
          </svg>
          <p class="font-medium mb-2">
            {{ hasActiveFilters ? 'Aucun événement trouvé' : 'Aucun événement disponible' }}
          </p>
          <p class="text-sm">
            {{ hasActiveFilters 
              ? 'Essayez de modifier vos critères de recherche.' 
              : 'Créez votre premier événement pour commencer.' 
            }}
          </p>
          <div class="mt-4" v-if="hasActiveFilters">
            <button 
              @click="resetFilters"
              class="text-[#2C2C7B] hover:text-[#6A7DFF] text-sm font-medium"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      <!-- Events table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr class="text-left text-sm text-gray-600">
              <th class="px-4 py-3 font-medium">Événement</th>
              <th class="px-4 py-3 font-medium">Type</th>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Médecin</th>
              <th class="px-4 py-3 font-medium">Laboratoire</th>
              <th class="px-4 py-3 font-medium">Budget</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="event in filteredEvents" 
              :key="event.id" 
              class="text-sm hover:bg-gray-50 transition-colors"
            >
              <!-- Titre et lieu -->
              <td class="px-4 py-3">
                <div class="font-medium text-[#1A1A1A]">{{ event.title }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  📍 {{ event.location }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  Créé le {{ formatDate(event.created_at) }}
                </div>
              </td>

              <!-- Type -->
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ getTypeLabel(event.type) }}
                </span>
              </td>

              <!-- Date -->
              <td class="px-4 py-3">{{ formatDate(event.date) }}</td>

              <!-- Médecin -->
              <td class="px-4 py-3">
                <div>
                  <div class="font-medium text-gray-900">{{ event.doctor?.name || 'Non défini' }}</div>
                  <div class="text-xs text-gray-500">{{ event.doctor?.specialty || 'Spécialité non précisée' }}</div>
                </div>
              </td>

              <!-- Laboratoire -->
              <td class="px-4 py-3">
                <div>
                  <div class="font-medium text-gray-900">{{ event.laboratory?.name || 'Non défini' }}</div>
                  <div class="text-xs text-gray-500">{{ event.laboratory?.city || 'Ville non précisée' }}</div>
                </div>
              </td>

              <!-- Budget -->
              <td class="px-4 py-3">
                <div class="flex flex-col">
                  <span class="font-medium">{{ event.budget_allocated }}€</span>
                  <span class="text-xs text-gray-500">
                    Utilisé: {{ event.budget_used || 0 }}€
                  </span>
                  <div 
                    v-if="(event.budget_used || 0) > 250" 
                    class="text-xs text-[#E63946] font-medium mt-1"
                  >
                    ⚠️ Seuil dépassé
                  </div>
                </div>
              </td>

              <!-- Statut -->
              <td class="px-4 py-3">
                <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(event.status)}`">
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3">
                <div class="flex space-x-2">
                  <router-link 
                    :to="`/events/${event.id}`" 
                    class="text-[#2C2C7B] hover:text-[#6A7DFF] font-medium hover:underline transition-colors"
                  >
                    Voir détails
                  </router-link>
                  <router-link 
                    :to="`/events/${event.id}/edit`" 
                    class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Modifier
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import MainLayout from '../components/MainLayout.vue';
import { apolloClient } from '../lib/apollo'
import { GET_EVENTS } from '../graphql/queries/events.queries'
import type { Event, GetEventsResponse, EventFilters } from '../graphql/queries/events.queries'

// États réactifs
const allEvents = ref<Event[]>([])
const loading = ref(false)
const error = ref('')

// Filtres
const filters = ref<EventFilters>({
  search: '',
  status: '',
  type: ''
})

// Configuration des statuts
const statusList = [
  { key: 'pending', label: 'En cours de création', bgClass: 'bg-blue-100 text-blue-800' },
  { key: 'first_validation', label: 'Première validation', bgClass: 'bg-blue-100 text-blue-800' },
  { key: 'second_validation', label: 'Deuxième validation', bgClass: 'bg-blue-100 text-blue-800' },
  { key: 'to_modify', label: 'À modifier', bgClass: 'bg-yellow-100 text-yellow-800' },
  { key: 'validated', label: 'En cours de soumission & gestion', bgClass: 'bg-green-100 text-green-800' },
  { key: 'active', label: 'Événement en cours', bgClass: 'bg-green-100 text-green-800' }
]

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.status || filters.value.type
})

const filteredEvents = computed(() => {
  let events = [...allEvents.value]
  
  // Filtre par recherche textuelle
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    events = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.location?.toLowerCase().includes(searchTerm) ||
      event.doctor?.name?.toLowerCase().includes(searchTerm) ||
      event.laboratory?.name?.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filtre par statut
  if (filters.value.status) {
    events = events.filter(event => event.status === filters.value.status)
  }
  
  // Filtre par type
  if (filters.value.type) {
    events = events.filter(event => event.type === filters.value.type)
  }
  
  // Trier par date de création (plus récent en premier)
  return events.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

// Fonctions utilitaires
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getStatusLabel = (status: string) => {
  const statusConfig = statusList.find(s => s.key === status)
  return statusConfig?.label || status
}

const getStatusClass = (status: string) => {
  const statusConfig = statusList.find(s => s.key === status)
  return statusConfig?.bgClass || 'bg-gray-100 text-gray-800'
}

const getTypeLabel = (type: string) => {
  const typeLabels: Record<string, string> = {
    conference: 'Conférence',
    workshop: 'Atelier',
    formation: 'Formation',
    seminar: 'Séminaire',
    presentation: 'Présentation'
  }
  return typeLabels[type] || type
}

const getEventCountByStatus = (status: string) => {
  return allEvents.value.filter(event => event.status === status).length
}

const getListTitle = () => {
  if (filters.value.status) {
    return `Événements : ${getStatusLabel(filters.value.status)}`
  }
  if (filters.value.type) {
    return `Événements : ${getTypeLabel(filters.value.type)}`
  }
  if (filters.value.search) {
    return `Résultats de recherche : "${filters.value.search}"`
  }
  return 'Événements récents'
}

// Gestion des filtres
const quickFilterByStatus = (status: string) => {
  if (filters.value.status === status) {
    filters.value.status = ''
  } else {
    filters.value.status = status
  }
  loadEvents()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    type: ''
  }
  loadEvents()
}

// Debounce pour la recherche
let searchTimeout: number
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Pas besoin de recharger, les computed properties s'occupent du filtrage
  }, 300)
}

// Récupération des données
const loadEvents = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { data } = await apolloClient.query<GetEventsResponse>({
      query: GET_EVENTS,
      variables: {},
      fetchPolicy: 'network-only'
    })
    
    allEvents.value = data.events
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des événements'
    console.error('Erreur GraphQL:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadEvents()
})
</script>