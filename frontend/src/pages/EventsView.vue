<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { GET_EVENTS } from '../graphql/queries/events.queries';
import type { Event, EventsQueryVariables, EventStatus } from '../types';


// Filters
const searchQuery = ref('');
const statusFilter = ref('');
const typeFilter = ref('');

// GraphQL Query
const { result, loading, error, refetch } = useQuery<{ events: Event[] }, EventsQueryVariables>(
  GET_EVENTS,
  () => ({
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    type: typeFilter.value || undefined,
  }),
  { fetchPolicy: 'cache-and-network' }
);

// Fallback mock data (utilisé si la requête Apollo échoue)
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Conférence Cardio 2025',
    type: 'Conférence',
    date: '2025-05-18',
    location: 'Paris',
    doctor: 'Dr. Martin',  // Format des données mockées
    laboratory: 'MediLab', // Format des données mockées
    budget: '3 500 €',     // Format des données mockées
    status: 'En cours de création' as EventStatus
  },
  {
    id: 2,
    title: 'Formation Nouvelles Thérapies',
    type: 'Formation',
    date: '2025-05-15',
    location: 'Lyon',
    doctor: 'Dr. Dupont',
    laboratory: 'PharmaPlus',
    budget: '1 800 €',
    status: 'Première validation' as EventStatus
  },
  {
    id: 3,
    title: 'Séminaire Oncologie',
    type: 'Séminaire',
    date: '2025-05-12',
    location: 'Marseille',
    doctor: 'Dr. Renard',
    laboratory: 'OncoBio',
    budget: '4 200 €',
    status: 'À modifier' as EventStatus
  },
  {
    id: 4,
    title: 'Workshop Pédiatrie',
    type: 'Workshop',
    date: '2025-05-10',
    location: 'Bordeaux',
    doctor: 'Dr. Petit',
    laboratory: 'KidCare',
    budget: '2 100 €',
    status: 'Deuxième validation' as EventStatus
  },
  {
    id: 5,
    title: 'Présentation Nouveaux Produits',
    type: 'Présentation',
    date: '2025-05-08',
    location: 'Lille',
    doctor: 'Dr. Thomas',
    laboratory: 'InnoHealth',
    budget: '1 250 €',
    status: 'Événement en cours' as EventStatus
  }
];

// Affiche les événements de l'API ou les données mockées en cas d'erreur
const displayedEvents = computed<Event[]>(() => {
  if (result.value && result.value.events) {
    // Filtrage côté client (optionnel si le serveur le fait déjà)
    return result.value.events.filter(event => {
      const matchesSearch = !searchQuery.value || 
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.value.toLowerCase());
      
      const matchesStatus = !statusFilter.value || event.status === statusFilter.value;
      const matchesType = !typeFilter.value || event.type === typeFilter.value;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }
  
  // Utiliser les mocks si l'API n'est pas disponible
  return mockEvents.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (typeof event.doctor === 'string' && event.doctor.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (typeof event.laboratory === 'string' && event.laboratory.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      event.location.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value;
    const matchesType = !typeFilter.value || event.type === typeFilter.value;
    
    return matchesSearch && matchesStatus && matchesType;
  });
});

// Refetch when filters change
watch([searchQuery, statusFilter, typeFilter], () => {
  refetch();
});

// Helpers pour gérer les différents formats de données (API vs mock)
const getDoctorName = (event: Event): string => {
  if (typeof event.doctor === 'string') return event.doctor;
  return event.doctor?.name || 'Non assigné';
};

const getLaboratoryName = (event: Event): string => {
  if (typeof event.laboratory === 'string') return event.laboratory;
  return event.laboratory?.name || 'Non assigné';
};

const formatBudget = (event: Event): string => {
  if (event.budget) return event.budget; // Format des données mockées
  
  // Format des données de l'API
  if (event.budget_allocated !== undefined && event.budget_used !== undefined) {
    return `${event.budget_used} / ${event.budget_allocated} €`;
  }
  
  return 'N/A';
};

// Format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  } catch (e) {
    return dateString; // Retourner la chaîne d'origine si le format n'est pas valide
  }
};

// Get status class
const getStatusClass = (status: EventStatus): string => {
  switch (status) {
    case 'En cours de création':
    case 'Première validation':
    case 'Deuxième validation':
      return 'bg-blue-100 text-blue-800';
    case 'À modifier':
      return 'bg-yellow-100 text-yellow-800';
    case 'En cours de soumission':
    case 'Événement en cours':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>
<template>
  <MainLayout>
    <div>
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Événements</h1>
      
      <!-- Filtres -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input 
              v-model="searchQuery"
              type="text" 
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]" 
              placeholder="Rechercher un événement..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select 
              v-model="statusFilter"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]"
            >
              <option value="">Tous les statuts</option>
              <option value="en_creation">En cours de création</option>
              <option value="premiere_validation">Première validation</option>
              <option value="deuxieme_validation">Deuxième validation</option>
              <option value="a_modifier">À modifier</option>
              <option value="en_soumission">En cours de soumission</option>
              <option value="en_cours">Événement en cours</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type d'événement</label>
            <select 
              v-model="typeFilter"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]"
            >
              <option value="">Tous les types</option>
              <option value="conférence">Conférence</option>
              <option value="formation">Formation</option>
              <option value="séminaire">Séminaire</option>
              <option value="workshop">Workshop</option>
              <option value="présentation">Présentation</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Button to create a new event -->
      <div class="flex justify-end mb-4">
        <router-link to="/events/create" class="bg-[#1A7350] text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-[#116340] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouvel événement
        </router-link>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <svg class="animate-spin h-8 w-8 mx-auto text-[#1A7350]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-600">Chargement des événements...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm p-6">
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ error.message || "Une erreur est survenue lors du chargement des événements." }}
              </p>
            </div>
          </div>
        </div>
        <button 
          @click="refetch"
          class="bg-[#1A7350] text-white px-4 py-2 rounded-md"
        >
          Réessayer
        </button>
      </div>
      
      <!-- Events List -->
      <div v-else class="bg-white rounded-lg shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th class="px-6 py-3">Titre</th>
                <th class="px-6 py-3">Type</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Lieu</th>
                <th class="px-6 py-3">Médecin invité</th>
                <th class="px-6 py-3">Laboratoire</th>
                <th class="px-6 py-3">Budget</th>
                <th class="px-6 py-3">Statut</th>
                <th class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in displayedEvents" :key="event.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ event.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(event.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getDoctorName(event) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getLaboratoryName(event) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatBudget(event) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(event.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ event.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <router-link :to="`/events/${event.id}`" class="text-[#1A7350] hover:underline mr-3">
                    Détails
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Empty State (inside table) -->
          <div v-if="displayedEvents.length === 0" class="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-gray-600">Aucun événement trouvé avec ces critères de recherche.</p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

