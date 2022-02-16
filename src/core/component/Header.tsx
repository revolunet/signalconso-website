import {ReactNode} from 'react'
import Link from 'next/link'
import {siteMap} from '../siteMap'
import {Box, useScrollTrigger, useTheme} from '@mui/material'
import {styleUtils} from '../theme/theme'
import {ScButton} from '../../shared/Button/Button'
import {useI18n} from '../i18n'
import {appConfig} from '../../conf/appConfig'
import {BtnAdmin} from './BtnAdmin'

interface HeaderItemProps {
  href: string
  children: ReactNode
}

const HeaderItem = ({href, children}: HeaderItemProps) => {
  const theme = useTheme()
  return (
    <Link href={href}>
      <ScButton style={{
        padding: theme.spacing(1),
        fontSize: styleUtils(theme).fontSize.big,
        marginLeft: theme.spacing(1),
        textTransform: 'unset',
        color: 'inherit',
        paddingTop: 0,
        paddingBottom: 0,
      }}>
        {children}
      </ScButton>
    </Link>
  )
}

export const headerHeight = {
  normal: 132,
  compact: 52,
}

export const Header = () => {
  const theme = useTheme()
  const {m} = useI18n()
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: headerHeight.normal - headerHeight.compact,
  })

  return (
    <Box component="header" sx={{
      overflow: 'hidden',
      background: t => t.palette.background.paper,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      py: 1,
      px: 2,
      height: headerHeight.normal,
      ...scrolled && {
        height: headerHeight.compact,
        position: 'fixed',
        boxShadow: t => t.shadows[4],
      }
    }}>
      {scrolled ? (
        <img
          style={{height: 38, marginRight: theme.spacing(3)}}
          src="/image/gouv-mobile.svg"
          alt={m.logoAltGouv}
        />
      ) : (
        <img
          style={{height: 110, marginRight: theme.spacing(3)}}
          src="/image/gouv.svg"
          alt={m.logoAltGouv}
        />
      )}
      <Link href={siteMap.index}>
        <a>
          <img style={{height: scrolled ? 40 : 60}} src="/image/logo-signalconso.svg" alt={m.logoAltSignalconso}/>
        </a>
      </Link>

      <nav style={{marginLeft: 'auto', display: 'flex', alignItems: 'center'}}>
        <ul style={{listStyle: 'none', display: 'flex', alignItems: 'center', margin: 0}}>
          {appConfig.isDev && (
            <li><HeaderItem href={siteMap.playground}>Playground</HeaderItem></li>
          )}
          <li><HeaderItem href={siteMap.index}>{m.menu_home}</HeaderItem></li>
          <li><HeaderItem href={siteMap.howItWorks}>{m.menu_howItWorks}</HeaderItem></li>
          <li><HeaderItem href={siteMap.help}>{m.menu_help}</HeaderItem></li>
          <li>
            <BtnAdmin sx={{ml: 1}}/>
          </li>
        </ul>
      </nav>
    </Box>
  )
}
