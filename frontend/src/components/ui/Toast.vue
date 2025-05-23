<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="visible"
          class="fixed top-0 right-0 mt-4 mr-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Success Icon -->
                <CheckCircleIcon 
                  v-if="type === 'success'" 
                  class="h-6 w-6 text-green-400" 
                  aria-hidden="true" 
                />
                <!-- Error Icon -->
                <XCircleIcon 
                  v-else-if="type === 'error'" 
                  class="h-6 w-6 text-red-400" 
                  aria-hidden="true" 
                />
                <!-- Warning Icon -->
                <ExclamationTriangleIcon 
                  v-else-if="type === 'warning'" 
                  class="h-6 w-6 text-yellow-400" 
                  aria-hidden="true" 
                />
                <!-- Info Icon -->
                <InformationCircleIcon 
                  v-else 
                  class="h-6 w-6 text-[#6A7DFF]" 
                  aria-hidden="true" 
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-[#2C2C7B]">{{ title }}</p>
                <p v-if="message" class="mt-1 text-sm text-[#1A1A1A]">{{ message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="close"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span class="sr-only">Fermer</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline';
  
  interface Props {
    type?: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    autoClose?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    duration: 5000,
    autoClose: true,
  });
  
  const emit = defineEmits<{
    close: [];
  }>();
  
  const visible = ref(false);
  
  const close = () => {
    visible.value = false;
    emit('close');
  };
  
  onMounted(() => {
    visible.value = true;
    
    if (props.autoClose) {
      setTimeout(() => {
        close();
      }, props.duration);
    }
  });
  </script>