<template>
  <MainLayout>
    <div>
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="goBack" class="mr-3 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-800">Modifier l'événement</h1>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C2C7B]"></div>
        <span class="ml-2 text-gray-600">Chargement de l'événement...</span>
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

      <!-- Form -->
      <div v-else-if="event">
        <!-- Message d'erreur global -->
        <div v-if="updateError" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-red-800">Erreur lors de la modification</p>
              <p class="text-sm text-red-700">{{ updateError }}</p>
            </div>
          </div>
        </div>

        <!-- Formulaire de modification -->
        <form @submit.prevent="updateEvent" class="space-y-6">
          <!-- Informations générales -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4 text-[#2C2C7B]">Informations générales</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Titre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  v-model="form.title"
                  required
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating"
                />
              </div>

              <!-- Type d'événement -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Type d'événement *
                </label>
                <select
                  v-model="form.type"
                  required
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="conference">Conférence</option>
                  <option value="workshop">Atelier</option>
                  <option value="formation">Formation</option>
                  <option value="seminar">Séminaire</option>
                  <option value="presentation">Présentation</option>
                </select>
              </div>

              <!-- Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Date de l'événement *
                </label>
                <input
                  type="date"
                  v-model="form.date"
                  required
                  :min="minDate"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating"
                />
              </div>

              <!-- Lieu -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Lieu *
                </label>
                <input
                  type="text"
                  v-model="form.location"
                  required
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating"
                />
              </div>

              <!-- Médecin invité -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Médecin invité *
                </label>
                <select
                  v-model="form.doctor_id"
                  required
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating || loadingDoctors"
                >
                  <option value="">Sélectionner un médecin</option>
                  <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                    {{ doctor.name }} {{ doctor.specialty ? `- ${doctor.specialty}` : '' }}
                  </option>
                </select>
              </div>

              <!-- Laboratoire organisateur -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Laboratoire organisateur *
                </label>
                <select
                  v-model="form.laboratory_id"
                  required
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating || loadingLaboratories"
                >
                  <option value="">Sélectionner un laboratoire</option>
                  <option v-for="lab in laboratories" :key="lab.id" :value="lab.id">
                    {{ lab.name }} {{ lab.city ? `- ${lab.city}` : '' }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                :disabled="isUpdating"
              ></textarea>
            </div>
          </div>

          <!-- Informations budgétaires -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4 text-[#2C2C7B]">Informations budgétaires</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Budget alloué -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Budget alloué (€) *
                </label>
                <input
                  type="number"
                  v-model.number="form.budget_allocated"
                  required
                  min="0"
                  step="0.01"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating"
                />
              </div>

              <!-- Budget utilisé -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Budget utilisé (€)
                </label>
                <input
                  type="number"
                  v-model.number="form.budget_used"
                  min="0"
                  step="0.01"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                  :disabled="isUpdating"
                />
              </div>
            </div>

            <!-- URL du document -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                URL du document justificatif
              </label>
              <input
                type="url"
                v-model="form.document_url"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B]"
                :disabled="isUpdating"
              />
            </div>

            <!-- Alerte dépassement budget -->
            <div v-if="budgetExceeded" class="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-red-800">⚠️ Dépassement de budget détecté</p>
                  <p class="text-sm text-red-700">
                    Le budget par médecin ({{ eventsService.formatCurrency(budgetPerDoctor) }}) dépasse le seuil autorisé de 250€.
                    L'événement nécessitera une validation spéciale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="isUpdating || !isFormValid"
              class="bg-[#2C2C7B] text-white px-6 py-2 rounded-md text-sm hover:bg-[#1F1F5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="isUpdating">Modification en cours...</span>
              <span v-else>Sauvegarder les modifications</span>
            </button>
            
            <button
              type="button"
              @click="goBack"
              :disabled="isUpdating"
              class="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

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
import { ref, computed, onMounted } from 'vue'
import MainLayout from '../components/MainLayout.vue'
import NotificationToast from '../components/NotificationToast.vue'
import { useRouter, useRoute } from 'vue-router'
import type { UpdateEventVariables } from '../graphql/mutations/events.mutations'
import type { Event, Doctor, Laboratory } from '../graphql/queries/events.queries'
import eventsService from '../services/events.service'
import { notificationService } from '../services/notification.service'

const router = useRouter()
const route = useRoute()

// États
const event = ref<Event | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isUpdating = ref(false)
const updateError = ref<string | null>(null)
const doctors = ref<Doctor[]>([])
const laboratories = ref<Laboratory[]>([])
const loadingDoctors = ref(false)
const loadingLaboratories = ref(false)

// Formulaire
const form = ref({
  title: '',
  date: '',
  location: '',
  type: '',
  description: '',
  budget_allocated: 0,
  budget_used: 0,
  doctor_id: '',
  laboratory_id: '',
  document_url: ''
})

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const budgetPerDoctor = computed(() => {
  return eventsService.calculateBudgetPerDoctor(form.value.budget_allocated || 0)
})

const budgetExceeded = computed(() => {
  return eventsService.isBudgetExceeded(form.value.budget_allocated || 0)
})

const isFormValid = computed(() => {
  return form.value.title &&
         form.value.date &&
         form.value.location &&
         form.value.type &&
         form.value.doctor_id &&
         form.value.laboratory_id &&
         form.value.budget_allocated > 0
})

// Méthodes
const loadEvent = async () => {
  const eventId = route.params.id as string
  
  if (!eventId) {
    error.value = 'ID d\'événement manquant'
    loading.value = false
    return
  }
  
  try {
    event.value = await eventsService.getEvent(eventId)
    
    // Pré-remplir le formulaire
    form.value = {
      title: event.value.title,
      date: event.value.date,
      location: event.value.location,
      type: event.value.type,
      description: event.value.description || '',
      budget_allocated: event.value.budget_allocated,
      budget_used: event.value.budget_used || 0,
      doctor_id: event.value.doctor.id,
      laboratory_id: event.value.laboratory.id,
      document_url: event.value.document_url || ''
    }
    
  } catch (err: any) {
    console.error('Erreur lors du chargement de l\'événement:', err)
    error.value = err.message || 'Impossible de charger l\'événement'
  } finally {
    loading.value = false
  }
}

const loadDoctors = async () => {
  loadingDoctors.value = true
  try {
    doctors.value = await eventsService.getDoctors()
  } catch (err) {
    console.error('Erreur lors du chargement des médecins:', err)
  } finally {
    loadingDoctors.value = false
  }
}

const loadLaboratories = async () => {
  loadingLaboratories.value = true
  try {
    laboratories.value = await eventsService.getLaboratories()
  } catch (err) {
    console.error('Erreur lors du chargement des laboratoires:', err)
  } finally {
    loadingLaboratories.value = false
  }
}

const updateEvent = async () => {
  if (!isFormValid.value || !event.value) return
  
  isUpdating.value = true
  updateError.value = null
  
  try {
    const updateData: UpdateEventVariables = {
      id: event.value.id,
      input: {
        title: form.value.title,
        date: form.value.date,
        location: form.value.location,
        type: form.value.type,
        description: form.value.description || undefined,
        budget_allocated: form.value.budget_allocated,
        budget_used: form.value.budget_used || 0,
        doctor_id: form.value.doctor_id,
        laboratory_id: form.value.laboratory_id,
        document_url: form.value.document_url || undefined
      }
    }
    
    await eventsService.updateEvent(updateData)
    
    // Notification de succès
    notificationService.success(
      'Événement modifié',
      `L'événement "${form.value.title}" a été modifié avec succès.`
    )
    
    // Redirection vers les détails
    router.push(`/events/${event.value.id}`)
    
  } catch (err: any) {
    console.error('Erreur lors de la modification:', err)
    updateError.value = err.message || 'Une erreur est survenue lors de la modification de l\'événement'
    
    notificationService.error(
      'Erreur de modification',
      err.message || 'Une erreur est survenue lors de la modification de l\'événement'
    )
  } finally {
    isUpdating.value = false
  }
}

const goBack = () => {
  if (event.value) {
    router.push(`/events/${event.value.id}`)
  } else {
    router.push('/events')
  }
}

onMounted(() => {
  loadEvent()
  loadDoctors()
  loadLaboratories()
})
</script>