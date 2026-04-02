<template>
  <header class="bg-slate-950 border-b border-slate-800 h-16 flex items-center justify-between px-4 lg:px-6">
    <!-- Mobile Menu Button -->
    <button
      @click="toggleSidebar"
      class="lg:hidden text-amber-500 hover:text-amber-400 transition-colors"
      aria-label="Toggle sidebar"
    >
      <i class="fas fa-bars text-xl"></i>
    </button>

    <!-- Title -->
    <h1 class="text-xl font-poppins font-semibold text-white absolute left-1/2 transform -translate-x-1/2">
      SubwaySurfers API
    </h1>

    <!-- Spacer for mobile -->
    <div class="w-6 lg:hidden"></div>
  </header>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'toggle-sidebar'): void
}

const emit = defineEmits<Emits>()

function toggleSidebar() {
  emit('toggle-sidebar')
}
</script>

<style scoped>
</style>
