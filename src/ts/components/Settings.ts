import { BaseComponent } from './BaseComponent'
import { stateManager } from '@modules/state'

/**
 * Settings component for CORS proxy and limits configuration
 */
export class Settings extends BaseComponent {
  private corsProxyInput: HTMLInputElement | null = null
  private corsProxySave: HTMLElement | null = null
  private disableLimitsToggle: HTMLInputElement | null = null

  init(): void {
    this.corsProxyInput = this.querySelector<HTMLInputElement>('#corsProxyInput')
    this.corsProxySave = this.querySelector('#corsProxySave')
    this.disableLimitsToggle = this.querySelector<HTMLInputElement>('#disableLimitsToggle')

    this.setupCorsProxySettings()
    this.setupLimitsSettings()
  }

  /**
   * Setup CORS proxy settings
   */
  private setupCorsProxySettings(): void {
    if (this.corsProxyInput) {
      this.corsProxyInput.value = stateManager.getCorsProxy()

      if (this.corsProxySave) {
        this.corsProxySave.addEventListener('click', () => {
          const newValue = this.corsProxyInput?.value.trim()
          if (newValue) {
            stateManager.setCorsProxy(newValue)
            console.log('Saved CORS Proxy:', newValue)
          }
        })
      }
    }
  }

  /**
   * Setup limits disabled toggle
   */
  private setupLimitsSettings(): void {
    if (this.disableLimitsToggle) {
      this.disableLimitsToggle.checked = stateManager.getLimitsDisabled()

      this.disableLimitsToggle.addEventListener('change', () => {
        const checked = this.disableLimitsToggle?.checked ?? false
        stateManager.setLimitsDisabled(checked)
        console.log('Limits disabled:', checked)
      })
    }
  }

  /**
   * Get current CORS proxy
   */
  getCorsProxy(): string {
    return this.corsProxyInput?.value || stateManager.getCorsProxy()
  }

  /**
   * Check if limits are disabled
   */
  areLimitsDisabled(): boolean {
    return this.disableLimitsToggle?.checked ?? stateManager.getLimitsDisabled()
  }
}
