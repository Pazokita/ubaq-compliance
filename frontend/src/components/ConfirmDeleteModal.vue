<template>
    <!-- Modal overlay -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="onCancel"
    >
      <!-- Modal content -->
      <div 
        class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">
                Confirmer la suppression
              </h3>
            </div>
          </div>
        </div>
  
        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-sm text-gray-700 mb-4">
            Êtes-vous sûr de vouloir supprimer l'événement 
            <span class="font-semibold text-gray-900">"{{ eventTitle }}"</span> ?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="text-sm">
                <p class="font-medium text-red-800">⚠️ Action irréversible</p>
                <p class="text-red-700 mt-1">
                  Cette action ne peut pas être annulée. L'événement et tous ses documents associés seront définitivement supprimés.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            @click="onCancel"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2C2C7B] focus:border-[#2C2C7B] disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="onConfirm"
            :disabled="isDeleting"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isDeleting ? 'Suppression...' : 'Supprimer définitivement' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  
  interface Props {
    isOpen: boolean
    eventTitle: string
    isDeleting?: boolean
  }
  
  interface Emits {
    (e: 'confirm'): void
    (e: 'cancel'): void
  }
  
  defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const onConfirm = () => {
    emit('confirm')
  }
  
  const onCancel = () => {
    emit('cancel')
  }
  
  // Handle ESC key
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel()
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
  </script>