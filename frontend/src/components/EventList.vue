<script setup lang="ts">
// Données de démonstration
const events = [
  { 
    id: 1, 
    title: "Conférence sur les nouveaux antibiotiques", 
    date: "2025-06-15", 
    location: "Hôtel Mercure, Paris",
    budget: 1200,
    status: "pending"
  },
  { 
    id: 2, 
    title: "Workshop vaccinations pédiatriques", 
    date: "2025-07-22", 
    location: "CHU de Rouen",
    budget: 850,
    status: "approved"
  },
  { 
    id: 3, 
    title: "Présentation nouveaux dispositifs cardiaques", 
    date: "2025-08-05", 
    location: "Clinique du Cèdre, Bois-Guillaume",
    budget: 1500,
    status: "rejected"
  }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const getStatusBadge = (status) => {
  if (status === 'approved') return 'bg-green-100 text-green-800 border-green-200';
  if (status === 'rejected') return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
};

const getStatusText = (status) => {
  if (status === 'approved') return 'Validé';
  if (status === 'rejected') return 'Rejeté';
  return 'En attente';
};
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-[#2C2C7B]">📋 Liste des événements</h2>
      
      <div class="flex space-x-2">
        <input
          type="text"
          placeholder="Rechercher un événement..."
          class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6A7DFF] focus:border-[#6A7DFF]"
        />
        
        <button class="bg-[#2C2C7B] hover:bg-[#1f1f59] text-white px-4 py-2 rounded-md transition-colors">
          Ajouter
        </button>
      </div>
    </div>
    
    <!-- Cartes d'événements -->
    <div class="space-y-4">
      <div 
        v-for="event in events" 
        :key="event.id" 
        class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
      >
        <div class="flex justify-between">
          <h3 class="font-semibold text-lg text-[#2C2C7B]">{{ event.title }}</h3>
          
          <span 
            :class="['text-xs px-2 py-1 rounded-full border', getStatusBadge(event.status)]"
          >
            {{ getStatusText(event.status) }}
          </span>
        </div>
        
        <div class="mt-2 text-gray-600 space-y-1">
          <p class="flex items-center">
            <span class="mr-2">📅</span>
            <span>{{ formatDate(event.date) }}</span>
          </p>
          
          <p class="flex items-center">
            <span class="mr-2">📍</span>
            <span>{{ event.location }}</span>
          </p>
          
          <p class="flex items-center">
            <span class="mr-2">💰</span>
            <span>Budget: {{ event.budget }}€</span>
          </p>
        </div>
        
        <div class="mt-4 flex justify-end space-x-2">
          <button class="text-[#6A7DFF] hover:text-[#2C2C7B] px-2 py-1 rounded hover:bg-gray-100">
            Modifier
          </button>
          <button class="text-[#6A7DFF] hover:text-[#2C2C7B] px-2 py-1 rounded hover:bg-gray-100">
            Détails
          </button>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="mt-6 flex justify-center">
      <div class="flex space-x-1">
        <button class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
          &lt;
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-[#2C2C7B] text-white">
          1
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          2
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          3
        </button>
        <button class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>