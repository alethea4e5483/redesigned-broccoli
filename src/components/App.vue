<template>
  <div class="app">
    <!-- Mobile Header -->
    <Header @toggle-sidebar="toggleMobileSidebar" />

    <!-- Consolidated Sidebar (handles both desktop and mobile) -->
    <Sidebar
      :is-open="mobileSidebarOpen"
      :selected-endpoint="selectedEndpoint"
      @select-endpoint="selectEndpoint"
      @close="mobileSidebarOpen = false"
    />

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Main Content -->
      <MainContent
        :selected-endpoint="selectedEndpoint"
        @endpoint-changed="selectEndpoint"
      />
    </div>

    <!-- Info Modal -->
    <InfoModal :is-open="showInfoModal" @close="showInfoModal = false" />

    <!-- Info Button -->
    <div class="info-btn-container">
      <button @click="showInfoModal = true" class="info-btn" title="Info">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-680q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Zm-60 560v-480h120v480H420Z"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import MainContent from './MainContent.vue'
import InfoModal from './InfoModal.vue'
import { endpointsList } from '@/ts/modules/format'
import type { Endpoint } from '@/ts/types/endpoint'

const store = useAppStore()

// State
const mobileSidebarOpen = ref(false)
const selectedEndpoint = ref<Endpoint | null>(null)
const showInfoModal = ref(false)

// Methods
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const selectEndpoint = (endpoint: Endpoint) => {
  selectedEndpoint.value = endpoint
  mobileSidebarOpen.value = false
}

// Lifecycle
onMounted(() => {
  if (endpointsList.length > 0) {
    selectedEndpoint.value = endpointsList[0]
  }
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #09090b;
  color: white;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.info-btn-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
}

.info-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #222;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.info-btn:hover {
  background: #444;
}

.info-btn svg {
  width: 20px;
  height: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }
}
</style>
