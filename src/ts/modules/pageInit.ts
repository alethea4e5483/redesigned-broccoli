export function setupIdentityUpload(inputId: string, btnId: string, statusId?: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement | null
  const btn = document.getElementById(btnId) as HTMLButtonElement | null
  const status = statusId ? document.getElementById(statusId) : null

  function resetButton(): void {
    if (!btn) return
    btn.innerHTML = ''
    const icon = document.createElement('i')
    icon.className = 'fa fa-upload'
    icon.setAttribute('aria-hidden', 'true')
    btn.appendChild(icon)
    btn.appendChild(document.createTextNode(' Choose a file'))
    btn.classList.remove('file-selected')
    if (status) status.textContent = ''
  }

  function setFileSelected(expiryDate: Date | null): void {
    if (!btn) return
    btn.innerHTML = ''
    const icon = document.createElement('i')
    icon.className = 'fa fa-file'
    icon.setAttribute('aria-hidden', 'true')
    btn.appendChild(icon)
    btn.appendChild(document.createTextNode(' identity'))
    btn.classList.add('file-selected')

    if (status && expiryDate) {
      status.innerHTML = `Expires:<br>${expiryDate.toLocaleString()}`
      status.title = expiryDate.toString()
    }
  }

  if (!btn) return
  resetButton()

  if (btn && input) {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      input.click()
    })

    input.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (!file.name.startsWith('identity')) {
        alert('Please select a file named "identity"')
        ;(e.target as HTMLInputElement).value = ''
        resetButton()
        return
      }

      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string)

          if (
            !json.user?.id ||
            !json.identityToken?.token ||
            !json.refreshToken?.token
          ) {
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
              if (typeof (window as any).Notify === 'function') {
                new (window as any).Notify({
                  status: 'error',
                  title: 'Token Expired',
                  text: 'Token has expired',
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
                alert('Token has expired')
              }
              return
            }
          }

          ;(window as any).identityToken = jwt
          setFileSelected(expiryDate)
        } catch (err) {
          ;(window as any).identityToken = null
          resetButton()
          ;(e.target as HTMLInputElement).value = ''
        }
      }
      reader.readAsText(file)
    })
  }
}

export function setupPageInit(): void {
  // Clear search inputs on page load
  const searchInputMobile = document.getElementById('endpointSearch') as HTMLInputElement | null
  const searchInputDesktop = document.getElementById('endpointSearchDesktop') as HTMLInputElement | null

  if (searchInputMobile) {
    searchInputMobile.value = ''
  }
  if (searchInputDesktop) {
    searchInputDesktop.value = ''
  }

  // Use setTimeout to ensure it clears after all other scripts run
  setTimeout(() => {
    if (searchInputMobile) {
      searchInputMobile.value = ''
    }
    if (searchInputDesktop) {
      searchInputDesktop.value = ''
    }
  }, 0)

  let limitsDisabled = localStorage.getItem('limitsDisabled') === 'true'
  const toggleCheckbox = document.getElementById('disableLimitsToggle') as HTMLInputElement | null

  if (toggleCheckbox) {
    toggleCheckbox.checked = limitsDisabled
    if (localStorage.getItem('limitsDisabled') === null) {
      localStorage.setItem('limitsDisabled', String(limitsDisabled))
    }

    toggleCheckbox.addEventListener('change', () => {
      limitsDisabled = toggleCheckbox.checked
      localStorage.setItem('limitsDisabled', String(limitsDisabled))
      console.log('Limits disabled:', limitsDisabled)
    })
  }

  const input = document.getElementById('corsProxyInput') as HTMLInputElement | null
  const saveBtn = document.getElementById('corsProxySave') as HTMLButtonElement | null
  if (input) {
    const savedProxy =
      localStorage.getItem('corsProxy') ||
      'https://noisy-disk-638c.herrerde.workers.dev/?url='
    input.value = savedProxy
  }

  if (input && saveBtn) {
    saveBtn.addEventListener('click', () => {
      const newValue = input.value.trim()
      localStorage.setItem('corsProxy', newValue)
      console.log('Saved CORS Proxy:', newValue)
    })
  }

  const infoBtn = document.getElementById('info-btn') as HTMLButtonElement | null
  const infoModal = document.getElementById('info-modal') as HTMLDivElement | null
  const infoModalClose = document.getElementById('info-modal-close') as HTMLButtonElement | null
  const requestPanel = document.getElementById('request-panel') as HTMLDivElement | null
  const responsePanel = document.getElementById('response-panel') as HTMLDivElement | null
  const requestTab = document.getElementById('mobile-tab-request') as HTMLButtonElement | null
  const responseTab = document.getElementById('mobile-tab-response') as HTMLButtonElement | null
  const mobileViewTabs = document.getElementById('mobile-view-tabs') as HTMLDivElement | null
  const responseBadge = document.getElementById('mobile-response-badge') as HTMLSpanElement | null
  let hasUnreadResponse = false

  function clearResponseAttention(): void {
    hasUnreadResponse = false
    if (responseBadge) responseBadge.classList.add('hidden')
    if (responseTab) {
      responseTab.classList.remove('animate-pulse')
      if (!responsePanel || responsePanel.classList.contains('hidden')) {
        responseTab.classList.remove('ring-2', 'ring-emerald-400/80')
      }
    }
  }

  function setMobilePanel(view: string): void {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (!requestPanel || !responsePanel) return

    if (isDesktop) {
      requestPanel.classList.remove('hidden')
      responsePanel.classList.remove('hidden')
      return
    }

    const showRequest = view !== 'response'
    requestPanel.classList.toggle('hidden', !showRequest)
    responsePanel.classList.toggle('hidden', showRequest)

    if (!showRequest) {
      clearResponseAttention()
    }

    if (requestTab && responseTab) {
      requestTab.classList.toggle('bg-[#ffcc99]', showRequest)
      requestTab.classList.toggle('text-black', showRequest)
      requestTab.classList.toggle('text-gray-300', !showRequest)
      responseTab.classList.toggle('bg-[#ffcc99]', !showRequest)
      responseTab.classList.toggle('text-black', !showRequest)
      responseTab.classList.toggle('text-gray-300', showRequest)
      responseTab.classList.toggle('ring-2', hasUnreadResponse && showRequest)
      responseTab.classList.toggle(
        'ring-emerald-400/80',
        hasUnreadResponse && showRequest
      )
    }
  }

  ;(window as any).showMobileResponsePanel = () => setMobilePanel('response')
  ;(window as any).setMobileTabsVisible = (visible: boolean) => {
    if (!mobileViewTabs) return
    mobileViewTabs.classList.toggle('hidden', !visible)
  }
  ;(window as any).markMobileResponseReady = () => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (
      isDesktop ||
      !responsePanel ||
      !responsePanel.classList.contains('hidden')
    ) {
      return
    }
    hasUnreadResponse = true
    if (responseBadge) responseBadge.classList.remove('hidden')
    if (responseTab) responseTab.classList.add('animate-pulse')
    setMobilePanel('request')
  }

  if (requestTab) {
    requestTab.addEventListener('click', () => setMobilePanel('request'))
  }
  if (responseTab) {
    responseTab.addEventListener('click', () => setMobilePanel('response'))
  }
  window.addEventListener('resize', () => {
    const activeView =
      responsePanel && !responsePanel.classList.contains('hidden')
        ? 'response'
        : 'request'
    setMobilePanel(activeView)
  })
  ;(window as any).setMobileTabsVisible(false)
  setMobilePanel('request')

  if (infoBtn && infoModal) {
    infoBtn.addEventListener('click', () =>
      infoModal.classList.remove('hidden')
    )
  }
  if (infoModalClose && infoModal) {
    infoModalClose.addEventListener('click', () =>
      infoModal.classList.add('hidden')
    )
  }
  if (infoModal) {
    infoModal.addEventListener('click', (e) => {
      if (e.target === infoModal) infoModal.classList.add('hidden')
    })
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModal) infoModal.classList.add('hidden')
  })

  const setupSearch = (searchInput: HTMLInputElement | null): void => {
    if (!searchInput) return

    searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase()

      const desktopLinks = document.querySelectorAll(
        '#endpointList .sidebar-link'
      )
      desktopLinks.forEach((link) => {
        const text = link.textContent?.toLowerCase() || ''
        const shouldShow = text.includes(query)
        ;(link as HTMLElement).style.display = shouldShow ? '' : 'none'
      })

      const mobileLinks = document.querySelectorAll(
        '#mobileEndpointList .sidebar-link'
      )
      mobileLinks.forEach((link) => {
        const text = link.textContent?.toLowerCase() || ''
        const shouldShow = text.includes(query)
        ;(link as HTMLElement).style.display = shouldShow ? '' : 'none'
      })
    })
  }

  setupSearch(searchInputMobile)
  setupSearch(searchInputDesktop)
}
