import React, {ReactNode, useEffect, useState} from 'react'
import {Box, BoxProps, Collapse, Icon} from '@mui/material'
import {Txt} from 'mui-extension'

interface Props extends BoxProps {
  label: ReactNode
  children: ReactNode
  open?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Accordion = ({open, label, children, onClick, ...props}: Props) => {
  const [innerOpen, setInnerOpen] = useState<boolean>()
  useEffect(() => {
    setInnerOpen(open)
  }, [open])

  return (
    <Box {...props}>
      <Txt
        link
        style={{display: 'flex', alignItems: 'center'}}
        sx={{
          '&:hover': {
            textDecoration: 'underline',
          }
        }}
        onClick={(e) => {
          onClick(e)
          setInnerOpen(_ => !_)
        }}
      >
        {label}
        <Icon sx={{ml: 1}} fontSize="small">{innerOpen ? 'expand_less' : 'expand_more'}</Icon>
      </Txt>
      <Collapse in={innerOpen}>
        {children}
      </Collapse>
    </Box>
  )
}
