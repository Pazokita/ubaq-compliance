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

    <!-- Events List Component -->
    <EventsList
      :events="filteredEvents"
      :loading="loading"
      :error="error"
      :title="getListTitle()"
      :empty-message="selectedStatus ? 'Aucun événement trouvé' : 'Aucun événement disponible'"
      :empty-sub-message="getEmptySubMessage()"
      :show-edit-action="false"
      :show-delete-action="true"
      @delete="openDeleteModal"
      @retry="fetchEvents"
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
          v-if="selectedStatus"
          @click="resetFilter"
          class="text-[#2C2C7B] hover:text-[#6A7DFF] text-sm font-medium"
        >
          Effacer le filtre
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
import type { Event, GetEventsResponse } from '../graphql/queries/events.queries'
import { notificationService } from '../services/notification.service'

// États réactifs
const allEvents = ref<Event[]>([])
const selectedStatus = ref<string | null>(null)
const loading = ref(false)
const error = ref('')

// Modal de suppression
const deleteModal = ref({
  isOpen: false,
  eventId: '',
  eventTitle: '',
  isDeleting: false
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
const filteredEvents = computed(() => {
  let events = [...allEvents.value]
  
  if (selectedStatus.value) {
    events = events.filter(event => event.status === selectedStatus.value)
  }
  
  return events.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

// Fonctions utilitaires
const getStatusLabel = (status: string) => {
  const statusConfig = statusList.find(s => s.key === status)
  return statusConfig?.label || status
}

const getEventCountByStatus = (status: string) => {
  return allEvents.value.filter(event => event.status === status).length
}

const getListTitle = () => {
  return selectedStatus.value 
    ? `Événements : ${getStatusLabel(selectedStatus.value)}` 
    : 'Événements récents'
}

const getEmptySubMessage = () => {
  if (selectedStatus.value) {
    return `Il n'y a actuellement aucun événement avec le statut "${getStatusLabel(selectedStatus.value)}".`
  }
  return 'Créez votre premier événement pour commencer.'
}

// Gestion des filtres
const toggleStatusFilter = (status: string) => {
  selectedStatus.value = selectedStatus.value === status ? null : status
}

const resetFilter = () => {
  selectedStatus.value = null
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