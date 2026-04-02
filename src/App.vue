<template>
  <div class="bg-[#09090b] text-white font-sans min-h-screen block lg:flex">
    <!-- Mobile Sidebar -->
    <MobileSidebar />

    <!-- Desktop Layout -->
    <div class="block lg:flex w-full">
      <!-- Desktop Sidebar -->
      <Sidebar />

      <!-- Main Content -->
      <MainContent />
    </div>

    <!-- Info Modal -->
    <InfoModal />
  </div>
</template>

<script setup lang="ts">
import MobileSidebar from './components/MobileSidebar.vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'
import InfoModal from './components/InfoModal.vue'
</script>

<style>
/* Global Styles */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

:root {
  --main: #ffcc99;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #09090b;
  overflow-x: hidden;
  overflow: hidden;
  --grid-size: 60px;
  text-align: left !important;
  --grid-strength: 1px;
  --grid-dash: 10px;
  --grid-gap: 5px;
  --grid-color: #333;
  --paper-color: #09090b;
  background-size:
    var(--grid-dash) var(--grid-dash),
    var(--grid-size) var(--grid-size);
  background-image:
    linear-gradient(
      to bottom,
      transparent var(--grid-gap),
      var(--paper-color) var(--grid-gap)
    ),
    linear-gradient(
      to right,
      var(--grid-color) var(--grid-strength),
      transparent var(--grid-strength)
    ),
    linear-gradient(
      to right,
      transparent var(--grid-gap),
      var(--paper-color) var(--grid-gap)
    ),
    linear-gradient(
      to bottom,
      var(--grid-color) var(--grid-strength),
      transparent var(--grid-strength)
    );
}

html {
  background-color: #09090b;
  overflow: hidden;
}

.font-poppins {
  font-family: 'Poppins';
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
