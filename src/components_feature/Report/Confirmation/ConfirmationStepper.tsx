import {Box} from '@mui/material'
import {ScButton} from 'components_simple/Button/Button'
import {Panel, PanelBody} from 'components_simple/Panel/Panel'
import {useReportFlowStepperContext} from 'components_simple/ReportFlowStepper/ReportFlowStepper'
import {useI18n} from 'i18n/I18n'
import {indexToStepOrDone} from 'model/ReportStep'
import React, {ReactElement, ReactNode} from 'react'
import {Txt} from '../../../alexlibs/mui-extension/Txt/Txt'

interface ConfirmationStepperProps {
  children: Array<ReactElement<ConfirmationStepProps>>
}

interface ConfirmationStepProps {
  title?: ReactNode
  children?: ReactNode
  index?: number
}

export const ConfirmationStepper = ({children}: ConfirmationStepperProps) => {
  return <>{children.map((child, index) => React.cloneElement(child, {...child.props, key: index, index}))}</>
}

export const ConfirmationStep = ({title, children, index}: ConfirmationStepProps) => {
  const {m} = useI18n()
  const _stepper = useReportFlowStepperContext()
  return (
    <Panel
      title={
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Txt color="hint" sx={{mr: 1}}>
            {index! + 1}.
          </Txt>
          <Txt>{title}</Txt>
          <ScButton
            sx={{marginLeft: 'auto'}}
            size="small"
            variant="outlined"
            icon="edit"
            color="primary"
            onClick={() => {
              _stepper.goTo(indexToStepOrDone(index!))
            }}
          >
            {m.edit}
          </ScButton>
        </Box>
      }
    >
      <PanelBody>{children}</PanelBody>
    </Panel>
  )
}
