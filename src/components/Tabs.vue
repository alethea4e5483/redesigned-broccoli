<template>
  <div class="w-full flex flex-col h-full">
    <!-- Tab Navigation -->
    <div class="flex gap-2 border-b border-[#333] bg-[#0a0a0a] sticky top-0 z-10">
      <button
        @click="activeTab = 'search'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2',
          activeTab === 'search'
            ? 'text-black bg-[#ffcc99] border-[#ffcc99]'
            : 'text-gray-300 border-transparent hover:text-white'
        ]"
      >
        <i class="fas fa-search"></i>Search
      </button>
      <button
        @click="activeTab = 'form'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2',
          activeTab === 'form'
            ? 'text-black bg-[#ffcc99] border-[#ffcc99]'
            : 'text-gray-300 border-transparent hover:text-white'
        ]"
      >
        <i class="fas fa-edit"></i>Form
      </button>
      <button
        @click="activeTab = 'response'"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2',
          activeTab === 'response'
            ? 'text-black bg-[#ffcc99] border-[#ffcc99]'
            : 'text-gray-300 border-transparent hover:text-white'
        ]"
      >
        <i class="fas fa-message"></i>Response
        <span v-if="hasNewResponse" class="ml-1 w-2 h-2 bg-[#ffcc99] rounded-full animate-pulse"></span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Search Tab -->
      <div v-show="activeTab === 'search'" class="p-4">
        <Search :selected-endpoint="endpoint" @endpoint-changed="endpointChanged" />
      </div>

      <!-- Form Tab -->
      <div v-show="activeTab === 'form'" class="p-0 h-full">
        <Form :endpoint="endpoint" />
      </div>

      <!-- Response Tab -->
      <div v-show="activeTab === 'response'" class="p-0 h-full">
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
const hasNewResponse = ref(false)

function endpointChanged(newEndpoint: Endpoint) {
  emit('endpoint-changed', newEndpoint)
  activeTab.value = 'form'
}
</script>

<style scoped>
</style>
