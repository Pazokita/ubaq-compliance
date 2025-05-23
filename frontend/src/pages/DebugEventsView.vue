<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">🔧 Debug des Événements</h1>
      
      <!-- Test 1: Apollo Client -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Test 1: Apollo Client</h2>
        <button @click="testApolloClient" class="bg-blue-500 text-white px-4 py-2 rounded">
          Tester Apollo Client
        </button>
        <div v-if="apolloResult" class="mt-2 p-2 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(apolloResult, null, 2) }}</pre>
        </div>
      </div>
  
      <!-- Test 2: Query Events directe -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Test 2: Query Events Directe</h2>
        <button @click="testEventsQuery" class="bg-green-500 text-white px-4 py-2 rounded">
          Tester Query Events
        </button>
        <div v-if="eventsResult" class="mt-2 p-2 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(eventsResult, null, 2) }}</pre>
        </div>
      </div>
  
      <!-- Test 3: Service Events -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Test 3: Service Events</h2>
        <button @click="testEventsService" class="bg-purple-500 text-white px-4 py-2 rounded">
          Tester Events Service
        </button>
        <div v-if="serviceResult" class="mt-2 p-2 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(serviceResult, null, 2) }}</pre>
        </div>
      </div>
  
      <!-- Test 4: Auth Token -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Test 4: Auth Token</h2>
        <button @click="testAuthToken" class="bg-yellow-500 text-white px-4 py-2 rounded">
          Vérifier Token
        </button>
        <div v-if="tokenResult" class="mt-2 p-2 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(tokenResult, null, 2) }}</pre>
        </div>
      </div>
  
      <!-- Test 5: Import du Service -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Test 5: Import du Service</h2>
        <button @click="testServiceImport" class="bg-red-500 text-white px-4 py-2 rounded">
          Vérifier Import
        </button>
        <div v-if="importResult" class="mt-2 p-2 bg-gray-100 rounded">
          <pre>{{ JSON.stringify(importResult, null, 2) }}</pre>
        </div>
      </div>
  
      <!-- Erreurs -->
      <div v-if="debugError" class="bg-red-50 border border-red-200 rounded p-4 mb-4">
        <h3 class="text-red-800 font-semibold">Erreur:</h3>
        <pre class="text-red-700">{{ debugError }}</pre>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { apolloClient } from '../lib/apollo'
  
  // Imports directs pour les tests
  import gql from 'graphql-tag'
  
  // Test avec query simple
  const SIMPLE_EVENTS_QUERY = gql`
    query TestEvents {
      events {
        id
        title
        type
        status
      }
    }
  `
  
  // État
  const apolloResult = ref(null)
  const eventsResult = ref(null)
  const serviceResult = ref(null)
  const tokenResult = ref(null)
  const importResult = ref(null)
  const debugError = ref('')
  
  // Test 1: Apollo Client de base
  const testApolloClient = async () => {
    try {
      debugError.value = ''
      console.log('🔍 Test Apollo Client...')
      
      // Test simple de ping
      const result = await apolloClient.query({
        query: gql`
          query TestConnection {
            __typename
          }
        `,
        fetchPolicy: 'network-only'
      })
      
      apolloResult.value = {
        success: true,
        data: result.data,
        message: 'Apollo Client fonctionne !'
      }
      
      console.log('✅ Apollo Client OK:', result)
    } catch (error: any) {
      debugError.value = `Apollo Client Error: ${error.message}`
      apolloResult.value = {
        success: false,
        error: error.message
      }
      console.error('❌ Apollo Client Error:', error)
    }
  }
  
  // Test 2: Query Events directe
  const testEventsQuery = async () => {
    try {
      debugError.value = ''
      console.log('🔍 Test Events Query...')
      
      const result = await apolloClient.query({
        query: SIMPLE_EVENTS_QUERY,
        fetchPolicy: 'network-only'
      })
      
      eventsResult.value = {
        success: true,
        count: result.data.events?.length || 0,
        events: result.data.events?.slice(0, 2) || [], // Montrer seulement les 2 premiers
        message: `${result.data.events?.length || 0} événements trouvés`
      }
      
      console.log('✅ Events Query OK:', result)
    } catch (error: any) {
      debugError.value = `Events Query Error: ${error.message}`
      eventsResult.value = {
        success: false,
        error: error.message
      }
      console.error('❌ Events Query Error:', error)
    }
  }
  
  // Test 3: Service Events (avec import dynamique)
  const testEventsService = async () => {
    try {
      debugError.value = ''
      console.log('🔍 Test Events Service...')
      
      // Import dynamique pour tester
      const { eventsService } = await import('../services/events.service')
      
      console.log('Service importé:', eventsService)
      
      const events = await eventsService.getEvents()
      
      serviceResult.value = {
        success: true,
        count: events.length,
        events: events.slice(0, 2), // Montrer seulement les 2 premiers
        message: `Service OK: ${events.length} événements`
      }
      
      console.log('✅ Events Service OK:', events)
    } catch (error: any) {
      debugError.value = `Events Service Error: ${error.message}`
      serviceResult.value = {
        success: false,
        error: error.message,
        stack: error.stack
      }
      console.error('❌ Events Service Error:', error)
    }
  }
  
  // Test 4: Auth Token
  const testAuthToken = () => {
    try {
      debugError.value = ''
      
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      tokenResult.value = {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        tokenStart: token?.substring(0, 20) + '...' || 'Aucun token',
        hasUser: !!user,
        user: user ? JSON.parse(user) : null
      }
      
      console.log('✅ Token check:', tokenResult.value)
    } catch (error: any) {
      debugError.value = `Token Error: ${error.message}`
      tokenResult.value = {
        success: false,
        error: error.message
      }
    }
  }
  
  // Test 5: Import du Service
  const testServiceImport = async () => {
    try {
      debugError.value = ''
      console.log('🔍 Test Import Service...')
      
      // Test de tous les imports possibles
      const results: any = {}
      
      try {
        const service1 = await import('../services/events.service')
        results.events_service = {
          success: true,
          hasEventsService: !!service1.eventsService,
          hasDefault: !!service1.default,
          keys: Object.keys(service1)
        }
      } catch (e: any) {
        results.events_service = { success: false, error: e.message }
      }
      
      try {
        const service2 = await import('../services/events.service')
        results.eventsService = {
          success: true,
          hasEventsService: !!service2.eventsService,
          hasDefault: !!service2.default,
          keys: Object.keys(service2)
        }
      } catch (e: any) {
        results.eventsService = { success: false, error: e.message }
      }
      
      try {
        const queries = await import('../graphql/queries/events.queries')
        results.queries = {
          success: true,
          keys: Object.keys(queries)
        }
      } catch (e: any) {
        results.queries = { success: false, error: e.message }
      }
      
      importResult.value = results
      console.log('✅ Import check:', results)
    } catch (error: any) {
      debugError.value = `Import Error: ${error.message}`
      importResult.value = {
        success: false,
        error: error.message
      }
    }
  }
  </script>