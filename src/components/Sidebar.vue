<script setup lang="ts">
import { ref, computed } from "vue";
import { useAppStore } from "../stores/app";
import { endpointsList } from "../endpoints";
import { Upload, FileText, Search } from "lucide-vue-next";

const props = defineProps<{
  selectedEndpoint: any;
}>();

const emit = defineEmits<{
  (e: "select-endpoint", endpoint: any): void;
}>();

const store = useAppStore();
const searchQuery = ref("");
const fileInput = ref<HTMLInputElement | null>(null);

const filteredEndpoints = computed(() => {
  if (!searchQuery.value) return endpointsList;
  const query = searchQuery.value.toLowerCase();
  return endpointsList.filter(
    (ep) =>
      ep.name.toLowerCase().includes(query) ||
      ep.endpoint.toLowerCase().includes(query),
  );
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.name.startsWith("identity")) {
    alert('Please select a file named "identity"');
    target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const result = ev.target?.result;
      if (typeof result !== "string") return;

      const json = JSON.parse(result);
      if (
        !json.user?.id ||
        !json.identityToken?.token ||
        !json.refreshToken?.token
      ) {
        throw new Error("JSON missing required fields");
      }

      const jwt = json.identityToken.token;
      let expiryDate: Date | null = null;
      if (json.identityToken.expiresAt) {
        expiryDate = new Date(json.identityToken.expiresAt);
        if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
          alert("Token has expired");
          return;
        }
      }

      store.setIdentity(jwt, expiryDate);
    } catch (err) {
      alert("Invalid identity file");
      store.clearIdentity();
      target.value = "";
    }
  };
  reader.readAsText(file);
};

const triggerUpload = () => {
  fileInput.value?.click();
};

const expiryDisplay = computed(() => {
  if (!store.identityExpiry) return "";
  return new Date(store.identityExpiry).toLocaleString();
});
</script>

<template>
  <div class="flex flex-col items-center w-full p-4">
    <div class="text-left font-poppins text-lg mb-2 text-[#ffcc99] w-full">
      Endpoints
    </div>

    <p
      v-if="store.identityExpiry"
      class="font-poppins mb-2 text-center text-xs text-gray-400"
    >
      Expires:<br />{{ expiryDisplay }}
    </p>

    <div class="flex items-center gap-2 mb-4 w-full justify-center">
      <button
        @click="triggerUpload"
        type="button"
        :class="[
          'cursor-pointer duration-100 p-2 px-6 rounded-[7px] font-semibold text-sm flex items-center gap-2',
          store.identityToken
            ? 'bg-[#7760fe] text-white'
            : 'bg-white text-black hover:bg-[#7760fe] hover:text-white',
        ]"
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

    <div class="w-full px-4 mb-4">
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search endpoints..."
          autocomplete="off"
          class="w-full pl-10 pr-3 py-2.5 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
        />
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
        <span class="font-semibold font-poppins text-sm">{{ ep.name }}</span>
      </div>
    </div>
  </div>
</template>
