import {FormLayout} from '../../../shared/FormLayout/FormLayout'
import {useI18n} from '../../../core/i18n'
import {ScInput} from '../../../shared/Input/ScInput'
import {Panel, PanelActions, PanelBody} from '../../../shared/Panel/Panel'
import {useApiSdk} from '../../../core/context/ApiSdk'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {ScButton} from '../../../shared/Button/Button'
import {useForm} from 'react-hook-form'
import {CompanySearchResult} from '../../../../../signalconso-api-sdk-js'
import {useToast} from '../../../core/toast'

interface Form {
  identity: string
}

interface Props {
  onFound: (companies?: CompanySearchResult[]) => void
}

export const CompanyByIdentity = ({onFound}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useApiSdk()
  const {toastError} = useToast()
  const _searchByIdentity = useFetcher(apiSdk.company.searchCompaniesByIdentity)
  const {
    register,
    handleSubmit,
  } = useForm<Form>()

  const search = (form: Form) => {
    _searchByIdentity.fetch({force: true, clean: true}, form.identity).then(onFound)
  }

  useEffectFn(_searchByIdentity.error, toastError)

  return (
    <Panel title={m.couldYouPrecise}>
      <form onSubmit={handleSubmit(search)}>
        <PanelBody>
          <FormLayout required label={m.companyIdentityLabel}>
            <ScInput
              {...register('identity', {
                required: {value: true, message: m.required}
              })}
              fullWidth
              placeholder={m.companyIdentityPlaceholder}
            />
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
