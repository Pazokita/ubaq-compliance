<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Médecins</h1>
    
    <!-- Filtres -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
          <input 
            type="text" 
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]" 
            placeholder="Rechercher un médecin..."
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
          <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]">
            <option value="">Toutes les spécialités</option>
            <option value="cardiologie">Cardiologie</option>
            <option value="neurologie">Neurologie</option>
            <option value="pediatrie">Pédiatrie</option>
            <option value="oncologie">Oncologie</option>
            <option value="generaliste">Médecin généraliste</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Button to add a new doctor -->
    <div class="flex justify-end mb-4">
      <button class="bg-[#1A7350] text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-[#116340] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nouveau médecin
      </button>
    </div>
    
    <!-- Doctors List -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-3">Nom</th>
              <th class="px-6 py-3">Spécialité</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Téléphone</th>
              <th class="px-6 py-3">Événements</th>
              <th class="px-6 py-3">Budget total</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doctor in doctors" :key="doctor.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ doctor.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ doctor.specialty }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ doctor.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ doctor.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ doctor.eventsCount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ doctor.totalBudget }}
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Mock doctors data
const doctors = ref([
  {
    id: 1,
    name: 'Dr. Martin Dupont',
    specialty: 'Cardiologie',
    email: 'martin.dupont@example.com',
    phone: '01 23 45 67 89',
    eventsCount: 3,
    totalBudget: '4 500 €'
  },
  {
    id: 2,
    name: 'Dr. Sophie Bernard',
    specialty: 'Neurologie',
    email: 'sophie.bernard@example.com',
    phone: '01 23 45 67 90',
    eventsCount: 2,
    totalBudget: '3 200 €'
  },
  {
    id: 3,
    name: 'Dr. Thomas Laurent',
    specialty: 'Pédiatrie',
    email: 'thomas.laurent@example.com',
    phone: '01 23 45 67 91',
    eventsCount: 1,
    totalBudget: '1 800 €'
  },
  {
    id: 4,
    name: 'Dr. Julie Petit',
    specialty: 'Oncologie',
    email: 'julie.petit@example.com',
    phone: '01 23 45 67 92',
    eventsCount: 4,
    totalBudget: '5 700 €'
  },
  {
    id: 5,
    name: 'Dr. Philippe Moreau',
    specialty: 'Médecin généraliste',
    email: 'philippe.moreau@example.com',
    phone: '01 23 45 67 93',
    eventsCount: 2,
    totalBudget: '2 900 €'
  }
]);
</script>