/**
 * Simple notification system replacement for simple-notify
 */

export interface NotifyOptions {
  status?: 'success' | 'error' | 'info'
  title?: string
  text?: string
  effect?: 'fade' | 'slide'
  speed?: number
  showIcon?: boolean
  showCloseButton?: boolean
  autoclose?: boolean
  autotimeout?: number
  type?: 'filled' | 'outline'
  position?: string
}

export class Notification {
  private options: NotifyOptions

  constructor(options: NotifyOptions = {}) {
    this.options = {
      status: 'info',
      effect: 'fade',
      speed: 300,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 3000,
      type: 'filled',
      position: 'right top',
      ...options
    }

    this.show()
  }

  private show(): void {
    const container = this.getContainer()
    const notification = this.createNotificationElement()
    container.appendChild(notification)

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10)

    // Auto close
    if (this.options.autoclose) {
      setTimeout(
        () => this.close(notification),
        this.options.autotimeout || 3000
      )
    }
  }

  private close(element: HTMLElement): void {
    element.classList.remove('show')
    setTimeout(() => element.remove(), 300)
  }

  private getContainer(): HTMLElement {
    let container = document.getElementById('notification-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'notification-container'
      container.style.position = 'fixed'
      container.style.top = '20px'
      container.style.right = '20px'
      container.style.zIndex = '9999'
      container.style.display = 'flex'
      container.style.flexDirection = 'column'
      container.style.gap = '10px'
      document.body.appendChild(container)
    }
    return container
  }

  private createNotificationElement(): HTMLElement {
    const div = document.createElement('div')
    div.className = `notification notification-${this.options.status} notification-${this.options.type}`
    div.style.opacity = '0'
    div.style.transition = 'opacity 0.3s ease-in-out'

    const statusColor = {
      'success': '#10b981',
      'error': '#ef4444',
      'info': '#3b82f6'
    }

    const icon = {
      'success': '✓',
      'error': '✕',
      'info': 'ℹ'
    }

    div.style.backgroundColor = statusColor[this.options.status || 'info']
    div.style.color = 'white'
    div.style.padding = '16px'
    div.style.borderRadius = '8px'
    div.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
    div.style.minWidth = '300px'
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.gap = '12px'

    if (this.options.showIcon) {
      const iconEl = document.createElement('span')
      iconEl.style.fontSize = '20px'
      iconEl.style.fontWeight = 'bold'
      iconEl.textContent = icon[this.options.status || 'info']
      div.appendChild(iconEl)
    }

    const contentDiv = document.createElement('div')
    contentDiv.style.flex = '1'

    if (this.options.title) {
      const titleEl = document.createElement('div')
      titleEl.style.fontWeight = 'bold'
      titleEl.style.marginBottom = '4px'
      titleEl.textContent = this.options.title
      contentDiv.appendChild(titleEl)
    }

    if (this.options.text) {
      const textEl = document.createElement('div')
      textEl.style.fontSize = '14px'
      textEl.style.opacity = '0.9'
      textEl.textContent = this.options.text
      contentDiv.appendChild(textEl)
    }

    div.appendChild(contentDiv)

    if (this.options.showCloseButton) {
      const closeBtn = document.createElement('button')
      closeBtn.style.background = 'none'
      closeBtn.style.border = 'none'
      closeBtn.style.color = 'white'
      closeBtn.style.cursor = 'pointer'
      closeBtn.style.fontSize = '18px'
      closeBtn.style.padding = '0'
      closeBtn.textContent = '✕'
      closeBtn.addEventListener('click', () => this.close(div))
      div.appendChild(closeBtn)
    }

    return div
  }
}

// Make globally available
declare global {
  interface Window {
    Notify?: typeof Notification
  }
}

export function initializeNotifications(): void {
  ;(window as any).Notify = Notification
}
