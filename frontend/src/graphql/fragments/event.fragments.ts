import gql from 'graphql-tag';


export const EVENT_BASIC_FRAGMENT = gql`
  fragment EventBasicFields on Event {
    id
    title
    date
    created_at
    location
    type
    status
    budget_allocated
    budget_used
    doctor {
      id
      name
      specialty
    }
    laboratory {
      id
      name
      city
    }
  }
`;


export const EVENT_DETAIL_FRAGMENT = gql`
  fragment EventDetailFields on Event {
    ...EventBasicFields
    description
    document_url
    validation_comment
    validated_at
    validated_by
    validator {
      id
      name
      email
    }
    created_at
    updated_at
  }
  ${EVENT_BASIC_FRAGMENT}
`;


export const EVENT_VALIDATION_FRAGMENT = gql`
  fragment EventValidationFields on Event {
    id
    title
    status
    budget_allocated
    budget_used
    validation_comment
    validated_at
    validator {
      id
      name
    }
    doctor {
      id
      name
    }
  }
`;

export const EVENT_REFERENCE_FRAGMENT = gql`
  fragment EventReferenceFields on Event {
    id
    title
    date
    status
  }
`;

// Fragment pour les médecins (réutilisable)
export const DOCTOR_BASIC_FRAGMENT = gql`
  fragment DoctorBasicFields on Doctor {
    id
    first_name
    last_name
    name
    specialty
  }
`;

// Fragment pour les laboratoires (réutilisable)
export const LABORATORY_BASIC_FRAGMENT = gql`
  fragment LaboratoryBasicFields on Laboratory {
    id
    name
    city
  }
`;