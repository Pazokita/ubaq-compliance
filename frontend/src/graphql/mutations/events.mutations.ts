import gql from 'graphql-tag'
import { EVENT_DETAIL_FRAGMENT } from '../fragments/event.fragments'

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: EventInput!) {
    updateEvent(id: $id, input: $input) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      success
      message
    }
  }
`

export const VALIDATE_EVENT = gql`
  mutation ValidateEvent($id: ID!, $status: String!, $message: String) {
    validateEvent(id: $id, status: $status, message: $message) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`