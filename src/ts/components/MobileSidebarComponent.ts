import { Component } from './Component'

/**
 * Mobile sidebar component - appears on smaller screens
 */
export class MobileSidebarComponent extends Component {
  render(): HTMLElement {
    const headerContainer = this.createElement('div', {
      classes: ['lg:hidden', 'flex', 'items-center', 'justify-between', 'bg-[#09090b]', 'p-4']
    })

    const logo = this.createElement('a', {
      attrs: { href: '#' },
      classes: ['cursor-pointer', 'flex', 'items-center', 'gap-2']
    })

    const logoText = this.createElement('span', {
      classes: ['font-bold', 'text-white', 'text-xl'],
      text: 'Subway Surfers API'
    })

    logo.appendChild(logoText)

    const toggleBtn = this.createElement('button', {
      id: 'mobileSidebarToggle',
      classes: ['text-white', 'text-2xl'],
      attrs: {
        role: 'button',
        'aria-label': 'Toggle sidebar'
      }
    })

    const icon = this.createElement('i', {
      classes: ['fas', 'fa-bars']
    })

    toggleBtn.appendChild(icon)

    headerContainer.appendChild(logo)
    headerContainer.appendChild(toggleBtn)

    const sidebar = this.createElement('div', {
      id: 'mobileSidebar',
      classes: [
        'fixed',
        'top-0',
        'left-0',
        'h-full',
        'w-64',
        'bg-[#09090b]',
        'z-50',
        'transform',
        '-translate-x-full',
        'transition-transform',
        'duration-200',
        'ease-in-out',
        'lg:hidden',
        'flex',
        'flex-col',
        'shadow-lg',
        'overflow-y-auto'
      ]
    })

    const sidebarTitle = this.createElement('div', {
      classes: ['text-left', 'font-poppins', 'text-lg', 'mb-5', 'text-[#ffcc99]', 'p-4'],
      text: 'Endpoints'
    })

    const tokenExpireMobile = this.createElement('p', {
      id: 'token-expire-mobile',
      classes: ['font-poppins', 'mb-2', 'text-center']
    })

    const uploadContainerMobile = this.createElement('div', {
      classes: ['flex', 'items-center', 'gap-2', 'mb-2', 'p-4']
    })

    const uploadBtnMobile = this.createElement('button', {
      id: 'identity-upload-btn-mobile',
      classes: [
        'cursor-pointer',
        'hover:bg-[#7760fe]',
        'hover:text-white',
        'duration-100',
        'p-2',
        'px-6',
        'rounded-[7px]',
        'bg-white',
        'text-black',
        'font-semibold',
        'text-sm'
      ],
      text: 'Upload Identity'
    })

    const fileInputMobile = this.createElement('input', {
      id: 'identity-file-mobile',
      attrs: {
        type: 'file',
        accept: '*'
      }
    })
    fileInputMobile.style.display = 'none'

    const tokenStatusMobile = this.createElement('span', {
      id: 'token-status-mobile',
      classes: ['ml-2', 'text-xs']
    })

    uploadContainerMobile.appendChild(uploadBtnMobile)
    uploadContainerMobile.appendChild(fileInputMobile)
    uploadContainerMobile.appendChild(tokenStatusMobile)

    const searchWrapper = this.createElement('div')

    const searchInputWrapper = this.createElement('div', {
      classes: ['px-4', 'mb-4', 'w-full']
    })

    const searchInput = this.createElement('input', {
      id: 'endpointSearch',
      classes: ['endpointSearch', 'px-3', 'py-2.5'],
      attrs: {
        type: 'text',
        placeholder: 'Search endpoints...',
        autocomplete: 'off'
      }
    })

    searchInputWrapper.appendChild(searchInput)

    const mobileEndpointList = this.createElement('div', {
      id: 'mobileEndpointList',
      classes: [
        'sidebar-links',
        'mb-5',
        'w-full',
        'flex',
        'justify-center',
        'flex-col',
        'items-center',
        'gap-3'
      ]
    })

    searchWrapper.appendChild(searchInputWrapper)
    searchWrapper.appendChild(mobileEndpointList)

    sidebar.appendChild(sidebarTitle)
    sidebar.appendChild(tokenExpireMobile)
    sidebar.appendChild(uploadContainerMobile)
    sidebar.appendChild(searchWrapper)

    const overlay = this.createElement('div', {
      id: 'overlay',
      classes: [
        'fixed',
        'inset-0',
        'bg-black',
        'bg-opacity-40',
        'hidden',
        'z-40',
        'lg:hidden',
        'overflow-y-auto'
      ]
    })
    overlay.style.touchAction = 'pan-y'

    const container = this.createElement('div')
    container.appendChild(headerContainer)
    container.appendChild(sidebar)
    container.appendChild(overlay)

    return container
  }
}
