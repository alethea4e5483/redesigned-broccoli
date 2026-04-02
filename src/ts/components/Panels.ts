import { BaseComponent } from './BaseComponent'

/**
 * Request and Response panels component
 */
export class Panels extends BaseComponent {
  private requestPanel: HTMLElement | null = null
  private responsePanel: HTMLElement | null = null
  private responseBadge: HTMLElement | null = null
  private responseTab: HTMLElement | null = null

  init(): void {
    this.requestPanel = document.getElementById('request-panel')
    this.responsePanel = document.getElementById('response-panel')
    this.responseBadge = document.getElementById('mobile-response-badge')
    this.responseTab = document.getElementById('mobile-tab-response')
  }

  /**
   * Show request panel and hide response panel
   */
  showRequest(): void {
    if (this.requestPanel) this.requestPanel.classList.remove('hidden')
    if (this.responsePanel) this.responsePanel.classList.add('hidden')
  }

  /**
   * Show response panel and hide request panel
   */
  showResponse(): void {
    if (this.requestPanel) this.requestPanel.classList.add('hidden')
    if (this.responsePanel) this.responsePanel.classList.remove('hidden')
  }

  /**
   * Show both panels (desktop view)
   */
  showBoth(): void {
    if (this.requestPanel) this.requestPanel.classList.remove('hidden')
    if (this.responsePanel) this.responsePanel.classList.remove('hidden')
  }

  /**
   * Clear response result
   */
  clearResponse(): void {
    const responseResult = document.getElementById('responseResult')
    if (responseResult) {
      responseResult.innerHTML = '<span class="text-left">Nothing returned yet.</span>'
    }
  }

  /**
   * Set response content
   */
  setResponseContent(content: string): void {
    const responseResult = document.getElementById('responseResult')
    if (responseResult) {
      responseResult.innerHTML = content
    }
  }

  /**
   * Mark response as ready with visual indicator
   */
  markResponseReady(): void {
    if (this.responseBadge) {
      this.responseBadge.classList.remove('hidden')
    }
    if (this.responseTab) {
      this.responseTab.classList.add('animate-pulse')
    }
  }

  /**
   * Clear response attention indicator
   */
  clearResponseAttention(): void {
    if (this.responseBadge) {
      this.responseBadge.classList.add('hidden')
    }
    if (this.responseTab) {
      this.responseTab.classList.remove('animate-pulse')
    }
  }
}
