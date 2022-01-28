import * as React from 'react'
import {Page as MuiPage} from 'mui-extension'
import {Box, LinearProgress} from '@mui/material'
import {PageProps as MuiPageProps} from 'mui-extension/lib/Page/Page'

export const pageWidth = {
  large: 1100,
  regular: 932,
  small: 680,
}

export interface PageProps extends MuiPageProps {
  large?: boolean
  size?: 'large' | 'small' | 'regular'
  loading?: boolean
}

export const Page = ({className, loading, size, sx, ...props}: PageProps) => {
  return (
    <>
      {loading && (
        <Box sx={{position: 'relative'}}>
          <LinearProgress sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
          }}/>
        </Box>
      )}
      <MuiPage width={pageWidth[size ?? 'regular']} sx={{...sx, py: 3, px: 2}} {...props} />
    </>
  )
}
