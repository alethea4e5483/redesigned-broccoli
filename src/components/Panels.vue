<template>
  <div class="w-full flex flex-col h-full space-y-4 p-4 overflow-y-auto">
    <!-- Request Panel -->
    <div class="flex-1 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div class="bg-slate-950 border-b border-slate-700 p-3 flex items-center justify-between sticky top-0">
        <h3 class="font-semibold text-white text-sm">Request</h3>
        <button
          @click="copyRequest"
          class="px-2 py-1 rounded text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 transition-colors"
        >
          Copy
        </button>
      </div>
      <div class="flex-1 overflow-auto p-3">
        <precode v-if="requestData" class="text-xs text-green-400 font-mono">{{ requestData }}</precode>
        <p v-else class="text-gray-400 text-xs italic">No request yet</p>
      </div>
    </div>

    <!-- Response Panel -->
    <div class="flex-1 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div class="bg-slate-950 border-b border-slate-700 p-3 flex items-center justify-between sticky top-0">
        <h3 class="font-semibold text-white text-sm">Response</h3>
        <button
          @click="copyResponse"
          class="px-2 py-1 rounded text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 transition-colors"
        >
          Copy
        </button>
      </div>
      <div class="flex-1 overflow-auto p-3">
        <precode v-if="responseData" class="text-xs font-mono" :class="responseStatus === 'success' ? 'text-green-400' : 'text-red-400'">
          {{ responseData }}
        </precode>
        <p v-else class="text-gray-400 text-xs italic">No response yet</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Endpoint } from '@/ts/types/endpoint'
import { useNotification } from '@/composables/useNotification'

interface Props {
  endpoint: Endpoint
}

defineProps<Props>()

const { showSuccess } = useNotification()

// In a full implementation, these would be populated by actual requests
const requestData = ref<string>('')
const responseData = ref<string>('')
const responseStatus = ref<'success' | 'error'>('success')

function copyRequest() {
  if (requestData.value) {
    navigator.clipboard.writeText(requestData.value)
    showSuccess('Copied to clipboard')
  }
}

function copyResponse() {
  if (responseData.value) {
    navigator.clipboard.writeText(responseData.value)
    showSuccess('Copied to clipboard')
  }
}
</script>

<style scoped>
precode {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
