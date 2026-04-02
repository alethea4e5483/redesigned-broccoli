<template>
  <div class="w-full flex flex-col h-full overflow-y-auto p-4 space-y-4">
    <h2 class="text-lg font-poppins font-semibold text-white sticky top-0">
      {{ endpoint.name }}
    </h2>

    <div v-if="endpoint.desc" class="text-sm text-gray-400 bg-slate-800 rounded p-2">
      {{ endpoint.desc }}
    </div>

    <!-- Identity Token Input -->
    <div class="border rounded-lg p-3 bg-slate-800 border-slate-700">
      <label class="block text-sm font-medium text-gray-300 mb-2">
        Identity Token
      </label>
      <textarea
        v-model="identityToken"
        placeholder="Paste your JWT token here"
        class="w-full px-2 py-1 rounded bg-slate-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs h-24 resize-none"
      />
      <button
        @click="saveToken"
        class="mt-2 w-full px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold transition-colors text-sm"
      >
        Load Token
      </button>
    </div>

    <!-- Dynamic Form Fields -->
    <div class="space-y-3">
      <div
        v-for="(param, key) in endpoint.params"
        :key="key"
        class="border rounded-lg p-3 bg-slate-800 border-slate-700"
      >
        <label class="block text-sm font-medium text-gray-300 mb-2">
          {{ key }}
          <span v-if="param?.required" class="text-red-500">*</span>
        </label>
        <input
          v-if="!param?.metadata"
          v-model="formData[key]"
          :type="getInputType(param?.type)"
          :placeholder="param?.example ? `E.g: ${param.example}` : ''"
          class="w-full px-2 py-1 rounded bg-slate-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        />
        <textarea
          v-else
          v-model="formData[key]"
          placeholder="JSON object"
          class="w-full px-2 py-1 rounded bg-slate-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm h-24 resize-none font-mono text-xs"
        />
        <p v-if="param?.desc" class="text-xs text-gray-400 mt-1">
          {{ param.desc }}
        </p>
      </div>
    </div>

    <!-- Send Button -->
    <button
      @click="submit"
      :disabled="isLoading"
      class="w-full px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 disabled:bg-gray-600 text-slate-950 font-semibold transition-colors sticky bottom-0"
    >
      {{ isLoading ? 'Sending...' : 'Send Request' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { Endpoint } from '@/ts/types/endpoint'
import { useAppStore } from '@/stores/app'
import { useNotification } from '@/composables/useNotification'
import { useRequest } from '@/composables/useRequest'

interface Props {
  endpoint: Endpoint
}

const props = defineProps<Props>()

const store = useAppStore()
const { showSuccess, showError } = useNotification()
const { sendRequest } = useRequest()

const identityToken = ref(store.identityToken || '')
const formData = reactive<Record<string, string>>({})
const isLoading = ref(false)

// Initialize form data
watch(
  () => props.endpoint,
  (newEndpoint) => {
    Object.keys(formData).forEach(key => delete formData[key])
    Object.keys(newEndpoint.params).forEach(key => {
      const param = newEndpoint.params[key]
      formData[key] = param?.default?.toString() || ''
    })
  },
  { immediate: true }
)

function getInputType(paramType?: string): string {
  if (!paramType) return 'text'
  if (paramType.includes('int') || paramType.includes('number')) return 'number'
  if (paramType.includes('bool')) return 'checkbox'
  return 'text'
}

function saveToken() {
  store.setIdentityToken(identityToken.value || null)
  showSuccess('Token saved')
}

async function submit() {
  try {
    isLoading.value = true

    // Validate required fields
    for (const [key, param] of Object.entries(props.endpoint.params)) {
      if (param?.required && !formData[key]?.trim()) {
        showError('Validation Error', `${key} is required`)
        return
      }
    }

    // Build request body
    const body: Record<string, any> = {}
    for (const [key, value] of Object.entries(formData)) {
      try {
        // Try to parse as JSON if it looks like JSON
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
          body[key] = JSON.parse(value)
        } else {
          body[key] = value
        }
      } catch {
        body[key] = value
      }
    }

    await sendRequest(
      props.endpoint.endpoint,
      store.identityToken,
      undefined,
      undefined,
      body,
      { json: props.endpoint.type === 'json' }
    )

    showSuccess('Request sent successfully')
  } catch (error) {
    showError('Request failed', error instanceof Error ? error.message : 'Unknown error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
</style>
