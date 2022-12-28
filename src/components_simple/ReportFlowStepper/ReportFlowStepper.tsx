import {Anomaly} from 'anomalies/Anomaly'
import {Company} from 'components_feature/Report/Company/Company'
import {Confirmation} from 'components_feature/Report/Confirmation/Confirmation'
import {Consumer} from 'components_feature/Report/Consumer/Consumer'
import {Details} from 'components_feature/Report/Details/Details'
import {Problem} from 'components_feature/Report/Problem/Problem'
import {useI18n} from 'i18n/I18n'
import {
  firstReportStep,
  getStepIndex,
  indexToStepOrDone,
  lastReportStep,
  ReportStep,
  reportSteps,
  stepToIndex,
} from 'model/ReportStep'
import React, {useContext, useEffect, useState} from 'react'
import {scrollTop} from 'utils/utils'
import {ReportFlowStepperHeader} from './ReportFlowStepperHeader'

interface StepperProps {
  initialStep: ReportStep
  anomaly: Anomaly
  onStepChange: (step: ReportStepOrDone) => void
  renderDone: () => JSX.Element
}

interface ReportFlowStepperContext {
  currentStep: ReportStepOrDone
  goTo: (step: ReportStepOrDone) => void
  next: () => void
  prev: () => void
}

// 'done' is like a special bonus step, not included in the original list
export type ReportStepOrDone = ReportStep | 'done'

export const ReportFlowStepperContext = React.createContext<ReportFlowStepperContext>({} as ReportFlowStepperContext)

export const ReportFlowStepper = ({anomaly, initialStep, renderDone, onStepChange}: StepperProps) => {
  const [currentStep, setCurrentStep] = useState<ReportStepOrDone>(initialStep)
  const {m} = useI18n()

  const steps: {
    label: string
    component: () => JSX.Element
  }[] = [
    {
      label: m.step_problem,
      component: () => <Problem anomaly={anomaly} />,
    },
    {
      label: m.step_description,
      component: () => <Details />,
    },
    {
      label: m.step_company,
      component: () => <Company />,
    },
    {
      label: m.step_consumer,
      component: () => <Consumer />,
    },
    {
      label: m.step_confirm,
      component: () => <Confirmation />,
    },
  ]

  const isDone = currentStep === 'done'

  useEffect(() => {
    onStepChange(currentStep)
  }, [currentStep])

  const DisplayedStep: () => JSX.Element = isDone ? renderDone : steps[getStepIndex(currentStep)].component

  const context = {
    currentStep,
    goTo: (step: ReportStepOrDone) => {
      if (isDone) return
      setCurrentStep(step)
      scrollTop()
    },
    next: () => {
      if (isDone) return
      const newStep = currentStep === lastReportStep ? 'done' : reportSteps[getStepIndex(currentStep) + 1]
      setCurrentStep(newStep)
      scrollTop()
    },
    prev: () => {
      if (isDone) return
      const newStep = currentStep === firstReportStep ? firstReportStep : reportSteps[getStepIndex(currentStep) - 1]
      setCurrentStep(newStep)
      scrollTop()
    },
  }

  // tmp, for retrocompat with lower components
  // TODO go lower and apply the change everywhere
  const currentStepIndex = stepToIndex(currentStep)
  function goToWithIndex(idx: number) {
    setCurrentStep(indexToStepOrDone(idx))
  }

  return (
    <ReportFlowStepperContext.Provider value={context}>
      <ReportFlowStepperHeader stepsLabels={steps.map(_ => _.label)} currentStep={currentStepIndex} goTo={goToWithIndex} />
      <DisplayedStep />
    </ReportFlowStepperContext.Provider>
  )
}

export const useReportFlowStepperContext = () => {
  return useContext<ReportFlowStepperContext>(ReportFlowStepperContext)
}
