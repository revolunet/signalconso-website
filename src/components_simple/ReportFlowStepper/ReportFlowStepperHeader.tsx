import React from 'react'
import {alpha, Box, BoxProps, Theme} from '@mui/material'
import {useWindowWidth} from 'hooks/useWindowWidth'
import {styleUtils} from 'core/theme'
import {fnSwitch} from '../../utils/FnSwitch'
import {SxProps} from '@mui/system'
import {indexToStepOrDone, ReportStepOrDone, stepToIndex} from 'model/ReportStep'
import {useI18n} from 'i18n/I18n'

interface StepperHeaderProps extends BoxProps {
  currentStep: ReportStepOrDone
  goTo?: (step: ReportStepOrDone) => void
  stepSize?: number
  stepMargin?: number
  hideLabel?: boolean
}

type StepState = 'done' | 'current' | 'not_done'

export const ReportFlowStepperHeader = ({
  sx,
  currentStep,
  goTo,
  stepSize = 32,
  stepMargin = 8,
  hideLabel,
}: StepperHeaderProps) => {
  const {m} = useI18n()
  // TODO virer l'usage des indexes
  const currentStepIndex = stepToIndex(currentStep)

  const goToWithIndex =
    goTo &&
    ((idx: number) => {
      goTo(indexToStepOrDone(idx))
    })
  const stepsLabels = [m.step_problem, m.step_description, m.step_company, m.step_consumer, m.step_confirm]
  const isDone = currentStepIndex >= stepsLabels.length
  const {isMobileWidthMax} = useWindowWidth()
  return (
    <Box
      sx={{
        display: 'flex',
        mb: 4,
        justifyContent: 'center',
        ...sx,
      }}
    >
      {stepsLabels.map((step, i) => {
        const state: StepState = currentStepIndex > i ? 'done' : currentStepIndex === i ? 'current' : 'not_done'
        return (
          <Box
            key={step}
            sx={{flex: 1}}
            onClick={goToWithIndex ? () => i < currentStepIndex && !isDone && goToWithIndex(i) : undefined}
          >
            <Box
              sx={{
                ...(goTo && {
                  cursor: state === 'not_done' || isDone ? 'not-allowed' : 'pointer',
                }),
                display: 'flex',
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {i > 0 && (
                <Box
                  sx={{
                    display: 'block',
                    position: 'absolute',
                    top: stepSize / 2 - 1,
                    left: `calc(-50% + ${stepSize / 2 + stepMargin}px)`,
                    right: `calc(50% + ${stepSize / 2 + stepMargin}px)`,
                    ...(state === 'not_done'
                      ? {
                          borderTop: (t: Theme) => '2px solid ' + t.palette.divider,
                        }
                      : {
                          borderTop: (t: Theme) => '2px solid ' + t.palette.success.light,
                        }),
                  }}
                />
              )}
              <Box
                sx={{
                  height: stepSize,
                  width: stepSize,
                  borderRadius: stepSize,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: t => t.typography.fontWeightBold,
                  ...(stepSize <= 30 && {
                    fontSize: t => styleUtils(t).fontSize.small,
                  }),
                  justifyContent: 'center',
                  transition: t => t.transitions.create('all'),
                  mr: 1,
                  ml: 1,
                  ...fnSwitch<StepState, SxProps<Theme>>(state, {
                    done: {
                      background: t => t.palette.success.light,
                      color: t => t.palette.success.contrastText,
                    },
                    current: {
                      boxShadow: t => `0px 0px 0px ${stepSize > 30 ? 4 : 2}px ${alpha(t.palette.primary.main, 0.3)}`,
                      color: t => t.palette.primary.contrastText,
                      bgcolor: 'primary.main',
                    },
                    not_done: {
                      border: t => `2px solid ${t.palette.divider}`,
                      color: t => t.palette.text.disabled,
                    },
                  }),
                }}
              >
                {i + 1}
              </Box>
              {!hideLabel && (!isMobileWidthMax || step === 'current') && (
                <Box
                  sx={{
                    mt: 1,
                    textAlign: 'center',
                    ...fnSwitch<StepState, SxProps<Theme>>(
                      state,
                      {
                        current: {
                          fontWeight: t => t.typography.fontWeightBold,
                        },
                        not_done: {
                          color: t => t.palette.text.disabled,
                        },
                      },
                      () => ({}),
                    ),
                  }}
                >
                  {step}
                </Box>
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
