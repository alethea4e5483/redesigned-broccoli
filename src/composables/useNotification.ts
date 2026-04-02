import { Notification } from '@/ts/lib/Notification'
import type { NotifyOptions } from '@/ts/lib/Notification'

export function useNotification() {
  function showSuccess(title: string, text: string = '') {
    return new Notification({
      title,
      text,
      status: 'success',
      autoclose: true
    })
  }

  function showError(title: string, text: string = '') {
    return new Notification({
      title,
      text,
      status: 'error',
      autoclose: true
    })
  }

  function showInfo(title: string, text: string = '') {
    return new Notification({
      title,
      text,
      status: 'info',
      autoclose: true
    })
  }

  function show(options: NotifyOptions) {
    return new Notification(options)
  }

  return { showSuccess, showError, showInfo, show }
}
