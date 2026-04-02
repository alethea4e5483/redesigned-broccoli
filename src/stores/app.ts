import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const identityToken = ref<string | null>(localStorage.getItem('identityToken') || null)
  const tokenExpiry = ref<Date | null>(
    localStorage.getItem('tokenExpiry') ? new Date(localStorage.getItem('tokenExpiry')!) : null
  )
  const limitsDisabled = ref<boolean>(localStorage.getItem('limitsDisabled') === 'true')
  const corsProxy = ref<string>(
    localStorage.getItem('corsProxy') || 'https://noisy-disk-638c.herrerde.workers.dev/?url='
  )

  // Computed
  const hasIdentityToken = computed(() => !!identityToken.value)
  const isTokenExpired = computed(() => {
    if (!tokenExpiry.value) return false
    return new Date() > tokenExpiry.value
  })

  // Actions
  function setIdentityToken(token: string | null, expiry?: Date): void {
    identityToken.value = token
    if (token) {
      localStorage.setItem('identityToken', token)
      if (expiry) {
        tokenExpiry.value = expiry
        localStorage.setItem('tokenExpiry', expiry.toISOString())
      }
    } else {
      localStorage.removeItem('identityToken')
      localStorage.removeItem('tokenExpiry')
      tokenExpiry.value = null
    }
  }

  function setLimitsDisabled(disabled: boolean): void {
    limitsDisabled.value = disabled
    localStorage.setItem('limitsDisabled', disabled ? 'true' : 'false')
  }

  function setCorsProxy(proxy: string): void {
    corsProxy.value = proxy
    localStorage.setItem('corsProxy', proxy)
  }

  return {
    // State
    identityToken,
    tokenExpiry,
    limitsDisabled,
    corsProxy,
    // Computed
    hasIdentityToken,
    isTokenExpired,
    // Actions
    setIdentityToken,
    setLimitsDisabled,
    setCorsProxy
  }
})
