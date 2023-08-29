import {Panel, PanelActions, PanelBody} from 'components_simple/Panel'
import {useI18n} from 'i18n/I18n'
import React from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Country, countryLabel} from '../../../model/Country'
import {BtnNextSubmit} from 'components_simple/Buttons'
import {ScRadioButtons} from '../../../components_simple/formInputs/ScRadioButtons'

interface Props {
  countries: Country[]
  onSubmit: (country: string) => void
}

interface Form {
  country: string
}

export const CompanyWebsiteCountry = ({countries, onSubmit}: Props) => {
  const {m, currentLang} = useI18n()
  const {handleSubmit, register, control} = useForm<Form>()
  return (
    <Panel title={m.companySelectCountryTitle}>
      <form onSubmit={handleSubmit(f => onSubmit(f.country))}>
        <PanelBody>
          <Controller
            control={control}
            name="country"
            defaultValue={countries.length === 1 ? countries[0].name : undefined}
            rules={{
              required: {value: true, message: m.required + ' *'},
            }}
            render={({field}) => (
              <ScRadioButtons
                {...field}
                options={countries.map(_ => {
                  return {
                    label: countryLabel(currentLang, _),
                    value: _.name,
                  }
                })}
              />
            )}
          />
        </PanelBody>
        <PanelActions>
          <BtnNextSubmit />
        </PanelActions>
      </form>
    </Panel>
  )
}