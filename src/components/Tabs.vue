<template>
  <div class="w-full flex flex-col h-full">
    <!-- Tab Navigation -->
    <div class="flex gap-2 border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
      <button
        @click="activeTab = 'search'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2',
          activeTab === 'search'
            ? 'text-amber-500 border-amber-500'
            : 'text-gray-400 border-transparent hover:text-white'
        ]"
      >
        <i class="fas fa-search mr-2"></i>Search
      </button>
      <button
        @click="activeTab = 'form'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2',
          activeTab === 'form'
            ? 'text-amber-500 border-amber-500'
            : 'text-gray-400 border-transparent hover:text-white'
        ]"
      >
        <i class="fas fa-edit mr-2"></i>Form
      </button>
      <button
        @click="activeTab = 'response'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2',
          activeTab === 'response'
            ? 'text-amber-500 border-amber-500'
            : 'text-gray-400 border-transparent hover:text-white'
        ]"
      >
        <i class="fas fa-message mr-2"></i>Response
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Search Tab -->
      <div v-if="activeTab === 'search'" class="p-4">
        <Search :selected-endpoint="endpoint" @endpoint-changed="endpointChanged" />
      </div>

      <!-- Form Tab -->
      <div v-if="activeTab === 'form'" class="p-0">
        <Form :endpoint="endpoint" />
      </div>

      <!-- Response Tab -->
      <div v-if="activeTab === 'response'" class="p-0">
        <Panels :endpoint="endpoint" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Endpoint } from '@/ts/types/endpoint'
import Search from './Search.vue'
import Form from './Form.vue'
import Panels from './Panels.vue'

interface Props {
  endpoint: Endpoint
}

interface Emits {
  (e: 'endpoint-changed', endpoint: Endpoint): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref<'search' | 'form' | 'response'>('form')

function endpointChanged(newEndpoint: Endpoint) {
  emit('endpoint-changed', newEndpoint)
  activeTab.value = 'form'
}
</script>

<style scoped>
</style>
