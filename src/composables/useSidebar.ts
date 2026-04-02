import { ref, computed } from "vue";
import { useAppStore } from "../stores/app";

export function useSidebar() {
  const store = useAppStore();
  const searchQuery = ref("");
  const fileInput = ref<HTMLInputElement | null>(null);

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

  return {
    searchQuery,
    fileInput,
    expiryDisplay,
    onFileChange,
    triggerUpload,
  };
}
