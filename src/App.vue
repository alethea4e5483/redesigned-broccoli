<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import MainPanel from "./components/MainPanel.vue";
import InfoModal from "./components/InfoModal.vue";

const showMobileSidebar = ref(false);
const showInfoModal = ref(false);
const selectedEndpoint = ref<any>(null);

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};

const selectEndpoint = (ep: any) => {
  selectedEndpoint.value = ep;
  showMobileSidebar.value = false;
};

const openInfo = () => {
  showInfoModal.value = true;
};

const closeInfo = () => {
  showInfoModal.value = false;
};
</script>

<template>
  <div class="bg-[#09090b] text-white font-sans min-h-screen block lg:flex">
    <!-- Mobile Header -->
    <div class="lg:hidden flex items-center justify-between bg-[#09090b] p-4">
      <a href="#" class="cursor-pointer flex items-center gap-2">
        <span class="font-bold text-white text-xl">Subway Surfers API</span>
      </a>
      <button
        @click="toggleMobileSidebar"
        class="text-white text-2xl"
        role="button"
        aria-label="Toggle sidebar"
      >
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <!-- Mobile Sidebar -->
    <div
      v-if="showMobileSidebar"
      class="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
      @click="toggleMobileSidebar"
    ></div>

    <div
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-[#09090b] z-50 transition-transform duration-200 ease-in-out lg:hidden flex flex-col shadow-lg overflow-y-auto',
        showMobileSidebar ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <Sidebar
        @select-endpoint="selectEndpoint"
        :selected-endpoint="selectedEndpoint"
      />
    </div>

    <!-- Desktop Sidebar -->
    <div
      class="hidden lg:flex w-[16.7vw] bg-[#09090b] h-screen flex-col items-center overflow-y-auto custom-scrollbar"
    >
      <Sidebar
        @select-endpoint="selectEndpoint"
        :selected-endpoint="selectedEndpoint"
      />
    </div>

    <!-- Main Content -->
    <main
      class="flex-1 grid grid-cols-1 py-4 gap-4 px-4 lg:grid-cols-2 lg:py-10 lg:gap-6 lg:px-8 h-full roundborder border-l border-[#1a1a1a]"
    >
      <MainPanel :selected-endpoint="selectedEndpoint" />
    </main>

    <!-- Info Button -->
    <div
      id="info-btn-container"
      style="position: fixed; bottom: 24px; right: 24px; z-index: 50"
    >
      <button
        @click="openInfo"
        title="Info"
        class="w-11 h-11 rounded-full flex items-center justify-center bg-[#222] text-white hover:bg-[#444]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          class="w-5 h-5"
        >
          <path
            d="M480-680q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Zm-60 560v-480h120v480H420Z"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Info Modal -->
    <InfoModal :show="showInfoModal" @close="closeInfo" />
  </div>
</template>
