/**
 * Shared utility functions for DOM manipulation and proto handling
 */

export function getElement<T extends Element = Element>(selector: string): T | null {
  return document.querySelector<T>(selector)
}

export function getElements<T extends Element = Element>(selector: string): NodeListOf<T> {
  return document.querySelectorAll<T>(selector)
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string | boolean>
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) el.setAttribute(key, '')
      } else {
        el.setAttribute(key, value)
      }
    })
  }
  return el
}

export function addClass(element: Element, ...classes: string[]): void {
  element.classList.add(...classes)
}

export function removeClass(element: Element, ...classes: string[]): void {
  element.classList.remove(...classes)
}

export function toggleClass(element: Element, className: string, force?: boolean): void {
  element.classList.toggle(className, force)
}

export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className)
}

export function setText(element: Element, text: string): void {
  element.textContent = text
}

export function setHTML(element: Element, html: string): void {
  element.innerHTML = html
}

export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  event: K,
  handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions
): void {
  element.addEventListener(event as string, handler as EventListener, options)
}

export function showNotification(
  title: string,
  text: string,
  status: 'success' | 'error' | 'info' = 'info'
): void {
  if (typeof (window as any).Notify === 'function') {
    new (window as any).Notify({
      status,
      title,
      text,
      effect: 'fade',
      speed: 300,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 3000,
      type: 'filled',
      position: 'right top'
    })
  } else {
    alert(`${title}: ${text}`)
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function formatJSON(obj: unknown, space: number = 2): string {
  return JSON.stringify(obj, null, space)
}

export function parseJSON(str: string): unknown | null {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
