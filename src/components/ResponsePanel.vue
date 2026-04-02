<script setup lang="ts">
import { useClipboard } from "../composables/useClipboard";

const props = defineProps<{
  value: string;
}>();

const { copyText, onCopy } = useClipboard();

const handleCopy = () => onCopy(props.value);
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-[#ffcc99] text-xl font-semibold">Result</h3>
      <button
        v-if="value !== 'Nothing returned yet.'"
        @click="handleCopy"
        type="button"
        class="rounded-md border border-[#333] bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-[#252525] cursor-pointer"
      >
        {{ copyText }}
      </button>
    </div>
    <div
      class="bg-[#121212] border border-[#333] rounded-lg p-4 font-mono text-left text-sm text-gray-200 overflow-y-auto flex-1 flex flex-col"
      style="max-height: 80vh; min-height: 120px"
    >
      <pre
        v-if="value !== 'Nothing returned yet.'"
        class="whitespace-pre-wrap break-all"
        >{{ value }}</pre
      >
      <span v-else class="text-left">Nothing returned yet.</span>
    </div>
  </div>
</template>
