function renderSidebar() {
  // Desktop Sidebar
  const list = document.getElementById("endpointList");
  if (list) {
    list.innerHTML = "";
    endpointData.forEach((ep, i) => {
      const div = document.createElement("div");
      div.className =
        "sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex items-start gap-1 flex-col justify-between";
      const a = document.createElement("a");
      a.textContent = ep.name;
      a.className =
        "flex font-semibold justify-between font-poppins items-center gap-1";
      div.appendChild(a);
      div.onclick = () => {
        document
          .querySelectorAll("#endpointList .sidebar-link")
          .forEach((el) => el.classList.remove("sb-selected"));
        div.classList.add("sb-selected");
        document.getElementById("endpointTitle").textContent = ep.name;
        document.getElementById("endpointPath").textContent = ep.endpoint;
        document.getElementById("endpointDesc").textContent = ep.desc;

        // Clear previous response
        const responseResultDiv = document.getElementById("responseResult");
        if (responseResultDiv) {
          responseResultDiv.innerHTML =
            '<span class="text-left">Nothing returned yet.</span>';
        }

        renderForm(ep);
      };

      list.appendChild(div);
    });
  }

  // Mobile Sidebar
  const mobileList = document.getElementById("mobileEndpointList");
  if (mobileList) {
    mobileList.innerHTML = "";
    endpointData.forEach((ep, i) => {
      const div = document.createElement("div");
      div.className =
        "sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex items-start gap-1 flex-col justify-between";
      const a = document.createElement("a");
      a.textContent = ep.name;
      a.className =
        "flex font-semibold justify-between font-poppins items-center gap-1";
      div.appendChild(a);

      div.onclick = () => {
        document
          .querySelectorAll("#mobileEndpointList .sidebar-link")
          .forEach((el) => el.classList.remove("sb-selected"));

        div.classList.add("sb-selected");
        document.getElementById("endpointTitle").textContent = ep.name;
        document.getElementById("endpointPath").textContent = ep.endpoint;
        document.getElementById("endpointDesc").textContent = ep.desc;

        const responseResultDiv = document.getElementById("responseResult");
        if (responseResultDiv) {
          responseResultDiv.innerHTML =
            '<span class="text-left">Nothing returned yet.</span>';
        }

        renderForm(ep);
      };

      mobileList.appendChild(div);
    });
  }
}

function handleFormSubmit(ep, MsgType, RespType, url, opts, formElements, e) {
  const errorsEl = document.getElementById("errors");
  if (errorsEl) errorsEl.innerText = "";
  if (!identityToken) {
    if (typeof Notify === "function") {
      new Notify({
        status: "error",
        title: "Token missing",
        text: "You need to upload a valid identity file first",
        effect: "fade",
        speed: 300,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        type: "filled",
        position: "right top"
      });
    } else {
      alert("Token missing");
    }
    return;
  }

  const errorMsg = validateForm(ep, formElements);
  if (errorMsg) {
    if (errorsEl) errorsEl.innerHTML = errorMsg;
    return;
  }

  const body = buildRequestBody(ep, formElements, e);

  const responseResultDiv = document.getElementById("responseResult");
  if (responseResultDiv) {
    const newDiv = document.createElement("div");
    newDiv.id = "responseResult";
    newDiv.className = responseResultDiv.className;
    newDiv.style.cssText = responseResultDiv.style.cssText;
    newDiv.innerHTML =
      '<textarea id="response-output" rows="40" readonly class="w-full h-full bg-[#121212] text-white border-0 rounded p-2"></textarea>';
    responseResultDiv.replaceWith(newDiv);

    const responsePanel = document.getElementById("response-panel");
    if (responsePanel) {
      const existingCopyBtn = responsePanel.querySelector("#copy-response-btn");
      if (existingCopyBtn) {
        existingCopyBtn.parentElement.remove();
      }

      const buttonDiv = document.createElement("div");
      buttonDiv.className = "mb-3 flex justify-end";
      buttonDiv.innerHTML =
        '<button id="copy-response-btn" type="button" class="rounded-md border border-[#333] bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-[#252525]">Copy</button>';

      const h3 = responsePanel.querySelector("h3");
      if (h3) {
        h3.after(buttonDiv);
      }
    }

    const copyBtn = document.getElementById("copy-response-btn");
    const output = document.getElementById("response-output");
    if (copyBtn && output) {
      copyBtn.addEventListener("click", async () => {
        const text = output.value || "";
        if (!text.trim()) return;

        try {
          await navigator.clipboard.writeText(text);
        } catch {
          output.select();
          document.execCommand("copy");
          output.setSelectionRange(0, 0);
        }

        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = "Copy";
        }, 1200);
      });
    }
  }

  if (typeof window.showMobileResponsePanel === "function") {
    window.showMobileResponsePanel();
  }

  sendRequest(url, identityToken, MsgType, RespType, body, opts);
}
function renderForm(ep) {
  console.log("Rendering form for endpoint:", ep);

  if (typeof window.setMobileTabsVisible === "function") {
    console.log("Setting mobile tabs visible");
    window.setMobileTabsVisible(true);
  }

  const formDiv = document.getElementById("endpointForm");
  formDiv.innerHTML = buildFormHtml(ep);
  console.log("Form HTML built");

  const form = document.getElementById("apiForm");
  form.onsubmit = function (e) {
    e.preventDefault();
    console.log("Form submitted for endpoint:", ep.endpoint);

    const url = "https://subway.prod.sybo.net" + ep.endpoint;
    const opts = { json: ep.type === "json" };
    console.log("Request URL:", url, "Options:", opts);

    let MsgType = null;
    let RespType = null;

    if (ep.type === "rpc") {
      try {
        console.log("Attempting to resolve protobuf types");
        console.log("ep.request:", ep.request);
        console.log("ep.response:", ep.response);

        MsgType = ("proto." + ep.request)
          .split(".")
          .reduce((o, k) => o?.[k], window);
        RespType = ("proto." + ep.response)
          .split(".")
          .reduce((o, k) => o?.[k], window);

        console.log("Resolved MsgType:", MsgType);
        console.log("Resolved RespType:", RespType);

        if (!MsgType || !RespType) {
          throw new Error(
            "MsgType or RespType not found. Make sure proto.js is loaded and the classes exist on window."
          );
        }
      } catch (err) {
        console.error("Error resolving protobuf types:", err);
        alert("Protobuf-Types could not be loaded: " + err.message);
        return;
      }
    }

    console.log("Calling handleFormSubmit");
    handleFormSubmit(ep, MsgType, RespType, url, opts, this.elements, e);
    console.log("handleFormSubmit called successfully");
  };
}

async function getProtoType(path) {
  // root should be the protobuf root returned by protobuf.load
  if (!window.protobufRoot) {
    console.error("Protobuf root is not loaded");
    return null;
  }

  try {
    const type = window.protobufRoot.lookupType(path.replace(/^proto\./, ""));
    console.log("Resolved protobuf type:", type);
    return type;
  } catch (err) {
    console.error("Failed to lookup type:", path, err);
    return null;
  }
}
