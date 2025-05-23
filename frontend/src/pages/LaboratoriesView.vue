<template>
  <MainLayout>
  
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Laboratoires</h1>
    
    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <input 
            type="text" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]" 
            placeholder="Rechercher un laboratoire..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
          <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]">
            <option value="">Tous les domaines</option>
            <option value="pharmaceutique">Pharmaceutique</option>
            <option value="medical">Matériel médical</option>
            <option value="biotech">Biotechnologie</option>
            <option value="diagnostic">Diagnostic</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Button to add a new laboratory -->
    <div class="flex justify-end mb-4">
      <button class="bg-[#1A7350] text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-[#116340] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nouveau laboratoire
      </button>
    </div>
    
    <!-- Laboratories List -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-3">Nom</th>
              <th class="px-6 py-3">Domaine</th>
              <th class="px-6 py-3">Contact</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Événements</th>
              <th class="px-6 py-3">Budget total</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="lab in laboratories" :key="lab.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ lab.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lab.domain }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lab.contact }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lab.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lab.eventsCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ lab.totalBudget }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-[#1A7350] hover:underline mr-3">
                  Détails
                </button>
                <button class="text-gray-500 hover:text-gray-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
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
import MainLayout from '../components/MainLayout.vue';
// Mock laboratories data
const laboratories = ref([
  {
    id: 1,
    name: 'MediLab',
    domain: 'Pharmaceutique',
    contact: 'Jean Dumont',
    email: 'contact@medilab.com',
    eventsCount: 5,
    totalBudget: '12 500 €'
  },
  {
    id: 2,
    name: 'PharmaPlus',
    domain: 'Pharmaceutique',
    contact: 'Marie Lefevre',
    email: 'contact@pharmaplus.com',
    eventsCount: 3,
    totalBudget: '8 200 €'
  },
  {
    id: 3,
    name: 'OncoBio',
    domain: 'Biotechnologie',
    contact: 'Pierre Lambert',
    email: 'contact@oncobio.com',
    eventsCount: 2,
    totalBudget: '5 800 €'
  },
  {
    id: 4,
    name: 'KidCare',
    domain: 'Matériel médical',
    contact: 'Lucie Martin',
    email: 'contact@kidcare.com',
    eventsCount: 4,
    totalBudget: '9 700 €'
  },
  {
    id: 5,
    name: 'InnoHealth',
    domain: 'Diagnostic',
    contact: 'David Roux',
    email: 'contact@innohealth.com',
    eventsCount: 2,
    totalBudget: '6 900 €'
  }
]);
</script>