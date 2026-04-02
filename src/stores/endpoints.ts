import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { endpointsList } from '@/ts/modules/format'
import type { Endpoint } from '@/ts/types/endpoint'

export const useEndpointsStore = defineStore('endpoints', () => {
  // State
  const endpoints = ref<Endpoint[]>(endpointsList)
  const selectedEndpointIndex = ref<number | null>(null)

  // Computed
  const selectedEndpoint = computed(() => {
    if (selectedEndpointIndex.value === null) return null
    return endpoints.value[selectedEndpointIndex.value] ?? null
  })

  // Actions
  function selectEndpoint(index: number): void {
    if (index >= 0 && index < endpoints.value.length) {
      selectedEndpointIndex.value = index
    }
  }

  function selectEndpointByName(name: string): void {
    const index = endpoints.value.findIndex((ep) => ep.name === name)
    if (index !== -1) {
      selectedEndpointIndex.value = index
    }
  }

  function clearSelection(): void {
    selectedEndpointIndex.value = null
  }

  return {
    // State
    endpoints,
    selectedEndpointIndex,
    // Computed
    selectedEndpoint,
    // Actions
    selectEndpoint,
    selectEndpointByName,
    clearSelection
  }
})
