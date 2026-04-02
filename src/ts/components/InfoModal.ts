import { BaseComponent } from './BaseComponent'

/**
 * Info modal component with application information
 */
export class InfoModal extends BaseComponent {
  private closeBtn: HTMLElement | null = null

  init(): void {
    this.element = document.getElementById('info-modal')
    this.closeBtn = this.querySelector('#info-modal-close')

    this.setupEventListeners()
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    const infoBtn = document.getElementById('info-btn')
    if (infoBtn) {
      infoBtn.addEventListener('click', () => this.open())
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close())
    }

    // Close on backdrop click
    if (this.element) {
      this.element.addEventListener('click', (e: Event) => {
        if (e.target === this.element) {
          this.close()
        }
      })
    }

    // Close on ESC key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.close()
      }
    })
  }

  /**
   * Open modal
   */
  open(): void {
    if (this.element) {
      this.element.classList.remove('hidden')
    }
  }

  /**
   * Close modal
   */
  close(): void {
    if (this.element) {
      this.element.classList.add('hidden')
    }
  }

  /**
   * Toggle modal visibility
   */
  toggle(): void {
    if (this.isVisible()) {
      this.close()
    } else {
      this.open()
    }
  }
}
