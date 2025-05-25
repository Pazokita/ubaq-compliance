<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Header -->
      <div class="p-4 border-b bg-[#FDFBF9]">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-semibold text-[#1A1A1A]">{{ title }}</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ filteredEvents.length }} événement(s) trouvé(s)
              <span v-if="showTotal && filteredEvents.length !== totalEvents">
                (sur {{ totalEvents }} total)
              </span>
            </p>
          </div>
          
          <!-- Actions slot -->
          <slot name="actions"></slot>
        </div>
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
                @click="$emit('retry')" 
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
          <p class="font-medium mb-2">{{ emptyMessage }}</p>
          <p class="text-sm">{{ emptySubMessage }}</p>
          
          <!-- Empty state actions slot -->
          <div class="mt-4">
            <slot name="empty-actions"></slot>
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
                    v-if="(event.budget_allocated || 0) > 250" 
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
                    v-if="showEditAction"
                    :to="`/events/${event.id}/edit`" 
                    class="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                  >
                    Modifier
                  </router-link>
                  
                  <button
                    v-if="showDeleteAction"
                    @click="$emit('delete', event)"
                    :disabled="!canDeleteEvent(event)"
                    :class="[
                      'font-medium transition-colors',
                      canDeleteEvent(event) 
                        ? 'text-red-600 hover:text-red-800 hover:underline' 
                        : 'text-gray-400 cursor-not-allowed'
                    ]"
                    :title="canDeleteEvent(event) ? 'Supprimer cet événement' : 'Suppression non autorisée pour ce statut'"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { Event } from '../graphql/queries/events.queries'
  
  interface Props {
    events: Event[]
    loading?: boolean
    error?: string
    title?: string
    emptyMessage?: string
    emptySubMessage?: string
    showTotal?: boolean
    totalEvents?: number
    showEditAction?: boolean
    showDeleteAction?: boolean
  }
  
  interface Emits {
    (e: 'delete', event: Event): void
    (e: 'retry'): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: '',
    title: 'Événements',
    emptyMessage: 'Aucun événement disponible',
    emptySubMessage: 'Créez votre premier événement pour commencer.',
    showTotal: false,
    totalEvents: 0,
    showEditAction: true,
    showDeleteAction: true
  })
  
  defineEmits<Emits>()
  
  // Configuration des statuts
  const statusList = [
    { key: 'pending', label: 'En cours de création', bgClass: 'bg-blue-100 text-blue-800' },
    { key: 'first_validation', label: 'Première validation', bgClass: 'bg-blue-100 text-blue-800' },
    { key: 'second_validation', label: 'Deuxième validation', bgClass: 'bg-blue-100 text-blue-800' },
    { key: 'to_modify', label: 'À modifier', bgClass: 'bg-yellow-100 text-yellow-800' },
    { key: 'validated', label: 'En cours de soumission & gestion', bgClass: 'bg-green-100 text-green-800' },
    { key: 'active', label: 'Événement en cours', bgClass: 'bg-green-100 text-green-800' },
    { key: 'rejected', label: 'Rejeté', bgClass: 'bg-red-100 text-red-800' }
  ]
  
  // Computed
  const filteredEvents = computed(() => props.events)
  
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
  
  // Vérifier si un événement peut être supprimé
  const canDeleteEvent = (event: Event) => {
    return ['pending', 'to_modify'].includes(event.status)
  }
  </script>