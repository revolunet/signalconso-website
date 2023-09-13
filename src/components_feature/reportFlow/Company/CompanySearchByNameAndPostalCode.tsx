import {useQuery} from '@tanstack/react-query'
import {useAnalyticContext} from 'analytic/AnalyticContext'
import {CompanySearchEventActions, EventCategories} from 'analytic/analytic'
import {useToastOnQueryError} from 'clients/apiHooks'
import {Animate} from 'components_simple/Animate'
import {AutocompleteCity} from 'components_simple/AutocompleteCity'
import {ButtonWithLoader} from 'components_simple/Buttons'
import {FieldLabel} from 'components_simple/FieldLabel'
import {ScInput} from 'components_simple/formInputs/ScInput'
import {Panel, PanelActions, PanelBody} from 'components_simple/Panel'
import {useApiClients} from 'context/ApiClientsContext'
import {useI18n} from 'i18n/I18n'
import {ReactNode, useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Txt} from '../../../components_simple/Txt'
import {CompanySearchResult} from '../../../model/Company'
import {ifDefined} from '../../../utils/utils'

interface Form {
  name: string
  postalCode: string
}

interface Props {
  children: (companies?: CompanySearchResult[]) => ReactNode
}

export const CompanySearchByNameAndPostalCode = ({children}: Props) => {
  const {m, currentLang} = useI18n()
  const {companyApiClient} = useApiClients()
  const [submittedForm, setSubmittedForm] = useState<Form | undefined>()
  const _search = useQuery(['searchCompanies', submittedForm?.name, submittedForm?.postalCode], () => {
    if (submittedForm) {
      return companyApiClient.searchCompanies(submittedForm.name, submittedForm.postalCode, currentLang)
    }
    return null
  })
  useToastOnQueryError(_search)
  const _analytic = useAnalyticContext()
  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<Form>()

  const search = (form: Form) => {
    _analytic.trackEvent(EventCategories.companySearch, CompanySearchEventActions.search, form.name + ' ' + form.postalCode)
    setSubmittedForm(form)
  }
  return (
    <>
      <Animate>
        <Panel title={m.couldYouPrecise} id="CompanyByNameAndPostalCode">
          <p className="text-gray-600 mb-1">{m.youCanOnlyReportFrenchCompanies}</p>
          <form onSubmit={handleSubmit(search)}>
            <PanelBody>
              <FieldLabel required label={m.reportedCompanyName}>
                <ScInput
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name', {
                    required: {value: true, message: m.required},
                  })}
                />
              </FieldLabel>
              <FieldLabel required label={m.postalCode} desc={m.youCanSearchByCity}>
                <Controller
                  control={control}
                  name="postalCode"
                  rules={{
                    required: {value: true, message: m.required},
                  }}
                  render={({field}) => (
                    <AutocompleteCity
                      {...field}
                      onChange={x => field.onChange(x.postalCode)}
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message ?? ''}
                      fullWidth
                      placeholder={m.yourPostalCodePlaceholder}
                    />
                  )}
                />
              </FieldLabel>
            </PanelBody>

            <PanelActions>
              <ButtonWithLoader loading={_search.isLoading} iconId="fr-icon-search-line">
                {m.search}
              </ButtonWithLoader>
            </PanelActions>
          </form>
        </Panel>
      </Animate>
      {_search.data && ifDefined(_search.data, children)}
    </>
  )
}
