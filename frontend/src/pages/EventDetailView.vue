<template>
  <MainLayout>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C2C7B]"></div>
      <span class="ml-2 text-gray-600">Chargement...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="text-sm font-medium text-red-800">Erreur</p>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Event content -->
    <div v-else-if="event">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-800">Détail de l'événement</h1>
        </div>
        
        <!-- Status badge -->
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-yellow-100 text-yellow-800': event.status === 'pending',
            'bg-blue-100 text-blue-800': event.status === 'first_validation',
            'bg-green-100 text-green-800': event.status === 'second_validation',
            'bg-red-100 text-red-800': event.status === 'rejected',
            'bg-orange-100 text-orange-800': event.status === 'to_modify'
          }"
        >
          {{ statusLabel }}
        </span>
      </div>

      <!-- Event details -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4 text-[#2C2C7B]">{{ event.title }}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-4 text-[#2C2C7B]">Informations générales</h3>
              
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Type d'événement:</div>
                  <div class="col-span-2 text-sm">{{ typeLabel }}</div>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Date:</div>
                  <div class="col-span-2 text-sm">{{ formattedDate }}</div>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Lieu:</div>
                  <div class="col-span-2 text-sm">{{ event.location }}</div>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Médecin invité:</div>
                  <div class="col-span-2 text-sm">
                    {{ event.doctor.name }}
                    <span v-if="event.doctor.specialty" class="text-gray-400">
                      ({{ event.doctor.specialty }})
                    </span>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Laboratoire:</div>
                  <div class="col-span-2 text-sm">
                    {{ event.laboratory.name }}
                    <span v-if="event.laboratory.city" class="text-gray-400">
                      - {{ event.laboratory.city }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-4 text-[#2C2C7B]">Informations budgétaires</h3>
              
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Budget alloué:</div>
                  <div class="col-span-2 text-sm font-semibold">{{ formattedBudgetAllocated }}</div>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Budget utilisé:</div>
                  <div class="col-span-2 text-sm">{{ formattedBudgetUsed }}</div>
                </div>
                
                <div class="grid grid-cols-3 gap-2">
                  <div class="text-sm font-medium text-gray-500">Budget par médecin:</div>
                  <div class="col-span-2 text-sm" :class="{ 'text-red-600 font-semibold': budgetExceeded }">
                    {{ budgetPerDoctor }}
                  </div>
                </div>
                
                <div v-if="budgetExceeded" class="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
                  <div class="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-red-800">⚠️ Dépassement de budget LEA</p>
                      <p class="text-sm text-red-700">Le budget par médecin dépasse le seuil autorisé de 250€.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Description section -->
          <div v-if="event.description" class="mt-6">
            <h3 class="font-semibold mb-3 text-[#2C2C7B]">Description</h3>
            <p class="text-sm text-gray-700">{{ event.description }}</p>
          </div>
          
          <!-- Supporting documents -->
          <div class="mt-6">
            <h3 class="font-semibold mb-3 text-[#2C2C7B]">Documents justificatifs</h3>
            
            <div v-if="event.document_url" class="space-y-2">
              <div class="flex items-center p-3 border rounded-md bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="text-sm flex-1">Document justificatif</span>
                <a 
                  :href="event.document_url" 
                  target="_blank" 
                  class="text-[#2C2C7B] text-sm hover:underline font-medium"
                >
                  Voir le document →
                </a>
              </div>
            </div>
            
            <div v-else class="text-sm text-gray-500 italic">
              Aucun document justificatif fourni.
            </div>
          </div>

          <!-- Validation info -->
          <div v-if="event.validation_comment || event.validator" class="mt-6">
            <h3 class="font-semibold mb-3 text-[#2C2C7B]">Informations de validation</h3>
            
            <div v-if="event.validator" class="text-sm text-gray-600 mb-2">
              <strong>Validé par:</strong> {{ event.validator.name }}
              <span v-if="event.validated_at" class="text-gray-400">
                le {{ eventsService.formatDate(event.validated_at) }}
              </span>
            </div>
            
            <div v-if="event.validation_comment" class="bg-gray-50 border rounded-md p-3">
              <p class="text-sm text-gray-700">{{ event.validation_comment }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Compliance actions -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="font-semibold mb-4 text-[#2C2C7B]">Actions</h3>
        
        <div class="flex space-x-3">
          <button class="bg-[#2C2C7B] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1F1F5C] transition-colors">
            Valider l'événement
          </button>
          <button class="bg-white border border-[#2C2C7B] text-[#2C2C7B] px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
            Demander des modifications
          </button>
          <button class="bg-white border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50 transition-colors">
            Rejeter l'événement
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import eventsService from '../services/events.service'
import type { Event } from '../graphql/queries/events.queries'

const router = useRouter()
const route = useRoute()

// État réactif
const event = ref<Event | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Récupérer l'événement au chargement
onMounted(async () => {
  const eventId = route.params.id as string
  
  if (!eventId) {
    error.value = 'ID d\'événement manquant'
    loading.value = false
    return
  }
  
  try {
    event.value = await eventsService.getEvent(eventId)
  } catch (err: any) {
    console.error('Erreur lors du chargement de l\'événement:', err)
    error.value = err.message || 'Impossible de charger l\'événement'
  } finally {
    loading.value = false
  }
})

// Computed properties pour l'affichage
const formattedBudgetAllocated = computed(() => {
  return event.value ? eventsService.formatCurrency(event.value.budget_allocated) : ''
})

const formattedBudgetUsed = computed(() => {
  return event.value ? eventsService.formatCurrency(event.value.budget_used) : ''
})

const budgetPerDoctor = computed(() => {
  return event.value ? eventsService.formatCurrency(eventsService.calculateBudgetPerDoctor(event.value.budget_allocated)) : ''
})

const budgetExceeded = computed(() => {
  return event.value ? eventsService.isBudgetExceeded(event.value.budget_allocated) : false
})

const formattedDate = computed(() => {
  return event.value ? eventsService.formatDate(event.value.date) : ''
})

const statusLabel = computed(() => {
  return event.value ? eventsService.getStatusLabel(event.value.status) : ''
})

const typeLabel = computed(() => {
  return event.value ? eventsService.getTypeLabel(event.value.type) : ''
})

const goBack = () => {
  router.push('/events')
}
</script>