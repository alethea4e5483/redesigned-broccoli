<script setup lang="ts">
import { ref } from "vue";
import RequestForm from "./RequestForm.vue";
import ResponsePanel from "./ResponsePanel.vue";

const props = defineProps<{
  selectedEndpoint: any;
}>();

const activeTab = ref<"request" | "response">("request");
const responseValue = ref("Nothing returned yet.");
const isResponseReady = ref(false);

const onResponse = (val: string) => {
  responseValue.value = val;
  isResponseReady.value = true;
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  if (!isDesktop) {
    activeTab.value = "response";
  }
};

const clearResponse = () => {
  responseValue.value = "Nothing returned yet.";
  isResponseReady.value = false;
};

const setTab = (tab: "request" | "response") => {
  activeTab.value = tab;
  if (tab === "response") {
    isResponseReady.value = false;
  }
};
</script>

<template>
  <div class="contents">
    <!-- Mobile Tabs -->
    <div
      v-if="selectedEndpoint"
      class="lg:hidden sticky top-0 z-20 bg-[#09090b] py-2"
    >
      <div
        class="grid grid-cols-2 gap-2 rounded-xl border border-[#222] bg-[#101014] p-1"
      >
        <button
          @click="setTab('request')"
          type="button"
          :class="[
            'rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer',
            activeTab === 'request'
              ? 'bg-[#ffcc99] text-black'
              : 'text-gray-300',
          ]"
        >
          Request
        </button>
        <button
          @click="setTab('response')"
          type="button"
          :class="[
            'relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer',
            activeTab === 'response'
              ? 'bg-[#ffcc99] text-black'
              : 'text-gray-300',
          ]"
        >
          Response
          <span
            v-if="isResponseReady && activeTab === 'request'"
            class="absolute right-2 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
          ></span>
        </button>
      </div>
    </div>

    <!-- Request Panel -->
    <div
      :class="[
        'bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] bg-[#09090b] h-[calc(100dvh-11rem)] lg:h-screen overflow-y-auto custom-scrollbar',
        activeTab === 'request' ? 'block' : 'hidden lg:block',
      ]"
    >
      <div v-if="selectedEndpoint">
        <h2 class="text-[#ffcc99] font-poppins text-2xl font-semibold mb-2">
          {{ selectedEndpoint.name }}
        </h2>
        <p class="font-poppins text-gray-400 mb-4">
          {{ selectedEndpoint.endpoint }}
        </p>
        <p v-if="selectedEndpoint.desc" class="font-poppins text-gray-400 mb-2">
          {{ selectedEndpoint.desc }}
        </p>

        <RequestForm
          :endpoint="selectedEndpoint"
          @response="onResponse"
          @before-submit="clearResponse"
        />
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-gray-500"
      >
        <h2 class="text-[#ffcc99] font-poppins text-2xl font-semibold mb-2">
          Select an Endpoint
        </h2>
        <p class="font-poppins">Choose an endpoint from the sidebar to test.</p>
      </div>
    </div>

    <!-- Response Panel -->
    <div
      :class="[
        'bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] flex-col h-[calc(100dvh-11rem)] lg:h-auto',
        activeTab === 'response' ? 'flex' : 'hidden lg:flex',
      ]"
    >
      <ResponsePanel :value="responseValue" />
    </div>
  </div>
</template>
