import { BaseComponent } from './BaseComponent'

/**
 * Search component for endpoint filtering
 */
export class Search extends BaseComponent {
  private searchInputs: Map<string, HTMLInputElement> = new Map()

  init(): void {
    this.setupSearch('endpointSearch', '#mobileEndpointList')
    this.setupSearch('endpointSearchDesktop', '#endpointList')
  }

  /**
   * Setup search functionality for an input
   */
  private setupSearch(inputId: string, listSelector: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement | null
    if (!input) return

    this.searchInputs.set(inputId, input)

    // Clear on page load
    input.value = ''

    input.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement
      const query = target.value.toLowerCase()

      const links = document.querySelectorAll(`${listSelector} .sidebar-link`)
      links.forEach((link) => {
        const text = link.textContent?.toLowerCase() || ''
        const shouldShow = text.includes(query)
        link.style.display = shouldShow ? '' : 'none'
      })
    })
  }

  /**
   * Clear all search inputs
   */
  clearAllInputs(): void {
    this.searchInputs.forEach((input) => {
      input.value = ''
      // Trigger change event
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  /**
   * Clear specific search input
   */
  clearInput(inputId: string): void {
    const input = this.searchInputs.get(inputId)
    if (input) {
      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }
}
