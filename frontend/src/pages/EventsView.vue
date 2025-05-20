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
            type="text" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]" 
            placeholder="Rechercher un événement..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]">
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
          <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]">
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
      <button class="bg-[#1A7350] text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-[#116340] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nouvel événement
      </button>
    </div>
    
    <!-- Events List -->
    <div class="bg-white rounded-lg shadow-sm">
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
            <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ event.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.doctor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.laboratory }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.budget }}
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
      </div>
    </div>
  </div>
</MainLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MainLayout from '@/components/MainLayout.vue';

// Filters
const searchQuery = ref('');
const statusFilter = ref('');
const typeFilter = ref('');


// Mock events data
const events = ref([
  {
    id: 1,
    title: 'Conférence Cardio 2025',
    type: 'Conférence',
    date: '18/05/2025',
    location: 'Paris',
    doctor: 'Dr. Martin',
    laboratory: 'MediLab',
    budget: '3 500 €',
    status: 'En cours de création'
  },
  {
    id: 2,
    title: 'Formation Nouvelles Thérapies',
    type: 'Formation',
    date: '15/05/2025',
    location: 'Lyon',
    doctor: 'Dr. Dupont',
    laboratory: 'PharmaPlus',
    budget: '1 800 €',
    status: 'Première validation'
  },
  {
    id: 3,
    title: 'Séminaire Oncologie',
    type: 'Séminaire',
    date: '12/05/2025',
    location: 'Marseille',
    doctor: 'Dr. Renard',
    laboratory: 'OncoBio',
    budget: '4 200 €',
    status: 'À modifier'
  },
  {
    id: 4,
    title: 'Workshop Pédiatrie',
    type: 'Workshop',
    date: '10/05/2025',
    location: 'Bordeaux',
    doctor: 'Dr. Petit',
    laboratory: 'KidCare',
    budget: '2 100 €',
    status: 'Deuxième validation'
  },
  {
    id: 5,
    title: 'Présentation Nouveaux Produits',
    type: 'Présentation',
    date: '08/05/2025',
    location: 'Lille',
    doctor: 'Dr. Thomas',
    laboratory: 'InnoHealth',
    budget: '1 250 €',
    status: 'Événement en cours'
  }
]);

// Filtered events based on search query and filters
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = searchQuery.value === '' || 
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.doctor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.laboratory.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.value.toLowerCase());
      
    const matchesStatus = statusFilter.value === '' || event.status === statusFilter.value;
    const matchesType = typeFilter.value === '' || event.type === typeFilter.value;
    
    return matchesSearch && matchesStatus && matchesType;
  });
});

// Get CSS class based on status
const getStatusClass = (status: string) => {
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