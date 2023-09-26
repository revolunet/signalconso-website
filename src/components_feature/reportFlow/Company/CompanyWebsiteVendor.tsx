import Button from '@codegouvfr/react-dsfr/Button'
import {Animate} from 'components_simple/Animate'
import {Panel, PanelActions, PanelBody} from 'components_simple/Panel'
import {ScTextInput} from 'components_simple/formInputs/ScTextInput'
import {useI18n} from 'i18n/I18n'
import {useForm} from 'react-hook-form'
import {ScAlert} from '../../../components_simple/ScAlert'

interface Form {
  websiteVendor: string
}

interface Props {
  onSubmit: (_: string) => void
}

export const CompanyWebsiteVendor = ({onSubmit}: Props) => {
  const {m} = useI18n()
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<Form>()
  return (
    <Animate>
      <Panel title={m.companyWebsiteVendorTitle}>
        <form onSubmit={handleSubmit(form => onSubmit(form.websiteVendor))}>
          <PanelBody>
            <ScAlert type="info">
              <p>{m.companyWebsiteVendorAlert}</p>
            </ScAlert>
            <ScTextInput
              label={m.companyWebsiteVendorLabel}
              error={!!errors.websiteVendor}
              helperText={errors.websiteVendor?.message ?? ''}
              {...register('websiteVendor', {
                required: {value: true, message: m.required},
              })}
              required
            />
          </PanelBody>
          <PanelActions>
            <Button type="submit">{m.continue}</Button>
          </PanelActions>
        </form>
      </Panel>
    </Animate>
  )
}
