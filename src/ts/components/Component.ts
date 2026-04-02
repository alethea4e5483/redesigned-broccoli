/**
 * Base component class for building reusable UI components
 */
export abstract class Component {
  protected element: HTMLElement | null = null

  /**
   * Render the component and return the root element
   */
  abstract render(): HTMLElement

  /**
   * Get the rendered element
   */
  getElement(): HTMLElement {
    if (!this.element) {
      this.element = this.render()
    }
    return this.element
  }

  /**
   * Mount component to a target element
   */
  mount(target: HTMLElement | string): HTMLElement {
    const container =
      typeof target === 'string' ? document.querySelector(target) : target

    if (!container) {
      throw new Error('Target element not found')
    }

    const element = this.getElement()
    container.appendChild(element)
    return element
  }

  /**
   * Unmount component from DOM
   */
  unmount(): void {
    this.element?.remove()
    this.element = null
  }

  /**
   * Create a DOM element with optional attributes and classes
   */
  protected createElement(
    tag: string,
    options?: {
      id?: string
      classes?: string[]
      attrs?: Record<string, string>
      text?: string
      html?: string
    }
  ): HTMLElement {
    const element = document.createElement(tag)

    if (options?.id) {
      element.id = options.id
    }

    if (options?.classes) {
      element.classList.add(...options.classes)
    }

    if (options?.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        element.setAttribute(key, value)
      })
    }

    if (options?.text) {
      element.textContent = options.text
    }

    if (options?.html) {
      element.innerHTML = options.html
    }

    return element
  }

  /**
   * Query selector within component
   */
  protected query<T extends Element = Element>(selector: string): T | null {
    return this.getElement().querySelector(selector)
  }

  /**
   * Query all matching elements within component
   */
  protected queryAll<T extends Element = Element>(
    selector: string
  ): NodeListOf<T> {
    return this.getElement().querySelectorAll(selector)
  }

  /**
   * Add event listener to component element
   */
  protected on(
    event: string,
    selector: string,
    handler: EventListener
  ): void {
    this.query(selector)?.addEventListener(event, handler)
  }

  /**
   * Add event listener to root element
   */
  protected onRoot(event: string, handler: EventListener): void {
    this.getElement().addEventListener(event, handler)
  }
}
