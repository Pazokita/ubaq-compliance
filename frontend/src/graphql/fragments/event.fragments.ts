// src/graphql/fragments/event.fragments.ts
import gql from 'graphql-tag'

export const EVENT_BASIC_FRAGMENT = gql`
  fragment EventBasicFields on Event {
    id
    title
    date
    location
    type
    status
    budget_allocated
    budget_used
    doctor {
      id
      name
    }
    laboratory {
      id
      name
    }
  }
`

export const EVENT_DETAIL_FRAGMENT = gql`
  fragment EventDetailFields on Event {
    ...EventBasicFields
    description
    document_url
    created_at
    updated_at
    history {
      id
      action
      created_at
      user {
        id
        name
      }
    }
  }
  ${EVENT_BASIC_FRAGMENT}
`