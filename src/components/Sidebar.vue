<script setup lang="ts">
import { computed } from "vue";
import { useAppStore } from "../stores/app";
import { endpointsList } from "../endpoints";
import { Upload, FileText } from "lucide-vue-next";
import { useSidebar } from "../composables/useSidebar";

const props = defineProps<{
  selectedEndpoint: any;
}>();

const emit = defineEmits<{
  (e: "select-endpoint", endpoint: any): void;
}>();

const store = useAppStore();
const { searchQuery, expiryDisplay, onFileChange, triggerUpload } =
  useSidebar();

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
  <div class="block lg:flex w-full">
    <div class="flex flex-col items-center w-full p-4">
      <div class="text-left text-lg mb-2 text-[#ffcc99] w-full">Endpoints</div>

      <p
        v-if="store.identityExpiry"
        class="mb-2 text-center text-xs text-gray-400"
      >
        Expires:<br />{{ expiryDisplay }}
      </p>

      <div class="flex items-center gap-2 mb-2">
        <button
          @click="triggerUpload"
          type="button"
          class="cursor-pointer hover:bg-[#7760fe] hover:text-white duration-100 p-2 px-6 rounded-[7px] bg-white text-black"
        >
          <FileText v-if="store.identityToken" class="w-4 h-4" />
          <Upload v-else class="w-4 h-4" />
          {{ store.identityToken ? "identity" : "Upload Identity" }}
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="*"
          class="hidden"
          @change="onFileChange"
        />
      </div>

      <div>
        <div class="px-4 mb-4 w-full">
          <input
            v-model="searchQuery"
            id="endpointSearch"
            type="text"
            placeholder="Search endpoints..."
            autocomplete="off"
            class="endpointSearch px-3 py-2.5"
          />
        </div>
        <div
          id="mobileEndpointList"
          class="sidebar-links mb-5 w-full flex justify-center flex-col items-center gap-3"
        ></div>
      </div>
    </div>

    <div class="sidebar-links mb-5 w-full flex flex-col items-center gap-3">
      <div
        v-for="ep in filteredEndpoints"
        :key="ep.endpoint"
        @click="emit('select-endpoint', ep)"
        :class="[
          'sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex flex-col justify-between border border-transparent',
          props.selectedEndpoint?.endpoint === ep.endpoint ? 'sb-selected' : '',
        ]"
      >
        <span class="">{{ ep.name }}</span>
      </div>
    </div>
  </div>
</template>
