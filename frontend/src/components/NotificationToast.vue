<template>
    <!-- Notification container -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <!-- Success icon -->
              <svg
                v-if="type === 'success'"
                class="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <!-- Error icon -->
              <svg
                v-else-if="type === 'error'"
                class="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              
              <!-- Warning icon -->
              <svg
                v-else-if="type === 'warning'"
                class="h-6 w-6 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              
              <!-- Info icon -->
              <svg
                v-else
                class="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <!-- Content -->
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p
                class="text-sm font-medium"
                :class="{
                  'text-gray-900': type === 'success',
                  'text-red-900': type === 'error',
                  'text-yellow-900': type === 'warning',
                  'text-blue-900': type === 'info'
                }"
              >
                {{ title }}
              </p>
              <p
                v-if="message"
                class="mt-1 text-sm"
                :class="{
                  'text-gray-500': type === 'success',
                  'text-red-700': type === 'error',
                  'text-yellow-700': type === 'warning',
                  'text-blue-700': type === 'info'
                }"
              >
                {{ message }}
              </p>
            </div>
            
            <!-- Close button -->
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="close"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C2C7B]"
              >
                <span class="sr-only">Fermer</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  interface Props {
    type?: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    autoClose?: boolean
  }
  
  interface Emits {
    (e: 'close'): void
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    duration: 4000,
    autoClose: true
  })
  
  const emit = defineEmits<Emits>()
  
  const isVisible = ref(true)
  
  const close = () => {
    isVisible.value = false
    setTimeout(() => {
      emit('close')
    }, 150) // Attendre la fin de l'animation
  }
  
  onMounted(() => {
    if (props.autoClose) {
      setTimeout(() => {
        close()
      }, props.duration)
    }
  })
  </script>