import { Component } from './Component'

/**
 * Info modal component showing help and settings
 */
export class InfoModalComponent extends Component {
  render(): HTMLElement {
    const infoBtnContainer = this.createElement('div', {
      id: 'info-btn-container',
      classes: []
    })
    infoBtnContainer.style.position = 'fixed'
    infoBtnContainer.style.bottom = '24px'
    infoBtnContainer.style.right = '24px'
    infoBtnContainer.style.zIndex = '50'

    const infoBtn = this.createElement('button', {
      id: 'info-btn',
      classes: [
        'btn',
        'btn-sm',
        'btn-circle',
        'bg-[#222]',
        'text-white',
        'hover:bg-[#444]'
      ],
      attrs: { title: 'Info' }
    })
    infoBtn.style.width = '44px'
    infoBtn.style.height = '44px'
    infoBtn.style.borderRadius = '50%'
    infoBtn.style.display = 'flex'
    infoBtn.style.alignItems = 'center'
    infoBtn.style.justifyContent = 'center'

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 -960 960 960')
    svg.setAttribute('fill', 'currentColor')
    svg.classList.add('size-5')

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute(
      'd',
      'M480-680q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Zm-60 560v-480h120v480H420Z'
    )

    svg.appendChild(path)
    infoBtn.appendChild(svg)

    infoBtnContainer.appendChild(infoBtn)

    // Info modal
    const modal = this.createElement('div', {
      id: 'info-modal',
      classes: [
        'fixed',
        'inset-0',
        'z-[70]',
        'hidden',
        'flex',
        'items-start',
        'justify-center',
        'overflow-y-auto',
        'bg-black',
        'bg-opacity-60',
        'p-3',
        'sm:items-center',
        'sm:p-6'
      ]
    })

    const modalBox = this.createElement('div', {
      classes: [
        'modal-box',
        'relative',
        'w-full',
        'max-w-3xl',
        'overflow-y-auto',
        'rounded-xl',
        'bg-[#18181b]',
        'p-6',
        'text-white',
        'sm:p-9'
      ]
    })
    modalBox.style.maxHeight = 'calc(100dvh - 1.5rem)'
    ;(modalBox as any)['sm:max-h-[90vh]'] = true

    const closeBtn = this.createElement('button', {
      id: 'info-modal-close',
      classes: [
        'rounded-full',
        'p-2',
        'inline-flex',
        'items-center',
        'justify-center',
        'text-gray-400',
        'bg-transparent',
        'hover:text-white',
        'hover:bg-gray-700',
        'transition-colors',
        'duration-200',
        'btn',
        'btn-circle',
        'btn-ghost',
        'absolute',
        'right-2',
        'top-2',
        'text-xl'
      ],
      attrs: { type: 'button' }
    })

    const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    closeSvg.classList.add('h-6', 'w-6')
    closeSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    closeSvg.setAttribute('fill', 'none')
    closeSvg.setAttribute('viewBox', '0 0 24 24')
    closeSvg.setAttribute('stroke', 'currentColor')
    closeSvg.setAttribute('stroke-width', '2')
    closeSvg.setAttribute('aria-hidden', 'true')

    const closePath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    closePath1.setAttribute('stroke-linecap', 'round')
    closePath1.setAttribute('stroke-linejoin', 'round')
    closePath1.setAttribute('d', 'M6 18L18 6M6 6l12 12')

    closeSvg.appendChild(closePath1)
    closeBtn.appendChild(closeSvg)

    const modalContent = this.createElement('div', {
      id: 'info-modal-content'
    })

    const contentWrapper = this.createElement('div', {
      classes: ['flex', 'h-full', 'flex-col', 'gap-5']
    })

    // Section 1: Disclaimer
    const disclaimerSection = this.createElement('section', {
      classes: ['mb-2', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-2']
    })

    const disclaimerText = this.createElement('div', {
      classes: ['w-full', 'text-center', 'text-sm'],
      html: `You are using an unofficial tool. <br />This is not affiliated with or endorsed by the original game developers.`
    })

    disclaimerSection.appendChild(disclaimerText)

    // Section 2: Identity file instructions
    const identitySection = this.createElement('section')

    const identityTitle = this.createElement('h3', {
      classes: ['text-lg', 'font-semibold'],
      text: 'Identity file'
    })

    const identityP1 = this.createElement('p', {
      classes: ['text-sm'],
      html: `In your file Explorer, go into the folder
        <code class="bg-gray-800 text-green-400 px-1 rounded">Android/data/com.kiloo.subwaysurf/</code>
        which is your game directory.`
    })

    const identityP2 = this.createElement('p', {
      classes: ['text-sm'],
      html: `From there you find the folder
        <code class="bg-gray-800 text-green-400 px-1 rounded">/auth/subway-prod/</code>
        which contains the
        <code class="bg-gray-800 text-blue-400 px-1 rounded">identity</code>
        file.`
    })

    const identityP3 = this.createElement('p', {
      classes: ['text-sm'],
      html: `Move the file to a more accessible location, such as
        <code class="bg-gray-800 text-green-400 px-1 rounded">Downloads</code>
        so you can easily access it with the file picker.`
    })

    identitySection.appendChild(identityTitle)
    identitySection.appendChild(identityP1)
    identitySection.appendChild(identityP2)
    identitySection.appendChild(identityP3)

    // Section 3: Docs
    const docsSection = this.createElement('section')

    const docsTitle = this.createElement('h3', {
      classes: ['text-lg', 'font-semibold'],
      text: 'Docs'
    })

    const docsP = this.createElement('p', {
      classes: ['text-sm'],
      html: `If you want to have a bit more explainations about what each endpoint does you can read about it here
        <a target="_blank" href="https://github.com/HerrErde/SubwaySurfers-Api">github.com/HerrErde/SubwaySurfers-Api</a>.`
    })

    docsSection.appendChild(docsTitle)
    docsSection.appendChild(docsP)

    // Section 4: Security info
    const securitySection = this.createElement('div', {
      classes: ['text-sm', 'sm:text-base']
    })

    const securityUl = this.createElement('ul', {
      classes: ['my-3', 'flex', 'flex-col', 'gap-2', 'font-medium']
    })

    const securityLi = this.createElement('li', {
      classes: ['bg-base-200', 'border-base-content/10', 'rounded-xl', 'border-2', 'p-3'],
      html: `This page runs entirely in your browser.<br />
Your <code class="bg-gray-800 text-yellow-400 px-1 rounded">identityToken</code>
is used to authenticate requests to the API and is <strong>never shared</strong> with anyone else.<br />
A hosted <code class="bg-gray-800 text-orange-400 px-1 rounded">Cloudflare Worker</code>
is used as a CORS proxy to allow making requests to the API that would otherwise be blocked by browser security policies.<br />
This is a simple CORS proxy taht forwards your requests and responses; it does <strong>not log or store your data</strong>.<br />
You can change the CORS proxy URL below if you prefer to use a different proxy service. (it has to work with POST requests)<br />`
    })

    securityUl.appendChild(securityLi)
    securitySection.appendChild(securityUl)

    // Settings details
    const settingsDetails = this.createElement('details', {
      classes: [
        'w-full',
        'max-w-lg',
        'mx-auto',
        'bg-[#1a1a1a]',
        'rounded-xl',
        'p-6',
        'text-sm',
        'text-gray-300',
        'border',
        'border-gray-600',
        'overflow-hidden',
        'transition-all',
        'duration-300'
      ]
    })

    const settingsSummary = this.createElement('summary', {
      classes: [
        'cursor-pointer',
        'select-none',
        'font-semibold',
        'text-lg',
        'text-white',
        'mb-2',
        'list-none',
        'flex',
        'justify-between',
        'items-center'
      ],
      text: 'Settings'
    })

    const settingsChevron = this.createElement('span', {
      classes: ['text-gray-400', 'transition-transform', 'duration-300', 'group-open:rotate-180']
    })

    const chevronIcon = this.createElement('i', {
      classes: ['fa-solid', 'fa-chevron-down']
    })

    settingsChevron.appendChild(chevronIcon)
    settingsSummary.appendChild(settingsChevron)

    const settingsContent = this.createElement('div', {
      classes: ['flex', 'flex-col', 'gap-4']
    })

    // Disable limits toggle
    const disableLimitsSection = this.createElement('section', {
      classes: ['w-full', 'text-center', 'text-sm']
    })

    const toggleLabel = this.createElement('label', {
      classes: ['inline-flex', 'items-center', 'cursor-pointer']
    })

    const toggleCheckbox = this.createElement('input', {
      id: 'disableLimitsToggle',
      classes: ['sr-only', 'peer'],
      attrs: { type: 'checkbox' }
    })

    const toggleDiv = this.createElement('div', {
      classes: [
        'relative',
        'w-11',
        'h-6',
        'bg-gray-200',
        'peer-focus:outline-none',
        'rounded-full',
        'peer',
        'dark:bg-gray-700',
        'peer-checked:after:translate-x-full',
        'rtl:peer-checked:after:-translate-x-full',
        'peer-checked:after:border-white',
        'after:content-[""]',
        'after:absolute',
        'after:top-[2px]',
        'after:start-[2px]',
        'after:bg-white',
        'after:border-gray-300',
        'after:border',
        'after:rounded-full',
        'after:h-5',
        'after:w-5',
        'after:transition-all',
        'dark:border-gray-600',
        'peer-checked:bg-blue-600',
        'dark:peer-checked:bg-blue-600'
      ]
    })

    const toggleSpan = this.createElement('span', {
      classes: ['ms-3', 'text-sm', 'font-medium', 'text-gray-900', 'dark:text-gray-300'],
      text: 'Disable Limits'
    })

    toggleLabel.appendChild(toggleCheckbox)
    toggleLabel.appendChild(toggleDiv)
    toggleLabel.appendChild(toggleSpan)
    disableLimitsSection.appendChild(toggleLabel)

    // CORS Proxy input
    const corsSection = this.createElement('section', {
      classes: ['w-full', 'text-center', 'text-sm']
    })

    const corsDiv = this.createElement('div', {
      classes: ['relative', 'w-full', 'max-w-md', 'mx-auto', 'text-left']
    })

    const corsLabel = this.createElement('label', {
      classes: ['block']
    })

    const corsLabelSpan = this.createElement('span', {
      classes: ['block', 'text-gray-300', 'font-semibold', 'mb-1'],
      text: 'CORS Proxy'
    })

    const corsInputDiv = this.createElement('div', {
      classes: ['relative']
    })

    const corsIcon = this.createElement('span', {
      classes: [
        'absolute',
        'top-1/2',
        'left-3',
        '-translate-y-1/2',
        'text-white',
        'z-10',
        'pointer-events-none'
      ]
    })

    const cloudIcon = this.createElement('i', {
      classes: ['fa-regular', 'fa-cloud']
    })

    corsIcon.appendChild(cloudIcon)

    const corsInput = this.createElement('input', {
      id: 'corsProxyInput',
      classes: [
        'peer',
        'h-10',
        'w-full',
        'rounded-md',
        'bg-[#121212]',
        'pl-10',
        'pr-20',
        'font-thin',
        'text-white',
        'outline-none',
        'drop-shadow-sm',
        'transition-all',
        'duration-200',
        'ease-in-out',
        'focus:bg-gray-800',
        'focus:drop-shadow-lg'
      ],
      attrs: {
        type: 'text',
        placeholder: 'https://noisy-disk-638c.herrerde.workers.dev/?url=',
        value: 'https://noisy-disk-638c.herrerde.workers.dev/?url='
      }
    })

    const corsBtn = this.createElement('button', {
      id: 'corsProxySave',
      classes: [
        'absolute',
        'top-0',
        'right-0',
        'h-full',
        'w-16',
        'rounded-r-md',
        'bg-indigo-600',
        'text-xs',
        'font-semibold',
        'text-white',
        'hover:bg-indigo-800',
        'transition-colors',
        'duration-200'
      ],
      text: 'Save'
    })

    const corsHelper = this.createElement('span', {
      classes: [
        'absolute',
        'left-0',
        'right-16',
        'mt-1',
        'text-xs',
        'font-semibold',
        'text-gray-500',
        'opacity-0',
        'peer-focus:opacity-100',
        'transition-opacity',
        'duration-200',
        'block'
      ],
      text: 'Url format: https://cors-anywhere.com/?url=REQUEST_URL'
    })

    corsInputDiv.appendChild(corsIcon)
    corsInputDiv.appendChild(corsInput)
    corsInputDiv.appendChild(corsBtn)
    corsInputDiv.appendChild(corsHelper)

    corsLabel.appendChild(corsLabelSpan)
    corsLabel.appendChild(corsInputDiv)

    corsDiv.appendChild(corsLabel)
    corsSection.appendChild(corsDiv)

    settingsContent.appendChild(disableLimitsSection)
    settingsContent.appendChild(corsSection)

    settingsDetails.appendChild(settingsSummary)
    settingsDetails.appendChild(settingsContent)

    // Footer
    const footer = this.createElement('div', {
      classes: ['grow']
    })

    const footerSection = this.createElement('section', {
      classes: ['w-full', 'text-center', 'text-sm']
    })

    const sourceLink = this.createElement('a', {
      attrs: {
        target: '_blank',
        href: 'https://github.com/HerrErde/SubwaySurfers-Api-web'
      },
      text: 'Source'
    })

    const separator1 = document.createTextNode(' · ')
    const apiLink = this.createElement('a', {
      attrs: {
        target: '_blank',
        href: 'https://github.com/HerrErde/SubwaySurfers-Api'
      },
      text: 'Api-Docs'
    })

    footerSection.appendChild(sourceLink)
    footerSection.appendChild(separator1)
    footerSection.appendChild(apiLink)

    contentWrapper.appendChild(disclaimerSection)
    contentWrapper.appendChild(identitySection)
    contentWrapper.appendChild(docsSection)
    contentWrapper.appendChild(securitySection)
    contentWrapper.appendChild(settingsDetails)
    contentWrapper.appendChild(footer)
    contentWrapper.appendChild(footerSection)

    modalContent.appendChild(contentWrapper)
    modalBox.appendChild(closeBtn)
    modalBox.appendChild(modalContent)
    modal.appendChild(modalBox)

    const container = this.createElement('div')
    container.appendChild(infoBtnContainer)
    container.appendChild(modal)

    return container
  }
}
