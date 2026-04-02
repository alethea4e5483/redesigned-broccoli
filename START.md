# SubwaySurfers API Web - Vue Migration Guide

## Overview

This project has been migrated from a vanilla TypeScript + Vite application to **Vue 3 with Composition API**. The migration preserves all functionality while modernizing the codebase structure, improving developer experience, and enabling better code organization.

### What This Project Does

A web interface for testing SubwaySurfers API endpoints. Users can:
- Select endpoints from a sidebar
- Fill out dynamic forms based on endpoint parameters
- Upload identity tokens for authentication
- Send requests (JSON or gRPC-web)
- View formatted responses
- Configure CORS proxy and other settings
- Works on desktop and mobile with responsive layout

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **UI Framework** | Vue 3 | Reactive component-based UI |
| **API Style** | Composition API | Modern, flexible component logic |
| **State Management** | Pinia | Global reactive store |
| **Routing** | Vue Router | URL routing (single route initially) |
| **Styling** | TailwindCSS | Utility-first CSS framework |
| **Build Tool** | Vite 5 | Ultra-fast build/dev server |
| **Language** | TypeScript | Type-safe development |
| **Protocol** | gRPC-web + JSON | Request protocol support |

---

## Project Structure

```
src/
├── main.ts                          # Vue app entry point
├── index.html                       # HTML template
├── router/
│   └── index.ts                     # Vue Router configuration
├── stores/
│   └── app.ts                       # Pinia store (global state)
├── components/                      # Vue SFC (.vue files)
│   ├── App.vue                      # Root component
│   ├── Header.vue                   # Top header + mobile hamburger
│   ├── Sidebar.vue                  # Desktop endpoint list
│   ├── MobileSidebar.vue            # Mobile drawer overlay
│   ├── MainContent.vue              # Main content wrapper
│   ├── Search.vue                   # Endpoint search/filter
│   ├── Form.vue                     # Dynamic form for endpoint params
│   ├── Panels.vue                   # Request/Response display
│   ├── Tabs.vue                     # Mobile tab switcher
│   └── InfoModal.vue                # Info dialog + settings
├── composables/                     # Reusable logic (Vue hooks)
│   ├── useNotification.ts           # Notification system wrapper
│   ├── useRequest.ts                # API request handler
│   └── useFormUtils.ts              # Form building utilities
├── ts/                              # TypeScript utilities (non-Vue)
│   ├── modules/                     # Business logic modules
│   │   ├── format.ts                # Endpoint definitions
│   │   ├── request.ts               # HTTP/gRPC request handler
│   │   ├── proto.ts                 # Protocol buffer handling
│   │   ├── formUtils.ts             # Form HTML generation
│   │   ├── metadata.ts              # Metadata field management
│   │   └── autofill.ts              # Auto-fill functionality
│   ├── types/
│   │   ├── endpoint.ts              # TypeScript interfaces
│   │   └── proto.ts                 # Protocol buffer types
│   ├── lib/
│   │   ├── Notification.ts          # Custom notification class
│   │   └── NotifyPolyfill.ts        # Polyfill setup
│   └── utils.ts                     # DOM and utility helpers
├── styles/
│   └── main.css                     # TailwindCSS + custom styles
└── assets/
    └── fonts/                       # FontAwesome + custom fonts

dist/                                # Production build output (git-ignored)
```

---

## Architecture Patterns

### 1. **Component Hierarchy**

```
App (root)
├── Header (hamburger + title)
├── Sidebar (desktop, vertical list)
├── MobileSidebar (overlay drawer)
├── MainContent
│   ├── Search (endpoint filter)
│   ├── Form (dynamic request form)
│   ├── Panels (request/response display)
│   └── Tabs (mobile tab switcher)
└── InfoModal (settings + info dialog)
```

### 2. **State Management with Pinia**

The app store maintains:
```typescript
// src/stores/app.ts
{
  identityToken: string | null     // JWT for authentication
  limitsDisabled: boolean           // Disable rate limit header
  corsProxy: string               // CORS proxy URL
}
```

All state persists to localStorage automatically.

### 3. **Composition API Pattern**

Components use Composition API for clarity:
```typescript
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useAppStore } from '@/stores/app'

  const store = useAppStore()
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }
</script>
```

### 4. **Composables for Reusable Logic**

Composables wrap existing utilities:
```typescript
// src/composables/useNotification.ts
import { Notification } from '@/ts/lib/Notification'

export function useNotification() {
  function showSuccess(title: string, text: string) {
    return new Notification({ title, text, status: 'success' })
  }
  return { showSuccess, /* ... */ }
}

// Usage in component:
const { showSuccess } = useNotification()
showSuccess('Done!', 'Request sent successfully')
```

---

## Key Files Guide

### Components You'll Edit

| File | Purpose | Key Features |
|------|---------|--------------|
| `Form.vue` | Dynamic form rendering | Identity upload, metadata dropdowns, form validation |
| `Panels.vue` | Request/Response display | Shows formatted JSON responses, request history |
| `Sidebar.vue` | Endpoint list (desktop) | Selects endpoint, updates form reactively |
| `Search.vue` | Filter endpoints | Real-time search across endpoint list |

### Core Logic (Usually Don't Edit)

| File | Purpose | Exports |
|------|---------|---------|
| `src/ts/modules/request.ts` | Sends HTTP/gRPC requests | `sendRequest(endpoint, data)` |
| `src/ts/modules/format.ts` | Endpoint definitions | `endpointsList: Endpoint[]` |
| `src/ts/modules/proto.ts` | Protocol buffer handling | Proto serialization/deserialization |
| `src/stores/app.ts` | Global state | `useAppStore()` |

### Configuration

| File | Purpose | Key Settings |
|------|---------|--------------|
| `vite.config.ts` | Build configuration | Port 5173, Vue plugin, path aliases |
| `tailwind.config.js` | Tailwind theming | Dark theme colors (#09090b, #ffcc99) |
| `tsconfig.json` | TypeScript settings | ES2020 target, strict mode |

---

## Getting Started

### Installation

```bash
# Install dependencies (Vue, Pinia, Vue Router, etc.)
npm install
```

### Development

```bash
# Start dev server with HMR (Hot Module Replacement)
npm run dev

# Opens at http://localhost:5173
# Auto-reloads when you edit .vue files
```

### Production Build

```bash
# Create optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Output: dist/ directory (ready to deploy)
```

---

## Common Tasks

### Adding a New Endpoint

1. Edit `src/ts/modules/format.ts`
2. Add to `endpointsList` array:
```typescript
{
  name: 'MyEndpoint',
  endpoint: '/api/my-endpoint',
  type: 'json', // or 'rpc' for gRPC
  params: {
    username: { type: 'string', required: true },
    age: { type: 'int', example: 25 }
  }
}
```
3. Form automatically renders fields for new endpoint

### Adding Form Validation

Edit `Form.vue`:
```typescript
// In validate() method
if (!formData.username?.trim()) {
  showError('Validation', 'Username required')
  return false
}
```

### Styling Changes

Options:
1. **TailwindCSS classes** - in template: `<div class="bg-gray-900 text-white">`
2. **Scoped CSS** - in `<style scoped>` block
3. **Global styles** - edit `src/styles/main.css`

Theme colors:
- Dark background: `#09090b`
- Accent: `#ffcc99`
- Use Tailwind: `bg-slate-950`, `text-amber-200`

### Using Notifications

```typescript
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError, showInfo } = useNotification()

// Show notifications
showSuccess('Title', 'Success message')
showError('Error', 'Something went wrong')
showInfo('Info', 'Just so you know...')
```

### Accessing Global State

```typescript
import { useAppStore } from '@/stores/app'

const store = useAppStore()

// Read state
if (store.hasIdentityToken) {
  console.log('Token:', store.identityToken)
}

// Update state (automatically saves to localStorage)
store.setIdentityToken('new-token-here')
store.setCorsProxy('http://proxy:3000')
store.setLimitsDisabled(true)
```

### Sending API Requests

```typescript
import { useRequest } from '@/composables/useRequest'
import { endpointsList } from '@/ts/modules/format'

const { sendRequest } = useRequest()

async function handleFormSubmit(formData: FormData) {
  try {
    const endpoint = endpointsList.find(e => e.name === 'UpdatePlayer')
    const response = await sendRequest(endpoint, formData)
    showSuccess('Done', 'Request successful')
    displayResponse(response)
  } catch (error) {
    showError('Error', error.message)
  }
}
```

---

## Development Workflow

### Creating a New Component

1. Create `src/components/MyComponent.vue`:
```vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <button @click="count++">{{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('My Component')
const count = ref(0)
</script>

<style scoped>
.my-component {
  padding: 1rem;
  border: 1px solid #ccc;
}
</style>
```

2. Import in parent component:
```typescript
import MyComponent from '@/components/MyComponent.vue'
```

3. Use in template:
```html
<MyComponent />
```

### Debugging

```typescript
// Console logging in components (works in dev)
console.log('State:', store.identityToken)
console.log('Props:', props)

// Vue DevTools extension (install from browser store)
// Inspect component tree, state changes, emits
```

### Hot Module Replacement (HMR)

When you save a `.vue` file:
- Component updates instantly in browser
- No page reload needed
- Component state preserved (in most cases)
- Errors shown in browser console

---

## Migration Notes

### What Changed from Vanilla TS

| Old (Vanilla TS) | New (Vue) |
|------------------|-----------|
| `BaseComponent` classes | Vue Single-File Components |
| `ComponentManager` | Vue's component system |
| `StateManager` singleton | Pinia store with `useAppStore()` |
| Manual DOM manipulation | Vue templates with reactivity |
| `getElementById()` chains | ref() and reactive() |
| Event listener setup | `@click`, `@input` directives |
| HTML string generation | Vue template syntax |
| Manual visibility toggle | `v-if`, `v-show` |
| Callback functions | Vue emits and props |

### Reused Code

The following modules work exactly as before (Vue-agnostic):
- `src/ts/modules/request.ts` - HTTP/gRPC logic
- `src/ts/modules/format.ts` - Endpoint definitions
- `src/ts/modules/proto.ts` - Protocol buffer handling
- `src/ts/types/endpoint.ts` - Type definitions
- `src/ts/lib/Notification.ts` - Notification class

### Breaking Changes

None for end users - all functionality preserved. Internal only:
- Old `src/ts/components/` directory replaced with Vue components
- Component instantiation style changed

---

## Troubleshooting

### "Module not found" errors
- Check import paths use aliases: `@/components/...` not `../components/...`
- Verify file extensions: `.vue` for components, `.ts` for scripts

### HMR not working
- Ensure Vite dev server running on `:5173`
- Check browser console for WebSocket errors
- Try: Hard refresh (Ctrl+Shift+R) or restart dev server

### localStorage data not persisting
- Check browser privacy settings aren't blocking storage
- Verify Pinia store calls action (e.g., `store.setIdentityToken(value)`)
- Check browser DevTools → Application → Local Storage

### Form not updating after endpoint selection
- Ensure Form component watchers are set up
- Check endpoint data properly passed via props
- Verify v-model bindings on form inputs

### API requests failing
- Check CORS proxy setting in Settings (bottom-right info icon)
- Verify endpoint URL is correct in `format.ts`
- Check network tab in browser DevTools for actual request

---

## Performance Tips

1. **Lazy load components** - code split heavy dialogs:
```typescript
const InfoModal = defineAsyncComponent(() => import('@/components/InfoModal.vue'))
```

2. **Use computed** - avoid recalculating in template:
```typescript
const filteredEndpoints = computed(() =>
  endpointsList.filter(e => e.name.includes(searchTerm.value))
)
```

3. **Minimize watchers** - use computed when possible:
```typescript
// ✅ Better
const doubled = computed(() => count.value * 2)

// ❌ Avoid
watch(count, (newCount) => doubled.value = newCount * 2)
```

---

## Resources

### Documentation
- [Vue 3 Guide](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

### IDE Setup (VS Code)
```json
// .vscode/extensions.json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin"
  ]
}
```

---

## Next Steps

1. **Run the dev server**: `npm run dev`
2. **Open browser**: http://localhost:5173
3. **Try selecting an endpoint** from the sidebar
4. **Fill out the form** and click Send
5. **Check the response panel** for results
6. **Edit a .vue file** and see HMR in action

Happy coding! 🚀
