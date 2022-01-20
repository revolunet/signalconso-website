import {useI18n} from '../../../core/i18n'
import {FormLayout} from '../../../shared/FormLayout/FormLayout'
import {useForm} from 'react-hook-form'
import {ScInput} from '../../../shared/Input/ScInput'
import {Panel, PanelActions, PanelBody} from '../../../shared/Panel/Panel'
import {useApiSdk} from '../../../core/context/ApiSdk'
import {useToast} from '../../../core/toast'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {ScButton} from '../../../shared/Button/Button'
import {CompanySearchResult} from '../../../../../signalconso-api-sdk-js'
import {Txt} from 'mui-extension'

interface Form {
  name: string
  country: string
  postalCode: string
}

interface Props {
  onChange: (form?: Form) => void
}

export const CompanyAskForeignDetails = ({onChange}: Props) => {
  const {m} = useI18n()
  const {
    handleSubmit,
    register,
  } = useForm<Form>()

  return (
    <Panel title={m.couldYouPrecise}>
      <form onSubmit={handleSubmit(onChange)}>
        <PanelBody>
          <FormLayout required label={m.reportedCompanyName}>
            <ScInput placeholder={m.reportedCompanyNamePlaceholder} fullWidth {...register('name', {
              required: {value: true, message: m.required},
            })}/>
          </FormLayout>
          <FormLayout required label={m.country}>
            <ScInput placeholder={m.countryPlaceholder} fullWidth {...register('country', {
              required: {value: true, message: m.required},
            })}/>
          </FormLayout>
          <FormLayout required label={m.yourPostalCode} desc={m.yourPostalCodeDesc}>
            <ScInput placeholder={m.yourPostalCodePlaceholder} fullWidth {...register('postalCode', {
              required: {value: true, message: m.required},
            })}/>
          </FormLayout>
        </PanelBody>

        <PanelActions>
          <ScButton color="primary" variant="contained" icon="search" type="submit">
            {m.search}
          </ScButton>
        </PanelActions>
      </form>
    </Panel>
  )
}
