import { AppState } from '@types/endpoint'

class StateManager {
  private state: AppState = {
    identityToken: null,
    limitsDisabled: localStorage.getItem("limitsDisabled") === "true",
    corsProxy: localStorage.getItem("corsProxy") || "https://noisy-disk-638c.herrerde.workers.dev/?url="
  }

  getState(): AppState {
    return { ...this.state }
  }

  getIdentityToken(): string | null {
    return this.state.identityToken
  }

  setIdentityToken(token: string | null): void {
    this.state.identityToken = token
  }

  getLimitsDisabled(): boolean {
    return this.state.limitsDisabled
  }

  setLimitsDisabled(val: boolean): void {
    this.state.limitsDisabled = val
    localStorage.setItem("limitsDisabled", String(val))
  }

  getCorsProxy(): string {
    return this.state.corsProxy
  }

  setCorsProxy(url: string): void {
    this.state.corsProxy = url
    localStorage.setItem("corsProxy", url)
  }
}

export const stateManager = new StateManager()
