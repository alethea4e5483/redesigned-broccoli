export function setupMobileSidebar(): void {
  const button = document.getElementById('mobileSidebarToggle')
  const sidebar = document.getElementById('mobileSidebar')
  const overlay = document.getElementById('overlay')

  if (!button || !sidebar || !overlay) return

  button.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full')
    overlay.classList.toggle('hidden')
  })

  overlay.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full')
    overlay.classList.add('hidden')
  })

  // Close sidebar when clicking on a link
  const links = sidebar.querySelectorAll('.sidebar-link')
  links.forEach((link) => {
    link.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full')
      overlay.classList.add('hidden')
    })
  })
}
