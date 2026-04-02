import { BaseComponent } from './BaseComponent'
import { Endpoint } from '@types/endpoint'
import { stateManager } from '@modules/state'
import { showNotification } from '@utils'

/**
 * Form component for rendering and handling endpoint request forms
 */
export class Form extends BaseComponent {
  private currentEndpoint: Endpoint | null = null
  private onSubmit?: (endpoint: Endpoint, formData: FormData) => void

  constructor(selector: string) {
    super(selector)
    this.setupIdentityUpload()
  }

  init(): void {
    // Initialize listeners
    this.setupFormSubmit()
  }

  /**
   * Set onSubmit callback
   */
  onFormSubmit(callback: (endpoint: Endpoint, formData: FormData) => void): void {
    this.onSubmit = callback
  }

  /**
   * Render form for endpoint
   */
  renderForm(endpoint: Endpoint): void {
    this.currentEndpoint = endpoint
    const container = this.element
    if (!container) {
      console.error(`Form container not found`)
      return
    }

    console.log(`Rendering form for endpoint: ${endpoint.name}`)

    let html = '<form id="apiForm" class="space-y-4">'

    // Check for metadata fields
    let hasMetadata = false
    if (endpoint.params) {
      for (const key in endpoint.params) {
        const param = endpoint.params[key]
        if (param.type === 'list' && param.metadata) {
          hasMetadata = true
          break
        }
      }
    }

    // Add autofill section if has metadata
    if (hasMetadata) {
      html += `
        <div>
          <label class="block mb-1 text-sm">Paste userData JSON</label>
          <textarea id="userDataJsonInput" rows="2" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]" placeholder='{"userData":{...}}'></textarea>
          <button type="button" id="userDataJsonSubmit" class="mt-2 bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-3 py-1 rounded-lg">Autofill from JSON</button>
        </div>
      `
    }

    // Build form fields
    if (endpoint.params) {
      for (const key in endpoint.params) {
        const param = endpoint.params[key]

        if (param.type === 'list' && param.metadata) {
          html += `
            <div id="metadata-list-container">
              <label class="block mb-1 text-sm">${param.name || key}</label>
              <div id="metadata-dropdown-row" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333]"></div>
              <div id="metadata-keys-row"></div>
              <div class="text-xs text-gray-400">Maximum 20 keys, each key only once</div>
            </div>
          `
        } else {
          const inputType = param.type === 'int' ? 'number' : 'text'
          html += `
            <div>
              <label class="block mb-1 text-sm">${param.name || key}</label>
              <input 
                type="${inputType}" 
                name="${key}" 
                placeholder="${param.example || ''}" 
                value="${param.default || ''}"
                class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
                ${param.required ? 'required' : ''}
              />
              ${param.desc ? `<label class="font-poppins text-gray-300 mt-2 text-sm">${param.desc}</label>` : ''}
            </div>
          `
        }
      }
    }

    // Add submit button
    html += `
      <div class="flex items-center space-x-2">
        <button type="submit" class="bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
          <i class="fa-solid fa-paper-plane"></i> Send Request
        </button>
      </div>
      <div id="errors" class="text-red-500 mt-2"></div>
    </form>`

    container.innerHTML = html
    this.setupFormSubmit()
    this.setupMetadataHandlers()
  }

  /**
   * Setup identity file upload
   */
  private setupIdentityUpload(): void {
    // Setup desktop identity upload
    this.setupIdentityInputHandler('identity-file', 'identity-upload-btn', 'token-expire')
    // Setup mobile identity upload
    this.setupIdentityInputHandler('identity-file-mobile', 'identity-upload-btn-mobile', 'token-expire-mobile')
  }

  /**
   * Setup identity input handler
   */
  private setupIdentityInputHandler(inputId: string, btnId: string, statusId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement
    const btn = document.getElementById(btnId) as HTMLButtonElement
    const status = document.getElementById(statusId)

    if (!btn || !input) return

    // Reset button initially
    this.resetIdentityButton(btn, status)

    // Click to select file
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      input.click()
    })

    // Handle file selection
    input.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (!file.name.startsWith('identity')) {
        showNotification('Error', 'Please select a file named "identity"', 'error')
        input.value = ''
        this.resetIdentityButton(btn, status)
        return
      }

      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string)

          if (!json.user?.id || !json.identityToken?.token || !json.refreshToken?.token) {
            throw new Error('JSON missing required fields')
          }

          const jwt = json.identityToken.token
          if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(jwt)) {
            throw new Error('Invalid JWT format')
          }

          let expiryDate: Date | null = null
          if (json.identityToken.expiresAt) {
            expiryDate = new Date(json.identityToken.expiresAt)
            if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
              showNotification('Error', 'Token has expired', 'error')
              return
            }
          }

          // Set identity token in state
          stateManager.setIdentityToken(jwt)
          this.setIdentityFileSelected(btn, status, expiryDate)
        } catch (err) {
          showNotification('Error', `Invalid identity file: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
          input.value = ''
          this.resetIdentityButton(btn, status)
        }
      }
      reader.readAsText(file)
    })
  }

  /**
   * Reset identity button to default state
   */
  private resetIdentityButton(btn: HTMLButtonElement, status: HTMLElement | null): void {
    btn.innerHTML = '<i class="fa-solid fa-upload"></i> Choose a file'
    btn.classList.remove('file-selected')
    if (status) status.textContent = ''
  }

  /**
   * Set identity button to selected state
   */
  private setIdentityFileSelected(btn: HTMLButtonElement, status: HTMLElement | null, expiryDate: Date | null): void {
    btn.innerHTML = '<i class="fa-solid fa-file"></i> identity'
    btn.classList.add('file-selected')
    if (status && expiryDate) {
      status.innerHTML = `Expires:<br>${expiryDate.toLocaleString()}`
      status.title = expiryDate.toString()
    }
  }

  /**
   * Setup form submission
   */
  private setupFormSubmit(): void {
    const form = document.getElementById('apiForm') as HTMLFormElement
    if (!form || !this.currentEndpoint) return

    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const token = stateManager.getIdentityToken()
      if (!token) {
        showNotification('Error', 'You need to upload a valid identity file first', 'error')
        return
      }

      // Collect form data
      const formData = new FormData(form)

      // Trigger callback
      this.onSubmit?.(this.currentEndpoint!, formData)
    })

    // Setup autofill button if present
    const autofillBtn = document.getElementById('userDataJsonSubmit') as HTMLButtonElement
    if (autofillBtn) {
      autofillBtn.addEventListener('click', () => {
        const input = document.getElementById('userDataJsonInput') as HTMLTextAreaElement
        if (!input) return

        try {
          const parsed = JSON.parse(input.value.trim())
          if (parsed.userData) {
            this.autofillFormFromUserData(parsed.userData)
          } else {
            showNotification('Error', 'JSON must contain { userData: {...} }', 'error')
          }
        } catch (err) {
          showNotification('Error', `Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
        }
      })
    }
  }

  /**
   * Setup metadata dropdown handlers
   */
  private setupMetadataHandlers(): void {
    // This would be implemented based on metadataUtils.js
    // For now, we'll keep it simple
  }

  /**
   * Autofill form from user data
   */
  private autofillFormFromUserData(userData: Record<string, any>): void {
    const form = document.getElementById('apiForm') as HTMLFormElement
    if (!form) return

    // Simple autofill - would be more sophisticated in production
    Object.entries(userData).forEach(([key, value]) => {
      const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement
      if (input && typeof value === 'string' || typeof value === 'number') {
        input.value = String(value)
      }
    })
  }

  /**
   * Clear form
   */
  clear(): void {
    const form = document.getElementById('apiForm') as HTMLFormElement
    if (form) {
      form.reset()
    }
  }
}
