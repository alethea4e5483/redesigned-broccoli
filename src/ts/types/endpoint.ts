export interface EndpointParam {
  name: string
  type: string
  required?: boolean
  regex?: string
  example?: string | number | null
  default?: string | number | boolean | null
  desc?: string | null
  metadata?: Record<string, EndpointParam> | null
  value?: string | number
}

export interface Endpoint {
  name: string
  endpoint: string
  type: 'rpc' | 'json'
  request?: string
  response?: string
  params: Record<string, EndpointParam | null>
  desc?: string | null
}

export interface AppState {
  identityToken: string | null
  limitsDisabled: boolean
  corsProxy: string
}

export interface FormElements {
  [key: string]: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | FormElements
}
