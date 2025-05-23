import { ref } from 'vue'
import { apolloClient } from '../lib/apollo'

import { 
  GET_EVENTS, 
  GET_EVENT,
  GET_DOCTORS,
  GET_LABORATORIES,
  type Event,
  type Doctor,
  type Laboratory,
  type EventFilters
} from '../graphql/queries/events.queries'


import { 
  CREATE_EVENT, 
  UPDATE_EVENT, 
  DELETE_EVENT,
  VALIDATE_EVENT,
  type CreateEventVariables,
  type UpdateEventVariables,
  type ValidateEventVariables
} from '../graphql/mutations/events.mutations'


const events = ref<Event[]>([])
const loading = ref(false)
const error = ref<string | null>(null)


export const eventsService = {
  // État réactif
  events,
  loading,
  error,


  async getEvents(filters: EventFilters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await apolloClient.query({
        query: GET_EVENTS,
        variables: filters,
        fetchPolicy: 'network-only'
      })
      
      events.value = response.data.events || []
      
      return events.value
    } catch (err: any) {
      console.error('Erreur lors de la récupération des événements:', err)
      error.value = err.message || 'Impossible de récupérer les événements'
      events.value = []
      throw err
    } finally {
      loading.value = false
    }
  },


  async getEvent(id: string): Promise<Event> {
    loading.value = true
    error.value = null
    
    try {
      const response = await apolloClient.query({
        query: GET_EVENT,
        variables: { id },
        fetchPolicy: 'network-only'
      })
      
      return response.data.event
    } catch (err: any) {
      console.error('Erreur lors de la récupération de l\'événement:', err)
      error.value = err.message || 'Impossible de récupérer l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  },


  async createEvent(eventData: CreateEventVariables): Promise<Event> {
    loading.value = true
    error.value = null
    
    try {
      const response = await apolloClient.mutate({
        mutation: CREATE_EVENT,
        variables: eventData,
        refetchQueries: [
          { query: GET_EVENTS, variables: {} }
        ]
      })
      
      const newEvent = response.data.createEvent
      
      if (events.value.length > 0) {
        events.value.unshift(newEvent)
      }
      
      return newEvent
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'événement:', err)
      error.value = err.message || 'Impossible de créer l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  },

  async updateEvent(updateData: UpdateEventVariables): Promise<Event> {
    loading.value = true
    error.value = null
    
    try {
      const response = await apolloClient.mutate({
        mutation: UPDATE_EVENT,
        variables: updateData,
        refetchQueries: [
          { query: GET_EVENTS, variables: {} },
          { query: GET_EVENT, variables: { id: updateData.id } }
        ]
      })
      
      const updatedEvent = response.data.updateEvent
      
      const index = events.value.findIndex(e => e.id === updateData.id)
      if (index !== -1) {
        events.value[index] = updatedEvent
      }
      
      return updatedEvent
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'événement:', err)
      error.value = err.message || 'Impossible de mettre à jour l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  },

  async deleteEvent(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      const response = await apolloClient.mutate({
        mutation: DELETE_EVENT,
        variables: { id },
        refetchQueries: [
          { query: GET_EVENTS, variables: {} }
        ]
      })
      
      const index = events.value.findIndex(e => e.id === id)
      if (index !== -1) {
        events.value.splice(index, 1)
      }
      
      return response.data.deleteEvent
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'événement:', err)
      error.value = err.message || 'Impossible de supprimer l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  },

  async validateEvent(validationData: ValidateEventVariables): Promise<Event> {
    loading.value = true
    error.value = null
    
    try {
      const response = await apolloClient.mutate({
        mutation: VALIDATE_EVENT,
        variables: validationData,
        refetchQueries: [
          { query: GET_EVENTS, variables: {} },
          { query: GET_EVENT, variables: { id: validationData.id } }
        ]
      })
      
      const validatedEvent = response.data.validateEvent
      
      const index = events.value.findIndex(e => e.id === validationData.id)
      if (index !== -1) {
        events.value[index] = validatedEvent
      }
      
      return validatedEvent
    } catch (err: any) {
      console.error('Erreur lors de la validation de l\'événement:', err)
      error.value = err.message || 'Impossible de valider l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  },

  async approveEvent(id: string, comment?: string): Promise<Event> {
    return this.validateEvent({
      id,
      action: 'VALIDATE',
      comment
    })
  },

  async rejectEvent(id: string, comment: string): Promise<Event> {
    return this.validateEvent({
      id,
      action: 'REJECT',
      comment
    })
  },

  async requestModifications(id: string, comment: string): Promise<Event> {
    return this.validateEvent({
      id,
      action: 'REQUEST_MODIFICATION',
      comment
    })
  },

  async getDoctors(): Promise<Doctor[]> {
    try {
      const response = await apolloClient.query({
        query: GET_DOCTORS,
        fetchPolicy: 'cache-first'
      })
      
      return response.data.doctors
    } catch (err: any) {
      console.error('Erreur lors de la récupération des médecins:', err)
      throw err
    }
  },

  async getLaboratories(): Promise<Laboratory[]> {
    try {
      const response = await apolloClient.query({
        query: GET_LABORATORIES,
        fetchPolicy: 'cache-first'
      })
      
      return response.data.laboratories
    } catch (err: any) {
      console.error('Erreur lors de la récupération des laboratoires:', err)
      throw err
    }
  },

  clearError() {
    error.value = null
  },

  reset() {
    events.value = []
    error.value = null
    loading.value = false
  },


  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      'pending': 'En attente',
      'first_validation': 'Première validation',
      'second_validation': 'Validation finale',
      'to_modify': 'À modifier',
      'in_submission': 'En soumission',
      'in_progress': 'En cours',
      'rejected': 'Rejeté'
    }
    return statusLabels[status] || status
  },

  getTypeLabel(type: string): string {
    const typeLabels: Record<string, string> = {
      'conference': 'Conférence',
      'workshop': 'Atelier',
      'formation': 'Formation',
      'seminar': 'Séminaire',
      'presentation': 'Présentation'
    }
    return typeLabels[type] || type
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  },

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  },

  formatDateShort(date: string): string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
  },


  calculateBudgetPerDoctor(budgetAllocated: number): number {
    return budgetAllocated // 1 médecin par événement
  },

  isBudgetExceeded(budgetAllocated: number): boolean {
    return this.calculateBudgetPerDoctor(budgetAllocated) > 250
  },


  canEditEvent(event: Event, userRole: string): boolean {
    if (userRole === 'admin') return true
    return ['pending', 'to_modify'].includes(event.status)
  },

  canDeleteEvent(event: Event, userRole: string): boolean {
    if (userRole === 'admin') return true
    return event.status === 'pending'
  },

  canValidateEvent(event: Event, userRole: string): boolean {
    return ['compliance', 'admin'].includes(userRole) && 
           ['pending', 'first_validation', 'to_modify'].includes(event.status)
  }
}


export default eventsService