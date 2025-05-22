import gql from 'graphql-tag'
import { EVENT_BASIC_FRAGMENT, EVENT_DETAIL_FRAGMENT } from '../fragments/event.fragments'

export const GET_EVENTS = gql`
  query GetEvents($search: String, $status: String, $type: String) {
    events(search: $search, status: $status, type: $type) {
      ...EventBasicFields
    }
  }
  ${EVENT_BASIC_FRAGMENT}
`

export const GET_EVENT_DETAIL = gql`
  query GetEventDetail($id: ID!) {
    event(id: $id) {
      ...EventDetailFields
    }
  }
  ${EVENT_DETAIL_FRAGMENT}
`