import {useI18n} from '../../../core/i18n'
import {FormLayout} from '../../../shared/FormLayout/FormLayout'
import {useForm} from 'react-hook-form'
import {ScInput} from '../../../shared/Input/ScInput'
import {Panel, PanelActions, PanelBody} from '../../../shared/Panel/Panel'
import {useApiSdk} from '../../../core/context/ApiSdk'
import {useToast} from '../../../core/toast'
import {useEffectFn, useFetcher} from '@alexandreannic/react-hooks-lib'
import {ScButton} from '../../../shared/Button/Button'
import {CompanySearchResult} from '@signal-conso/signalconso-api-sdk-js'
import {Txt} from 'mui-extension'
import {Animate} from '../../../shared/Animate/Animate'
import {ReactNode} from 'react'
import {map} from '../../../core/helper/utils'

interface Form {
  name: string
  postalCode: string
}

interface Props {
  children: (companies?: CompanySearchResult[]) => ReactNode
  onReportForeignCompany: () => void
}

export const CompanySearchByNameAndPostalCode = ({children, onReportForeignCompany}: Props) => {
  const {m} = useI18n()
  const {apiSdk} = useApiSdk()
  const {toastError} = useToast()
  const _search = useFetcher(apiSdk.company.searchCompanies)
  const {
    handleSubmit,
    register,
    reset,
    formState: {errors}
  } = useForm<Form>()

  const search = (form: Form) => {
    _search.fetch({force: true, clean: true}, form.name, form.postalCode)
  }

  useEffectFn(_search.error, toastError)

  return (
    <>
      <Animate>
        <Panel title={m.couldYouPrecise} id="CompanyByNameAndPostalCode">
          <Txt color="hint">{m.youCanOnlyReportFrenchCompanies} &nbsp;</Txt>
          <Txt link onClick={onReportForeignCompany}>{m.reportForeignCompany}</Txt>
          <form onSubmit={handleSubmit(search)}>
            <PanelBody>
              <FormLayout required label={m.reportedCompanyName}>
                <ScInput
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name', {
                    required: {value: true, message: m.required},
                  })}
                />
              </FormLayout>
              <FormLayout required label={m.postalCode}>
                <ScInput
                  fullWidth
                  error={!!errors.postalCode}
                  helperText={errors.postalCode?.message}
                  {...register('postalCode', {
                    required: {value: true, message: m.required},
                  })}
                />
              </FormLayout>
            </PanelBody>

            <PanelActions>
              <ScButton color="primary" variant="contained" icon="search" type="submit" loading={_search.loading}>
                {m.search}
              </ScButton>
            </PanelActions>
          </form>
        </Panel>
      </Animate>
      {map(_search.entity, children)}
    </>
  )
}
