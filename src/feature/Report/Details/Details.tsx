import React, {useEffect, useMemo, useState} from 'react'
import {Alert, Txt} from 'mui-extension'
import {useReportFlowContext} from '../ReportFlowContext'
import {DetailInput, DetailInputType, FileOrigin, ReportDraft, ReportTag, SubcategoryInput, UploadedFile} from '@signal-conso/signalconso-api-sdk-js'
import {ScDatepicker} from 'shared/Datepicker/Datepicker'
import {fnSwitch, mapFor} from '@alexandreannic/ts-utils/lib/common'
import {useI18n} from 'core/i18n'
import {Controller, useForm} from 'react-hook-form'
import {ReportFiles} from 'shared/UploadFile/ReportFiles'
import {StepperActions} from 'shared/Stepper/StepperActions'
import {FormLayout} from 'shared/FormLayout/FormLayout'
import {Animate} from 'shared/Animate/Animate'
import {Panel, PanelBody} from 'shared/Panel/Panel'
import {format, parse} from 'date-fns'
import {MenuItem} from '@mui/material'
import {ScRadioGroup, ScRadioGroupItem} from 'shared/RadioGroup'
import {ScSelect} from 'shared/Select/Select'
import {ScInput} from 'shared/Input/ScInput'
import {DetailsAlertProduitDangereux} from './DetailsAlertProduitDangereux'
import {last} from 'core/lodashNamedExport'
import {getDraftReportInputs} from './draftReportInputs'
import {appConfig} from 'conf/appConfig'
import {useStepperContext} from 'shared/Stepper/Stepper'
import {ControllerProps} from 'react-hook-form/dist/types/controller'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {DetailInputValues2} from 'core/model/ReportDraft'
import {DetailsSpecifyInput} from './DetailsSpecifyInput'
import {useAnalyticContext} from '../../../core/analytic/AnalyticContext'
import {EventCategories, ReportEventActions} from '../../../core/analytic/analytic'

const mapDateInput = ({value, onChange}: {value?: string, onChange: (_: string) => void}): {value?: Date, onChange: (_: Date) => void} => {
  return {
    value: value ? parse(value, appConfig.apiDateFormat, new Date()) : undefined,
    onChange: (_: Date) => onChange(format(_, appConfig.apiDateFormat))
  }
}

export class SpecifyFormUtils {
  static readonly keyword = '(à préciser)'
  static readonly getInputName = (index: number) => `${index}_specify`
  static readonly isSpecifyInputName = (name: string) => name.includes('_specify')
}

export const getSpecifyInputName = (index: number) => `${index}_specify`

export const isSpecifyInputName = (name: string) => name.includes('_specify')

export const Details = () => {
  const _reportFlow = useReportFlowContext()
  const _analytic = useAnalyticContext()
  const _stepper = useStepperContext()
  const draft = _reportFlow.reportDraft
  const inputs = useMemo(() => {
    if (draft.subcategories) {
      return getDraftReportInputs({subcategories: draft.subcategories, tags: draft.tags})
    }
  }, [draft.subcategories, draft.tags, draft.forwardToReponseConso])

  useEffect(() => {
    _reportFlow.setReportDraft(_ => ({..._, details: undefined}))
  }, [draft.subcategories, draft.tags, draft.forwardToReponseConso])

  if (!inputs || draft.employeeConsumer === undefined) {
    throw new Error(`This step should not be accessible ${draft.employeeConsumer} - ${JSON.stringify(inputs)}`)
  }
  return (
    <_Details
      initialValues={draft.details}
      initialFiles={draft.uploadedFiles}
      isTransmittable={ReportDraft.isTransmittableToPro(draft)}
      inputs={inputs}
      fileLabel={(last(draft.subcategories) as SubcategoryInput).fileLabel}
      employeeConsumer={draft.employeeConsumer}
      contractualDispute={draft.contractualDispute}
      tags={draft.tags ?? []}
      onSubmit={(detailInputValues, uploadedFiles) => {
        _reportFlow.setReportDraft(_ => ({..._, uploadedFiles, details: detailInputValues}))
        _stepper.next()
        _analytic.trackEvent(EventCategories.report, ReportEventActions.validateDetails)
      }}
    />
  )
}

export const _Details = ({
  initialValues,
  initialFiles,
  inputs,
  fileLabel,
  tags,
  isTransmittable,
  contractualDispute,
  employeeConsumer,
  onSubmit,
}: {
  inputs: DetailInput[]
  onSubmit: (values: DetailInputValues2, files?: UploadedFile[]) => void
  initialValues?: DetailInputValues2
  initialFiles?: UploadedFile[]
  fileLabel?: string
  isTransmittable?: boolean
  contractualDispute?: boolean
  employeeConsumer?: boolean
  tags?: ReportTag[]
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<undefined | UploadedFile[]>()
  const {m} = useI18n()
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: {errors},
  } = useForm<any>()

  useEffect(() => {
    if (initialValues) {
      const formValues = Object.keys(initialValues).reduce((acc, key) => ({...acc, [key]: initialValues[key] ?? ''}), {})
      reset(formValues)
    }
  }, [initialValues])
  useEffectFn(initialFiles, setUploadedFiles)

  return (
    <>
      <Animate autoScrollTo={false}>
        <Panel>
          <Alert gutterBottom type="warning">
            {isTransmittable ? (
              <>
                <span dangerouslySetInnerHTML={{__html: m.detailsTextAreaTransmittable}}/>
                {!contractualDispute && (
                  <span dangerouslySetInnerHTML={{__html: m.detailsTextAreaTransmittableAnonymous}}/>
                )}
              </>
            ) : (
              <>
                <span dangerouslySetInnerHTML={{__html: m.detailsTextAreaNotTransmittable}}/><br/>
                {employeeConsumer && (
                  <span dangerouslySetInnerHTML={{__html: m.detailsTextAreaEmployeeConsumer}}/>
                )}
              </>
            )}
          </Alert>
          {(tags ?? []).includes(ReportTag.ProduitDangereux) && (
            <DetailsAlertProduitDangereux/>
          )}

          <br/>

          {inputs.map((input, inputIndex) => (
            <FormLayout
              label={<span dangerouslySetInnerHTML={{__html: input.label}}/>}
              required={!input.optionnal}
              key={inputIndex}
              sx={{
                mb: 3,
              }}
            >
              {(() => {
                const controller = ({
                  defaultValue,
                  rules,
                  render,
                }: {
                  defaultValue?: string,
                  rules?: ControllerProps<any, any>['rules'],
                  render: ControllerProps<any, any>['render'],
                }) => {
                  return (
                    <Controller
                      control={control}
                      name={'' + inputIndex}
                      defaultValue={defaultValue ?? input.defaultValue}
                      // defaultValue={initialValues?.[inputIndex] ?? defaultValue ?? input.defaultValue ?? ''}
                      rules={{
                        required: {value: !input.optionnal, message: m.required + ' *'},
                        ...rules
                      }}
                      render={render}
                    />
                  )
                }
                const errorMessage = errors[inputIndex]?.message
                const hasErrors = !!errors[inputIndex]
                return fnSwitch(input.type, {
                  [DetailInputType.DATE_NOT_IN_FUTURE]: () => (
                    controller({
                      defaultValue: input.defaultValue === 'SYSDATE' ? format(new Date(), appConfig.apiDateFormat) : undefined,
                      render: ({field}) => (
                        <ScDatepicker
                          {...field}
                          {...mapDateInput(field)}
                          fullWidth placeholder={input.placeholder}
                          max={format(new Date(), 'yyyy-MM-dd')}
                          helperText={errorMessage}
                          error={hasErrors}
                        />
                      )
                    })
                  ),
                  [DetailInputType.DATE]: () => (
                    controller({
                      defaultValue: input.defaultValue === 'SYSDATE' ? format(new Date(), appConfig.apiDateFormat) : undefined,
                      render: ({field}) => (
                        <ScDatepicker
                          {...field}
                          {...mapDateInput(field)}
                          fullWidth placeholder={input.placeholder}
                          helperText={errorMessage}
                          error={hasErrors}
                        />
                      )
                    })
                  ),
                  [DetailInputType.TIMESLOT]: () => (
                    controller({
                      render: ({field}) => (
                        <ScSelect
                          {...field}
                          fullWidth
                          placeholder={input.placeholder}
                          helperText={errorMessage}
                          error={hasErrors}
                        >
                          {mapFor(24, i =>
                            <MenuItem key={i} value={`de ${i}h à ${i + 1}h`}>
                              {m.timeFromTo(i, i + 1)}
                            </MenuItem>
                          )}
                        </ScSelect>
                      )
                    })
                  ),
                  [DetailInputType.RADIO]: () => (
                    controller({
                      render: ({field}) => (
                        <ScRadioGroup
                          {...field}
                          sx={{mt: 1}} dense
                          helperText={errorMessage}
                          error={hasErrors}
                        >
                          {input.options?.map((option, i) =>
                            <ScRadioGroupItem
                              key={option}
                              value={option}
                              title={<span dangerouslySetInnerHTML={{__html: option}}/>}
                              description={
                                (field.value === option && option.includes(SpecifyFormUtils.keyword))
                                  ? <DetailsSpecifyInput
                                    control={control}
                                    error={errors[SpecifyFormUtils.getInputName(inputIndex)]}
                                    defaultValue={initialValues?.[SpecifyFormUtils.getInputName(inputIndex)]}
                                    name={SpecifyFormUtils.getInputName(inputIndex)}
                                  />
                                  : undefined
                              }
                            />
                          )}
                        </ScRadioGroup>
                      )
                    })
                  ),
                  [DetailInputType.CHECKBOX]: () => (
                    controller({
                        render: ({field}) => (
                          <ScRadioGroup
                            {...field}
                            multiple
                            helperText={errorMessage}
                            error={hasErrors}
                            sx={{mt: 1}} dense
                          >
                            {input.options?.map(option =>
                              <ScRadioGroupItem
                                key={option}
                                value={option}
                                title={<span dangerouslySetInnerHTML={{__html: option}}/>}
                                description={
                                  ((field.value as string[] | undefined)?.includes(option) && option.includes(SpecifyFormUtils.keyword))
                                    ? <DetailsSpecifyInput
                                      control={control}
                                      error={errors[SpecifyFormUtils.getInputName(inputIndex)]}
                                      defaultValue={initialValues?.[SpecifyFormUtils.getInputName(inputIndex)]}
                                      name={SpecifyFormUtils.getInputName(inputIndex)}
                                    />
                                    : undefined
                                }
                              />
                            )}
                          </ScRadioGroup>
                        )
                      }
                    )
                  ),
                  [DetailInputType.TEXT]: () => (
                    controller({
                      rules: {
                        maxLength: {value: appConfig.maxDescriptionInputLength, message: ''},
                      },
                      render: ({field}) => (
                        <ScInput
                          {...field}
                          error={hasErrors}
                          fullWidth
                          placeholder={input.placeholder}
                        />
                      )
                    })
                  )
                }, () => (
                  controller({
                    rules: {
                      maxLength: {value: appConfig.maxDescriptionInputLength, message: ''},
                    },
                    render: ({field}) => (
                      <ScInput
                        {...field}
                        helperText={errors[inputIndex]?.type === 'required' ? m.required : `${getValues('' + inputIndex)?.length ?? 0} / ${appConfig.maxDescriptionInputLength}`}
                        error={hasErrors}
                        multiline
                        minRows={5} maxRows={10} fullWidth placeholder={input.placeholder}
                      />
                    )
                  })
                ))
              })()}
            </FormLayout>
          ))}
        </Panel>
      </Animate>
      <Animate autoScrollTo={false}>
        <Panel title={fileLabel ?? m.attachments}>
          <PanelBody>
            {ReportDraft.isTransmittableToPro({tags, employeeConsumer}) && (
              <>
                {!contractualDispute && (
                  <Txt color="hint" block gutterBottom dangerouslySetInnerHTML={{__html: m.attachmentsDescAnonymous}}/>
                )}
                <Alert dense type="info" sx={{mb: 2}} deletable persistentDelete>
                  <Txt size="small" dangerouslySetInnerHTML={{__html: m.attachmentsDesc2}}/>
                </Alert>
              </>
            )}

            <ReportFiles
              files={uploadedFiles}
              fileOrigin={FileOrigin.Consumer}
              onRemoveFile={f => setUploadedFiles(files => files?.filter(_ => _.id !== f.id))}
              onNewFile={f => setUploadedFiles(_ => [...(_ ?? []), f])}
            />
          </PanelBody>
        </Panel>
      </Animate>
      <StepperActions next={() => {
        handleSubmit(f => onSubmit(f, uploadedFiles))()
      }}/>
    </>
  )
}
