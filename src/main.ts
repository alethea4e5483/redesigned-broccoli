/**
 * Main entry point for the Subway Surfers API Web interface
 * Vue 3 + Pinia + Vue Router
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import '@/ts/lib/NotifyPolyfill'
import './styles/main.css'

// Import root component
import App from '@/App.vue'

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount to #app element
app.mount('#app')
