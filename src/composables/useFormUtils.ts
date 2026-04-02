import { buildFormHtml, validateForm, buildRequestBody } from '@/ts/modules/formUtils'
import { createMetadataDropdown, renderMetadataInputs } from '@/ts/modules/metadata'
import { autofillFormFromUserData } from '@/ts/modules/autofill'
import type { Endpoint } from '@/ts/types/endpoint'

export function useFormUtils() {
  return {
    buildFormHtml,
    validateForm,
    buildRequestBody,
    createMetadataDropdown,
    renderMetadataInputs,
    autofillFormFromUserData
  }
}
