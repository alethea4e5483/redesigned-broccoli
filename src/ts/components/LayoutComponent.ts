import { Component } from './Component'

/**
 * Main layout component - the root container for the entire app
 */
export class LayoutComponent extends Component {
  render(): HTMLElement {
    const container = this.createElement('div', {
      classes: ['block', 'lg:flex', 'w-full']
    })

    // Add main content area
    const main = this.createElement('main', {
      classes: [
        'flex-1',
        'grid',
        'grid-cols-1',
        'py-4',
        'gap-4',
        'px-4',
        'lg:grid-cols-2',
        'lg:py-10',
        'lg:gap-6',
        'lg:px-8',
        'h-full',
        'roundborder',
        'border-l',
        'border-[#1a1a1a]'
      ]
    })

    // Mobile view tabs
    const mobileTabs = this.createElement('div', {
      id: 'mobile-view-tabs',
      classes: ['hidden', 'lg:hidden', 'sticky', 'top-0', 'z-20', 'bg-[#09090b]', 'py-2']
    })

    const tabsGrid = this.createElement('div', {
      classes: [
        'grid',
        'grid-cols-2',
        'gap-2',
        'rounded-xl',
        'border',
        'border-[#222]',
        'bg-[#101014]',
        'p-1'
      ]
    })

    const requestTab = this.createElement('button', {
      id: 'mobile-tab-request',
      classes: [
        'rounded-lg',
        'bg-[#ffcc99]',
        'px-3',
        'py-2',
        'text-sm',
        'font-semibold',
        'text-black',
        'transition-colors'
      ],
      text: 'Request'
    })
    ;(requestTab as HTMLButtonElement).type = 'button'

    const responseTab = this.createElement('button', {
      id: 'mobile-tab-response',
      classes: [
        'relative',
        'rounded-lg',
        'px-3',
        'py-2',
        'text-sm',
        'font-semibold',
        'text-gray-300',
        'transition-colors'
      ],
      text: 'Response'
    })
    ;(responseTab as HTMLButtonElement).type = 'button'

    const responseBadge = this.createElement('span', {
      id: 'mobile-response-badge',
      classes: [
        'absolute',
        'right-2',
        'top-1',
        'hidden',
        'h-2.5',
        'w-2.5',
        'rounded-full',
        'bg-emerald-400',
        'shadow-[0_0_10px_rgba(52,211,153,0.9)]'
      ]
    })

    responseTab.appendChild(responseBadge)
    tabsGrid.appendChild(requestTab)
    tabsGrid.appendChild(responseTab)
    mobileTabs.appendChild(tabsGrid)

    // Request panel
    const requestPanel = this.createElement('div', {
      id: 'request-panel',
      classes: [
        'hidden',
        'lg:block',
        'bg-[#0f0f11]',
        'p-6',
        'rounded-xl',
        'border',
        'border-[#1a1a1a]',
        'bg-[#09090b]',
        'h-[calc(100dvh-11rem)]',
        'lg:h-screen',
        'overflow-y-auto',
        'custom-scrollbar'
      ]
    })

    const requestTitle = this.createElement('h2', {
      id: 'endpointTitle',
      classes: ['text-[#ffcc99]', 'font-poppins', 'text-2xl', 'font-semibold', 'mb-2'],
      text: 'Select an Endpoint'
    })

    const requestPath = this.createElement('p', {
      id: 'endpointPath',
      classes: ['font-poppins', 'text-gray-400', 'mb-4'],
      text: 'Choose an endpoint from the sidebar to test.'
    })

    const requestDesc = this.createElement('p', {
      id: 'endpointDesc',
      classes: ['font-poppins', 'text-gray-400', 'mb-2']
    })

    const endpointForm = this.createElement('div', {
      id: 'endpointForm'
    })

    requestPanel.appendChild(requestTitle)
    requestPanel.appendChild(requestPath)
    requestPanel.appendChild(requestDesc)
    requestPanel.appendChild(endpointForm)

    // Response panel
    const responsePanel = this.createElement('div', {
      id: 'response-panel',
      classes: [
        'hidden',
        'lg:flex',
        'bg-[#0f0f11]',
        'p-6',
        'rounded-xl',
        'border',
        'border-[#1a1a1a]',
        'flex-col',
        'h-[calc(100dvh-11rem)]',
        'lg:h-auto'
      ]
    })

    const responseTitle = this.createElement('h3', {
      classes: ['text-[#ffcc99]', 'text-xl', 'font-poppins', 'font-semibold', 'mb-3'],
      text: 'Result'
    })

    const responseResult = this.createElement('div', {
      id: 'responseResult',
      classes: [
        'bg-[#121212]',
        'border',
        'border-[#333]',
        'rounded-lg',
        'p-4',
        'font-mono',
        'text-left',
        'text-sm',
        'text-gray-200',
        'overflow-y-auto',
        'flex-1',
        'custom-scrollbar'
      ],
      html: '<span class="text-left">Nothing returned yet.</span>'
    })
    responseResult.style.maxHeight = '80vh'
    responseResult.style.minHeight = '120px'

    responsePanel.appendChild(responseTitle)
    responsePanel.appendChild(responseResult)

    main.appendChild(mobileTabs)
    main.appendChild(requestPanel)
    main.appendChild(responsePanel)

    container.appendChild(main)

    return container
  }
}
