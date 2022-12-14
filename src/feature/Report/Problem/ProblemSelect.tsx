import {Box, useTheme} from '@mui/material'
import {ScRadioGroup, ScRadioGroupItem} from 'shared/RadioGroup'
import React from 'react'
import {Panel, PanelBody, PanelProps} from 'shared/Panel/Panel'
import {Animate} from 'shared/Animate/Animate'

interface ProblemSelectProps<T> extends Omit<PanelProps, 'onChange'> {
  autoScrollToPanel?: boolean
  title?: string
  value?: T
  onChange: (_: T) => void
  options: {
    title: string
    description?: string
    value: T
  }[]
}

export const ProblemSelect = <T,>({autoScrollToPanel, title, value, options, onChange, ...other}: ProblemSelectProps<T>) => {
  const t = useTheme()
  return (
    <Animate autoScrollTo={autoScrollToPanel}>
      <Panel
        sx={{position: 'relative', border: 'none !important', paddingTop: t => t.spacing(1) + ' !important'}}
        title={<span dangerouslySetInnerHTML={{__html: title ?? 'Pouvez-vous préciser ?'}} />}
        {...other}
      >
        <Box sx={{position: 'absolute', top: -90, display: 'block'}} />
        <PanelBody>
          <ScRadioGroup value={value} onChange={onChange} sx={{mb: 2}}>
            {options.map(option => (
              <ScRadioGroupItem
                key={option.value + ''}
                value={option.value}
                title={option.title}
                description={option.description}
              />
            ))}
          </ScRadioGroup>
        </PanelBody>
      </Panel>
    </Animate>
  )
}
