<template>
  <div class="hidden lg:flex bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] flex-col h-[calc(100dvh-11rem)] lg:h-auto">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-[#ffcc99] text-xl font-poppins font-semibold">
        Result
      </h3>
      <button
        v-if="hasResponse"
        id="copy-response-btn"
        type="button"
        class="rounded-md border border-[#333] bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-[#252525]"
        @click="copyResponse">
        {{ copyButtonText }}
      </button>
    </div>
    <textarea
      id="response-output"
      v-model="responseContent"
      rows="40"
      readonly
      class="w-full h-full bg-[#121212] text-white border border-[#333] rounded p-2 font-mono text-sm"
      :style="{ minHeight: '120px', maxHeight: '80vh' }"></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const responseContent = ref('Nothing returned yet.')
const copyButtonText = ref('Copy')

const hasResponse = computed(() => responseContent.value !== 'Nothing returned yet.')

// Expose function for updating response
const updateResponse = (content: string) => {
  responseContent.value = content
}

const copyResponse = async () => {
  try {
    await navigator.clipboard.writeText(responseContent.value)
    copyButtonText.value = 'Copied'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 1200)
  } catch {
    // Fallback for older browsers
    const textarea = document.getElementById('response-output') as HTMLTextAreaElement
    if (textarea) {
      textarea.select()
      document.execCommand('copy')
      textarea.setSelectionRange(0, 0)
    }
    copyButtonText.value = 'Copied'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 1200)
  }
}

// Expose methods for parent components
defineExpose({
  updateResponse,
  copyResponse
})
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
