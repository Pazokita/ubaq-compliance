import gql from 'graphql-tag'

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      date
      location
    }
  }
`