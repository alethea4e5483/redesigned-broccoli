<script setup lang="ts">
import { computed } from "vue";
import { endpointsList } from "../endpoints";
import { useSidebar } from "../composables/useSidebar";

const props = defineProps<{
  selectedEndpoint: any;
}>();

const emit = defineEmits<{
  (e: "select-endpoint", endpoint: any): void;
}>();

const { searchQuery, fileInput, expiryDisplay, hasIdentity, onFileChange, triggerUpload } =
  useSidebar();
void fileInput;

const filteredEndpoints = computed(() => {
  if (!searchQuery.value) return endpointsList;
  const query = searchQuery.value.toLowerCase();
  return endpointsList.filter(
    (ep) =>
      ep.name.toLowerCase().includes(query) ||
      ep.endpoint.toLowerCase().includes(query),
  );
});
</script>

<template>
  <div class="flex flex-col items-center w-full p-4">
    <div class="text-left font-poppins text-lg mb-2 text-[#ffcc99] w-full">
      Endpoints
    </div>

    <p
      v-if="expiryDisplay"
      id="token-expire-mobile"
      class="font-poppins mb-2 text-center text-xs text-gray-400 lg:hidden"
    >
      Expires:<br />{{ expiryDisplay }}
    </p>
    <p
      v-if="expiryDisplay"
      id="token-expire"
      class="font-poppins mb-2 text-center text-xs text-gray-400 hidden lg:block"
    >
      Expires:<br />{{ expiryDisplay }}
    </p>

    <div class="flex items-center gap-2 mb-2">
      <button
        @click="triggerUpload"
        type="button"
        class="cursor-pointer hover:bg-[#7760fe] hover:text-white duration-100 p-2 px-6 rounded-[7px] bg-white text-black font-semibold text-sm"
      >
        <i
          v-if="hasIdentity"
          class="fa fa-file mr-2"
          aria-hidden="true"
        ></i>
        <i
          v-else
          class="fa fa-upload mr-2"
          aria-hidden="true"
        ></i>
        {{ hasIdentity ? "identity" : "Upload Identity" }}
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="*"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <div class="w-full">
      <div class="px-4 mb-4 w-full lg:hidden">
        <input
          v-model="searchQuery"
          id="endpointSearch"
          type="text"
          placeholder="Search endpoints..."
          autocomplete="off"
          class="endpointSearch px-3 py-2.5"
        />
      </div>
      <div class="px-4 mb-4 w-full hidden lg:block">
        <input
          v-model="searchQuery"
          id="endpointSearchDesktop"
          type="text"
          placeholder="Search endpoints..."
          autocomplete="off"
          class="endpointSearch px-3 py-2.5"
        />
      </div>
    </div>
  </div>

  <div
    id="mobileEndpointList"
    class="sidebar-links mb-5 w-full flex justify-center flex-col items-center gap-3 lg:hidden"
  >
    <div
      v-for="ep in filteredEndpoints"
      :key="ep.endpoint"
      @click="emit('select-endpoint', ep)"
      :class="[
        'sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex flex-col justify-between border border-transparent',
        props.selectedEndpoint?.endpoint === ep.endpoint ? 'sb-selected' : '',
      ]"
    >
      <span class="font-semibold font-poppins">{{ ep.name }}</span>
    </div>
  </div>

  <div
    id="endpointList"
    class="sidebar-links mb-5 w-full flex flex-col items-center gap-3 hidden lg:flex"
  >
    <div
      v-for="ep in filteredEndpoints"
      :key="ep.endpoint"
      @click="emit('select-endpoint', ep)"
      :class="[
        'sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex flex-col justify-between border border-transparent',
        props.selectedEndpoint?.endpoint === ep.endpoint ? 'sb-selected' : '',
      ]"
    >
      <span class="font-semibold font-poppins">{{ ep.name }}</span>
    </div>
  </div>
</template>
