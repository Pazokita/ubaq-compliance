export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  specialty?: string;
}

export interface Laboratory {
  id: number;
  name: string;
  city?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'compliance' | 'user';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  type: EventType;
  description?: string;
  status: EventStatus;
  budget_allocated: number;
  budget_used: number;
  document_url?: string;
  validation_comment?: string;
  validated_at?: string;
  doctor: Doctor | string; // Pour compatibilité mocks
  laboratory: Laboratory | string; // Pour compatibilité mocks
  created_at: string;
  updated_at: string;
  
  // Propriétés pour la compatibilité avec les mocks
  budget?: string;
}

// Types d'événements
export type EventType = 
  | 'conference'
  | 'workshop'
  | 'formation'
  | 'seminar'
  | 'presentation';

// Statuts d'événements
export type EventStatus = 
  | 'pending'
  | 'first_validation'
  | 'second_validation'
  | 'to_modify'
  | 'in_submission'
  | 'in_progress'
  | 'rejected';

// Labels pour l'affichage
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  pending: 'En cours de création',
  first_validation: 'Première validation',
  second_validation: 'Deuxième validation',
  to_modify: 'À modifier',
  in_submission: 'En cours de soumission',
  in_progress: 'Événement en cours',
  rejected: 'Rejeté'
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  conference: 'Conférence',
  workshop: 'Workshop',
  formation: 'Formation',
  seminar: 'Séminaire',
  presentation: 'Présentation'
};

// Actions de validation
export type ValidationAction = 'VALIDATE' | 'REJECT' | 'REQUEST_MODIFICATION';

// Variables pour les requêtes GraphQL
export interface EventsQueryVariables {
  search?: string;
  status?: string;
  type?: string;
}

export interface EventDetailQueryVariables {
  id: number | string;
}

// Variables pour les mutations
export interface CreateEventVariables {
  title: string;
  date: string;
  location: string;
  type: EventType;
  description?: string;
  budget_allocated: number;
  budget_used?: number;
  doctor_id: string;
  laboratory_id: string;
  document_url?: string;
}

export interface UpdateEventVariables {
  id: string;
  input: Partial<Omit<CreateEventVariables, 'doctor_id' | 'laboratory_id'>> & {
    doctor_id?: string;
    laboratory_id?: string;
  };
}

export interface ValidateEventVariables {
  id: string;
  action: ValidationAction;
  comment?: string;
}

// Réponses GraphQL
export interface LoginResponse {
  user: User;
  success: boolean;
  message?: string;
}

export interface EventResponse {
  event: Event;
}

export interface EventsResponse {
  events: Event[];
}