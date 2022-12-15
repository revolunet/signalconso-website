import {useI18n} from 'i18n/I18n'
import {FormLayout} from 'components_simple/FormLayout/FormLayout'
import {Controller, useForm} from 'react-hook-form'
import {ScInput} from 'components_simple/Input/ScInput'
import {Panel, PanelActions, PanelBody} from 'components_simple/Panel/Panel'
import {Animate} from 'components_simple/Animate/Animate'
import {Autocomplete, Box} from '@mui/material'
import {useConstantContext} from 'context/ConstantContext'
import React, {useEffect} from 'react'
import {useToast} from 'hooks/useToast'
import {StepperActionsNext} from 'components_simple/ReportFlowStepper/StepperActionsNext'
import {Txt} from '../../../alexlibs/mui-extension/Txt/Txt'
import {Alert} from '../../../alexlibs/mui-extension/Alert/Alert'
import {Country} from '../../../model/Country'

interface Form {
  name: string
  country: Country
  postalCode: string
}

interface Props {
  onSubmit: (form: Form) => void
}

const countryToFlag = (isoCode: string) => {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode
}

export const CompanyAskForeignDetails = ({onSubmit}: Props) => {
  const {m} = useI18n()
  const {countries} = useConstantContext()
  const {toastError} = useToast()
  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<Form>()

  useEffect(() => {
    countries.fetch({force: false, clean: false})
  }, [])
  useEffect(() => {
    if (countries.error) toastError(countries.error)
  }, [countries.error])

  return (
    <Animate>
      <Panel title={m.couldYouPrecise} id="CompanyAskForeignDetails">
        <form onSubmit={handleSubmit(onSubmit)}>
          <PanelBody>
            <FormLayout required label={m.reportedCompanyName}>
              <ScInput
                error={!!errors.name}
                helperText={errors.name?.message ?? ''}
                placeholder={m.reportedCompanyNamePlaceholder}
                fullWidth
                {...register('name', {
                  required: {value: true, message: m.required},
                })}
              />
            </FormLayout>
            <FormLayout required label={m.country}>
              <Controller
                name="country"
                control={control}
                rules={{
                  required: {value: true, message: m.required},
                }}
                render={({field}) => (
                  <Autocomplete<Country>
                    {...field}
                    onChange={(e, data) => field.onChange(data)}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box component="span" sx={{mr: 2, fontSize: 24}}>
                          {countryToFlag(option.code)}
                        </Box>{' '}
                        {option.name}
                      </li>
                    )}
                    loading={countries.loading}
                    options={countries.entity ?? []}
                    getOptionLabel={_ => _.name}
                    renderInput={params => (
                      <ScInput
                        {...params}
                        error={!!errors.country}
                        helperText={(errors.country as any)?.message ?? ''}
                        placeholder={m.countryPlaceholder}
                        fullWidth
                      />
                    )}
                  />
                )}
              />
            </FormLayout>
            <br />
            <Alert dense type="info" sx={{mb: 2}} deletable>
              <Txt size="small" dangerouslySetInnerHTML={{__html: m.cantIdentifyCompany}} />
            </Alert>
            <FormLayout required label={m.yourPostalCode}>
              <ScInput
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message ?? ''}
                placeholder={m.yourPostalCodePlaceholder}
                fullWidth
                {...register('postalCode', {
                  required: {value: true, message: m.required},
                })}
              />
            </FormLayout>
          </PanelBody>

          <PanelActions>
            <StepperActionsNext type="submit" />
          </PanelActions>
        </form>
      </Panel>
    </Animate>
  )
}