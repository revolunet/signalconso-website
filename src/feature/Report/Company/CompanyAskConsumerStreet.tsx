import {useI18n} from '../../../core/i18n'
import {useForm} from 'react-hook-form'
import {Panel, PanelActions, PanelBody} from '../../../shared/Panel/Panel'
import {ScInput} from '../../../shared/Input/ScInput'
import {FormLayout} from '../../../shared/FormLayout/FormLayout'
import React from 'react'
import {ScButton} from '../../../shared/Button/Button'
import {Animate} from '../../../shared/Animate/Animate'

interface Form {
  street: string
  postalCode: string
}

interface Props {
  autoScrollTo?: boolean
animate?: boolean
  value?: Form
  onChange: (_: Form) => void
}

export const CompanyAskConsumerStreet = ({autoScrollTo, animate, value, onChange}: Props) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit
  } = useForm<Form>()

  return (
    <Animate autoScrollTo={autoScrollTo} animate={animate}>
      <Panel title={m.couldYouPrecise}>
        <form onSubmit={handleSubmit(onChange)}>
          <PanelBody>
            <FormLayout required label={m.yourPostalCode} desc={m.yourPostalCodeDesc}>
              <ScInput
                defaultValue={value}
                {...register('street', {
                  required: {value: true, message: m.required}
                })}
                fullWidth
                placeholder={m.yourPostalCodePlaceholder}
              />
            </FormLayout>
            <FormLayout required label={m.yourPostalCode} desc={m.yourPostalCodeDesc}>
              <ScInput
                defaultValue={value}
                {...register('postalCode', {
                  required: {value: true, message: m.required}
                })}
                fullWidth
                placeholder={m.yourPostalCodePlaceholder}
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
    </Animate>
  )
}
