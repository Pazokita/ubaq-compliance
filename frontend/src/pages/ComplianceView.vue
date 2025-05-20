<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Conformité</h1>
    
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Statut de conformité</label>
          <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]">
            <option value="">Tous les statuts</option>
            <option value="conforme">Conforme</option>
            <option value="non_conforme">Non conforme</option>
            <option value="a_verifier">À vérifier</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Laboratoire</label>
          <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A7350]">
            <option value="">Tous les laboratoires</option>
            <option value="medilab">MediLab</option>
            <option value="pharmaplus">PharmaPlus</option>
            <option value="oncobio">OncoBio</option>
            <option value="kidcare">KidCare</option>
            <option value="innohealth">InnoHealth</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Events to validate -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="border-b px-6 py-3">
        <h2 class="font-semibold text-[#1A7350]">Événements à valider ({{ eventsToValidate.length }})</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-3">Titre</th>
              <th class="px-6 py-3">Type</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Médecin</th>
              <th class="px-6 py-3">Laboratoire</th>
              <th class="px-6 py-3">Budget par médecin</th>
              <th class="px-6 py-3">Conformité</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="event in eventsToValidate" :key="event.id" class="hover:bg-gray-50">
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
                {{ event.doctor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.laboratory }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.budgetPerDoctor }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getComplianceClass(event.compliance)" class="px-2 py-1 rounded-full text-xs">
                  {{ event.compliance }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <router-link :to="`/events/${event.id}`" class="text-[#1A7350] hover:underline mr-3">
                  Vérifier
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Compliance reports -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="border-b px-6 py-3">
        <h2 class="font-semibold text-[#1A7350]">Rapports de conformité récents</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-3">Titre</th>
              <th class="px-6 py-3">Statut</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Validé par</th>
              <th class="px-6 py-3">Commentaire</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="report in complianceReports" :key="report.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ report.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getStatusClass(report.status)" class="px-2 py-1 rounded-full text-xs">
                  {{ report.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ report.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ report.validator }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ report.comment }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-[#1A7350] hover:underline mr-3">
                  Voir détails
                </button>
                <button class="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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

// Mock events to validate
const eventsToValidate = ref([
  {
    id: 1,
    title: 'Conférence Cardio 2025',
    type: 'Conférence',
    date: '18/05/2025',
    doctor: 'Dr. Martin',
    laboratory: 'MediLab',
    budgetPerDoctor: '320 €',
    compliance: 'Non conforme'
  },
  {
    id: 2,
    title: 'Formation Nouvelles Thérapies',
    type: 'Formation',
    date: '15/05/2025',
    doctor: 'Dr. Dupont',
    laboratory: 'PharmaPlus',
    budgetPerDoctor: '225 €',
    compliance: 'Conforme'
  },
  {
    id: 3,
    title: 'Séminaire Oncologie',
    type: 'Séminaire',
    date: '12/05/2025',
    doctor: 'Dr. Renard',
    laboratory: 'OncoBio',
    budgetPerDoctor: '250 €',
    compliance: 'À vérifier'
  }
]);

// Mock compliance reports
const complianceReports = ref([
  {
    id: 1,
    title: 'Workshop Pédiatrie',
    status: 'Validé',
    date: '10/05/2025',
    validator: 'Marie Dubois',
    comment: 'Conforme aux règles de budget'
  },
  {
    id: 2,
    title: 'Présentation Nouveaux Produits',
    status: 'Validé',
    date: '08/05/2025',
    validator: 'Pierre Martin',
    comment: 'Documents justificatifs vérifiés'
  },
  {
    id: 3,
    title: 'Séminaire Neurologie',
    status: 'Rejeté',
    date: '05/05/2025',
    validator: 'Marie Dubois',
    comment: 'Budget dépassé de plus de 30%'
  }
]);

// Get status class
const getStatusClass = (status: string) => {
  if (status === 'Validé') return 'bg-green-100 text-green-800';
  if (status === 'Rejeté') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

// Get compliance class
const getComplianceClass = (compliance: string) => {
  if (compliance === 'Conforme') return 'bg-green-100 text-green-800';
  if (compliance === 'Non conforme') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};
</script>