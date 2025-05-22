<template>
    <div class="event-create">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-primary">Créer un nouvel événement</h1>
      </div>
      
      <form @submit.prevent="createEvent" class="bg-white shadow-md rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Titre</label>
            <input
              v-model="eventData.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="eventData.date"
              type="date"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Lieu</label>
            <input
              v-model="eventData.location"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Type d'événement</label>
            <select
              v-model="eventData.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Sélectionner un type</option>
              <option value="conference">Conférence</option>
              <option value="workshop">Workshop</option>
              <option value="dinner">Dîner</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Budget alloué (€)</label>
            <input
              v-model.number="eventData.budget_allocated"
              type="number"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Budget utilisé (€)</label>
            <input
              v-model.number="eventData.budget_used"
              type="number"
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Médecin invité</label>
            <select
              v-model="eventData.doctor_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Sélectionner un médecin</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Laboratoire organisateur</label>
            <select
              v-model="eventData.laboratory_id"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="">Sélectionner un laboratoire</option>
              <option v-for="lab in laboratories" :key="lab.id" :value="lab.id">
                {{ lab.name }}
              </option>
            </select>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="eventData.description"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            ></textarea>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Document justificatif</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="mt-1 block w-full"
            />
            <p class="text-xs text-gray-500 mt-1">Format PDF recommandé. Max 5MB.</p>
          </div>
        </div>
        
        <div v-if="error" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <router-link to="/events" class="btn-secondary">
            Annuler
          </router-link>
          <button type="submit" class="btn-primary" :disabled="loading">
            <LoadingSpinner v-if="loading" class="h-5 w-5 mr-2" />
            Créer l'événement
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMutation, useQuery } from '@vue/apollo-composable'
  import { CREATE_EVENT } from '@/graphql/mutations/events.mutations'
  import { GET_DOCTORS } from '@/graphql/queries/doctors.queries'
  import { GET_LABORATORIES } from '@/graphql/queries/laboratories.queries'
  import LoadingSpinner from '@/components/LoadingSpinner.vue'
  
  const router = useRouter()
  const error = ref('')
  const file = ref<File | null>(null)
  
  // Données de l'événement
  const eventData = ref({
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
  
  // Récupération des médecins
  const { result: doctorsResult } = useQuery(GET_DOCTORS)
  const doctors = computed(() => doctorsResult.value?.doctors || [])
  
  // Récupération des laboratoires
  const { result: labsResult } = useQuery(GET_LABORATORIES)
  const laboratories = computed(() => labsResult.value?.laboratories || [])
  
  // Mutation pour créer un événement
  const { mutate: createEventMutation, loading } = useMutation(CREATE_EVENT)
  
  // Gestion de l'upload de fichier
  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      file.value = target.files[0]
    }
  }
  
  // Création de l'événement
  async function createEvent() {
    error.value = ''
    
    try {
      // Si un fichier a été sélectionné, il faudrait l'uploader
      // Pour simplifier, on simule juste un nom de fichier pour le moment
      if (file.value) {
        eventData.value.document_url = `uploads/${file.value.name}`
        // Dans un cas réel, il faudrait implémenter l'upload via une mutation GraphQL spécifique
      }
      
      const { data } = await createEventMutation({
        input: {
          ...eventData.value,
          budget_allocated: Number(eventData.value.budget_allocated),
          budget_used: Number(eventData.value.budget_used),
        }
      })
      
      if (data?.createEvent) {
        router.push({ name: 'event-detail', params: { id: data.createEvent.id } })
      }
    } catch (err: any) {
      error.value = err.message || "Une erreur est survenue lors de la création de l'événement"
    }
  }
  </script>