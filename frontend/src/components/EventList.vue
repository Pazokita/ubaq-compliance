<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Liste des événements</h2>
      <ul>
        <li v-for="event in events" :key="event.id" class="mb-2 p-2 border rounded">
          {{ event.title }} — {{ event.date }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useQuery } from '@vue/apollo-composable'
  import { GET_EVENTS } from '@/graphql/queries'
  import { ref, computed } from 'vue'
  
  const { result, loading, error } = useQuery(GET_EVENTS)
  const events = computed(() => result.value?.events || [])
  </script>