<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="visible" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <!-- Overlay -->
            <div 
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              @click="cancel"
            ></div>
            
            <!-- Modal -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to-class="opacity-100 translate-y-0 sm:scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 sm:scale-100"
              leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div :class="iconContainerClass" class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <component :is="iconComponent" :class="iconClass" aria-hidden="true" />
                    </div>
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 class="text-base font-semibold leading-6 text-[#2C2C7B]">
                        {{ title }}
                      </h3>
                      <div class="mt-2">
                        <p class="text-sm text-[#1A1A1A]">
                          {{ message }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    :class="confirmButtonClass"
                    class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto"
                    @click="confirm"
                    :disabled="loading"
                  >
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ confirmText }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="cancel"
                    :disabled="loading"
                  >
                    {{ cancelText }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import {
    ExclamationTriangleIcon,
    TrashIcon,
    CheckCircleIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline';
  
  interface Props {
    type?: 'danger' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'warning',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    loading: false,
  });
  
  const emit = defineEmits<{
    confirm: [];
    cancel: [];
  }>();
  
  const visible = ref(false);
  
  const iconComponent = computed(() => {
    switch (props.type) {
      case 'danger':
        return TrashIcon;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'success':
        return CheckCircleIcon;
      default:
        return ExclamationTriangleIcon;
    }
  });
  
  const iconContainerClass = computed(() => {
    switch (props.type) {
      case 'danger':
        return 'bg-red-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'success':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  });
  
  const iconClass = computed(() => {
    switch (props.type) {
      case 'danger':
        return 'h-6 w-6 text-red-600';
      case 'warning':
        return 'h-6 w-6 text-yellow-600';
      case 'success':
        return 'h-6 w-6 text-green-600';
      default:
        return 'h-6 w-6 text-gray-600';
    }
  });
  
  const confirmButtonClass = computed(() => {
    switch (props.type) {
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 text-white hover:bg-yellow-500 focus:ring-yellow-500';
      case 'success':
        return 'bg-green-600 text-white hover:bg-green-500 focus:ring-green-500';
      default:
        return 'bg-[#2C2C7B] text-white hover:bg-[#6A7DFF] focus:ring-[#2C2C7B]';
    }
  });
  
  const confirm = () => {
    emit('confirm');
  };
  
  const cancel = () => {
    visible.value = false;
    emit('cancel');
  };
  
  onMounted(() => {
    visible.value = true;
  });
  </script>