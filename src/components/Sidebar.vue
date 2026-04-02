<template>
  <!-- Desktop Sidebar -->
  <div class="hidden lg:flex lg:w-1/6 bg-slate-950 border-r border-slate-800 flex-col items-center overflow-y-auto custom-scrollbar">
    <div class="text-left font-poppins text-lg mb-2 text-amber-500 mt-4">
      Endpoints
    </div>

    <!-- Search -->
    <div class="w-full px-4 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search endpoints..."
        class="w-full px-3 py-2 rounded bg-slate-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>

    <!-- Endpoint List -->
    <div class="w-full flex flex-col gap-2 px-2">
      <button
        v-for="endpoint in filteredEndpoints"
        :key="endpoint.name"
        @click="selectEndpoint(endpoint)"
        :class="[
          'text-left px-3 py-2 rounded transition-colors duration-200',
          selectedEndpoint?.name === endpoint.name
            ? 'bg-amber-500 text-slate-950 font-semibold'
            : 'text-gray-300 hover:bg-slate-800'
        ]"
      >
        {{ endpoint.name }}
      </button>
    </div>
  </div>

  <!-- Mobile Sidebar Overlay -->
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-64 h-screen bg-slate-950 border-r border-slate-800 z-50 flex flex-col overflow-y-auto lg:hidden"
    >
      <!-- Header with Close Button -->
      <div class="flex items-center justify-between p-4 border-b border-slate-800">
        <h3 class="text-lg font-poppins font-semibold text-amber-500">
          Endpoints
        </h3>
        <button
          @click="closeDrawer"
          class="text-gray-400 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Search -->
      <div class="p-4 border-b border-slate-800">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search endpoints..."
          class="w-full px-3 py-2 rounded bg-slate-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <!-- Mobile Endpoint List -->
      <div class="flex-1 flex flex-col gap-2 p-3 overflow-y-auto">
        <button
          v-for="endpoint in filteredEndpoints"
          :key="endpoint.name"
          @click="selectAndClose(endpoint)"
          :class="[
            'text-left px-3 py-2 rounded transition-colors duration-200 text-sm',
            selectedEndpoint?.name === endpoint.name
              ? 'bg-amber-500 text-slate-950 font-semibold'
              : 'text-gray-300 hover:bg-slate-800'
          ]"
        >
          {{ endpoint.name }}
        </button>
      </div>
    </div>
  </Transition>

  <!-- Mobile Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 z-40 lg:hidden"
      @click="closeDrawer"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { endpointsList } from '@/ts/modules/format'
import type { Endpoint } from '@/ts/types/endpoint'

interface Props {
  isOpen: boolean
  selectedEndpoint?: Endpoint | null
}

interface Emits {
  (e: 'select-endpoint', endpoint: Endpoint): void
  (e: 'close'): void
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
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
  emit('select-endpoint', endpoint)
}

function selectAndClose(endpoint: Endpoint) {
  selectEndpoint(endpoint)
  closeDrawer()
}

function closeDrawer() {
  emit('close')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #5a6472;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
