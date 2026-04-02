export async function autofillFormFromUserData(
  userData: Record<string, any> = {},
  delay: number = 50
): Promise<void> {
  // Fill basic fields
  if (userData.name) {
    const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]')
    if (nameInput) nameInput.value = userData.name
  }

  if (userData.level !== undefined) {
    const levelInput = document.querySelector<HTMLInputElement>('input[name="level"]')
    if (levelInput) levelInput.value = String(userData.level)
  }

  if (userData.highscore !== undefined) {
    const highscoreInput = document.querySelector<HTMLInputElement>('input[name="highscore"]')
    if (highscoreInput) highscoreInput.value = String(userData.highscore)
  }

  // Fill metadata map entries sequentially
  if (Array.isArray(userData.metadataMap)) {
    const maxAutofillEntries = 20
    let i = 0

    const addNextKey = (): void => {
      if (i >= userData.metadataMap!.length || i >= maxAutofillEntries) return

      const [key, value] = userData.metadataMap![i]
      const addBtn = document.querySelector<HTMLButtonElement>(
        '#metadata-dropdown-row .metadata-add-btn'
      )
      const select = document.querySelector<HTMLSelectElement>('#metadata-dropdown-row select')

      if (select && addBtn) {
        select.value = key
        addBtn.click()

        setTimeout(() => {
          const metaInput = document.querySelector<HTMLInputElement>(`[name="metadata_${key}"]`)
          if (metaInput) metaInput.value = value
          i++
          addNextKey()
        }, delay)
      } else {
        setTimeout(addNextKey, delay)
      }
    }

    addNextKey()
  }
}
