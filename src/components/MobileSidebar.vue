<template>
  <div>
    <!-- Mobile Header Toggle -->
    <div class="lg:hidden flex items-center justify-between bg-[#09090b] p-4 sticky top-0 z-40">
      <a href="#" class="cursor-pointer flex items-center gap-2">
        <span class="font-bold text-white text-xl">Subway Surfers API</span>
      </a>
      <button
        id="mobileSidebarToggle"
        class="text-white text-2xl"
        role="button"
        aria-label="Toggle sidebar"
        @click="toggleSidebar">
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      id="overlay"
      class="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
      style="touch-action: pan-y"
      @click="closeSidebar"></div>

    <!-- Mobile Sidebar -->
    <div
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-[#09090b] z-50',
        'transform transition-transform duration-200 ease-in-out',
        'lg:hidden flex flex-col shadow-lg overflow-y-auto custom-scrollbar',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]">
      <div class="text-left font-poppins text-lg mb-5 text-[#ffcc99] p-4">
        Endpoints
      </div>
      <p v-if="appStore.tokenExpiry" class="font-poppins mb-2 text-center text-xs text-gray-400">
        Expires: {{ formatDate(appStore.tokenExpiry) }}
      </p>
      <div class="flex items-center gap-2 mb-2 px-4">
        <button
          type="button"
          class="cursor-pointer hover:bg-[#7760fe] hover:text-white duration-100 p-2 px-6 rounded-[7px] bg-white text-black font-semibold text-sm">
          <i class="fa fa-upload mr-2"></i>
          Upload Identity
        </button>
        <input
          type="file"
          id="identity-file-mobile"
          accept="*"
          style="display: none" />
        <span class="ml-2 text-xs text-gray-300"></span>
      </div>
      <div class="px-4 mb-4 w-full">
        <input
          id="endpointSearch"
          type="text"
          placeholder="Search endpoints..."
          autocomplete="off"
          class="endpointSearch px-3 py-2.5 w-full" />
      </div>
      <div
        id="mobileEndpointList"
        class="sidebar-links mb-5 w-full flex justify-center flex-col items-center gap-3">
        <div
          v-for="(endpoint, index) in endpointsStore.endpoints"
          :key="index"
          :class="[
            'sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer',
            'px-3 py-2 flex items-start gap-1 flex-col justify-between',
            endpointsStore.selectedEndpointIndex === index ? 'sb-selected' : ''
          ]"
          @click="selectEndpointAndClose(index)">
          <a class="flex font-semibold justify-between font-poppins items-center gap-1">
            {{ endpoint.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEndpointsStore } from '@/stores/endpoints'
import { useAppStore } from '@/stores/app'

const endpointsStore = useEndpointsStore()
const appStore = useAppStore()

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const selectEndpointAndClose = (index: number) => {
  endpointsStore.selectEndpoint(index)
  closeSidebar()
}

const formatDate = (date: Date) => {
  return date.toLocaleString()
}
</script>

<style scoped>
.sidebar-link {
  width: 87%;
  text-align: left;
  display: block;
  margin: auto;
  padding: 0.65rem 0.7rem;
  color: #ffffffe8;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.sidebar-link a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 5px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 1.05rem;
}

.sidebar-link:not(.sb-selected):hover {
  background: #ffffff0d;
  font-weight: bold;
}

.sb-selected {
  background: #ffcc99;
  color: black;
  font-weight: bold;
}

.endpointSearch {
  flex-shrink: 1;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-width: 1px;
  background-color: #ffffff0d;
  width: 100%;
  border-radius: 0.5rem;
  border: none;
  color: #fff;
  font-family: Poppins;
  padding: 0.625rem 0.75rem;
}

.endpointSearch:focus {
  border: none;
  outline: 2px solid #ffcc99;
  outline-offset: 2px;
}

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
