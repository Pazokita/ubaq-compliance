import gql from 'graphql-tag'
import { 
  EVENT_BASIC_FRAGMENT, 
  EVENT_DETAIL_FRAGMENT,
  DOCTOR_BASIC_FRAGMENT,
  LABORATORY_BASIC_FRAGMENT 
} from '../fragments/event.fragments'

export const GET_EVENTS = gql`
  query GetEvents($search: String, $status: String, $type: String) {
    events(search: $search, status: $status, type: $type) {
      ...EventBasicFields
    }
  }
  ${EVENT_BASIC_FRAGMENT}
`

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

export const GET_DOCTORS = gql`
  query GetDoctors {
    doctors {
      ...DoctorBasicFields
    }
  }
  ${DOCTOR_BASIC_FRAGMENT}
`

export const GET_LABORATORIES = gql`
  query GetLaboratories {
    laboratories {
      ...LaboratoryBasicFields
    }
  }
  ${LABORATORY_BASIC_FRAGMENT}
`

export interface Event {
  id: string
  title: string
  date: string
  location: string
  type: string
  description?: string
  status: string
  budget_allocated: number
  budget_used: number
  document_url?: string
  validation_comment?: string
  validated_by?: string
  validated_at?: string
  created_at: string
  updated_at: string
  

  doctor: {
    id: string
    first_name: string
    last_name: string
    name: string
    specialty?: string
  }
  
  laboratory: {
    id: string
    name: string
    city?: string
  }
  
  validator?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export interface Doctor {
  id: string
  first_name: string
  last_name: string
  name: string
  specialty?: string
}

export interface Laboratory {
  id: string
  name: string
  city?: string
}

export interface EventFilters {
  search?: string
  status?: string
  type?: string
}

export interface GetEventsResponse {
  events: Event[]
}

export interface GetEventResponse {
  event: Event
}

export interface GetDoctorsResponse {
  doctors: Doctor[]
}

export interface GetLaboratoriesResponse {
  laboratories: Laboratory[]
}