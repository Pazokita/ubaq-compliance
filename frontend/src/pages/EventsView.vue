<template>
  <MainLayout>
    <h1 class="text-2xl font-bold mb-6 text-[#1A1A1A]">
      Gestion des <span class="text-[#2C2C7B]">événements</span>
    </h1>

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
            @change="applyFilters"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B] transition-colors"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En cours de création</option>
            <option value="first_validation">Première validation</option>
            <option value="second_validation">Deuxième validation</option>
            <option value="to_modify">À modifier</option>
            <option value="validated">Validé</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
        
        <!-- Filtre par type -->
        <div>
          <label class="block text-sm font-medium text-[#1A1A1A] mb-2">Type</label>
          <select 
            v-model="filters.type"
            @change="applyFilters"
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
    </div>

    <!-- Events List Component -->
    <EventsList
      :events="filteredEvents"
      :loading="loading"
      :error="error"
      :title="getListTitle()"
      :empty-message="hasActiveFilters ? 'Aucun événement trouvé' : 'Aucun événement disponible'"
      :empty-sub-message="getEmptySubMessage()"
      :show-total="true"
      :total-events="allEvents.length"
      :show-edit-action="true"
      :show-delete-action="true"
      @delete="openDeleteModal"
      @retry="loadEvents"
    >
      <template #actions>
        <router-link
          to="/events/create"
          class="bg-[#2C2C7B] text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-[#6A7DFF] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvel événement
        </router-link>
      </template>
      
      <template #empty-actions>
        <button 
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="text-[#2C2C7B] hover:text-[#6A7DFF] text-sm font-medium"
        >
          Effacer les filtres
        </button>
      </template>
    </EventsList>

    <!-- Delete confirmation modal -->
    <ConfirmDeleteModal
      :is-open="deleteModal.isOpen"
      :event-title="deleteModal.eventTitle"
      :is-deleting="deleteModal.isDeleting"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Notifications -->
    <div class="fixed top-0 right-0 z-50 p-4 space-y-4">
      <NotificationToast
        v-for="notification in notificationService.notifications.value"
        :key="notification.id"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        :duration="notification.duration"
        :auto-close="notification.autoClose"
        @close="notificationService.removeNotification(notification.id)"
      />
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import EventsList from '../components/EventsList.vue'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue'
import NotificationToast from '../components/NotificationToast.vue'
import { apolloClient } from '../lib/apollo'
import { GET_EVENTS } from '../graphql/queries/events.queries'
import { DELETE_EVENT } from '../graphql/mutations/events.mutations'
import type { Event, GetEventsResponse, EventFilters } from '../graphql/queries/events.queries'
import { notificationService } from '../services/notification.service'

// États réactifs
const allEvents = ref<Event[]>([])
const loading = ref(false)
const error = ref('')

// Modal de suppression
const deleteModal = ref({
  isOpen: false,
  eventId: '',
  eventTitle: '',
  isDeleting: false
})

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
  { key: 'rejected', label: 'Rejeté', bgClass: 'bg-red-100 text-red-800' }
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
const getStatusLabel = (status: string) => {
  const statusConfig = statusList.find(s => s.key === status)
  return statusConfig?.label || status
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
  return 'Tous les événements'
}

const getEmptySubMessage = () => {
  if (hasActiveFilters.value) {
    return 'Essayez de modifier vos critères de recherche.'
  }
  return 'Créez votre premier événement pour commencer.'
}

// Gestion des filtres
const quickFilterByStatus = (status: string) => {
  if (filters.value.status === status) {
    filters.value.status = ''
  } else {
    filters.value.status = status
  }
  applyFilters()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    type: ''
  }
  applyFilters()
}

const applyFilters = () => {
  // Les computed properties se chargent automatiquement de la logique de filtrage
  // Cette fonction existe pour les événements @change des selects
}

// Debounce pour la recherche
let searchTimeout: number
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    // Pas besoin de recharger, les computed properties s'occupent du filtrage
  }, 300)
}

// Gestion de la suppression
const openDeleteModal = (event: Event) => {
  deleteModal.value = {
    isOpen: true,
    eventId: event.id,
    eventTitle: event.title,
    isDeleting: false
  }
}

const cancelDelete = () => {
  deleteModal.value = {
    isOpen: false,
    eventId: '',
    eventTitle: '',
    isDeleting: false
  }
}

const confirmDelete = async () => {
  deleteModal.value.isDeleting = true
  const eventTitle = deleteModal.value.eventTitle
  
  try {
    await apolloClient.mutate({
      mutation: DELETE_EVENT,
      variables: { id: deleteModal.value.eventId }
    })
    
    // Supprimer l'événement de la liste locale
    allEvents.value = allEvents.value.filter(event => event.id !== deleteModal.value.eventId)
    
    cancelDelete()
    
    notificationService.success(
      'Événement supprimé',
      `L'événement "${eventTitle}" a été supprimé avec succès.`
    )
    
  } catch (err: any) {
    console.error('Erreur lors de la suppression:', err)
    deleteModal.value.isDeleting = false
    
    notificationService.error(
      'Erreur de suppression',
      err.message || 'Une erreur est survenue lors de la suppression de l\'événement.'
    )
  }
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