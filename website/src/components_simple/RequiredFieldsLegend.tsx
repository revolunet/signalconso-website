import {useI18n} from '@/i18n/I18n'

export function RequiredFieldsLegend() {
  const {m} = useI18n()
  return <p className="text-sm mb-2">{m.fieldsAreRequired}</p>
}
