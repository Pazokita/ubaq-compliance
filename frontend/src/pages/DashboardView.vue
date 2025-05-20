<template>
  <MainLayout>
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Bienvenue sur votre <span class="text-[#1A7350]">espace</span></h1>
    
    <!-- User role selector -->
    <div class="mb-8 flex items-center space-x-6">
      <label class="flex items-center space-x-2">
        <input type="radio" name="role" class="form-radio text-[#1A7350]" checked>
        <span class="text-sm">Je suis le créateur</span>
      </label>
      <label class="flex items-center space-x-2">
        <input type="radio" name="role" class="form-radio text-[#1A7350]">
        <span class="text-sm">Je suis le validateur</span>
      </label>
    </div>
    
    <!-- Status cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div class="bg-blue-100 rounded-lg p-4 text-center">
        <div class="text-sm">En cours de création</div>
      </div>
      
      <div class="bg-blue-100 rounded-lg p-4 text-center">
        <div class="text-sm">Première validation</div>
      </div>
      
      <div class="bg-blue-100 rounded-lg p-4 text-center">
        <div class="text-sm">Deuxième validation</div>
      </div>
      
      <div class="bg-yellow-100 rounded-lg p-4 text-center">
        <div class="text-sm">À modifier</div>
      </div>
      
      <div class="bg-green-100 rounded-lg p-4 text-center">
        <div class="text-sm">En cours de soumission & gestion</div>
      </div>
      
      <div class="bg-green-100 rounded-lg p-4 text-center">
        <div class="text-sm">Événement en cours</div>
      </div>
    </div>
    
    <!-- Event list -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b">
        <h2 class="font-semibold">Événements récents</h2>
      </div>
      
      <div class="p-4">
        <table class="min-w-full">
          <thead>
            <tr class="text-left text-sm text-gray-500">
              <th class="pb-3 font-medium">Titre</th>
              <th class="pb-3 font-medium">Type</th>
              <th class="pb-3 font-medium">Date</th>
              <th class="pb-3 font-medium">Budget</th>
              <th class="pb-3 font-medium">Statut</th>
              <th class="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(event, index) in recentEvents" :key="index" class="text-sm">
              <td class="py-3">{{ event.title }}</td>
              <td class="py-3">{{ event.type }}</td>
              <td class="py-3">{{ event.date }}</td>
              <td class="py-3">{{ event.budget }}</td>
              <td class="py-3">
                <span :class="`px-2 py-1 rounded-full text-xs ${getStatusClass(event.status)}`">
                  {{ event.status }}
                </span>
              </td>
              <td class="py-3">
                <router-link :to="`/events/${event.id}`" class="text-[#1A7350] hover:underline">
                  Voir détails
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
import { ref } from 'vue';
import MainLayout from '@/components/MainLayout.vue';

// Mock data for recent events
const recentEvents = ref([
  {
    id: 1,
    title: 'Conférence Cardio 2025',
    type: 'Conférence',
    date: '18/05/2025',
    budget: '3 500 €',
    status: 'En cours de création'
  },
  {
    id: 2,
    title: 'Formation Nouvelles Thérapies',
    type: 'Formation',
    date: '15/05/2025',
    budget: '1 800 €',
    status: 'Première validation'
  },
  {
    id: 3,
    title: 'Séminaire Oncologie',
    type: 'Séminaire',
    date: '12/05/2025',
    budget: '4 200 €',
    status: 'À modifier'
  },
  {
    id: 4,
    title: 'Workshop Pédiatrie',
    type: 'Workshop',
    date: '10/05/2025',
    budget: '2 100 €',
    status: 'Deuxième validation'
  },
  {
    id: 5,
    title: 'Présentation Nouveaux Produits',
    type: 'Présentation',
    date: '08/05/2025',
    budget: '1 250 €',
    status: 'Événement en cours'
  }
]);

// Helper function to get status class
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