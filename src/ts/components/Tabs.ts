import { BaseComponent } from './BaseComponent'

/**
 * Mobile view tabs component for switching between request and response
 */
export class Tabs extends BaseComponent {
  private requestTab: HTMLElement | null = null
  private responseTab: HTMLElement | null = null
  private mobileViewTabs: HTMLElement | null = null
  private currentView: 'request' | 'response' = 'request'

  private viewChangeCallback?: (view: 'request' | 'response') => void

  init(): void {
    this.requestTab = document.getElementById('mobile-tab-request')
    this.responseTab = document.getElementById('mobile-tab-response')
    this.mobileViewTabs = document.getElementById('mobile-view-tabs')

    if (this.requestTab) {
      this.requestTab.addEventListener('click', () => this.switchToRequest())
    }

    if (this.responseTab) {
      this.responseTab.addEventListener('click', () => this.switchToResponse())
    }

    // Hide tabs on mobile by default
    this.hide()
  }

  /**
   * Set callback for view changes
   */
  onViewChange(callback: (view: 'request' | 'response') => void): void {
    this.viewChangeCallback = callback
  }

  /**
   * Switch to request tab
   */
  switchToRequest(): void {
    this.setActiveTab('request')
    this.currentView = 'request'
    this.viewChangeCallback?.('request')
  }

  /**
   * Switch to response tab
   */
  switchToResponse(): void {
    this.setActiveTab('response')
    this.currentView = 'response'
    this.viewChangeCallback?.('response')
  }

  /**
   * Set active tab styling
   */
  private setActiveTab(tab: 'request' | 'response'): void {
    const isRequest = tab === 'request'

    if (this.requestTab) {
      this.requestTab.classList.toggle('bg-[#ffcc99]', isRequest)
      this.requestTab.classList.toggle('text-black', isRequest)
      this.requestTab.classList.toggle('text-gray-300', !isRequest)
    }

    if (this.responseTab) {
      this.responseTab.classList.toggle('bg-[#ffcc99]', !isRequest)
      this.responseTab.classList.toggle('text-black', !isRequest)
      this.responseTab.classList.toggle('text-gray-300', isRequest)
    }
  }

  /**
   * Show tabs (mobile only)
   */
  show(): void {
    if (this.mobileViewTabs) {
      this.mobileViewTabs.classList.remove('hidden')
    }
  }

  /**
   * Hide tabs
   */
  hide(): void {
    if (this.mobileViewTabs) {
      this.mobileViewTabs.classList.add('hidden')
    }
  }

  /**
   * Check if on mobile view
   */
  isOnMobile(): boolean {
    return !window.matchMedia('(min-width: 1024px)').matches
  }

  /**
   * Get current active view
   */
  getCurrentView(): 'request' | 'response' {
    return this.currentView
  }
}
