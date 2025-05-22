export interface Doctor {
    id: number;
    name: string;
    email?: string;
    specialty?: string;
  }
  
  export interface Laboratory {
    id: number;
    name: string;
    contact_email?: string;
  }
  
  export interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    type: string;
    description?: string;
    status: EventStatus;
    budget_allocated?: number;
    budget_used?: number;
    doctor?: Doctor | string; // Pour gérer à la fois les objets Doctor et les chaînes
    laboratory?: Laboratory | string; // Pour gérer à la fois les objets Laboratory et les chaînes
    document_url?: string;
    created_at?: string;
    updated_at?: string;
    // Propriété pour les mocks
    budget?: string;
  }
  
  // Enumération pour le statut de l'événement
  export type EventStatus = 
    | 'En cours de création'
    | 'Première validation'
    | 'Deuxième validation'
    | 'À modifier'
    | 'En cours de soumission'
    | 'Événement en cours';
  
  // Types pour l'authentification
  export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  }
  
  export type UserRole = 'admin' | 'compliance' | 'user';
  
  // Types pour les réponses GraphQL
  export interface LoginResponse {
    user: User;
    success: boolean;
    message?: string;
  }
  
  export interface LogoutResponse {
    success: boolean;
    message?: string;
  }
  
  // Variables pour les requêtes
  export interface EventsQueryVariables {
    search?: string;
    status?: string;
    type?: string;
  }
  
  export interface EventDetailQueryVariables {
    id: number | string;
  }