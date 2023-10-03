import {ScDatepickerNew} from 'components_simple/formInputs/ScDatepicker'
import {ScPrecisionInput} from 'components_simple/formInputs/ScPrecisionInput'
import {ScSelect} from 'components_simple/formInputs/ScSelect'
import {ScTextInput} from 'components_simple/formInputs/ScTextInput'
import {ScTextarea} from 'components_simple/formInputs/ScTextarea'
import {appConfig} from 'core/appConfig'
import {useI18n} from 'i18n/I18n'
import {DetailInputValues2} from 'model/ReportDraft2'
import {Control, Controller, FieldErrors, UseFormGetValues, UseFormRegister} from 'react-hook-form'
import {dateToIsoFormatWithoutTime, isDateInRange} from 'utils/utils'
import {DetailInput, DetailInputType} from '../../../anomalies/Anomaly'
import {ScCheckbox} from '../../../components_simple/formInputs/ScCheckbox'
import {ScRadioButtons} from '../../../components_simple/formInputs/ScRadioButtons'
import {getOptionsFromInput, getPlaceholderFromInput} from './DetailInputsUtils'
import {SpecifyFormUtils} from './Details'

export function DetailsInputRenderByType({
  register,
  control,
  inputIndex,
  input,
  errors,
  getValues,
}: {
  // we currently have a mix of controlled and uncontrolled components here
  // so we use either register or control
  register: UseFormRegister<DetailInputValues2>
  control: Control<DetailInputValues2>
  inputIndex: number
  input: DetailInput
  errors: FieldErrors<DetailInputValues2>
  getValues: UseFormGetValues<DetailInputValues2>
}) {
  const {m} = useI18n()
  const name = inputIndex.toString()
  const label = <span dangerouslySetInnerHTML={{__html: input.label}} />
  const required = !input.optional
  const baseRules = {required: {value: required, message: m.required + ' *'}}
  const specifyInputRules = {required: {value: true, message: m.required + ' *'}}
  const maxLengthRule = {maxLength: {value: appConfig.maxDescriptionInputLength, message: ''}}
  const errorMessage = errors[inputIndex]?.message
  const hasErrors = !!errors[inputIndex]
  // for most input types, the value can only be a string
  const unsafeRegisterForStringsOnly = register as UseFormRegister<{[key: string]: string}>
  const unsafeControlForStringsOnly = control as Control<{[key: string]: string}>
  // for checkboxes it can be only string[]
  const unsafeRegisterForArrayStringsOnly = register as UseFormRegister<{[key: string]: string[]}>
  const unsafeControlForArrayStringsOnly = control as Control<{[key: string]: string[]}>
  const fieldLabelProps = {
    label,
    required,
    className: 'mb-4',
  }

  const renderDateVariant = ({max}: {max: string}) => {
    const min = '1970-01-01'
    return (
      <ScDatepickerNew
        {...unsafeRegisterForStringsOnly(name, {
          ...baseRules,
          validate: d => {
            return isDateInRange(d, min, max) ? true : m.invalidDate
          },
        })}
        label={label}
        placeholder={getPlaceholderFromInput(input)}
        min={min}
        max={max}
        helperText={errorMessage}
        error={hasErrors}
        required={required}
      />
    )
  }

  switch (input.type) {
    case DetailInputType.DATE_NOT_IN_FUTURE:
      return renderDateVariant({
        max: dateToIsoFormatWithoutTime(new Date()),
      })
    case DetailInputType.DATE:
      return renderDateVariant({
        max: '2100-01-01',
      })
    case DetailInputType.TIMESLOT:
      return (
        <ScSelect
          label={label}
          {...unsafeRegisterForStringsOnly(name, baseRules)}
          required={required}
          helperText={errorMessage}
          error={hasErrors}
          options={[...new Array(24)].map((_, i) => {
            return {key: `de ${i}h à ${i + 1}h`, label: m.timeFromTo(i, i + 1)}
          })}
        />
      )
    case DetailInputType.RADIO:
      return (
        <Controller
          control={control}
          name={inputIndex.toString()}
          rules={baseRules}
          render={({field}) => (
            <ScRadioButtons
              {...field}
              title={label}
              titleSoberStyle
              required={required}
              errorMessage={errorMessage}
              error={hasErrors}
              options={
                getOptionsFromInput(input)?.map(option => {
                  const specifyName = SpecifyFormUtils.getInputName(inputIndex)
                  return {
                    label: <span dangerouslySetInnerHTML={{__html: option}} />,
                    value: option,
                    specify:
                      field.value === option && SpecifyFormUtils.hasSpecifyKeyword(option) ? (
                        <ScPrecisionInput
                          {...register(specifyName, specifyInputRules)}
                          error={!!errors[specifyName]}
                          helperText={errors[specifyName]?.message}
                          required
                        />
                      ) : undefined,
                  }
                }) ?? []
              }
            />
          )}
        />
      )
    case DetailInputType.CHECKBOX:
      return (
        <Controller
          control={unsafeControlForArrayStringsOnly}
          {...{name}}
          rules={baseRules}
          render={({field}) => (
            <ScCheckbox
              {...field}
              title={label}
              titleSoberStyle
              required={required}
              options={
                getOptionsFromInput(input)?.map(option => {
                  const specifyName = SpecifyFormUtils.getInputName(inputIndex)
                  return {
                    label: <span dangerouslySetInnerHTML={{__html: option}} />,
                    value: option,
                    specify:
                      (field.value as string[] | undefined)?.includes(option) && SpecifyFormUtils.hasSpecifyKeyword(option) ? (
                        <ScPrecisionInput
                          {...register(specifyName, specifyInputRules)}
                          error={!!errors[specifyName]}
                          helperText={errors[specifyName]?.message}
                          required
                        />
                      ) : undefined,
                  }
                }) ?? []
              }
            />
          )}
        />
      )
    case DetailInputType.TEXT:
      return (
        <ScTextInput
          label={fieldLabelProps.label}
          {...register(name, {...baseRules, ...maxLengthRule})}
          helperText={errors[inputIndex]?.type === 'required' ? m.required : null}
          error={hasErrors}
          placeholder={getPlaceholderFromInput(input)}
          required={required}
        />
      )
    case DetailInputType.TEXTAREA:
      return (
        <ScTextarea
          label={fieldLabelProps.label}
          {...register(name, {...baseRules, ...maxLengthRule})}
          helperText={
            errors[inputIndex]?.type === 'required' ? (
              m.required
            ) : (
              <span>
                {getValues('' + inputIndex)?.length ?? 0} / {appConfig.maxDescriptionInputLength}
                <span> {m.charactersTyped}</span>
              </span>
            )
          }
          error={hasErrors}
          placeholder={getPlaceholderFromInput(input)}
          required={required}
        />
      )
  }
}