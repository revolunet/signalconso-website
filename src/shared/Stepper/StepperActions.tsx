import {Box} from '@mui/material'
import {useI18n} from '../../core/i18n'
import {ScButton} from '../Button/Button'
import {useStepperContext} from './Stepper'

interface Props {
  hideNext?: boolean
  hidePrev?: boolean
  loadingNext?: boolean
  loadingPrev?: boolean
  next?: (next: () => void) => void
  prev?: (prev: () => void) => void
}

export const StepperActions = ({hidePrev, hideNext, loadingNext, loadingPrev, next, prev}: Props) => {
  const {m} = useI18n()
  const _stepper = useStepperContext()
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3}}>
      {_stepper.currentStep > 0 && !hidePrev && (
        <ScButton loading={loadingPrev} sx={{marginRight: 'auto'}} onClick={prev ? () => prev(_stepper.prev) : _stepper.prev} color="primary" icon="keyboard_arrow_left">
          {m.previous}
        </ScButton>
      )}
      {!hideNext && (
        <ScButton id="btn-submit" loading={loadingNext} sx={{marginLeft: 'auto'}} onClick={next ? () => next(_stepper.next) : _stepper.next} color="primary" variant="contained"
                  iconAfter="keyboard_arrow_right">
          {m.next}
        </ScButton>
      )}
    </Box>
  )
}
