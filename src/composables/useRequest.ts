import { sendRequest as sendRequestModule } from '@/ts/modules/request'

interface MessageStatic {
  new(): any
  deserializeBinary(bytes: Uint8Array): any
  name?: string
}

export function useRequest() {
  async function sendRequest(
    url: string,
    token: string | null,
    MsgType?: MessageStatic,
    RespType?: MessageStatic,
    body: Record<string, any> = {},
    opts: { json?: boolean } = {}
  ): Promise<void> {
    return sendRequestModule(url, token, MsgType, RespType, body, opts)
  }

  return { sendRequest }
}
