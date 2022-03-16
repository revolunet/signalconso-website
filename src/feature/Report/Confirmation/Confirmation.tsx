import {useReportFlowContext} from '../ReportFlowContext'
import {useI18n} from 'core/i18n'
import {Alert, Txt} from 'mui-extension'
import {Anomaly, FileOrigin, ReportDraft} from '@signal-conso/signalconso-api-sdk-js'
import {ConfirmationStep, ConfirmationStepper} from './ConfirmationStepper'
import {Animate} from 'shared/Animate/Animate'
import {Box, Chip, Icon} from '@mui/material'
import {AnomalyImage} from 'shared/AnomalyCard/AnomalyImage'
import {AddressComponent} from 'shared/Address/Address'
import {StepperActions} from 'shared/Stepper/StepperActions'
import {ReportDraft2} from 'core/model/ReportDraft'
import {ReportFiles} from 'shared/UploadFile/ReportFiles'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useToast} from 'core/toast'
import {Row} from 'shared/Row/Row'
import React from 'react'

// const Row = ({icon, dense, children, ...props}: {dense?: boolean, icon: string} & BoxProps) => {
//   return (
//     <Box sx={{display: 'flex', alignItems: 'center', mb: dense ? 1 : 2}} {...props}>
//       <Icon sx={{mr: dense ? 1 : 2, color: t => t.palette.text.disabled}}>{icon}</Icon>
//       {children}
//     </Box>
//   )
// }

export const Confirmation = ({}: {}) => {
  const _reportFlow = useReportFlowContext()
  const draft = _reportFlow.reportDraft as ReportDraft2
  const parsedDraft = ReportDraft2.toReportDraft(draft)
  return (
    <_Confirmation
      anomaly={draft.anomaly}
      draft={parsedDraft}
    />
  )
}

export const _Confirmation = ({
  draft,
  anomaly
}: {
  anomaly: Pick<Anomaly, 'sprite'>
  draft: ReportDraft,
}) => {
  const {m} = useI18n()
  const {toastError} = useToast()
  const _reportFlow = useReportFlowContext()

  useEffectFn(_reportFlow.createReport.error, toastError)

  return (
    <Animate autoScrollTo={true} animate={true}>
      <div>
        <Txt sx={{mb: 2}} block size="title">{m.confirmationTitle}</Txt>
        <Alert type="warning" sx={{mb: 2}}>
          {ReportDraft.isTransmittableToPro(draft) ? m.confirmationAlertTransmittable : m.confirmationAlert}
        </Alert>

        <ConfirmationStepper>
          <ConfirmationStep title={m.step_problem}>
            <Box sx={{display: 'flex'}}>
              <AnomalyImage anomaly={anomaly} sx={{mr: 2}}/>
              <Box>
                <Txt block size="big" bold sx={{mb: 1}}>{draft.category}</Txt>
                {draft.subcategories.map(_ =>
                  <Row dense icon="subdirectory_arrow_right" key={_.title}>{_.title}</Row>
                )}
              </Box>
            </Box>
          </ConfirmationStep>
          <ConfirmationStep title={m.step_description}>
            {draft.details.map(({label, value}) =>
              <Box key={label} sx={{mb: 1}}>
                <Txt block bold sx={{mr: 1}} dangerouslySetInnerHTML={{__html: label}}/>
                <Txt color="hint">{value}</Txt>
              </Box>
            )}
            <Box sx={{mb: 1}}>
              <Txt block bold sx={{mb: 1}}>{m.attachments}</Txt>
              <ReportFiles fileOrigin={FileOrigin.Consumer} hideAddBtn files={draft.uploadedFiles}/>
            </Box>
          </ConfirmationStep>
          <ConfirmationStep title={m.step_company}>
            <Txt size="big" bold block>{draft.companyDraft.name} {draft.companyDraft.brand ?? ''}</Txt>

            {draft.companyDraft.siret && (
              <Txt color="hint" block sx={{mb: 1}}>
                <Txt>SIRET:&nbsp;</Txt>
                <Txt bold>{draft.companyDraft.siret}</Txt>
              </Txt>
            )}
            <Row dense icon="location_on">
              <Txt color="hint">
                <AddressComponent address={draft.companyDraft.address}/>
              </Txt>
            </Row>
            {draft.companyDraft.website && (
              <Row dense icon="link">
                <Txt color="hint">{draft.companyDraft.website}</Txt>
              </Row>
            )}
            {draft.companyDraft.phone && (
              <Row dense icon="phone">
                <Txt color="hint">{draft.companyDraft.phone}</Txt>
              </Row>
            )}
          </ConfirmationStep>
          <ConfirmationStep title={m.step_consumer}>
            <Row icon="person">
              {draft.consumer.firstName}{' '}
              {draft.consumer.lastName}
            </Row>
            <Row icon="email">
              {draft.consumer.email}
            </Row>
            {draft.consumer.phone && (
              <Row icon="phone">
                {draft.consumer.phone}
              </Row>
            )}
            <Row icon="https">
              {m.contactAgreement}:&nbsp;
              <Txt bold>
                {draft.contactAgreement ? (
                  <Chip
                    size="small"
                    label={m.yes}
                    color="success"
                    variant="outlined"
                    icon={<Icon>check_circle</Icon>}
                  />
                ) : (
                  <Chip
                    size="small"
                    label={m.no}
                    color="error"
                    variant="outlined"
                    icon={<Icon>remove_circle</Icon>}
                  />
                )}
              </Txt>
            </Row>
          </ConfirmationStep>
        </ConfirmationStepper>
        <StepperActions
          nextIcon="send"
          loadingNext={_reportFlow.createReport.loading}
          nextButtonLabel={draft.forwardToReponseConso ? m.confirmationBtnReponseConso : m.confirmationBtn}
          next={next => {
            _reportFlow.createReport.fetch({}, draft)
              .then(_reportFlow.clearReportDraft)
              .then(next)
          }}
        />
      </div>
    </Animate>
  )
}
