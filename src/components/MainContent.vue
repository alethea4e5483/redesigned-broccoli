<template>
  <main
    class="flex-1 grid grid-cols-1 py-4 gap-4 px-4 lg:grid-cols-2 lg:py-10 lg:gap-6 lg:px-8 h-full roundborder border-l border-[#1a1a1a]">
    <!-- Mobile View Tabs -->
    <div class="hidden lg:hidden sticky top-0 z-20 bg-[#09090b] py-2" id="mobile-view-tabs">
      <div class="grid grid-cols-2 gap-2 rounded-xl border border-[#222] bg-[#101014] p-1">
        <button
          id="mobile-tab-request"
          type="button"
          class="rounded-lg bg-[#ffcc99] px-3 py-2 text-sm font-semibold text-black transition-colors">
          Request
        </button>
        <button
          id="mobile-tab-response"
          type="button"
          class="relative rounded-lg px-3 py-2 text-sm font-semibold text-gray-300 transition-colors">
          Response
          <span
            id="mobile-response-badge"
            class="absolute right-2 top-1 hidden h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
        </button>
      </div>
    </div>

    <!-- Request Panel (Form) -->
    <div id="request-panel" class="hidden lg:block">
      <Form />
    </div>

    <!-- Response Panel -->
    <div id="response-panel" class="hidden lg:flex">
      <ResponsePanel ref="responsePanelRef" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Form from './Form.vue'
import ResponsePanel from './ResponsePanel.vue'

const responsePanelRef = ref<InstanceType<typeof ResponsePanel> | null>(null)

// Expose responsePanel for external updates
defineExpose({
  responsePanelRef
})
</script>

<style scoped>
.roundborder {
  border-top-left-radius: 37px;
  background-size: 47px 47px;
  background-position:
    0 0,
    21px 21px;
}
</style>
