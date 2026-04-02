document.addEventListener("DOMContentLoaded", () => {
  // Clear search inputs on page load
  const searchInputMobile = document.getElementById("endpointSearch");
  const searchInputDesktop = document.getElementById("endpointSearchDesktop");

  if (searchInputMobile) {
    searchInputMobile.value = "";
  }
  if (searchInputDesktop) {
    searchInputDesktop.value = "";
  }

  // Use setTimeout to ensure it clears after all other scripts run
  setTimeout(() => {
    if (searchInputMobile) {
      searchInputMobile.value = "";
    }
    if (searchInputDesktop) {
      searchInputDesktop.value = "";
    }
  }, 0);

  let limitsDisabled = localStorage.getItem("limitsDisabled") === "true";
  const toggleCheckbox = document.getElementById("disableLimitsToggle");

  if (toggleCheckbox) {
    toggleCheckbox.checked = limitsDisabled;
    if (localStorage.getItem("limitsDisabled") === null) {
      localStorage.setItem("limitsDisabled", limitsDisabled);
    }

    toggleCheckbox.addEventListener("change", () => {
      limitsDisabled = toggleCheckbox.checked;
      localStorage.setItem("limitsDisabled", limitsDisabled);
      console.log("Limits disabled:", limitsDisabled);
    });
  }

  const input = document.getElementById("corsProxyInput");
  const saveBtn = document.getElementById("corsProxySave");
  if (input) {
    const savedProxy =
      localStorage.getItem("corsProxy") ||
      "https://noisy-disk-638c.herrerde.workers.dev/?url=";
    input.value = savedProxy;
  }

  if (input && saveBtn) {
    saveBtn.addEventListener("click", () => {
      const newValue = input.value.trim();
      localStorage.setItem("corsProxy", newValue);
      console.log("Saved CORS Proxy:", newValue);
    });
  }

  const infoBtn = document.getElementById("info-btn");
  const infoModal = document.getElementById("info-modal");
  const infoModalClose = document.getElementById("info-modal-close");
  const requestPanel = document.getElementById("request-panel");
  const responsePanel = document.getElementById("response-panel");
  const requestTab = document.getElementById("mobile-tab-request");
  const responseTab = document.getElementById("mobile-tab-response");
  const mobileViewTabs = document.getElementById("mobile-view-tabs");
  const responseBadge = document.getElementById("mobile-response-badge");
  let hasUnreadResponse = false;

  function clearResponseAttention() {
    hasUnreadResponse = false;
    if (responseBadge) responseBadge.classList.add("hidden");
    if (responseTab) {
      responseTab.classList.remove("animate-pulse");
      if (!responsePanel || responsePanel.classList.contains("hidden")) {
        responseTab.classList.remove("ring-2", "ring-emerald-400/80");
      }
    }
  }

  function setMobilePanel(view) {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!requestPanel || !responsePanel) return;

    if (isDesktop) {
      requestPanel.classList.remove("hidden");
      responsePanel.classList.remove("hidden");
      return;
    }

    const showRequest = view !== "response";
    requestPanel.classList.toggle("hidden", !showRequest);
    responsePanel.classList.toggle("hidden", showRequest);

    if (!showRequest) {
      clearResponseAttention();
    }

    if (requestTab && responseTab) {
      requestTab.classList.toggle("bg-[#ffcc99]", showRequest);
      requestTab.classList.toggle("text-black", showRequest);
      requestTab.classList.toggle("text-gray-300", !showRequest);
      responseTab.classList.toggle("bg-[#ffcc99]", !showRequest);
      responseTab.classList.toggle("text-black", !showRequest);
      responseTab.classList.toggle("text-gray-300", showRequest);
      responseTab.classList.toggle("ring-2", hasUnreadResponse && showRequest);
      responseTab.classList.toggle(
        "ring-emerald-400/80",
        hasUnreadResponse && showRequest
      );
    }
  }

  window.showMobileResponsePanel = () => setMobilePanel("response");
  window.setMobileTabsVisible = (visible) => {
    if (!mobileViewTabs) return;
    mobileViewTabs.classList.toggle("hidden", !visible);
  };
  window.markMobileResponseReady = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (
      isDesktop ||
      !responsePanel ||
      !responsePanel.classList.contains("hidden")
    ) {
      return;
    }
    hasUnreadResponse = true;
    if (responseBadge) responseBadge.classList.remove("hidden");
    if (responseTab) responseTab.classList.add("animate-pulse");
    setMobilePanel("request");
  };

  if (requestTab) {
    requestTab.addEventListener("click", () => setMobilePanel("request"));
  }
  if (responseTab) {
    responseTab.addEventListener("click", () => setMobilePanel("response"));
  }
  window.addEventListener("resize", () => {
    const activeView =
      responsePanel && !responsePanel.classList.contains("hidden")
        ? "response"
        : "request";
    setMobilePanel(activeView);
  });
  window.setMobileTabsVisible(false);
  setMobilePanel("request");

  if (infoBtn && infoModal) {
    infoBtn.addEventListener("click", () =>
      infoModal.classList.remove("hidden")
    );
  }
  if (infoModalClose && infoModal) {
    infoModalClose.addEventListener("click", () =>
      infoModal.classList.add("hidden")
    );
  }
  if (infoModal) {
    infoModal.addEventListener("click", (e) => {
      if (e.target === infoModal) infoModal.classList.add("hidden");
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && infoModal) infoModal.classList.add("hidden");
  });

  const setupSearch = (searchInput) => {
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();

      const desktopLinks = document.querySelectorAll(
        "#endpointList .sidebar-link"
      );
      desktopLinks.forEach((link) => {
        const text = link.textContent.toLowerCase();
        const shouldShow = text.includes(query);
        link.style.display = shouldShow ? "" : "none";
      });

      const mobileLinks = document.querySelectorAll(
        "#mobileEndpointList .sidebar-link"
      );
      mobileLinks.forEach((link) => {
        const text = link.textContent.toLowerCase();
        const shouldShow = text.includes(query);
        link.style.display = shouldShow ? "" : "none";
      });
    });
  };

  setupSearch(searchInputMobile);
  setupSearch(searchInputDesktop);
});
