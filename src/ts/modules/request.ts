import { stateManager } from './state'

interface Message {
  toObject(): Record<string, any>
  serializeBinary(): Uint8Array
}

interface MessageStatic {
  new(): Message
  deserializeBinary(bytes: Uint8Array): Message
  name?: string
}

function decodeGrpcStatus(base64str: string | null): string {
  if (!base64str) return 'No grpc-status-details-bin header present.'

  try {
    const paddedStr =
      base64str + '='.repeat((4 - (base64str.length % 4)) % 4)

    if (
      (window as any).proto &&
      (window as any).proto.google &&
      (window as any).proto.google.rpc &&
      (window as any).proto.google.rpc.Status
    ) {
      const bytes = Uint8Array.from(atob(paddedStr), (c) => c.charCodeAt(0))
      const status = (window as any).proto.google.rpc.Status.deserializeBinary(bytes)
      const out = [
        `Code: ${status.getCode()}`,
        `Message: ${status.getMessage()}`
      ]
      status.getDetailsList().forEach((detail: any) => {
        out.push(`Detail type: ${detail.getTypeUrl()}`)
      })
      return out.join('\n')
    }

    return 'Could not decode grpc-status-details-bin (proto.google.rpc.Status not available)'
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    return 'Failed to decode grpc-status-details-bin: ' + errMsg
  }
}

const UpdatePlayerSpec = {
  positions: { name: 1, level: 2, highscore: 3, metadata: 4 },
  types: {
    name: 'string',
    level: 'int32',
    highscore: 'int64',
    metadata: 'map<string,string>'
  }
}

function encodeUpdatePlayerRequest(obj: Record<string, any> = {}): Uint8Array {
  const writer = new (window as any).jspb.BinaryWriter()
  const { positions, types } = UpdatePlayerSpec

  const writeInt64Safe = (pos: number, val: any): void => {
    const n = Number(val)
    if (!Number.isFinite(n)) return
    if (Number.isSafeInteger(n)) writer.writeInt64(pos, n)
    else if (typeof writer.writeInt64String === 'function')
      writer.writeInt64String(pos, String(n))
    else writer.writeString(pos, String(n))
  }

  for (const [field, pos] of Object.entries(positions)) {
    const val = obj[field]
    if (val == null) continue

    switch (types[field as keyof typeof types]) {
      case 'string': {
        const s = String(val).trim()
        if (s !== '') writer.writeString(pos, s)
        break
      }
      case 'int32': {
        const n = Number(val)
        if (Number.isFinite(n)) writer.writeInt32(pos, Math.trunc(n))
        break
      }
      case 'int64':
        writeInt64Safe(pos, val)
        break
      default:
        if (typeof val === 'object') {
          for (const [k, vRaw] of Object.entries(val)) {
            const v =
              vRaw != null && typeof vRaw === 'object'
                ? JSON.stringify(vRaw)
                : String(vRaw)
            writer.writeMessage(pos, { key: k, value: v }, (entry: any, w: any) => {
              w.writeString(1, entry.key)
              w.writeString(2, entry.value)
            })
          }
        }
    }
  }

  return writer.getResultBuffer()
}

export async function sendRequest(
  url: string,
  token: string | null,
  MsgType?: MessageStatic,
  RespType?: MessageStatic,
  body: Record<string, any> = {},
  opts: { json?: boolean } = {}
): Promise<void> {
  const notifyMobileResponseReady = (): void => {
    if (typeof (window as any).markMobileResponseReady === 'function') {
      (window as any).markMobileResponseReady()
    }
  }

  const output = document.getElementById('response-output') as HTMLTextAreaElement | null
  if (output) {
    output.style.display = 'none'
  }

  if (!token) {
    alert('Upload JSON first!')
    return
  }

  const isJson = opts.json === true
  let headers: Record<string, string> = { Authorization: 'Bearer ' + token }
  let requestBody: any

  if (isJson) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body || {})
  } else {
    if (typeof MsgType !== 'function' || typeof RespType !== 'function') {
      alert('MsgType or RespType are not defined for gRPC request!')
      return
    }

    let payload: Uint8Array
    const msgClassName = (MsgType as any).name || ''

    if (
      MsgType &&
      (msgClassName === 'UpdatePlayerRequest' || /UpdatePlayer/i.test(url))
    ) {
      payload = encodeUpdatePlayerRequest(body)
    } else {
      const fillMessage = (msgInstance: any, obj: Record<string, any>): void => {
        for (const k in obj) {
          if (!obj.hasOwnProperty(k)) continue

          const camelCase = 'set' + k.charAt(0).toUpperCase() + k.slice(1)
          const firstCapRestLower =
            'set' + k.charAt(0).toUpperCase() + k.slice(1).toLowerCase()
          const val = obj[k]

          let setter: string | null = null
          if (typeof msgInstance[camelCase] === 'function') {
            setter = camelCase
          } else if (typeof msgInstance[firstCapRestLower] === 'function') {
            setter = firstCapRestLower
          }

          if (setter && typeof msgInstance[setter] === 'function') {
            if (val && typeof val === 'object' && !Array.isArray(val)) {
              const getter = 'get' + k.charAt(0).toUpperCase() + k.slice(1)
              let nestedMsg = null

              try {
                if (typeof msgInstance[getter] === 'function') {
                  nestedMsg = msgInstance[getter]()
                }
              } catch (e) {
                // Getter didn't work
              }

              if (nestedMsg) {
                fillMessage(nestedMsg, val)
                msgInstance[setter](nestedMsg)
              }
            } else {
              msgInstance[setter](val)
            }
          } else {
            console.warn(`Field ${k} not found on message`)
          }
        }
      }

      const msg = new (MsgType as any)()
      fillMessage(msg, body)
      payload = msg.serializeBinary()
    }

    const lenBuf = new Uint8Array(4)
    new DataView(lenBuf.buffer).setUint32(0, payload.length)

    const framedBody = new Uint8Array(1 + 4 + payload.length)
    framedBody[0] = 0
    framedBody.set(lenBuf, 1)
    framedBody.set(payload, 5)
    requestBody = framedBody

    headers = {
      ...headers,
      'User-Agent':
        'grpc-dotnet/2.63.0 (Mono Unity; CLR 4.0.30319.17020; netstandard2.0; arm64) com.kiloo.subwaysurf/3.47.0',
      TE: 'trailers',
      'grpc-accept-encoding': 'identity,gzip',
      'Content-Type': 'application/grpc-web'
    }
  }

  try {
    const corsProxy =
      stateManager.getCorsProxy() ||
      'https://noisy-disk-638c.herrerde.workers.dev/?url='

    const res = await fetch(corsProxy + url, {
      method: 'POST',
      headers,
      body: requestBody
    })

    if (isJson) {
      const text = await res.text()
      let parsed: any
      try {
        parsed = JSON.parse(text)
      } catch (e) {
        throw new Error('Invalid JSON response: ' + text)
      }
      if (output) {
        output.style.display = 'block'
        output.value = JSON.stringify(parsed, null, 2)
      }
      notifyMobileResponseReady()
      return
    }

    const grpcStatus = res.headers.get('grpc-status')
    if (grpcStatus && grpcStatus !== '0') {
      const details = res.headers.get('grpc-status-details-bin')
      if (output) {
        output.style.display = 'block'
        output.value = 'gRPC Error ' + grpcStatus + ':\n' + decodeGrpcStatus(details)
      }
      notifyMobileResponseReady()
      return
    }

    const raw = new Uint8Array(await res.arrayBuffer())
    if (raw.length < 5) throw new Error('Response too short')

    const msgLen = new DataView(raw.buffer, 1, 4).getUint32(0)
    const grpcPayload = raw.slice(5, 5 + msgLen)

    let resp: Message
    try {
      resp = (RespType as any).deserializeBinary(grpcPayload)
    } catch (deserializeErr) {
      if (
        deserializeErr instanceof Error &&
        deserializeErr.message.includes('proto.google')
      ) {
        console.warn(
          'proto.google not initialized, attempting raw response parsing'
        )
        throw new Error(
          'Response deserialization failed: proto.google is undefined. This is a library initialization issue.'
        )
      }
      throw deserializeErr
    }

    if (output) {
      output.style.display = 'block'
      output.value = JSON.stringify(resp.toObject(), null, 2)
    }
    notifyMobileResponseReady()
  } catch (err) {
    console.error('Request failed:', err)
    const errMsg = err instanceof Error ? err.message : String(err)
    if (output) {
      output.style.display = 'block'
      output.value = 'Error: ' + errMsg
    }
    notifyMobileResponseReady()
  }
}
