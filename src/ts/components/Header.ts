import { BaseComponent } from './BaseComponent'
import { stateManager } from '@modules/state'

/**
 * Header component with mobile sidebar toggle
 */
export class Header extends BaseComponent {
  private mobileToggle: HTMLElement | null = null
  private overlay: HTMLElement | null = null

  init(): void {
    this.mobileToggle = this.querySelector('#mobileSidebarToggle')
    this.overlay = document.getElementById('overlay')

    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileSidebar())
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMobileSidebar())
    }
  }

  /**
   * Toggle mobile sidebar visibility
   */
  private toggleMobileSidebar(): void {
    const sidebar = document.getElementById('mobileSidebar')
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full')
      this.overlay?.classList.toggle('hidden')
    }
  }

  /**
   * Close mobile sidebar
   */
  private closeMobileSidebar(): void {
    const sidebar = document.getElementById('mobileSidebar')
    if (sidebar) {
      sidebar.classList.add('-translate-x-full')
      this.overlay?.classList.add('hidden')
    }
  }

  /**
   * Close sidebar when endpoint is selected
   */
  closeOnSelection(): void {
    this.closeMobileSidebar()
  }
}
