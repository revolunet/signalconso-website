import {useToast as useMuiToast} from '../alexlibs/mui-extension/Toast/Toast'
import {useI18n} from '../i18n/I18n'
import {ApiError} from '../clients/BaseApiClient'

export const useToast = () => {
  const {toastError, ...toasts} = useMuiToast()
  const {m} = useI18n()

  const getErrorMessage = (err: Partial<ApiError>) => {
    console.error(JSON.stringify(err.details))
    if (err.details?.id && (m.apiErrorsCode as any)[err.details.id]) {
      return (m.apiErrorsCode as any)[err.details.id]
    }
    if (err.message && err.message !== '') {
      return err.message
    }
    return m.anErrorOccurred
  }

  return {
    toastError: (error: Partial<ApiError>) => toastError(getErrorMessage(error)),
    ...toasts,
  }
}
