<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div class="bg-[#121212] rounded-lg border border-[#333] max-w-md w-full max-h-96 overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-[#0a0a0a] border-b border-[#333] p-4 flex items-center justify-between">
          <h2 class="text-lg font-poppins font-semibold text-white">Settings</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-4">
          <!-- Identity Token -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Identity Token
            </label>
            <input
              v-model="localToken"
              type="password"
              placeholder="Paste your JWT token"
              class="w-full px-3 py-2 rounded-md bg-[#121212] text-white placeholder-gray-500 border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f] text-sm"
            />
            <button
              @click="saveToken"
              class="mt-2 w-full px-3 py-1 rounded-md bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold transition-colors text-sm"
            >
              Save Token
            </button>
          </div>

          <!-- CORS Proxy -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              CORS Proxy URL
            </label>
            <input
              v-model="localProxy"
              type="text"
              placeholder="http://localhost:3000"
              class="w-full px-3 py-2 rounded-md bg-[#121212] text-white placeholder-gray-500 border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f] text-sm"
            />
            <button
              @click="saveProxy"
              class="mt-2 w-full px-3 py-1 rounded-md bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold transition-colors text-sm"
            >
              Save Proxy
            </button>
          </div>

          <!-- Disable Limits -->
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-300">
              Disable Rate Limits
            </label>
            <input
              v-model="localDisableLimits"
              type="checkbox"
              class="w-4 h-4 rounded cursor-pointer accent-[#ffcc99]"
            />
          </div>
          <button
            @click="saveLimits"
            class="w-full px-3 py-1 rounded-md bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold transition-colors text-sm"
          >
            Save Settings
          </button>

          <!-- Info -->
          <div class="pt-4 border-t border-[#333]">
            <p class="text-xs text-gray-400">
              SubwaySurfers API Web - Vue 3 with Composition API
            </p>
            <p class="text-xs text-gray-400 mt-2">
              For support and documentation, visit the repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useNotification } from '@/composables/useNotification'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const store = useAppStore()
const { showSuccess } = useNotification()

const localToken = ref(store.identityToken || '')
const localProxy = ref(store.corsProxy)
const localDisableLimits = ref(store.limitsDisabled)

watch(() => store.identityToken, (newVal) => {
  if (newVal) localToken.value = newVal
})

function saveToken() {
  store.setIdentityToken(localToken.value || null)
  showSuccess('Success', 'Token saved')
}

function saveProxy() {
  store.setCorsProxy(localProxy.value)
  showSuccess('Success', 'Proxy URL saved')
}

function saveLimits() {
  store.setLimitsDisabled(localDisableLimits.value)
  showSuccess('Success', 'Settings saved')
}

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
