<template>
  <div
    v-if="endpointsStore.selectedEndpoint"
    class="bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] bg-[#09090b] h-[calc(100dvh-11rem)] lg:h-screen overflow-y-auto custom-scrollbar">
    <h2 class="text-[#ffcc99] font-poppins text-2xl font-semibold mb-2">
      {{ endpointsStore.selectedEndpoint.name }}
    </h2>
    <p class="font-poppins text-gray-400 mb-4">
      {{ endpointsStore.selectedEndpoint.endpoint }}
    </p>
    <p v-if="endpointsStore.selectedEndpoint.desc" class="font-poppins text-gray-400 mb-2">
      {{ endpointsStore.selectedEndpoint.desc }}
    </p>

    <!-- Form will be rendered here -->
    <form
      id="apiForm"
      class="space-y-4"
      @submit.prevent="handleFormSubmit">
      <!-- Form fields will be dynamically generated -->
      <template v-if="endpointsStore.selectedEndpoint.params">
        <!-- User Data JSON Input (if metadata exists) -->
        <div v-if="hasMetadata">
          <label class="block mb-1 text-sm">Paste userData JSON</label>
          <textarea
            id="userDataJsonInput"
            rows="2"
            class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
            placeholder='{"userData":{...}}'></textarea>
          <button
            type="button"
            id="userDataJsonSubmit"
            class="mt-2 bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-3 py-1 rounded-lg"
            @click="handleAutofill">
            Autofill from JSON
          </button>
        </div>

        <!-- Regular Form Fields -->
        <div v-for="(paramDef, key) in endpointsStore.selectedEndpoint.params" :key="key">
          <div v-if="paramDef.type === 'list' && paramDef.metadata">
            <!-- Metadata Field -->
            <label class="block mb-1 text-sm">{{ paramDef.name }}</label>
            <div id="metadata-dropdown-row" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"></div>
            <div id="metadata-keys-row"></div>
            <div class="text-xs text-gray-400">Maximal 20 Keys, every key only once.</div>
          </div>
          <div v-else>
            <!-- Regular Input Field -->
            <label class="block mb-1 text-sm">{{ paramDef.name || key }}</label>
            <input
              :key="`field-${key}`"
              :type="paramDef.type === 'int' ? 'number' : 'text'"
              :name="paramDef.value || key"
              :placeholder="paramDef.example || ''"
              :value="paramDef.default || ''"
              :required="paramDef.required"
              class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]" />
            <label v-if="paramDef.desc" class="font-poppins text-gray-300 mb-4 mt-2 text-sm">
              {{ paramDef.desc }}
            </label>
          </div>
        </div>
      </template>

      <!-- Submit Button -->
      <div class="flex items-center space-x-2 pt-4">
        <button
          type="submit"
          class="bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
          <i class="fas fa-paper-plane"></i> Send Request
        </button>
      </div>

      <!-- Errors -->
      <div id="errors" class="text-red-500 mt-2"></div>
    </form>
  </div>
  <div
    v-else
    class="bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] bg-[#09090b] h-[calc(100dvh-11rem)] lg:h-screen overflow-y-auto custom-scrollbar">
    <h2 class="text-[#ffcc99] font-poppins text-2xl font-semibold mb-2">
      Select an Endpoint
    </h2>
    <p class="font-poppins text-gray-400 mb-4">
      Choose an endpoint from the sidebar to test.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEndpointsStore } from '@/stores/endpoints'
import { useAppStore } from '@/stores/app'
import { useRequest } from '@/composables/useRequest'
import { buildFormHtml, validateForm, buildRequestBody } from '@/ts/modules/formUtils'
import { autofillFormFromUserData } from '@/ts/modules/autofill'
import { useNotification } from '@/composables/useNotification'

const endpointsStore = useEndpointsStore()
const appStore = useAppStore()
const { sendRequest } = useRequest()
const { showError } = useNotification()

const hasMetadata = computed(() => {
  if (!endpointsStore.selectedEndpoint?.params) return false
  return Object.values(endpointsStore.selectedEndpoint.params).some(
    (p) => p.type === 'list' && p.metadata
  )
})

const handleAutofill = () => {
  try {
    const jsonInput = document.getElementById('userDataJsonInput') as HTMLTextAreaElement
    if (!jsonInput) return

    const input = jsonInput.value.trim()
    if (!input) return

    const parsed = JSON.parse(input)
    if (parsed.userData) {
      autofillFormFromUserData(parsed.userData)
    } else {
      showError('Invalid JSON', 'JSON must contain { userData: {...} }')
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    showError('Parse Error', `Invalid JSON: ${message}`)
  }
}

const handleFormSubmit = async (event: Event) => {
  const form = event.target as HTMLFormElement
  const endpoint = endpointsStore.selectedEndpoint

  if (!endpoint) return

  // Check for identity token
  if (!appStore.identityToken) {
    showError('Token Missing', 'You need to upload a valid identity file first')
    return
  }

  // Validate form
  const formElements = form.elements
  const errorMsg = validateForm(endpoint, formElements)
  const errorsEl = document.getElementById('errors')

  if (errorMsg) {
    if (errorsEl) {
      errorsEl.innerHTML = errorMsg
    }
    return
  }

  if (errorsEl) {
    errorsEl.innerHTML = ''
  }

  // Build request
  const body = buildRequestBody(endpoint, formElements)
  const url = 'https://subway.prod.sybo.net' + endpoint.endpoint

  const opts = { json: endpoint.type === 'json' }

  let MsgType: any = null
  let RespType: any = null

  // Handle gRPC endpoints
  if (endpoint.type === 'rpc') {
    try {
      if (!endpoint.request || !endpoint.response) {
        throw new Error('gRPC endpoint missing request/response type definitions')
      }

      MsgType = (('proto.' + endpoint.request) as any)
        .split('.')
        .reduce((o: any, k: string) => o?.[k], window)

      RespType = (('proto.' + endpoint.response) as any)
        .split('.')
        .reduce((o: any, k: string) => o?.[k], window)

      if (!MsgType || !RespType) {
        throw new Error('Protobuf types not found. Ensure proto.js is loaded.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      showError('Protobuf Error', `Could not load protobuf types: ${message}`)
      return
    }
  }

  // Show mobile response panel if function exists
  if (typeof window.showMobileResponsePanel === 'function') {
    window.showMobileResponsePanel()
  }

  // Send request
  await sendRequest(url, appStore.identityToken, MsgType, RespType, body, opts)
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  transition: background 0.3s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
</style>
