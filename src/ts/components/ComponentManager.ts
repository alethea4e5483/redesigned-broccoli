import { BaseComponent } from './BaseComponent'
import { Header } from './Header'
import { Panels } from './Panels'
import { Tabs } from './Tabs'
import { InfoModal } from './InfoModal'
import { Settings } from './Settings'
import { Search } from './Search'
import { Sidebar } from './Sidebar'
import { Form } from './Form'
import type { Endpoint } from '@types/endpoint'

/**
 * Component manager - initializes and manages all UI components
 */
export class ComponentManager {
  private components: Map<string, BaseComponent> = new Map()

  /**
   * Register a component
   */
  register<T extends BaseComponent>(name: string, component: T): T {
    this.components.set(name, component)
    return component
  }

  /**
   * Get a component by name
   */
  get<T extends BaseComponent = BaseComponent>(name: string): T | undefined {
    return this.components.get(name) as T | undefined
  }

  /**
   * Initialize all components
   */
  initializeAll(): void {
    this.components.forEach((component) => {
      try {
        component.init()
      } catch (error) {
        console.error(`Error initializing component:`, error)
      }
    })
  }

  /**
   * Destroy all components
   */
  destroyAll(): void {
    this.components.forEach((component) => {
      try {
        component.destroy()
      } catch (error) {
        console.error(`Error destroying component:`, error)
      }
    })
  }

  /**
   * Create and register all default components
   */
  static createDefault(endpoints: Endpoint[] = []): ComponentManager {
    const manager = new ComponentManager()

    // Create components
    const form = new Form('#endpointForm')
    const sidebar = new Sidebar('body', endpoints, form)

    // Register components
    manager.register('header', new Header('#mobileSidebarToggle'))
    manager.register('panels', new Panels('#request-panel'))
    manager.register('tabs', new Tabs('#mobile-view-tabs'))
    manager.register('infoModal', new InfoModal('#info-modal'))
    manager.register('settings', new Settings('#disableLimitsToggle'))
    manager.register('search', new Search('body'))
    manager.register('form', form)
    manager.register('sidebar', sidebar)

    return manager
  }
}
