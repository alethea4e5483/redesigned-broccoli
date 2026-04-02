async function sendRequest(
  url,
  token,
  MsgType,
  RespType,
  body = {},
  opts = {}
) {
  const notifyMobileResponseReady = () => {
    if (typeof window.markMobileResponseReady === "function") {
      window.markMobileResponseReady();
    }
  };

  const output = document.getElementById("response-output");
  output.style.display = "none";
  if (!token) {
    alert("Upload JSON first!");
    return;
  }

  const isJson = opts.json === true;
  let headers = { Authorization: "Bearer " + token };
  let requestBody;

  if (isJson) {
    // JSON
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body || {});
  } else {
    // gRPC-Web
    if (typeof MsgType !== "function" || typeof RespType !== "function") {
      alert("MsgType or RespType are not defined for gRPC request!");
      return;
    }

    let payload;
    // Extract class name from full package path (e.g., "player.ext.v1.UpdatePlayerRequest" -> "UpdatePlayerRequest")
    const msgClassName = MsgType.name || "";

    if (
      MsgType &&
      (msgClassName === "UpdatePlayerRequest" || /UpdatePlayer/i.test(url))
    ) {
      payload = encodeUpdatePlayerRequest(body);
    } else {
      function fillMessage(msgInstance, obj) {
        for (const k in obj) {
          if (!obj.hasOwnProperty(k)) continue;

          // Try different naming conventions for the setter
          const camelCase = "set" + k.charAt(0).toUpperCase() + k.slice(1);
          const firstCapRestLower =
            "set" + k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
          const val = obj[k];

          let setter = null;
          if (typeof msgInstance[camelCase] === "function") {
            setter = camelCase;
          } else if (typeof msgInstance[firstCapRestLower] === "function") {
            setter = firstCapRestLower;
          }

          const mapGetter =
            "get" + k.charAt(0).toUpperCase() + k.slice(1) + "Map";
          const addRepeated = "add" + k.charAt(0).toUpperCase() + k.slice(1);

          if (setter && typeof msgInstance[setter] === "function") {
            if (val && typeof val === "object" && !Array.isArray(val)) {
              // For nested objects, try to get the correct message type
              const getter = "get" + k.charAt(0).toUpperCase() + k.slice(1);
              let nestedMsg = null;

              try {
                // Try to get an instance using the getter
                if (typeof msgInstance[getter] === "function") {
                  nestedMsg = msgInstance[getter]();
                }
              } catch (e) {
                // Getter didn't work
              }

              // If we couldn't get an instance, try to find the constructor
              if (!nestedMsg) {
                try {
                  // Try finding constructor from the setter function
                  const setterFunc = msgInstance[setter];
                  if (setterFunc && setterFunc.fqn) {
                    // protobuf may expose fqn
                    const parts = setterFunc.fqn.split(".");
                    let ctor = window;
                    for (const part of ["proto", ...parts]) {
                      ctor = ctor?.[part];
                    }
                    if (typeof ctor === "function") {
                      nestedMsg = new ctor();
                    }
                  }
                } catch (e) {
                  // Could not get constructor
                }
              }

              // Last attempt: try creating from setter prototype
              if (!nestedMsg) {
                try {
                  const ctor = msgInstance[setter].prototype?.constructor;
                  nestedMsg = new ctor();
                } catch (e) {
                  console.warn(
                    `Could not create instance for nested field ${k}`
                  );
                }
              }

              if (nestedMsg) {
                fillMessage(nestedMsg, val);
                msgInstance[setter](nestedMsg);
              }
            } else {
              msgInstance[setter](val);
            }
          } else if (typeof msgInstance[mapGetter] === "function") {
            const map = msgInstance[mapGetter]();
            for (const mapKey in val) map.set(mapKey, val[mapKey]);
          } else if (
            typeof msgInstance[addRepeated] === "function" &&
            Array.isArray(val)
          ) {
            val.forEach((item) => {
              if (item && typeof item === "object") {
                const nestedMsg = new (
                  msgInstance[addRepeated].prototype?.constructor || Object
                )();
                fillMessage(nestedMsg, item);
                msgInstance[addRepeated](nestedMsg);
              } else msgInstance[addRepeated](item);
            });
          } else {
            console.warn(`Field ${k} not found on message`);
            console.log(
              `Available methods on message:`,
              Object.getOwnPropertyNames(Object.getPrototypeOf(msgInstance))
            );
          }
        }
      }
      const msg = new MsgType();
      fillMessage(msg, body);
      payload = msg.serializeBinary();
    }

    const lenBuf = new Uint8Array(4);
    new DataView(lenBuf.buffer).setUint32(0, payload.length);

    const framedBody = new Uint8Array(1 + 4 + payload.length);
    framedBody[0] = 0;
    framedBody.set(lenBuf, 1);
    framedBody.set(payload, 5);
    requestBody = framedBody;

    headers = {
      ...headers,
      "User-Agent":
        "grpc-dotnet/2.63.0 (Mono Unity; CLR 4.0.30319.17020; netstandard2.0; arm64) com.kiloo.subwaysurf/3.47.0",
      TE: "trailers",
      "grpc-accept-encoding": "identity,gzip",
      "Content-Type": "application/grpc-web"
    };
  }

  try {
    let corsProxy =
      localStorage.getItem("corsProxy") ||
      "https://noisy-disk-638c.herrerde.workers.dev/?url=";
    const res = await fetch(corsProxy + url, {
      method: "POST",
      headers,
      body: requestBody
    });

    if (isJson) {
      const text = await res.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON response: " + text);
      }
      output.style.display = "block";
      output.value = JSON.stringify(parsed, null, 2);
      notifyMobileResponseReady();
      return;
    }

    const grpcStatus = res.headers.get("grpc-status");
    if (grpcStatus && grpcStatus !== "0") {
      const details = res.headers.get("grpc-status-details-bin");
      output.style.display = "block";
      output.value =
        "gRPC Error " + grpcStatus + ":\n" + decodeGrpcStatus(details);
      notifyMobileResponseReady();
      return;
    }

    const raw = new Uint8Array(await res.arrayBuffer());
    if (raw.length < 5) throw new Error("Response too short");

    const msgLen = new DataView(raw.buffer, 1, 4).getUint32(0);
    const grpcPayload = raw.slice(5, 5 + msgLen);

    let resp;
    try {
      resp = RespType.deserializeBinary(grpcPayload);
    } catch (deserializeErr) {
      // If deserialization fails due to missing proto.google, try a workaround
      if (deserializeErr.message.includes("proto.google")) {
        console.warn(
          "proto.google not initialized, attempting raw response parsing"
        );
        throw new Error(
          "Response deserialization failed: proto.google is undefined. This is a library initialization issue."
        );
      }
      throw deserializeErr;
    }

    output.style.display = "block";
    output.value = JSON.stringify(resp.toObject(), null, 2);
    notifyMobileResponseReady();
  } catch (err) {
    console.error("Request failed:", err);
    output.style.display = "block";
    output.value = "Error: " + err.message;
    notifyMobileResponseReady();
  }
}

// Decode grpc-status-details-bin into readable message
function decodeGrpcStatus(base64str) {
  if (!base64str) return "No grpc-status-details-bin header present.";

  try {
    base64str = base64str + "=".repeat((4 - (base64str.length % 4)) % 4);

    // Try to decode if proto.google.rpc.Status is available
    if (
      window.proto &&
      window.proto.google &&
      window.proto.google.rpc &&
      window.proto.google.rpc.Status
    ) {
      const bytes = Uint8Array.from(atob(base64str), (c) => c.charCodeAt(0));
      const status = proto.google.rpc.Status.deserializeBinary(bytes);
      const out = [
        `Code: ${status.getCode()}`,
        `Message: ${status.getMessage()}`
      ];
      status.getDetailsList().forEach((detail) => {
        out.push(`Detail type: ${detail.getTypeUrl()}`);
      });
      return out.join("\n");
    }

    return "Could not decode grpc-status-details-bin (proto.google.rpc.Status not available)";
  } catch (e) {
    return "Failed to decode grpc-status-details-bin: " + e.message;
  }
}

const UpdatePlayerSpec = {
  positions: { name: 1, level: 2, highscore: 3, metadata: 4 },
  types: {
    name: "string",
    level: "int32",
    highscore: "int64",
    metadata: "map<string,string>"
  }
};

function encodeUpdatePlayerRequest(obj = {}) {
  const writer = new jspb.BinaryWriter();
  const { positions, types } = UpdatePlayerSpec;

  const writeInt64Safe = (pos, val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return;
    if (Number.isSafeInteger(n)) writer.writeInt64(pos, n);
    else if (typeof writer.writeInt64String === "function")
      writer.writeInt64String(pos, String(n));
    else writer.writeString(pos, String(n));
  };

  for (const [field, pos] of Object.entries(positions)) {
    const val = obj[field];
    if (val == null) continue;

    switch (types[field]) {
      case "string": {
        const s = String(val).trim();
        if (s !== "") writer.writeString(pos, s);
        break;
      }
      case "int32": {
        const n = Number(val);
        if (Number.isFinite(n)) writer.writeInt32(pos, Math.trunc(n));
        break;
      }
      case "int64":
        writeInt64Safe(pos, val);
        break;
      default:
        if (typeof val === "object") {
          for (const [k, vRaw] of Object.entries(val)) {
            const v =
              vRaw != null && typeof vRaw === "object"
                ? JSON.stringify(vRaw)
                : String(vRaw);
            writer.writeMessage(pos, { key: k, value: v }, (entry, w) => {
              w.writeString(1, entry.key);
              w.writeString(2, entry.value);
            });
          }
        }
    }
  }

  return writer.getResultBuffer();
}
