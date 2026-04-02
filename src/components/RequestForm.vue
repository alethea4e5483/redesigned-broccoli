<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAppStore } from "../stores/app";
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { Send, Plus, Minus } from "lucide-vue-next";

// Import all services
import { PrivateService as PlayerService } from "../gen/player_connect";
import { PrivateService as FriendsService } from "../gen/friends_connect";
import { PrivateService as WalletService } from "../gen/wallet_connect";
import { PrivateService as TournamentService } from "../gen/tournament_connect";

const props = defineProps<{
  endpoint: any;
}>();

const emit = defineEmits<{
  (e: "response", val: string): void;
  (e: "before-submit"): void;
}>();

const store = useAppStore();
const formValues = ref<Record<string, any>>({});
const metadataEntries = ref<{ key: string; value: any }[]>([]);
const errors = ref<string | null>(null);
const isSubmitting = ref(false);
const userDataJson = ref("");
const metadataSelection = ref("");

const initializeForm = () => {
  formValues.value = {};
  metadataEntries.value = [];
  errors.value = null;
  userDataJson.value = "";

  if (props.endpoint.params) {
    Object.entries(props.endpoint.params).forEach(
      ([key, param]: [string, any]) => {
        if (param.type !== "list") {
          const fieldName = param.value || key;
          formValues.value[fieldName] = param.default || "";
        }
      },
    );
  }
};

watch(() => props.endpoint, initializeForm, { immediate: true });

const addMetadataEntry = (key: string) => {
  if (metadataEntries.value.length >= 20) {
    alert("Max 20 metadata entries");
    return;
  }
  if (!metadataEntries.value.find((e) => e.key === key)) {
    metadataEntries.value.push({ key, value: "" });
  }
};

const removeMetadataEntry = (key: string) => {
  metadataEntries.value = metadataEntries.value.filter((e) => e.key !== key);
};

const availableMetadataKeys = computed(() => {
  const metadataParam = Object.values(props.endpoint.params || {}).find(
    (p: any) => p.type === "list" && p.metadata,
  );
  if (!metadataParam) return [];
  const allKeys = Object.keys((metadataParam as any).metadata);
  return allKeys.filter((k) => !metadataEntries.value.find((e) => e.key === k));
});

const getMetadataDef = (key: string) => {
  const metadataParam = Object.values(props.endpoint.params || {}).find(
    (p: any) => p.type === "list" && p.metadata,
  );
  return (metadataParam as any).metadata[key];
};

const validate = () => {
  if (store.limitsDisabled) return true;

  for (const [key, param] of Object.entries(props.endpoint.params || {})) {
    const p = param as any;
    if (p.type === "list" && p.metadata) {
      for (const entry of metadataEntries.value) {
        const metaDef = p.metadata[entry.key];
        if (metaDef?.regex && entry.value) {
          if (!new RegExp(metaDef.regex).test(String(entry.value))) {
            errors.value = `Field ${metaDef.name || entry.key} does not match required format.`;
            return false;
          }
        }
      }
    } else {
      const fieldName = p.value || key;
      const val = formValues.value[fieldName];
      if (p.required && !val) {
        errors.value = `Field ${p.name || key} is required.`;
        return false;
      }
      if (p.regex && val && !new RegExp(p.regex).test(String(val))) {
        errors.value = `Field ${p.name || key} does not match required format.`;
        return false;
      }
    }
  }
  return true;
};

const buildBody = () => {
  let body: any = {};

  if (props.endpoint.body) {
    const fillTemplate = (obj: any): any => {
      if (typeof obj === "string" && obj.startsWith("$")) {
        const key = obj.slice(1);
        let val = formValues.value[key];
        const param = props.endpoint.params?.[key];
        if (param?.type === "int" || param === "int") {
          val = parseInt(val, 10);
        }
        return val;
      } else if (typeof obj === "object" && obj !== null) {
        const out = Array.isArray(obj) ? [] : {};
        for (const k in obj) (out as any)[k] = fillTemplate(obj[k]);
        return out;
      }
      return obj;
    };
    body = fillTemplate(props.endpoint.body);
  } else if (props.endpoint.params) {
    Object.entries(props.endpoint.params).forEach(
      ([key, param]: [string, any]) => {
        if (param.type === "list" && param.metadata) {
          if (metadataEntries.value.length > 0) {
            const meta: any = {};
            metadataEntries.value.forEach((e) => {
              if (e.value !== "") {
                meta[e.key] = e.value;
              }
            });
            if (Object.keys(meta).length > 0) body.metadata = meta;
          }
        } else {
          const fieldName = param.value || key;
          let val = formValues.value[fieldName];
          if (param.type === "int" || param === "int") {
            val = parseInt(val, 10);
          }

          if (key.includes(".")) {
            const parts = key.split(".");
            let current = body;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = val;
          } else {
            body[key] = val;
          }
        }
      },
    );
  }
  return body;
};

const handleSubmit = async () => {
  errors.value = null;
  if (!store.identityToken) {
    errors.value = "Upload JSON first!";
    return;
  }

  if (!validate()) return;

  emit("before-submit");
  isSubmitting.value = true;

  try {
    const body = buildBody();
    const baseUrl = "https://subway.prod.sybo.net";

    if (props.endpoint.type === "json") {
      const res = await fetch(
        store.corsProxy + baseUrl + props.endpoint.endpoint,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.identityToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json();
      emit("response", JSON.stringify(data, null, 2));
    } else {
      // Connect-gRPC
      const transport = createConnectTransport({
        baseUrl: store.corsProxy + baseUrl + "/rpc",
        useBinaryFormat: true,
        interceptors: [
          (next) => async (req) => {
            req.header.set("Authorization", `Bearer ${store.identityToken}`);
            req.header.set(
              "User-Agent",
              "grpc-dotnet/2.63.0 (Mono Unity; CLR 4.0.30319.17020; netstandard2.0; arm64) com.kiloo.subwaysurf/3.47.0",
            );
            return await next(req);
          },
        ],
      });

      let client: any;
      const path = props.endpoint.endpoint.replace("/rpc/", "/");
      let methodName = path.split("/").pop();

      if (methodName) {
        methodName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
      }

      if (path.includes("player.ext.v1")) {
        client = createPromiseClient(PlayerService, transport);
      } else if (path.includes("friends.ext.v1")) {
        client = createPromiseClient(FriendsService, transport);
      } else if (path.includes("wallet.ext.v1")) {
        client = createPromiseClient(WalletService, transport);
      } else if (path.includes("tournament.ext.v2")) {
        client = createPromiseClient(TournamentService, transport);
      }

      if (client && methodName && client[methodName]) {
        const response = await client[methodName](body);
        const plainResponse = JSON.parse(JSON.stringify(response));
        emit("response", JSON.stringify(plainResponse, null, 2));
      } else {
        throw new Error(`Service or method ${methodName} not found`);
      }
    }
  } catch (err: any) {
    console.error(err);
    emit("response", `Error: ${err.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleAutofill = () => {
  try {
    const input = userDataJson.value.trim();
    if (!input) return;
    const parsed = JSON.parse(input);
    const userData = parsed.userData;
    if (!userData) {
      alert("JSON must contain { userData: {...} }");
      return;
    }

    if (userData.name) formValues.value["name"] = userData.name;
    if (userData.level !== undefined)
      formValues.value["level"] = userData.level;
    if (userData.highscore !== undefined)
      formValues.value["highscore"] = userData.highscore;

    if (Array.isArray(userData.metadataMap)) {
      metadataEntries.value = [];
      userData.metadataMap
        .slice(0, 20)
        .forEach(([key, value]: [string, any]) => {
          metadataEntries.value.push({ key, value });
        });
    }
  } catch (err: any) {
    alert("Invalid JSON: " + err.message);
  }
};

const hasMetadataParam = computed(() => {
  return Object.values(props.endpoint.params || {}).some(
    (p: any) => p.type === "list" && p.metadata,
  );
});

const onAddMetadata = () => {
  if (metadataSelection.value) {
    addMetadataEntry(metadataSelection.value);
    metadataSelection.value = "";
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="hasMetadataParam" class="space-y-2">
      <label class="block text-sm font-medium text-gray-300"
        >Paste userData JSON</label
      >
      <textarea
        v-model="userDataJson"
        rows="2"
        class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
        placeholder='{"userData":{...}}'
      ></textarea>
      <button
        @click="handleAutofill"
        type="button"
        class="bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-3 py-1 rounded-lg text-sm transition-colors cursor-pointer"
      >
        Autofill from JSON
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-for="(param, key) in endpoint.params" :key="key">
        <div v-if="param.type === 'list' && param.metadata" class="space-y-3">
          <label class="block text-sm font-medium text-gray-300">{{
            param.name
          }}</label>

          <div class="flex items-center gap-2">
            <select
              v-model="metadataSelection"
              class="flex-1 px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
            >
              <option value="" disabled selected>Select a key...</option>
              <option v-for="k in availableMetadataKeys" :key="k" :value="k">
                {{ k }}
              </option>
            </select>
            <button
              @click="onAddMetadata"
              type="button"
              class="p-2 rounded-md bg-[#1a1a1a] border border-[#333] hover:bg-[#252525] cursor-pointer"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="entry in metadataEntries"
              :key="entry.key"
              class="p-3 rounded-md bg-[#121212] border border-[#333] space-y-2"
            >
              <div class="flex items-center gap-2">
                <label class="flex-1 text-sm font-semibold truncate">{{
                  entry.key
                }}</label>
                <button
                  @click="removeMetadataEntry(entry.key)"
                  type="button"
                  class="p-1 rounded-md bg-[#1a1a1a] border border-[#333] hover:bg-red-900/20 hover:border-red-900 cursor-pointer"
                >
                  <Minus class="w-4 h-4" />
                </button>
              </div>

              <select
                v-if="getMetadataDef(entry.key).options"
                v-model="entry.value"
                class="w-full px-3 py-1.5 rounded-md bg-[#09090b] text-white border border-[#333]"
              >
                <option
                  v-for="opt in getMetadataDef(entry.key).options"
                  :key="opt"
                  :value="opt"
                >
                  {{ opt }}
                </option>
              </select>
              <input
                v-else
                v-model="entry.value"
                :type="
                  getMetadataDef(entry.key).type === 'int' ? 'number' : 'text'
                "
                :placeholder="getMetadataDef(entry.key).example || ''"
                class="w-full px-3 py-1.5 rounded-md bg-[#09090b] text-white border border-[#333]"
              />
              <p
                v-if="getMetadataDef(entry.key).desc"
                class="text-xs text-gray-500"
              >
                {{ getMetadataDef(entry.key).desc }}
              </p>
            </div>
          </div>
          <p class="text-xs text-gray-500">Max 20 Keys, every key only once.</p>
        </div>

        <div v-else class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">{{
            param.name || key
          }}</label>
          <input
            v-model="formValues[param.value || key]"
            :type="param.type === 'int' ? 'number' : 'text'"
            :placeholder="param.example || ''"
            :required="param.required"
            class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
          />
          <p v-if="param.desc" class="text-xs text-gray-500">
            {{ param.desc }}
          </p>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto bg-[#ffcc99] hover:bg-[#ee9e4f] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send v-if="!isSubmitting" class="w-4 h-4" />
          <div
            v-else
            class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"
          ></div>
          {{ isSubmitting ? "Sending..." : "Send Request" }}
        </button>
      </div>

      <div
        v-if="errors"
        class="text-red-500 text-sm font-medium mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
      >
        {{ errors }}
      </div>
    </form>
  </div>
</template>
