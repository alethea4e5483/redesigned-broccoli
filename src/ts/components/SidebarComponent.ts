import { Component } from './Component'

/**
 * Sidebar component for displaying endpoints
 */
export class SidebarComponent extends Component {
  render(): HTMLElement {
    const container = this.createElement('div', {
      classes: [
        'sidebar',
        'hidden',
        'lg:flex',
        'w-[16.7vw]',
        'bg-[#09090b]',
        'h-screen',
        'flex-col',
        'items-center',
        'overflow-y-auto',
        'custom-scrollbar'
      ]
    })

    const title = this.createElement('div', {
      classes: ['text-left', 'font-poppins', 'text-lg', 'mb-2', 'text-[#ffcc99]'],
      text: 'Endpoints'
    })

    const tokenExpire = this.createElement('p', {
      id: 'token-expire',
      classes: ['font-poppins', 'mb-2', 'text-center']
    })

    const uploadContainer = this.createElement('div', {
      classes: ['flex', 'items-center', 'gap-2', 'mb-2']
    })

    const uploadBtn = this.createElement('button', {
      id: 'identity-upload-btn',
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

    const fileInput = this.createElement('input', {
      id: 'identity-file',
      attrs: {
        type: 'file',
        accept: '*'
      }
    })
    fileInput.style.display = 'none'

    const tokenStatus = this.createElement('span', {
      id: 'token-status',
      classes: ['ml-2', 'text-xs']
    })

    uploadContainer.appendChild(uploadBtn)
    uploadContainer.appendChild(fileInput)
    uploadContainer.appendChild(tokenStatus)

    const searchContainer = this.createElement('div', {
      classes: ['mt-6']
    })

    const searchInputWrapper = this.createElement('div', {
      classes: ['px-4', 'mb-4', 'w-full']
    })

    const searchInput = this.createElement('input', {
      id: 'endpointSearchDesktop',
      classes: ['endpointSearch', 'px-3', 'py-2.5'],
      attrs: {
        type: 'text',
        placeholder: 'Search endpoints...',
        autocomplete: 'off'
      }
    })

    searchInputWrapper.appendChild(searchInput)

    const endpointList = this.createElement('div', {
      id: 'endpointList',
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

    searchContainer.appendChild(searchInputWrapper)
    searchContainer.appendChild(endpointList)

    container.appendChild(title)
    container.appendChild(tokenExpire)
    container.appendChild(uploadContainer)
    container.appendChild(searchContainer)

    return container
  }
}
