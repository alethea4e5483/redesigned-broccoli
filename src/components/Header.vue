<template>
  <div class="flex items-center gap-2 mb-2">
    <button
      type="button"
      @click="triggerFileInput"
      :class="[
        'cursor-pointer hover:bg-[#7760fe] hover:text-white duration-100 p-2 px-6 rounded-[7px]',
        'font-semibold text-sm',
        fileSelected
          ? 'bg-[#7760fe] text-white file-selected'
          : 'bg-white text-black'
      ]">
      <i v-if="!fileSelected" class="fa fa-upload mr-2"></i>
      <i v-else class="fa fa-file mr-2"></i>
      {{ fileSelected ? 'identity' : 'Choose a file' }}
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="*"
      style="display: none"
      @change="handleFileChange" />
    <span v-if="tokenStatus" class="ml-2 text-xs text-gray-300">
      {{ tokenStatus }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useNotification } from '@/composables/useNotification'

const appStore = useAppStore()
const { showSuccess, showError } = useNotification()

const fileInput = ref<HTMLInputElement | null>(null)
const fileSelected = ref(false)
const tokenStatus = ref('')

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate filename
  if (!file.name.startsWith('identity')) {
    showError('Invalid file', 'Please select a file named "identity"')
    resetButton()
    target.value = ''
    return
  }

  // Read and parse file
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const json = JSON.parse(ev.target?.result as string)

      // Validate JSON structure
      if (!json.user?.id || !json.identityToken?.token || !json.refreshToken?.token) {
        throw new Error('JSON missing required fields: user.id, identityToken.token, or refreshToken.token')
      }

      const jwt = json.identityToken.token

      // Validate JWT format (three parts separated by dots)
      if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(jwt)) {
        throw new Error('Invalid JWT format')
      }

      // Check expiry date
      let expiryDate: Date | null = null
      if (json.identityToken.expiresAt) {
        expiryDate = new Date(json.identityToken.expiresAt)
        if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
          showError('Token Expired', 'The identity token has already expired')
          resetButton()
          target.value = ''
          return
        }
      }

      // Store token successfully
      appStore.setIdentityToken(jwt, expiryDate)
      fileSelected.value = true
      updateTokenStatus(expiryDate)
      showSuccess('Identity Uploaded', 'Token loaded successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      showError('Invalid File', `Failed to parse identity file: ${message}`)
      resetButton()
      target.value = ''
    }
  }

  reader.onerror = () => {
    showError('File Read Error', 'Could not read the selected file')
    resetButton()
    target.value = ''
  }

  reader.readAsText(file)
}

const resetButton = () => {
  fileSelected.value = false
  tokenStatus.value = ''
}

const updateTokenStatus = (expiryDate: Date | null) => {
  if (expiryDate) {
    tokenStatus.value = `Expires: ${expiryDate.toLocaleString()}`
  }
}

// Initialize on mount
if (appStore.identityToken && appStore.tokenExpiry) {
  fileSelected.value = true
  updateTokenStatus(appStore.tokenExpiry)
}
</script>

<style scoped>
.file-selected {
  background-color: #7760fe;
  color: white;
}
</style>
