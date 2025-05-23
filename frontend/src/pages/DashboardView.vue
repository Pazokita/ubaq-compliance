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

    <!-- Status cards - cliquables pour filtrer -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div 
        v-for="status in statusList" 
        :key="status.key"
        @click="toggleStatusFilter(status.key)"
        :class="[
          'rounded-lg p-4 text-center cursor-pointer transition-all duration-200 border-2',
          selectedStatus === status.key 
            ? 'border-[#2C2C7B] bg-[#6A7DFF] text-white shadow-lg transform scale-105' 
            : `${status.bgClass} border-transparent hover:border-[#6A7DFF] hover:shadow-md`
        ]"
      >
        <div class="text-sm font-medium">{{ status.label }}</div>
        <div class="text-xs mt-1 opacity-75">
          {{ getEventCountByStatus(status.key) }} événement(s)
        </div>
      </div>
    </div>

    <!-- Reset filter button -->
    <div class="mb-4" v-if="selectedStatus">
      <button 
        @click="resetFilter"
        class="text-sm text-[#2C2C7B] hover:text-[#6A7DFF] font-medium flex items-center"
      >
        ← Afficher tous les événements
      </button>
    </div>

    <!-- Event list -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-4 border-b bg-[#FDFBF9]">
        <h2 class="font-semibold text-[#1A1A1A]">
          {{ selectedStatus ? `Événements : ${getStatusLabel(selectedStatus)}` : 'Événements récents' }}
        </h2>
        <p class="text-sm text-gray-600 mt-1">
          {{ filteredEvents.length }} événement(s) trouvé(s)
        </p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C2C7B] mx-auto"></div>
        <p class="mt-2 text-gray-600">Chargement des événements...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="text-[#E63946] font-medium">{{ error }}</div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredEvents.length === 0" class="p-8 text-center">
        <div class="text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="font-medium mb-2">
            {{ selectedStatus ? 'Aucun événement trouvé' : 'Aucun événement disponible' }}
          </p>
          <p class="text-sm">
            {{ selectedStatus 
              ? `Il n'y a actuellement aucun événement avec le statut "${getStatusLabel(selectedStatus)}".` 
              : 'Créez votre premier événement pour commencer.' 
            }}
          </p>
        </div>
      </div>

      <!-- Events table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr class="text-left text-sm text-gray-600">
              <th class="px-4 py-3 font-medium">Titre</th>
              <th class="px-4 py-3 font-medium">Type</th>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Lieu</th>
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
              <td class="px-4 py-3">
                <div class="font-medium text-[#1A1A1A]">{{ event.title }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  Créé le {{ formatDate(event.created_at) }}
                </div>
              </td>
              <td class="px-4 py-3 capitalize">{{ event.type }}</td>
              <td class="px-4 py-3">{{ formatDate(event.date) }}</td>
              <td class="px-4 py-3">{{ event.location }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-col">
                  <span class="font-medium">{{ event.budget_allocated }}€</span>
                  <span class="text-xs text-gray-500">
                    Utilisé: {{ event.budget_used }}€
                  </span>
                  <div 
                    v-if="event.budget_used > 250" 
                    class="text-xs text-[#E63946] font-medium mt-1"
                  >
                    ⚠️ Seuil dépassé
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(event.status)}`">
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <router-link 
                  :to="`/events/${event.id}`" 
                  class="text-[#2C2C7B] hover:text-[#6A7DFF] font-medium hover:underline transition-colors"
                >
                  Voir détails →
                </router-link>
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
import type { Event, GetEventsResponse } from '../graphql/queries/events.queries'

// États réactifs
const allEvents = ref<Event[]>([])
const selectedStatus = ref<string | null>(null)
const loading = ref(false)
const error = ref('')

// Configuration des statuts
const statusList = [
  { key: 'pending', label: 'En cours de création', bgClass: 'bg-blue-100 text-blue-800' },
  { key: 'first_validation', label: 'Première validation', bgClass: 'bg-blue-100 text-blue-800' },
  { key: 'second_validation', label: 'Deuxième validation', bgClass: 'bg-blue-100 text-blue-800' },
  { key: 'to_modify', label: 'À modifier', bgClass: 'bg-yellow-100 text-yellow-800' },
  { key: 'validated', label: 'En cours de soumission & gestion', bgClass: 'bg-green-100 text-green-800' },
  { key: 'active', label: 'Événement en cours', bgClass: 'bg-green-100 text-green-800' }
]

// Événements filtrés (computed property pour réactivité optimale)
const filteredEvents = computed(() => {
  let events = [...allEvents.value]
  
  // Filtrer par statut si sélectionné
  if (selectedStatus.value) {
    events = events.filter(event => event.status === selectedStatus.value)
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

const getEventCountByStatus = (status: string) => {
  return allEvents.value.filter(event => event.status === status).length
}

// Gestion des filtres
const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
}

const resetFilter = () => {
  selectedStatus.value = null
}

// Récupération des données
const fetchEvents = async () => {
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

onMounted(() => {
  fetchEvents()
})
</script>