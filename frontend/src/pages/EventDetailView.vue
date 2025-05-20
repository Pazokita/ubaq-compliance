<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center">
        <button @click="goBack" class="mr-3 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Détail de l'événement</h1>
      </div>
      
      <!-- Status badge -->
      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
        {{ event.status }}
      </span>
    </div>
    
    <!-- Event details -->
    <div class="bg-white rounded-lg shadow-sm mb-6">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">{{ event.title }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold mb-4 text-[#1A7350]">Informations générales</h3>
            
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Type d'événement:</div>
                <div class="col-span-2 text-sm">{{ event.type }}</div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Date:</div>
                <div class="col-span-2 text-sm">{{ event.date }}</div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Lieu:</div>
                <div class="col-span-2 text-sm">{{ event.location }}</div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Médecin invité:</div>
                <div class="col-span-2 text-sm">{{ event.doctor }}</div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Laboratoire:</div>
                <div class="col-span-2 text-sm">{{ event.laboratory }}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-4 text-[#1A7350]">Informations budgétaires</h3>
            
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Budget alloué:</div>
                <div class="col-span-2 text-sm">{{ event.budget }}</div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Budget utilisé:</div>
                <div class="col-span-2 text-sm">{{ event.usedBudget }}</div>
              </div>
              
              <div class="grid grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500">Budget par médecin:</div>
                <div class="col-span-2 text-sm">{{ event.budgetPerDoctor }}</div>
              </div>
              
              <div v-if="event.budgetExceeded" class="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-red-800">Dépassement de budget</p>
                    <p class="text-sm text-red-700">Le budget par médecin dépasse le seuil autorisé de 250€.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Description section -->
        <div class="mt-6">
          <h3 class="font-semibold mb-3 text-[#1A7350]">Description</h3>
          <p class="text-sm">{{ event.description }}</p>
        </div>
        
        <!-- Supporting documents -->
        <div class="mt-6">
          <h3 class="font-semibold mb-3 text-[#1A7350]">Documents justificatifs</h3>
          
          <div v-if="event.documents.length > 0" class="space-y-2">
            <div v-for="(doc, index) in event.documents" :key="index" class="flex items-center p-2 border rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm">{{ doc.name }}</span>
              <button class="ml-auto text-[#1A7350] text-sm hover:underline">Télécharger</button>
            </div>
          </div>
          
          <div v-else class="text-sm text-gray-500">
            Aucun document justificatif n'a été téléchargé.
          </div>
        </div>
      </div>
    </div>
    
    <!-- Compliance actions -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h3 class="font-semibold mb-4 text-[#1A7350]">Actions</h3>
      
      <div class="flex space-x-3">
        <button class="bg-[#1A7350] text-white px-4 py-2 rounded-md text-sm hover:bg-[#116340] transition-colors">
          Valider l'événement
        </button>
        <button class="bg-white border border-[#1A7350] text-[#1A7350] px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
          Demander des modifications
        </button>
        <button class="bg-white border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50 transition-colors">
          Rejeter l'événement
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock event data
const event = ref({
  id: 1,
  title: 'Conférence Cardio 2025',
  type: 'Conférence',
  date: '18 mai 2025',
  location: 'Grand Hôtel - Paris',
  doctor: 'Dr. Martin',
  laboratory: 'MediLab',
  budget: '3 500 €',
  usedBudget: '3 200 €',
  budgetPerDoctor: '320 €',
  budgetExceeded: true,
  status: 'En cours de validation',
  description: 'Conférence sur les dernières avancées en cardiologie organisée par le laboratoire MediLab. Cette conférence réunira des spécialistes reconnus pour échanger sur les nouvelles méthodes de traitement des pathologies cardiaques.',
  documents: [
    { name: 'programme_conference.pdf', url: '#' },
    { name: 'budget_previsionnel.xlsx', url: '#' }
  ]
});

const goBack = () => {
  router.push('/events');
};
</script>