/**
 * Base component class for all UI components
 */
export abstract class BaseComponent {
  protected element: HTMLElement | null = null

  constructor(selector: string | HTMLElement) {
    if (typeof selector === 'string') {
      this.element = document.querySelector(selector)
    } else {
      this.element = selector
    }
  }

  /**
   * Initialize component - called after DOM is ready
   */
  abstract init(): void

  /**
   * Clean up component - called before unmount
   */
  destroy(): void {
    // Override in subclasses
  }

  /**
   * Show component
   */
  show(): void {
    if (this.element) {
      this.element.classList.remove('hidden')
    }
  }

  /**
   * Hide component
   */
  hide(): void {
    if (this.element) {
      this.element.classList.add('hidden')
    }
  }

  /**
   * Check if component is visible
   */
  isVisible(): boolean {
    return this.element ? !this.element.classList.contains('hidden') : false
  }

  /**
   * Get inner element by selector
   */
  protected querySelector<T extends Element = Element>(selector: string): T | null {
    return this.element?.querySelector<T>(selector) ?? null
  }

  /**
   * Get multiple inner elements by selector
   */
  protected querySelectorAll<T extends Element = Element>(selector: string): NodeListOf<T> {
    return this.element?.querySelectorAll<T>(selector) ?? document.querySelectorAll<T>(selector)
  }

  /**
   * Add event listener to component
   */
  protected addEventListener<K extends keyof HTMLElementEventMap>(
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: AddEventListenerOptions
  ): void {
    if (this.element) {
      this.element.addEventListener(event as string, handler as EventListener, options)
    }
  }

  /**
   * Add event listener to inner element
   */
  protected addInnerEventListener<K extends keyof HTMLElementEventMap>(
    selector: string,
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any
  ): void {
    const el = this.querySelector<HTMLElement>(selector)
    if (el) {
      el.addEventListener(event as string, handler as EventListener)
    }
  }
}
