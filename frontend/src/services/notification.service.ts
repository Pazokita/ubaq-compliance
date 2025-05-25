import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  autoClose?: boolean
}

// État global des notifications
const notifications = ref<Notification[]>([])

// Générer un ID unique
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const useNotifications = () => {
  
  // Ajouter une notification
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      id: generateId(),
      duration: 4000,
      autoClose: true,
      ...notification
    }
    
    notifications.value.push(newNotification)
    return newNotification.id
  }

  // Supprimer une notification
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Supprimer toutes les notifications
  const clearAll = () => {
    notifications.value = []
  }

  // Raccourcis pour les types de notifications
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 6000, 
      ...options
    })
  }

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}

export const notificationService = useNotifications()