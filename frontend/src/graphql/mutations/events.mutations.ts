import gql from 'graphql-tag'
import { EVENT_DETAIL_FRAGMENT } from '../fragments/event.fragments'

// Mutation pour créer un événement
export const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $date: Date!
    $location: String!
    $type: String!
    $description: String
    $budget_allocated: Float!
    $budget_used: Float
    $doctor_id: ID!
    $laboratory_id: ID!
    $document_url: String
  ) {
    createEvent(
      title: $title
      date: $date
      location: $location
      type: $type
      description: $description
      budget_allocated: $budget_allocated
      budget_used: $budget_used
      doctor_id: $doctor_id
      laboratory_id: $laboratory_id
      document_url: $document_url
    ) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

// Mutation pour mettre à jour un événement
export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

// Mutation pour supprimer un événement
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`

// Mutation pour valider un événement
export const VALIDATE_EVENT = gql`
  mutation ValidateEvent($id: ID!, $action: ValidationAction!, $comment: String) {
    validateEvent(id: $id, action: $action, comment: $comment) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

export interface CreateEventVariables {
  title: string
  date: string
  location: string
  type: string
  description?: string
  budget_allocated: number
  budget_used?: number
  doctor_id: string
  laboratory_id: string
  document_url?: string
}

export interface UpdateEventVariables {
  id: string
  input: {
    title?: string
    date?: string
    location?: string
    type?: string
    description?: string
    budget_allocated?: number
    budget_used?: number
    doctor_id?: string
    laboratory_id?: string
    document_url?: string
  }
}

export interface ValidateEventVariables {
  id: string
  action: 'VALIDATE' | 'REJECT' | 'REQUEST_MODIFICATION'
  comment?: string
}

export interface CreateEventResponse {
  createEvent: Event
}

export interface UpdateEventResponse {
  updateEvent: Event
}

export interface DeleteEventResponse {
  deleteEvent: boolean
}

export interface ValidateEventResponse {
  validateEvent: Event
}

import type { Event } from '../queries/events.queries'