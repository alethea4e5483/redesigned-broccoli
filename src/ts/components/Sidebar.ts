import { BaseComponent } from './BaseComponent'
import { Endpoint } from '@types/endpoint'
import type { Form } from './Form'

/**
 * Sidebar component for displaying endpoints
 */
export class Sidebar extends BaseComponent {
  private endpoints: Endpoint[] = []
  private selectedEndpoint: Endpoint | null = null
  private onEndpointSelect?: (endpoint: Endpoint) => void
  private formComponent?: Form

  constructor(selector: string, endpoints: Endpoint[], form?: Form) {
    super(selector)
    this.endpoints = endpoints
    this.formComponent = form
  }

  init(): void {
    this.renderEndpoints()
  }

  /**
   * Set callback when endpoint is selected
   */
  onSelect(callback: (endpoint: Endpoint) => void): void {
    this.onEndpointSelect = callback
  }

  /**
   * Render all endpoints in sidebar
   */
  private renderEndpoints(): void {
    // Desktop sidebar
    this.renderSidebarList('#endpointList')
    // Mobile sidebar
    this.renderSidebarList('#mobileEndpointList')
  }

  /**
   * Render endpoint list in specified selector
   */
  private renderSidebarList(selector: string): void {
    const list = document.querySelector(selector)
    if (!list) return

    list.innerHTML = ''

    this.endpoints.forEach((ep) => {
      const div = document.createElement('div')
      div.className =
        'sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex items-start gap-1 flex-col justify-between'

      const a = document.createElement('a')
      a.textContent = ep.name
      a.className = 'flex font-semibold justify-between font-poppins items-center gap-1'
      div.appendChild(a)

      div.addEventListener('click', (event) => this.selectEndpoint(ep, selector, event))

      list.appendChild(div)
    })
  }

  /**
   * Handle endpoint selection
   */
  private selectEndpoint(ep: Endpoint, listSelector: string, event: Event): void {
    this.selectedEndpoint = ep

    // Remove selection from all links in this list
    const list = document.querySelector(listSelector)
    if (list) {
      list.querySelectorAll('.sidebar-link').forEach((el) => {
        el.classList.remove('sb-selected')
      })
    }

    // Add selection to clicked link
    const clickedLink = event.currentTarget as HTMLElement
    if (clickedLink) {
      clickedLink.classList.add('sb-selected')
    }

    // Update endpoint details
    const titleEl = document.getElementById('endpointTitle')
    const pathEl = document.getElementById('endpointPath')
    const descEl = document.getElementById('endpointDesc')

    if (titleEl) titleEl.textContent = ep.name
    if (pathEl) pathEl.textContent = ep.endpoint
    if (descEl) descEl.textContent = ep.desc || ''

    // Clear previous response
    const responseResultDiv = document.getElementById('responseResult')
    if (responseResultDiv) {
      responseResultDiv.innerHTML = '<span class="text-left">Nothing returned yet.</span>'
    }

    // Render form for the selected endpoint
    if (this.formComponent) {
      console.log(`Sidebar: Rendering form for ${ep.name}`)
      this.formComponent.renderForm(ep)
    } else {
      console.warn('Sidebar: Form component not available')
    }

    // Trigger callback
    this.onEndpointSelect?.(ep)
  }

  /**
   * Get currently selected endpoint
   */
  getSelectedEndpoint(): Endpoint | null {
    return this.selectedEndpoint
  }

  /**
   * Update endpoints list
   */
  setEndpoints(endpoints: Endpoint[]): void {
    this.endpoints = endpoints
    this.renderEndpoints()
  }
}
