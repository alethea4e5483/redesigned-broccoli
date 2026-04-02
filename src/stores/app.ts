import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const identityToken = ref<string | null>(localStorage.getItem('identityToken') || null)
  const limitsDisabled = ref<boolean>(localStorage.getItem('limitsDisabled') === 'true')
  const corsProxy = ref<string>(localStorage.getItem('corsProxy') || '')

  // Computed
  const hasIdentityToken = computed(() => !!identityToken.value)

  // Actions
  function setIdentityToken(token: string | null) {
    identityToken.value = token
    if (token) {
      localStorage.setItem('identityToken', token)
    } else {
      localStorage.removeItem('identityToken')
    }
  }

  function setLimitsDisabled(disabled: boolean) {
    limitsDisabled.value = disabled
    localStorage.setItem('limitsDisabled', disabled ? 'true' : 'false')
  }

  function setCorsProxy(proxy: string) {
    corsProxy.value = proxy
    localStorage.setItem('corsProxy', proxy)
  }

  return {
    // State
    identityToken,
    limitsDisabled,
    corsProxy,
    // Computed
    hasIdentityToken,
    // Actions
    setIdentityToken,
    setLimitsDisabled,
    setCorsProxy
  }
})
