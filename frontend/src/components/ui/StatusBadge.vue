<template>
  <span 
    :class="badgeClasses"
    class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center"
  >
    <svg 
      v-if="showIcon" 
      :class="iconClasses"
      class="w-3 h-3 mr-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        :d="iconPath"
      />
    </svg>
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string 
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  size: 'md'
})

// Configuration des statuts
const statusConfig = {
  // Statuts de workflow principal
  draft: {
    text: 'Brouillon',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  },
  pending_validation: {
    text: 'En attente de validation',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  validated: {
    text: 'Validé',
    bgClass: 'bg-green-100',
    textClass: 'text-green-800',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  rejected: {
    text: 'Rejeté',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  
  // Statuts spéciaux
  budget_exceeded: {
    text: 'Budget dépassé',
    bgClass: 'bg-orange-100',
    textClass: 'text-orange-800',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  modifications_requested: {
    text: 'Modifications demandées',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-800',
    iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
  },
  
  // Statuts de conformité
  compliant: {
    text: 'Conforme',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-800',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  non_compliant: {
    text: 'Non conforme',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  
  // Statuts d'événement
  scheduled: {
    text: 'Programmé',
    bgClass: 'bg-indigo-100',
    textClass: 'text-indigo-800',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z'
  },
  ongoing: {
    text: 'En cours',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
    iconPath: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  completed: {
    text: 'Terminé',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-800',
    iconPath: 'M5 13l4 4L19 7'
  },
  cancelled: {
    text: 'Annulé',
    bgClass: 'bg-red-100',
    textClass: 'text-red-800',
    iconPath: 'M6 18L18 6M6 6l12 12'
  }
}

// Computed properties
const currentStatus = computed(() => {
  return statusConfig[props.status as keyof typeof statusConfig] || statusConfig.draft
})

const statusText = computed(() => {
  return currentStatus.value.text
})

const iconPath = computed(() => {
  return currentStatus.value.iconPath
})

const badgeClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-2'
  }
  
  return [
    currentStatus.value.bgClass,
    currentStatus.value.textClass,
    sizeClasses[props.size]
  ].join(' ')
})

const iconClasses = computed(() => {
  const sizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }
  
  return sizeClasses[props.size]
})
</script>