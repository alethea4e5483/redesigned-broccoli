<template>
  <div class="w-full space-y-3">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search endpoints by name or URL..."
      class="w-full px-4 py-2 rounded-md bg-[#121212] text-white placeholder-gray-500 border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
    />

    <div v-if="searchQuery && filteredEndpoints.length > 0" class="space-y-2">
      <button
        v-for="endpoint in filteredEndpoints"
        :key="endpoint.name"
        @click="selectEndpoint(endpoint)"
        :class="[
          'w-full text-left px-3 py-2 rounded-md transition-colors duration-200',
          selectedEndpoint?.name === endpoint.name
            ? 'bg-[#ffcc99] text-black font-semibold'
            : 'bg-[#121212] text-gray-300 hover:bg-[#222] border border-[#333]'
        ]"
      >
        <div class="font-medium text-sm">{{ endpoint.name }}</div>
        <div class="text-xs text-gray-400">{{ endpoint.endpoint }}</div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { endpointsList } from '@/ts/modules/format'
import type { Endpoint } from '@/ts/types/endpoint'

interface Props {
  selectedEndpoint?: Endpoint | null
}

interface Emits {
  (e: 'endpoint-changed', endpoint: Endpoint): void
}

withDefaults(defineProps<Props>(), {
  selectedEndpoint: null
})

const emit = defineEmits<Emits>()
const searchQuery = ref('')

const filteredEndpoints = computed(() => {
  if (!searchQuery.value.trim()) return endpointsList
  const query = searchQuery.value.toLowerCase()
  return endpointsList.filter(
    ep =>
      ep.name.toLowerCase().includes(query) ||
      ep.endpoint.toLowerCase().includes(query)
  )
})

function selectEndpoint(endpoint: Endpoint) {
  emit('endpoint-changed', endpoint)
  searchQuery.value = ''
}
</script>

<style scoped>
</style>
