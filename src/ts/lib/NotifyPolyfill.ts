/**
 * NotifyPolyfill - Provides notification system
 */

import { Notification, initializeNotifications } from './Notification'

declare global {
  interface Window {
    Notify?: typeof Notification
  }
}

// Initialize notifications on import
initializeNotifications()

export {}
