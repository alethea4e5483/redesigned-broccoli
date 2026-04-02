<template>
  <div class="flex flex-col flex-1 bg-slate-900 overflow-hidden">
    <!-- Search Bar (Desktop) -->
    <div class="hidden lg:block border-b border-slate-800 p-4">
      <Search :selected-endpoint="selectedEndpoint" @endpoint-changed="endpointChanged" />
    </div>

    <!-- Form and Panels Container -->
    <div class="flex flex-col lg:flex-row flex-1 overflow-hidden">
      <!-- Form Section -->
      <div class="hidden lg:flex lg:w-1/3 border-r border-slate-800 overflow-y-auto">
        <Form v-if="selectedEndpoint" :endpoint="selectedEndpoint" />
      </div>

      <!-- Mobile Tabs View -->
      <div class="lg:hidden flex flex-1">
        <Tabs v-if="selectedEndpoint" :endpoint="selectedEndpoint" />
      </div>

      <!-- Panels Section (Desktop) -->
      <div class="hidden lg:flex lg:w-2/3 overflow-y-auto">
        <Panels v-if="selectedEndpoint" :endpoint="selectedEndpoint" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Endpoint } from '@/ts/types/endpoint'
import Search from './Search.vue'
import Form from './Form.vue'
import Panels from './Panels.vue'
import Tabs from './Tabs.vue'

interface Props {
  selectedEndpoint: Endpoint | null
}

interface Emits {
  (e: 'endpoint-changed', endpoint: Endpoint): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function endpointChanged(endpoint: Endpoint) {
  emit('endpoint-changed', endpoint)
}
</script>

<style scoped>
</style>
